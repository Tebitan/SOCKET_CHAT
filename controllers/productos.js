const { request, response } = require("express");
const { Producto, Categoria } = require("../models");

const crearProducto = async(req = request, res = response) => {
    const { state, user, ...body } = req.body;
    try {
        //Generar la Data a Guardar
        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.usuario._id,
        };
        const producto = new Producto(data);
        //Guardamos BD
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const obtenerProductos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    try {
        //agrupamos los 2 promesas , para que se ejecuten simultaneamente mas eficiente
        //Desectruturamos por posicion  0 -> total y 1 -> Usuarios
        //populate es para INNER JOIN 
        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query).populate('user', 'name').populate('categoria', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
        ]);
        res.json({ total, productos });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const obtenerProducto = async(req = request, res = response) => {
    const id = req.params.id;
    try {
        const producto = await Producto.findById(id).populate('user', 'name').populate('categoria', 'name');
        res.json(producto);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const actualizarProducto = async(req = request, res = response) => {
    const id = req.params.id;
    const { state, user, ...data } = req.body;
    try {
        if (data.name) {
            data.name = data.name.toUpperCase();
            //validacion por nombre 
            const productoDB = await Producto.findOne({ name: data.name });
            console.log(productoDB._id != id);
            if (productoDB) {
                if (productoDB._id != id) {
                    return res.status(400).json({
                        msg: `El producto ${ productoDB.name } ya existe`
                    });
                }
            }
        }
        if (data.categoria) {
            const categoria = await Categoria.findById(data.categoria);
            if (!categoria) {
                return res.status(400).json({
                    msg: `La categoria con ID ${ id } No existe`
                });
            }
        }
        data.user = req.usuario._id;
        //new:true -> para que envie el nuevo objeto modifcado 
        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
        res.json(producto);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const borrarProducto = async(req = request, res = response) => {
    const id = req.params.id;
    try {
        const user = req.usuario._id;
        const producto = await Producto.findByIdAndUpdate(id, { state: false, user }, { new: true });
        res.json(producto);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
};