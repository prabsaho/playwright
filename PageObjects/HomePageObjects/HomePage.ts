import { expect, Page, BrowserContext } from "playwright/test";
import BasePage from "../BasePage";
import { Timeouts } from "../../utils/commonUtils";

export default class HomePage extends BasePage {
 
  private readonly logoutButton = '.logout-btn';
  private readonly homaPagePlaceHolder1='[class="login-container"] h2';
  private readonly homaPagePlaceHolder2='[class="login-container"] h1';
  private readonly homaPagePlaceHolder3='[class="login-container"] p';

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }

  async clickLogoutButton() {
    await this.clickElement(this.logoutButton, { timeout: Timeouts.ShortWaitTime });
  }
  async verifyHomePagePlaceHolderTexts(
    placeHolderText1: string,
    placeHolderText2: string,
    placeHolderText3: string
  ) {
    await this.waitForElement(this.logoutButton);
    await this.verifyText(this.homaPagePlaceHolder1, placeHolderText1);
    await this.verifyText(this.homaPagePlaceHolder2, placeHolderText2);
    await this.verifyText(this.homaPagePlaceHolder3, placeHolderText3);
  }
  async verifyLogoutButtonIsEnabled() {
    await this.verifyElementIsEnabled(this.logoutButton);
  }

}
