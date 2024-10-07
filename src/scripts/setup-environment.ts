import chalk from "chalk";
import { runCommand } from "../commands/run-command";
import ora, { oraPromise } from "ora";
import inquirer from "inquirer";
import { runShellBinary } from "../commands/run-shell-binary";
import { runShellCommand } from "../commands/run-shell-command";
import { environment } from "../environment";
import { runMain } from "../commands/run-main";

/**
 * Check that the environment is properly setup to run the project
 */
async function run() {
  console.log(chalk.green("# Script: setup-environment #"));

  const dotnet = oraPromise(checkDotnet(), {
    text: "Dotnet CLI",
    successText: (output) => `Dotnet CLI found, verion: ${output}`,
  });
  // const npm = oraPromise(checkNpmRegistry(), {
  //   text: "GitHub NPM registry access",
  //   successText: (output) => `Logged in to GitHub NPM as: ${output}`,
  //   failText: "Could not access NPM GitHub registry",
  // });
  const nvm = oraPromise(checkNvm(), {
    text: "Node Version Manager (NVM)",
    successText: (output) => `NVM found, version: ${output}`,
    failText: "NVM not found",
  });

  try {
    await dotnet;
  } catch {
    console.error(chalk.red("Dotnet is not installed or not in PATH, please install it"));
    process.exit(1);
  }

  // try {
  //   await npm;
  // } catch {
  //   if (!(await setupNpmRegistry())) {
  //     console.error(chalk.red("Could not setup GitHub NPM registry, please login manually"));
  //     console.log(
  //       chalk.white(
  //         "For more information, see: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token"
  //       )
  //     );
  //     process.exit(1);
  //   }
  //
  //   await oraPromise(checkNpmRegistry(), {
  //     text: "GitHub NPM registry access",
  //     successText: (output) => `GitHub NPM registry setup successfully! Logged in as: ${output}`,
  //     failText: "Could not setup GitHub NPM registry, please login manually",
  //   });
  // }

  try {
    await nvm;
  } catch {
    console.error(
      chalk.red("NVM is not installed or not in PATH, it is highly recommended to install it")
    );
    if (!(await installNvm())) {
      console.error(chalk.red("Could not install NVM, please install it manually"));
      process.exit(1);
    }
  }
}

function checkDotnet() {
  return runCommand("dotnet --version", { env: environment.shell.passthroughVariables }).then(
    (output) => output.trim()
  );
}

function checkNpmRegistry() {
  return runCommand("npm whoami --registry=https://npm.pkg.github.com", {
    env: environment.shell.passthroughVariables,
  }).then((output) => output.trim());
}

function checkNvm() {
  return runCommand(`zsh -c 'source ${environment.shell.profile}; nvm --version'`, {
    env: environment.shell.passthroughVariables,
  }).then((output) => output.trim());
}

async function installNvm(): Promise<boolean> {
  const confirmInstallNvm = await inquirer.prompt([
    {
      type: "select",
      name: "install",
      choices: [
        { name: "Install the latest version automatically", value: "yes" },
        { name: "Abort this setup and let me install it manually", value: "manually" },
        { name: "Continue without", value: "without" },
      ],
      default: "yes",
      message: chalk.white(`Do you want to install NVM?`),
    },
  ]);

  if (confirmInstallNvm.install === "manually") {
    console.log(
      chalk.yellow(
        "Please install NVM manually by following the instructions at https://github.com/nvm-sh/nvm"
      )
    );

    console.log(
      chalk.yellow(
        "Remember to source your shell profile after installing NVM to make it available in your shell before running this setup again."
      )
    );
    return true;
  }

  if (confirmInstallNvm.install === "without") {
    console.log(chalk.yellow("Continuing without NVM, this is not recommended"));
    return true;
  }

  console.log(chalk.white("Installing nvm..."));

  await runShellCommand(
    "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | zsh"
  )
    .then(() => true)
    .catch(() => false);

  return oraPromise(checkNvm(), {
    text: "Node Version Manager (NVM)",
    successText: (output) => `NVM found, version: ${output}`,
    failText: "NVM not found",
  })
    .then(() => true)
    .then(() => false);
}

async function checkGhCli() {
  await runCommand("gh --version");
}

function fetchGhCliToken() {
  return runCommand("gh auth token");
}

async function oraWarningPromise<T>(
  promise: Promise<T>,
  message: string | { text: string; successText?: string; failText?: string }
): Promise<T> {
  const text = typeof message === "string" ? message : message.text;
  const successText = typeof message === "string" ? undefined : message.successText;
  const failText = typeof message === "string" ? undefined : message.failText;

  const spinner = ora(text).start();
  try {
    const result = await promise;
    spinner.succeed(successText);
    return result;
  } catch (error) {
    spinner.warn(failText);
    throw error;
  }
}

async function setupNpmRegistry() {
  // Automatic setup with GitHub CLI is not supported
  // const hasGhCli = await oraWarningPromise(checkGhCli(), {
  //   text: "GitHub CLI",
  //   successText: "GitHub CLI found!",
  //   failText: "GitHub CLI not found",
  // })
  //   .then(() => true)
  //   .catch(() => false);
  // const ghCliToken = await oraWarningPromise(fetchGhCliToken(), {
  //   text: "GitHub CLI logged in?",
  //   successText: "GitHub CLI token found!",
  //   failText: "GitHub CLI not logged in",
  // }).catch(() => false);

  // if (
  //   hasGhCli &&
  //   typeof ghCliToken === "string" &&
  //   (await setupNpmRegistryWithGhCliToken(ghCliToken))
  // ) {
  //   return true;
  // }

  // console.log(chalk.yellow("Could not login to GitHub NPM registry with GitHub CLI token"));

  return setupNpmRegistryManually();
}

async function setupNpmRegistryWithGhCliToken(token: string): Promise<boolean> {
  console.log(
    chalk.yellow(
      "Warning: Using a GitHub CLI token to login to the GitHub NPM registry is not officially supported."
    )
  );
  const useGhCli = await inquirer.prompt([
    {
      type: "select",
      name: "useToken",
      choices: [
        { name: "Use GitHub CLI token", value: true },
        { name: "Input manually", value: false },
      ],
      default: true,
      message: chalk.white(
        `Do you want to automatically login to the GitHub NPM registry using your GitHub CLI token?`
      ),
    },
  ]);

  if (!useGhCli.useToken) {
    return false;
  }

  return runShellCommand(`echo "//npm.pkg.github.com/:_authToken=${token}" >> ~/.npmrc`)
    .then(() => true)
    .catch(() => false);
}

async function setupNpmRegistryManually(): Promise<boolean> {
  console.log(
    chalk.white(
      "Please create a GitHub Personal Access Token at: https://github.com/settings/tokens"
    )
  );
  const tokenInput = await inquirer.prompt([
    {
      type: "input",
      name: "token",
      message: chalk.white(`GitHub token:`),
    },
  ]);
  const token = tokenInput.token;

  return runShellCommand(`echo "//npm.pkg.github.com/:_authToken=${token}" >> ~/.npmrc`)
    .then(() => true)
    .catch(() => false);
}

// Node thinks we don't handle errors
process.on("unhandledRejection", () => {});
runMain(run);
