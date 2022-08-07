const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((prev, curr) => curr.likes + prev, 0);
};

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const maxLikes = Math.max(...likes);
  const favBlog = blogs.find((blog) => blog.likes === maxLikes);

  return {title: favBlog.title, author: favBlog.author, likes: favBlog.likes};
};

const mostBlogs = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, (blog) => blog.author);
  // eslint-disable-next-line max-len
  const authorWithMostBlogs = _.maxBy(
      Object.keys(blogsByAuthor),
      (author) => blogsByAuthor[author].length,
  );
  const blogAmount = blogsByAuthor[authorWithMostBlogs].length;
  // console.log(mostBlogs);
  return {author: authorWithMostBlogs, blogs: blogAmount};
};

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, (blog) => blog.author);
  const authorWithMostBlogs = _.maxBy(Object.keys(blogsByAuthor), (author) => {
    return totalLikes(blogsByAuthor[author]);
  });
  const likeAmount = totalLikes(blogsByAuthor[authorWithMostBlogs]);
  return {author: authorWithMostBlogs, likes: likeAmount};
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
