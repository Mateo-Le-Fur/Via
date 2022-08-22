const axios = require('axios').default;
const ApiError = require('../errors/apiError');

async function getCoordinates(query, type = 'municipality') {
  const result = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${query}&type=${type}&limit=1`);
  const geometry = result.data;

  if (result.statusText !== 'OK') {
    throw new ApiError('Api Error', 500);
  }

  if (geometry.features.length === 0) {
    throw new ApiError('La ville n\'a pas était trouvé', 400);
  }
  let { coordinates } = geometry.features[0].geometry;

  coordinates = [coordinates[1], coordinates[0]];

  return coordinates;
}

module.exports = getCoordinates;
