const url = (window.location.hostname.includes('localhost')) ? "http://localhost:8080/api/auth/" : "https://restserver-node-esteban.herokuapp.com/api/auth/";

let usuario = null;
let socket = null;
//Referencias HTML 
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

//VALIDAR EL TOKEN DEL LOCALSTORAGE
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';
    if (token.length <= 10) {
        //redireciono 
        window.location = 'index.html';
        throw new Error('No existe token en la Aplicacion');
    }

    const res = await fetch(url, {
        headers: { 'x-token': token }
    });

    const { usuario: usuarioDB, token: tokenDB, msg } = await res.json();
    //renovamos JWT en LOCALSTORAGE
    localStorage.setItem('token', tokenDB);
    usuario = usuarioDB;
    //cambiamos el titulo 
    document.title = usuario.name;
    await conectarSocket();

};

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online')
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', dibujarMensajePrivado);
}

/**
 * Arma el HTML con los usuarios conectados
 * @param {Usuario} usuarios Payload array de Usuarios conectados
 */
const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({ name, uid }) => {
        if (uid != usuario.uid) {
            usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${name} </h5>
                    <span class="fs-6 text-muted"> ${uid } </span>
                </p>
            </li>
            `;
        }

    });

    ulUsuarios.innerHTML = usersHtml;
}

/**
 * Arma el HTML con los mensajes
 * @param {Mensaje} mensajes Payload array de Mensajes 
 */
const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${nombre}: </span>
                    <span> ${mensaje } </span>
                </p>
            </li>
            `;
    });

    ulMensajes.innerHTML = mensajesHtml;
}

const dibujarMensajePrivado = ({ de, mensaje }) => {
    let mensajesHtml = `
    <li>
        <p>
            <span class="text-danger"> Privado  ${de}: </span>
            <span> ${mensaje } </span>
        </p>
    </li>
    `;


    ulMensajes.innerHTML = ulMensajes.innerHTML + mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value.trim();
    const uid = txtUid.value.trim();
    if (keyCode !== 13 || mensaje.length === 0) { return; }

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';
});

const main = async() => {
    //validar JWT 
    await validarJWT()
};

main();

//const socket = io();