const { faker } = require('@faker-js/faker');

let users = [];
let activities = [];
let messages = [];
let comments = [];
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
  'Bricolage'
]
let types = [];
let bookmarks = [];
let participations = [];
let activityTypes = [];

// Generate users and add them to the database table "user"
function generateUsers(userNb) {
  for (let i = 0 ; i < userNb ; i++ ) {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      nickname: faker.lorem.word(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      description: faker.lorem.paragraph(number = 2, string = ' '),
      address: faker.address.streetAddress(false),
      city: faker.address.cityName(),
      phone: faker.phone.number('06 ## ## ## ##', string),
      avatar: faker.image.people(400, 400),
      is_admin: false,
    };
  
    users.push(user);
  }
  return users;
}

// Generate activities and add them to the database table "activity"
function generateActivities(activityNb) {
  for (let i = 0 ; i < activityNb ; i++ ) {
    const activity = {
      name: faker.name.jobTitle(),
      description: faker.lorem.paragraph(number = 2, string = ' '),
      date: faker.date.future(1),
      address: faker.address.streetAddress(false),
      city: faker.address.cityName(),
      lat: faker.address.latitude(),
      long: faker.address.longitude(),
      user_id: users.indexOf(users[Math.floor(Math.random() * users.length)])+1
    };
  
    activities.push(activity);
  }
  return activities;
}

// Generate messages and add them to the database table "message"
function generateMessages(messageNb) {
  for (let i = 0 ; i < messageNb ; i++ ) {
    const message = {
      text: faker.lorem.paragraph(number = 3, string = ' '),
      sender: users.indexOf(users[Math.floor(Math.random() * users.length)])+1,
      receiver: users.indexOf(users[Math.floor(Math.random() * users.length)])+1
    };
  
    messages.push(message);
  }
  return messages;
}

// Generate comments and add them to the database table "comment"
function generateComments(commentNb) {
  for (let i = 0 ; i < commentNb ; i++ ) {
    const comment = {
      text: faker.lorem.paragraph(number = 3, string = ' '),
      user_id: users.indexOf(users[Math.floor(Math.random() * users.length)])+1,
      activity_id: activities.indexOf(activities[Math.floor(Math.random() * activities.length)])+1
    };
  
    comments.push(comment);
  }
  return comments;
}

// Generate types and add them to the database table "type"
function generateTypes() {
  for (let i = 0 ; i < baseTypes.length ; i++ ) {
    const type = {
      label: baseTypes[i],
    };
  
    types.push(type);
  }
  return types;
}

// Generate bookmarks from users and add them to the database table "user_has_activity"
function generateUserBookmarks(bookmarkNb) {
  for (let i = 0 ; i < bookmarkNb ; i++ ) {
    const bookmark = {
      user_id: users.indexOf(users[Math.floor(Math.random() * users.length)])+1,
      activity_id: activities.indexOf(activities[Math.floor(Math.random() * activities.length)])+1
    };
  
    bookmarks.push(bookmark);
  }
  return bookmarks;
}

// Generate participations to activity and add them to the database table "user_to_activity"
function generateUserParticipations(participationNb) {
  for (let i = 0 ; i < participationNb ; i++ ) {
    const participation = {
      user_id: users.indexOf(users[Math.floor(Math.random() * users.length)])+1,
      activity_id: activities.indexOf(activities[Math.floor(Math.random() * activities.length)])+1
    };
  
    participations.push(participation);
  }
  return participations;
}

// TODO Affiner l'assignation des types aux activités (éviter de se retrouver avec une activité ayant des types contradictoires ou incohérents)
// Generate types belongin to activity and add them to the database table "activity_has_type"
function generateUserActivityTypes(activityTypeNb) {
  for (let i = 0 ; i < activityTypeNb ; i++ ) {
    const activityType = {
      type_id: types.indexOf(types[Math.floor(Math.random() * types.length)])+1,
      activity_id: activities.indexOf(activities[Math.floor(Math.random() * activities.length)])+1
    };
  
    activityTypes.push(activityType);
  }
  return activityTypes;
}

(() => {
  generateUsers(10);
  generateActivities(5);
  generateMessages(5);
  generateComments(5);
  generateTypes();
  generateUserBookmarks(5);
  generateUserParticipations(5);
  generateUserActivityTypes(5);

  console.log(activityTypes);
})();
