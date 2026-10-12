import { expect, Locator, Page } from "@playwright/test";
import { RequirementPageUIStore } from "../ui-store/RequirementPageUIStore";
import { executeAction } from "../utils/actionHelper";
import { logger } from "../utils/logger";

export type RequirementField = "product" | "quantity" | "mobile";

export class RequirementPage {
  private readonly page: Page;
  private readonly ui: RequirementPageUIStore;

  public constructor(page: Page) {
    this.page = page;
    this.ui = new RequirementPageUIStore(page);
  }

  /**
   * Author: Subham Maharana
   * Method Name: open
   * Description: Opens the requirement page directly and verifies Requirement Details.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async open(): Promise<void> {
    await executeAction(this.page, "RequirementPage.open", async () => {
      try {
        await this.page.goto("/post-buy-requirement.php", { waitUntil: "domcontentloaded" });
        await expect(this.ui.REQUIREMENT_DETAILS).toBeVisible();
      } catch (error) {
        logger.error(`RequirementPage.open failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyCoreFields
   * Description: Verifies the mandatory controls required by the buyer requirement form.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async verifyCoreFields(): Promise<void> {
    await executeAction(this.page, "RequirementPage.verifyCoreFields", async () => {
      try {
        await expect(this.ui.PRODUCT_SERVICE).toBeVisible();
        await expect(this.ui.QUANTITY).toBeVisible();

        const unitLabelVisible = await this.ui.UNIT_LABEL.isVisible().catch(() => false);
        if (unitLabelVisible) {
          await expect(this.ui.UNIT_LABEL).toBeVisible();
        } else {
          await expect(this.ui.UNIT_INPUT).toBeVisible();
        }

        await expect(this.ui.MOBILE).toBeVisible();
        await expect(this.ui.SUBMIT_REQUIREMENT).toBeVisible();
        await expect(this.ui.SUPPLIER_PREFERENCE_TEXT).toBeVisible();
      } catch (error) {
        logger.error(`RequirementPage.verifyCoreFields failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: fillProduct
   * Description: Fills Product / Service and verifies the entered value.
   * Parameters: value - product/service value.
   * Return Type: Promise<void>.
   */
  public async fillProduct(value: string): Promise<void> {
    await executeAction(this.page, `RequirementPage.fillProduct:${value}`, async () => {
      try {
        await expect(this.ui.PRODUCT_SERVICE_CSS).toBeVisible();
        await this.ui.PRODUCT_SERVICE_CSS.fill(value);
        await expect(this.ui.PRODUCT_SERVICE_CSS).toHaveValue(value);
      } catch (error) {
        logger.error(`RequirementPage.fillProduct:${value} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: fillQuantity
   * Description: Fills Quantity and verifies the entered value.
   * Parameters: value - quantity value.
   * Return Type: Promise<void>.
   */
  public async fillQuantity(value: string): Promise<void> {
    await executeAction(this.page, `RequirementPage.fillQuantity:${value}`, async () => {
      try {
        await expect(this.ui.QUANTITY_CSS).toBeVisible();
        await this.ui.QUANTITY_CSS.fill(value);
        await expect(this.ui.QUANTITY_CSS).toHaveValue(value);
      } catch (error) {
        logger.error(`RequirementPage.fillQuantity:${value} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: selectUnit
   * Description: Selects a unit from the native unit selector and verifies the selection.
   * Parameters: value - unit label.
   * Return Type: Promise<void>.
   */
  public async selectUnit(value: string): Promise<void> {
    await executeAction(this.page, `RequirementPage.selectUnit:${value}`, async () => {
      try {
        await expect(this.ui.UNIT_SELECT_CSS).toBeAttached();

        try {
          await this.ui.UNIT_SELECT_CSS.selectOption({ label: value });
        } catch {
          await this.ui.UNIT_SELECT_CSS.evaluate((element, unitValue) => {
            const select = element as HTMLSelectElement;
            const option = [...select.options].find((item) => item.text.trim() === String(unitValue));
            if (!option) {
              throw new Error(`Unit option not found: ${String(unitValue)}`);
            }
            select.value = option.value;
            option.selected = true;
            select.dispatchEvent(new Event("input", { bubbles: true }));
            select.dispatchEvent(new Event("change", { bubbles: true }));
          }, value);
        }

        await expect(this.ui.UNIT_SELECTED_OPTION).toHaveText(value);
      } catch (error) {
        logger.error(`RequirementPage.selectUnit:${value} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: selectInterestedInIfAvailable
   * Description: Selects the Interested in option when the live UI exposes it;
   * otherwise logs the UI change and continues without a synthetic interaction.
   * Parameters: value - interested-in value.
   * Return Type: Promise<void>.
   */
  public async selectInterestedInIfAvailable(value: string): Promise<void> {
    await executeAction(this.page, `RequirementPage.selectInterestedInIfAvailable:${value}`, async () => {
      try {
        const option = this.page.getByText(value, { exact: true }).last();
        const optionVisible = (await option.count()) > 0 && (await option.isVisible().catch(() => false));

        if (optionVisible) {
          await option.click();
          await expect(option).toBeVisible();
        } else {
          logger.info("Interested in control is not exposed by the current UI; continuing.");
        }
      } catch (error) {
        logger.error(`RequirementPage.selectInterestedInIfAvailable:${value} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: selectSupplierPreference
   * Description: Selects a supplier preference and verifies the option is active.
   * Parameters: value - supplier preference label.
   * Return Type: Promise<void>.
   */
  public async selectSupplierPreference(value: string): Promise<void> {
    await executeAction(this.page, `RequirementPage.selectSupplierPreference:${value}`, async () => {
      try {
        const byLabel = this.page.getByLabel(value, { exact: true }).first();
        const labelInput = this.ui.PREFERENCE_LABELS.filter({ hasText: value }).locator("input").first();

        if ((await byLabel.count()) > 0 && (await byLabel.isVisible().catch(() => false))) {
          await byLabel.check();
          await expect(byLabel).toBeChecked();
        } else if ((await labelInput.count()) > 0) {
          await labelInput.check();
          await expect(labelInput).toBeChecked();
        } else {
          const text = this.page.getByText(value, { exact: true }).last();
          await text.click();
          await expect(text).toBeVisible();
        }
      } catch (error) {
        logger.error(`RequirementPage.selectSupplierPreference:${value} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifySupplierPreferenceOptions
   * Description: Selects every supplier preference option in turn and verifies
   * that the option label stays visible.
   * Parameters: options - supplier preference labels.
   * Return Type: Promise<void>.
   */
  public async verifySupplierPreferenceOptions(options: string[]): Promise<void> {
    try {
      for (const option of options) {
        await this.selectSupplierPreference(option);
        await executeAction(this.page, `RequirementPage.verifySupplierPreferenceOption:${option}`, async () => {
          const label = this.page.getByText(option, { exact: true }).last();
          await label.scrollIntoViewIfNeeded();
          await expect(label).toBeVisible();
        });
      }
    } catch (error) {
      logger.error(`RequirementPage.verifySupplierPreferenceOptions failed: ${String(error).split("\n")[0]}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: selectStates
   * Description: Selects multiple states using the native multi-select when
   * available, otherwise by clicking the visible state labels.
   * Parameters: values - state labels.
   * Return Type: Promise<void>.
   */
  public async selectStates(values: string[]): Promise<void> {
    await executeAction(this.page, "RequirementPage.selectStates", async () => {
      try {
        const normalize = (text: string): string => text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");

        if ((await this.ui.STATE_SELECT_CSS.count()) > 0) {
          const selected = await this.ui.STATE_SELECT_CSS.evaluate((element, requestedStates) => {
            const select = element as HTMLSelectElement;
            const normalize = (text: string): string =>
              text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
            const selectedOptions: string[] = [];

            for (const requestedState of requestedStates as string[]) {
              const target = normalize(requestedState);
              const option = Array.from(select.options).find((item) => normalize(item.textContent ?? "") === target);
              if (!option) {
                throw new Error(`State option not found: ${requestedState}`);
              }
              option.selected = true;
              selectedOptions.push((option.textContent ?? "").trim());
            }

            select.dispatchEvent(new Event("input", { bubbles: true }));
            select.dispatchEvent(new Event("change", { bubbles: true }));
            return selectedOptions;
          }, values);

          for (const value of values) {
            expect(selected.some((item) => normalize(item) === normalize(value))).toBeTruthy();
          }
        } else {
          for (const value of values) {
            const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const option = this.ui.STATE_OPTIONS
              .filter({ hasText: new RegExp(`^\\s*${escapedValue}\\s*$`, "i") })
              .last();
            await expect(option).toBeVisible();
            await option.click();
          }
        }
      } catch (error) {
        logger.error(`RequirementPage.selectStates failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: fillMobile
   * Description: Fills Mobile Number and verifies the entered value.
   * Parameters: value - mobile number.
   * Return Type: Promise<void>.
   */
  public async fillMobile(value: string): Promise<void> {
    await executeAction(this.page, `RequirementPage.fillMobile:${value}`, async () => {
      try {
        await expect(this.ui.MOBILE_CSS).toBeVisible();
        await this.ui.MOBILE_CSS.fill(value);
        await expect(this.ui.MOBILE_CSS).toHaveValue(value);
      } catch (error) {
        logger.error(`RequirementPage.fillMobile:${value} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyMobileFormat
   * Description: Verifies that the mobile input holds the supplied value.
   * Parameters: expectedValue - expected mobile value.
   * Return Type: Promise<void>.
   */
  public async verifyMobileFormat(expectedValue: string): Promise<void> {
    await executeAction(this.page, `RequirementPage.verifyMobileFormat:${expectedValue}`, async () => {
      try {
        await expect(this.ui.MOBILE_CSS).toHaveValue(expectedValue);
      } catch (error) {
        logger.error(`RequirementPage.verifyMobileFormat:${expectedValue} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: submit
   * Description: Clicks Submit Requirement and verifies the page is still responsive.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async submit(): Promise<void> {
    await executeAction(this.page, "RequirementPage.submit", async () => {
      try {
        await expect(this.ui.SUBMIT_REQUIREMENT).toBeVisible();
        await this.ui.SUBMIT_REQUIREMENT.click();
        await expect(this.ui.BODY).toBeVisible();
      } catch (error) {
        logger.error(`RequirementPage.submit failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyOtpVisible
   * Description: Verifies the OTP input or OTP text is displayed after a valid submission.
   * Parameters: None.
   * Return Type: Promise<void>.
   */
  public async verifyOtpVisible(): Promise<void> {
    await executeAction(this.page, "RequirementPage.verifyOtpVisible", async () => {
      try {
        await expect(this.ui.OTP_INPUT.or(this.ui.OTP_TEXT)).toBeVisible();
      } catch (error) {
        logger.error(`RequirementPage.verifyOtpVisible failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyNoOtpAndValidation
   * Description: Verifies an invalid submission shows validation evidence for the
   * given field and does not open the OTP step.
   * Parameters: fieldName - field that holds the invalid value.
   * Return Type: Promise<void>.
   */
  public async verifyNoOtpAndValidation(fieldName: RequirementField): Promise<void> {
    await executeAction(this.page, `RequirementPage.verifyNoOtpAndValidation:${fieldName}`, async () => {
      try {
        const field = this.getFieldLocator(fieldName);

        await expect.poll(async () => this.hasValidationEvidence(field)).toBeTruthy();
        await expect(this.ui.OTP_INPUT).toBeHidden();
      } catch (error) {
        logger.error(`RequirementPage.verifyNoOtpAndValidation:${fieldName} failed: ${String(error).split("\n")[0]}`);
        throw error;
      }
    });
  }

  /**
   * Author: Subham Maharana
   * Method Name: getFieldLocator
   * Description: Maps a field name to its UI Store locator.
   * Parameters: fieldName - requirement form field name.
   * Return Type: Locator.
   */
  private getFieldLocator(fieldName: RequirementField): Locator {
    switch (fieldName) {
      case "product":
        return this.ui.PRODUCT_SERVICE_CSS;
      case "quantity":
        return this.ui.QUANTITY_CSS;
      case "mobile":
        return this.ui.MOBILE_CSS;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: hasValidationEvidence
   * Description: Checks native validity, aria-invalid, error elements and
   * validation keywords for evidence that a field was rejected.
   * Parameters: field - field locator.
   * Return Type: Promise<boolean>.
   */
  private async hasValidationEvidence(field: Locator): Promise<boolean> {
    const nativeMessage = await field
      .evaluate((element) => (element as HTMLInputElement).validationMessage ?? "")
      .catch(() => "");

    const invalid = await field
      .evaluate((element) => {
        const input = element as HTMLInputElement;
        return !input.checkValidity() || input.getAttribute("aria-invalid") === "true";
      })
      .catch(() => false);

    const errorElements = await this.ui.VALIDATION_MESSAGES.count().catch(() => 0);
    const bodyText = await this.ui.BODY.innerText();
    const hasValidationKeyword = /required|invalid|valid mobile|must be greater|enter a valid/i.test(bodyText);

    return invalid || Boolean(nativeMessage) || errorElements > 0 || hasValidationKeyword;
  }
}
