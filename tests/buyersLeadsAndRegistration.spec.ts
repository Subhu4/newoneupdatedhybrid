import { test } from "@playwright/test";
import { BuyersPage } from "../pages/BuyersPage";
import { BuyerJourneyPage } from "../pages/BuyerJourneyPage";
import { takeScreenshot } from "../utils/screenshot";
import { recordTestResult } from "../utils/runReport";
import { testData } from "../test-data/testData";

test.describe("ExportersIndia - Buy Leads Page and Registration", () => {
  let buyersPage: BuyersPage;
  let buyerJourneyPage: BuyerJourneyPage;

  test.beforeEach(async ({ page }) => {
    buyersPage = new BuyersPage(page);
    buyerJourneyPage = new BuyerJourneyPage(page);
    await buyersPage.open();
  });

  test.afterEach(async ({ page }, testInfo) => {
    recordTestResult(testInfo.title, testInfo.status!, testInfo.error?.message);
    if (testInfo.status !== "passed") {
      await takeScreenshot(page, testInfo.title);
    }
  });

  test("TS_0070 - Header Call Us Number", async () => {
    await buyersPage.verifyHeaderCallUs(testData.expected.callUsAcceptedTexts);
    await buyersPage.scrollToBottomAndTop();
    await buyersPage.verifyHeaderCallUs(testData.expected.callUsAcceptedTexts);
    await buyersPage.reloadPage();
    await buyersPage.verifyHeaderCallUs(testData.expected.callUsAcceptedTexts);
  });

  test("TS_0071 - Buyers Page Introductory sentence is displayed directly below the main heading", async () => {
    await buyersPage.verifyIntroAndSearch(testData.expected.introText);
  });

  test("TS_0072 - For Buyer Menu Options", async () => {
    await buyersPage.verifyBuyerMenu(testData.buyers.buyerMenuOptions, testData.expected.buyerMenuCount);
  });

  test("TS_0073 - Industry Directory Content and Count", async () => {
    await buyersPage.verifyIndustrySection(testData.expected.industrySubText);
    await buyersPage.verifyIndustryLink(testData.buyers.industryFirst);
    await buyersPage.verifyIndustryLink(testData.buyers.industryMiddle);
    await buyersPage.verifyIndustryLink(testData.buyers.industryLast);
    await buyersPage.verifyAllIndustries(testData.buyers.allIndustries, testData.expected.industryCount);
  });

  test("TS_0074 - Agriculture Industry Page Content", async () => {
    await buyersPage.clickIndustry(testData.buyers.industryFirst);
    await buyerJourneyPage.verifyAgriculturePage(testData.expected.agricultureUrl, testData.expected.agricultureHeading);
    await buyerJourneyPage.verifyCategories(
      testData.buyers.agricultureCategories,
      testData.expected.agricultureMinimumCategoryCount
    );
  });

  test("TS_0075 - Breadcrumb Link Back to Buyers Page", async () => {
    await buyersPage.clickIndustry(testData.buyers.industryMiddle);
    await buyerJourneyPage.verifyIndustryPage(testData.expected.textilesUrlPart);
    await buyersPage.returnToBuyersUsingBreadcrumb();
  });

  test("TS_0076 - Popular Products Format and Order", async () => {
    await buyersPage.verifyPopularProducts(testData.buyers.popularProductsSection, testData.buyers.popularProducts);
  });

  test("TS_0077 - A4 Size Paper Leads Page Content", async () => {
    await buyersPage.openPopularProduct(testData.buyers.a4Product);
    await buyerJourneyPage.verifyA4PaperPage(testData.expected.a4UrlPart, testData.expected.a4Heading);
    await buyerJourneyPage.verifyLeadContent();
  });

  test("TS_0078 - Verified icon on first, fifth and tenth latest Buy Lead cards", async () => {
    await buyersPage.verifyLatestLeads(testData.buyers.latestLeadPositions);
    await buyersPage.verifyVerifiedIcon(testData.buyers.latestLeadPositions);
  });

  test("TS_0079 - Buyer Mobile Number is Masked on Lead Cards", async () => {
    await buyersPage.verifyLatestLeads(testData.buyers.latestLeadPositions);
    await buyersPage.verifyMaskedMobileNumbers(
      testData.buyers.latestLeadPositions,
      testData.expected.minimumMaskedCount,
      testData.expected.maskedMobileFormat
    );
  });

  test("TS_0080 - Connect With Genuine Buyers Opens Registration", async () => {
    await buyersPage.clickConnectWithGenuineBuyers(testData.buyers.connectButton, testData.expected.registrationUrlPart);
    await buyerJourneyPage.verifyRegistrationPage(testData.expected.registrationUrlPart);
    await buyerJourneyPage.verifyRegistrationFields(testData.expected.minimumRegistrationInputs);
  });
});
