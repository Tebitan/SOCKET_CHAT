const { Schema, model } = require('mongoose');


const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
    img: { type: String }
});


/**
 * Sobrescribimos la funcion toJSON 
 * Para eliminar atributos que no queremos mostrar 
 * por EJ: password
 */

ProductoSchema.methods.toJSON = function() {
    const { __v, state, ...producto } = this.toObject();
    return producto;
};


module.exports = model('Producto', ProductoSchema);