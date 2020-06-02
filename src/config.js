module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || '5a140576-a1ec-11ea-bb37-0242ac130002',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost/entrack-app',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://localhost/entrack-app-test',
}