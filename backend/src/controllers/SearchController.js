const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, res) {
        // buscar todos os devs num raio de 10km
        // filtrar por tecnologia

        const { latitude, longitude, techs } = req.query;

        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: techsArray, // apenas devs q possuem essas tecnologias (operador lógico do mongo)
            },
            location: {
                $near: { // encontrar objetos pertos de uma localização
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000, // em metros
                }
            },
        })

        return res.json({ devs });
    }
}