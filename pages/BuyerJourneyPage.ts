import { expect, Page } from "@playwright/test";
import { BuyerJourneyPageUIStore } from "../ui-store/BuyerJourneyPageUIStore";
import { executeAction } from "../utils/actionHelper";
import { logger } from "../utils/logger";

export class BuyerJourneyPage {
  private readonly page: Page;
  private readonly ui: BuyerJourneyPageUIStore;

  public constructor(page: Page) {
    this.page = page;
    this.ui = new BuyerJourneyPageUIStore(page);
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyIndustryPage
   * Description: Verifies the opened industry page URL contains the expected fragment.
   * Parameters: expectedUrlPart - expected URL fragment.
   * Return Type: Promise<void>.
   */
  public async verifyIndustryPage(expectedUrlPart: string): Promise<void> {
    await executeAction(this.page, `BuyerJourneyPage.verifyIndustryPage:${expectedUrlPart}`, async () => {
      try {
        const escapedUrlPart = expectedUrlPart.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        await expect(this.page).toHaveURL(new RegExp(escapedUrlPart));
      } catch (error) {
        logger.error(`BuyerJourneyPage.verifyIndustryPage:${expectedUrlPart} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyAgriculturePage
   * Description: Verifies the agriculture buyer page URL and main heading.
   * Parameters: expectedUrl - expected page URL, heading - expected page heading.
   * Return Type: Promise<void>.
   */
  public async verifyAgriculturePage(expectedUrl: string, heading: string): Promise<void> {
    await executeAction(this.page, "BuyerJourneyPage.verifyAgriculturePage", async () => {
      try {
        const escapedUrl = expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        await expect(this.page).toHaveURL(new RegExp(escapedUrl));
        await expect(this.page.getByRole("heading", { name: heading, exact: true }).first()).toBeVisible();
      } catch (error) {
        logger.error(`BuyerJourneyPage.verifyAgriculturePage failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyCategories
   * Description: Verifies every category heading is visible with a numeric count and
   * that the minimum number of counted category headings is present.
   * Parameters: categories - expected category names, minimumCount - minimum counted headings.
   * Return Type: Promise<void>.
   */
  public async verifyCategories(categories: string[], minimumCount: number): Promise<void> {
    await executeAction(this.page, "BuyerJourneyPage.verifyCategories", async () => {
      try {
        for (const category of categories) {
          const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const heading = this.page
            .getByRole("heading", { name: new RegExp(`^${escapedCategory}\\s*\\(`) })
            .first();
          await expect(heading).toBeVisible();
          await expect(heading).toContainText(/\(\d+\)/);
        }

        const countedHeadings = await this.ui.CATEGORY_HEADINGS_CSS.filter({ hasText: /\(\d+\)/ }).count();
        expect(countedHeadings).toBeGreaterThanOrEqual(minimumCount);
      } catch (error) {
        logger.error(`BuyerJourneyPage.verifyCategories failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyA4PaperPage
   * Description: Verifies the A4 Size Paper page URL, heading and breadcrumb.
   * Parameters: expectedUrlPart - expected URL fragment, heading - expected page heading.
   * Return Type: Promise<void>.
   */
  public async verifyA4PaperPage(expectedUrlPart: string, heading: string): Promise<void> {
    await executeAction(this.page, "BuyerJourneyPage.verifyA4PaperPage", async () => {
      try {
        const escapedUrlPart = expectedUrlPart.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        await expect(this.page).toHaveURL(new RegExp(escapedUrlPart));
        await expect(this.page.getByRole("heading", { name: heading }).first()).toBeVisible();
        await expect(this.ui.A4_BREADCRUMB_HOME).toBeVisible();
        await expect(this.ui.A4_BREADCRUMB_BUYERS).toBeVisible();
      } catch (error) {
        logger.error(`BuyerJourneyPage.verifyA4PaperPage failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyLeadContent
   * Description: Verifies the lead cards expose Contact Buyer and that Show More Result
   * is displayed at the end of the list.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async verifyLeadContent(): Promise<void> {
    await executeAction(this.page, "BuyerJourneyPage.verifyLeadContent", async () => {
      try {
        await expect(this.ui.CONTACT_BUYER).toBeVisible();
        await this.ui.SHOW_MORE_RESULT.scrollIntoViewIfNeeded();
        await expect(this.ui.SHOW_MORE_RESULT).toBeVisible();
      } catch (error) {
        logger.error(`BuyerJourneyPage.verifyLeadContent failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyRegistrationPage
   * Description: Verifies the seller registration URL and both page headings.
   * Parameters: expectedUrlPart - expected URL fragment.
   * Return Type: Promise<void>.
   */
  public async verifyRegistrationPage(expectedUrlPart: string): Promise<void> {
    await executeAction(this.page, "BuyerJourneyPage.verifyRegistrationPage", async () => {
      try {
        const escapedUrlPart = expectedUrlPart.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        await this.page.waitForLoadState("domcontentloaded");
        await expect(this.page).toHaveURL(new RegExp(escapedUrlPart));
        await expect(this.ui.REGISTRATION_HEADING).toBeVisible();
        await expect(this.ui.REGISTRATION_SUB_HEADING).toBeVisible();
      } catch (error) {
        logger.error(`BuyerJourneyPage.verifyRegistrationPage failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyRegistrationFields
   * Description: Verifies the headings, the Create Account button and the form inputs
   * without submitting the form.
   * Parameters: minimumInputs - minimum number of visible inputs.
   * Return Type: Promise<void>.
   */
  public async verifyRegistrationFields(minimumInputs: number): Promise<void> {
    await executeAction(this.page, "BuyerJourneyPage.verifyRegistrationFields", async () => {
      try {
        await expect(this.ui.REGISTRATION_HEADING).toBeVisible();
        await expect(this.ui.REGISTRATION_SUB_HEADING).toBeVisible();
        await expect(this.ui.CREATE_ACCOUNT).toBeVisible();
        expect(await this.ui.VISIBLE_INPUTS.count()).toBeGreaterThanOrEqual(minimumInputs);
      } catch (error) {
        logger.error(`BuyerJourneyPage.verifyRegistrationFields failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }
}
