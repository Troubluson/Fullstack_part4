const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('connecting to', url);

mongoose.connect(url)
    .then((result) => {
      console.log('connected to MongoDB');
    }).catch((error) => {
      console.log('error connecting to MongoDB:', error.message);
    });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'name required'],
  },
  number: {
    type: String,
    minlength: 8,
    required: [true, 'phone-number required'],
    validate: {
      validator: (num) => /^\d{2,3}-\d{5,}$/.test(num),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
