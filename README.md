# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

## Required Technologies
Your application must make use of the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to Completion

### 1. Plan to Meet Requirements

In this repo there is a `REQUIREMENTS.md` document which outlines what this API needs to supply for the frontend, as well as the agreed upon data shapes to be passed between front and backend. This is much like a document you might come across in real life when building or extending an API. 

Your first task is to read the requirements and update the document with the following:
- Determine the RESTful route for each endpoint listed. Add the RESTful route and HTTP verb to the document so that the frontend developer can begin to build their fetch requests.    
**Example**: A SHOW route: 'blogs/:id' [GET] 

- Design the Postgres database tables based off the data shape requirements. Add to the requirements document the database tables and columns being sure to mark foreign keys.   
**Example**: You can format this however you like but these types of information should be provided
Table: Books (id:varchar, title:varchar, author:varchar, published_year:varchar, publisher_id:string[foreign key to publishers table], pages:number)

**NOTE** It is important to remember that there might not be a one to one ratio between data shapes and database tables. Data shapes only outline the structure of objects being passed between frontend and API, the database may need multiple tables to store a single shape. 

### 2.  DB Creation and Migrations

Now that you have the structure of the databse outlined, it is time to create the database and migrations. Add the npm packages dotenv and db-migrate that we used in the course and setup your Postgres database. If you get stuck, you can always revisit the database lesson for a reminder. 

You must also ensure that any sensitive information is hashed with bcrypt. If any passwords are found in plain text in your application it will not pass.

### 3. Models

Create the models for each database table. The methods in each model should map to the endpoints in `REQUIREMENTS.md`. Remember that these models should all have test suites and mocks.

### 4. Express Handlers

Set up the Express handlers to route incoming requests to the correct model method. Make sure that the endpoints you create match up with the enpoints listed in `REQUIREMENTS.md`. Endpoints must have tests and be CORS enabled. 

### 5. JWTs

Add JWT functionality as shown in the course. Make sure that JWTs are required for the routes listed in `REQUIUREMENTS.md`.

### 6. QA and `README.md`

Before submitting, make sure that your project is complete with a `README.md`. Your `README.md` must include instructions for setting up and running your project including how you setup, run, and connect to your database. 

Before submitting your project, spin it up and test each endpoint. If each one responds with data that matches the data shapes from the `REQUIREMENTS.md`, it is ready for submission!


## Instructions
### 1. App Setup
- Create a file in the project root named **`.env`** file. That is, at the same level as the **`src`** or **`package.json`** file.
- In the **`.env`** file, create the following variables:
>**PGHOST**: URL of the postgres database server. If the database server runs on the local computer, then:
```
PGHOST=localhost
```

  >**PGPORT**: port on which the postgres server listens. The default port on which postgres db runs is  `5432`. Thus: 
```
PGPORT=5432
```
  >**PGUSER**: postgres username for the app. A database user may be created for the app by logging into a `psql` terminal as a postgres super user and executing the following line:
```
CREATE USER store_api WITH PASSWORD store_api_password;
```
  Now we can set the  **`PGUSER`** as `store_api` as such:
```
PGUSER=store_api
```

  >**DBNAME** : database name for the app. A database may be created for the app by executing:
```
CREATE DATABASE superstore;
``` 

  >**TESTDB**: database name set for testing purposes. Another database may be created for testing purposes by executing:
```
CREATE DATABASE superstore_test_db;
```
  However, a test database is created with `db-migrate` with the npm test script:
```
"test": "TESTDB=testDB && db-migrate db:create $TESTDB && db-migrate up --env test && ENV=test jasmine-ts -r dotenv/config; db-migrate db:drop $TESTDB"
```

  >**PGPASSWORD**: secret password for logging into the postgres db server as a database user. The password for the `store_api` user created above is `store_api_password`, so we can set the **`PGPASSWORD`** as `store_api_password`, that is:
```
PGPASSWORD=store_api_password
```

  >**ENV**: environment on which the app is running. This variable is important for selecting which database to connect with. The database connection script `src/database.ts` selects the database based on the **`ENV`** variable. The port on which the server listens for requests also depends on the **`ENV`** variable as well(port 3001 for `test` env and port 3000 otherwise). The connection port is selected in the `src/server/ts`. So the **`ENV`** variable can be set as test or development, production, etc
```
ENV=test
```
  or
```
ENV=development
```

  >**BCRYPT_PASSWORD**: secret password for creating hash strings of user passwords.

  >**SALT_NUM**: salt number for hashing passwords.

  >**TOKEN_SECRET**: secret password for signing and verifying JSON web tokens.

- Create database credentials corresponding with the values set in the **`.env`** file.
- Ensure that all necessary privileges are given to the created **`PGUSER`**  on the created database for the app. This can be done by executing the following as a postgres super user from a `psql` terminal.
```
GRANT ALL PRIVILEGES ON DATABASE <DBNAME> TO <PGUSER>
```
That is, for example
```
GRANT ALL PRIVILEGES ON DATABASE superstore TO store_api;
```
- Install the app dependencies by running
```
npm install 
```
- Create the table migrations by running 
```
npx db-migrate
```
### 2. Running the app
- the line below runs the app in a development server mode
```
npm run watch
```
- To run a production ready version of our app, the  project has to be transpiled using the following:
```
npm tsc
```
This will transpile the project files from TypeScript to JavaScript.
- The line below runs the app in a production server mode
```
npm start
```
### 3. Endpoints
The following endpoints are available on the api:
#### Users routes
- Users index route accessible only to a logged in admin user.
> `GET /users`
- Create user route. Payload requires at least a non existing username and password to create new user.
> `POST /users`
- Authenticate/ login route. Payload requires an existing username and a corresponding password to authenticate user and generate a JWT
> `POST /users/login`
- Show user route. Requires a valid `username` as a URL parameter.
> `GET /users/user/:username`
#### Products routes
- Products index route.
> `GET /products`
- Create product route. Requires at least a product name and price in the request body. Accessible only to a logged in admin user.
> `POST /products`
- Show product route. Requires a valid product `id` as a URL parameter.
> `GET /products/:id`
#### Orders routes
- Orders index. Accessible only to a logged in admin user.
> `GET /orders`
- Create order. Accessible to any logged in user. The request body requires at leat a valid product `id`.
> `POST /orders`
- Show active order by user. Accessible to any logged in user.
> `GET /orders/cart`
- Checkout active order.
> `PUT /orders/checkout`
- Show order. Accessible to any logged in user. Requires a valid order `id` as a URL parameter.
> `GET /orders/:id`