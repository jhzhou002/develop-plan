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
  // 连接管理配置
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // 重连配置
  reconnect: true,
  maxReconnects: 3,
  reconnectDelay: 1000,
  // SQL配置
  multipleStatements: false,
  supportBigNumbers: true,
  bigNumberStrings: true
};

let pool;

const initDatabase = () => {
  try {
    pool = mysql.createPool(DB_CONFIG);
    
    // 监听连接池事件
    pool.on('connection', (connection) => {
      console.log('新的数据库连接建立:', connection.threadId);
    });
    
    pool.on('error', (err) => {
      console.error('数据库连接池错误:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('重新创建连接池...');
        initDatabase();
      }
    });
    
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

// 带重试的数据库执行方法
const executeWithRetry = async (query, params = [], retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = getConnection();
      return await connection.execute(query, params);
    } catch (error) {
      console.warn(`数据库查询失败 (尝试 ${i + 1}/${retries}):`, error.message);
      
      if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('连接重置，重新初始化连接池...');
        pool = null;
        initDatabase();
        
        if (i === retries - 1) {
          throw error;
        }
        // 等待一下再重试
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        throw error;
      }
    }
  }
};

module.exports = {
  initDatabase,
  getConnection,
  executeWithRetry
};