![Logo of the project]()

[//]: # (TODO: put logo link here)


# Gridly Bear
> Electrical Modeling Tool

Gridly Bear is an electrical modelling tool with a friendly GUI best suited for 
beginners."It uses PandaPower to ensure all the simulation are correct."?

[//]: # (Last line needs replecements)

## Getting started

To use the app just go to https://gridlybear.web.app/ and start modelling.

## Features

Our app is best suited for beginners because it abstracts the programming layer and a
good part of the Electrical Engineering one from powerful modelling tools like PandaPower.
with a user friendly and easy to use GUI.
 -You can visualise the configuration of your network at the location.
 -You can run powerflow simulations and get results both 

## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome.

### Initial Configuration

If you wish to further develop and deploy your own version here is how to set up the app:

This will install the necessary dependencies
```shell
git clone 'link'
cd grid-modelling-gui/
poetry install
cd ./react-app
npm install
```

## Developing Client Side

In order to test the client side locally you can run:

```shell
npm start
```

### Building

```shell
npm build
```
This will create an optimized version for deployment

## Developing Server Side
In order to deploy on google cloud using firebase you will need to 
create a firebase project(https://firebase.google.com/). Deploying the functions will 
require a paid plan.


After you have created your project:

-replace firebaseConfig in ./react-app/src/utils/api_interaction with your on config
that you can find on the main page of your project

```shell
cd ..
firebase login
firebase init # only tick functions, deployment and emulators
```

In order to test the server side locally you need to:

Installing dependencies and setting up virtualenv for running the server emulator:
```shell
cd ./functions
pip install
vitrualenv venv
venv\Scripts\activate.bat
```

To start up the emulators run:

```shell
firebase emulators:start
```
to connect to the emulators uncomment line 17 from ./react-app/src/utils/api_interaction

### Deploying / Publishing

To deploy your project:

```shell
firebase deploy
```
This will upload your code to the google cloud servers



## Links

If you want to know more about 

- Project homepage: https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-l/09d/grid-modelling-gui
- Repository: https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-l/09d/grid-modelling-gui/-/tree/main
- Issue tracker: https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-l/09d/grid-modelling-gui/-/issues
- Related projects:
  - PandaPower: https://github.com/e2nIEE/pandapower



## Licensing

The code in this project is licensed under MIT license.