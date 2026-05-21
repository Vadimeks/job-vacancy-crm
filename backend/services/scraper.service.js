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
    const { data } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(data);

    // У Telegraph асноўны кантэнт ляжыць у артыкуле (article)
    const title = $("header h1").text().trim();
    const content = $("article").text().trim();

    return title ? `--- ${title} ---\n${content}` : content;
  } catch (err) {
    console.error(`❌ Scrape Telegraph Error (${url}):`, err.message);
    return null;
  }
}

/**
 * Універсальны скрапер для іншых HTML старонак (fallback)
 */
async function scrapeGenericHtml(url) {
  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(data);

    // Прыбіраем скрыпты, стылі і навігацыю, каб не забіваць AI смеццем
    $("script, style, nav, footer, header, noscript").remove();

    // Бярэм тэкст з асноўных тэгаў кантэнту
    const content = $("main, #content, .content, article, body").text().trim();

    // Чысцім ад лішніх прабелаў і пустых радкоў
    return content.replace(/\s\s+/g, " ").substring(0, 10000);
  } catch (err) {
    console.error(`❌ Scrape Generic HTML Error (${url}):`, err.message);
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
