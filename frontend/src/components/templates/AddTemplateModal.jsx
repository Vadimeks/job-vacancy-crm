// frontend/src/components/templates/AddTemplateModal.jsx
import { useState } from "react";
import { createTemplate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

const EMPTY_TEMPLATE = {
  agencyName: "",
  templateName: "",
  keywords: "",
  title: "",
  location: "",
  country: "Польща",
  salary: { base: "", student: "", monthly: "", bonus: "", notes: "" },
  schedule: { shifts: "", hours: "", details: "" },
  description: "",
  accommodation: { available: true, cost: "", details: "", deposit: "" },
  transport: { provided: true, cost: "", details: "" },
  requirements: {
    gender: "",
    age: "",
    nationalities: "",
    docs: "",
    physical: "",
  },
  conditions: { temperature: "", workwear: "", food: "" },
  contractType: "",
};

export default function AddTemplateModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_TEMPLATE);
  const [saving, setSaving] = useState(false);

  const setField = (path, value) => {
    const parts = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      if (parts.length === 1) {
        next[parts[0]] = value;
      } else {
        next[parts[0]] = { ...next[parts[0]], [parts[1]]: value };
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.agencyName || !form.templateName) {
      alert("Назва агенцыі і шаблона абавязковыя");
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...form,
        keywords: form.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        requirements: {
          ...form.requirements,
          nationalities: form.requirements.nationalities
            .split(",")
            .map((n) => n.trim())
            .filter(Boolean),
          docs: form.requirements.docs
            .split(",")
            .map((d) => d.trim())
            .filter(Boolean),
        },
      };
      const res = await createTemplate(data);
      onAdd(res.data);
      onClose();
    } catch {
      alert("Памылка захавання");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="font-semibold text-slate-100">Новы шаблон вакансіі</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Агенцыя *"
              value={form.agencyName}
              onChange={(v) => setField("agencyName", v)}
              placeholder="напр. EVL"
            />
            <Field
              label="Назва шаблона *"
              value={form.templateName}
              onChange={(v) => setField("templateName", v)}
              placeholder="напр. Golczewo_Marinade"
            />
          </div>

          <Field
            label="Ключавыя словы (праз коску)"
            value={form.keywords}
            onChange={(v) => setField("keywords", v)}
            placeholder="Гольчево, Голчево, маринад"
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Загаловак"
              value={form.title}
              onChange={(v) => setField("title", v)}
              placeholder="Гольчево. 80 км від Щецина"
            />
            <Field
              label="Лакацыя"
              value={form.location}
              onChange={(v) => setField("location", v)}
              placeholder="Гольчево (Golczewo)"
            />
          </div>

          <Divider label="💰 Аплата" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Базавая стаўка"
              value={form.salary.base}
              onChange={(v) => setField("salary.base", v)}
              placeholder="25,36 zł нетто/год"
            />
            <Field
              label="Студэнцкая стаўка"
              value={form.salary.student}
              onChange={(v) => setField("salary.student", v)}
              placeholder="31,40 zł нетто/год"
            />
            <Field
              label="Месячны заробак"
              value={form.salary.monthly}
              onChange={(v) => setField("salary.monthly", v)}
              placeholder="4 250 – 6 000 zł/міс"
            />
            <Field
              label="Бонусы"
              value={form.salary.bonus}
              onChange={(v) => setField("salary.bonus", v)}
            />
          </div>

          <Divider label="🕒 Графік" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Змены"
              value={form.schedule.shifts}
              onChange={(v) => setField("schedule.shifts", v)}
              placeholder="2 зміни по 8-11 годин"
            />
            <Field
              label="Гадзіны ў месяц"
              value={form.schedule.hours}
              onChange={(v) => setField("schedule.hours", v)}
              placeholder="220–270 годин на місяць"
            />
            <div className="col-span-2">
              <Field
                label="Дэталі графіка"
                value={form.schedule.details}
                onChange={(v) => setField("schedule.details", v)}
                placeholder="дадатковая інфа па зменах"
              />
            </div>
          </div>

          <Divider label="🛠 Абавязкі" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Апісанне (праз кропку з коскай)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              placeholder="упаковка; сортування; пакування..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <Divider label="🏠 Жытло" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Кошт"
              value={form.accommodation.cost}
              onChange={(v) => setField("accommodation.cost", v)}
              placeholder="750 zł/місяць"
            />
            <Field
              label="Дэпазіт"
              value={form.accommodation.deposit}
              onChange={(v) => setField("accommodation.deposit", v)}
              placeholder="200 zł"
            />
            <div className="col-span-2">
              <Field
                label="Дэталі"
                value={form.accommodation.details}
                onChange={(v) => setField("accommodation.details", v)}
                placeholder="для пар — 2-місні кімнати"
              />
            </div>
          </div>

          <Divider label="🚌 Транспарт" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Кошт"
              value={form.transport.cost}
              onChange={(v) => setField("transport.cost", v)}
              placeholder="безкоштовно"
            />
            <Field
              label="Дэталі"
              value={form.transport.details}
              onChange={(v) => setField("transport.details", v)}
              placeholder="транспорт роботодавця"
            />
          </div>

          <Divider label="📋 Патрабаванні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Гендар"
              value={form.requirements.gender}
              onChange={(v) => setField("requirements.gender", v)}
              placeholder="жінки"
            />
            <Field
              label="Узрост"
              value={form.requirements.age}
              onChange={(v) => setField("requirements.age", v)}
              placeholder="до 58 років"
            />
            <Field
              label="Нацыянальнасці (праз коску)"
              value={form.requirements.nationalities}
              onChange={(v) => setField("requirements.nationalities", v)}
              placeholder="Україна, Молдова"
            />
            <Field
              label="Дакументы (праз коску)"
              value={form.requirements.docs}
              onChange={(v) => setField("requirements.docs", v)}
              placeholder="санепід, віза"
            />
          </div>

          <Divider label="🌡 Умовы" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Тэмпература"
              value={form.conditions.temperature}
              onChange={(v) => setField("conditions.temperature", v)}
              placeholder="+10°C"
            />
            <Field
              label="Тып дагавора"
              value={form.contractType}
              onChange={(v) => setField("contractType", v)}
              placeholder="Umowa zlecenie"
            />
            <div className="col-span-2">
              <Field
                label="Спецвопратка"
                value={form.conditions.workwear}
                onChange={(v) => setField("conditions.workwear", v)}
                placeholder="спецодяг надається"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            {saving ? "Захаванне..." : "Захаваць шаблон"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
          >
            Адмена
          </button>
        </div>
      </div>
    </div>
  );
}
