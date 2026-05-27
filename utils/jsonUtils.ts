import * as fs from "fs";

export function readJsonFileAndReturnParsedJson(path: string) {
  const rawData = fs.readFileSync(path, "utf-8");
  const jsonObject = JSON.parse(rawData);
  return jsonObject;
}