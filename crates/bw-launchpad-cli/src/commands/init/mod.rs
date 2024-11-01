use crate::{cli::Cli, context::Context};
use clap::Args;

#[derive(Args)]
pub struct InitArgs {}

pub fn init(context: &Context) {
    println!("Init project...");

    Cli::run(Some("clone"), context);
}
