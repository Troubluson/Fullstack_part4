const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/Blog');
const blogHelper = require('./blog_test_helper');
const User = require('../models/User');

const api = supertest(app);
let token = '';
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(blogHelper.listWithSeveralBlogs);
  await User.deleteMany({});
  const user = new User(blogHelper.testUser);
  await User.insertMany(blogHelper.testUser);
  const actualToken = await blogHelper.getTokenFor(user);
  token = `Bearer ${actualToken}`;
});

test('Correct amount of blogs returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(blogHelper.listWithSeveralBlogs.length);
});

test('Identifying field is called id', async () => {
  const blogJSON = new Blog(blogHelper.listWithOneBlog[0]).toJSON();
  expect(blogJSON.id).toBeDefined();
});

describe('creating a new blog', () => {
  test('Post successfully creates a new blog', async () => {
    const initialBlogs = await blogHelper.blogsInDb();
    const newBlog = {
      title: 'Nothing',
      author: 'No one',
      url: 'Not found',
      likes: 1,
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', token)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogsAfterPost = await blogHelper.blogsInDb();
    expect(blogsAfterPost).toHaveLength(initialBlogs.length + 1);
  });

  test('Blogs with missing likes field defaults to 0', async () => {
    const newBlog = {
      title: 'MissingLikesTest',
      author: 'No one',
      url: 'Not found',
    };
    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', token)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogs = await blogHelper.blogsInDb();
    const foundBlog = blogs.find((blog) => blog.title === newBlog.title);
    expect(foundBlog.likes).toBe(0);
  });

  test('Blog with missing title and url properties are not added', async () => {
    const newBlog = {
      author: 'No one',
    };
    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', token)
        .expect(400);
  });

  // eslint-disable-next-line max-len
  test('Trying to add a blog with a missing token fails with error code 401', async () => {
    const newBlog = {
      title: 'blog',
      author: 'author',
      url: 'Not found',
      likes: 5,
    };
    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', token)
        .expect(201);
  });
});

test('A blog can be deleted', async () => {
  const blogsAtStart = await blogHelper.blogsInDb();
  const blogToDelete = blogsAtStart[0];
  await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', token)
      .expect(204);
  const blogsAfterDelete = await blogHelper.blogsInDb();
  expect(blogsAfterDelete.length).toBe(blogsAtStart.length - 1);
  const blogTitles = blogsAfterDelete.map((blog) => blog.title);
  expect(blogTitles).not.toContain(blogToDelete.title);
}, 100000);

test('Deleting non-existing valid-id gives status code 404', async () => {
  const nonExistingId = await blogHelper.nonExistingId();
  await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', token)
      .expect(404);
});

test('a blog can be updated and gives status code 200', async () => {
  const blogsAtStart = await blogHelper.blogsInDb();
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
