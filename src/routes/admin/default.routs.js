const express = require('express');
const { create, view, details, update, changeStatus, softDelete } = require('../../controllers/admin/default.controllers');

const route = express.Router();

module.exports = (server) => {

    route.post('/create', create);
    route.post('/view', view);
    route.post('/details/:id', details);
    route.put('/update/:id', update);
    route.put('/changeStatus/:id', changeStatus);
    route.delete('/softDelete/:id', softDelete);

    server.use('/api/admin/default', route);

}