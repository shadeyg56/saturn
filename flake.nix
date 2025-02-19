{
  description = "A simple widget suite for Wayland built with Astal";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };

  };

  outputs = { self, nixpkgs, ags, ... }: 
  let 
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    agsPkgs = ags.packages.${system};
  in {

    packages.${system}.default = ags.lib.bundle {
      inherit pkgs;
      src = ./.;
      name = "saturn";
      entry = "app.ts";

      extraPackages = with agsPkgs; [
        hyprland
        wireplumber
        battery
        network
        mpris
        bluetooth
        cava
        notifd
      ];
    };

    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [ agsPkgs.agsFull pkgs.libnotify ];
      shellHook = ''
        # Generate types if they don't exist
        if [ ! -d ./@girs ];
          then ags types -d . -p
        fi
      '';
    };
  };
}
