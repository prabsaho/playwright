import { test } from "../custom_fixtures/customTest";

test.describe("Multiple Tabs and Frames",{tag: '@TabsFrames'}, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/", {
      waitUntil: "networkidle",
      timeout: 60000,
    });
  });

  test.only("@MultipleTabs TestCase3", async ({ pageObjects }) => {
    await pageObjects.demoPage.navigateToMultipleWindows();
    await pageObjects.demoPage.validateNewWindow("New Window");
    await pageObjects.demoPage.validateElementalTab("Elemental Selenium");
    await pageObjects.demoPage.validateParentWindowText("Opening a new window");
  });

  test.only("@Frames TestCase4", async ({ pageObjects }) => {
    await pageObjects.demoPage.navigateToNestedFramesPage();
    await pageObjects.demoPage.validateFrames("MIDDLE", "LEFT", "BOTTOM");
  });
});
