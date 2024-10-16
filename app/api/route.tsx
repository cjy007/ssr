/*
export async function GET(request: Request) {}
 
export async function HEAD(request: Request) {}
 
export async function POST(request: Request) {}
 
export async function PUT(request: Request) {}
 
export async function DELETE(request: Request) {}
 
export async function PATCH(request: Request) {}
 
// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}
*/

import Resp from '@/common/resp'
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

  // var resp = new Response(responseText)

  // resp.headers.set("content-type", "application/json")
  return Resp.success(responseText)
}
