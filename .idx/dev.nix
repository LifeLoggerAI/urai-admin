{ pkgs, ... }: {
  # The nixpkgs channel to use.
  channel = "stable-24.05";

  # The packages to make available in your workspace.
  packages = [
    pkgs.nodejs_20
    pkgs.firebase-tools
  ];

  # VS Code extensions to install for a better development experience.
  idx = {
    extensions = [
      "firebase.firebase-vscode"
    ];
  };
}
