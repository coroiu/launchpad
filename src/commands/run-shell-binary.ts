import chalk from "chalk";
import { spawn } from "child_process";

/**
 * Execute a binary and use the existing shell's stdio.
 * Note that this means that shell-specific features like environment variable expansion are not available.
 * No custom profiles or aliases are available, meaning that NVM and similar tools will not work.
 *
 * @param command Command to run
 * @param options Options
 * @returns Promise that resolves when the command finishes
 */
export async function runShellBinary(
  command: string,
  args?: string[],
  options?: { cwd?: string; env?: Record<string, string> }
) {
  let cmd = command;
  if (!args) {
    [cmd, ...args] = command.split(" "); // Split command into executable and args
  }

  console.log(
    chalk.green(
      `> Run command: ${cmd} [${args.join(", ")}] ${options?.cwd ? `in ${options.cwd}` : ""}`
    )
  );
  console.log("---------------------");

  const child_process = spawn(cmd, args, {
    stdio: "inherit",
    cwd: options?.cwd,
    env: options?.env,
  });

  return new Promise<void>((resolve, reject) => {
    child_process.on("close", (code: number) => {
      console.log("---------------------");
      if (code === 0) {
        // console.log(chalk.green("Command finished successfully."));
        resolve();
      } else {
        console.error(`Command failed with code ${code}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}
