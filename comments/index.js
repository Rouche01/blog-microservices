const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const comments = [];

app.post("/posts/:postId/comments", async (req, res) => {
  const content = req.body.content;

  const comment = {
    id: crypto.randomUUID(),
    postId: req.params.postId,
    content,
    status: "pending",
  };

  comments.push(comment);
  await axios.post("http://event-bus-srv:4006/events", {
    type: "CommentCreated",
    data: comment,
  });

  res.send(comment);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const updatedComment = comments.find((comment) => comment.id === data.id);
    updatedComment.status = data.status;

    await axios.post("http://event-bus-srv:4006/events", {
      type: "CommentUpdated",
      data: updatedComment,
    });
  }
  console.log("Event emitted: ", type);

  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on port 4002");
});
