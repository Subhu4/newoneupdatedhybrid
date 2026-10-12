import { Page } from "@playwright/test";

export class HomePageUIStore {
  public readonly SEARCH_INPUT;
  public readonly FOR_BUYER;
  public readonly POST_BUY_REQUIREMENT_LINK;
  public readonly POST_BUY_REQUIREMENT_TEXT;

  public constructor(page: Page) {
    this.SEARCH_INPUT = page.getByPlaceholder("Enter product / service to search").first();
    this.FOR_BUYER = page.getByText("For Buyer", { exact: true }).first();
    this.POST_BUY_REQUIREMENT_LINK = page.locator('a[href*="post-buy-requirement"]:visible').first();
    this.POST_BUY_REQUIREMENT_TEXT = page.getByText("Post Buy Requirement", { exact: true }).first();
  }
}
