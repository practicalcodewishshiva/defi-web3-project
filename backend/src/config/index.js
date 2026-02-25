require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'tidefall_db',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiry: process.env.JWT_EXPIRY || '7d',
  },
  
  blockchain: {
    polygonMumbaiRpc: process.env.POLYGON_MUMBAI_RPC || 'https://rpc-mumbai.maticvigil.com',
    polygonMainnetRpc: process.env.POLYGON_MAINNET_RPC || 'https://polygon-rpc.com',
    contractAddressArtifacts: process.env.CONTRACT_ADDRESS_ARTIFACTS || '',
    contractAddressHeroes: process.env.CONTRACT_ADDRESS_HEROES || '',
    contractOwnerPrivateKey: process.env.CONTRACT_OWNER_PRIVATE_KEY || '',
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTesting: process.env.NODE_ENV === 'testing',
};

module.exports = config;
