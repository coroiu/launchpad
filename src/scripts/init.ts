import chalk from "chalk";

import { runShellBinary } from "../commands/run-shell-binary";
import { runMain } from "../commands/run-main";

/**
 * Run a series of commands to initialize the entire environment
 */
async function run() {
  console.log(chalk.green("# Script: init #"));

  await runShellBinary("npm run setup-environment");
  await runShellBinary("npm run clone");
  await runShellBinary("npm run install-deps");
}

runMain(run);
