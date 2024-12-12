# Onboarding flow

In this README, we present the proposed flow for unboarding new users to this wonderful game ! 

## First App arrival

On their first arrival on the app, users will be able to play the game directly. The game objectives as well as the current limits for playing without logging-in will be presented.

They will start using the map of the default chain (xion) and will be placed at the default start location (general map 0,0).

Local storage is used to store temporary state (movements, movementsBackup)
If local storage is present, we resume from what was saved there

At every moment, the players, can push the wallet button on the screen to login inside the game. Another menu will be available on the right for player customization. 

As soon as the play limit is reached (for instance, we could implement a 2 minutes maximum play without login), the game is saved locally in the browser and the first login is initiated

## First Login

The first login will be longer than the other ones for users (which is bad, we will strive to solve that later on). 
Here are the steps for the first login : 
- Create a Xion Meta Account
- Create an Abstract Account (with IBC client, xion-adventures-hub and game-handler installed)
- Whitelist the Game Handler contract on the HUB (to be able to send requests from the gae Handler to the HUB)
- Create an account and mint an associated NFT
- Send the first steps that the user has done before login to the contract and resolve them
Apart from the XION meta login, all the other steps can be executed in the background by the XION wallet without the user needing to do anything while they continue to play. 

## Subsequent logins

If the user already has an account, they choose it at the beginning of the game and start again from their last saved locations. 