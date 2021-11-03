const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    //  2 promesas
    /* const usuarios = await Usuario.find(query)
         .skip(Number(desde))
         .limit(Number(limite));

     const total = await Usuario.countDocuments(query);*/

    //agrupamos los 2 promesas , para que se ejecuten simultaneamente mas eficiente
    //Desectruturamos por posicion  0 -> total y 1 -> Usuarios
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({ total, usuarios });
}

const usuariosPost = async(req = request, res = response) => {

    const { name, email, password, role } = req.body;
    const usuario = new Usuario({ name, email, password, role });

    //Encriptar la contraseña 
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();

    res.json(usuario);
}

const usuariosPut = async(req = request, res = response) => {
    const id = req.params.id;
    //resto = es el objeto que yo voy a modificar execto  (_id,password, google, email)
    const { _id, password, google, email, ...resto } = req.body;

    // TODO validar contra base de datos 

    if (password) {
        //Encriptar la contraseña 
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosDelete = async(req = request, res = response) => {
    const id = req.params.id;
    //fisicamente lo borramos 
    /*const usuario =  await Usuario.findByIdAndDelete(id); */
    const usuario = await Usuario.findByIdAndUpdate(id, { state: false });
    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}