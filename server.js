const express = require('express');
const mongoose = require('mongoose');


const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }))

server.get('/', (request, response)=> {
    response.send("Server Working")
})

require('./src/routes/admin/default.routs')(server)
require('./src/routes/admin/material.routs')(server)
require('./src/routes/admin/color.routs')(server)

server.listen(8000, async()=> {
    console.log("Server Working Fine");
    await mongoose.connect('mongodb://127.0.0.1:27017/api-learn')
    console.log('DataBase Connected');
});