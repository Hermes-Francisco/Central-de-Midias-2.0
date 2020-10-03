const express = require('express');
const routes = require('./routes');

class App{
    constructor(){
        this.app = express();
        this.middlewares();
        this.router();
    }

    middlewares(){
        this.app.use(express.json());
    }

    router(){
        this.app.use(routes);
    }

}
module.exports = new App().app;