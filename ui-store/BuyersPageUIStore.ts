import { Page } from "@playwright/test";

export class BuyersPageUIStore {
  public readonly BODY;
  public readonly PAGE_HEADING;
  public readonly SEARCH_BUY_LEADS;
  public readonly FOR_BUYER;
  public readonly INDUSTRY_HEADING;
  public readonly BREADCRUMB_BUYERS;
  public readonly LATEST_HEADING;
  public readonly LEAD_CARDS_CSS;
  public readonly MASKED_MOBILE_NUMBERS;
  public readonly VERIFIED_INDICATOR_CSS;
  public readonly CARD_IMAGE_CSS;

  public constructor(page: Page) {
    this.BODY = page.locator("body");
    this.PAGE_HEADING = page.getByRole("heading", { name: "Buy Leads & Trade Leads from Verified Buyers", exact: true }).first();
    this.SEARCH_BUY_LEADS = page.getByText("Search Buy Leads", { exact: true }).first();
    this.FOR_BUYER = page.getByText("For Buyer", { exact: true }).first();
    this.INDUSTRY_HEADING = page.getByRole("heading", { name: "Explore Buy Leads by Industry", exact: true }).first();
    this.BREADCRUMB_BUYERS = page.getByRole("link", { name: "Buyers", exact: true }).last();
    this.LATEST_HEADING = page.getByRole("heading", { name: /Latest Buy Leads from Verified & Genuine Buyers/i });
    this.LEAD_CARDS_CSS = page.locator("div:has(> h3)").filter({ hasText: /Looking for/i });
    this.MASKED_MOBILE_NUMBERS = page.getByText(/\+\d{1,3}-\d{2}\*{6}\d{2}/);
    this.VERIFIED_INDICATOR_CSS =
      'img[alt*="verif" i], img[src*="verif" i], [class*="verif" i], [title*="verif" i]';
    this.CARD_IMAGE_CSS = "img";
  }
}
