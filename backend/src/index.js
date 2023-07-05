const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const expressPinoLogger = require('express-pino-logger');
const logger = require('./logger');
const loggerMiddleware = expressPinoLogger({
    logger,
    autoLogging: true,
});

const db = require('./db');
const controllers = require('./controllers');

const { ApolloServer } = require('apollo-server-express');
const query = require('./resolvers/query');
const mutation = require('./resolvers/mutation');

const PORT = 9000;

app.use(cors(), bodyParser.json(), loggerMiddleware);
app.use('/api', controllers);

const typeDefs = fs.readFileSync(
    path.join(__dirname,'./schema.gql'),
    { encoding: 'utf-8' }
);

const startServers = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers: [
            query,
            mutation
        ]
    });

    await server.start();

    server.applyMiddleware({ app });

    app.listen({ port: PORT }, () =>  {
        const host = `http://localhost:${PORT}`;
        logger.info(`Express server listening on ${host}`)
        logger.info(`GraphQL server listening on ${host}${server.graphqlPath}`);
    });
}

startServers();

