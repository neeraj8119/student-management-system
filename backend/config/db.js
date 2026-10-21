const mysql = require('mysql2/promise');

require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const isLocal = /^(localhost|127\.0\.0\.1|::1)$/i.test(dbHost);
const useSSL = !isLocal && !['0', 'false', 'no'].includes(String(process.env.DB_SSL || '').toLowerCase());

const pool = mysql.createPool({
    host: dbHost,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_management',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    ssl: useSSL ? { minVersion: 'TLSv1.2' } : undefined
});

module.exports = pool;
