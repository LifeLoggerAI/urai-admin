
{
  pkgs, ...
}: {
  channel = "stable-24.05";
  packages = [pkgs.nodejs_20 pkgs.firebase-tools];
  idx = {
    extensions = ["dbaeumer.vscode-eslint" "vscodevim.vim"];
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        dev-server = "npm run dev";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}
