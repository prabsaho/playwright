import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import * as XLSX from "xlsx";

export interface SearchObject {
  [columnName: string]: string;
}

export interface ReplacementObject {
  [columnName: string]: string | number;
}

export async function setValueExcel(
  excelFilePath: string,
  sheetName: string,
  searchObject: SearchObject,
  replacementObject: ReplacementObject
) {
  const workbook = new ExcelJS.Workbook();
  const filePath = path.resolve(__dirname, excelFilePath);
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(sheetName);

  if (!worksheet) {
    console.error("Worksheet not found");
    return;
  }

  const headerRow = worksheet.getRow(1);
  const columnMap: { [key: string]: number } = {};

  // Create a map of column name to column number
  headerRow.eachCell((cell, colNumber) => {
    columnMap[cell.value as string] = colNumber;
  });

  // Find the row number based on searchObject
  let targetRowNumber = -1;

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header

    let match = true;
    for (const [key, value] of Object.entries(searchObject)) {
      const colIndex = columnMap[key];
      const cell = row.getCell(colIndex);
      if (cell.value !== value) {
        match = false;
        break;
      }
    }

    if (match) {
      targetRowNumber = rowNumber;
    }
  });

  if (targetRowNumber === -1) {
    console.error("Matching row not found");
    return;
  }

  const targetRow = worksheet.getRow(targetRowNumber);

  for (const [key, value] of Object.entries(replacementObject)) {
    const colIndex = columnMap[key];
    targetRow.getCell(colIndex).value = value;
  }

  await workbook.xlsx.writeFile(filePath);
  console.log("Excel file updated successfully.");
}

export async function getValueExcel(
  excelFilePath: string,
  sheetName: string,
  searchObject: SearchObject,
  targetColumn: string
): Promise<string | null> {
  const workbook = new ExcelJS.Workbook();
  const filePath = path.resolve(__dirname, excelFilePath);
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(sheetName);

  if (!worksheet) {
    console.error("Worksheet not found");
    return null;
  }

  const headerRow = worksheet.getRow(1);
  const columnMap: { [key: string]: number } = {};

  // Create a map of column name to column number
  headerRow.eachCell((cell, colNumber) => {
    columnMap[cell.value as string] = colNumber;
  });

  // Find the row number based on searchObject
  let targetRowNumber = -1;

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header

    let match = true;
    for (const [key, value] of Object.entries(searchObject)) {
      const colIndex = columnMap[key];
      const cell = row.getCell(colIndex);
      if (cell.value !== value) {
        match = false;
        break;
      }
    }

    if (match) {
      targetRowNumber = rowNumber;
    }
  });

  if (targetRowNumber === -1) {
    console.error("Matching row not found");
    return null;
  }

  const targetRow = worksheet.getRow(targetRowNumber);
  const targetColIndex = columnMap[targetColumn];

  const targetCell = targetRow.getCell(targetColIndex);
  return targetCell.value ? targetCell.value.toString() : null;
}

/**
 * Converts an Excel file to a JSON file.
 * The first row is treated as headers, and each subsequent row becomes a record.
 *
 * @param excelFilePath - Relative path to the Excel file.
 * @param jsonOutputPath - Relative path (including filename) where the JSON file should be saved.
 */
export async function exportAllSheetsToJson(
  excelFilePath: string,
  jsonOutputPath: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const filePath = path.resolve(__dirname, excelFilePath);
  await workbook.xlsx.readFile(filePath);

  const allSheetsData: Record<string, any[]> = {};

  workbook.eachSheet((worksheet) => {
    const rows = worksheet.getSheetValues(); // includes null at index 0
    if (rows.length < 2) {
      console.warn(`Sheet "${worksheet.name}" does not contain enough rows.`);
      return;
    }

    const headers = rows[1] as ExcelJS.CellValue[];
    const sheetData: Record<string, any>[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (!row || typeof row !== "object") continue;

      const rowArray = row as ExcelJS.CellValue[];
      const record: Record<string, any> = {};

      for (let j = 1; j < headers.length; j++) {
        const key = headers[j];
        if (key && typeof key === "string") {
          record[key] = rowArray[j] ?? null;
        }
      }

      // Only push rows that have at least one non-null value
      if (Object.values(record).some((val) => val !== null && val !== "")) {
        sheetData.push(record);
      }
    }

    allSheetsData[worksheet.name] = sheetData;
  });

  const outputPath = path.resolve(__dirname, jsonOutputPath);
  fs.writeFileSync(
    outputPath,
    JSON.stringify(allSheetsData, null, 2),
    "utf-8"
  );
  console.log(`JSON file with all sheets created at: ${outputPath}`);
}

export async function mapExcelColumns(
  filePath: string,
  sheetName: string,
  keyHeader: string,
  valueHeader: string
): Promise<Map<string, number>> {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet)
    throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);

  const rows: Array<Record<string, unknown>> = XLSX.utils.sheet_to_json(
    sheet,
    { defval: "" }
  );

  const map = new Map<string, number>();
  for (const row of rows) {
    const rawKey = row[keyHeader];
    const rawVal = row[valueHeader];
    if (rawKey === undefined || rawKey === "") continue; // skip rows without key

    const key = String(rawKey).trim();
    const numericValue = Number(String(rawVal ?? "0").trim());

    // Handle NaN(Invalid number) case - default to 0 or skip the entry
    const val = isNaN(numericValue) ? 0 : numericValue;
    map.set(key, val);
  }

  console.log("Expected entities and count map", map);
  return map;
}