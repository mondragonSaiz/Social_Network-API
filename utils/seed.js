// const connection = require('../config/connection');
// const { User, Thought } = require('../models');
// const { getRandomuserName, getRandomAssignments } = require('./data');

// connection.on('error', (err) => err);

// connection.once('open', async () => {
//   console.log('connected');
//   // Delete the collections if they exist
//   let userCheck = await connection.db
//     .listCollections({ name: 'users' })
//     .toArray();
//   if (userCheck.length) {
//     await connection.dropCollection('users');
//   }

//   let thoughtsCheck = await connection.db
//     .listCollections({ name: 'thoughts' })
//     .toArray();
//   if (thoughtsCheck.length) {
//     await connection.dropCollection('thoughts');
//   }

//   // Create empty array to hold the students
//   const users = [];

//   // Loop 20 times -- add students to the students array
//   for (let i = 0; i < 20; i++) {
//     // Get some random assignment objects using a helper function that we imported from ./data
//     const thoughts = getRandomAssignments(20);

//     const username = getRandomuserName();
//     const email = `${fullName}${Math.floor(
//       Math.random() * (99 - 18 + 1) + 18
//     )}@gmail.com`;

//     users.push({
//       username,
//       email,
//       thoughts,
//     });
//   }

//   // Add students to the collection and await the results
//   await User.collection.insertMany(users);

//   // Add courses to the collection and await the results
//   await Course.collection.insertOne({
//     courseName: 'UCLA',
//     inPerson: false,
//     students: [...students],
//   });

//   // Log out the seed data to indicate what should appear in the database
//   console.table(students);
//   console.info('Seeding complete! 🌱');
//   process.exit(0);
// });

const db = require('../config/connection');
const { User, Thought } = require('../models');

const userData = require('./userData.json');
const thoughtsData = require('./thoughtsData.json');
// const professorData = require('./professorData.json');

db.once('open', async () => {
  //clean database
  await User.deleteMany({});
  await Thought.deleteMany({});
  // await Professor.deleteMany({});

  //bulk create each model
  const users = await User.insertMany(userData);
  const thoughts = await Thought.insertMany(thoughtsData);
  // const professors = await Professor.insertMany(professorData);

  const user1 = users[0];
  const user2 = users[1];
  const user3 = users[2];
  user1.thoughts.push(thoughts[0]._id);
  user2.thoughts.push(thoughts[1]._id);
  user3.thoughts.push(thoughts[2]._id);
  await user1.save();
  await user2.save();
  await user3.save();
  // for (newThoughts of thoughts) {
  //   // randomly add each thought to a user
  //   const tempUser = users[Math.floor(Math.random() * users.length)];
  //   tempUser.thoughts.push(newThoughts._id);
  //   await tempUser.save();

  //   randomly add a professor to each class
  //   const tempProfessor =
  //     professors[Math.floor(Math.random() * professors.length)];
  //   newClass.professor = tempProfessor._id;
  //   await newClass.save();

  //    //reference class on professor model, too
  //   tempProfessor.classes.push(newClass._id);
  //   await tempProfessor.save();
  // }

  console.log('all done!');
  process.exit(0);
});
