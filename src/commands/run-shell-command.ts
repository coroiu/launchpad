import chalk from "chalk";
import { spawn } from "child_process";
import { environment } from "../environment";

/**
 * Similar to `runCommand` but uses `sh` as an intermediary to run the command.
 * This is useful for running shell commands that are not directly executable.
 * Example: `runShellCommand("echo 'Hello, World!'")`
 *
 * This function will run the command in the shell profile specified in the environment.
 * With the default configuration, this will run the command in a zsh shell with the NVM environment loaded.
 *
 * @param command Command to run
 */
export async function runShellCommand(command: string) {
  console.log(chalk.green(`> Run command: ${command}`));
  console.log("---------------------");

  const child_process = spawn("zsh", ["-c", `source ${environment.shell.profile}; ${command}`], {
    stdio: "inherit",
    env: environment.shell.passthroughVariables,
  });

  return new Promise<void>((resolve, reject) => {
    child_process.on("close", (code: number) => {
      console.log("---------------------");
      if (code === 0) {
        resolve();
      } else {
        console.error(`Command failed with code ${code}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}
