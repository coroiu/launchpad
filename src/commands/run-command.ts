import chalk from "chalk";
import { spawn } from "child_process";

export async function runCommand(command: string, options?: { cwd?: string }) {
  console.log(chalk.green(`> Run command: ${command} ${options?.cwd ? `in ${options.cwd}` : ""}`));
  console.log("---------------------");

  const [cmd, ...args] = command.split(" "); // Split command into executable and args
  const child_process = spawn(cmd, args, { stdio: "inherit", cwd: options?.cwd });

  return new Promise<void>((resolve, reject) => {
    child_process.on("close", (code: number) => {
      console.log("---------------------");
      if (code === 0) {
        // console.log(chalk.green("Command finished successfully."));
        resolve();
      } else {
        console.error(`Command failed with code ${code}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}
