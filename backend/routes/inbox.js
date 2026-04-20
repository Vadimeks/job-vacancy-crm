const express = require("express");
const router = express.Router();
const UnprocessedMessage = require("../models/UnprocessedMessage");

router.post("/push", async (req, res) => {
  console.log("--- НОВЫ ЗАПЫТ ---");
  console.log("Body:", req.body);

  try {
    const body = req.body || {};
    let sender = body.sender || body.not_title;
    let text = body.text || body.notification || body.not_text_big;
    let source = body.source || "viber";

    // ХІТРАСЦЬ: Калі тэкст пусты, але ёсць дзіўныя ключы (як у тваім логу)
    if (!text) {
      const keys = Object.keys(body);
      // Шукаем ключ, які не з'яўляецца сістэмным і вельмі доўгі
      const messageKey = keys.find(
        (k) => k !== "sender" && k !== "source" && k.length > 5,
      );
      if (messageKey) {
        text = messageKey; // Гэта і ёсць наша паведамленне
      }
    }

    // Калі імя адпраўніка прыйшло ў дужках urlencode - чысцім
    if (sender && sender.includes("urlencode:")) sender = "Viber User";

    if (!text || text.length < 2 || text.includes("urlencode:")) {
      console.log("⚠️ Паведамленне не распазнана або пустое.");
      return res.status(200).json({ status: "ignored" });
    }

    let category = "chat";
    const t = text.toLowerCase();
    if (
      t.includes("вакансія") ||
      t.includes("zł") ||
      t.includes("netto") ||
      t.includes("шукаем")
    ) {
      category = "vacancy";
    } else if (
      t.includes("стоп") ||
      t.includes("актуальна") ||
      t.includes("дабор")
    ) {
      category = "update";
    }

    const newMessage = new UnprocessedMessage({
      sender: sender || "Невядомы",
      text,
      source,
      category,
    });

    await newMessage.save();
    console.log(`✅ Захавана ад ${sender}: ${category}`);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("❌ Памылка:", error);
    res.status(500).json({ status: "error" });
  }
});

// Маршруты для фронтэнда (GET, DELETE, STATS) застаўляюцца без змен...
router.get("/", async (req, res) => {
  try {
    const messages = await UnprocessedMessage.find({ processed: false }).sort({
      createdAt: -1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const unreadCount = await UnprocessedMessage.countDocuments({
      isRead: false,
      processed: false,
    });
    res.json({ unreadCount });
  } catch (error) {
    res.json({ unreadCount: 0 });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await UnprocessedMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Паведамленне выдалена" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
