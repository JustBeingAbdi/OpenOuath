# openOuath

OpenOuath is a Public Ouath Service available for you to use. 

OpenOuath only offers Github, Google and Facebook Ouath Currently, but more will come!


## Important Links
[Api](https://api.openauth.cf)

[Docs](https://docs.openauth.cf)

[Ouath](https://ouath.openauth.cf)

[Npm Package](https://www.npmjs.com/package/@JustBeingAbdi/OpenOuath)


# Instructions

If your Looking to setup your own OpenOuath for privat use Please Follow the instructions below

## Requirements

1. Nodejs v10+
2. Npm
3. MongoDB
4. Access to Facebook & Google Developers Portal (if using facebook ouath) 



## Setup

1. Clone the Repo via Git or via downloading the files
2. Edit the config.json file and fill in with the needed configurations | Scroll down to Config to view all the configurations needed.
3. Run `npm i` and then `node . ` or `node index.js


Then your Done, Your OpenOuath should be accessable via port 3003 for Api and 3004 for Ouath





# Extra Info

## Config

In config.json you will have 8 Configuration Fields. On the first field `url` you will need to change it to the api url. example `api.example.com`.

In second Field you will need to paste the Connection string to your MongoDB Cluster so the Ouath can save States and Access_tokens ( Temporarily )

In the rest it will be clientID's and ClientSecret which you would need to get from the selected Sites Click here for [FaceBook](https://developers.facebook.com), [Google](console.cloud.google.com) and for Github go to Settings then to Developers Settings then to Ouath Apps and Create One.


After that your done!

