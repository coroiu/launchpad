import chalk from "chalk";

import { runCommand } from "../commands/run-command";
import { runShellCommand } from "../commands/run-shell-command";
import { environment } from "../environment";

/**
 * Run install commands in all package managers
 */
async function run() {
  console.log(chalk.green("# Script: install #"));

  await runShellCommand(`cd ${environment.repositories.clients.localPath} && npm ci`);
}

run().catch(console.error);
