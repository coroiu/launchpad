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
    server: {
      localPath: "repositories/server",
      gitUri: "git@github.com:bitwarden/server.git",
    },
  },
  shell: {
    profile: "src/shell/profile.sh",
    // Additional shell profile to load, can't use "~" for home directory for some reason
    customProfile: undefined as string | undefined,
    passthroughVariables: ["NVM_DIR", "HOME"].reduce((acc, v) => {
      if (process.env[v]) acc[v] = process.env[v];
      return acc;
    }, {} as Record<string, string>),
  },
};
