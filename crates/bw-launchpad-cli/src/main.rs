mod commands;
mod config;
mod context;
mod shell;

use clap::{Parser, Subcommand};
use commands::start::StartArgs;
use config::Config;
use context::Context;

#[derive(Parser)]
#[command(version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    Start(StartArgs),
}

fn main() {
    let args = Cli::parse();

    let config = Config::new();
    let context = Context {
        shell: shell::Shell::new(config.shell),
    };

    match args.command {
        Some(Commands::Start(start_args)) => commands::start::start(&context, start_args),
        None => println!("No command provided"),
    }
}
