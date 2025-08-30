{ pkgs, ... }:
{
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # A list of packages to have available in your environment.
  packages = [
    pkgs.nodejs_20
    pkgs.firebase-tools
  ];

  # Sets environment variables in your workspace.
  env = {};

  # VS Code extensions to install in your workspace.
  idx.extensions = [
    "dbaeumer.vscode-eslint"
  ];

  # Workspace lifecycle hooks.
  idx.workspace = {
    # Runs when a workspace is first created.
    onCreate = {
      root-npm-install = "npm install";
      functions-npm-install = "cd functions && npm install";
      admin-npm-install = "cd urai-admin-codebase && npm install";
    };
    # Runs every time the workspace is (re)started.
    onStart = {};
  };

  # Web previews for your application.
  idx.previews = {
    enable = false;
  };
}
