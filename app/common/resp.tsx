import { NextResponse } from "next/server";

enum Code {
  SUCCESS = 200,
  FAIL = -1,
  ERROR = 500
}

export default class Resp {
  
  static success(data?: any): NextResponse {
    return NextResponse.json({
      code: Code.SUCCESS,
      message: "success",
      data: data
    })
    // return new Result(200, "success", data);
  }

  static fail(message?: string, data?: any): NextResponse {
    return NextResponse.json({
      code: Code.FAIL,
      message: message == undefined || message == null ? "failed" : message,
      data: data
    })
    // return new Result(code, message, null);
  }

  static error(message?: string): NextResponse {
    return NextResponse.json({
      code: Code.ERROR,
      message: message
    })
    // return new Result(code, message, null);
  }
}