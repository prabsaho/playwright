import {
  chromium,
  firefox,
  webkit,
  Browser,
  expect,
} from "@playwright/test";
import {
  ProcessEnvironmentConfiguration,
  testUsers,
  getStorageStatePath,
} from "./utils/testUtils";

const singleSignOnText = "#company-logo-div-text";
const ssoIdInputField = "#identifierInput";
const ssoSubmitButton = "#post-button";
const ssoPasswordInputField = "#password";
const ssoLoginButton = "#remember-me-login-button";
const planOsUserNameInputField = '[data-testid="userNameTestId"]';
const planOsPasswordInputField = '[data-testid="passwordTestId"]';
const planOsLoginButton = '[data-testid="buttonTestId"][type="submit"]';
const loginPlaceHolder2 = '[data-testid="UserIconsTestId"]';
const loginPlaceHolder1 = '[class="hover:underline"]';
const geVernovaLogo = '(//*[@alt="GE Vernova logo"])[1]';
const planOsHeader = '(//*[@alt="GE Vernova logo"])[1]/parent::div//following-sibling::h1';

async function loginAndSaveState(
  browser: Browser,
  username: string,
  password: string,
  storagePath: string
) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const url = ProcessEnvironmentConfiguration.baseUrl;

  if (typeof url !== "string")
    throw new Error("BASE_URL is undefined");

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  const ssoText = page.locator(singleSignOnText);
  const loginPH = page.locator(loginPlaceHolder1);

  await ssoText
    .waitFor({ state: "visible", timeout: 5000 })
    .catch(() => {});
  await loginPH
    .waitFor({ state: "visible", timeout: 5000 })
    .catch(() => {});

  if ((await ssoText.isVisible()) || !(await loginPH.isVisible())) {
    await page.fill(ssoIdInputField, ProcessEnvironmentConfiguration.ssoId);
    await page.click(ssoSubmitButton);
    await page.fill(
      ssoPasswordInputField,
      ProcessEnvironmentConfiguration.ssoPassword
    );
    await page.click(ssoLoginButton);
  }

  await page.fill(planOsUserNameInputField, username);
  await page.fill(planOsPasswordInputField, password);
  await expect(page.locator(loginPlaceHolder2)).toBeVisible();
  await expect(page.locator(loginPlaceHolder1)).toBeVisible();
  await expect(page.locator(geVernovaLogo)).toBeVisible();
  await expect(page.locator(planOsHeader)).toHaveText("PlanOS");
  await page.click(planOsLoginButton);
  await page.waitForLoadState("networkidle");
  await page.getByTestId("UserIconsTestId").waitFor({ timeout: 60000 });
  await expect(page.locator(loginPlaceHolder1)).toHaveText("Home");

  await page.context().storageState({ path: storagePath });
  await context.close();
}

async function globalSetup() {
  console.log("Global Setup script started running");

  const browser = await {
    chromium,
    firefox,
    webkit,
  }[ProcessEnvironmentConfiguration.browserType].launch({ headless: true });

  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    const storagePath = getStorageStatePath(i + 1);
    console.log(`Logging in as ${user.username}...`);
    await loginAndSaveState(browser, user.username, user.password, storagePath);
  }

  console.log("Global Setup completed");
  await browser.close();
}

export default globalSetup;