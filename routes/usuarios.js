const { Router } = require('express');
const { check } = require('express-validator');
const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
} = require('../controllers/usuarios');
const { isValidRole, emailExist, userExistForID } = require('../helpers/dbValidators');
/*const { validarJwt } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validarCampos');
SE PASA AL ARCHIVO ../middlewares/index.js  que se llama aca abajo 
*/
const {
    validarJwt,
    tieneRole,
    validarCampos
} = require('../middlewares');


const route = Router();

route.get('/', usuariosGet);

//parmetreo en la ruta
route.put('/:id', [check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(userExistForID),
    check('role').custom(isValidRole),
    validarCampos
], usuariosPut);

//validamos todos campos espuestos en el modelo 
route.post('/', [check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo electronico no es válido').isEmail(),
    check('email').custom(emailExist),
    check('role').custom(isValidRole),
    validarCampos
], usuariosPost);

route.delete('/:id', [
    validarJwt,
    tieneRole('ADMIN_ROLE', 'SUPER_ROLE', 'ROOT'),
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(userExistForID),
    validarCampos,
], usuariosDelete);


module.exports = route;