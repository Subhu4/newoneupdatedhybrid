import fs from "fs";
import path from "path";

const logFolder = path.join(process.cwd(), "reports", "logs");

if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder, { recursive: true });
}

const logFile = path.join(logFolder, "execution.log");

function writeLog(level: string, message: string): void {
  try {
    const time = new Date().toISOString();
    fs.appendFileSync(logFile, `[${time}] [${level}] ${message}\n`);
  } catch (error) {
    console.error(`Unable to write log: ${String(error)}`);
  }
}

export const logger = {
  info(message: string): void {
    try {
      writeLog("INFO", message);
    } catch (error) {
      console.error(`Logger info failed: ${String(error)}`);
    }
  },

  error(message: string): void {
    try {
      writeLog("ERROR", message);
    } catch (error) {
      console.error(`Logger error failed: ${String(error)}`);
    }
  },

  warn(message: string): void {
    try {
      writeLog("WARN", message);
    } catch (error) {
      console.error(`Logger warn failed: ${String(error)}`);
    }
  }
};
