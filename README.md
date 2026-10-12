# ExportersIndia Playwright E2E - Hybrid Framework (Subham)

## Website
https://www.exportersindia.com/

## Framework
- Playwright + TypeScript
- Hybrid framework: Page Object Model + UI Store + JSON-driven test data
- 4 Page Objects and 4 matching UI Store files
- Reusable `logger`, `runReport`, `screenshot`, `jsonReader`, and `actionHelper` utilities
- `.env` configuration
- Playwright HTML report
- Allure report generation after execution

## Folder Structure

```text
exportersindia-playwright-e2e-subham/
├── pages/
│   ├── HomePage.ts
│   ├── RequirementPage.ts
│   ├── BuyersPage.ts
│   └── BuyerJourneyPage.ts
├── playwright-report/
├── reports/
│   ├── logs/
│   ├── run-report/
│   ├── screenshots/
│   ├── allure-results/
│   └── allure-report/
├── test-data/
│   └── testData.json
├── test-results/
├── tests/
│   ├── testData.ts
│   ├── buyerRequirement.spec.ts
│   └── buyersLeadsAndRegistration.spec.ts
├── ui-store/
│   ├── HomePageUIStore.ts
│   ├── RequirementPageUIStore.ts
│   ├── BuyersPageUIStore.ts
│   └── BuyerJourneyPageUIStore.ts
├── utils/
│   ├── logger.ts
│   ├── runReport.ts
│   ├── screenshot.ts
│   ├── jsonReader.ts
│   └── actionHelper.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── run-tests.js
├── tsconfig.json
└── README.md
```

`node_modules` is intentionally not included in the ZIP. It should be generated locally by `npm install`.

## Framework Flow

```text
Spec (tests/*.spec.ts)
   -> Page Object (pages/*.ts)           - business actions + verifications
      -> executeAction() (utils)         - logging, run report, screenshot, exception handling
         -> UI Store (ui-store/*.ts)     - locators only (UPPERCASE names)
            -> ExportersIndia
Test data: test-data/testData.json -> tests/testData.ts (typed) -> spec -> page method parameters
```

## Coding Standards Implemented
- camelCase for methods and variables
- UPPERCASE locator properties
- PascalCase class names
- meaningful names
- centralized `executeAction()` wrapper for logging/reporting/exception handling
- `try/catch` in every Page Object method: the error is logged with the method name and rethrown so the test still fails and `executeAction()` records and screenshots it
- screenshot on failures
- Page Object methods do not repeat logger/runReport/screenshot boilerplate
- JSDoc on methods (Author, Method Name, Description, Parameters, Return Type)
- Page Object and UI Store separation
- one UI Store per Page Object
- locators are declared in the UI Store; Page Objects only receive data through method parameters
- Playwright built-in locators (`getByRole`, `getByText`, `getByPlaceholder`, `getByLabel`) mixed with simple CSS
- verification after actions using Playwright's auto-waiting `expect` (no hard waits)
- JSON-driven test data
- `beforeEach` / `afterEach` hooks in every spec - failed tests are recorded and screenshotted

## Test Cases Covered

The project covers the 20 test cases of the SUBHAM tab (Member 4 - Buyer Requirements & Buy Leads):
- TS_0061 - TS_0069 : Post Buy Requirement form (`buyerRequirement.spec.ts`)
- TS_0070 - TS_0080 : Buy Leads page, industry pages, popular products, latest leads, registration (`buyersLeadsAndRegistration.spec.ts`)

## Important Live-Site Notes
- `Interested in` is selected only when the live Post Buy Requirement page exposes it; otherwise the step is logged and skipped (no synthetic control is invented).
- The header support text accepts the historical `Call us : 9700-318-318` wording as well as the current `Support : +91-9700318318` wording (both listed in `callUsAcceptedTexts`).
- The Buyers breadcrumb is used when exposed; otherwise the Buyers page is opened directly and the landing page is verified.
- No OTP is entered, bypassed or guessed. `TS_0062` only verifies that the OTP step is displayed.

## Installation

```bash
npm install
npx playwright install chromium
```

If you already have Playwright browsers installed, the second command is optional.

## Execution

Headless:

```bash
npm test
```

Headed:

```bash
npm run test:headed
```

Chromium only:

```bash
npm run test:chromium
```

TypeScript check:

```bash
npm run typecheck
```

Open Playwright HTML report:

```bash
npm run report
```

Generate Allure report manually:

```bash
npm run allure:generate
```

Open Allure:

```bash
npm run allure:open
```

The `test` script uses `run-tests.js`, which runs Playwright and then generates the Allure HTML report even when one or more tests fail. If a run is interrupted before the script completes, run `npm run allure:generate` after execution.

## Test Data

All functional test values are stored in:

```text
test-data/testData.json
```

Sections:
- `postRequirement` - form values, plus blank, zero, negative and invalid values for the negative scenarios
- `buyers` - industry names, agriculture categories, popular products, lead positions, button text
- `expected` - header support texts, intro sentence, counts, URL fragments, headings, masked mobile format

No functional test value is hardcoded inside the spec files.

## Environment

Copy `.env.example` to `.env` if required and update:

```text
BASE_URL=https://www.exportersindia.com
BROWSER=chromium
HEADLESS=true
TEST_TIMEOUT=60000
EXPECT_TIMEOUT=10000
ACTION_TIMEOUT=20000
```

Do not commit real credentials or production-sensitive data into `.env`.

## Reports

After execution:
- Playwright HTML report: `playwright-report/`
- Allure raw results: `reports/allure-results/`
- Allure HTML report: `reports/allure-report/`
- Framework logs: `reports/logs/execution.log`
- Framework run report: `reports/run-report/test-report.json`
- Failure screenshots: `reports/screenshots/`

## Source References

The implementation is based on the SUBHAM tab of the team test-case workbook (TS_0061 - TS_0080) and the Playwright Best Practices followed in the reference project.
