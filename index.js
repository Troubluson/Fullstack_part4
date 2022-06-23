const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

/*****************************************************************************************************************************************
 * MongoDB config
 */
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.prbkb.mongodb.net/PhoneBook?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = {
  name: String,
  number: String,
};

const Person = mongoose.model("Person", personSchema);

/****************************************************************************************************************************************/
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

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (req, res) => {
  let resString = `<p>Phonebook has info for ${persons.length} people</p>`;
  const currentDate = new Date();
  resString += currentDate.toDateString() + " " + currentDate.toTimeString();
  res.send(resString);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id == id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  // check missing params
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }
  // check unique
  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random(4000) * 4000),
  };
  persons = persons.concat(person);

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
