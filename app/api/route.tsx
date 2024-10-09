import type { NextRequest } from 'next/server'

export const runtime = 'edge'

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

  var resp = new Response(responseText)

  resp.headers.set("content-type", "application/json")
  return resp
}
