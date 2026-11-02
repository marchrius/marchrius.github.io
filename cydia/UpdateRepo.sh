#!/bin/sh
set -eu

repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$repo_dir"

cleanup() {
    rm -f .Packages.tmp .Packages.gz.tmp .Packages.bz2.tmp .Release.tmp
}
trap cleanup 0
trap 'exit 1' HUP INT TERM

./dpkg-scanpackages --arch iphoneos-arm --multiversion . /dev/null > .Packages.tmp
mv .Packages.tmp Packages

gzip -n -9 -c Packages > .Packages.gz.tmp
bzip2 -9 -c Packages > .Packages.bz2.tmp
mv .Packages.gz.tmp Packages.gz
mv .Packages.bz2.tmp Packages.bz2

md5_file() {
    if command -v md5sum >/dev/null 2>&1; then
        md5sum "$1" | awk '{print $1}'
    else
        md5 -q "$1"
    fi
}

sha256_file() {
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" | awk '{print $1}'
    else
        shasum -a 256 "$1" | awk '{print $1}'
    fi
}

file_size() {
    wc -c < "$1" | tr -d '[:space:]'
}

{
    cat <<'EOF'
Origin: Marchrius
Label: Marchrius Cydia Repository
Suite: stable
Version: 1.0
Codename: cydia-ios
Architectures: iphoneos-arm
Components: main
Description: OpenSSH and packages for legacy iOS devices
EOF
    printf 'Date: %s\n' "$(LC_ALL=C date -u '+%a, %d %b %Y %H:%M:%S +0000')"
    printf 'MD5Sum:\n'
    for file in Packages Packages.gz Packages.bz2; do
        printf ' %s %s %s\n' "$(md5_file "$file")" "$(file_size "$file")" "$file"
    done
    printf 'SHA256:\n'
    for file in Packages Packages.gz Packages.bz2; do
        printf ' %s %s %s\n' "$(sha256_file "$file")" "$(file_size "$file")" "$file"
    done
} > .Release.tmp
mv .Release.tmp Release
