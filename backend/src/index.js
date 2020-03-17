const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // requsições padrões. é preciso importar para dizer ao back-end q as requisições/respostas serão tanto http quanto web socket

const { setupWebsocket } = require('./websocket');
const routes = require('./routes');

const app = express();
const server = http.Server(app); // cria servidor http fora do express, para trabalhar com ele diretamente

setupWebsocket(server);

mongoose.connect('mongodb+srv://vitoria:vitoria@omnistack-ebcf9.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors());
app.use(express.json());
app.use(routes);

// app.listen(1234); 
server.listen(1234); // alteração tbm deve ser feita aqui