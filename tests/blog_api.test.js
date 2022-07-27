const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/Blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  for (const blog of helper.listWithSeveralBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test('Correct amount of blogs returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.listWithSeveralBlogs.length);
});

test('Identifying field is called id', async () => {
  const blogJSON = new Blog(helper.listWithOneBlog[0]).toJSON();
  expect(blogJSON.id).toBeDefined();
});
test('Post successfully creates a new blog post', async () => {
  const initialBlogs = await helper.blogsInDb();
  const newBlog = {
    title: 'Nothing',
    author: 'No one',
    url: 'Not found',
    likes: 1,
  };
  await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

  const blogsAfterPost = await helper.blogsInDb();
  expect(blogsAfterPost).toHaveLength(initialBlogs.length + 1);
});

test('Posts with missing likes field defaults to 0', async () => {
  const newBlog = {
    title: 'MissingLikesTest',
    author: 'No one',
    url: 'Not found',
  };
  await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/); ;

  const blogs = await helper.blogsInDb();
  const foundBlog = blogs.find((blog) => blog.title === newBlog.title);
  expect(foundBlog.likes).toBe(0);
});

test('Posts with missing title and url properties are not added', async () => {
  const newBlog = {
    author: 'No one',
  };
  await api.post('/api/blogs')
      .send(newBlog)
      .expect(400);
});


afterAll(() => {
  mongoose.connection.close();
});
