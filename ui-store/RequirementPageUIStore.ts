import { Page } from "@playwright/test";

export class RequirementPageUIStore {
  public readonly BODY;
  public readonly REQUIREMENT_DETAILS;
  public readonly PRODUCT_SERVICE;
  public readonly PRODUCT_SERVICE_CSS;
  public readonly QUANTITY;
  public readonly QUANTITY_CSS;
  public readonly UNIT_LABEL;
  public readonly UNIT_INPUT;
  public readonly UNIT_SELECT_CSS;
  public readonly UNIT_SELECTED_OPTION;
  public readonly MOBILE;
  public readonly MOBILE_CSS;
  public readonly SUPPLIER_PREFERENCE_TEXT;
  public readonly PREFERENCE_LABELS;
  public readonly STATE_SELECT_CSS;
  public readonly STATE_OPTIONS;
  public readonly SUBMIT_REQUIREMENT;
  public readonly OTP_INPUT;
  public readonly OTP_TEXT;
  public readonly VALIDATION_MESSAGES;

  public constructor(page: Page) {
    this.BODY = page.locator("body");
    this.REQUIREMENT_DETAILS = page.getByText("Requirement Details", { exact: true }).first();

    this.PRODUCT_SERVICE = page.getByPlaceholder("Products / Services you are looking for").first();
    this.PRODUCT_SERVICE_CSS = page.locator('input[placeholder="Products / Services you are looking for"]').first();

    this.QUANTITY = page.getByPlaceholder("Quantity").first();
    this.QUANTITY_CSS = page.locator('input[placeholder="Quantity"]').first();

    this.UNIT_LABEL = page.getByText("Unit of Measurement", { exact: true }).first();
    this.UNIT_INPUT = page.locator('input[placeholder="Unit of Measurement"]').first();
    this.UNIT_SELECT_CSS = page.locator('select#quantity_unit, select[name*="unit" i]').first();
    this.UNIT_SELECTED_OPTION = this.UNIT_SELECT_CSS.locator("option:checked");

    this.MOBILE = page.getByPlaceholder("Enter Mobile Number").first();
    this.MOBILE_CSS = page.locator('input[placeholder="Enter Mobile Number"]').first();

    this.SUPPLIER_PREFERENCE_TEXT = page.getByText("Supplier Preference", { exact: true }).first();
    this.PREFERENCE_LABELS = page.locator("label");
    this.STATE_SELECT_CSS = page.locator('select[name*="state" i], select[id*="state" i]').first();
    this.STATE_OPTIONS = page.locator("div:visible, li:visible, label:visible, span:visible");

    this.SUBMIT_REQUIREMENT = page.getByRole("button", { name: "Submit Requirement", exact: true }).first();

    this.OTP_INPUT = page.locator('input[name*="otp" i], input[id*="otp" i], input[placeholder*="otp" i]').first();
    this.OTP_TEXT = page.getByText(/one.?time password|OTP/i).first();
    this.VALIDATION_MESSAGES = page.locator(
      '.error, .error-msg, .validation, .invalid-feedback, [class*="error" i], [class*="invalid" i]'
    );
  }
}
