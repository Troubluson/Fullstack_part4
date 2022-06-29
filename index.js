require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require('./models/person');
const { Mongoose } = require('mongoose');

const app = express();

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);
});

// tiny + our defined "content"
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

app.get("/info", (request, response, next) => {
  Person.count().then(count => {
    let resString = `<p>Phonebook has info for ${count} people</p>`;
    const currentDate = new Date();
    resString += currentDate.toDateString() + " " + currentDate.toTimeString();
    response.send(resString);
  })
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => response.json(people))
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id).then(person => {

    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  })
    .catch(error => next(error))
});

app.post("/api/persons/", (request, response, next) => {
  const body = request.body;
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }
  const id = request.params.id
  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => { response.json(updatedPerson) })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response) => {
  person.findByIdAndDelete(request.params.id).then((result) => {
    response.status(204).end();
  })
    .catch((error) => next(error))
});


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorhandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
app.use(errorhandler)

//##############################################################
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
