import chalk from "chalk";

import { runShellCommand } from "../commands/run-shell-command";
import { environment } from "../environment";
import { runMain } from "../commands/run-main";

/**
 * Run install commands in all package managers
 */
async function run() {
  console.log(chalk.green("# Script: install #"));

  await runShellCommand(`cd ${environment.repositories.clients.localPath} && npm ci`);
  await runShellCommand(`cd ${environment.repositories.sdk.localPath} && npm ci`);
  if (environment.config.useLocalSdk) {
    // TODO: we should really use absolute paths here
    await runShellCommand(
      `cd ${environment.repositories.clients.localPath} && npm link @bitwarden/sdk-internal ../../repositories/sdk/languages/js/sdk-internal`
    );
  }
  await runShellCommand(`cd ${environment.repositories.server.localPath} && dotnet restore`);
}

runMain(run);
