const mongoose = require('mongoose');

const args = process.argv;
const len = args.length;
const writePerson = len === 5;

if (len !== 3 && len !== 5) {
  console.log('Invalid number of parameters');
  process.exit(1);
}

const password = args[2];
const personName = args[3];
const personNumber = args[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.prbkb.mongodb.net/PhoneBook?retryWrites=true&w=majority`;

mongoose.connect(url)
    .then((result) => {
      console.log('connected to MongoDB');
    }).catch((error) => {
      console.log('error connecting to MongoDB:', error.message);
    });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (writePerson) {
  const newPerson = new Person({
    name: personName,
    number: personNumber,
  });

  newPerson.save().then((person) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((persons) => {
    console.log('phonebook:');
    persons.forEach((person) => console.log(`${person.name} ${person.number}`));
  }).then(() => mongoose.connection.close());
}
