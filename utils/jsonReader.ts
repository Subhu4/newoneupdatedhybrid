import fs from "fs";
import path from "path";

export class JsonReader {
  /**
   * Author: Subham Maharana
   * Method Name: read
   * Description: Reads and parses a JSON file from the project root.
   * Parameters: relativePath - JSON path relative to the project root.
   * Return Type: Generic parsed JSON object.
   */
  public static read<T>(relativePath: string): T {
    try {
      const filePath = path.join(process.cwd(), relativePath);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileContent) as T;
    } catch (error) {
      throw new Error(`Unable to read JSON test data '${relativePath}': ${String(error)}`);
    }
  }
}
