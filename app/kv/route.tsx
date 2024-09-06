import { NextRequest } from "next/server";

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
    const data = await request.json();
    console.log(data)
    return new Response(JSON.stringify(data));
};