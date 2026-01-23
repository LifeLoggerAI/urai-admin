{ pkgs, ... }:
{
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # Standard C/C++ build environment
    pkgs.stdenv

    # Language and package managers
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
    pkgs.python3

    # Common dependencies for native Node.js modules
    pkgs.pkg-config
    pkgs.openssl
    pkgs.git
  ];

  # Sets environment variables in the workspace
  env = {
    CI = "1";
    FRONTEND = "noninteractive";
    COREPACK_ENABLE_DOWNLOAD_PROMPT = "0";
    # Tell pnpm where to store its global directory
    PNPM_HOME = "$HOME/.local/share/pnpm";
    # Add pnpm's global bin directory to the path
    PATH = "$PNPM_HOME:$PATH";
    # Set a temporary directory
    TMPDIR = "$HOME/.tmp";
    # Configure cache and data directories
    XDG_CACHE_HOME = "$HOME/.cache";
    XDG_DATA_HOME = "$HOME/.local/share";
  };

  # Defines startup processes
  startup = {};
}
