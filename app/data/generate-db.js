// require('dotenv').config();
const { faker } = require('@faker-js/faker');
const client = require('../backend/config/sequelize');
const addressData = require('./address-data.json');

// Sets the addresses in french format
faker.locale = 'fr';

// Initializes entities variables
// Sets the number of rows per entity
const userNb = 50;
const activityNb = 10;
const messageNb = 100;
const commentNb = 50;
const bookmarkNb = 0;
const participationNb = 0;
const activityTypeNb = 0;

// Initializes entities arrays
const users = [];
const activities = [];
const messages = [];
const comments = [];
const baseTypes = [
  'Arts',
  'Danse',
  'Bricolage',
  'Bénévolat',
  'Cuisine',
  'Jardinage',
];
const types = [];
const bookmarks = [];
const participations = [];
const activityTypes = [];

// Creates a model for an address
const newAddress = addressData.map((address) => {
  // Get the streetNumbers, latitudes and logitudes from a single address
  const streetNumbers = [];
  const latitudes = [];
  const longitudes = [];
  const addressKeys = Object.keys(address);

  addressKeys.forEach((item) => {
    const numberRegex = /housenumbers.[0-9]{1,}\.id/;

    if (item.match(numberRegex)) {
      streetNumbers.push(item);
    }
  });

  for (const [key, value] of Object.entries(address)) {
    const latRegex = /housenumbers.[0-9]{1,}\.lat/;

    if (key.match(latRegex)) {
      latitudes.push({ key, value });
    }
  }

  for (const [key, value] of Object.entries(address)) {
    const lonRegex = /housenumbers.[0-9]{1,}\.lon/;

    if (key.match(lonRegex)) {
      longitudes.push({ key, value });
    }
  }

  return {
    streetNumbers,
    street: address.name,
    postalCode: address.postcode,
    city: address.city[0],
    latitudes,
    longitudes,
  };
});

// Create a random address
function randomAddress() {
  const rand = Math.floor(Math.random() * newAddress.length + 1);
  const randStreetNumber = Math.floor(
    Math.random() * newAddress[rand].streetNumbers.length + 1,
  );
  let number = 1;
  let { lat } = newAddress[rand];
  let { lon } = newAddress[rand];

  if (newAddress[rand].streetNumbers[randStreetNumber]) {
    const numberRegex = /[0-9]{1,}/;

    number = newAddress[rand].streetNumbers[randStreetNumber].match(numberRegex);
  }

  newAddress[rand].latitudes.forEach((latitude) => {
    if (latitude.key === `housenumbers.${number}.lat`) {
      lat = latitude.value;
    }
  });

  newAddress[rand].longitudes.forEach((longitude) => {
    if (longitude.key === `housenumbers.${number}.lon`) {
      lon = longitude.value;
    }
  });

  const randAddress = {
    number,
    street: newAddress[rand].street,
    postalCode: newAddress[rand].postalCode,
    city: newAddress[rand].city,
    lat,
    lon,
  };

  return randAddress;
}

function pgQuoteEscape(row) {
  const newRow = {};
  Object.entries(row).forEach(([prop, value]) => {
    if (typeof value !== 'string') {
      newRow[prop] = value;
      return;
    }
    newRow[prop] = value.replaceAll("'", "''");
  });
  return newRow;
}

// Generate users and add them to the database table "user"
function generateUsers(userNb) {
  for (let i = 0; i < userNb; i++) {
    const address = randomAddress();

    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      nickname: faker.name.middleName(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      description: faker.lorem.paragraph((number = 2), (string = ' ')),
      address: `${address.number} ${address.street} ${address.postalCode}`,
      city: address.city,
      phone: faker.phone.number('06 ## ## ## ##', string),
      avatar: faker.image.people(400, 400),
      is_admin: false,
    };

    users.push(user);
  }
  return users;
}

async function insertUsers(users) {
  await client.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');

  const userValues = users.map((user) => {
    const newUser = pgQuoteEscape(user);
    return `(
          '${newUser.email}',
          '${newUser.password}',
          '${newUser.nickname}',
          '${newUser.firstname}',
          '${newUser.lastname}',
          '${newUser.description}',
          '${newUser.address}',
          '${newUser.city}',
          '${newUser.phone}',
          '${newUser.avatar}',
          '${newUser.is_admin}'
      )`;
  });

  const queryStr = `
           INSERT INTO "user"
           (
            "email",
            "password",
            "nickname",
            "firstname",
            "lastname",
            "description",
            "address",
            "city",
            "phone",
            "avatar",
            "is_admin"
           )
           VALUES
           ${userValues}
           RETURNING id
   `;
  const result = await client.query(queryStr);
  return result.rows;
}

// Generate activities and add them to the database table "activity"
function generateActivities(activityNb) {
  for (let i = 0; i < activityNb; i++) {
    const address = randomAddress();

    const activity = {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph((number = 2), (string = ' ')),
      date: faker.date.future(0.5),
      address: `${address.number} ${address.street} ${address.postalCode}`,
      city: address.city,
      lat: address.lat,
      long: address.lon,
      user_id:
        users.indexOf(users[Math.floor(Math.random() * users.length)]) + 1,
    };

    activities.push(activity);
  }
  return activities;
}

async function insertActivities(activities) {
  await client.query('TRUNCATE TABLE "activity" RESTART IDENTITY CASCADE');

  const activityValues = activities.map((activity) => {
    const newActivity = pgQuoteEscape(activity);
    return `(
          '${newActivity.name}',
          '${newActivity.description}',
          '${newActivity.date}',
          '${newActivity.address}',
          '${newActivity.city}',
          '${newActivity.lat}',
          '${newActivity.long}',
          '${newActivity.user_id}'
      )`;
  });
  const queryStr = `
           INSERT INTO "activity"
           (
            "name",
            "description",
            "date",
            "address",
            "city",
            "lat",
            "long",
            "user_id"
           )
           VALUES
           ${activityValues}
           RETURNING id
   `;
  const result = await client.query(queryStr);
  return result.rows;
}

// Generate types and add them to the database table "type"
function generateTypes() {
  for (let i = 0; i < baseTypes.length; i++) {
    const type = {
      label: baseTypes[i],
    };

    types.push(type);
  }
  return types;
}

async function insertTypes(types) {
  await client.query('TRUNCATE TABLE "type" RESTART IDENTITY CASCADE');

  const typeValues = types.map((type) => {
    const newType = pgQuoteEscape(type);
    return `(
          '${newType.label}'
      )`;
  });
  const queryStr = `
           INSERT INTO "type"
           (
            "label"
           )
           VALUES
           ${typeValues}
           RETURNING id
   `;
  const result = await client.query(queryStr);
  return result.rows;
}

// Generate comments and add them to the database table "comment"
function generateComments(commentNb) {
  for (let i = 0; i < commentNb; i++) {
    const comment = {
      text: faker.lorem.words((num = 25)),
      user_id:
        users.indexOf(users[Math.floor(Math.random() * users.length)]) + 1,
      activity_id:
        activities.indexOf(
          activities[Math.floor(Math.random() * activities.length)],
        ) + 1,
    };

    comments.push(comment);
  }
  return comments;
}

async function insertComments(comments) {
  await client.query('TRUNCATE TABLE "comment" RESTART IDENTITY CASCADE');

  const commentValues = comments.map((comment) => {
    const newComment = pgQuoteEscape(comment);
    return `(
          '${newComment.text}',
          '${newComment.user_id}',
          '${newComment.activity_id}'
      )`;
  });
  const queryStr = `
           INSERT INTO "comment"
           (
            "text",
            "user_id",
            "activity_id"
           )
           VALUES
           ${commentValues}
           RETURNING id
   `;

  const result = await client.query(queryStr);
  return result.rows;
}

// Generate messages and add them to the database table "message"
function generateMessages(messageNb) {
  for (let i = 0; i < messageNb; i++) {
    const message = {
      message: faker.lorem.words((num = 25), (string = ' ')),
      exp_user_id:
        users.indexOf(users[Math.floor(Math.random() * users.length)]) + 1,
      dest_user_id:
        users.indexOf(users[Math.floor(Math.random() * users.length)]) + 1,
    };

    messages.push(message);
  }
  return messages;
}

async function insertMessages(messages) {
  await client.query('TRUNCATE TABLE "message" RESTART IDENTITY CASCADE');

  const messageValues = messages.map((message) => {
    const newMessage = pgQuoteEscape(message);
    return `(
          '${newMessage.message}',
          '${newMessage.exp_user_id}',
          '${newMessage.dest_user_id}'
      )`;
  });
  const queryStr = `
           INSERT INTO "message"
           (
            "message",
            "exp_user_id",
            "dest_user_id"
           )
           VALUES
           ${messageValues}
           RETURNING id
   `;
  const result = await client.query(queryStr);
  return result.rows;
}

// // Generate bookmarks from users and add them to the database table "user_has_activity"
// function generateUserBookmarks(bookmarkNb) {
//   for (let i = 0 ; i < bookmarkNb ; i++ ) {
//     const bookmark = {
//       user_id: users.indexOf(users[Math.floor(Math.random() * users.length)])+1,
//       activity_id: activities.indexOf(activities[Math.floor(Math.random() * activities.length)])+1
//     };

//     bookmarks.push(bookmark);
//   }
//   return bookmarks;
// }

// // Generate participations to activity and add them to the database table "user_to_activity"
// function generateUserParticipations(participationNb) {
//   for (let i = 0 ; i < participationNb ; i++ ) {
//     const participation = {
//       user_id: users.indexOf(users[Math.floor(Math.random() * users.length)])+1,
//       activity_id: activities.indexOf(activities[Math.floor(Math.random() * activities.length)])+1
//     };

//     participations.push(participation);
//   }
//   return participations;
// }

// Generate types belongin to activity and add them to the database table "activity_has_type"
function generateUserActivityTypes(activityNb) {
  let activityArr = [];

  for (const activity of activities) {
    activityArr.push(activities.indexOf(activity) + 1);
  }

  for (let i = 0; i < activityNb; i++) {
    const activityRand = activityArr[Math.floor(Math.random() * activityArr.length)];

    const activityType = {
      type_id:
        types.indexOf(types[Math.floor(Math.random() * types.length)]) + 1,
      activity_id: activityRand,
    };

    activityArr = activityArr.filter((value) => value !== activityRand);

    activityTypes.push(activityType);
  }

  return activityTypes;
}

async function insertActivityTypes(activityTypes) {
  await client.query(
    'TRUNCATE TABLE "activity_has_type" RESTART IDENTITY CASCADE',
  );

  const typeValues = activityTypes.map((type) => {
    const newType = pgQuoteEscape(type);
    return `(
          '${newType.type_id}',
          '${newType.activity_id}'
      )`;
  });
  const queryStr = `
           INSERT INTO "activity_has_type"
           (
            "type_id",
            "activity_id"
           )
           VALUES
           ${typeValues}
           RETURNING id
   `;
  const result = await client.query(queryStr);
  return result.rows;
}

(async () => {
  const generatedUsers = generateUsers(userNb);
  const generatedActivities = generateActivities(activityNb);
  const generatedTypes = generateTypes();
  const generatedActivityTypes = generateUserActivityTypes(
    generatedActivities.length,
  );
  const generatedComments = generateComments(commentNb);
  const generatedMessages = generateMessages(messageNb);

  // console.log(generatedMessages);

  // generateUserBookmarks(bookmarkNb);
  // generateUserParticipations(participationNb);

  const usersData = await insertUsers(users);
  const activitiesData = await insertActivities(activities);
  const typesData = await insertTypes(types);
  const activityTypesData = await insertActivityTypes(generatedActivityTypes);
  const commentsData = await insertComments(generatedComments);
  const messagesData = await insertMessages(generatedMessages);
})();
