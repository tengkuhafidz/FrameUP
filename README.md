# FRAMEUP

This is a Progressive Web App (PWA) that aims to help software developers to explore the many development frameworks.

This PWA is built with Vue.js, Firebase - Firestore, Storage, and Google OAuth.

It is running live [here](https://frameup.ml).

## Running the Project
Please ensure you have `node` and `Vue CLI` installed.

1. Open the project folder on your terminal/command line
2. Run `yarn install`
3. Run `yarn serve`

## Deploying Changes  

Make sure you have `firebase-tools` installed, and you have logged in to your account with it. You account will need to have permissions to the firebase console of this project.

1. Open the project folder on your terminal/command line
2. Run `yarn build`
3. Run `firebase deploy`

Changes will be reflected live on the [hosted PWA](https://frameup.ml).

## Folder Structure
The main folders that you will need to work on are in the `src` folder. 

In the `src folder, you can find the following important folders:

1. **views**: This folder contains all the pages/screens of the PWA
1. **components**: This folder contains the components that is being used by the files in `views` folder. It is categorised in a folder that mirrors the screen's filename.
2. **services**: This folder contains an `api.js` file that has all the api requests functions that is used for this PWA.
