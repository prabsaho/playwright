## Execution Guidelines

Before running the test cases, set the environment variable & browser.

For QA, use **`NODE_ENV=qa`**.
For Firefox  use **`set BROWSER_TYPE=firefox`**.

Run the test cases using the following commands:

- In Command Prompt: **`npx playwright test --grep loginTests`**
- In PowerShell: **`npx playwright test --grep "loginTests"`**

To use the Encryption:

set SALT=anydesiredvalue

then run the test with utility as description in loginTest.spec.ts
just to run the function encryptEnvFile() which is a one time thing only;