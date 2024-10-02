import chalk from "chalk";

import { runShellBinary } from "../commands/run-shell-binary";

/**
 * Run a series of commands to initialize the entire environment
 */
async function run() {
  console.log(chalk.green("# Script: init #"));

  await runShellBinary("npm run clone");
  await runShellBinary("npm run install-deps");
}

run().catch(console.error);
