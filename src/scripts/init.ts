import chalk from "chalk";

import { runCommand } from "../commands/run-command";

/**
 * Run a series of commands to initialize the entire environment
 */
async function run() {
  console.log(chalk.green("# Script: init #"));

  await runCommand("npm run clone");
  await runCommand("npm run install-deps");
}

run().catch(console.error);
