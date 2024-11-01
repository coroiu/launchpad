pub struct Config {
    pub shell: String,
    pub repositories: RepositoriesConfig,
}

pub struct RepositoriesConfig {
    pub clients: RepositoryConfig,
    pub server: RepositoryConfig,
    pub sdk: RepositoryConfig,
}

pub struct RepositoryConfig {
    pub git_url: String,
    pub path: String,
}

impl Config {
    pub fn new() -> Self {
        Self {
            shell: "zsh".to_owned(),
            repositories: RepositoriesConfig {
                clients: RepositoryConfig {
                    git_url: "git@github.com:bitwarden/clients.git".to_owned(),
                    path: "repositories/clients".to_owned(),
                },
                server: RepositoryConfig {
                    git_url: "git@github.com:bitwarden/server.git".to_owned(),
                    path: "repositories/server".to_owned(),
                },
                sdk: RepositoryConfig {
                    git_url: "git@github.com:bitwarden/sdk.git".to_owned(),
                    path: "repositories/sdk".to_owned(),
                },
            },
        }
    }
}
