## Overview
This is the official GitHub page for the term project, O̍h Tâi Bûn, for Group 8 of System Analysis and Design (IM3007).  
The system has not been deployed yet, but you can run it on your local devices.

## Prerequisite
The system is built with a MERN stack. To run the app, you must install MongoDB and Node.js before proceeding to the next step.

## Import the data into the database
The data used in the application is located in [miscellaneous](/miscellaneous) folder.  
Run this [javascript file](/miscellaneous/importCSV.js) to import all data needed to be stored in the backend (MongoDB).

## Run the server
The server is located in [server](/server/) folder.  
You can activate the server by running the following code in terminal if you are under the server folder.
```
node index.js
```

## Activate the application
Next, we can proceed to launch the application.  
Launch the app in [client](/client) folder by running the following code in the terminal.
If it's your first time running the app, run
```
npm install
```
After installing the necessary packages, run
```
npm start index.html
```
After that, the app should launch in your default browser.
