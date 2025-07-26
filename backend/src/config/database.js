const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: '8.153.77.15',
  user: 'connect',
  password: 'Zhjh0704.',
  database: 'develop-plan',
  port: 3306,
  charset: 'utf8mb4',
  timezone: '+08:00',
  connectionLimit: 10,
  queueLimit: 0,
  reconnect: true,
  reconnectDelay: 1000
};

let pool;

const initDatabase = () => {
  try {
    pool = mysql.createPool(DB_CONFIG);
    console.log('数据库连接池创建成功');
    return pool;
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
};

const getConnection = () => {
  if (!pool) {
    initDatabase();
  }
  return pool;
};

module.exports = {
  initDatabase,
  getConnection
};