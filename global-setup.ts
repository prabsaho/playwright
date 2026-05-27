import { chromium, firefox, webkit, Browser, BrowserType } from "@playwright/test";
import fs from "fs";
import path from "path";
import { encrypt ,decrypt} from "./utils/CryptoJsUtil";

const userNameField = "#inputUsername";
const passwordField = "[name='inputPassword']";
const signInBtn = ".signInBtn";

type SupportedBrowser = "chromium" | "firefox" | "webkit";

async function loginAndSaveState(
  browser: Browser,
  username: string,
  password: string,
  storagePath: string
): Promise<void> {
  const context = await browser.newContext();
  const page = await context.newPage();
  const url = decrypt(process.env.baseUrl!);

  if (!url) {
    throw new Error("baseUrl is undefined");
  }

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.fill(userNameField, username
  );
  await page.fill(passwordField, password);
  await page.click(signInBtn);
  await page.waitForLoadState("networkidle", { timeout: 60000 });
  await context.storageState({ path: storagePath });
  await context.close();
}

async function globalSetup(): Promise<void> {
  console.log("Global Setup script started running");

  const browserTypeName = (process.env.BROWSER_TYPE || "chromium") as SupportedBrowser;

  const browserTypeMap: Record<SupportedBrowser, BrowserType> = {
    chromium,
    firefox,
    webkit,
  };

  const browser = await browserTypeMap[browserTypeName].launch({ headless: false });

  const username = decrypt(process.env.userName!);
  const password = decrypt(process.env.password!);
  const storageFolder = path.join(process.cwd(), "storage");
  const storagePath = path.join(storageFolder, `${browserTypeName}-storage-state.json`);
  if (!fs.existsSync(storageFolder)) {
  fs.mkdirSync(storageFolder, { recursive: true });
}


  if (!username || !password) {
    throw new Error("USER_NAME or PASSWORD is missing");
  }

  console.log(`Logging in as ${username}...`);
  await loginAndSaveState(browser, username, password, storagePath);

  console.log("Global Setup completed");
  await browser.close();
}

export default globalSetup;