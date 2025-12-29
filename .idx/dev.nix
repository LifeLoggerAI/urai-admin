{ pkgs, ... }: {
  # The nixpkgs channel to use.
  channel = "stable-24.05";

  # The packages to make available in your workspace.
  packages = [
    pkgs.nodejs_20
    pkgs.firebase-tools
  ];

  # VS Code extensions to install for a better development experience.
  idx.extensions = [
    "dbaeumer.vscode-eslint"    # For code linting
    "esbenp.prettier-vscode"  # For code formatting
    "bradlc.vscode-tailwindcss" # For Tailwind CSS support
  ];

  # Workspace lifecycle hooks.
  idx.workspace = {
    # Runs when a workspace is first created to set up the project.
    onCreate = {
      # Install dependencies for both the Next.js app and Functions.
      npm-install = "npm install";
    };
  };

  # Configure a web preview for the Next.js frontend.
  idx.previews = {
    enable = true;
    previews = {
      web = {
        # This command starts the Next.js dev server from the `apps/admin-web` package.
        command = ["npm" "run" "dev" "-w" "apps/admin-web" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
        manager = "web";
        label = "Admin Web App";
      };
    };
  };
}
