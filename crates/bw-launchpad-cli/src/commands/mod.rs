use clap::Subcommand;
use start::StartArgs;

use crate::{cli::Cli, context::Context};

pub mod clone;
pub mod init;
pub mod start;

#[derive(Subcommand)]
pub enum Commands {
    #[command(about = "Initialize project (clone, install packages, etc...)")]
    Init,

    #[command(about = "Clone all repositories")]
    Clone,

    #[command(about = "Run applications")]
    Start(StartArgs),
}

impl Commands {
    pub fn run(context: &Context, args: &Cli) {
        match &args.command {
            Some(Commands::Start(start_args)) => start::start(&context, start_args),
            Some(Commands::Init) => init::init(&context),
            Some(Commands::Clone) => clone::clone(&context),
            None => println!("No command provided"),
        }
    }
}
