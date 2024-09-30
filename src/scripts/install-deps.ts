import chalk from "chalk";

import { runShellCommand } from "../commands/run-shell-command";
import { environment } from "../environment";

/**
 * Run install commands in all package managers
 */
async function run() {
  console.log(chalk.green("# Script: install #"));

  await runShellCommand(`cd ${environment.repositories.clients.localPath} && npm ci`);
  await runShellCommand(`cd ${environment.repositories.server.localPath} && dotnet restore`);
}

run().catch(console.error);
