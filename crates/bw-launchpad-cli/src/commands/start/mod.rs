use clap::Args;

use crate::context::Context;

#[derive(Args)]
pub struct StartArgs {
    #[arg(
        short,
        long,
        default_missing_value = "build:bit:dev:watch",
        value_name = "npm command",
        help = "Start the web client"
    )]
    pub web: Option<Option<String>>,

    #[arg(
        short,
        long,
        default_missing_value = "electron",
        value_name = "npm command",
        help = "Start the desktop client"
    )]
    pub desktop: Option<Option<String>>,
}

pub fn start(context: &Context, args: StartArgs) {
    if let Some(Some(ref web_command)) = args.web {
        println!("Web command: {:?}", web_command);
        context
            .shell
            .run_inline_shell_command(format!("npm run {}", web_command));
    }

    // println!("Web: {:?}", args.web);

    println!("Desktop: {:?}", args.desktop);
}
