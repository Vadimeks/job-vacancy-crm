const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Сэрвіс для атрымання тэксту з вонкавых спасылак (Telegraph і інш.)
 */

/**
 * Скрапінг старонкі Telegra.ph
 */
async function scrapeTelegraph(url) {
  try {
    // 🆕 Дадаем validateStatus і больш кароткі таймаўт
    const { data, status } = await axios.get(url, {
      timeout: 8000,
      validateStatus: (s) => s === 200,
    });

    const $ = cheerio.load(data);
    const title = $("header h1").text().trim();
    const content = $("article").text().trim();

    // 🆕 Калі артыкул амаль пусты — ігнаруем
    if (!content || content.length < 50) return null;

    return title ? `--- ${title} ---\n${content}` : content;
  } catch (err) {
    // 🆕 Цяпер памылка 404 проста логаецца, але не спыняе працэс
    console.warn(`⚠️ Scrape Telegraph Skip (${url}): ${err.message}`);
    return null;
  }
}

/**
 * Універсальны скрапер для іншых HTML старонак (fallback)
 */
async function scrapeGenericHtml(url) {
  try {
    const { data, status } = await axios.get(url, {
      timeout: 8000,
      validateStatus: (s) => s === 200,
    });

    const $ = cheerio.load(data);
    $("script, style, nav, footer, header, noscript").remove();

    const content = $("main, #content, .content, article, body").text().trim();
    const cleanContent = content.replace(/\s\s+/g, " ");

    // 🆕 Калі тэксту вельмі мала, хутчэй за ўсё гэта старонка памылкі або "Заглушка"
    if (!cleanContent || cleanContent.length < 150) return null;

    return cleanContent.substring(0, 10000);
  } catch (err) {
    console.warn(`⚠️ Scrape Generic Skip (${url}): ${err.message}`);
    return null;
  }
}

/**
 * Галоўная функцыя-дыспетчар для вонкавага кантэнту
 */
async function getExternalContent(url) {
  if (!url) return null;

  // Ігнаруем Google Docs, бо яны апрацоўваюцца праз іншы сэрвіс
  if (url.includes("docs.google.com") || url.includes("drive.google.com")) {
    return null;
  }

  if (url.includes("telegra.ph")) {
    return await scrapeTelegraph(url);
  }

  return await scrapeGenericHtml(url);
}

module.exports = {
  getExternalContent,
  scrapeTelegraph,
  scrapeGenericHtml,
};
