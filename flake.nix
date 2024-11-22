{
  description = "A simple widget suite for Wayland built with Astal";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/18979df9f0be9d69f0e4d35059914c1a868c79b8";

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
      ];
    };

    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [ agsPkgs.agsFull ];
      shellHook = ''
        # Generate types if they don't exist
        if [ ! -d ./@girs ];
          then ags types -d .
        fi
      '';
    };
  };
}
