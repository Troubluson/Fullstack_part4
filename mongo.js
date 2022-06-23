const mongoose = require("mongoose");

if (process.argv.length < 5) {
  console.log("give password, name, and number as arguments");
  process.exit(1);
}

const password = process.argv[2];
const personName = process.argv[3];
const personNumber = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.prbkb.mongodb.net/PhoneBook?retryWrites=true&w=majority`;

const personSchema = {
  name: String,
  number: String,
};

const Person = mongoose.model("Person", personSchema);


mongoose.connect(url).then((result) => {
  console.log("connected to mongodb")

  const newPerson = new Person({
    name: personName,
    number: personNumber
  })
  return newPerson.save()
  
  }).then((person) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    return mongoose.connection.close();
  }).catch((error) => console.log(error))
