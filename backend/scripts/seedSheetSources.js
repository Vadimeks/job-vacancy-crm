const mongoose = require("mongoose");
const { google } = require("googleapis");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const SheetSource = require("../models/SheetSource");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "google-creds.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

const SOURCES = [
  {
    agency: "INTRASERVICE",
    url: "https://docs.google.com/spreadsheets/d/13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8/edit?gid=0#gid=0",
  },
  {
    agency: "INTRASERVICE",
    url: "https://docs.google.com/spreadsheets/d/13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8/edit?gid=1537077073#gid=1537077073",
  },
  {
    agency: "INTRASERVICE",
    url: "https://docs.google.com/spreadsheets/d/13PN6zOZiDLAL-iLm58NSbsig4h_inXp-GfmNWxc53y8/edit?gid=1683186395#gid=1683186395",
  },
  {
    agency: "RALEN",
    url: "https://docs.google.com/spreadsheets/d/1qASi88Ihwdw3LpFLQECg-7YSGuv07lZ4pMqFNyTgk8E/edit?gid=1850018480#gid=1850018480",
  },
  {
    agency: "MRÓWKI",
    url: "https://docs.google.com/spreadsheets/d/1hzA99T1oYP64BvIGww6zdZcs4iJjJQT80hm1LZimMiQ/edit?gid=0#gid=0",
  },
  {
    agency: "OTTO",
    url: "https://docs.google.com/spreadsheets/d/1ajkfjO8v5FcaNl-NDydc_NwihGgFlvdEkh38ouPwmj4/edit?gid=32030684#gid=32030684",
  },
  {
    agency: "VEKOS",
    url: "https://docs.google.com/spreadsheets/d/18x5KvkUglitqcpr69F0q6z08vfF2BTnjYBlRdMtv8bA/edit?gid=0#gid=0",
  },
  {
    agency: "PERSONEL SERVICE",
    url: "https://docs.google.com/spreadsheets/d/1-tUarxzFET_NOSp5n0LDvgoUxIKM80iGM8Taear2WyM/edit?gid=0#gid=0",
  },
];

async function getSheetName(spreadsheetId, gid) {
  try {
    const res = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = res.data.sheets.find(
      (s) => s.properties.sheetId === parseInt(gid),
    );
    return sheet ? sheet.properties.title : null;
  } catch (err) {
    console.error(
      `❌ Памылка атрымання назвы для ID ${spreadsheetId}:`,
      err.message,
    );
    return null;
  }
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Падключана да MongoDB");

    for (const item of SOURCES) {
      const spreadsheetId = item.url.match(/\/d\/([a-zA-Z0-9_-]+)/)[1];
      const gidMatch = item.url.match(/gid=(\d+)/);
      const gid = gidMatch ? gidMatch[1] : "0";

      const sheetName = await getSheetName(spreadsheetId, gid);
      if (!sheetName) {
        console.log(
          `⚠️ Прапушчана: не ўдалося знайсці ўкладку для ${item.agency}`,
        );
        continue;
      }

      await SheetSource.findOneAndUpdate(
        { spreadsheetId, sheetName },
        { agencyName: item.agency, status: "active" },
        { upsert: true, new: true },
      );
      console.log(`✅ Зарэгістравана: ${item.agency} -> ${sheetName}`);
    }

    console.log("🏁 Усе крыніцы паспяхова запісаны.");
  } catch (err) {
    console.error("❌ Памылка:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
