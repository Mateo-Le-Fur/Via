const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const router = require('./routers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../client/build/')));

app.use(cors('*'));

app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = app;
