/* eslint-disable no-unused-vars */
require('dotenv').config();
const { faker } = require('@faker-js/faker');
const axios = require('axios');
const client = require('../app/config/pg');
const addressData = require('./address-data.json');

const streetNumbers = [];
const streets = [];
const postalCodes = [];

// addressData.forEach(address => {
//   streets.push(address.name);
//   postalCodes.push(address.postcode);
// });

const newAddress = addressData.map((address) => ({
  street: address.name,
  postalCode: address.postcode,
  city: address.city[0],
}));

function randomAddress() {
  const rand = Math.floor(Math.random() * newAddress.length);

  const randAddress = {
    nb: 15,
    street: newAddress[rand].street,
    postalCode: newAddress[rand].postalCode,
    city: newAddress[rand].city,
  };

  return randAddress;
}

faker.locale = 'fr';

const userNb = 20;
const activityNb = 25;
const messageNb = 0;
const commentNb = 0;
const bookmarkNb = 0;
const participationNb = 0;
const activityTypeNb = 0;

const users = [];
const activities = [];
const messages = [];
const comments = [];
const baseTypes = [
  'Arts',
  'Activités créatives',
  'Apéro',
  'Bénévolat',
  'Cinéma',
  'Cuisine',
  'Danse',
  'Jardinage',
  'Jeux',
  'Bricolage',
];
const types = [];
const bookmarks = [];
const participations = [];
const activityTypes = [];

const city = 'Paris';

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
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      nickname: faker.name.middleName(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      description: faker.lorem.paragraph(number = 2, string = ' '),
      address: `${randomAddress().nb} ${randomAddress().street} ${randomAddress().postalCode}`,
      city: randomAddress().city,
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
    const activity = {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(number = 2, string = ' '),
      date: faker.date.future(0.5),
      address: `${randomAddress().nb} ${randomAddress().street} ${randomAddress().postalCode}`,
      city: randomAddress().city,
      lat: faker.address.latitude(),
      long: faker.address.longitude(),
      user_id: users.indexOf(users[Math.floor(Math.random() * users.length)]) + 1,
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

// // Generate messages and add them to the database table "message"
// function generateMessages(messageNb) {
//   for (let i = 0 ; i < messageNb ; i++ ) {
//     const message = {
//       text: faker.lorem.paragraph(number = 3, string = ' '),
//       sender: users.indexOf(users[Math.floor(Math.random() * users.length)])+1,
//       receiver: users.indexOf(users[Math.floor(Math.random() * users.length)])+1
//     };

//     messages.push(message);
//   }
//   return messages;
// }

// async function insertMessages(messages) {
//   await client.query('TRUNCATE TABLE "message" RESTART IDENTITY CASCADE');

//   const messageValues = messages.map((message) => {
//       // const newMessage = pgQuoteEscape(message);
//       return `(
//           '${message.text}',
//           '${message.sender}',
//           '${message.receiver}'
//       )`;
//   });
//   const queryStr = `
//            INSERT INTO "message"
//            (
//             "text",
//             "sender",
//             "receiver"
//            )
//            VALUES
//            ${messageValues}
//            RETURNING id
//    `;
//   const result = await client.query(queryStr);
//   return result.rows;
// }

// // Generate comments and add them to the database table "comment"
// function generateComments(commentNb) {
//   for (let i = 0 ; i < commentNb ; i++ ) {
//     const comment = {
//       text: faker.lorem.paragraph(number = 3, string = ' '),
//       user_id: users.indexOf(users[Math.floor(Math.random() * users.length)])+1,
//       activity_id: activities.indexOf(activities[Math.floor(Math.random() * activities.length)])+1
//     };

//     comments.push(comment);
//   }
//   return comments;
// }

// async function insertComments(messages) {
//   await client.query('TRUNCATE TABLE "comment" RESTART IDENTITY CASCADE');

//   const commentValues = comments.map((comment) => {
//       // const newComment = pgQuoteEscape(comment);
//       return `(
//           '${comment.text}',
//           '${comment.user_id}',
//           '${comment.activity_id}'
//       )`;
//   });
//   const queryStr = `
//            INSERT INTO "message"
//            (
//             "text",
//             "user_id",
//             "activity_id"
//            )
//            VALUES
//            ${commentValues}
//            RETURNING id
//    `;
//   const result = await client.query(queryStr);
//   return result.rows;
// }

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

// // TODO Affiner l'assignation des types aux activités (éviter de se retrouver avec une activité ayant des types contradictoires ou incohérents)
// // Generate types belongin to activity and add them to the database table "activity_has_type"
// function generateUserActivityTypes(activityTypeNb) {
//   for (let i = 0 ; i < activityTypeNb ; i++ ) {
//     const activityType = {
//       type_id: types.indexOf(types[Math.floor(Math.random() * types.length)])+1,
//       activity_id: activities.indexOf(activities[Math.floor(Math.random() * activities.length)])+1
//     };

//     activityTypes.push(activityType);
//   }
//   return activityTypes;
// }

(async () => {
  const generatedUsers = generateUsers(userNb);
  const generatedActivities = generateActivities(activityNb);
  const generatedTypes = generateTypes();

  // generateMessages(messageNb);
  // generateComments(commentNb);
  // generateUserBookmarks(bookmarkNb);
  // generateUserParticipations(participationNb);
  // generateUserActivityTypes(activityTypeNb);

  const usersData = await insertUsers(users);
  const activitiesData = await insertActivities(activities);
  const typesData = await insertTypes(types);

  client.end();
})();
