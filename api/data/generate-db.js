const { faker } = require('@faker-js/faker');

function generateUsers(userNb) {
  const users = [];

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

function generateActivities(activityNb) {
  const activities = [];

  for (let i = 0 ; i < activityNb ; i++ ) {
    const activity = {
      name: faker.name.jobTitle(),
      description: faker.lorem.paragraph(number = 2, string = ' '),
      date: faker.date.future(1),
      address: faker.address.streetAddress(false),
      city: faker.address.cityName(),
      lat: faker.address.latitude(),
      long: faker.address.longitude(),
      user_id: faker.datatype.number({min: 1})
    };
  
    activities.push(activity);
  }
  return activities;
}

(() => {
  console.log(generateUsers(1));
  console.log(generateActivities(1));
})();
