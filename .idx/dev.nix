{ pkgs, ... }: {
  # Use the stable Nixpkgs channel for predictability.
  channel = "stable-24.05";

  # A list of packages to install from the specified channel.
  packages = [
    pkgs.nodejs_20  # Required for Cloud Functions and Next.js
    pkgs.firebase-tools # Firebase CLI for deployment and emulation
  ];

  # A list of VS Code extensions to install from the Open VSX Registry.
  idx.extensions = [
    "dbaeumer.vscode-eslint"      # For code linting
    "esbenp.prettier-vscode"    # For code formatting
    "ms-vscode.typescript-next" # For TypeScript language support
    "firebase.firebase-vscode"  # For Firebase integration
  ];

  # Workspace lifecycle hooks.
  idx.workspace = {
    # Runs when a workspace is first created to set up the project.
    onCreate = {
      npm-install-functions = "cd functions && npm install";
      npm-install-hosting = "cd hosting && npm install";
    };

    # Runs every time the workspace is (re)started.
    onStart = {
      # You can start emulators or dev servers here automatically.
      # For now, we'll let the user start them manually.
      welcome = "echo 'URAI Admin Console environment ready. Run `firebase emulators:start` to begin.'";
    };
  };

  # Configure web previews for the frontend application and emulators.
  idx.previews = {
    enable = true;
    previews = {
      # Preview for the Next.js admin dashboard
      admin-console = {
        command = ["npm" "run" "dev" "--prefix" "hosting"];
        manager = "web";
        port = 3000;
      };
      # Link to the Emulator UI
      emulator-ui = {
        command = ["echo 'Emulator UI running at http://$HOST:4000' && sleep infinity"];
        manager = "web";
        port = 4000;
      };
    };
  };
}
