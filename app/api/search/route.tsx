import { NextRequest } from "next/server";
import { globalFetch } from "common/common_fetch.tsx"

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // // 获取查询参数
  // const url = new URL(request.url);
  // const queryParams = url.searchParams;
  // url.toJSON()
  // console.log(queryParams)
  try {
    const response = await globalFetch('https://dummyjson.com/users?limit=10')
    .then((resp) => {
      return resp.json();
    });
    const data = "{'a':1}"// await response.json();

    var resp = new Response(JSON.stringify(response))
    resp.headers.set("content-type", "application/json")
    return resp;
  } catch (error) {
    console.error('Fetch error:', error.message);
    // 可以根据需要进一步处理错误
    return null;
  }
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