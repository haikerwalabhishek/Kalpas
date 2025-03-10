import fs from "fs";
import path from "path";

const errorLogPath = path.join(process.cwd(), "src", "logs", "errors.log");

export function logError(errorMessage) {
  const logMessage = `[${new Date().toISOString()}] ${errorMessage}\n`;
  fs.appendFile(errorLogPath, logMessage, (err) => {
    if (err) {
      console.error("Failed to write error to log file:", err);
    }
  });
}
