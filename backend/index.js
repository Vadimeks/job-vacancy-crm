const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Прывітанне! Сервер працуе і гатовы да працы з вакансіямі.");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `🚀 Сервер паспяхова запушчаны па адрасе: http://localhost:${PORT}`
  );
});
