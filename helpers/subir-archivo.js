const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg'], carpeta = '') => {
    try {
        return new Promise((resolve, reject) => {
            const { archivo } = files;
            const nombreCortado = archivo.name.split('.');
            const extension = nombreCortado[nombreCortado.length - 1];

            if (!extensionesValidas.includes(extension.toLowerCase())) {
                return reject(`No puedes subir archivos con extension .${extension} - ${extensionesValidas} `);
            }

            const nombreTemp = uuidv4() + '.' + extension;
            const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

            archivo.mv(uploadPath, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(nombreTemp);
            });

        });
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    subirArchivo
}