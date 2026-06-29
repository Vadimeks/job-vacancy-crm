const axios = require("axios");

async function fetchSharedData(sharePath) {
  try {
    const cleanSharePath = sharePath.includes("/") ? sharePath.split("/")[1] : sharePath;
    const baseUrl = `https://airtable.com/${sharePath}`;
    console.log(`🕵️ [Scraper] Загрузка старонкі: ${baseUrl}`);

    const pageRes = await axios.get(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8,be;q=0.6',
      },
      timeout: 20000
    });

    const html = pageRes.data;

    let appId = (html.match(/"(?:sharedApplicationId|applicationId)":"(app[^"]+)"/) || [])[1];
    let viewId = (html.match(/"sharedViewId":"(viw[^"]+)"/) || [])[1];
    
    const policyMatch = html.match(/"accessPolicy":"((?:\\"|[^"])*?)"/);
    if (!policyMatch) {
      throw new Error("Не ўдалося знайсці AccessPolicy ў HTML кодэ.");
    }
    const accessPolicyRaw = policyMatch[1].replace(/\\"/g, '"');

    if (!appId) appId = (accessPolicyRaw.match(/app[a-zA-Z0-9]{14,17}/) || [])[0];
    if (!viewId) viewId = (accessPolicyRaw.match(/viw[a-zA-Z0-9]{14,17}/) || [])[0];

    let tableId = (html.match(/"typedTableId":"(tbl[^"]+)"/) || [])[1];
    if (!tableId) tableId = (accessPolicyRaw.match(/tbl[a-zA-Z0-9]{14,17}/) || [])[0];

    let isApplicationShare = html.includes("includeDataForTableIds") || html.includes("/application/") || cleanSharePath.startsWith("shr") && !viewId || sharePath.includes("shrDFLZSZGKzeiBrM");

    let finalUrl = "";
    
    if (isApplicationShare && appId) {
      console.log(`ℹ️ [Scraper] Вызначаны тып: Application Read (Тып Manpower)`);
      // Калі гэта Manpower (паводле sharePath), выкарыстоўваем правераныя ID
      const isManpower = sharePath.includes("shrDFLZSZGKzeiBrM");
      const finalTableId = isManpower ? "tblTyT7NtUNZ1n2ek" : (tableId || "tblTyT7NtUNZ1n2ek");
      const finalViewId = isManpower ? "viwdTRwLTq3yfYVc5" : (viewId || "viwdTRwLTq3yfYVc5");

      finalUrl = `https://airtable.com/v0.3/application/${appId}/read?stringifiedObjectParams=${encodeURIComponent(JSON.stringify({
        includeDataForTableIds: [finalTableId],
        includeDataForViewIds: [finalViewId],
        shouldIncludeSchemaChecksum: true,
        mayOnlyIncludeRowAndCellDataForIncludedViews: true, // 👈 ЗМЕНА: дазваляем чытанне дадзеных для Manpower
        mayExcludeCellDataForLargeViews: false,
        allowMsgpackOfResult: false,
        canClientSupportPreviewMode: true // 👈 ДАДАДЗЕНА: імітацыя рэжыму прагляду браўзера
      }))}&accessPolicy=${encodeURIComponent(accessPolicyRaw)}`;
      
    } else if (viewId) {
      console.log(`ℹ️ [Scraper] Вызначаны тып: Shared View Data (Тып Job Impulse)`);
      finalUrl = `https://airtable.com/v0.3/view/${viewId}/readSharedViewData?stringifiedObjectParams=${encodeURIComponent(JSON.stringify({
        shouldUseNestedResponseFormat: true,
        allowMsgpackOfResult: false
      }))}&accessPolicy=${encodeURIComponent(accessPolicyRaw)}`;
    } else {
      throw new Error("Не хапае дадзеных для стварэння запыту.");
    }

    const dataRes = await axios.get(finalUrl, {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'x-airtable-application-id': appId,
        'x-airtable-access-policy': accessPolicyRaw,
        'x-airtable-inter-service-client': 'webClient',
        'x-requested-with': 'XMLHttpRequest',
        'x-time-zone': 'Europe/Warsaw',
        'x-user-locale': 'en',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': baseUrl
      }
    });

    let rows = [];
    let columns = [];
    const rootData = dataRes.data;
    // 👈 ДЫЯГНОСТЫКА: лагіруем ключы каранёвага аб'екта
console.log(`🔍 [Scraper Debug] Root keys: ${Object.keys(rootData || {}).join(", ")}`);
if (rootData?.data) console.log(`🔍 [Scraper Debug] data keys: ${Object.keys(rootData.data).join(", ")}`);
if (rootData?.application) console.log(`🔍 [Scraper Debug] application tables: ${rootData.application?.tables?.length}`);
if (rootData?.data?.application) console.log(`🔍 [Scraper Debug] data.application tables: ${rootData.data?.application?.tables?.length}`);
    // 👈 ЗМЕНА: Дакладны пошук табліцы па ID для Manpower
     let tableObj = null;
    
    // Спрабуем знайсці ў розных галінах JSON
    const potentialTables = [
      ...(rootData?.application?.tables || []),
      ...(rootData?.data?.application?.tables || []),
      ...(rootData?.sharedApplication?.tables || []),
      ...(rootData?.data?.table ? [rootData.data.table] : [])
    ];

    if (potentialTables.length > 0) {
      // Шукаем па ID, калі не знаходзім — бярэм першую
      tableObj = potentialTables.find(t => t.id === (tableId || "tblTyT7NtUNZ1n2ek")) || potentialTables[0];
    }

    if (tableObj) {
      rows = tableObj.rows || [];
      columns = tableObj.columns || [];
      console.log(`✅ [Scraper] Знойдзена табліца: ${tableObj.id}, радкоў: ${rows.length}`);
    }

    const viewName = "актуальное";

    return rows.map(row => {
      const fields = {};
      fields["Название колонки"] = viewName;

      (columns || []).forEach(col => {
        let val = row.cellValuesByColumnId?.[col.id];
        if (val === undefined && row.fields) {
          val = row.fields[col.name] || row.fields[col.id];
        }

        if (val !== undefined) {
          if (val && typeof val === 'object') {
            if (Array.isArray(val)) {
              fields[col.name] = val.map(v => v.displayValue || v.name || v).join(", ");
            } else {
              fields[col.name] = val.displayValue || val.name || JSON.stringify(val);
            }
          } else {
            fields[col.name] = val;
          }
        }
      });

      if (row.groupValues && row.groupValues.length > 0) {
        const groupVal = row.groupValues[0];
        const extractedGroup = groupVal.displayValue || groupVal.value;
        if (extractedGroup) {
          fields["Название колонки"] = String(extractedGroup).trim(); // 👈 ДАДАДЗЕНА: trim() для дакладнай фільтрацыі
        }
      }

      return {
        id: row.id,
        fields: fields,
        columnName: fields["Название колонки"]
      };
    });

  } catch (err) {
    console.error(`❌ [Scraper] Памылка для спасылкі ${sharePath}:`, err.message);
    return null;
  }
}

module.exports = { fetchSharedData };