import socketio from 'socket.io-client'; // yarn add socket.io-client (versão para o cliente -> servidor)

const socket = socketio('http://192.168.15.10:1234', {
    autoConnect: false,
});

function subscribeToNewDevs(subscribeFunction) {  // ouvir o evento new-dev e disparar subscribeFunction (será chama em Main)
    socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitude, techs) {

    socket.io.opts.query = { // envio de informação ao backend
        latitude,
        longitude,
        techs
    }
    socket.connect();

    socket.on('message', text => { // recebendo mensagem enviada pelo backend
        console.log(text);
    })
}

function disconnect() {
    if (socket.connected) {
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewDevs
}
