/* eslint-disable max-len */

const listHelper = require('../utils/list_helper');
const {listWithOneBlog, blogs} = require('blogs');

test('dummy returns one', () => {
  const emptyList = [];

  const result = listHelper.dummy(emptyList);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });


  test('when list has several entries, equals the likes of their sum', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe('favourite blog', () => {
  test('when list has only one blog, equals to that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    const expectedBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    };
    expect(result).toEqual(expectedBlog);
  });


  test('when list has several entries, equals the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    const expectedBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };
    expect(result).toEqual(expectedBlog);
  });
});

describe('most blogs', () => {
  test('when list has only one blog, equals to its author', () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    };
    expect(result).toEqual(expectedResult);
  });


  test('when list has several entries, equals the one with most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    const expectedBlog = {
      author: 'Robert C. Martin',
      blogs: 3,
    };

    expect(result).toEqual(expectedBlog);
  });
});

describe('author with most likes', () => {
  test('when list has only one blog, equals to its author and its likes', () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    };
    expect(result).toEqual(expectedResult);
  });


  test('when list has several entries, equals the author with most likes', () => {
    const result = listHelper.mostLikes(blogs);
    const expectedBlog = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };

    expect(result).toEqual(expectedBlog);
  });
});
