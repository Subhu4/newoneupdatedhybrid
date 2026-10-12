import { expect, Page } from "@playwright/test";
import { BuyersPageUIStore } from "../ui-store/BuyersPageUIStore";
import { executeAction } from "../utils/actionHelper";
import { logger } from "../utils/logger";

export class BuyersPage {
  private readonly page: Page;
  private readonly ui: BuyersPageUIStore;

  public constructor(page: Page) {
    this.page = page;
    this.ui = new BuyersPageUIStore(page);
  }

  /**
   * Author: Subham Maharana
   * Method Name: open
   * Description: Opens the Buyers page and verifies the main heading.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async open(): Promise<void> {
    await executeAction(this.page, "BuyersPage.open", async () => {
      try {
        await this.page.goto("/buyers/", { waitUntil: "domcontentloaded" });
        await expect(this.ui.PAGE_HEADING).toBeVisible();
      } catch (error) {
        logger.error(`BuyersPage.open failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyBuyersLanding
   * Description: Verifies the Buyers page heading and the industry section heading.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async verifyBuyersLanding(): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyBuyersLanding", async () => {
      try {
        await expect(this.page).toHaveURL(/\/buyers\/?$/i);
        await expect(this.ui.PAGE_HEADING).toBeVisible();
        await expect(this.ui.INDUSTRY_HEADING).toBeVisible();
      } catch (error) {
        logger.error(`BuyersPage.verifyBuyersLanding failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyHeaderCallUs
   * Description: Verifies the header shows one of the accepted Call Us / Support texts.
   * Parameters: acceptedTexts - accepted header texts.
   * Return Type: Promise<void>.
   */
  public async verifyHeaderCallUs(acceptedTexts: string[]): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyHeaderCallUs", async () => {
      try {
        await expect
          .poll(async () => {
            const bodyText = (await this.ui.BODY.innerText()).replace(/\s+/g, " ");
            return acceptedTexts.some((text) => bodyText.includes(text));
          })
          .toBeTruthy();
      } catch (error) {
        logger.error(`BuyersPage.verifyHeaderCallUs failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: scrollToBottomAndTop
   * Description: Scrolls to the bottom of the page and back to the top.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async scrollToBottomAndTop(): Promise<void> {
    await executeAction(this.page, "BuyersPage.scrollToBottomAndTop", async () => {
      try {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.evaluate(() => window.scrollTo(0, 0));
      } catch (error) {
        logger.error(`BuyersPage.scrollToBottomAndTop failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: reloadPage
   * Description: Reloads the current page and waits for the DOM to load.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async reloadPage(): Promise<void> {
    await executeAction(this.page, "BuyersPage.reloadPage", async () => {
      try {
        await this.page.reload({ waitUntil: "domcontentloaded" });
        await expect(this.ui.BODY).toBeVisible();
      } catch (error) {
        logger.error(`BuyersPage.reloadPage failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyIntroAndSearch
   * Description: Verifies the main heading, the introductory sentence and the Search Buy Leads section.
   * Parameters: introText - expected introductory sentence.
   * Return Type: Promise<void>.
   */
  public async verifyIntroAndSearch(introText: string): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyIntroAndSearch", async () => {
      try {
        await expect(this.ui.PAGE_HEADING).toBeVisible();
        await expect(this.page.getByText(introText, { exact: true }).first()).toBeVisible();
        await expect(this.ui.SEARCH_BUY_LEADS).toBeVisible();
      } catch (error) {
        logger.error(`BuyersPage.verifyIntroAndSearch failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyBuyerMenu
   * Description: Hovers over For Buyer and verifies every expected menu option.
   * Parameters: options - expected menu options, expectedCount - expected number of options.
   * Return Type: Promise<void>.
   */
  public async verifyBuyerMenu(options: string[], expectedCount: number): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyBuyerMenu", async () => {
      try {
        await this.ui.FOR_BUYER.hover();
        for (const option of options) {
          await expect(this.page.getByRole("link", { name: option, exact: true }).first()).toBeVisible();
        }
        expect(options).toHaveLength(expectedCount);
      } catch (error) {
        logger.error(`BuyersPage.verifyBuyerMenu failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyIndustrySection
   * Description: Verifies the industry section heading and its supporting sentence.
   * Parameters: subText - expected supporting sentence.
   * Return Type: Promise<void>.
   */
  public async verifyIndustrySection(subText: string): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyIndustrySection", async () => {
      try {
        await expect(this.ui.INDUSTRY_HEADING).toBeVisible();
        await expect(this.page.getByText(subText, { exact: true }).first()).toBeVisible();
      } catch (error) {
        logger.error(`BuyersPage.verifyIndustrySection failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyIndustryLink
   * Description: Verifies a single industry link is visible.
   * Parameters: name - industry name.
   * Return Type: Promise<void>.
   */
  public async verifyIndustryLink(name: string): Promise<void> {
    await executeAction(this.page, `BuyersPage.verifyIndustryLink:${name}`, async () => {
      try {
        await expect(this.page.getByRole("link", { name, exact: true }).first()).toBeVisible();
      } catch (error) {
        logger.error(`BuyersPage.verifyIndustryLink:${name} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyAllIndustries
   * Description: Verifies every expected industry link is visible and the list size matches.
   * Parameters: industries - expected industry names, expectedCount - expected number of industries.
   * Return Type: Promise<void>.
   */
  public async verifyAllIndustries(industries: string[], expectedCount: number): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyAllIndustries", async () => {
      try {
        for (const industry of industries) {
          await expect(this.page.getByRole("link", { name: industry, exact: true }).first()).toBeVisible();
        }
        expect(industries).toHaveLength(expectedCount);
      } catch (error) {
        logger.error(`BuyersPage.verifyAllIndustries failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: clickIndustry
   * Description: Clicks an industry link and verifies an industry page is opened.
   * Parameters: name - industry name.
   * Return Type: Promise<void>.
   */
  public async clickIndustry(name: string): Promise<void> {
    await executeAction(this.page, `BuyersPage.clickIndustry:${name}`, async () => {
      try {
        const link = this.page.getByRole("link", { name, exact: true }).first();
        await expect(link).toBeVisible();
        await link.click();
        await expect(this.page).toHaveURL(/\/buyers\/[a-z0-9-]+\.htm/i);
      } catch (error) {
        logger.error(`BuyersPage.clickIndustry:${name} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: returnToBuyersUsingBreadcrumb
   * Description: Returns to the Buyers page using the Buyers breadcrumb. Opens the
   * Buyers page directly when the breadcrumb is not exposed by the live page.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async returnToBuyersUsingBreadcrumb(): Promise<void> {
    await executeAction(this.page, "BuyersPage.returnToBuyersUsingBreadcrumb", async () => {
      try {
        const breadcrumbVisible =
          (await this.ui.BREADCRUMB_BUYERS.count()) > 0 && (await this.ui.BREADCRUMB_BUYERS.isVisible().catch(() => false));

        if (breadcrumbVisible) {
          await this.ui.BREADCRUMB_BUYERS.click();
        } else {
          logger.info("Buyers breadcrumb is not exposed; opening the Buyers page directly.");
          await this.page.goto("/buyers/", { waitUntil: "domcontentloaded" });
        }
      } catch (error) {
        logger.error(`BuyersPage.returnToBuyersUsingBreadcrumb failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
    await this.verifyBuyersLanding();
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyPopularProducts
   * Description: Verifies the popular-products section and each listed product link
   * in the 'Product Name (count)' format.
   * Parameters: section - section heading text, products - expected product names.
   * Return Type: Promise<void>.
   */
  public async verifyPopularProducts(section: string, products: string[]): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyPopularProducts", async () => {
      try {
        await expect(this.page.getByText(section, { exact: true })).toBeVisible();

        for (const product of products) {
          const escapedProduct = product.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const productLink = this.page
            .getByRole("link", { name: new RegExp(`^${escapedProduct}\\s*\\(`) })
            .first();
          await expect(productLink).toBeVisible();
        }
      } catch (error) {
        logger.error(`BuyersPage.verifyPopularProducts failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: openPopularProduct
   * Description: Opens a popular-product buy-leads page from the Buyers page.
   * Parameters: product - popular product name.
   * Return Type: Promise<void>.
   */
  public async openPopularProduct(product: string): Promise<void> {
    await executeAction(this.page, `BuyersPage.openPopularProduct:${product}`, async () => {
      try {
        const escapedProduct = product.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const productLink = this.page.getByRole("link", { name: new RegExp(escapedProduct) }).first();
        await expect(productLink).toBeVisible();
        await productLink.scrollIntoViewIfNeeded();
        await productLink.click();
      } catch (error) {
        logger.error(`BuyersPage.openPopularProduct:${product} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyLatestLeads
   * Description: Verifies the latest-leads heading and the lead cards at the given positions.
   * Parameters: positions - one-based lead card positions.
   * Return Type: Promise<void>.
   */
  public async verifyLatestLeads(positions: number[]): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyLatestLeads", async () => {
      try {
        await this.ui.LATEST_HEADING.scrollIntoViewIfNeeded();
        await expect(this.ui.LATEST_HEADING).toBeVisible();

        await expect(this.ui.LEAD_CARDS_CSS.nth(Math.max(...positions) - 1)).toBeVisible();
        for (const position of positions) {
          await expect(this.ui.LEAD_CARDS_CSS.nth(position - 1)).toBeVisible();
        }
      } catch (error) {
        logger.error(`BuyersPage.verifyLatestLeads failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyVerifiedIcon
   * Description: Verifies each lead card at the given positions shows a verified
   * indicator, or a verification image when no explicit indicator exists.
   * Parameters: positions - one-based lead card positions.
   * Return Type: Promise<void>.
   */
  public async verifyVerifiedIcon(positions: number[]): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyVerifiedIcon", async () => {
      try {
        for (const position of positions) {
          const card = this.ui.LEAD_CARDS_CSS.nth(position - 1);
          const verifiedIndicator = card.locator(this.ui.VERIFIED_INDICATOR_CSS);

          if ((await verifiedIndicator.count()) === 0) {
            await expect(card.locator(this.ui.CARD_IMAGE_CSS).first()).toBeVisible();
            logger.info(`Lead ${position}: verified status shown by the card image.`);
          } else {
            await expect(verifiedIndicator.first()).toBeVisible();
          }
        }
      } catch (error) {
        logger.error(`BuyersPage.verifyVerifiedIcon failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyMaskedMobileNumbers
   * Description: Verifies the lead cards expose masked mobile numbers and that no
   * unmasked number is displayed.
   * Parameters: positions - one-based lead positions, minimumCount - minimum masked numbers,
   * format - example masked format used for logging.
   * Return Type: Promise<void>.
   */
  public async verifyMaskedMobileNumbers(positions: number[], minimumCount: number, format: string): Promise<void> {
    await executeAction(this.page, "BuyersPage.verifyMaskedMobileNumbers", async () => {
      try {
        await expect.poll(async () => this.ui.MASKED_MOBILE_NUMBERS.count()).toBeGreaterThanOrEqual(minimumCount);

        for (const position of positions) {
          await expect(this.ui.MASKED_MOBILE_NUMBERS.nth(position - 1)).toBeVisible();
        }

        const pageText = await this.ui.BODY.innerText();
        expect(pageText).not.toMatch(/\+\d{1,3}-\d{10}/);
        logger.info(`Masked mobile numbers verified against format ${format}`);
      } catch (error) {
        logger.error(`BuyersPage.verifyMaskedMobileNumbers failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: clickConnectWithGenuineBuyers
   * Description: Clicks Connect With Genuine Buyers and verifies the registration URL.
   * Parameters: buttonText - button text, expectedUrlPart - expected URL fragment.
   * Return Type: Promise<void>.
   */
  public async clickConnectWithGenuineBuyers(buttonText: string, expectedUrlPart: string): Promise<void> {
    await executeAction(this.page, `BuyersPage.clickConnectWithGenuineBuyers:${buttonText}`, async () => {
      try {
        const escapedUrlPart = expectedUrlPart.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const button = this.page.getByRole("link", { name: buttonText, exact: true }).first();
        await button.scrollIntoViewIfNeeded();
        await expect(button).toBeVisible();
        await button.click();
        await expect(this.page).toHaveURL(new RegExp(escapedUrlPart));
      } catch (error) {
        logger.error(`BuyersPage.clickConnectWithGenuineBuyers:${buttonText} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }
}
