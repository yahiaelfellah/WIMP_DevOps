// db.test.js

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.MARIADB_HOST || 'localhost',
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || 'password',
  database: process.env.MARIADB_DATABASE || 'WIMPv2',
  port: process.env.MARIADB_PORT || 3306,
};

let connection;

async function connect() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }
  return connection;
}

async function clearAllTables() {
  if (connection) {
    const db = await connect();
    const [rows] = await db.query('SHOW TABLES');
    for (const row of rows) {
      await db.query(`DELETE FROM ${row.Tables_in_WIMPv2}`);
    }
  }
}

async function close() {
  if (connection) {
    await connection.end();
    connection = null;
  }
}

beforeAll(async () => {
  await clearAllTables();
});

afterAll(async () => {
  await close();
});

describe('MariaDB connection', () => {
  test('connects to MariaDB', async () => {
    const db = await connect();
    await clearAllTables();
    const [rows] = await db.query('SHOW TABLES');
    expect(Array.isArray(rows)).toBe(true);
  });
});

module.exports = {
  connect,
  clearAllTables,
  close,
};
