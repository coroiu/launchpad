import fs from "fs";

export async function folderExists(folderPath: fs.PathLike): Promise<boolean> {
  return fs.existsSync(folderPath);
}