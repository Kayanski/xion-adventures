# Xion Adventures

This is a hackathon submission for the Xion Believathon

# CosmWasm contracts

The Hub and GameHandler contracts are Abstract modules and need to be registered as such inside Abstract to be able to work with each other. 

The NFT module is a cw721 implementation using simple Metadata that allows to save where the player is located in the world

# Frontend

The frontend allows to play the game, connected to the current game deployment on `xion-testnet-1`. There is no secrets associated with this frontend.
You can run this frontend locally to play the game anywhere, without relying on the current deployment at https://xion-adventures.xyz

## Install

You don't need to create a .env file for the frontend to function. Every variable is defined in code.

```sh
pnpm install
pnpm generate
```

## Run

```sh
pnpm dev
```

## Build and expose

```sh
pnpm build
pnpm start
```
