import { NextRequest } from "next/server";

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // 获取查询参数
  const url = new URL(request.url);
  const queryParams = url.searchParams;
  url.toJSON()
  console.log(queryParams)

  return new Response(url.toJSON());
};

export async function POST(request: NextRequest) {
  // 解析请求体
  console.log("post request:", request)

  const data = await request.json();
  console.log("post body:", data)
  
  const responseText = new Map<string, number>();
  responseText.set("k", 1111)
  
  console.log("resp body:", JSON.stringify(responseText))

  var resp = new Response(JSON.stringify(responseText))
  resp.headers.set("content-type", "application/json")
  return resp;
};