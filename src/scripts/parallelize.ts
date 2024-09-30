import chalk from "chalk";
import { runParallelShellCommands } from "../commands/run-parallel-shell-commands";

// import concurrently from "concurrently";

/**
 * Run commands in parallel
 *
 * @example `ts-node src/scripts/parallelize 'npm run web:dev' ' npm run server:dev'`
 */
async function run() {
  console.log(chalk.green("# Script: parallelize #"));

  const commands = process.argv.slice(2).map((command, index) => ({
    name: String(index + 1),
    command,
  }));
  await runParallelShellCommands(commands);
}

run().catch(console.error);
