const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/Blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.listWithSeveralBlogs);
});

test('Correct amount of blogs returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.listWithSeveralBlogs.length);
});

test('Identifying field is called id', async () => {
  const blogJSON = new Blog(helper.listWithOneBlog[0]).toJSON();
  expect(blogJSON.id).toBeDefined();
});

test('Post successfully creates a new blog', async () => {
  const initialBlogs = await helper.blogsInDb();
  const newBlog = {
    title: 'Nothing',
    author: 'No one',
    url: 'Not found',
    likes: 1,
  };
  await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

  const blogsAfterPost = await helper.blogsInDb();
  expect(blogsAfterPost).toHaveLength(initialBlogs.length + 1);
});

test('Blgs with missing likes field defaults to 0', async () => {
  const newBlog = {
    title: 'MissingLikesTest',
    author: 'No one',
    url: 'Not found',
  };
  await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

  const blogs = await helper.blogsInDb();
  const foundBlog = blogs.find((blog) => blog.title === newBlog.title);
  expect(foundBlog.likes).toBe(0);
});

test('Posts with missing title and url properties are not added', async () => {
  const newBlog = {
    author: 'No one',
  };
  await api.post('/api/blogs').send(newBlog).expect(400);
});

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
  const blogsAfterDelete = await helper.blogsInDb();
  expect(blogsAfterDelete.length).toBe(blogsAtStart.length - 1);
  const blogTitles = blogsAfterDelete.map((blog) => blog.title);
  expect(blogTitles).not.toContain(blogToDelete.title);
});

test('Deleting non-existing valid-id gives status code 404', async () => {
  const nonExistingId = await helper.nonExistingId();
  await api.delete(`/api/blogs/${nonExistingId}`).expect(404);
});

test('a blog can be updated and gives status code 200', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];
  const likes = blogToUpdate.likes;
  blogToUpdate.likes = likes + 1;

  const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200);

  expect(response.body.likes).toBe(blogToUpdate.likes);
});

afterAll(() => {
  mongoose.connection.close();
});
