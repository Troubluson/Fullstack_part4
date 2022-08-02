// eslint-disable-next-line new-cap
const blogRouter = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

blogRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
  response.json(blogs);
});

blogRouter.post('/', async (request, response, next) => {
  const body = request.body;
  if (!body.title && !body.url) {
    response.status(400).end();
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid'});
  }

  const creator = await User.findById(decodedToken.id);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: creator._id,
  });
  const savedBlog = await blog.save();
  creator.blogs = creator.blogs.concat([savedBlog._id]);
  await creator.save();

  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response, next) => {
  const blogId = request.params.id;
  const decodedToken = jwt.verify(request.token, system.env.SECRET);
  const userId = decodedToken.id;
  if (userId) {
    return response.status(401).json({error: 'token missing or invalid'});
  }
  const blogToDelete = await Blog.findById(blogId);
  if (userId.toString() !== blogToDelete.user.toString()) {
    return response
        .status(403)
        .json({error: 'User is not the creator of requested blog'});
  }
  await blogToDelete.delete();
  response.status(204);
});

blogRouter.put('/:id', async (request, response, next) => {
  const blog = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog).status(200).end();
});

module.exports = blogRouter;
