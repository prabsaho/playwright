import { Page, BrowserContext } from "@playwright/test";
import LoginPage from "./LoginPageObjects/LoginPage";
import HomePage from "./HomePageObjects/HomePage";
import DemoPage from "./DemoPage";
import BasePage from "./BasePage";


export class PageObjectManager {
  constructor(
    private readonly page: Page,
    private readonly context: BrowserContext
  ) { }

  private _basePage?: BasePage;
  private _loginPage?: LoginPage;
  private _homePage?: HomePage;
  private _demoPage?: DemoPage;
  


  get basePage(): BasePage {
    return (this._basePage ??= new BasePage(this.page, this.context));
  }

  get loginPage(): LoginPage {
    return (this._loginPage ??= new LoginPage(this.page, this.context));
  }
  get homePage(): HomePage {
    return (this._homePage ??= new HomePage(this.page, this.context));
  }

  get demoPage(): DemoPage {
    return (this._demoPage ??= new DemoPage(this.page, this.context));
  }
}

