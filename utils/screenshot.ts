import { Page } from "@playwright/test";
import fs from "fs";
import path from "path";

export async function takeScreenshot(page: Page, testName: string): Promise<void> {
  try {
    const screenshotFolder = path.join(process.cwd(), "reports", "screenshots");

    if (!fs.existsSync(screenshotFolder)) {
      fs.mkdirSync(screenshotFolder, { recursive: true });
    }

    const safeTestName = testName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const screenshotPath = path.join(screenshotFolder, `${safeTestName}.png`);

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
  } catch (error) {
    console.error(`Screenshot capture failed: ${String(error)}`);
  }
}
