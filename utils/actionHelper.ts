import { Page } from "@playwright/test";
import { logger } from "./logger";
import { runReport } from "./runReport";
import { takeScreenshot } from "./screenshot";

/**
 * Author: Subham Maharana
 * Method Name: executeAction
 * Description: Executes a page action with centralized logging, run-reporting,
 * screenshot capture and exception handling.
 * Parameters: page - Playwright page, actionName - report/log name,
 * action - asynchronous action to execute.
 * Return Type: Promise<T>.
 */
export async function executeAction<T>(
  page: Page,
  actionName: string,
  action: () => Promise<T>
): Promise<T> {
  logger.info(`Starting action: ${actionName}`);
  runReport.record(actionName, "STARTED");

  try {
    const result = await action();
    runReport.record(actionName, "PASSED");
    logger.info(`Completed action: ${actionName}`);
    return result;
  } catch (error) {
    const errorMessage = String(error);
    logger.error(`${actionName} failed: ${errorMessage.split("\n")[0]}`);
    runReport.record(actionName, "FAILED", errorMessage.split("\n")[0]);
    await takeScreenshot(page, actionName);
    throw error;
  }
}
