import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

// Serve static files on the specified port
app.use(express.static("public"));

// Middleware for parsing URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// GET route for the Home page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api`);
    const { randomPost, lastPosts } = response.data;

    res.render("index.ejs", {
      randomPost: randomPost,
      lastPosts: lastPosts,
    });
  } catch (error) {
    res.status(500).send("Error fetching posts");
  }
});

// GET route for the Create Post page
app.get("/create", (req, res) => {
  res.render("create.ejs");
});

// GET route for fetching all posts
app.get("/posts", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/posts`);

    res.render("post.ejs", {
      sortedPosts: response.data,
      heading: "All Posts",
    });
  } catch (error) {
    res.status(500).send("Error fetching posts");
  }
});

// POST route for creating a new post
app.post("/post", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/api/create`, req.body);

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error creating a new post");
  }
});

// GET route for editing a specific post by it's id
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/edit/${req.params.id}`);

    res.render("edit.ejs", { post: response.data });
  } catch (error) {
    res.status(500).send("Error fetching post for editing");
  }
});

// POST route for updating a specific post by it's id
app.post("/update/:id", async (req, res) => {
  try {
    const response = await axios.patch(
      `${API_URL}/api/update/${req.params.id}`,
      req.body
    );

    res.redirect("/posts");
  } catch (error) {
    res.status(500).send("Error updating post");
  }
});

// GET route for deleting a specific post by it's id
app.get("/delete/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/delete/${req.params.id}`
    );

    res.redirect("/posts");
  } catch (error) {
    res.status(500).send("Error deleting post");
  }
});

// POST route for searching posts by its topic
app.post("/search", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/api/search`, {
      topic: req.body.topic,
    });

    res.render("post.ejs", {
      sortedPosts: response.data,
      heading: "Found Posts",
    });
  } catch (error) {
    res.status(500).send("Error searching posts");
  }
});

// Start the server on the specified port
app.listen(3000, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
