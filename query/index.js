const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const postsWithComment = [];

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log(type);

  if (type === "PostCreated") {
    const post = {
      id: data.id,
      title: data.title,
      comments: [],
    };

    postsWithComment.push(post);
  }

  if (type === "CommentCreated") {
    const updatedPost = postsWithComment.find(
      (post) => post.id === data.postId
    );
    updatedPost.comments.push({
      id: data.id,
      content: data.content,
      status: data.status,
    });
  }

  if (type === "CommentUpdated") {
    const updatedPost = postsWithComment.find(
      (post) => post.id === data.postId
    );
    const updatedComment = updatedPost.comments.find(
      (comment) => comment.id === data.id
    );
    updatedComment.status = data.status;
    updatedComment.content = data.content;
  }

  res.send(postsWithComment);
});

app.get("/posts", (req, res) => {
  res.send(postsWithComment);
});

app.listen(4003, () => {
  console.log("Listening on port 4003");
});
