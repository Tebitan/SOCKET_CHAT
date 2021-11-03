const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary, mostrarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir, validarCampos } = require('../middlewares');


const route = Router();

route.post('/', validarArchivoSubir, cargarArchivo);
route.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'ID no valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['productos', 'usuarios'])),
    validarCampos
], actualizarImagenCloudinary);

route.get('/:coleccion/:id', [
    check('id', 'ID no valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['productos', 'usuarios'])),
    validarCampos
], mostrarImagenCloudinary);

module.exports = route;