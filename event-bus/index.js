const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  await axios.post("http://posts-clusterip-srv:4001/events", {
    type,
    data,
  });
  await axios.post("http://comments-srv:4002/events", {
    type,
    data,
  });
  await axios.post("http://query-srv:4003/events", {
    type,
    data,
  });
  await axios.post("http://moderation-srv:4004/events", {
    type,
    data,
  });

  res.status(200).send({});
});

app.listen(4006, () => {
  console.log("Listening on port 4006");
});
