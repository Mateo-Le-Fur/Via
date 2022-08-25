const dayjs = require('dayjs');
require('dayjs/locale/fr');

module.exports = {
  convertActivityDate(activity) {
    const date = dayjs(activity.date).locale('fr').format('DD/MM/YYYY');
    return date;
  },
};
