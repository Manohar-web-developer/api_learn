const express = require('express');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { create, view, details, update, changeStatus, softDelete } = require('../../controllers/admin/color.controllers');

const route = express.Router();

module.exports = (server) => {

    route.post('/create', upload.single('image'), create);
    route.post('/view', upload.none(), view);
    route.post('/details/:id', upload.none(), details);
    route.put('/update/:id', upload.none(), update);
    route.put('/changeStatus/:id', upload.none(), changeStatus);
    route.delete('/softDelete/:id', upload.none(), softDelete);

    server.use('/api/admin/color', route);

}