const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connection = util.promisify(pool.query).bind(pool);

export async function execute(query) {
  return await connection(query);
}

export function closePool() {
  pool.end();
}
