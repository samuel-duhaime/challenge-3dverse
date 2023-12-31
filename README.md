# Challenge 3dverse
Welcome to the Challenge 3dverse repository! This repository contains the code for the REST API server, the frontend, and the Docker setup for the MongoDB database. It provides a file storage solution for managing files through a RESTful API.

## OpenAPI Specification
The OpenAPI specification file (openAPI.json) can be found in the root of the repository. It provides a detailed description of the REST API endpoints and their functionality.

## Setup Instructions
Follow the steps below to set up and run the application on your local machine:

1- Clone the repository

```
git clone https://github.com/samuel-duhaime/challenge-3dverse.git
```

2- Install the server

```
cd server
npm install
```

3- Setup the .env in the server
```
MONGO_USERNAME = "username"
MONGO_PASSWORD = "password"
```

4- Start the mongoDB database with Docker

```
cd server
docker-compose up
npm run batchImport // Run a script to import 3 documents to the files collection
```

5- Start the server

```
cd server
npm run dev
```

6- Install and start the client

```
cd client
npm install
npm run start:w
```
