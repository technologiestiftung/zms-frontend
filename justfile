# docs https://github.com/casey/just
# justfile load .env file
set dotenv-load
set shell := ["bash", "-uc"]
alias types:= generate-types


default:
    @just --list


generate-types:
    supabase gen types typescript --local > ./poc/pubsub/src/db-types.ts