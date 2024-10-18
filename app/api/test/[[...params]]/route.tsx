import { NextRequest, NextResponse } from "next/server";
import * as CryptoJS from "crypto-js";
import EntityRayPoint from "@/common/entity/EntityRayPoint";
import { getRequestContext } from "@cloudflare/next-on-pages";
import Resp from "@/common/resp";
import PointType from "@/common/enum/PointType";
import Log from "@/common/Logger";
import Logger from "@/common/Logger";

export const runtime = 'edge'

interface Query {

}

export async function GET(request: NextRequest, dynamicSegment?: string[]) {
  Logger.info("获取所有相同名称的参数")

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

  Logger.info("qSql", qSql)

  let stmt :D1PreparedStatement = db.prepare(qSql)
  if (arr.length > 0) {
    stmt = stmt.bind(...arr)
  }
  const { results } = await stmt.run();

  return Resp.success({ params, md5Vals, results });
}

// interface Param {
//   clean4Action: boolean,
//   base64PointContent: string
// }

export async function POST(request: NextRequest, dynamicSegment?: string[]) {
  const params: any = await request.json();

  let pointContent = params.pointContent;

  const check = checkBase64Str(pointContent);
  if (check) {
    // return Resp.success({ "err": "base64字符串检测失败" });
    console.log("pointContent为base64加密数据, 进行解密")
    pointContent = atob(pointContent);
  }

  const lines: string[] = pointContent.split(/\r\n|\r|\n/);

  let entityRayPoints: EntityRayPoint[] = lines.map((v, i) => {
    if (v == undefined || v == null || v == '') {
      return undefined;
    }
    const splitArr: string[] = v.split("://");

    // const obj = JSON.parse(decode1);

    const entityRayPoint = new EntityRayPoint();
    // entityRayPoint.create_time = formatDate(new Date())
    entityRayPoint.point_type = splitArr[0];
    entityRayPoint.point_content = v;

    fillPointInfo(entityRayPoint, splitArr[1])

    return entityRayPoint
  }).filter(o => o != undefined)

  if (entityRayPoints.length <= 0) {
    return Resp.success({ "status": -1, "msg": "没有有效的节点信息" });
  }

  let md5Vals = entityRayPoints.map(o => o.md5)

  const db: D1Database = getRequestContext().env.MY_DB1;

  if (params.clean4Action) {
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

  if (entityRayPoints.length == 0) {
    return Resp.fail("没有未存储的节点信息");
  }

  console.log("未存储的point数量:", entityRayPoints.length)

  const insertSql = `insert into t_entity_ray_point (
    \`create_user_id\`, \`last_modify_user_id\`,
    \`remark\`,
    \`md5\`,
    \`encryption_type\`,
    \`point_type\`,
    \`describe\`,
    \`point_content\`,
    \`source_from\`
    ) values (?,?,?,?,?,?,?,?,?)`;

  const stmt = db.prepare(insertSql);

  const stmtList: D1PreparedStatement[] = entityRayPoints.map(e => {
    const md5Val = e.md5
    if (md5Val != undefined && existsMd5List.includes(md5Val)) {
      return undefined
    }
    const arr = [
      1, 1,
      e.remark !== undefined && e.remark !== null ? JSON.stringify(e.remark) : null,
      md5Val,
      e.encryption_type !== undefined ? e.encryption_type : null,
      e.point_type !== undefined ? e.point_type : null,
      e.describe !== undefined ? e.describe : null,
      e.point_content !== undefined ? e.point_content : null,
      e.source_from !== undefined ? e.source_from : null
    ];
    return stmt.bind(...arr)
  }).filter(e => e !== undefined);

  /**
   * [
        {
          "success": true,
          "meta": {
            "served_by": "miniflare.db",
            "duration": 0,
            "changes": 1,
            "last_row_id": 24,
            "changed_db": true,
            "size_after": 24576,
            "rows_read": 2,
            "rows_written": 3
          },
          "results": []
        },
        ...
      ]
   */
  const rows = await db.batch(stmtList);

  console.log("数据插入结果", rows)

  return Resp.success(rows);
}

export async function DELETE(request: NextRequest, par?: string[]) {
  const body = await request.json()

  // const db: D1Database = getRequestContext().env.MY_DB1;

  // const delRet = await db.exec('delete from `t_entity_ray_point`')
  return Resp.success(body);
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

/**
 * 
 * @param entityRayPoint 填充节点信息
 * @param content 
 */
function fillPointInfo(entityRayPoint: EntityRayPoint, content: string) {
  try {
    switch(entityRayPoint.point_type) {
      case PointType.VMESS :
        fillWmess(entityRayPoint, content)
        break;
      case PointType.VLESS :
        fillVless(entityRayPoint, content)
        break;
      case PointType.SHADOWSOCKS :
        fillShadowsocks(entityRayPoint, content)
        break;
      case PointType.TROJAN :
        fillTrojan(entityRayPoint, content)
        break;
      default:
        fillDefault(entityRayPoint, content);
        break;
    }
  }catch (error) {
    Logger.error('填充节点信息时出错:', error);
    entityRayPoint.remark = '填充节点信息时出错, err=' + error
  }
}

/**
 * {
    "v": "2",
    "ps": "\u5173\u6CE8\u7535\u62A5https://t.me/aifenxiang2020",
    "add": "104.26.0.56",
    "port": "2086",
    "id": "e9e3cc13-db48-4cc1-8c24-7626439a5339",
    "aid": "0",
    "scy": "auto",
    "net": "ws",
    "type": "none",
    "host": "ip14.freegradely.xyz",
    "path": "github.com/Alvin9999",
    "tls": "",
    "sni": "",
    "alpn": "",
    "fp": ""
  }
 * @param entityRayPoint 填充WMESS信息
 */
function fillWmess(entityRayPoint: EntityRayPoint, content: string) {
  const decode = atob(content);

  const json = JSON.parse(decode);

  const md5Key = [
    json.v, // 2
    json.add, // 104.26.0.56
    json.port, // 2086
    json.net, // ws
    json.type // none
  ];
  
  entityRayPoint.md5 = CryptoJS.MD5(JSON.stringify(md5Key)).toString()
  entityRayPoint.describe = json.ps;
  entityRayPoint.remark = json
}

/**
 * vless://17714732-15b6-5b7a-9703-8c874ef8bef4@185.174.138.194:80?
    security=none
    &
    type=ws
    &
    sni=55965.olielielie.store.
    &
    path=/vless
    &
    encryption=none
    &
    headerType=none
    #
    🇷🇺_定制专线：@Alin006Bot
 * @param entityRayPoint 填充VLESS信息
 * 
 */
function fillVless(entityRayPoint: EntityRayPoint, content: string) {
  const idx1 = content.indexOf("@")
  const idx2 = content.indexOf("?")
  const idx3 = content.indexOf("#")

  // const sub1 = content.slice(0, idx1); // id 17714732-15b6-5b7a-9703-8c874ef8bef4
  const sub2 = content.slice(idx1 + 1, idx2); // 185.174.138.194:80
  // const sub3 = content.slice(idx2 + 1, idx3); // security=none&type=ws&sni=55965.olielielie.store.&path=/vless&encryption=none&headerType=none
  const sub4 = content.slice(idx3 + 1); // 🇷🇺_定制专线：@Alin006Bot

  const url = "http://" + content.slice(idx1 + 1, idx3)
  
  // 获取请求的 URL
  const { searchParams } = new URL(url);
  /**
   * 获取所有的查询参数
   * params {
      security: 'none',
      type: 'ws',
      sni: '55965.olielielie.store.',
      path: '/vless',
      encryption: 'none',
      headerType: 'none'
    }
   */
  let params = Object.fromEntries(searchParams.entries());
  // console.log("params", params)

  const md5Key = [
    sub2,
    params.security,
    params.type,
    params.sni,
    params.path,
    params.encryption,
    params.headerType
  ];

  entityRayPoint.md5 = CryptoJS.MD5(JSON.stringify(md5Key)).toString()
  entityRayPoint.describe = decodeURIComponent(sub4);
  entityRayPoint.remark = JSON.stringify(params);
}

/**
 * Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTo2NGYzM2RmMi00ZjlkLTRjZjMtYmI2OS1iODJiMDhjZjE0OWE@127.0.0.1:53#距离下次重置剩余：13 天
 * chacha20-ietf-poly1305:64f33df2-4f9d-4cf3-bb69-b82b08cf149a
 * 
 * @param entityRayPoint 填充SS信息
 * @param content 
 */
function fillShadowsocks(entityRayPoint: EntityRayPoint, content: string) {
  const idx1 = content.indexOf("@")
  const idx2 = content.indexOf("#")

  const sub1 = content.slice(0, idx1); // Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTo2NGYzM2RmMi00ZjlkLTRjZjMtYmI2OS1iODJiMDhjZjE0OWE
  const sub2 = content.slice(idx1 + 1, idx2); // 127.0.0.1:53
  const sub3 = content.slice(idx2 + 1); // 距离下次重置剩余：13 天

  const decode = atob(sub1); // chacha20-ietf-poly1305:64f33df2-4f9d-4cf3-bb69-b82b08cf149a
  const sp = decode.split(":")

  const md5Key = [
    sub2,
    sub1
  ];

  entityRayPoint.md5 = CryptoJS.MD5(JSON.stringify(md5Key)).toString()
  entityRayPoint.describe = decodeURIComponent(sub3);
  entityRayPoint.remark = JSON.stringify({"header": decode, "addr": sub2, "desc": sub3});
}

/**
 * 64f33df2-4f9d-4cf3-bb69-b82b08cf149a@ent1.imyourdaddy.top:20985?allowInsecure=1&peer=sale.alibaba.com&sni=sale.alibaba.com#俄罗斯01-0.01×-油管无广告
 * 
 * @param entityRayPoint 填充Trojan信息
 * @param content 
 */
function fillTrojan(entityRayPoint: EntityRayPoint, content: string) {
  const idx1 = content.indexOf("@")
  const idx2 = content.indexOf("?")
  const idx3 = content.indexOf("#")

  const sub1 = content.slice(0, idx1); // 密码 64f33df2-4f9d-4cf3-bb69-b82b08cf149a
  const sub2 = content.slice(idx1 + 1, idx2); // 地址:端口 ent1.imyourdaddy.top:20985
  const sub4 = content.slice(idx3 + 1); // 俄罗斯01-0.01×-油管无广告

  const url = "http://" + content.slice(idx1 + 1, idx3)
  
  // 获取请求的 URL
  const { searchParams } = new URL(url);
  /**
   * 获取所有的查询参数
   * params {
      allowInsecure: '1',
      peer: 'sale.alibaba.com',
      sni: 'sale.alibaba.com'
    }
   */
  let params = Object.fromEntries(searchParams.entries());

  const md5Key = [
    sub1,
    sub2
  ];

  entityRayPoint.md5 = CryptoJS.MD5(JSON.stringify(md5Key)).toString()
  entityRayPoint.describe = decodeURIComponent(sub4);
  entityRayPoint.remark = JSON.stringify(params);
}

/**
 * 无法解析的类型
 * @param entityRayPoint 填充信息
 * @param content 
 */
function fillDefault(entityRayPoint: EntityRayPoint, content: string) {
  entityRayPoint.md5 = CryptoJS.MD5(content).toString()
  entityRayPoint.describe = "无法解析的类型(" + entityRayPoint.md5 + ")"
}

