import chalk from "chalk";
import inquirer from "inquirer";
import { folderExists } from "../commands/folder-exists";
import { environment } from "../environment";
import { deleteFolder } from "../commands/delete-folder";
import { runShellBinary } from "../commands/run-shell-binary";
import { runMain } from "../commands/run-main";

/**
 * Clones the clients and SDK repositories
 */
async function run() {
  console.log(chalk.green("# Script: clone #"));

  const cloneClients = await checkRepositoryShouldClone(
    "clients",
    environment.repositories.clients.localPath
  );
  const cloneSdk = await checkRepositoryShouldClone("sdk", environment.repositories.sdk.localPath);
  const cloneServer = await checkRepositoryShouldClone(
    "server",
    environment.repositories.server.localPath
  );

  // Clone repositories
  if (cloneClients) {
    await runShellBinary(
      `git clone --progress ${environment.repositories.clients.gitUri} ${environment.repositories.clients.localPath}`
    );
  }

  if (cloneSdk) {
    await runShellBinary(
      `git clone --progress ${environment.repositories.sdk.gitUri} ${environment.repositories.sdk.localPath}`
    );
  }

  if (cloneServer) {
    await runShellBinary(
      `git clone --progress ${environment.repositories.server.gitUri} ${environment.repositories.server.localPath}`
    );
  }
}

/**
 * Check if the repository exists and asks the user what they want to do
 * @param name Name of the repository
 * @param path Path to the repository
 * @returns true if the repository should be cloned, false otherwise
 */
async function checkRepositoryShouldClone(name: string, path: string): Promise<boolean> {
  if (await folderExists(path)) {
    console.log(chalk.yellow(`Warning: Found existing ${name} repository!`));
    const answers = await inquirer.prompt([
      {
        type: "select",
        name: "delete",
        choices: [
          { name: "Use as-is", value: false },
          { name: "Delete", value: true },
        ],
        default: false,
        message: chalk.red(
          `Initializing a new ${name} repository will delete the existing one. Are you sure you want to proceed?`
        ),
      },
    ]);

    if (!answers.delete) {
      console.log(chalk.yellow(`Using existing ${name} repository as-is.`));
      return false;
    }

    const confirmationAnswer = await inquirer.prompt([
      {
        type: "confirm",
        name: "delete",
        default: false,
        message: chalk.red(
          `Are you sure you want to proceed? This will DELETE the existing ${name} repository.`
        ),
      },
    ]);

    if (!confirmationAnswer.delete) {
      console.log(chalk.yellow(`Using existing ${name} repository as-is.`));
      return false;
    }

    console.log(chalk.yellow(`Deleting ${name} repository...`));
    await deleteFolder(path);
  }

  return true;
}

runMain(run);
