require('dotenv').config();
const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  multipleStatements: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

const query = util.promisify(connection.query).bind(connection);

async function clearTests() {
  // Delete user
  try {
    await query({
      sql: 'DELETE FROM user WHERE user_name = ?',
      values: 'jdoe',
    });
  } catch (error) {
    console.log(error);
  }

  // Delete room
  try {
    await query({
      sql: 'DELETE FROM room WHERE room_name = ?',
      values: 'cats',
    });
  } catch (error) {
    console.log(error);
  }

  connection.end();
}

module.exports = clearTests;
