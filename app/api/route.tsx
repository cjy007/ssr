import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { useEffect, useState } from 'react';

export const runtime = 'edge'

// export const onRequest: PagesFunction<CloudflareEnv> = async (context) => {
//   const task = await context.env.MY_KV_NAMESPACE.get("k1");
//   return new Response(task);
// };

export async function GET(request: NextRequest) {
  let responseText = `{
    "flag": "success",
    "status": "success",
    "message": {
        "error_code": "200",
        "error_msg": "操作成功",
        "debug_msg": "",
        "msg_zh": "操作成功"
    },
    "result": {
        "modelName": "111",
        "version": "AIFS3.0_V1.0.1_240419.1"
    }
}`

const myMap = new Map();

  // In the edge runtime you can use Bindings that are available in your application
  // (for more details see:
  //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
  //    - https://developers.cloudflare.com/pages/functions/bindings/
  // )
  //
  // KV Example:
  const myKv = getRequestContext().env.MY_KV_NAMESPACE
  console.log("*** => myKv: ", myKv)
  myMap.set("myKv", JSON.stringify(myKv))
  await myKv.put('suffix', ' from a KV store!')
  const suffix = await myKv.get('suffix')
  myMap.set("myKv", suffix)
  // responseText += suffix

  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await fetch('http://192.168.25.100:18001/api/user/version'); // 发送请求到 API 路由
  //       const result = await response.json();
  //       console.log(result)
  //       setData(result);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }

  //   fetchData();
  // }, []);JSON.stringify(myKv)

  
  const obj = Object.fromEntries(myMap);
  const jsonString = JSON.stringify(obj);
  var resp = new Response(jsonString)

  resp.headers.set("content-type", "application/json")
  return resp
}
