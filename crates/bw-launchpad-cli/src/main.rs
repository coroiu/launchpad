mod commands;

use clap::{Parser, Subcommand};
use commands::start::StartArgs;

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

    match args.command {
        Some(Commands::Start(start_args)) => commands::start::start(start_args),
        None => println!("No command provided"),
    }
}
