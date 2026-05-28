# Playwright Automation Test Framework

## 🎯 Framework Overview

A comprehensive, production-ready **Playwright Test Automation Framework** built with **TypeScript**. This framework implements industry best practices including the Page Object Model (POM) pattern, custom fixtures, multi-browser support, encryption utilities, and advanced test data management.

---

## ✨ Key Features

### 🏗️ **Robust Architecture**

- **Page Object Model (POM)**: Modular, maintainable page abstractions with inheritance
  - `BasePage`: Core functionality and assertion methods
  - `PageObjectManager`: Centralized page object management
  - Dedicated page classes for `LoginPage`, `HomePage`, `DemoPage`
  
- **Custom Test Fixtures**: Extends Playwright's test fixture system
  - Automatic `PageObjectManager` injection
  - Dynamic storage state management based on browser type
  - Lazy-loaded page objects for performance

- **TypeScript Support**: Full type safety with strict typing
  - Strongly typed fixtures and test utilities
  - Interfaces for Excel operations
  - Enum-based timeout configurations

### 🌐 **Multi-Browser & Environment Support**

- **Browser Support**: Chromium, Firefox, WebKit
- **Dynamic Browser Selection**: `BROWSER_TYPE` environment variable
- **Multi-Environment Configuration**:
  - Environment-specific `.env` files (`.env`, `.env.qa`, etc.)
  - Easy switching via `NODE_ENV` variable
  - Centralized configuration management

### 🔐 **Security & Data Encryption**

- **AES Encryption/Decryption**: CryptoJS integration
  - Encrypt sensitive data (credentials, URLs)
  - Customizable salt values via `SALT` environment variable
  - One-time encryption utility for environment files

- **Session & Storage State Management**:
  - Automatic storage state saving per browser
  - Cookie and origin persistence
  - Browser-specific authentication caching

### 📊 **Advanced Test Data Management**

- **Excel Integration**: Full read/write capabilities
  - Search and replace data in Excel sheets
  - Support for multiple worksheets
  - ExcelJS and XLSX libraries

- **Structured Test Data**: Organized test data classes
  - `LoginPageTestData`
  - `HomePageTestData`
  - Easy data maintenance and updates

- **Random Data Generation**:
  - Random string generation
  - Support for variable-length strings
  - Useful for unique test data creation

### 🧪 **Test Execution & Reporting**

- **Global Setup & Teardown**:
  - Automatic login and session caching
  - Pre-test environment setup
  - Post-test cleanup

- **Parallel Test Execution**: Optimized workers for CI/CD
  - Configurable parallelization
  - CI-specific retry logic (2 retries on CI)
  - Parallel testing with multiple workers

- **HTML Reporting**: Auto-generated test reports
  - Opens on failure
  - Detailed test execution logs
  - Screenshot and video captures

- **Test Filtering & Organization**:
  - Tag-based test execution
  - Grep pattern matching
  - Multiple test suites support

### ⏱️ **Timeout Management**

- **Predefined Timeout Enums**:
  - DefaultWaitTime: 30 seconds
  - OneMinuteTime: 60 seconds
  - FourMinutesTime: 4 minutes
  - SixMinutesTime: 6 minutes
  - TenSecondsTime: 10 seconds
  - ShortWaitTime: 5 seconds

### ✅ **Assertion Capabilities**

- **Soft Assertions**: Non-blocking assertions for comprehensive test validation
  - `assertTrue()`: Verify boolean conditions
  - `assertText()`: String validation
  - `assertNumber()`: Numeric comparisons
  - Aggregate failure reporting

### 🛠️ **Utility Libraries**

1. **CommonUtils**: Shared utility functions
2. **CryptoJsUtil**: Encryption and decryption
3. **DateUtils**: Date manipulation
4. **ExcelUtils**: Excel file operations
5. **JsonUtils**: JSON handling
6. **RandomUtils**: Random data generation
7. **TestTags**: Test categorization and filtering
8. **EncryptEnvFile**: Environment variable encryption

---

## 📦 Dependencies

```json
{
  "@playwright/test": "^1.60.0",
  "crypto-js": "^4.2.0",
  "exceljs": "^4.4.0",
  "xlsx": "^0.18.5",
  "dotenv": "^17.4.2",
  "@types/crypto-js": "^4.2.2",
  "@types/exceljs": "^0.5.3",
  "@types/node": "^25.9.1"
}
```

---

## 📂 Project Structure

```
Playwright/
├── PageObjects/                    # Page Object Model classes
│   ├── BasePage.ts                # Base page with common methods
│   ├── DemoPage.ts                # Demo page objects
│   ├── PageObjectManager.ts       # Page object factory
│   ├── HomePageObjects/
│   │   └── HomePage.ts            # Home page specific methods
│   └── LoginPageObjects/
│       └── LoginPage.ts           # Login page specific methods
├── custom_fixtures/
│   └── customTest.ts              # Custom test fixtures
├── tests/                          # Test specifications
│   ├── loginTest.spec.ts
│   ├── example.spec.ts
│   └── multiple_tabs_frames.spec.ts
├── testdata/                       # Test data classes
│   ├── LoginPageTestData.ts
│   ├── HomePageTestData.ts
│   └── randomData.ts
├── utils/                          # Utility functions
│   ├── commonUtils.ts
│   ├── CryptoJsUtil.ts
│   ├── DateUtils.ts
│   ├── excelUtils.ts
│   ├── randomUtils.ts
│   ├── testTags.ts
│   ├── jsonUtils.ts
│   └── EncryptEnvFile.ts
├── config/                         # Environment configurations
├── storage/                        # Browser session states
├── screenshots/                    # Test execution screenshots
├── playwright-report/              # HTML test reports
├── global-setup.ts                # Pre-test setup
├── global-teardown.ts             # Post-test cleanup
├── playwright.config.ts           # Playwright configuration
└── package.json                   # Project dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

---

## 📋 Execution Guidelines

Before running the test cases, set the environment variable & browser.

For QA, use **`NODE_ENV=qa`**.
For Firefox  use **`set BROWSER_TYPE=firefox`**.

Run the test cases using the following commands:

- In Command Prompt: **`npx playwright test --grep loginTests`**
- In PowerShell: **`npx playwright test --grep "loginTests"`**

To use the Encryption:

set SALT=anydesiredvalue

then run the test with utility as description in loginTest.spec.ts
just to run the function encryptEnvFile() which is a one time thing only;