## Overview

This folder contains the source code of O̍h Tâi Bûn, which is the term project for System Analysis and Design (IM3007) by group 8.  
The system has not been deployed yet, but you can already run it on your local devices.

## Prerequisite

The system is built with a MERN stack. To run the app, you must install MongoDB and Node.js before proceeding to launch the app.

## Import the data into the database

The data used in the application is located in [miscellaneous](/miscellaneous) folder.  
Run [importCSV.js](/miscellaneous/importCSV.js) to import all data needed to be stored in the backend, which requires the installation of MongoDB.

## Run the server

The server is located in [server](/server/) folder.  
You can activate the server by running the following code in the terminal, which requires the installation of node.js and possibly other packages that can be installed with npm.

```
npm install
node index.js
```

Notice that to run the application successfully, the server should be running at all time when the system is in use.

## Activate the application

Next, we can proceed to launch the application.  
Launch the app in [client](/client) folder by running the following code in the terminal.  
If it's your first time running the app, run the following code to install the necessary packages.

```
npm install
```

After that, you can run the following code and the app should be launched in your default browser.

```
npm start index.html
```
