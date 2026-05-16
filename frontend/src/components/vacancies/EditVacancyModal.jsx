import { useState } from "react";
import { updateVacancy } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import * as MD from "../../constants/masterData";

// Эталонныя спісы — павінны супадаць з KNOWN_AGENCIES у ai.service.js
const AGENCY_OPTIONS = [
  "APOLO",
  "BISAR",
  "EST",
  "FWS",
  "GLOBAL",
  "INTRASERVICE",
  "MANPOWER",
  "MANUAL",
  "MRÓWKI",
  "NIDEN",
  "OTTO",
  "PROGRES",
  "SG",
  "SOLANO",
];

const CONTRACT_OPTIONS = [
  { value: "Umowa zlecenie", label: "Umowa zlecenie" },
  { value: "Umowa o pracę", label: "Umowa o pracę" },
  { value: "other", label: "Іншае (увесці ўручную)" },
];

const COUNT_OPTIONS = [
  { value: "1", label: "1 особа" },
  { value: "2", label: "Пара (2)" },
  { value: "сім'я", label: "Сім'я" },
];

const FOOD_OPTIONS = ["Власне", "Обіди", "Субсидоване"];

const ACCOMMODATION_TYPE_OPTIONS = [
  { value: "Надається", label: "Надається" },
  { value: "Надається (для пар)", label: "Надається (для пар)" },
  { value: "Не надається", label: "Не надається" },
];

export default function EditVacancyModal({ vacancy, onClose, onSave }) {
  const [form, setForm] = useState({
    ...vacancy,
    brand: vacancy.brand || "",
    voivodeship: vacancy.voivodeship || "",
    category: vacancy.category || "",
    keywords: Array.isArray(vacancy.keywords)
      ? vacancy.keywords.join(", ")
      : vacancy.keywords || "",
    requirements: {
      ...vacancy.requirements,
      ageMax: vacancy.requirements?.ageMax || "", // 🆕 Цяпер гэта радок
      physicalLoad: !!vacancy.requirements?.physicalLoad,
      gender: Array.isArray(vacancy.requirements?.gender)
        ? vacancy.requirements.gender
        : [],
      standardDocs: Array.isArray(vacancy.requirements?.standardDocs)
        ? vacancy.requirements.standardDocs
        : [],
      nationalities: Array.isArray(vacancy.requirements?.nationalities)
        ? vacancy.requirements.nationalities
        : [],
    },
    conditions: {
      ...vacancy.conditions,
      specificNuances: Array.isArray(vacancy.conditions?.specificNuances)
        ? vacancy.conditions.specificNuances
            .map((n) => (typeof n === "object" ? n.text : n))
            .join(", ")
        : vacancy.conditions?.specificNuances || "",
    },
  });

  // Для поля contractType: калі значэнне не з спіса — рэжым "other"
  const isCustomContract = !["Umowa zlecenie", "Umowa o pracę", ""].includes(
    form.contractType || "",
  );
  const [contractMode, setContractMode] = useState(
    isCustomContract ? "other" : form.contractType || "",
  );

  const [saving, setSaving] = useState(false);

  const setField = (path, value) => {
    const parts = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      if (parts.length === 1) {
        next[parts[0]] = value;
      } else if (parts.length === 2) {
        next[parts[0]] = { ...next[parts[0]], [parts[1]]: value };
      } else if (parts.length === 3) {
        next[parts[0]] = {
          ...next[parts[0]],
          [parts[1]]: { ...next[parts[0]]?.[parts[1]], [parts[2]]: value },
        };
      }
      return next;
    });
  };

  const toggleArrayItem = (path, value) => {
    const parts = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      if (parts.length === 1) {
        const arr = Array.isArray(next[parts[0]]) ? next[parts[0]] : [];
        next[parts[0]] = arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value];
      } else {
        const parent = { ...next[parts[0]] };
        const arr = Array.isArray(parent[parts[1]]) ? parent[parts[1]] : [];
        parent[parts[1]] = arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value];
        next[parts[0]] = parent;
      }
      return next;
    });
  };

  const handleContractSelect = (val) => {
    setContractMode(val);
    if (val !== "other") setField("contractType", val);
    else setField("contractType", "");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        requirements: {
          ...form.requirements,
          // ageMax застаецца радком з стану form
        },
        keywords:
          typeof form.keywords === "string"
            ? form.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : form.keywords,
        conditions: {
          ...form.conditions,
          specificNuances:
            typeof form.conditions.specificNuances === "string"
              ? form.conditions.specificNuances
                  .split(",")
                  .map((txt) => {
                    const trimmed = txt.trim();
                    // Шукаем, ці быў гэты тэкст у арыгінальных нюансах, каб захаваць катэгорыю
                    const original = vacancy.conditions?.specificNuances?.find(
                      (on) =>
                        (typeof on === "object" ? on.text : on) === trimmed,
                    );
                    return {
                      category: original?.category || "Інше",
                      text: trimmed,
                    };
                  })
                  .filter((n) => n.text)
              : form.conditions.specificNuances,
        },
      };
      const res = await updateVacancy(vacancy._id, data);
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
      alert(
        "Памылка захавання: " +
          (err.response?.data?.message || "праверце палі"),
      );
    } finally {
      setSaving(false);
    }
  };

  // --- UI КАМПАНЕНТЫ ---

  const SingleBtnGroup = ({
    label,
    options,
    selectedValue,
    onSelect,
    small,
  }) => (
    <div className="mb-4">
      {label && (
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          {label}
        </label>
      )}
      <div
        className={`flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-800`}
      >
        {options.map((opt) => {
          const val = opt.value ?? opt;
          const lbl = opt.label ?? opt;
          const isActive = selectedValue === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onSelect(val)}
              className={`px-3 py-1.5 rounded-lg transition-all border font-medium ${
                small ? "text-[10px]" : "text-[11px]"
              } ${
                isActive
                  ? "bg-emerald-500 border-emerald-500 text-slate-900"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );

  const MultiBtnGroup = ({ label, options, selectedValues, onToggle }) => (
    <div className="mb-4">
      {label && (
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-800">
        {options.map((opt) => {
          const val = opt.value ?? opt;
          const lbl = opt.label ?? opt;
          const isActive = selectedValues?.includes(val);
          return (
            <button
              key={val}
              type="button"
              onClick={() => onToggle(val)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                isActive
                  ? "bg-emerald-500 border-emerald-500 text-slate-900"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Dropdown для агенцыі
  const AgencyDropdown = () => (
    <div className="mb-0">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
        Агенція
      </label>
      <select
        value={form.agencyName || "MANUAL"}
        onChange={(e) => setField("agencyName", e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
      >
        {AGENCY_OPTIONS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 custom-scrollbar">
        {/* ШАПКА */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="font-semibold text-slate-100">
              Редагування вакансії
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs font-mono">
              <span className="text-slate-500">{vacancy.vacancyCode}</span>
              <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded">
                {vacancy.agencyName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-8">
          {/* СТАТУС */}
          <SingleBtnGroup
            label="Статус"
            options={MD.STATUSES}
            selectedValue={form.status}
            onSelect={(v) => setField("status", v)}
          />

          <Divider label="⚙️ Сістэмныя палі" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Назва для адмінки"
                value={form.templateName}
                onChange={(v) => setField("templateName", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Публічний заголовок"
                value={form.vacancydescription}
                onChange={(v) => setField("vacancydescription", v)}
              />
            </div>
            {/* Агенція— dropdown */}
            <AgencyDropdown />
            <div className="col-span-2">
              <Field
                label="Коментар по набору (напр. 2 пари + 1 жінка)"
                value={form.requirements?.genderDescription}
                onChange={(v) => setField("requirements.genderDescription", v)}
              />
            </div>
            <Field
              label="Бренд / Завод"
              value={form.brand}
              onChange={(v) => setField("brand", v)}
            />
            <Field
              label="Дата приїзду"
              value={form.arrivalDate}
              onChange={(v) => setField("arrivalDate", v)}
            />
            <Field
              label="Ключові слова"
              value={form.keywords}
              onChange={(v) => setField("keywords", v)}
            />
          </div>

          {/* КОЛЬКАСЦЬ — кнопкі */}
          <SingleBtnGroup
            label="Кількість / Хто їде"
            options={COUNT_OPTIONS}
            selectedValue={form.count}
            onSelect={(v) => setField("count", v)}
          />

          {/* ТЫП ДАГАВОРА — кнопкі + поле для custom */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Тып дагавора
            </label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-800 mb-2">
              {CONTRACT_OPTIONS.map((opt) => {
                const isActive = contractMode === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleContractSelect(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                      isActive
                        ? "bg-emerald-500 border-emerald-500 text-slate-900"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {contractMode === "other" && (
              <Field
                label="Увядзіце тып дагавора"
                value={form.contractType || ""}
                onChange={(v) => setField("contractType", v)}
              />
            )}
          </div>

          {/* КАТЭГОРЫЯ */}
          <SingleBtnGroup
            label="Катэгорыя"
            options={MD.CATEGORIES}
            selectedValue={form.category}
            onSelect={(v) => setField("category", v)}
            small
          />

          <Divider label="📍 Локація" />
          <SingleBtnGroup
            label="Ваяводства / Рэгіён"
            options={MD.VOIVODESHIPS}
            selectedValue={form.voivodeship}
            onSelect={(v) => setField("voivodeship", v)}
            small
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Горад (па-польску)"
              value={form.location}
              onChange={(v) => setField("location", v)}
            />
            <Field
              label="Горад аформлення"
              value={form.checkInCity}
              onChange={(v) => setField("checkInCity", v)}
            />
            <div className="col-span-2">
              <Field
                label="Поўны адрас"
                value={form.locationDescription}
                onChange={(v) => setField("locationDescription", v)}
              />
            </div>
            <Field
              label="Краіна"
              value={form.country}
              onChange={(v) => setField("country", v)}
            />
          </div>

          <Divider label="💰 Оплата" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Базавая стаўка"
              value={form.salary?.baseNetto}
              onChange={(v) => setField("salary.baseNetto", v)}
            />
            <Field
              label="Студэнцкая стаўка"
              value={form.salary?.studentNetto}
              onChange={(v) => setField("salary.studentNetto", v)}
            />
            <Field
              label="Гадзін у месяц"
              value={form.salary?.hoursRange}
              onChange={(v) => setField("salary.hoursRange", v)}
            />
            <Field
              label="Даты выплат"
              value={form.salary?.payoutDates}
              onChange={(v) => setField("salary.payoutDates", v)}
            />
            <div className="col-span-2">
              <Field
                label="Бонусы"
                value={form.salary?.bonusDetails}
                onChange={(v) => setField("salary.bonusDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Нататкі па аплаце"
                value={form.salary?.salaryNotes}
                onChange={(v) => setField("salary.salaryNotes", v)}
              />
            </div>
          </div>

          <Divider label="🕒 Графік" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Апісанне графіка"
                value={form.schedule?.description}
                onChange={(v) => setField("schedule.description", v)}
              />
            </div>
            <Field
              label="Колькасць змен"
              value={form.schedule?.shiftsCount}
              onChange={(v) => setField("schedule.shiftsCount", v)}
            />
            <Field
              label="Гадзін за змену"
              value={form.schedule?.hoursPerShift}
              onChange={(v) => setField("schedule.hoursPerShift", v)}
            />
            <Field
              label="Дні тыдня"
              value={form.schedule?.workDaysWeek}
              onChange={(v) => setField("schedule.workDaysWeek", v)}
            />
            <Field
              label="Перапынак"
              value={form.schedule?.breakDuration}
              onChange={(v) => setField("schedule.breakDuration", v)}
            />
          </div>

          <Divider label="🛠 Обов'язки" />
          <textarea
            value={form.description || ""}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            placeholder="Обов'язки праз кропку з коскай (;)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
          />

          <Divider label="📋 Вимоги" />
          <MultiBtnGroup
            label="Набір (Гендер)"
            options={MD.GENDERS}
            selectedValues={form.requirements.gender}
            onToggle={(v) => toggleArrayItem("requirements.gender", v)}
          />
          <MultiBtnGroup
            label="Нацыянальнасці"
            options={MD.NATIONALITIES}
            selectedValues={form.requirements.nationalities}
            onToggle={(v) => toggleArrayItem("requirements.nationalities", v)}
          />
          <MultiBtnGroup
            label="Дакументы"
            options={MD.DOCS}
            selectedValues={form.requirements.standardDocs}
            onToggle={(v) => toggleArrayItem("requirements.standardDocs", v)}
          />

          {/* УЗРОВЕНЬ ПОЛЬСКАЙ — кнопкі */}
          <SingleBtnGroup
            label="Узровень польскай"
            options={MD.LANGUAGES}
            selectedValue={form.requirements?.polishLanguageLevel}
            onSelect={(v) => setField("requirements.polishLanguageLevel", v)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Вік (напр. 18-55, до 60 років)"
              value={form.requirements?.ageMax || ""}
              onChange={(v) => setField("requirements.ageMax", v)}
              type="text"
            />

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <input
                type="checkbox"
                checked={!!form.requirements?.physicalLoad}
                onChange={(e) =>
                  setField("requirements.physicalLoad", e.target.checked)
                }
                className="w-4 h-4 accent-emerald-500"
              />
              <span className="text-xs text-slate-300 font-medium">
                Фізічна важкая праця (Так/Не)
              </span>
            </label>
            <div className="col-span-2">
              <Field
                label="Дадатковыя дакументы (тэкст)"
                value={form.requirements?.additionalDocsDetails}
                onChange={(v) =>
                  setField("requirements.additionalDocsDetails", v)
                }
              />
            </div>
          </div>

          <Divider label="🏠 Житло" />

          {/* ТЫП ЖЫТЛА — кнопкі */}
          <SingleBtnGroup
            label="Тып жытла"
            options={ACCOMMODATION_TYPE_OPTIONS}
            selectedValue={form.accommodation?.type}
            onSelect={(v) => {
              setField("accommodation.type", v);
              setField("accommodation.forCouples", v === "Надається (для пар)");
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Дэталі жытла"
                value={form.accommodation?.details}
                onChange={(v) => setField("accommodation.details", v)}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.accommodation?.withChildren}
                onChange={(e) =>
                  setField("accommodation.withChildren", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-400">З дзецьмі</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.accommodation?.withPets}
                onChange={(e) =>
                  setField("accommodation.withPets", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-400">З жывёламі</span>
            </label>
          </div>

          <Divider label="🚌 Транспорт" />
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.transport?.provided}
                onChange={(e) =>
                  setField("transport.provided", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-400">Прадастаўляецца</span>
            </label>
            <Field
              label="Кошт транспарту"
              value={form.transport?.costRaw}
              onChange={(v) => setField("transport.costRaw", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі транспарту"
                value={form.transport?.details}
                onChange={(v) => setField("transport.details", v)}
              />
            </div>
          </div>

          <Divider label="🌡 Умови праці" />

          {/* ХАРЧАВАННЕ — кнопкі */}
          <SingleBtnGroup
            label="Тып харчавання"
            options={FOOD_OPTIONS}
            selectedValue={form.conditions?.foodType}
            onSelect={(v) => setField("conditions.foodType", v)}
          />

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.conditions?.workwearFree}
                onChange={(e) =>
                  setField("conditions.workwearFree", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-400">Вопратка бясплатна</span>
            </label>
            <div className="col-span-2">
              <Field
                label="Дэталі харчавання"
                value={form.conditions?.foodDetails}
                onChange={(v) => setField("conditions.foodDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Спецыфічныя нюансы (праз коску)"
                value={form.conditions?.specificNuances}
                onChange={(v) => setField("conditions.specificNuances", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Дэталі ўмоў"
                value={form.conditions?.specificConditionsDetails}
                onChange={(v) =>
                  setField("conditions.specificConditionsDetails", v)
                }
              />
            </div>
          </div>

          <Divider label="💸 Витрати та відповідальність" />
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.startExpenses?.hasStartExpenses}
                onChange={(e) =>
                  setField("startExpenses.hasStartExpenses", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-400">Выдаткі на старце</span>
            </label>
            <div className="col-span-2">
              <Field
                label="Дэталі выдаткаў"
                value={form.startExpenses?.details}
                onChange={(v) => setField("startExpenses.details", v)}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.earlyTerminationLiability?.hasLiability}
                onChange={(e) =>
                  setField(
                    "earlyTerminationLiability.hasLiability",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-400">
                Штраф за звальненне
              </span>
            </label>
            <div className="col-span-2">
              <Field
                label="Дэталі штрафу"
                value={form.earlyTerminationLiability?.details}
                onChange={(v) =>
                  setField("earlyTerminationLiability.details", v)
                }
              />
            </div>
          </div>

          <Divider label="🎁 Компенсації" />
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.employerCompensations?.hasCompensations}
                onChange={(e) =>
                  setField(
                    "employerCompensations.hasCompensations",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <span className="text-xs text-slate-400">Ёсць кампенсацыі</span>
            </label>
            <div className="col-span-2">
              <Field
                label="Дэталі кампенсацый"
                value={form.employerCompensations?.details}
                onChange={(v) => setField("employerCompensations.details", v)}
              />
            </div>
          </div>

          <Divider label="📝 Додатково" />
          <textarea
            value={form.additionalNotes || ""}
            onChange={(e) => setField("additionalNotes", e.target.value)}
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="Дадатковыя нататкі..."
          />

          <Divider label="🔒 Для рекрутера" />
          <textarea
            value={form.forRecruiter?.internalNotes || ""}
            onChange={(e) =>
              setField("forRecruiter.internalNotes", e.target.value)
            }
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* КНОПКІ */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-bold text-sm rounded-lg transition-colors"
          >
            {saving ? "Збереження..." : "Зберегти зміни"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
}
