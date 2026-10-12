import fs from "fs";
import path from "path";

const reportFolder = path.join(process.cwd(), "reports", "run-report");

if (!fs.existsSync(reportFolder)) {
  fs.mkdirSync(reportFolder, { recursive: true });
}

const reportFile = path.join(reportFolder, "test-report.json");

export interface RunReportEntry {
  testName: string;
  status: string;
  timestamp: string;
  details?: string;
}

export const runReport = {
  record(testName: string, status: string, details?: string): void {
    try {
      let reports: RunReportEntry[] = [];

      if (fs.existsSync(reportFile)) {
        const existingData = fs.readFileSync(reportFile, "utf-8");
        reports = existingData ? JSON.parse(existingData) : [];
      }

      reports.push({
        testName,
        status,
        timestamp: new Date().toISOString(),
        details
      });

      fs.writeFileSync(reportFile, JSON.stringify(reports, null, 4));
    } catch (error) {
      console.error(`Run report update failed: ${String(error)}`);
    }
  }
};

export function recordTestResult(testName: string, status: string, details?: string): void {
  try {
    runReport.record(testName, status, details);
  } catch (error) {
    console.error(`recordTestResult failed: ${String(error)}`);
  }
}
