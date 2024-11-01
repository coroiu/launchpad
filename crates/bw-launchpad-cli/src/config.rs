pub struct Config {
    pub shell: String,
}

impl Config {
    pub fn new() -> Self {
        Self {
            shell: "zsh".to_owned(),
        }
    }
}
