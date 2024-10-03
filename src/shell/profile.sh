# Check if NVM_DIR is set, if not, check if default $HOME/.nvm exists
if [ -z "$NVM_DIR" ]; then
  if [ -d "$HOME/.nvm" ]; then
    NVM_DIR="$HOME/.nvm"
  fi
fi

# Proceed only if nvm is installed and nvm.sh exists
if [ -n "$NVM_DIR" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
  # Export NVM_DIR and load nvm
  export NVM_DIR
  \. "$NVM_DIR/nvm.sh"  # Load nvm
  
  # Initialize nvm bash completion if available
  if [ -s "$NVM_DIR/bash_completion" ]; then
    \. "$NVM_DIR/bash_completion"  # Load nvm bash completion
  fi

  # place this after nvm initialization!
  autoload -U add-zsh-hook

  # Define the load-nvmrc function
  load-nvmrc() {
    local node_version="$(nvm version)"
    local nvmrc_path="$(nvm_find_nvmrc)"

    if [ -n "$nvmrc_path" ]; then
      local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

      if [ "$nvmrc_node_version" = "N/A" ]; then
        nvm install
      elif [ "$nvmrc_node_version" != "$node_version" ]; then
        nvm use --silent
      fi
    elif [ "$node_version" != "$(nvm version default)" ];then
      # echo "Reverting to nvm default version"
      nvm use default --silent
    fi
  }

  # Add load-nvmrc to be triggered on directory change
  add-zsh-hook chpwd load-nvmrc

  # Trigger load-nvmrc for the current directory
  load-nvmrc
else
  # echo "nvm is not installed, skipping nvm setup."
fi

# echo "Launchpad profile loaded"

# Load custom profile if configured and exists
[ -f "$LAUNCHPAD_CUSTOM_PROFILE" ] && source "$LAUNCHPAD_CUSTOM_PROFILE"
# [ -f "$LAUNCHPAD_CUSTOM_PROFILE" ] && echo "Custom launchpad profile loaded" && source "$LAUNCHPAD_CUSTOM_PROFILE"