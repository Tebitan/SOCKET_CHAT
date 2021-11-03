const { Router, response } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoForName, existeCategoriaForID, existeProductoForID } = require('../helpers/dbValidators');
const { validarJwt, validarCampos, isAdminRole } = require('../middlewares');

const route = Router();

route.get('/', obtenerProductos);

route.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existeProductoForID),
    validarCampos
], obtenerProducto);

route.post('/', [validarJwt,
    check('name', 'El nombre es Obligatorio').not().isEmpty(),
    check('name').custom(existeProductoForName),
    check('categoria', 'La categoria es Obligatoria').not().isEmpty(),
    check('categoria', 'ID categoria no es valido').isMongoId(),
    check('categoria').custom(existeCategoriaForID),
    validarCampos
], crearProducto);

route.put('/:id', [validarJwt,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existeProductoForID),
    validarCampos
], actualizarProducto);

route.delete('/:id', [validarJwt, isAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existeProductoForID),
    validarCampos
], borrarProducto);


module.exports = route;