<div align="center">
  <img src="assets/launchpad.png" alt="Launchpad" width="200px" margin="3">
  <br></br>
  <h1>Launchpad</h1>
  <p>
    <strong>Mission Control for Development</strong>
  </p>
</div>

## About

Launchpad is a project designed to help manage and set up a development environment for Bitwarden. This repository serves as a collection of helpful snippets and parallel commands to rebuild and link multiple repositories efficiently.

## Features

- **Parallel Build Commands**: Scripts to rebuild and link multiple Bitwarden repositories in one go.
- **Environment Setup [WIP]**: Guidelines and commands to set up your development environment quickly and consistently.
- **Custom Scripts**: Handy scripts to automate repetitive tasks like building, testing, and deployment.
- **Repository Linking**: Methods for ensuring smooth integration between various repositories.

## Getting started

1. Clone this repository:

```bash
git clone git@github.com:coroiu/launchpad.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment:

```bash
npm run init
```

5. Run a parallel dev command:

```bash
npm run dev:api_identity_web_browser
```

## Configuration

- **`.custom-env.ts`**: Contains configuration overrides for launchpad. Check out `src/default-environment.ts` for options.

## Tips

### Install `tmux` for an improved terminal experience

1. Install `tmux`:

```bash
brew install tmux
```

2. Set `customEnvironment.config.parallelizer: "tmux"` in `.custom-env.ts`

## Limitations

- Currently supports web + sdk only.
- Requires a Unix-like environment (Linux, macOS, WSL).
- Requires zsh.

## Usage

Take a look at package.json for available commands
