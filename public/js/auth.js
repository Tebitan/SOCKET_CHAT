//referencia html 
const formulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost')) ? "http://localhost:8080/api/auth/" : "https://restserver-node-esteban.herokuapp.com/api/auth/";

formulario.addEventListener('submit', ev => {
    //evitar que haga un refresh de la pagina
    ev.preventDefault();
    const formData = {};
    //add los controles del formulario (email y password )
    for (let el of formulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value;
    }

    fetch(url + 'login', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        }).then(resp => resp.json()).then(({ msg, token }) => {
            if (msg) {
                return console.error(msg)
            }
            //guardamos el local storage
            localStorage.setItem('token', token);
            //redirecciono 
            window.location = "chat.html";
        })
        .catch(err => {
            console.log(err);
        })


});




function onSignIn(googleUser) {
    //var profile = googleUser.getBasicProfile();
    /* console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
     console.log('Name: ' + profile.getName());
     console.log('Image URL: ' + profile.getImageUrl());
     console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.*/
    var id_token = googleUser.getAuthResponse().id_token;
    var data = {
        id_token
    };

    fetch(url + 'google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(resp => resp.json())
        .then(({ token }) => {
            //guardamos el local storage
            localStorage.setItem('token', token);
            //redirecciono 
            window.location = "chat.html";
        })
        .catch(console.log);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
}