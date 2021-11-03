const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require('../models');


const coleccionesPermitidas = [
    'categoria',
    'role',
    'producto',
    'usuario'
];

const buscarUsuarios = async(termino = '', res = response) => {
    try {

        const esMongoID = ObjectId.isValid(termino);
        if (esMongoID) {
            const usuario = await Usuario.findById(termino);
            return res.json({
                results: (usuario) ? [usuario] : []
            });
        }
        //EXPRESION REGULAR OMITA MAYUSCULAS Y MINUSCULAS
        const regex = new RegExp(termino, 'i');
        //OR BUSCAMOS POR NAME O EMAIL Y QUE ESTEN ACTIVOS
        const usuarios = await Usuario.find({
            $or: [{ name: regex }, { email: regex }],
            $and: [{ state: true }]

        });
        res.json({
            results: usuarios
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const buscarCategorias = async(termino = '', res = response) => {
    try {
        const esMongoID = ObjectId.isValid(termino);
        if (esMongoID) {
            const categoria = await Categoria.findById(termino);
            return res.json({
                results: (categoria) ? [categoria] : []
            });
        }
        //EXPRESION REGULAR OMITA MAYUSCULAS Y MINUSCULAS
        const regex = new RegExp(termino, 'i');

        const categorias = await Categoria.find({ name: regex, state: true });
        res.json({
            results: categorias
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};


const buscarProductos = async(termino = '', res = response) => {
    try {
        const esMongoID = ObjectId.isValid(termino);
        if (esMongoID) {
            const producto = await Producto.findById(termino).populate('categoria', 'name');
            if (producto) {
                return res.json({
                    results: (producto) ? [producto] : []
                });
            }
            //buscamos por categoria
            const productosCat = await Producto.find({ categoria: termino }).populate('categoria', 'name');
            return res.json({
                results: productosCat
            });
        }
        //EXPRESION REGULAR OMITA MAYUSCULAS Y MINUSCULAS
        const regex = new RegExp(termino, 'i');
        const productos = await Producto.find({ name: regex, state: true }).populate('categoria', 'name');
        res.json({
            results: productos
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};



const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;
    try {

        if (!coleccionesPermitidas.includes(coleccion)) {
            return res.status(400).json({
                msg: `Las Colecciones Permitidas son :  ${coleccionesPermitidas}`
            });
        }
        switch (coleccion) {
            case 'categoria':
                buscarCategorias(termino, res);
                break;
            case 'producto':
                buscarProductos(termino, res);
                break;
            case 'usuario':
                buscarUsuarios(termino, res);
                break;

            default:
                res.status(500).json({
                    msg: 'Se me olvido hacer esta búsqueda'
                });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};


module.exports = {
    buscar
}