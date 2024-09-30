import chalk from "chalk";
import { spawn } from "child_process";
import { environment } from "../environment";

/**
 * Generate a command object that can be used with `spawn` to run a shell command.
 * This function will run the command in the shell profile specified in the environment.
 *
 * @param command Command to run
 * @returns Command object
 */
export function generateCommand(command: string): {
  command: string;
  args: string[];
  env: Record<string, string>;
} {
  return {
    command: "zsh",
    args: ["-c", `'source ${environment.shell.profile}'; ${command}`],
    env: {
      LAUNCHPAD_CUSTOM_PROFILE: environment.shell.customProfile ?? "",
      ...environment.shell.passthroughVariables,
    },
  };
}

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

  const { command: cmd, args, env } = generateCommand(command);
  const child_process = spawn(cmd, args, {
    stdio: "inherit",
    env,
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
