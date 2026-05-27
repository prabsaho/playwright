import { Page, BrowserContext } from "playwright/test";
import BasePage from "./BasePage";

export default class DemoPage extends BasePage {
  private readonly bottomFrameLocator = '[name="frame-bottom"]';
  private readonly elementalButton = '//*[text()="Elemental Selenium"]';
  private readonly elementalTabTextLocator = '[class="hero__title"]';
  private readonly frameText = "body";
  private readonly leftFrameLocator = '[name="frame-left"]';
  private readonly middleFrameLocator = '[name="frame-middle"]';
  private readonly middleFrameText = "#content";
  private readonly multipleWindowsButton = '//*[text()="Multiple Windows"]';
  private readonly nestedFramesLocator = '//*[text()="Nested Frames"]';
  private readonly newTabButton = '//*[text()="Click Here"]';
  private readonly newTabTextLocator = "h3";
  private readonly parentWindowTextLocator = "h3";
  private readonly topFrameLocator = '[name="frame-top"]';

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }
  async navigateToMultipleWindows() {
    this.clickElement(this.multipleWindowsButton, { timeout: 6000 });
  }
  async validateNewWindow(text: string) {
    const tabHandle = await this.getnewTabInstance(this.newTabButton);
    await this.verifyText(this.newTabTextLocator, text, {
      instance: tabHandle,
    });
  }
  async validateElementalTab(text: string) {
    const tabHandle = await this.getnewTabInstance(this.elementalButton);
    await this.verifyText(this.elementalTabTextLocator, text, {
      instance: tabHandle,
    });
  }
  async validateParentWindowText(text: string) {
    await this.verifyText(this.parentWindowTextLocator, text);
  }
  async navigateToNestedFramesPage() {
    this.clickElement(this.nestedFramesLocator);
  }
  async validateFrames(
    middleText: string,
    leftText: string,
    bottomText: string
  ) {
    const topFrameHandle = await this.getFrameHandle(this.topFrameLocator);
    const middleFrameLocator = await this.getFrameHandle(
      this.middleFrameLocator,
      { instance: topFrameHandle }
    );
    const leftFrameLocator = await this.getFrameHandle(this.leftFrameLocator, {
      instance: topFrameHandle,
    });
    const bottomFrameHandle = await this.getFrameHandle(
      this.bottomFrameLocator
    );
    await this.verifyText(this.middleFrameText, middleText, {
      instance: middleFrameLocator,
    });
    await this.verifyText(this.frameText, leftText, {
      instance: leftFrameLocator,
    });
    await this.verifyText(this.frameText, bottomText, {
      instance: bottomFrameHandle,
    });
  }
}


