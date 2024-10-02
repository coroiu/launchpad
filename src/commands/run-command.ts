import { exec } from "child_process";

/**
 * Execute a binary and capture the output.
 * No custom profiles or aliases are available, meaning that NVM and similar tools will not work.
 *
 * @param command Command to run
 * @param options Options
 * @returns Promise that resolves when the command finishes
 */
export async function runCommand(
  command: string,
  options?: { cwd?: string; env?: Record<string, string> }
) {
  return new Promise<string>((resolve, reject) => {
    exec(command, { cwd: options?.cwd, env: options?.env }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
}
