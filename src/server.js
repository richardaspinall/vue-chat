require('dotenv').config();
const express = require('express');
const router = require('./router');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Catch errors from parsing middleware above
// eslint-disable-next-line consistent-return
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error(err);
    return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  next();
});

app.use(router);

const PORT = process.env.PORT || 3000;
const server = app.listen(3000, () => {
  console.log(`Server has started on port ${PORT}`);
});

module.exports = server; // Tests
