const axios = require('axios').default;

async function getCoordinates(query, type = 'municipality') {
  const result = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${query}&type=${type}&limit=1`);
  const geometry = result.data;
  const { coordinates } = geometry.features[0].geometry;

  return coordinates;
}

module.exports = getCoordinates;
