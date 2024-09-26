import chalk from "chalk";
import { spawn } from "child_process";

export async function runCommand(command: string) {
  console.log(chalk.green(`Running command: ${command}`));
  console.log("---------------------");

  const [cmd, ...args] = command.split(" "); // Split command into executable and args
  const child_process = spawn(cmd, args);

  // Stream stdout
  child_process.stdout.pipe(process.stdout);
  child_process.stderr.pipe(process.stderr);

  // child_process.stdout.on("data", (data: Buffer) => {
  //   console.log("> ", data.toString());
  // });

  // // Stream stderr
  // child_process.stderr.on("data", (data: Buffer) => {
  //   console.error("! ", data.toString());
  // });

  return new Promise<void>((resolve, reject) => {
    child_process.on("close", (code: number) => {
      console.log("---------------------");
      if (code === 0) {
        console.log(chalk.green("Command finished successfully."));
        resolve();
      } else {
        console.error(`Command failed with code ${code}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}
