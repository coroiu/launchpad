use clap::Args;

#[derive(Args)]
pub struct StartArgs {
    #[arg(short, long)]
    pub web: Option<Option<String>>,

    #[arg(short, long)]
    pub desktop: Option<Option<String>>,
}

pub fn start(args: StartArgs) {
    println!("Starting...");

    println!("Web: {:?}", args.web);

    println!("Desktop: {:?}", args.desktop);
}
