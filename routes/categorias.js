const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');
const { existeCategoriaForID, existeCategoriaForName } = require('../helpers/dbValidators');
const { validarJwt, validarCampos, isAdminRole } = require('../middlewares');

const route = Router();

route.get('/', obtenerCategorias);

route.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existeCategoriaForID),
    validarCampos
], obtenerCategoria);

route.post('/', [validarJwt,
    check('name', 'El nombre es Obligatorio').not().isEmpty(),
    check('name').custom(existeCategoriaForName),
    validarCampos
], crearCategoria);

route.put('/:id', [validarJwt,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existeCategoriaForID),
    check('name', 'El nombre es Obligatorio').not().isEmpty(),
    check('name').custom(existeCategoriaForName),
    validarCampos
], actualizarCategoria);

route.delete('/:id', [validarJwt, isAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existeCategoriaForID),
    validarCampos
], borrarCategoria);


module.exports = route;