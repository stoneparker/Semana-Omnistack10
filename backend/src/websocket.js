const socketio = require('socket.io'); // yarn add socket.io
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistace');

const connections = [];

let io;
exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        console.log(socket.id);
        const { latitude, longitude, techs } = socket.handshake.query;  
        
        
        connections.push({ // toda vez q uma conexão é iniciada, seu registro é adicionado ao array
            id: socket.id,
            coodinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: parseStringAsArray(techs)
        });

        // setTimeout(() => { 
        //     socket.emit('message', 'oiiii') // backend enviando mensagem ao frontend sem qualquer requisição
        // }, 3000)
    }); // toda vez que um usuário se conectar à aplicação via protocolo websocket, recebe objeto
}


// Filtro de distância e tecnologias
exports.findConnections = (coodinates, techs) => {
    return connections.filter(connection => { // *percorrendo todas as conexões do websocket*
        return calculateDistance(coodinates, connection.coordinates) < 10 // comparando as coordenadas do novo dev cadastrado com as coordenadas de cada um das demais conexões (nessa ordem)
            && connection.techs.some(item => techs.includes(item)) // retorna true caso pelo menos uma das conexões já cadastradas incluam a tecnologia do novo dev
    }) 
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).enit(message, data);
    });
}