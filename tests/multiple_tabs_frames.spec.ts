import { test } from "../custom_fixtures/customTest";
import { decrypt } from "../utils/CryptoJsUtil";
import { tags } from "../utils/testTags";

test.describe(`Test Multiple Tabs and Frames @${tags.MultiTabFrameTests}`, () => {
  test.beforeEach(async ({ pageObjects }) => {
    await pageObjects.basePage.openUrl(decrypt(process.env.multiTabUrl!));
  });

  test("@MultipleTabs TestCase3", async ({ pageObjects }) => {
    await pageObjects.demoPage.navigateToMultipleWindows();
    await pageObjects.demoPage.validateNewWindow("New Window");
    await pageObjects.demoPage.validateElementalTab("Elemental Selenium");
    await pageObjects.demoPage.validateParentWindowText("Opening a new window");
  });

  test("@Frames TestCase4", async ({ pageObjects }) => {
    await pageObjects.demoPage.navigateToNestedFramesPage();
    await pageObjects.demoPage.validateFrames("MIDDLE", "LEFT", "BOTTOM");
  });
});
