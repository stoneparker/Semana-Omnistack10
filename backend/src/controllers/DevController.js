const axios = require('axios');
const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
    
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
        
            const { name = login, avatar_url, bio } = response.data; // se name não existir, busca o valor do login ???
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            // Filtrar as conexões que estão há no máximo 10km de distância e que possua pelo menos uma das tecnologias listadas cascade cascade cascade cascade cascade cascade cacsade cascade cascade

            const sendSocketMessageTrue = findConnections(
                { latitude, longitude },
                techsArray
            )

            sendMessage(sendSocketMessageTrue, 'new-dev', dev);
        }
        return res.json(dev);
    }
}