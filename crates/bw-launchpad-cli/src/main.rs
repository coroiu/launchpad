mod cli;
mod commands;
mod config;
mod context;
mod shell;

use cli::Cli;
use config::Config;
use context::Context;

fn main() {
    let config = Config::new();
    let context = Context {
        shell: shell::Shell::new(config.shell),
    };

    Cli::run(None, &context);
}
