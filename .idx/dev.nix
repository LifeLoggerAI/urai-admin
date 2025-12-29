{ pkgs, ... }: {
  # The nixpkgs channel to use.
  channel = "stable-24.05";

  # The packages to make available in your workspace.
  # pkgs.nodejs_20 is required for the Next.js app and Firebase Functions.
  packages = [
    pkgs.nodejs_20
    # Add firebase-tools for App Hosting
    ,pkgs.firebase-tools
  ];

  # Sets environment variables in your workspace.
  # You can add your NEXT_PUBLIC_FIREBASE_* keys here,
  # though a .env.local file is also a good option.
  env = {};

  # VS Code extensions to install in your workspace.
  idx.extensions = [
    "dbaeumer.vscode-eslint"
    # Recommended for Tailwind CSS and icons
    ,"bradlc.vscode-tailwindcss"
    ,"vscode-icons-team.vscode-icons"
  ];

  # Workspace lifecycle hooks.
  idx.workspace = {
    # Runs when a workspace is first created.
    onCreate = {
      app-install = "cd urai-admin-codebase && npm install";
      functions-install = "cd functions && npm install";
    };

    # Runs every time the workspace is (re)started.
    onStart = {
      # This will automatically start the Next.js dev server.
      dev-server = "cd urai-admin-codebase && npm run dev";
    };
  };

  # Configures a web preview for your application.
  idx.previews = {
    enable = true;
    previews = {
      # The preview for the Next.js admin UI
      web = {
        command = ["sh", "-c", "cd urai-admin-codebase && npm run dev -- --port $PORT"];
        manager = "web";
      };
    };
  };
}
