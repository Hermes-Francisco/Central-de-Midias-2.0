const app = require('../app');
const io = require('socket.io')(app);


module.exports = io;