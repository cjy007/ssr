import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from 'next/server'

export const runtime = "edge";

export async function GET(request: NextRequest) {
  let responseText = "Hello World";

  const myKv = getRequestContext().env.MY_KV1;
  await myKv.put("foo", "bar111");

  const all = await myKv.list()

  const myMap = new Map();
  myMap.set("all", all);

  const resp = new Response(JSON.stringify(Object.fromEntries(myMap)));
  resp.headers.set("content-type", "application/json")
  return resp
}