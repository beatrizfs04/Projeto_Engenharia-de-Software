const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10, // adjust based on your needs
  host: 'de.matz.pt',
  user: 'tourit',
  password: 'tourit',
  database: 'tourit'
});

pool.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    console.error('Reconnecting due to lost connection:', err);
  }
});

module.exports = pool;
