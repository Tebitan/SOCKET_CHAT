const { request, response } = require("express");
const { Categoria } = require("../models");

const crearCategoria = async(req = request, res = response) => {
    const name = req.body.name.toUpperCase();
    try {
        //Generar la Data a Guardar
        const data = {
            name,
            user: req.usuario._id
        };
        const categoria = new Categoria(data);
        //Guardamos BD
        await categoria.save();
        res.status(201).json(categoria);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const obtenerCategorias = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    try {
        //agrupamos los 2 promesas , para que se ejecuten simultaneamente mas eficiente
        //Desectruturamos por posicion  0 -> total y 1 -> Usuarios
        //populate es para INNER JOIN 
        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query).populate('user', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
        ]);

        res.json({ total, categorias });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const obtenerCategoria = async(req = request, res = response) => {
    const id = req.params.id;
    try {
        const categoria = await Categoria.findById(id).populate('user', 'name');
        res.json(categoria);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const actualizarCategoria = async(req = request, res = response) => {
    const id = req.params.id;
    const { state, user, ...data } = req.body;
    try {
        data.name = data.name.toUpperCase();
        data.user = req.usuario._id;
        //new:true -> para que envie el nuevo objeto modifcado 
        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
        res.json(categoria);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const borrarCategoria = async(req = request, res = response) => {
    const id = req.params.id;
    try {
        const user = req.usuario._id;
        const categoria = await Categoria.findByIdAndUpdate(id, { state: false, user }, { new: true });
        res.json(categoria);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};




module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
};