import {test as base} from "@playwright/test";
import path from "path";
import { PageObjectManager } from "../PageObjects/PageObjectManager";

type Fixtures = {
  pageObjects: PageObjectManager;
};

export const test = base.extend<Fixtures>({
  storageState: async ({ storageState }, use, testInfo) => {
    // If a test explicitly sets storageState (e.g., login tests use { cookies: [], origins: [] } to start with a blank session),
    // pass it through as-is instead of overriding with a user's saved session file.
    if (storageState !== undefined && typeof storageState !== 'string') {
      await use(storageState);
      return;
    }
    const browserType = process.env.BROWSER_TYPE || 'chromium';
    const storageStatePath = path.join(process.cwd(), 'storage', `${browserType}-storage-state.json`);
    await use(storageStatePath);
  },
  pageObjects: async ({ page, context }, use) => {
    const manager = new PageObjectManager(page, context);
    await use(manager);
  },
});