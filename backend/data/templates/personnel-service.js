// backend/data/templates/personnel-service.js
const personnelServiceTemplates = [
  {
    agencyName: "PERSONNEL SERVICE",
    templateName: "BREMBO Dąbrowa Górnicza - Виготовлення гальмівних дисків",
    keywords: [
      "BREMBO",
      "Dąbrowa Górnicza",
      "гальмівних",
      "тормозных",
      "гальмівні диски",
    ],

    title: "BREMBO Dąbrowa Górnicza: Виготовлення гальмівних дисків",
    location: "Dąbrowa Górnicza", // Польская назва
    country: "Польща",

    salary: {
      base: "24,80 zł/godz. brutto (основна ставка)",
      monthly: "Середня заробітна плата ~6000 zł netto",
      bonus:
        "900 zł (4 бригади), до 300 zł (ефективність), до 330 zł (відсутність прогулів)",
      notes:
        "+20% за нічні зміни, +50% за надурочні, +100% за вихідні та свята",
    },

    schedule: {
      shifts: "Система 4 бригад (4/1, 4/2, 4/1)",
      hours: "3 зміни по 8 годин (6-14; 14-22; 22-6)",
      details: "Є можливість брати надурочні години. Перерви: 20 хв + 5 хв.",
    },

    description:
      "Робота на лінії з виробництва гальмівних систем для світових автобрендів. Обов'язки: підготовка та транспортування контейнерів рохлою до шліфувальних машин; відбір дисків після фарбування, укладання в контейнери; контроль якості. Вага деталей від 6 до 25 кг (понад 25 кг — за допомогою техніки).",

    accommodation: {
      available: false,
      cost: "не надається",
      details:
        "Безкоштовний доїзд з міст: Bytom, Chorzów, Sosnowiec, Dąbrowa Górnicza, Jaworzno, Zawiercie, Olkusz, Czeladź, Będzin, Katowice та ін.",
    },

    transport: {
      provided: true,
      cost: "безкоштовно",
      details: "Автобуси з багатьох міст регіону Katowice",
    },

    requirements: {
      gender: "чоловіки",
      age: "45-50 років",
      nationalities: ["Україна"],
      docs: ["Umowa o pracę", "Коротке CV", "Мова B1"],
      physical:
        "Вміння користуватися інструментами (ключі, молоток, викрутка), досвід на автозаводі від 10 міс.",
    },

    conditions: {
      temperature: "в межах норми",
      workwear: "одяг видається та оплачується роботодавцем",
      food: "дофінансування на харчування 30 zł/день (їдальня на підприємстві)",
    },

    contractType: "Umowa o pracę",
  },
  {
    agencyName: "PERSONNEL SERVICE",
    templateName: "KORAL (GRAAL) Kukinia - Продукція рибних виробів",
    keywords: [
      "KORAL",
      "GRAAL",
      "Kukinia",
      "рибна",
      "лосось",
      "палтус",
      "кукінія",
    ],

    title:
      "KORAL (GRAAL): Виробництво рибної продукції (лосось, палтус, тунець)",
    location: "Kukinia", // Месца працы (каля Kołobrzeg)
    country: "Польща",

    salary: {
      base: "24.60 zł нетто/год",
      student: "30.50 zł нетто/год (студенти до 26 років)",
      monthly: "Середня ЗП: 4500-4900 zł (студенти 5800-6200) нетто",
      bonus: "Індивідуальні премії за якість роботи",
      notes:
        "Кандидати до 29 років: ~5500 zł нетто. Доплата за власне житло +150 zł (картка на продукти).",
    },

    schedule: {
      shifts: "2 зміни: 07:00-15:00/17:00 та 17:00-03:00",
      hours: "200–240 годин на місяць",
      details: "Пн-Пт, іноді субота. Неділя завжди вихідна. Перерви: 20-50 хв.",
    },

    description:
      "Оформлення договору: Gdańsk (Pruszcz Gdański). Робота: пакування свіжої та копченої риби; розділення, нарізання та чищення; зважування продукції. Риба не має запаху при робочій температурі. Відділ праці встановлюється на заводі.",

    accommodation: {
      available: true,
      cost: "670 zł/місяць (комунальні)",
      details:
        "Безкоштовне проживання, оплата лише за комунальні. Доплата за власне житло +150 зл.",
    },

    transport: {
      provided: true,
      cost: "безкоштовно",
      details:
        "Доїзд з міст: Białogard, Kołobrzeg, Ustronie Morskie, Karlino, Dygowo та ін.",
    },

    requirements: {
      gender: "жінки, чоловіки, пари",
      age: "до 55 років",
      nationalities: ["Україна"],
      docs: ["Umowa Zlecenie", "Санэпідкнижка (240 зл з першої ЗП)"],
      physical:
        "Температура 11-14°C. Заборонено: макіяж, накладні вії, прикраси, лак на нігтях.",
    },

    conditions: {
      temperature: "11-14°C",
      workwear: "Верхній одяг, штани та кофта надаються безкоштовна.",
      food: "Їдальня, шафки на ключ. Оформлення документів у Pruszcz Gdański.",
    },

    contractType: "Umowa Zlecenie",
  },
];

module.exports = personnelServiceTemplates;
