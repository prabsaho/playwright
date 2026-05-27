import {
  expect,
  Page,
  BrowserContext,
  Frame,
  ElementHandle,
  Locator,
} from "playwright/test";
import fs from "fs";

export default class BasePage {
  constructor(public page: Page, public context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async assertTrue(
    condition: boolean,
    message: string = 'Condition is not true'
  ): Promise<void> {
    expect.soft(condition, message).toBeTruthy();
  }

  async assertText(
    actualText: string,
    expectedText: string
  ): Promise<void> {
    expect.soft(actualText).toBe(expectedText);
  }

  async assertNumber(
    actualNumber: number,
    expectedNumber: number
  ): Promise<void> {
    expect.soft(actualNumber).toBe(expectedNumber);
  }
  
  async openUrl(
    url: string ,
    options?: { timeout?: number}
  ) {
    const timeout = options?.timeout ?? 10000;
    await this.page.goto(url, { timeout });
  }
  async clickElement(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await elementLocator.click({ timeout });
  }

  async fillTextBox(
    elementLocator: string | Locator,
    valueToFill: string | number,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    // Convert number to string if needed
    const numberToFill = typeof valueToFill === 'number'
      ? valueToFill.toString()
      : valueToFill;
    await elementLocator.fill(numberToFill, { timeout });
  }  
  async getText(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<string> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    let text = await elementLocator.textContent({ timeout });
    return text || "";
  }

  async getInputText(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<string> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    let text = await elementLocator.inputValue({ timeout });
    return text || "";
  }  
  async matchScreenshot(
    elementLocator: string | Locator,
    actualSSName: string,
    expectedSSName: string,
    options?: {
      timeout?: number;
      maxDiffPixelRatio?: number;
      maxDiffPixels?: number;
      threshold?: number;
      instance?: Page | Frame;
    }
  ) {
    const timeout = options?.timeout ?? 10000;
    const page = options?.instance ?? this.page;
    const maxDiffPixelRatio = options?.maxDiffPixelRatio ?? 0.2;
    const maxDiffPixels = options?.maxDiffPixels ?? 1000;
    const threshold = options?.threshold ?? 0.2;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect(elementLocator).toBeVisible({ timeout });
    expect(
      await elementLocator.screenshot({ path: actualSSName })
    ).toMatchSnapshot(expectedSSName, {
      maxDiffPixelRatio,
      maxDiffPixels,
      threshold,
    });
  }  async verifyText(
    elementLocator: string | Locator,
    expectedText: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    const actualText = (await elementLocator.textContent({ timeout }))?.trim() ?? "";
    expect.soft(actualText).toBe(expectedText);
  }

  async verifyElementContainsText(
    elementLocator: string | Locator,
    expectedText: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    const actualText = (await elementLocator.textContent({ timeout }))?.trim() ?? "";
    expect.soft(actualText).toContain(expectedText);
  }  async verifyButtonIsDisplayed(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect.soft(elementLocator).toBeVisible({ timeout });
  }

  async verifyTextIsNotVisible(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect.soft(elementLocator).toBeHidden({ timeout });
  }

  async verifyPageTitle(
    pageTitle: string,
    options?: { timeout?: number; instance?: Page }
  ) {
    const timeout = options?.timeout ?? 10000;
    const page = options?.instance ?? this.page;
    expect(page).toHaveTitle(pageTitle, { timeout });
  }
  /**
   * This verifies a list contains all the locators (e.g. a page contains all necessary tabs)
   * @param listLocator  The list of locator containing similar elements
   * @param expectedList The list of texts we are expecting in the list of locator
   */
  async validateAllItemsInListOfElements(
    listLocator: string | Locator,
    expectedList: string[],
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    const locators = typeof listLocator === 'string'
      ? page.locator(listLocator)
      : listLocator;
    await expect.soft(locators).toHaveText(expectedList, { timeout });
  }

  async getnewTabInstance(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<Page> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    const eleLocator = typeof elementLocator === 'string'
      ? page.locator(elementLocator)
      : elementLocator;
    const [newTab] = await Promise.all([
      this.context.waitForEvent("page"),
      eleLocator.click({ timeout }),
    ]);
    await newTab.waitForLoadState();
    return newTab;
  }

  async getnewPopUpInstance(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page }
  ): Promise<Page> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    const eleLocator = typeof elementLocator === 'string'
      ? page.locator(elementLocator)
      : elementLocator;
    const [newPopUp] = await Promise.all([
      page.waitForEvent("popup"),
      eleLocator.click({ timeout }),
    ]);
    await newPopUp.waitForLoadState();
    return newPopUp;
  }  async getFrameHandle(
    frameSelector: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<Frame> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    const locator =
      typeof frameSelector === 'string'
        ? page.locator(frameSelector)
        : frameSelector;
    const frameElement: ElementHandle | null = await locator.elementHandle({ timeout });

    if (!frameElement) {
      const selectorText = typeof frameSelector === 'string' ? frameSelector : '[Locator provided]';
      throw new Error(
        `Frame with selector ${selectorText} was not found within ${timeout}ms.`
      );
    }

    const frame: Frame | null = await frameElement.contentFrame();

    if (!frame) {
      const selectorText = typeof frameSelector === 'string' ? frameSelector : '[Locator provided]';
      throw new Error(`Unable to get frame from selector ${selectorText}.`);
    }

    return frame;
  }  /**
   * This method clicks on a dropdown & select values from it
   * @param dropDownLocator  In which we have to click to open the dropdown
   * @param dropDownOptions locators for the list of elements containing text present in the dropdown
   * @param expectedText text to search in the locators list & click the locator having that text
   */
  async clickAndSelectValuesFromDropDown(
    dropDownLocator: string | Locator,
    dropDownOptions: string | Locator,
    expectedText: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;

    const dropDown =
      typeof dropDownLocator === 'string'
        ? page.locator(dropDownLocator)
        : dropDownLocator;

    const optionsLocator =
      typeof dropDownOptions === 'string'
        ? page.locator(dropDownOptions)
        : dropDownOptions;

    await this.clickElement(dropDown);
    await page.waitForTimeout(500);
    await optionsLocator.first().waitFor({ timeout });
    await expect(optionsLocator.first()).not.toHaveText('', { timeout });

    const count = await optionsLocator.count();
    let matchedIndex = -1;

    for (let i = 0; i < count; i++) {
      const option = optionsLocator.nth(i);

      const text = await option.textContent({ timeout });
      if (text?.trim() === expectedText.trim()) {
        await option.scrollIntoViewIfNeeded();
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex === -1) {
      throw new Error(`Option with text "${expectedText}" not found in dropdown.`);
    }

    await optionsLocator.nth(matchedIndex).click();
  }
  /**
   * This method verifies the selected value of a dropdown
   * @param elementLocator The locator of the dropdown element
   * @param expectedValue The expected value that should be selected in the dropdown
   * @param options Optional parameters including timeout and instance of Page or Frame
   */
  async verifyDropdownSelectedValue(
    elementLocator: string | Locator,
    expectedValue: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    // The UI may render the dropdown's title attribute with surrounding whitespace,
    // so we poll the attribute and compare the trimmed value as a plain string
    const locator = elementLocator;
    await expect
      .poll(async () => (await locator.getAttribute('title'))?.trim() ?? '', { timeout })
      .toBe(expectedValue.trim());
  }
  /**
   * This verifies a Text is present in a List of locator or not
   * @param listLocator  The list of locator containing similar elements
   * @param expectedText The text we are expecting in the list
   */
  async verifyTextPresentInAList(
    listLocator: string | Locator,
    expectedText: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;

    const list =
      typeof listLocator === 'string'
        ? page.locator(listLocator)
        : listLocator;

    await list.first().waitFor({ timeout });
    const count = await list.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await list.nth(i).textContent({ timeout });
      if (text?.trim().includes(expectedText.trim())) {
        found = true;
        break;
      }
    }
    expect.soft(found).toBe(true);
  }

  async sleep(
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 2000;
    await page.waitForTimeout(timeout);
  }

  async reload(
    options?: { instance?: Page }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    await page.reload();
  }
  /**
   * This verifies a Text is not present in a List of locator
   * @param listLocator  The list of locator containing similar elements
   * @param unexpectedText The text we are not expecting in the list
   */
  async verifyTextNotPresentInList(
    listLocator: string | Locator,
    unexpectedText: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;

    const list =
      typeof listLocator === 'string'
        ? page.locator(listLocator)
        : listLocator;
    const count = await list.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const text = await list.nth(i).textContent({ timeout });
      if (text?.trim().includes(unexpectedText.trim())) {
        found = true;
        break;
      }
    }

    expect.soft(found).toBe(false); // soft assertion
    if (found) {
      console.warn(` Unexpected text "${unexpectedText}" was found in the list.`);
    } else {
      console.log(` Verified: "${unexpectedText}" is NOT present in the list.`);
    }
  }

  async isTextPresentInList(
    listLocator: string | Locator,
    searchText: string,
  ): Promise<boolean> {
    const list =
      typeof listLocator === 'string'
        ? this.page.locator(listLocator)
        : listLocator;
    const count = await list.count();
    for (let i = 0; i < count; i++) {
      const text = await list.nth(i).textContent();
      if (text?.trim() === searchText.trim()) {
        return true;
      }
    }
    return false;
  }  async scrollToElement(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await elementLocator.scrollIntoViewIfNeeded({ timeout });
  }

  async clearTextBox(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await elementLocator.clear({ timeout });
  }

  async waitForElement(
    elementLocator: string | Locator,
    options?: { timeout?: number; state?: "visible" | "hidden" | "attached" | "detached"; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    const state = options?.state ?? "visible";
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await elementLocator.waitFor({ state, timeout });
  }

  /** Wait until an element becomes enabled (not disabled). */
  async waitForElementToBeEnabled(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 30000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect(elementLocator).toBeEnabled({ timeout });
  }
  /**
   * This method clicks on a dropdown having a textbox & select values from it
   * @param dropDownLocator  In which we have to click to open the dropdown
   * @param dropDownOptions locators for the list of elements containing text present in the dropdown
   * @param searchBoxLocator the locator of the dropdown where we can enter the extpected text
   * @param expectedText text to search in the locators list & click the locator having that text
   */
  async clickAndSelectValuesFromDropDownWithSearchBox(
    dropDownLocator: string | Locator,
    dropDownOptions: string | Locator,
    searchBoxLocator: string | Locator,
    expectedText: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;

    const dropDown =
      typeof dropDownLocator === 'string'
        ? page.locator(dropDownLocator)
        : dropDownLocator;

    const optionsLocator =
      typeof dropDownOptions === 'string'
        ? page.locator(dropDownOptions)
        : dropDownOptions;

    const searchBox =
      typeof searchBoxLocator === 'string'
        ? page.locator(searchBoxLocator)
        : searchBoxLocator;

    await this.clickElement(dropDown);
    // await page.waitForTimeout(1000);
    await this.fillTextBox(searchBox, expectedText);
    await optionsLocator.first().waitFor({ timeout });

    const count = await optionsLocator.count();
    let matchedIndex = -1;

    for (let i = 0; i < count; i++) {
      const option = optionsLocator.nth(i);
      const text = await option.textContent({ timeout });
      if (text?.trim() === expectedText.trim()) {
        await option.scrollIntoViewIfNeeded();
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex === -1) {
      throw new Error(`Option with text "${expectedText}" not found in dropdown.`);
    }

    await optionsLocator.nth(matchedIndex).click();
  }
  /**
   * This method uploads a file into UI
   * @param elementLocator must have tag as 'input' & type='File'
   * @param filePath wherever you have stored the input file.
   */
  async uploadFile(
    elementLocator: string | Locator,
    filePath: string,
    options?: { timeout?: number; instance?: Page}
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    // await elementLocator.setInputFiles(filePath, { timeout });
    // Start waiting for file chooser before clicking. Note no await.
    const fileChooserPromise = page.waitForEvent('filechooser');
    await elementLocator.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  async verifyValueOfTextField(
    elementLocator: string | Locator,
    expectedText: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    const actualText = (await elementLocator.getAttribute('value', { timeout }))?.trim() ?? "";
    expect.soft(actualText).toBe(expectedText);
  }

  async returnListofTextsFromALocator(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<string[]> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await this.sleep();
    const texts = await elementLocator.evaluateAll(elements =>
      elements.map(el => el.textContent?.trim() || "")
    );
    return texts;
  }
  async verifyElementIsEnabled(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await this.waitForElement(elementLocator, { timeout });
    await expect.soft(elementLocator).toBeEnabled({ timeout });
  }

  async verifyElementIsDisabled(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect.soft(elementLocator).toBeDisabled({ timeout });
  }  async verifyAttributeNameContainsValue(
    elementLocator: string | Locator,
    attributeName: string,
    expectedAttributeValue: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    const value = await elementLocator.getAttribute(attributeName);
    expect.soft(value?.includes(expectedAttributeValue)).toBeTruthy();
  }

  async verifyAttributeNameHasValue(
    elementLocator: string | Locator,
    attributeName: string,
    expectedAttributeValue: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    const value = await elementLocator.getAttribute(attributeName);
    expect.soft(value).toBe(expectedAttributeValue);
  }

  async verifyFileExistsInTheGivenPath(path: string) {
    expect.soft(fs.existsSync(path)).toBeTruthy();
  }

  async hoverOnElement(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await elementLocator.hover();
  }

  async waitForNonEmptyTextOfAnElement(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect(elementLocator).toBeVisible({ timeout });
    await expect(elementLocator).not.toHaveText('', { timeout });
  }
  /**
   * Presses the Enter key on the keyboard.
   * @param page - Page instance.
   * @param keyEventDelay - Delay in milliseconds between keydown and keyup events.Defaults to 0
   */
  async pressEnterKey(page: Page, keyEventDelay?: number) {
    const keyUpDownDelay = keyEventDelay ?? 0;
    await page.keyboard.press("Enter", { delay: keyUpDownDelay });
  }

  /**
   * Validates that the element is enabled.
   * @param elementLocator - The locator of the element.
   * @param options - Optional configuration.
   *        - timeout - Timeout in milliseconds.Defaults to 10000 in TestConfig.expect.
   *        - instance - Page or Frame instance. Defaults to current page.
   */
  async validateElementEnabled(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance: Page | Frame }
  ): Promise<void> {
    const {
      timeout: _timeout = 0,
      instance: pageOrFrame = this.page,
    } = options ?? {};
    const expectOption = _timeout > 0 ? { timeout: _timeout } : undefined;
    elementLocator =
      typeof elementLocator === "string"
        ? pageOrFrame.locator(elementLocator)
        : elementLocator;
    await expect
      .soft(elementLocator)
      .toBeEnabled(expectOption);
  }
  /**
   * Validates the element has a text.
   * @param elementLocator - The locator of the element.
   * @param expectedText - The expected text.
   * @param options - Optional configuration.
   *        - ignoreCase - Whether to ignore case when comparing text. Defaults to false.
   *        - timeout - Timeout in milliseconds. Defaults to 10000 in TestConfig.expect.
   *        - userInnerText - Whether to use innerText instead of textContent. Defaults to true.
   *        - instance - Page or Frame instance. Defaults to current page.
   */
  async validateElementToHaveText(
    elementLocator: string | Locator,
    expectedText: string | string[],
    options?: {
      ignoreCase?: boolean;
      timeout?: number;
      useInnerText?: boolean;
      instance?: Page | Frame
    }
  ): Promise<void> {
    const {
      ignoreCase: _ignoreCase = false,
      timeout: _timeout = 0,
      useInnerText: _useInnerText = true,
      instance: pageOrFrame = this.page
    } = options ?? {};
    const expectTextOptions: Record<string, any> = {
      ignoreCase: _ignoreCase,
      useInnerText: _useInnerText,
    };
    if (_timeout > 0) {
      expectTextOptions.timeout = _timeout;
    }
    elementLocator =
      typeof elementLocator === "string"
        ? pageOrFrame.locator(elementLocator)
        : elementLocator;
    await expect
      .soft(elementLocator)
      .toHaveText(expectedText, expectTextOptions);
  }

  /**
   * Validates the element does not have a text.
   * @param elementLocator - The locator of the element.
   * @param expectedText - The text that should not be present.
   * @param options - Optional configuration.
   *        - ignoreCase - Whether to ignore case when comparing text. Defaults to false.
   *        - timeout - Timeout in milliseconds. Defaults to 10000 in TestConfig.expect .
   *        - useInnerText - Whether to use innerText instead of textContent. Defaults to true.
   *        - instance - Page or Frame instance. Defaults to current page
   */
  async validateElementNotToHaveText(
    elementLocator: string | Locator,
    expectedText: string | string[],
    options?: {
      ignoreCase?: boolean;
      timeout?: number;
      useInnerText?: boolean;
      instance?: Page | Frame
    }
  ): Promise<void> {
    const {
      ignoreCase: _ignoreCase = false,
      timeout: _timeout = 0,
      useInnerText: _useInnerText = true,
      instance: pageOrFrame = this.page
    } = options ?? {};

    const expectTextOptions: Record<string, any> = {
      ignoreCase: _ignoreCase,
      useInnerText: _useInnerText,
    };
    if (_timeout > 0) {
      expectTextOptions.timeout = _timeout;
    }
    elementLocator =
      typeof elementLocator === "string"
        ? pageOrFrame.locator(elementLocator)
        : elementLocator;
    await expect
      .soft(elementLocator)
      .not.toHaveText(expectedText, expectTextOptions);
  }

  /**
   * Validates if an element is visible on the page.
   * @param elementLocator - The locator of the element.
   * @param options - Optional configuration.
   *        - timeout  - Timeout in milliseconds.Defaults to 10000 in TestConfig.expect.
   *        - instance - Page or Frame instance. Defaults to current page.
   */
  async validateElementVisible(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const {
      timeout: _timeout = 0,
      instance: pageOrFrame = this.page,
    } = options ?? {};
    elementLocator =
      typeof elementLocator === "string"
        ? pageOrFrame.locator(elementLocator)
        : elementLocator;
    const expectOption = _timeout > 0 ? { timeout: _timeout } : undefined;
    await expect
      .soft(elementLocator)
      .toBeVisible(expectOption);
  }

  /**
   * Validates if an element is hidden on the page.
   * @param elementLocator - The locator of the element.
   * @param options - Optional configuration.
   *        - timeout  - Timeout in milliseconds.Defaults to 10000 in TestConfig.expect.
   *        - instance - Page or Frame instance. Defaults to current page.
   */
  async validateElementHidden(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const {
      timeout: _timeout = 0,
      instance: pageOrFrame = this.page,
    } = options ?? {};
    elementLocator =
      typeof elementLocator === "string"
        ? pageOrFrame.locator(elementLocator)
        : elementLocator;
    const expectOption = _timeout > 0 ? { timeout: _timeout } : undefined;
    await expect
      .soft(elementLocator)
      .toBeHidden(expectOption);
  }
  async clearAndFillTextBox(
    elementLocator: string | Locator,
    textToFill: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await elementLocator.clear();
    await elementLocator.fill(textToFill, { timeout });
  }

  async validateElementNotEditable(
    elementLocator: string | Locator,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect.soft(elementLocator).not.toBeEditable({ timeout });
  }

  async validateElementToHaveValue(
    elementLocator: string | Locator,
    expectedValue: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ) {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect.soft(elementLocator).toHaveValue(expectedValue, { timeout });
  }

  /**
   * Verifies the value of an input field.
   * @param elementLocator - The locator of the input element.
   * @param expectedValue - The expected value of the input field.
   * @param options - Optional configuration.
   *        - timeout  - Timeout in milliseconds. Defaults to 10000.
   *        - instance - Page or Frame instance. Defaults to current page.
   */
  async verifyInputFieldValue(
    elementLocator: string | Locator,
    expectedValue: string,
    options?: { timeout?: number; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const timeout = options?.timeout ?? 10000;
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    const actualValue = (await elementLocator.inputValue({ timeout })).trim();
    expect.soft(actualValue).toBe(expectedValue);
  }


  /**
   * Method 1: Accepts checkbox and radio (string or Locator), checks both
   */
  async checkCheckboxAndRadioButton(
    page: Page,
    checkboxLocator: string | Locator,
    radioLocator: string | Locator
  ) {
    const checkbox: Locator =
      typeof checkboxLocator === 'string' ? page.locator(checkboxLocator) : checkboxLocator;

    const radio: Locator =
      typeof radioLocator === 'string' ? page.locator(radioLocator) : radioLocator;

    await checkbox.check();
    const checkboxChecked = await checkbox.isChecked();
    if (checkboxChecked === true) {
      await radio.check();
      this.sleep();
    }
    return {
      checkboxChecked: checkboxChecked,
      radioChecked: await radio.isChecked(),
    };
  }

  /**
   * Method 2: Accepts only checkbox (string or Locator), checks it
   */
  async checkCheckboxOnly(
    page: Page,
    checkboxLocator: string | Locator
  ) {
    const checkbox: Locator =
      typeof checkboxLocator === 'string' ? page.locator(checkboxLocator) : checkboxLocator;

    await checkbox.check();
    this.sleep();

    return {
      checkboxChecked: await checkbox.isChecked(),
      radioChecked: null,
    };
  }

  /* Method to assert two different maps */
  async compareMaps(expectedMap: Map<string, number>, actualMap: Map<string, number>): Promise<void> {
    expect(actualMap).toEqual(expectedMap);
  }
  async validateElementToContainText(
    elementLocator: string | Locator,
    expectedText: string | string[] | RegExp[],
    options?: { ignoreCase?: boolean; timeout?: number; useInnerText?: boolean; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const expectedTextOptions: Record<string, any> = {
      ignoreCase: options?.ignoreCase ?? false,
      useInnerText: options?.useInnerText ?? true,
      timeout: options?.timeout ?? 10000
    };
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect.soft(elementLocator).toContainText(expectedText, expectedTextOptions);
  }

  async validateElementNotToContainText(
    elementLocator: string | Locator,
    expectedText: string | string[] | RegExp[],
    options?: { ignoreCase?: boolean; timeout?: number; useInnerText?: boolean; instance?: Page | Frame }
  ): Promise<void> {
    const page = options?.instance ?? this.page;
    const expectedTextOptions: Record<string, any> = {
      ignoreCase: options?.ignoreCase ?? false,
      useInnerText: options?.useInnerText ?? true,
      timeout: options?.timeout ?? 10000
    };
    elementLocator =
      typeof elementLocator === 'string'
        ? page.locator(elementLocator)
        : elementLocator;
    await expect.soft(elementLocator).not.toContainText(expectedText, expectedTextOptions);
  }

  /**
   * Method to iterate selected radio buttons and return their texts
   */
  async fetchSelectedRadioButtonTexts(
    page: Page,
    selectedRadioButtonLocator: Locator
  ) {
    const actualRadioButtonSelectOptions = [];
    for (let i = 0; i < await selectedRadioButtonLocator.count(); i++) {
      actualRadioButtonSelectOptions.
        push(await selectedRadioButtonLocator.nth(i).textContent());
    }
    return actualRadioButtonSelectOptions;
  }

  /**
   * Method to iterate selected check boxes and return their texts
   */
  async fetchSelectedCheckBoxTexts(
    page: Page,
    selectedCheckBoxLocator: Locator
  ) {
    const actualCheckBoxSelectOptions = [];
    for (let i = 0; i < await selectedCheckBoxLocator.count(); i++) {
      actualCheckBoxSelectOptions.
        push(await selectedCheckBoxLocator.nth(i).textContent());
    }
    return actualCheckBoxSelectOptions;
  }
}




