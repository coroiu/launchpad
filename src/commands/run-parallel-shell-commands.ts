import chalk from "chalk";
import { spawn } from "child_process";
import { generateCommand } from "./run-shell-command";
import stringToColor from "string-to-color";
import { runCommand } from "./run-command";
import { environment } from "../environment";

export type Command = {
  name?: string;
  command: string;
};

/**
 * Run multiple shell commands in parallel using the configured parallelizer.
 * Uses the same shell setup as `runShellCommand`.
 *
 * @param commands Commands to run
 */
export async function runParallelShellCommands(commands: Command[]) {
  console.log(
    chalk.green(`> Run parallel commands: [${commands.map((c) => c.command).join(", ")}]`)
  );
  console.log("---------------------");

  if (environment.config.parallelizer === "tmux") {
    return tmuxParallelizer(commands);
  }

  return builtInParallelizer(commands);
}

async function builtInParallelizer(commands: Command[]) {
  const childProcesses = commands.map(({ name, command }) => {
    const { command: cmd, args, env } = generateCommand(command);
    const childProcess = spawn(cmd, args, { env });

    const coloredName = chalk.bgHex(stringToColor(name))(`[${name}]`);

    childProcess.stdout.on("data", (data) => {
      data
        .toString()
        .split("\n")
        .forEach((line: string) => {
          process.stdout.write(`${coloredName} ${line}\n`);
        });
    });
    childProcess.stderr.on("data", (data) => {
      data
        .toString()
        .split("\n")
        .forEach((line: string) => {
          process.stderr.write(`${coloredName} ${chalk.bgRed("[ERROR]")} ${line}\n`);
        });
    });

    return new Promise<void>((resolve, reject) => {
      childProcess.on("close", (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          process.stdout.write(`[${name}] Command failed with code ${code}`);
          reject(new Error(`Command failed with code ${code}`));
        }
      });
    });
  });

  return Promise.all(childProcesses);
}

async function tmuxParallelizer(commands: Command[]) {
  if (commands.length === 0) {
    return;
  }

  const mappedCommands = commands.map(({ name, command }) => {
    const originalCommand = command;
    const { command: cmd, args, env } = generateCommand(command);
    return {
      name,
      command: `${cmd} ${args.join(" ")}`,
      env,
      originalCommand,
    };
  });

  const tmuxArgs: string[] = [];
  tmuxArgs.push("new-session", mappedCommands[0].command, ";");
  tmuxArgs.push("set", "pane-border-status", "top", ";");
  tmuxArgs.push(
    "select-pane",
    "-T",
    mappedCommands[0].name ?? mappedCommands[0].originalCommand,
    ";"
  );

  // Enable switching panes and scrolling with the mouse
  tmuxArgs.push("set", "mouse", "on", ";");
  // Enable closing all panes with Ctrl + X
  tmuxArgs.push("bind-key", "-n", "C-x", "kill-session", ";");

  if (mappedCommands.length > 1) {
    for (const { command, originalCommand, name } of mappedCommands.slice(1)) {
      tmuxArgs.push("split-window", command, ";");
      tmuxArgs.push("select-pane", "-T", name ?? originalCommand, ";");
    }
  }

  // Set the layout to tiled
  tmuxArgs.push("select-layout", "tiled", ";");

  await runCommand("tmux", tmuxArgs);
  // await runCommand("tmux", tmuxArgs, { env: mappedCommands[0].env });
}
