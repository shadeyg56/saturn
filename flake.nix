{
  description = "A simple widget suite for Wayland built with Astal";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };

  };

  outputs = { self, nixpkgs, ags, ... }: 
  let 
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    agsPkgs = ags.packages.${system};
  in {

    packages.${system}.default = pkgs.stdenv.mkDerivation {
      name = "saturn";
      src = ./.;

      nativeBuildInputs = with pkgs; [
        wrapGAppsHook
        gobject-introspection
        ags.packages.${system}.default
      ];

      buildInputs = with agsPkgs; [
        astal3
        hyprland
        wireplumber
        battery
        network
        mpris
        bluetooth
        cava
        notifd
        pkgs.gjs
      ];

      installPhase = ''
        mkdir -p $out/bin
        ags bundle app.ts $out/bin/saturn --gtk 3
      '';
    };

    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [ agsPkgs.agsFull pkgs.libnotify ];
      shellHook = ''
        # Generate types if they don't exist
        if [ ! -d ./@girs ];
          then ags types -d . -u
        fi

        export SATURN_ENV=development
      '';
    };
  };
}
