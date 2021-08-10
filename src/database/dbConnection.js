const mysql = require('mysql');
const util = require('util');

class DBConnection {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Makes querying asynchronous for async/await syntax
    this.connection = util.promisify(this.pool.query).bind(this.pool);
  }

  async execute(query) {
    return this.connection(query);
  }

  closePool() {
    this.pool.end();
  }
}

module.exports = new DBConnection();
