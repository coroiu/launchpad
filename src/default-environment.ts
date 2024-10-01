export const defaultEnvironment = {
  config: {
    /**
     * The parallelizer to use for running multiple commands at once.
     * - "built-in": Run commands in parallel using Node.js child processes
     * - "tmux": Run commands in parallel using tmux
     * - "tmux-iterm": Run commands in parallel using tmux, with iTerm-integration (-CC flag)
     *   For more information, see: https://gitlab.com/gnachman/iterm2/-/wikis/TmuxIntegration
     */
    parallelizer: "built-in" as "built-in" | "tmux" | "tmux-iterm",
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
    passthroughVariables: ["NVM_DIR", "HOME", "COLORTERM", "TERM"].reduce((acc, v) => {
      if (process.env[v]) acc[v] = process.env[v];
      return acc;
    }, {} as Record<string, string>),
  },
};
