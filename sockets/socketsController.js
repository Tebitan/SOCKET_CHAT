const { comprobarJWT } = require("../helpers");
const { ChatInfo } = require("../models");
const chatInfo = new ChatInfo();

/**
 * socketsController
 * 
 * @param {*} socket el usario conectado
 * @param {*} io estan todos socket conectados
 * @returns 
 */
const socketsController = async(socket, io) => {
    try {
        const token = socket.handshake.headers['x-token'];
        const usuario = await comprobarJWT(token);
        if (!usuario) {
            return socket.disconnect();
        }
        //add usuario conectado 
        chatInfo.conectarUsuario(usuario);
        io.emit('usuarios-activos', chatInfo.usuariosArr);

        //le envio los ultimos mensaje al usuario conectado 
        socket.emit('recibir-mensajes', chatInfo.ultimos10);

        //Creo una sala para este usuario , para enviar mensajes privados
        socket.join(usuario.id);

        //limpiar si alguien se desconecta 
        socket.on('disconnect', () => {
            chatInfo.desconectarUsuario(usuario.id);
            //refresh lista de usuarios conectados
            io.emit('usuarios-activos', chatInfo.usuariosArr);
        });

        socket.on('enviar-mensaje', ({ mensaje, uid }) => {
            if (uid) {
                //Mensaje privado
                socket.to(uid).emit('mensaje-privado', { de: usuario.name, mensaje });

            } else {
                //add mensaje 
                chatInfo.enviarMensaje(usuario.id, usuario.name, mensaje);
                io.emit('recibir-mensajes', chatInfo.ultimos10);
            }
        })

    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    socketsController
};