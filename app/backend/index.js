const express = require('express');
const cors = require('cors');
const path = require('path');

const router = require('./routers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client/build/')));

app.use(cors('*'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use(router);

module.exports = app;
