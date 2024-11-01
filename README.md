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

### Installing from source

1. Clone this repository:

```bash
git clone git@github.com:coroiu/launchpad.git
```

2. Install on your machine:

```bash
cd launchpad
cargo install --path crates/bw-launchpad-cli
```

## Usage

1. Create a new folder where you want to set up your Bitwarden development environment

```bash
mkdir -p ~/code/bitwarden-launchpad
cd ~/code/bitwarden-launchpad
```

2. Run the following command to set up the Bitwarden repositories:

```bash
launchpad init
```
