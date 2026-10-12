import { expect, Page } from "@playwright/test";
import { HomePageUIStore } from "../ui-store/HomePageUIStore";
import { executeAction } from "../utils/actionHelper";
import { logger } from "../utils/logger";

export class HomePage {
  private readonly page: Page;
  private readonly ui: HomePageUIStore;

  public constructor(page: Page) {
    this.page = page;
    this.ui = new HomePageUIStore(page);
  }

  /**
   * Author: Subham Maharana
   * Method Name: navigate
   * Description: Opens the ExportersIndia homepage and verifies the search input.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async navigate(): Promise<void> {
    await executeAction(this.page, "HomePage.navigate", async () => {
      try {
        await this.page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(this.ui.SEARCH_INPUT).toBeVisible();
      } catch (error) {
        logger.error(`HomePage.navigate failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: openPostBuyRequirement
   * Description: Hovers over For Buyer, clicks Post Buy Requirement and verifies
   * that the requirement page is opened.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async openPostBuyRequirement(): Promise<void> {
    await executeAction(this.page, "HomePage.openPostBuyRequirement", async () => {
      try {
        await expect(this.ui.FOR_BUYER).toBeVisible();
        await this.ui.FOR_BUYER.hover();

        if ((await this.ui.POST_BUY_REQUIREMENT_LINK.count()) > 0) {
          await expect(this.ui.POST_BUY_REQUIREMENT_LINK).toBeVisible();
          await this.ui.POST_BUY_REQUIREMENT_LINK.click();
        } else {
          await expect(this.ui.POST_BUY_REQUIREMENT_TEXT).toBeVisible();
          await this.ui.POST_BUY_REQUIREMENT_TEXT.click();
        }

        await this.page.waitForLoadState("domcontentloaded");
        await expect(this.page).toHaveURL(/post-buy-requirement\.php/i);
      } catch (error) {
        logger.error(`HomePage.openPostBuyRequirement failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }
}
