import { LoginPageTestData } from "../testdata/LoginPageTestData";
import {HomePageTestData} from "../testdata/HomePageTestData";
import { test } from "../custom_fixtures/customTest";
import { tags } from "../utils/testTags";

test.describe("Login Page Test Cases", () => {
  test.beforeEach(async ({ pageObjects }) => {
    await test.step("Open RahulShetty Login Page", async () => {
      await pageObjects.basePage.openUrl(LoginPageTestData.loginUrl);
      await pageObjects.loginPage.loginToLoginPractice(LoginPageTestData.userName, LoginPageTestData.password);
    });
  });

  test.afterEach(async ({ pageObjects }) => {
    await test.step("Logout From Landing Page", async () => {
      await pageObjects.homePage.clickLogoutButton();
      // await page.waitForTimeout(2000);
      await pageObjects.loginPage.verifyLoginPagePlaceHolderText(LoginPageTestData.placeHolderText);
    });
  });

  /**
   * This Test covers the below test case Ids
   * TC01: Verify User logged in succesfully with valid credentials
   */
  test(
    `Verify User logged in succesfully with valid credentials & login button is enabled @${tags.LoginTests}`,
    async ({ pageObjects }) => {
        // test.setTimeout(280000);
        await pageObjects.homePage.verifyLogoutButtonIsEnabled();
        const text1=HomePageTestData.placeHolderText1+" "+LoginPageTestData.userName+",";
        await pageObjects.homePage.verifyHomePagePlaceHolderTexts(
          text1,
          HomePageTestData.placeHolderText2,
          HomePageTestData.placeHolderText3
        );
    }
  );
});