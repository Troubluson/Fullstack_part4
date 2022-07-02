const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./utils/config');
const blogRouter = require('./controllers/Blogs');
const mongoose = require('mongoose');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRouter);

module.exports = app;

