import { NextRequest, NextResponse } from "next/server";
import * as CryptoJS from "crypto-js";
import EntityRayPoint from "@/common/entity/entityRayPoint";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge'

interface Query {

}

export async function GET(request: NextRequest, dynamicSegment?: string[]) {
  // 获取请求的 URL
  const { searchParams } = new URL(request.url);
  // 获取所有的查询参数
  let params = Object.fromEntries(searchParams.entries());

  const md5Vals = searchParams.getAll('md5'); // 获取所有相同名称的参数

  const db: D1Database = getRequestContext().env.MY_DB1;

  let qSql = `SELECT * FROM \`t_entity_ray_point\` WHERE delete_status=0 `;

  let arr: any = []

  if (md5Vals.length > 0) {
    qSql = `${qSql} and md5 in (${md5Vals.map(o => '?').join(",")})`
    arr = [
      ...arr,
      ...md5Vals
    ]
  }

  const status = params.status
  if (status) {
    qSql = `${qSql} and status= ?`
    arr = [
      ...arr,
      Number(status)
    ]
  }

  console.log("qSql", qSql)
  console.log("arr", arr)

  let stmt :D1PreparedStatement = db.prepare(qSql)
  if (arr.length > 0) {
    stmt = stmt.bind(...arr)
  }
  const { results } = await stmt.run();

  return NextResponse.json({ params, md5Vals, results }, { status: 200 });
}

interface Param {
  clean4Action: boolean,
  base64PointContent: string
}

export async function POST(request: NextRequest, params?: string[]) {
  const body: Param = await request.json();

  const base64Str = body.base64PointContent;

  const check = checkBase64Str(base64Str);
  if (!check) {
    return NextResponse.json({ "err": "base64字符串检测失败" }, { status: 200 });
  }

  let decode = atob(body.base64PointContent);

  const lines: string[] = decode.split(/\r\n|\r|\n/);

  let entityRayPoints: EntityRayPoint[] = lines.map((v, i) => {
    if (v == '') {
      return undefined;
    }
    const lines1: string[] = v.split("://");
    const content = lines1[1];
    let decode1 = atob(content);

    // const obj = JSON.parse(decode1);

    const entityRayPoint = new EntityRayPoint();
    entityRayPoint.id = i
    entityRayPoint.create_time = formatDate(new Date())
    entityRayPoint.md5 = CryptoJS.MD5(v).toString()
    entityRayPoint.md5_sub = CryptoJS.MD5(content).toString()
    entityRayPoint.point_type = lines1[0]
    entityRayPoint.context = content
    entityRayPoint.point_content = v
    entityRayPoint.remark = JSON.parse(decode1)

    return entityRayPoint
    // return { i, "md5": CryptoJS.MD5(v).toString(), "type": lines1[0], content, "contentParse": obj, v };
  }).filter(o => o != undefined)

  if (entityRayPoints.length <= 0) {
    return NextResponse.json({ "status": -1, "msg": "没有有效的节点信息" }, { status: 200 });
  }

  let md5Vals = entityRayPoints.map(o => o.md5)

  const db: D1Database = getRequestContext().env.MY_DB1;

  if (body.clean4Action) {
    const delRet = await db.exec('delete from `t_entity_ray_point`')
    console.log("数据删除", delRet)
  }

  const placeholder = entityRayPoints.map(o => '?').join(",")
  const qSql = `SELECT md5 total FROM \`t_entity_ray_point\` WHERE delete_status=0 and md5 in (${placeholder})`;
  const { results } = await db.prepare(qSql)
    .bind(...md5Vals)
    .run();

  const existsMd5List = results.map(o => o.total)

  entityRayPoints = entityRayPoints.filter(e => !existsMd5List.includes(e.md5));

  console.log("未存储的point数量:", entityRayPoints.length)

  // md5Vals = md5Vals.filter(o => o == undefined || (results.length > 0 && results.includes(o)))
  // if (md5Vals.length == 0) {
  //   return NextResponse.json({ "status": -1, "msg": "没有未存储的节点信息" }, { status: 200 });
  // }

  // \`id\`, \`create_time\`, \`update_time\`,
  // \`delete_status\`, \`status\`,
  const insertSql = `insert into t_entity_ray_point (
    \`create_user_id\`, \`last_modify_user_id\`,
    \`remark\`,
    \`md5\`,
    \`md5_sub\`,
    \`encryption_type\`,
    \`point_type\`,
    \`context\`,
    \`point_content\`,
    \`source_from\`
    ) values (?,?,?,?,?,?,?,?,?,?)`;

  const stmt = db.prepare(insertSql)

  const list: D1PreparedStatement[] = entityRayPoints.map(e => {
    const md5Val = e.md5
    if (md5Val != undefined && existsMd5List.includes(md5Val)) {
      return undefined
    }
    return stmt.bind(
      1, 1, JSON.stringify(e.remark),
      // e.md5, e.md5_sub, e.encryption_type, e.point_type, e.context, e.point_contect, e.source_from
      e.md5 !== undefined ? e.md5 : null, // 将 undefined 转换为 null
      e.md5_sub !== undefined ? e.md5_sub : null,
      e.encryption_type !== undefined ? e.encryption_type : null,
      e.point_type !== undefined ? e.point_type : null,
      e.context !== undefined ? e.context : null,
      e.point_content !== undefined ? e.point_content : null,
      e.source_from !== undefined ? e.source_from : null
    )
  }).filter(e => e !== undefined)

  if (list.length == 0) {
    return NextResponse.json({ "status": -1, "msg": "没有未存储的节点信息" }, { status: 200 });
  }

  const rows = await db.batch(list)

  return NextResponse.json(rows, { status: 200 });
}

export async function DELETE(request: NextRequest, par?: string[]) {
  const body = await request.json()

  // const db: D1Database = getRequestContext().env.MY_DB1;

  // const delRet = await db.exec('delete from `t_entity_ray_point`')
  return NextResponse.json(body, { status: 200 });
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function checkBase64Str(base64Str: string): boolean {
  if (base64Str == undefined || base64Str == null || base64Str == '' || base64Str.length % 4 > 0) {
    return false;
  }

  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Pattern.test(base64Str)) {
    return false;
  }

  return true;
}