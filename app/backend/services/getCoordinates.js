const axios = require('axios').default;

async function getCoordinates(query, type = 'municipality') {
  const result = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${query}&type=${type}&limit=1`);
  const geometry = result.data;

  // TODO remplacer par error handler
  if (geometry.features.length === 0) {
    return false;
  }
  let { coordinates } = geometry.features[0].geometry;

  coordinates = [coordinates[1], coordinates[0]];

  return coordinates;
}

module.exports = getCoordinates;
