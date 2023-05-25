const express = require('express');
const {getUsersWithPostCount, getUsersWithPostCountSlow} = require('./controllers/user.controller');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', getUsersWithPostCount);

module.exports = app;