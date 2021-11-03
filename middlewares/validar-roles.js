const { response, request } = require('express');


const isAdminRole = (req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere validar el role sin validar el token primero'
        });
    }
    const { role, name } = req.usuario;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ name } no es ADMINISTRADOR - No puede hacer esto`
        });
    }
    next();
}

const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere validar el role sin validar el token primero'
            });
        }
        const { role, name } = req.usuario;
        if (!roles.includes(role)) {
            return res.status(401).json({
                msg: `${ name } no tiene ninguno de estos roles ${roles}`
            });
        }
        next();
    };
}


module.exports = {
    isAdminRole,
    tieneRole
}