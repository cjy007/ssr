import { NextRequest, NextResponse } from "next/server";
import * as CryptoJS from "crypto-js";
import { useSearchParams } from "next/navigation";

export const runtime = 'edge'

export async function GET(request: NextRequest, params?: string[]) {
  const searchParams = request.nextUrl; // 获取查询参数

  console.log(searchParams.searchParams)

  // const url = searchParams.searchParams('url'); // 获取特定参数

  // console.log("url", url)

  // if (url != null) {
  //   const res = await fetch(url);

  // console.log("res", res)
  // }

  // searchParams.map(() => {

  // })

  let method: string = request.method;
  // return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  return NextResponse.json({ "method": method, searchParams }, { status: 200 });
}

interface Param {
  base64Content: string
}

export async function POST(request: NextRequest, params?: string[]) {
  const body: Param = await request.json();

  const base64Str = body.base64Content;

  const check = checkBase64Str(base64Str);
  if (!check) {
    return NextResponse.json({ "err": "base64字符串检测失败" }, { status: 200 });
  }

  let decode = atob(body.base64Content);

  const lines: string[] = decode.split(/\r\n|\r|\n/);

  const m = lines.map((v, i, arr) => {
    if (v == '') {
      return undefined;
    }
    const lines1: string[] = v.split("://");
    const content = lines1[1];
    let decode1 = atob(content);

    const obj = JSON.parse(decode1);

    return { i, "md5": CryptoJS.MD5(v).toString(), "type": lines1[0], content, "contentParse": obj, v };
  })


  return NextResponse.json({ m }, { status: 200 });
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