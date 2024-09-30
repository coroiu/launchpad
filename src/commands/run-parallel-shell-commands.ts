import chalk from "chalk";
import { spawn } from "child_process";
import { generateCommand } from "./run-shell-command";
import stringToColor from "string-to-color";

export type Command = {
  name: string;
  command: string;
};

/**
 * Run multiple shell commands in parallel using the configured parallelizer.
 * Uses the same shell setup as `runShellCommand`.
 *
 * @param commands Commands to run
 */
export async function runParallelShellCommands(commands: Command[]) {
  console.log(chalk.green(`> Run parallel commands: [${commands.join(", ")}]`));
  console.log("---------------------");

  return builtInParallelizer(commands);
}

async function builtInParallelizer(commands: Command[]) {
  const childProcesses = commands.map(({ name, command }) => {
    const { command: cmd, args, env } = generateCommand(command);
    const childProcess = spawn(cmd, args, { env });

    const coloredName = chalk.bgHex(stringToColor(name))(`[${name}]`);

    childProcess.stdout.on("data", (data) => {
      data
        .toString()
        .split("\n")
        .forEach((line: string) => {
          process.stdout.write(`${coloredName} ${line}\n`);
        });
    });
    childProcess.stderr.on("data", (data) => {
      data
        .toString()
        .split("\n")
        .forEach((line: string) => {
          process.stderr.write(`${coloredName} ${chalk.bgRed("[ERROR]")} ${line}\n`);
        });
    });

    return new Promise<void>((resolve, reject) => {
      childProcess.on("close", (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          process.stdout.write(`[${name}] Command failed with code ${code}`);
          reject(new Error(`Command failed with code ${code}`));
        }
      });
    });
  });

  return Promise.all(childProcesses);
}
