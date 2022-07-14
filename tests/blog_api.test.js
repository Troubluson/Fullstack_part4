const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

test('correct amount of blogs returned', async () => {
  await api
      .get('api/blogs')
      //.expect(200)
      //.expect('Content-Type', /application\/json/)
      .expect(response.body).toHaveLength(0);
});


afterAll(() => {
  mongoose.connection.close();
});
