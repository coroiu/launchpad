use crate::{commands::Commands, context::Context};
use clap::Parser;

#[derive(Parser)]
#[command(version, about, long_about = None)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Option<Commands>,
}

impl Cli {
    pub fn run(args: Option<&str>, context: &Context) {
        if args.is_none() {
            // cliclack::intro("BW Launchpad").expect("Encountered I/O Error");
        }

        let cli = match args {
            Some(args) => Cli::parse_from(format!("bwl {}", args).split_whitespace()),
            None => Cli::parse(),
        };
        Commands::run(context, &cli);

        if args.is_none() {
            // cliclack::outro("").expect("Encountered I/O Error");
        }
    }
}
