// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { startBot } = require("./services/telegram.service");
const { router: vacanciesRouter } = require("./routes/vacancies");
const inboxRouter = require("./routes/inbox");

const app = express();

// Налады мідлвараў
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Апрацоўка памылак парсінгу JSON (ахова ад бітых даных MacroDroid)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("⚠️ Атрыманы біты JSON. Ігнаруем памылку і працягваем.");
    return res.status(200).json({ status: "error_bad_json_ignored" });
  }
  next();
});

// Роўты
app.use("/api/vacancies", vacanciesRouter);
app.use("/api/inbox", inboxRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  startBot(); // Запускаем афіцыйнага бота для апавяшчэнняў
});
