const express = require('express');
const router = express.Router();
const User = require('../models/user');
const logger = require('../logger');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    logger.info({ email }, 'REST API request: /login');
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.send({ userFound: true, user });
        } else {
            res.send({ userFound: false, user: null });
        }
    } catch (e) {
        logger.info({ error: e }, 'REST API error: /login');
        res.status(500).send({ userFound: false, user: null, error: e });
    }
});

router.put('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    logger.info({ name, email, role }, 'REST API request: /signup');
    const newUser = new User({
        name,
        email,
        password,
        role,
        attemptedQuizzes: []
    });
    try {
        const resp = await newUser.save();
        res.send({ user: resp });
    } catch (e) {
        logger.info({ error: e }, 'REST API error: /signup');
        res.status(500).send({ error: e, message: 'Signup failed!'});
    }
});

module.exports = router;