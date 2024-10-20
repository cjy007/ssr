import Logger from "@/common/Logger";
import Resp from "@/common/resp";
import { NextRequest } from "next/server";
// import { globalFetch } from "common/common_fetch.tsx"

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // 获取请求的 URL
  const { searchParams } = new URL(request.url);
  // 获取所有的查询参数
  let params = Object.fromEntries(searchParams.entries());

  const url = params.url;

  Logger.info("url=", url)

  const res = await fetch(url);

  const contentType = res.headers.get("content-type");
  Logger.info("contentType: ", contentType); // text/html   application/json; charset=utf-8

  let data: any;
  switch (contentType) {
    case "text/html":
      data = await res.text();
      break;
    case "application/json; charset=utf-8":
      data = await res.json();
      break;
    default:
      data = await res.text();
      break;
  }

  return Resp.success(data);
}

// export async function GET(request: NextRequest) {
//   // // 获取查询参数
//   // const url = new URL(request.url);
//   // const queryParams = url.searchParams;
//   // url.toJSON()
//   // console.log(queryParams)
//   try {
//     const response = await fetch('https://dummyjson.com/users?limit=10');
//     if (!response.ok) {
//       throw new Error('网络响应不正常');
//     }
//     const data = await response.json();

//     var resp = new Response(JSON.stringify(data))
//     resp.headers.set("content-type", "application/json")
//     return resp;
//   } catch (error) {
//     console.error('Fetch error:', error.message);
//     // 可以根据需要进一步处理错误
//     return null;
//   }
// };

// export async function POST(request: NextRequest) {
//   // 解析请求体
//   console.log("post request:", request)

//   const data = await request.json();
//   console.log("post body:", data)
  
//   const responseText = new Map<string, number>();
//   responseText.set("k", 1111)
  
//   console.log("resp body:", JSON.stringify(responseText))

//   var resp = new Response(JSON.stringify(responseText))
//   resp.headers.set("content-type", "application/json")
//   return resp;
// };