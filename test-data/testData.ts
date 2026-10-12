import { JsonReader } from "../utils/jsonReader";

export interface TestData {
  postRequirement: {
    product: string;
    interestedIn: string;
    quantity: string;
    unit: string;
    supplierPreference: string;
    mobile: string;
    blankValue: string;
    zeroQuantity: string;
    negativeQuantity: string;
    invalidMobile: string;
    supplierPreferenceOptions: string[];
    specificStatesPreference: string;
    states: string[];
  };
  buyers: {
    buyerMenuOptions: string[];
    industryFirst: string;
    industryMiddle: string;
    industryLast: string;
    allIndustries: string[];
    agricultureCategories: string[];
    popularProductsSection: string;
    popularProducts: string[];
    a4Product: string;
    latestLeadPositions: number[];
    connectButton: string;
  };
  expected: {
    callUsAcceptedTexts: string[];
    introText: string;
    buyerMenuCount: number;
    industrySubText: string;
    industryCount: number;
    agricultureUrl: string;
    agricultureHeading: string;
    agricultureMinimumCategoryCount: number;
    textilesUrlPart: string;
    a4UrlPart: string;
    a4Heading: string;
    maskedMobileFormat: string;
    minimumMaskedCount: number;
    registrationUrlPart: string;
    minimumRegistrationInputs: number;
  };
}

export const testData = JsonReader.read<TestData>("test-data/testData.json");
