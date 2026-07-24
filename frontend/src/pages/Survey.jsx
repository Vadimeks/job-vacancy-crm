import React, { useState, useEffect, useCallback } from "react";
import * as MD from "../constants/masterData";
import { createTmaApply } from "../services/api";
import { Link } from "react-router-dom";
const tg = window.Telegram.WebApp;
const isTelegram = !!tg.initData; // 👈 Вызначаем, ці гэта Telegram
export default function Survey() {
  const [formData, setFormData] = useState({
    name: tg.initDataUnsafe?.user?.first_name || "",
    phone: "",
    gender: "Чоловіки",
    age: "",
    nationality: "Україна",
    currentLocation: "",
    voivodeship: [],
    locationFlexible: false,
    spheres: [],
    accommodationNeeded: true,
    freeHousingOnly: false,
    transportNeeded: false,
    polishLanguageLevel: "Не вимагається",
    hoursRange: [],
    readyDate: "",
    activeDocs: [], // 👈 ДАДАДЗЕНА: без гэтага поля toggleArrayItem("activeDocs", ...) кідаў TypeError і вешаў форму
    autoMatchConsent: false, // 👈 ДАДАДЗЕНА: згода на аўтаматычны падбор і падпіску на вакансії
    notes: "",
    nuances: [], // 👈 ЗМЕНЕНА: было тэкставае поле, цяпер масіў выбраных нюансаў (checklist)
    nuancesNotes: "" // 👈 ДАДАДЗЕНА: вольны тэкст для дадатковых нюансаў
  });

  const [status, setStatus] = useState("idle"); // 'idle', 'loading', 'success', 'error'

  useEffect(() => {
    tg.ready();
    tg.expand(); // Разгортваем на ўвесь экран
    
    // Налада галоўнай кнопкі Telegram
    tg.MainButton.setParams({
      text: "ВІДПРАВИТИ АНКЕТУ",
      color: "#10b981", // emerald-500
      text_color: "#ffffff"
    });

    return () => tg.MainButton.hide();
  }, []);

  // Сачым за валідацыяй, каб паказаць/схаваць кнопку
  useEffect(() => {
    if (formData.name.length > 1 && formData.phone.length > 8 && status === "idle") {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }, [formData.name, formData.phone, status]);

 // 👈 ВЫПРАЎЛЕНА: Выкарыстоўваем useCallback для стабільнасці спасылкі (v7.9.4)
  const handleSubmit = useCallback(async () => {
    setStatus("loading");
    if (isTelegram) tg.MainButton.showProgress();
    
    try {
      const payload = {
        ...formData,
        // Перастрахоўка: калі мы не ў ТГ, гэтыя палі будуць пустымі
        telegramId: tg.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null,
        telegramUsername: tg.initDataUnsafe?.user?.username || null,
        source: isTelegram ? "telegram_bot" : "viber" // Дапамагаем бэкенду вызначыць крыніцу
      };
      
      await createTmaApply(payload);
      
      setStatus("success");
      if (isTelegram) {
        tg.MainButton.hideProgress();
        tg.MainButton.hide();
        tg.HapticFeedback.notificationOccurred("success");
        setTimeout(() => tg.close(), 2000);
      }
    } catch (err) {
      setStatus("error");
      if (isTelegram) {
        tg.MainButton.hideProgress();
        tg.HapticFeedback.notificationOccurred("error");
      }
      alert("Помилка при відправці. Спробуйте ще раз.");
    }
  }, [formData]); // Функцыя абновіцца толькі пры змене дадзеных формы
useEffect(() => {
    tg.onEvent("mainButtonClicked", handleSubmit);
    return () => tg.offEvent("mainButtonClicked", handleSubmit);
  }, [handleSubmit]); // 👈 Цяпер залежыць ад стабільнай функцыі
  const toggleArrayItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(i => i !== value)
        : [...prev[field], value]
    }));
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-50 text-slate-900 font-sans">
        <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-emerald-100 animate-in zoom-in-95 duration-300">
          <div className="text-7xl mb-6 animate-bounce">✅</div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-3">Дякуємо!</h1>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">Ваша анкету успішно збережена.<br/>Рекрутер зв'яжеться з вами найближчим часом.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 font-sans flex flex-col items-center p-0 sm:p-4">
      {/* 👈 ДАДАДЗЕНА: Кнопка На галоўную */}
      <div className="w-full max-w-2xl px-4 pt-4">
        <Link to="/nova-work-portal-2024" className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1">
          ← На головну
        </Link>
      </div>
      <div className="w-full max-w-2xl bg-white sm:rounded-[2rem] sm:shadow-2xl sm:my-4 overflow-hidden flex flex-col border border-slate-100 p-6 sm:p-10 space-y-8">
        <header className="w-full pt-4 flex flex-col items-center text-center space-y-2">
  <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Анкета кандидата</h1>
  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest opacity-80">Nova Work Agency</p>
</header>

        {/* Асноўныя дадзеныя */}
        <section className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-50 ml-1">Ваше ім'я *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100   focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Введіть ім'я"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-50 ml-1">Телефон / Viber *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100   focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="+380..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase opacity-50 ml-1">Вік</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100   outline-none"
                placeholder="25"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase opacity-50 ml-1">Стать</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100   outline-none appearance-none"
              >
                {MD.GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
          </div>

          {/* 👈 ДАДАДЗЕНА: Нацыянальнасць і бягучае месцазнаходжанне */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase opacity-50 ml-1">Національність</label>
              <select
                value={formData.nationality}
                onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100   outline-none appearance-none"
              >
                {MD.NATIONALITIES.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase opacity-50 ml-1">Зараз у місті</label>
              <input
                type="text"
                value={formData.currentLocation}
                onChange={e => setFormData({ ...formData, currentLocation: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100   outline-none"
                placeholder="Київ"
              />
            </div>
          </div>
        </section>

        {/* Пажаданні */}
        <section className="space-y-4 border-t border-[var(--tg-theme-secondary-bg-color)] pt-6">
          <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 border-b border-emerald-500/10 pb-1 flex items-center gap-2"><span>🔍</span> Побажання до роботи</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold ml-1">Де шукаєте роботу? (Регіони)</label>
            
            {/* 👈 НОВАЕ: Кнопка "Будь-який регіон" */}
            <button
              onClick={() => {
                const nextFlexible = !formData.locationFlexible;
                setFormData({
                  ...formData,
                  locationFlexible: nextFlexible,
                  voivodeship: nextFlexible ? [] : formData.voivodeship
                });
              }}
              className={`w-full p-3 rounded-xl text-xs font-bold uppercase transition-all border-2 flex items-center justify-center gap-2 mb-2 ${
                formData.locationFlexible 
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-md" 
                  : "bg-slate-50 text-slate-400 border-slate-100"
              }`}
            >
              <span>{formData.locationFlexible ? "✅" : "🌍"}</span>
              Будь-який регіон Польщі
            </button>

            {!formData.locationFlexible && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                {MD.VOIVODESHIPS.map(v => (
                  <button
                    key={v.value}
                    onClick={() => toggleArrayItem("voivodeship", v.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      formData.voivodeship.includes(v.value) ? "bg-emerald-500 text-white border-emerald-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-100"
                    }`}
                  >
                    {v.label.split(' (')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold ml-1">Сфери діяльності</label>
            <div className="flex flex-wrap gap-2">
              {MD.CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => toggleArrayItem("spheres", c.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    formData.spheres.includes(c.value)
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 👈 ДАДАДЗЕНА: Рівень польської мови */}
          <div className="space-y-2">
            <label className="text-xs font-bold ml-1">Рівень польської мови</label>
            <div className="flex flex-wrap gap-2">
              {MD.LANGUAGES.map(l => (
                <button
                  key={l.value}
                  onClick={() => setFormData({ ...formData, polishLanguageLevel: l.value })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    formData.polishLanguageLevel === l.value
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-100"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* 👈 ДАДАДЗЕНА: Бажана кількість годин на місяць */}
          <div className="space-y-2">
            <label className="text-xs font-bold ml-1">Скільки годин на місяць бажаєте працювати?</label>
            <div className="flex flex-wrap gap-2">
              {MD.HOURS_RANGE_OPTIONS.filter(h => h.value !== "unknown").map(h => (
                <button
                  key={h.value}
                  onClick={() => toggleArrayItem("hoursRange", h.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    formData.hoursRange.includes(h.value)
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-100"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* 👈 ДАДАДЗЕНА: Дата гатоўнасці выхаду на роботу */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-50 ml-1">Коли готові розпочати роботу?</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.readyDate}
                onChange={e => setFormData({ ...formData, readyDate: e.target.value })}
                className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-100   outline-none"
                placeholder="ДД.ММ, наприклад 25.07"
              />
              <button
                onClick={() => setFormData({ ...formData, readyDate: "ASAP" })}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                  formData.readyDate === "ASAP"
                    ? "bg-emerald-500 text-white border-emerald-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-100"
                }`}
              >
                Якнайшвидше
              </button>
            </div>

          </div>
        </section>
{/* Кнопка "Толькі бясплатнае" з'яўляецца, толькі калі выбрана, што жытло патрэбна */}
{formData.accommodationNeeded && (
  <button
    onClick={() => setFormData({ ...formData, freeHousingOnly: !formData.freeHousingOnly })}
    className={`col-span-2 p-3 rounded-xl text-center transition-all flex items-center justify-center gap-2 ${
      formData.freeHousingOnly 
        ? "bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400" 
        : "bg-slate-50 border border-slate-100 opacity-50"
    }`}
  >
    <span className="text-lg">{formData.freeHousingOnly ? "✅" : "⬜"}</span>
    <span className="text-[10px] font-bold uppercase">Шукаю тільки безкоштовне житло</span>
  </button>
)}
        {/* Жыллё і Транспарт */}
        <section className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setFormData({ ...formData, accommodationNeeded: !formData.accommodationNeeded })}
            className={`p-4 rounded-2xl text-center transition-all ${
              formData.accommodationNeeded ? "bg-orange-500/20 border-2 border-orange-500" : "bg-slate-50 border border-slate-100 opacity-50"
            }`}
          >
            <div className="text-2xl mb-1">🏠</div>
            <div className="text-[10px] font-bold uppercase">Житло потрібне</div>
          </button>

          <button
            onClick={() => setFormData({ ...formData, transportNeeded: !formData.transportNeeded })}
            className={`p-4 rounded-2xl text-center transition-all ${
              formData.transportNeeded ? "bg-indigo-500/20 border-2 border-indigo-500" : "bg-slate-50 border border-slate-100 opacity-50"
            }`}
          >
            <div className="text-2xl mb-1">🚌</div>
            <div className="text-[10px] font-bold uppercase">Довіз потрібен</div>
          </button>
        </section>

        {/* Дакументы */}
        <section className="space-y-2">
          <label className="text-xs font-bold ml-1">Які документи маєте?</label>
          <div className="grid grid-cols-2 gap-2">
            {MD.DOCS.map(d => (
              <button
                key={d.value}
                onClick={() => toggleArrayItem("activeDocs", d.value)}
                className={`p-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                  formData.activeDocs?.includes(d.value)
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                    : "bg-transparent border-[var(--tg-theme-secondary-bg-color)] opacity-40"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase opacity-50 ml-1">Додаткові побажання</label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100   outline-none resize-none"
            rows={3}
            placeholder="Наприклад: їду з дитиною, маю власне авто..."
          />
        </div>
<div className="space-y-2">
          <label className="text-[10px] font-black uppercase opacity-50 ml-1 text-red-500">Важливі нюанси</label>
          <p className="text-[10px] text-slate-400 ml-1">Які нюанси варто врахувати при підборі вакансії для вас?</p>
          <div className="flex flex-wrap gap-2">
            {MD.CHECKLIST_ITEMS.map(item => (
              <button
                key={item.value}
                onClick={() => toggleArrayItem("nuances", item.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  formData.nuances.includes(item.value)
                    ? "bg-red-500 text-white border-red-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <textarea
            value={formData.nuancesNotes}
            onChange={e => setFormData({ ...formData, nuancesNotes: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 outline-none resize-none text-sm mt-2"
            rows={3}
            placeholder="Впишіть, якщо є ще якісь нюанси, або деталі обраного варіанту вище..."
          />
        </div>
        {/* 👈 ДАДАДЗЕНА: Згода на аўтаматычны падбор вакансій */}
        <button
          onClick={() => setFormData({ ...formData, autoMatchConsent: !formData.autoMatchConsent })}
          className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-3 ${
            formData.autoMatchConsent
              ? "bg-emerald-500 text-white border-emerald-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-100"
          }`}
        >
          <span className="text-xl shrink-0">{formData.autoMatchConsent ? "✅" : "⬜"}</span>
          <span className="text-xs leading-relaxed">
            <span className="font-bold block mb-1">Погоджуюсь на автоматичний підбір вакансій</span>
            Ми одразу підберемо для вас підходящі вакансії за вказаними параметрами. Рекрутер в будь-якому разі зв'яжеться з вами особисто.
          </span>
        </button>
      </div>
      {/* 👈 Кнопка для Viber/Browser: дадаем шырыню і водступы */}
      {!isTelegram && (
        <button
          onClick={handleSubmit}
          disabled={formData.name.length < 2 || formData.phone.length < 9 || status === "loading"}
          className="w-full max-w-2xl py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-600 transition-all disabled:opacity-50 uppercase tracking-widest mt-4 mx-4 sm:mx-0 mb-8"
        >
          {status === "loading" ? "Відправка..." : "Відправити анкету"}
        </button>
      )}
    </div>
  );
}