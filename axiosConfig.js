require('dotenv').config();

const config = {
  headers: {
    Accept: 'application/json',
    app_id: process.env.APP_ID,
    app_key: process.env.APP_KEY,
  },
};

module.exports = config;
