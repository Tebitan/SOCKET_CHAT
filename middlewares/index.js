const validarJwt = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarCampos = require('../middlewares/validarCampos');
const validaArchivo = require('../middlewares/validar-archivo');

module.exports = {
    ...validarJwt,
    ...validaRoles,
    ...validarCampos,
    ...validaArchivo
}