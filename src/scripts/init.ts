import chalk from "chalk";

import clone from "./clone";

/**
 * Run a series of commands to initialize the entire environment
 */
async function run() {
  console.log(chalk.green("> Running script: init"));

  await clone();
}

// Run the script if it's being executed directly
if (require.main === module) run().catch(console.error);
