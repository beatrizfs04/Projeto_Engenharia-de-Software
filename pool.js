const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10, // adjust based on your needs
  host: 'IP',
  user: 'USER',
  password: 'PASS',
  database: 'DB'
});

pool.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    console.error('Reconnecting due to lost connection:', err);
  }
});

module.exports = pool;
