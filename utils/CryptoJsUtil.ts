// Include CryptoJS library (make sure to include it in your project)
// You can download it from: https://cryptojs.gitbook.io/docs/
import CryptoJS from "crypto-js";

export function encrypt(text: string): string {
  const SALT = process.env.SALT || "omg";
  return CryptoJS.AES.encrypt(text, SALT).toString();
}

export function decrypt(cipherText: string): string {
  const SALT = process.env.SALT || "omg";
  const bytes = CryptoJS.AES.decrypt(cipherText, SALT);
  return bytes.toString(CryptoJS.enc.Utf8);
}