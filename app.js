const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const config = require('./utils/config');
const blogRouter = require('./controllers/Blogs');
const userRouter = require('./controllers/Users');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use(middleware.errorHandler);

module.exports = app;
