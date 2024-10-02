import chalk from "chalk";
import { runCommand } from "../commands/run-command";
import ora, { oraPromise } from "ora";
import inquirer from "inquirer";
import { runShellBinary } from "../commands/run-shell-binary";
import { runShellCommand } from "../commands/run-shell-command";

/**
 * Check that the environment is properly setup to run the project
 */
async function run() {
  console.log(chalk.green("# Script: setup-environment #"));

  const dotnet = oraPromise(checkDotnet(), {
    text: "Dotnet CLI",
    successText: "Dotnet CLI found!",
  });
  const npm = oraPromise(checkNpmRegistry(), {
    text: "GitHub NPM registry access",
    successText: (output) => `Logged in to GitHub NPM as: ${output}`,
    failText: "Could not access NPM GitHub registry",
  });

  try {
    await dotnet;
  } catch {
    console.error(chalk.red("Dotnet is not installed or not in PATH, please install it"));
    process.exit(1);
  }

  try {
    await npm;
  } catch {
    if (!(await setupNpmRegistry())) {
      console.error(chalk.red("Could not setup GitHub NPM registry, please login manually"));
      console.log(
        chalk.white(
          "For more information, see: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token"
        )
      );
      process.exit(1);
    }

    await oraPromise(checkNpmRegistry(), {
      text: "GitHub NPM registry access",
      successText: (output) => `GitHub NPM registry setup successfully! Logged in as: ${output}`,
      failText: "Could not setup GitHub NPM registry, please login manually",
    });
  }
}

async function checkDotnet() {
  await runCommand("dotnet --version");
}

function checkNpmRegistry() {
  return runCommand("npm whoami --registry=https://npm.pkg.github.com");
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
run().catch(console.error);
