import chalk from "chalk";
import { runParallelShellCommands } from "../commands/run-parallel-shell-commands";
import { runShellCommand } from "../commands/run-shell-command";

/**
 * Run shell commands with the launchpad profile
 *
 * @example `ts-node src/scripts/shell 'npm run web:dev'`
 */
async function run() {
  console.log(chalk.green("# Script: shell #"));

  return await runShellCommand(process.argv[2]);
}

run().catch(console.error);
