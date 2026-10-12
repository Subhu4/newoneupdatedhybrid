import { Page } from "@playwright/test";

export class BuyerJourneyPageUIStore {
  public readonly CATEGORY_HEADINGS_CSS;
  public readonly A4_BREADCRUMB_HOME;
  public readonly A4_BREADCRUMB_BUYERS;
  public readonly CONTACT_BUYER;
  public readonly SHOW_MORE_RESULT;
  public readonly REGISTRATION_HEADING;
  public readonly REGISTRATION_SUB_HEADING;
  public readonly VISIBLE_INPUTS;
  public readonly CREATE_ACCOUNT;
  public readonly TERMS_TEXT;

  public constructor(page: Page) {
    this.CATEGORY_HEADINGS_CSS = page.locator("h3");

    this.A4_BREADCRUMB_HOME = page.getByText("Home", { exact: true }).first();
    this.A4_BREADCRUMB_BUYERS = page.getByText("Buyers", { exact: true }).first();
    this.CONTACT_BUYER = page.getByText("Contact Buyer").first();
    this.SHOW_MORE_RESULT = page.getByText("Show More Result", { exact: true }).first();

    this.REGISTRATION_HEADING = page.getByRole("heading", { name: "Register your Company FREE", exact: true }).first();
    this.REGISTRATION_SUB_HEADING = page.getByRole("heading", { name: "Get Verified Buyers for your Product, FREE!", exact: true }).first();
    this.VISIBLE_INPUTS = page.locator("input:visible");
    this.CREATE_ACCOUNT = page.getByRole("button", { name: "Create Account", exact: true }).first();
    this.TERMS_TEXT = page.getByText(/By clicking Create Account, I accept the T&C and Privacy Policy/i).first();
  }
}
