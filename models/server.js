const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketsController } = require('../sockets/socketsController');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        //rutas
        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        };


        //Conectar a BD
        this.conectarDB();

        //Middleware
        this.middlewares();

        //Rutas de la Aplicacion 
        this.routes();

        //sockets 
        this.sockets();

    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());
        //lectura y parseo del Body para configurar en formato JSON
        this.app.use(express.json());
        //directorio publico
        this.app.use(express.static('public'));
        //Fileupload - Carga de Archivos 
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true // para crear la carpeta si no existe
        }));
    };

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

    };

    sockets() {

        this.io.on("connection", (socket) => socketsController(socket, this.io));
    };

    listen() {
        this.server.listen(this.port, () => {
            console.log("Escuchando en el puerto", this.port);
        });
    };
}

module.exports = Server;