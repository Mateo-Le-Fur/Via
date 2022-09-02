const dayjs = require('dayjs');
require('dayjs/locale/fr');

module.exports = {
  convertActivityDate(date) {
    const result = dayjs(date).locale('fr').format('DD/MM/YYYY');
    return result;
  },
};
