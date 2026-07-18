import React, { useState, useEffect } from "react";
import * as MD from "../constants/masterData";
import { createTmaApply } from "../services/api";

const tg = window.Telegram.WebApp;

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
    transportNeeded: false,
    polishLanguageLevel: "Не вимагається",
    hoursRange: [],
    readyDate: "",
    notes: ""
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

  // Апрацоўка націску на галоўную кнопку Тэлеграма
  useEffect(() => {
    const handleSubmit = async () => {
      setStatus("loading");
      tg.MainButton.showProgress();
      
      try {
        const payload = {
          ...formData,
          telegramId: String(tg.initDataUnsafe?.user?.id || ""),
          telegramUsername: tg.initDataUnsafe?.user?.username || ""
        };
        
        await createTmaApply(payload);
        
        setStatus("success");
        tg.MainButton.hideProgress();
        tg.MainButton.hide();
        tg.HapticFeedback.notificationOccurred("success");
        
        // Закрываем праграму праз 2 секунды пасля поспеху
        setTimeout(() => tg.close(), 2000);
      } catch (err) {
        setStatus("error");
        tg.MainButton.hideProgress();
        tg.HapticFeedback.notificationOccurred("error");
        alert("Помилка при відправці. Спробуйте ще раз.");
      }
    };

    tg.onEvent("mainButtonClicked", handleSubmit);
    return () => tg.offEvent("mainButtonClicked", handleSubmit);
  }, [formData]);

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
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Дякуємо!</h1>
        <p className="opacity-70">Ваша анкета успішно збережена. Рекрутер зв'яжеться з вами найближчим часом.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] font-sans">
      <div className="p-5 space-y-6">
        <header>
          <h1 className="text-2xl font-black uppercase tracking-tight">Анкета кандидата</h1>
          <p className="text-sm opacity-60">Заповніть дані, щоб ми підібрали вакансії</p>
        </header>

        {/* Асноўныя дадзеныя */}
        <section className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-50 ml-1">Ваше ім'я *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-[var(--tg-theme-secondary-bg-color)] border-none focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Введіть ім'я"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-50 ml-1">Телефон / Viber *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-xl bg-[var(--tg-theme-secondary-bg-color)] border-none focus:ring-2 focus:ring-emerald-500 outline-none"
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
                className="w-full p-3 rounded-xl bg-[var(--tg-theme-secondary-bg-color)] border-none outline-none"
                placeholder="25"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase opacity-50 ml-1">Стать</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 rounded-xl bg-[var(--tg-theme-secondary-bg-color)] border-none outline-none appearance-none"
              >
                {MD.GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Пажаданні */}
        <section className="space-y-4 border-t border-[var(--tg-theme-secondary-bg-color)] pt-6">
          <h2 className="text-sm font-black uppercase opacity-50">Побажання до роботи</h2>
          
          <div className="space-y-2">
            <label className="text-xs font-bold ml-1">Де шукаєте роботу? (Регіони)</label>
            <div className="flex flex-wrap gap-2">
              {MD.VOIVODESHIPS.map(v => (
                <button
                  key={v.value}
                  onClick={() => toggleArrayItem("voivodeship", v.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    formData.voivodeship.includes(v.value)
                      ? "bg-emerald-500 text-white"
                      : "bg-[var(--tg-theme-secondary-bg-color)] opacity-70"
                  }`}
                >
                  {v.label.split(' (')[0]}
                </button>
              ))}
            </div>
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
                      ? "bg-blue-500 text-white"
                      : "bg-[var(--tg-theme-secondary-bg-color)] opacity-70"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Жыллё і Транспарт */}
        <section className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setFormData({ ...formData, accommodationNeeded: !formData.accommodationNeeded })}
            className={`p-4 rounded-2xl text-center transition-all ${
              formData.accommodationNeeded ? "bg-orange-500/20 border-2 border-orange-500" : "bg-[var(--tg-theme-secondary-bg-color)] opacity-50"
            }`}
          >
            <div className="text-2xl mb-1">🏠</div>
            <div className="text-[10px] font-bold uppercase">Житло потрібне</div>
          </button>

          <button
            onClick={() => setFormData({ ...formData, transportNeeded: !formData.transportNeeded })}
            className={`p-4 rounded-2xl text-center transition-all ${
              formData.transportNeeded ? "bg-indigo-500/20 border-2 border-indigo-500" : "bg-[var(--tg-theme-secondary-bg-color)] opacity-50"
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
            className="w-full p-3 rounded-xl bg-[var(--tg-theme-secondary-bg-color)] border-none outline-none resize-none"
            rows={3}
            placeholder="Наприклад: їду з дитиною, маю власне авто..."
          />
        </div>
      </div>
    </div>
  );
}