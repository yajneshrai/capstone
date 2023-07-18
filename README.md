# CapStoneQz!

This is a quizzing app made using React, Node.js, GraphQL and MongoDB.

## Prerequisites

1. Latest Node.js version
2. MongoDB with database named `capstone`
3. Install node dependencies by running `npm i` in both `frontend` and `backend` folders


## Steps to run the app

1. Go to `frontend` folder and run `npm start` to start React app
   ```
   cd frontend && npm start
   ```
     
2. Go to `backend/src/db/config.js` and enter DB name and credentials
   ```
   module.exports = {
    DB_URL: <url>,
    DB_NAME: 'capstone',
    DB_USER_NAME: <user_name>,
    BD_PASSWORD: <password>,
   };
   ```
3. Go to `backend` folder and run `npm start` to start express and graphql server
    ```
    cd backend && npm start
    ```

React app will start running on http://localhost:3000/

Express server will start running on http://localhost:9000

GraphQL server will start running on http://localhost:9000/graphql

