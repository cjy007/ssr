import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'edge'






export async function GET(request: NextRequest) {
  const myMap = new Map();

  const { results } = await getRequestContext().env.MY_DB1.prepare(
    "SELECT * FROM sqlite_master WHERE type='table'",
    // "SELECT * FROM Customers",
  )
    // .bind("Bs Beverages")
    .all();

    myMap.set("results", results);
    myMap.set("method", "GET");
    
  const resp = new Response(JSON.stringify(Object.fromEntries(myMap)));
  resp.headers.set("content-type", "application/json")
  return resp
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("body--------", body)

  // const decoded = atob(input);

  const myMap = new Map<string, any>();
  myMap.set("method", "POST");
  myMap.set("param", body);
  
  const resp = new Response(JSON.stringify(Object.fromEntries(myMap)));
  resp.headers.set("content-type", "application/json")
  return resp
}