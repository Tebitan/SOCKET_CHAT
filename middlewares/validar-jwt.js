const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJwt = async(req = request, res = response, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticiòn'
        });
    }
    try {
        //obtenemos ID del usuario del payload del token 
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'token no valido - usuario no existe en DB'
            });
        }

        //validamos si esta activo 
        if (!usuario.state) {
            return res.status(401).json({
                msg: 'token no valido - usuario Inactivo'
            });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'token no valido'
        });
    }
}


module.exports = {
    validarJwt
}