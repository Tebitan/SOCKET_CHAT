const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { response, request } = require("express");
const { subirArchivo, getModelByIDColeccion } = require("../helpers");
const { Usuario, Producto } = require("../models");



const cargarArchivo = async(req = request, res = response) => {
    try {
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'TEXTOS');
        //undefined para no enviar el argumento 
        console.log(req.files);
        const nombre = await subirArchivo(req.files, undefined, 'imagenes');
        res.json({
            nombre
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: error
        });
    }
};

const actualizarImagen = async(req = request, res = response) => {
    try {
        const { coleccion, id } = req.params;
        let modelo;
        switch (coleccion.toLowerCase()) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                break;
            case 'productos':
                modelo = await Producto.findById(id);
                break;
            default:
                return res.status(500).json({
                    msg: 'Se me olvido validar esto'
                });
        }

        if (!modelo) {
            return res.status(400).json({
                msg: `No existe ${coleccion} con este ID : ${id} `
            });
        }

        if (modelo.img) {
            //borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        modelo.img = await subirArchivo(req.files, undefined, coleccion);
        await modelo.save();
        res.json({
            modelo
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
};

const mostrarImagen = async(req = request, res = response) => {
    const { coleccion, id } = req.params;
    try {
        const modelo = await getModelByIDColeccion(id, coleccion);
        if (modelo.img) {
            //borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }

        const pathNoneImage = path.join(__dirname, '../assets/no-image.jpg');
        console.log(pathNoneImage);
        if (fs.existsSync(pathNoneImage)) {
            return res.sendFile(pathNoneImage);
        }

        res.json({
            msg: 'Falta place holder'
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message
        });
    }
};

const actualizarImagenCloudinary = async(req = request, res = response) => {
    try {
        const { coleccion, id } = req.params;
        const modelo = await getModelByIDColeccion(id, coleccion);
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        modelo.img = secure_url;
        await modelo.save();
        res.json({
            modelo
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message
        });
    }
};

const mostrarImagenCloudinary = async(req = request, res = response) => {
    const { coleccion, id } = req.params;
    try {
        const modelo = await getModelByIDColeccion(id, coleccion);
        if (modelo.img) {
            return res.json({
                image: modelo.img
            });
        }

        const pathNoneImage = path.join(__dirname, '../assets/no-image.jpg');
        console.log(pathNoneImage);
        if (fs.existsSync(pathNoneImage)) {
            return res.sendFile(pathNoneImage);
        }

        res.json({
            msg: 'Falta place holder'
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message
        });
    }
};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
}