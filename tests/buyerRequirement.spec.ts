import { test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { RequirementPage } from "../pages/RequirementPage";
import { takeScreenshot } from "../utils/screenshot";
import { recordTestResult } from "../utils/runReport";
import { testData } from "../test-data/testData";

test.describe("ExportersIndia - Buyer Requirement Form", () => {
  let homePage: HomePage;
  let requirementPage: RequirementPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    requirementPage = new RequirementPage(page);
    await homePage.navigate();
  });

  test.afterEach(async ({ page }, testInfo) => {
    recordTestResult(testInfo.title, testInfo.status!, testInfo.error?.message);
    if (testInfo.status !== "passed") {
      await takeScreenshot(page, testInfo.title);
    }
  });

  test("TS_0061 - Open Post Buy Requirement workflow", async () => {
    await homePage.openPostBuyRequirement();
    await requirementPage.verifyCoreFields();
  });

  test("TS_0062 - Submit a complete buyer requirement with valid data", async () => {
    await homePage.openPostBuyRequirement();
    await requirementPage.fillProduct(testData.postRequirement.product);
    await requirementPage.selectInterestedInIfAvailable(testData.postRequirement.interestedIn);
    await requirementPage.fillQuantity(testData.postRequirement.quantity);
    await requirementPage.selectUnit(testData.postRequirement.unit);
    await requirementPage.selectSupplierPreference(testData.postRequirement.supplierPreference);
    await requirementPage.fillMobile(testData.postRequirement.mobile);
    await requirementPage.submit();
    await requirementPage.verifyOtpVisible();
  });

  test("TS_0063 - Validate missing product/service in buyer requirements", async () => {
    await homePage.openPostBuyRequirement();
    await requirementPage.fillProduct(testData.postRequirement.blankValue);
    await requirementPage.fillQuantity(testData.postRequirement.quantity);
    await requirementPage.selectUnit(testData.postRequirement.unit);
    await requirementPage.selectSupplierPreference(testData.postRequirement.supplierPreference);
    await requirementPage.fillMobile(testData.postRequirement.mobile);
    await requirementPage.submit();
    await requirementPage.verifyNoOtpAndValidation("product");
  });

  test("TS_0064 - Validate missing Interested in", async () => {
    await homePage.openPostBuyRequirement();
    await requirementPage.fillProduct(testData.postRequirement.product);
    await requirementPage.fillQuantity(testData.postRequirement.quantity);
    await requirementPage.selectUnit(testData.postRequirement.unit);
    await requirementPage.selectSupplierPreference(testData.postRequirement.supplierPreference);
    await requirementPage.fillMobile(testData.postRequirement.mobile);
    await requirementPage.submit();
    await requirementPage.verifyNoOtpAndValidation("quantity");
  });

  test("TS_0065 - Validate missing quantity in buyer requirement", async () => {
    await homePage.openPostBuyRequirement();
    await requirementPage.fillProduct(testData.postRequirement.product);
    await requirementPage.selectInterestedInIfAvailable(testData.postRequirement.interestedIn);
    await requirementPage.fillQuantity(testData.postRequirement.blankValue);
    await requirementPage.selectUnit(testData.postRequirement.unit);
    await requirementPage.selectSupplierPreference(testData.postRequirement.supplierPreference);
    await requirementPage.fillMobile(testData.postRequirement.mobile);
    await requirementPage.submit();
    await requirementPage.verifyNoOtpAndValidation("quantity");
  });

  test("TS_0066 - Validate zero and negative quantity", async () => {
    await homePage.openPostBuyRequirement();
    await requirementPage.fillProduct(testData.postRequirement.product);
    await requirementPage.selectInterestedInIfAvailable(testData.postRequirement.interestedIn);
    await requirementPage.fillQuantity(testData.postRequirement.zeroQuantity);
    await requirementPage.selectUnit(testData.postRequirement.unit);
    await requirementPage.selectSupplierPreference(testData.postRequirement.supplierPreference);
    await requirementPage.fillMobile(testData.postRequirement.mobile);
    await requirementPage.submit();
    await requirementPage.verifyNoOtpAndValidation("quantity");
    await requirementPage.fillQuantity(testData.postRequirement.negativeQuantity);
    await requirementPage.submit();
    await requirementPage.verifyNoOtpAndValidation("quantity");
  });

  test("TS_0067 - Validate supplier preference options", async () => {
    await requirementPage.open();
    await requirementPage.verifySupplierPreferenceOptions(testData.postRequirement.supplierPreferenceOptions);
  });

  test("TS_0068 - Select specific states for supplier preference", async () => {
    await requirementPage.open();
    await requirementPage.selectSupplierPreference(testData.postRequirement.specificStatesPreference);
    await requirementPage.selectStates(testData.postRequirement.states);
  });

  test("TS_0069 - Validate invalid mobile in buyer requirement", async () => {
    await homePage.openPostBuyRequirement();
    await requirementPage.fillProduct(testData.postRequirement.product);
    await requirementPage.selectInterestedInIfAvailable(testData.postRequirement.interestedIn);
    await requirementPage.fillQuantity(testData.postRequirement.quantity);
    await requirementPage.selectUnit(testData.postRequirement.unit);
    await requirementPage.selectSupplierPreference(testData.postRequirement.supplierPreference);
    await requirementPage.fillMobile(testData.postRequirement.invalidMobile);
    await requirementPage.verifyMobileFormat(testData.postRequirement.invalidMobile);
    await requirementPage.submit();
    await requirementPage.verifyNoOtpAndValidation("mobile");
  });
});
