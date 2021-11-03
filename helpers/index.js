const dbValidators = require('./dbValidators');
const generarJWT = require('./jwtGenerator');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

//... exporta valirables y cosas globales 
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
};