import { LoginPageTestData } from "../testdata/LoginPageTestData";
import {HomePageTestData} from "../testdata/HomePageTestData";
import { test } from "../custom_fixtures/customTest";
import { tags } from "../utils/testTags";
import {encryptEnvFile, decryptEnvFile} from "../utils/EncryptEnvFile";
import { encrypt ,decrypt} from "../utils/CryptoJsUtil";

test.describe("Login Page Test Cases", () => {
  test.beforeEach(async ({ pageObjects }) => {
    await test.step("Open RahulShetty Login Page", async () => {
      await pageObjects.basePage.openUrl(decrypt(process.env.baseUrl!));
      // await pageObjects.loginPage.loginToLoginPractice(decrypt(process.env.userName!), decrypt(process.env.password!));
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
        const text1=HomePageTestData.placeHolderText1+" "+decrypt(process.env.userName!)+",";
        await pageObjects.homePage.verifyHomePagePlaceHolderTexts(
          text1,
          HomePageTestData.placeHolderText2,
          HomePageTestData.placeHolderText3
        );
    }
  );
//   test.only("descriction",async ({ pageObjects }) => {
//         // test.setTimeout(280000);
//         console.log(process.env.NODE_ENV);
//         console.log(process.env.userName);
//         console.log(process.env.password);
//     }
//   );

// test.only("utility",async ({ pageObjects }) => {
//     const plainText = "Hello, World!";
//     const encryptedText=encrypt(plainText);
//     console.log('SALT:' + process.env.SALT);
//     console.log('Encrypted Text: ' + encryptedText);
//     const decryptedText=decrypt(encryptedText);
//     console.log('Decrypted Text: ' + decryptedText);
//     encryptEnvFile();
//     }
//   );

});