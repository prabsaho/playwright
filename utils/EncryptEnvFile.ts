import CryptoJS from "crypto-js";
import fs from "fs";
import path from "path";

const currentDir = __dirname;
const srcDir = path.resolve(currentDir, "..");
const configDir = path.resolve(srcDir, "config");

let envFilePath = path.join(configDir, ".env");
if (process.env.NODE_ENV) {
  envFilePath = path.join(configDir, `.env.${process.env.NODE_ENV}`);
}

function splitEnvLine(line: string): { key: string; value: string } | null {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const index = line.indexOf("=");
  if (index === -1) {
    return null;
  }

  const key = line.slice(0, index).trim();
  const value = line.slice(index + 1);
  return { key, value };
}

export function encryptEnvFile(): void {
  const SALT = process.env.SALT || "omg";
  const envFileContent = fs.readFileSync(envFilePath, "utf8");
  const envLines: string[] = envFileContent.split(/\r?\n/);

  const encryptedLines = envLines.map((line: string) => {
    const parsed = splitEnvLine(line);

    if (!parsed) {
      return line;
    }

    const encryptedValue = CryptoJS.AES.encrypt(parsed.value, SALT).toString();
    return `${parsed.key}=${encryptedValue}`;
  });

  fs.writeFileSync(envFilePath, encryptedLines.join("\n"), "utf8");
  console.log("Encryption complete. Updated .env file.");
}

export function decryptEnvFile(): void {
  const SALT = process.env.SALT || "omg";
  const envFileContent = fs.readFileSync(envFilePath, "utf8");
  const envLines: string[] = envFileContent.split(/\r?\n/);

  const decryptedLines = envLines.map((line: string) => {
    const parsed = splitEnvLine(line);

    if (!parsed) {
      return line;
    }

    const decryptedValue = CryptoJS.AES.decrypt(parsed.value, SALT).toString(
      CryptoJS.enc.Utf8
    );

    return `${parsed.key}=${decryptedValue}`;
  });

  fs.writeFileSync(envFilePath, decryptedLines.join("\n"), "utf8");
  console.log("Decryption complete. Updated .env file.");
}