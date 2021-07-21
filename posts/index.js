const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const posts = [];

app.post("/posts/create", async (req, res) => {
  const title = req.body.title;

  const post = {
    id: crypto.randomUUID(),
    title,
  };

  posts.push(post);
  await axios.post("http://event-bus-srv:4006/events", {
    type: "PostCreated",
    data: post,
  });
  res.send(post);
});

app.post("/events", (req, res) => {
  const { type } = req.body;
  console.log("Event emitted: ", type);

  res.send({});
});

app.listen(4001, () => {
  console.log("v55");
  console.log("Listening on port 4001");
});
