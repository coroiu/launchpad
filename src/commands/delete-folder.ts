import fs from "fs";
import fsPromises from "fs/promises";

export async function deleteFolder(folderPath: fs.PathLike): Promise<void> {
  return fsPromises.rm(folderPath, { recursive: true });
}
