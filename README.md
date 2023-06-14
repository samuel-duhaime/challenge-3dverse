# Challenge 3dverse

## Setup the repo

### Clone the repo

```
git clone https://github.com/samuel-duhaime/challenge-3dverse.git
```

### Install the server

```
cd server
npm install
```

### Setup the .env in the server
```
MONGO_USERNAME = "username"
MONGO_PASSWORD = "password"
```

### Start the mongoDB database with Docker

```
cd server
docker-compose up
npm run batchImport // Run a script to import 3 documents to the files collection
```

### Start the server

```
cd server
npm run dev
```

### Install and start the client

```
cd client
npm install
npm run start:w
```
