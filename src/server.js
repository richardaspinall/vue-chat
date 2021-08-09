require('dotenv').config();
const express = require('express');
const router = require('./router');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

const PORT = process.env.PORT || 3000;
const server = app.listen(3000, () => {
  console.log(`Server has started on port ${PORT}`);
});

module.exports = server; // Tests
