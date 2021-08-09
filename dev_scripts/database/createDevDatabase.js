require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

// Schema / Creation script
const schemaSql = fs.readFileSync(path.join(__dirname, './schema.sql')).toString();

// Seed script
const seedSql = fs.readFileSync(path.join(__dirname, './seed.sql')).toString();

const connection = mysql.createConnection({
  multipleStatements: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Doesn't actually do anything. Looks cool
(function loadingMessage() {
  process.stdout.write('---|\r');

  let dots = '';
  process.stdout.write('Running ');

  const timerID = setInterval(() => {
    dots += '-';
    process.stdout.write(`\rRunning ${dots}`);
  }, 50);

  setTimeout(() => {
    clearInterval(timerID);
    console.log(' Complete');
  }, 1500);
})();

// loadingMessage();
// MySQL runs these queries in sequence with the one connection
connection.connect();

// Recreate database
connection.query('DROP DATABASE IF EXISTS vuechatapp; CREATE DATABASE vuechatapp;', (error) => {
  if (error) throw error;
});

// Insert tables
connection.query(schemaSql, (error) => {
  if (error) throw error;
});

// Seed database
connection.query(seedSql, (error) => {
  if (error) throw error;
});

connection.end();
