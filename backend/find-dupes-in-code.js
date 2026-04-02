
const fs = require('fs');

const path = require('path');



// Прыбіраем лішні 'backend', бо мы ўжо ў гэтай папцы

const templatesDir = path.resolve('./data/templates');



if (!fs.existsSync(templatesDir)) {

    console.error(`❌ Памылка: Папка не знойдзена па адрасе: ${templatesDir}`);

    process.exit(1);

}



const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.js') && f !== 'universal-template.js');



files.forEach(file => {

  const filePath = path.join(templatesDir, file);

  const content = fs.readFileSync(filePath, 'utf-8');



  const templateMatches = content.match(/templateName:\s*"([^"]+)"/g) || [];

  const templateMap = {};



  templateMatches.forEach(m => {

    const template = m.match(/"([^"]+)"/)[1];

    templateMap[template] = (templateMap[template] || 0) + 1;

  });



  let hasDupes = false;

  Object.keys(templateMap).forEach(template => {

    const count = templateMap[template];

    if (count > 1) {

      if (!hasDupes) {

        console.log(`❌ ${file}:`);

        hasDupes = true;

      }

      console.log(`    ⚠️ Дублікат назвы: "${template}" x${count}`);

    }

  });



  if (!hasDupes) {

    console.log(`✅ ${file}: Дублікатаў не знойдзена`);

  }

});

