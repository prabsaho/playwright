import { Page, BrowserContext } from "playwright/test";
import BasePage from "../BasePage";
import { Timeouts } from "../../utils/commonUtils";


export default class LoginPage extends BasePage {
  private readonly userNameTextBox = '#inputUsername';
  private readonly passwordTextBox = '[name="inputPassword"]';
  private readonly signInBtn = '.signInBtn';
  private readonly loginPagePlaceHolderLocator = '//div[contains(@class,"overlay-right")]/h1';

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }

  /**
   * Logins to Rahul Shetty's Practice Automation site for Login Tests.
   * @param userName - The SSO ID of the user.
   * @param password - The SSO password of the user.
   */
  async loginToLoginPractice(
    userName: string,
    password: string,
    pageInstance?: Page,
  ): Promise<void> {
    const page = pageInstance ?? this.page;
    await this.fillTextBox(this.userNameTextBox, userName);
    await this.fillTextBox(this.passwordTextBox, password);
    await this.clickElement(this.signInBtn);
    await page.waitForLoadState("networkidle", { timeout: Timeouts.OneMinuteTime });
  }
  async verifyLoginPagePlaceHolderText(
    expectedText: string,
    ){
    await this.verifyText(this.loginPagePlaceHolderLocator, expectedText);
  }
}

