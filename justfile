# docs https://github.com/casey/just
# justfile load .env file
set dotenv-load
set shell := ["bash", "-uc"]
default:
    @just --list

test-deno:
    if ! type "deno" > /dev/null; then
    echo "deno not installed"
    exit 1
    else
    echo "deno is installed"
    fi
