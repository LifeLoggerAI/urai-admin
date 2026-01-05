{ pkgs, ... }:

{
  channel = "stable-24.05";

  packages = [
    pkgs.nodejs_20
    pkgs.firebase-tools
  ];

  # If you ever want the idx block back, we can re-add it later.
}
