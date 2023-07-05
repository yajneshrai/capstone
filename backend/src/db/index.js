const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../logger');

const connection = mongoose.connect(`${config.DB_URL}/${config.DB_NAME}`, {
    auth: {
        username: config.DB_USER_NAME,
        password: config.BD_PASSWORD
    }
})
.then(() => logger.info('Connected to database!'))
.catch(err => logger.error(err));

module.exports = connection;