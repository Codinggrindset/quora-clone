const { createClient } = require('redis');

const client = createClient({ url: 'redis://127.0.0.1:6379' });

client.connect().then(() => console.log('Redis connected')).catch((err) => console.error(err));

const setEx = (key, value, expiry) => client.set(key, value, expiry);

module.exports = { setEx };
