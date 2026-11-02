# Marchrius Cydia Repository

Repository Cydia flat-hosted at:

`https://marchrius.github.io/cydia/`

Add that URL in Cydia, or open the repository landing page in Safari and tap **Aggiungi la repo a Cydia**.

## Contents

- `debs/` — Debian packages published by this repository.
- `Packages`, `Packages.gz`, `Packages.bz2` — package indexes generated from the `.deb` files.
- `Release` — repository metadata and checksums for the indexes.
- `depictions/` — package information pages.

The current package is OpenSSH 10.6p1 (`openssh`, architecture `iphoneos-arm`), with a depiction at `depictions/?p=openssh`.

## Update the repository

Copy the finished `.deb` into `debs/`, then run:

```sh
./UpdateRepo.sh
```

The script can be run from any working directory. It rebuilds the package indexes and refreshes the `Release` hashes. Publish the updated `cydia/` directory with GitHub Pages.
