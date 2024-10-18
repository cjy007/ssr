
class Logger {

  // static build(...data: any[]): any[] {
  //   return [
  //     new Date().toLocaleString(),
  //     ...data
  //   ]
  // }

  static print(type: string | null, ...data: any[]): void {
    const t = "Logger ==> " + new Date().toLocaleString() + " ";
    switch (type) {
      case "debug":
        console.debug(t, " [" + type + "] ", ...data);
        break;
      case "trace":
        console.trace(t, " [" + type + "] ", ...data);
        break;
      case "info":
        console.info(t, " [" + type + "] ", ...data);
        break;
      case "warn":
        console.warn(t, " [" + type + "] ", ...data);
        break;
      case "error":
        console.error(t, " [" + type + "] ", ...data);
        break;
      case null:
        console.log(t, " [-] ", ...data);
        break;
      default:
        console.log(t, " [" + type + "] ", ...data);
    }
  }

  static debug(...data: any[]) {
    this.print("debug", ...data);
  }

  static trace(...data: any[]) {
    this.print("trace", ...data)
  }

  static info(...data: any[]) {
    this.print("info", ...data)
  }

  static warn(...data: any[]) {
    this.print("warn", ...data);
  }

  static error(...data: any[]) {
    this.print("error", ...data);
  }
}

export default Logger;