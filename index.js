import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;
let posts = [];
let id = -1;

// Middleware for parsing URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Get all posts
app.get("/api", (req, res) => {
  const randomPost = posts[Math.floor(Math.random() * posts.length)];
  const lastPosts = [...posts].slice(-2).sort((a, b) => b.id - a.id);

  res.json({ randomPost: randomPost, lastPosts: lastPosts });
});

// Create a new post
app.post("/api/create", (req, res) => {
  const post = {
    id: ++id,
    topic: req.body.topic,
    author: req.body.author,
    title: req.body.title,
    date: `Created on ${new Date().toDateString()}`,
    content: req.body.content,
  };

  posts.push(post);
  res.json(post);
});

// Get all posts
app.get("/api/posts", (req, res) => {
  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

  res.json(sortedPosts);
});

// Get a specific post by it's id
app.get("/api/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  } else {
    res.json(posts[postIndex]);
  }
});

// Update a specific post by it's id
app.patch("/api/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  const post = posts[postIndex];
  const updatedPost = {
    id: id,
    topic: req.body.topic || post.topic,
    author: req.body.author || post.author,
    title: req.body.title || post.title,
    date: `Edited on ${new Date().toDateString()}`,
    content: req.body.content || post.content,
  };

  posts[postIndex] = updatedPost;
  res.json(updatedPost);
});

// Delete a specific post by it's id
app.delete("/api/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  posts.splice(postIndex, 1);
  res.json({ message: "Post deleted successfully" });
});

// Search for posts by it's topic
app.post("/api/search", (req, res) => {
  const search = req.body.topic;
  const lowerCaseSearch = search.toLowerCase();

  const sortedPosts = [...posts]
    .filter((post) => post.topic.toLowerCase() === lowerCaseSearch)
    .sort((a, b) => b.id - a.id);

  res.json(sortedPosts);
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`API is running on port http://localhost:${port}`);
});
