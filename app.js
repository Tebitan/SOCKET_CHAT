require('dotenv').config();
const Server = require('./models/server');

const sever = new Server();


sever.listen();