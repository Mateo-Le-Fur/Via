const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = require('./routers');
const { errorHandler } = require('./helpers/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client/build/')));

app.use(cors('*'));

app.use(cookieParser('secret'));

app.use('/api', router);

app.use(errorHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = app;
