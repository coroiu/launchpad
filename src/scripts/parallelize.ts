import chalk from "chalk";
import { runParallelShellCommands } from "../commands/run-parallel-shell-commands";
import { runMain } from "../commands/run-main";

/**
 * Run commands in parallel
 *
 * @example `ts-node src/scripts/parallelize 'npm run web:dev' ' npm run server:dev'`
 */
async function run() {
  console.log(chalk.green("# Script: parallelize #"));

  const commands = process.argv.slice(2).map((command, index) => ({
    command,
  }));
  return await runParallelShellCommands(commands);
}

runMain(run);
