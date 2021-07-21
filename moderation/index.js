const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    if (data.content.includes("orange")) {
      await axios.post("http://event-bus-srv:4006/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          content: data.content,
          status: "rejected",
        },
      });
    } else {
      await axios.post("http://event-bus-srv:4006/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          content: data.content,
          status: "approved",
        },
      });
    }
  }

  console.log("Event emitted: ", type);

  res.send({});
});

app.listen("4004", () => console.log("Listening on port 4004"));
