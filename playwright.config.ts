import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

const baseURL = process.env.BASE_URL ?? "https://www.exportersindia.com";
const isHeadless = (process.env.HEADLESS ?? "true").toLowerCase() !== "false";
const testTimeout = Number(process.env.TEST_TIMEOUT ?? 60000);
const expectTimeout = Number(process.env.EXPECT_TIMEOUT ?? 10000);
const actionTimeout = Number(process.env.ACTION_TIMEOUT ?? 20000);

export default defineConfig({
  testDir: "./tests",
  timeout: testTimeout,
  expect: {
    timeout: expectTimeout
  },
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["allure-playwright", { resultsDir: "reports/allure-results" }]
  ],
  use: {
    baseURL,
    headless: isHeadless,
    actionTimeout,
    navigationTimeout: 30000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ...devices["Desktop Chrome"],
    ignoreHTTPSErrors: true
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium"
      }
    }
  ]
});
