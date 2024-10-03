import chalk from "chalk";
import { runParallelShellCommands } from "../commands/run-parallel-shell-commands";
import { runShellCommand } from "../commands/run-shell-command";
import { runMain } from "../commands/run-main";

/**
 * Run shell commands with the launchpad profile
 *
 * @example `ts-node src/scripts/shell 'npm run web:dev'`
 */
async function run() {
  console.log(chalk.green("# Script: shell #"));

  return await runShellCommand(process.argv[2]);
}

runMain(run);
