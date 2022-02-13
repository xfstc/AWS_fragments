// src/authorization/index.js

// Prefer Amazon Cognito

// Also allow for an .htpasswd file to be used, but not in production
if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
  module.exports = require('./basic-auth');
} else if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  module.exports = require('./cognito');
}
// In all other cases, we need to stop now and fix our config
else {
  throw new Error('missing env vars: no authorization configuration found');
}
