import { NextResponse } from "next/server";

enum Code {
  SUCCESS = 200,
  FAIL = -1,
  ERROR = 500
}

enum SFMessage {
  SUCCESS = "操作成功",
  FAIL = "操作失败",
  ERROR = "系统错误"
}

class Result {
  code: Code;
  action_code?: Number;
  message: string;
  data: any;

  constructor(code: Code, message: string, data?: any) {
    this.code = code;
    this.message = message;
    this.data = data == undefined ? null : data;
  }
}

export default class Resp {
  
  static success(data?: any): NextResponse {
    return NextResponse.json(new Result(Code.SUCCESS, SFMessage.SUCCESS, data));
  }

  static fail(message?: string, data?: any): NextResponse {
    return NextResponse.json(new Result(Code.FAIL,
      message == undefined || message == null ? SFMessage.FAIL : message,
      data));
  }

  static error(message?: string): NextResponse {
    return NextResponse.json(new Result(Code.ERROR,
      message == undefined || message == null ? SFMessage.ERROR : message));
  }
}