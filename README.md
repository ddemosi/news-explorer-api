# News Explorer API

> A portfolio API designed for the news-explorer project.

Access the API via https here: api.danny-news.students.nomoreparties.site

Or visit the hosted frontend [here](https://www.danny-news-explorer.students.nomoreparties.site)

You can also view the frontend development files of this project [here](https://github.com/ddemosi/news-explorer-frontend)

This api features database calls from ExpressJS to the Mongoose ODM for MongoDB. It also features cross-origin request handling, as used in many of today's modern SPAs (Single Page Applications).

## Installation

This is a public API accessible from the hosted frontend [here](https://www.danny-news-explorer.students.nomoreparties.site) or via request from localhost:3000. As this is a portfolio project hosted on small instance, no API key is required.

If you'd like to run the api from a local machine, clone the files locally and run: 

```sh
npm install
```

Then: 

```sh
node app
```

If using on a Linux build or any other remotely hosted server, I highly recommend running this with a production process manager such as PM2. The error handling middleware has a few bugs that haven't been ironed out yet, so you'll want something to restart the application in the event of an unhandled error.

## How to use

> This API is designed to be used in conjunction with newsapi.org. Specifically to save articles from their servers onto a local machine. This is built into the functionality of the frontend referenced above.

There are four primary routes:

* /signup
    * Used for user registration
* /signin
    * Used for user login and initial authentication
* /users
    * Retrieves user associated data
* /articles
    * Used for storing and modifying articles

The /signin and /signup routes are not protected and accept POST requests. /users and /articles are both protected and require a valid authorization token. Authorization tokens are issued via the /signin route.

The /users route accepts GET requests and retrieves user data. For the purpose of this project, editing user info was superfluous.

The /articles route accept GET, POST, and DELETE requests. Articles are associated with a userID, so they can retrieved based on which user saved that article.

Acceptable data models can be viewed in the "routes" directory of this repository. All routes are pre-validated with the "celebrate-joi" middleware package and list the acceptable data formats.

*If you'd like to add a whitelisted DNS address to the CORS policy, navigate to the app.js file and modify the array constant called "allowedCors".

Enjoy!

## Note:

This API was originally built on session-based authentication via cookies. This has been changed to the more scalable "token" based authentication in the latest update. There are still leftover resources to accommodate the previous session-based authentication model.


## Meta

Daniel Gummow (dannydemosi) – [LinkedIn](https://www.linkedin.com/in/daniel-gummow-223043186/) – rdgummow@gmail.com

[Github](https://github.com/ddemosi/)
