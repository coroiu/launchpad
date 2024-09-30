export const defaultEnvironment = {
  config: {
    parallelizer: "built-in" as "built-in" | "tmux",
  },
  repositories: {
    clients: {
      localPath: "repositories/clients",
      gitUri: "git@github.com:bitwarden/clients.git",
    },
    sdk: {
      localPath: "repositories/sdk",
      gitUri: "git@github.com:bitwarden/sdk.git",
    },
  },
  shell: {
    profile: "src/shell/profile.sh",
    passthroughVariables: ["NVM_DIR"].reduce((acc, v) => {
      if (process.env[v]) acc[v] = process.env[v];
      return acc;
    }, {} as Record<string, string>),
  },
};
