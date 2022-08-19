// eslint-disable-next-line new-cap
const blogRouter = require('express').Router();
const Blog = require('../models/Blog');
const {userExtractor} = require('../utils/middleware');

blogRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
  response.json(blogs);
});

blogRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body;
  if (!body.title && !body.url) {
    response.status(400).end();
  }
  const creator = request.user;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: creator._id,
  });
  let savedBlog = await blog.save();
  creator.blogs = creator.blogs.concat([savedBlog._id]);
  await creator.save();
  savedBlog = await populateUser(savedBlog);

  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const blogId = request.params.id;
  const user = request.user;
  const blogToDelete = await Blog.findById(blogId);
  if (!blogToDelete) {
    return response
        .status(404)
        .json({error: 'Could not find blog corresponding to requested id'});
  }
  if (user.toJSON().id !== blogToDelete.user.toString()) {
    return response
        .status(403)
        .json({error: 'User is not the creator of requested blog'});
  }
  await blogToDelete.delete();
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response, next) => {
  const blog = request.body;
  let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  updatedBlog = await populateUser(updatedBlog);
  response.json(updatedBlog).status(200).end();
});

const populateUser = async (blog) => {
  return await blog.populate('user', {username: 1, name: 1});
};

module.exports = blogRouter;
