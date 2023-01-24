{
  description = "devShell template";

  inputs = {
    nixpkgs.url      = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url  = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
      in
      with pkgs;
      {
        devShell = mkShell {
          buildInputs = [
            nodejs            
          ];
        };

        packages = {

        };
      }
    );
}
