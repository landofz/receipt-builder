#!/usr/bin/env bash
set -euo pipefail

readonly esbuild="./node_modules/.bin/esbuild"
readonly standard="./node_modules/.bin/standard"
readonly jest="./node_modules/.bin/jest"

install() {
    npm install
}

prod-build() {
    if test ! -x $esbuild; then
        install
    fi
    lint
    tests
    rm build/*
    cp src/index.html build/
    cp src/style.css build/
    $esbuild src/main.js --bundle --minify --outdir=build/
}

dev-build() {
    if test ! -x $esbuild; then
        install
    fi
    cp src/index.html build/
    cp src/style.css build/
    $esbuild src/main.js --bundle --sourcemap --outdir=build/
}

serve() {
    dev-build
    $esbuild src/main.js --bundle --sourcemap --outdir=build/ --servedir=build/ --watch
}

format() {
    if test ! -x $standard; then
        install
    fi
    $standard --fix src/
}

lint() {
    if test ! -x $standard; then
        install
    fi
    $standard src/
}

tests() {
    if test ! -x $jest; then
        install
    fi
    node --experimental-vm-modules $jest
}

"$@"
