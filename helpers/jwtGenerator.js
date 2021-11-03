const jwt = require('jsonwebtoken');
const { Usuario } = require("../models")

const generarJWT = (uid = '') => {
    //callback to promise 
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: process.env.TIMEEXPIREDTOKEN
        }, (err, token) => {
            if (err) {
                console.log('[JWT] ' + err);
                reject('No se pudo generar el token');
            } else {
                resolve(token)
            }

        });
    });
};

const comprobarJWT = async(token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return null;
        } else if (!usuario.state) {
            return null;
        }


        return usuario;
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    generarJWT,
    comprobarJWT
}