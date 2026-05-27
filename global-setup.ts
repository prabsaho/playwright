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

const usareName = "#company-logo-div-text";
const passwordField = "#identifierInput";


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

  

  await page.fill(username, username);
  await page.fill(passwordField, password);

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