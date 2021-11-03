const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    //validaciones de campos en la peticion por ej : campos requeridos , email , ect ....
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();
};

module.exports = {
    validarCampos
}