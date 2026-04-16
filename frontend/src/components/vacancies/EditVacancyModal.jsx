// frontend/src/components/vacancies/EditVacancyModal.jsx
import { useState } from "react";
import { updateVacancy } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import * as MD from "../../constants/masterData";

export default function EditVacancyModal({ vacancy, onClose, onSave }) {
  // Ініцыялізуем форму, захоўваючы ўсю структуру арыгінала
  const [form, setForm] = useState({
    ...vacancy,
    brand: vacancy.brand || "",
    voivodeship: Array.isArray(vacancy.voivodeship) ? vacancy.voivodeship : [],
    category: Array.isArray(vacancy.category) ? vacancy.category : [],
    keywords: Array.isArray(vacancy.keywords)
      ? vacancy.keywords.join(", ")
      : vacancy.keywords || "",
    requirements: {
      ...vacancy.requirements,
      gender: vacancy.requirements?.gender || "",
      standardDocs: Array.isArray(vacancy.requirements?.standardDocs)
        ? vacancy.requirements.standardDocs
        : [],
      nationalities: Array.isArray(vacancy.requirements?.nationalities)
        ? vacancy.requirements.nationalities
        : [],
      languages: Array.isArray(vacancy.requirements?.languages)
        ? vacancy.requirements.languages
        : [],
    },
    conditions: {
      ...vacancy.conditions,
      specificNuances: Array.isArray(vacancy.conditions?.specificNuances)
        ? vacancy.conditions.specificNuances.join(", ")
        : vacancy.conditions?.specificNuances || "",
    },
  });

  const [saving, setSaving] = useState(false);

  // Глыбокае абнаўленне палёў (да 3 узроўняў: напр. "salary.baseNetto")
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

  // Хэндлер для мульці-кнопак (дадаць/выдаліць з масіва)
  const toggleArrayItem = (path, value) => {
    const parts = path.split(".");
    setForm((prev) => {
      const next = { ...prev };
      let currentArr;

      if (parts.length === 1) {
        currentArr = Array.isArray(next[parts[0]]) ? next[parts[0]] : [];
        next[parts[0]] = currentArr.includes(value)
          ? currentArr.filter((v) => v !== value)
          : [...currentArr, value];
      } else {
        const parent = { ...next[parts[0]] };
        currentArr = Array.isArray(parent[parts[1]]) ? parent[parts[1]] : [];
        parent[parts[1]] = currentArr.includes(value)
          ? currentArr.filter((v) => v !== value)
          : [...currentArr, value];
        next[parts[0]] = parent;
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Падрыхтоўка даных (канвертуем тое, што павінна быць масівам)
      const data = {
        ...form,
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
                  .map((n) => n.trim())
                  .filter(Boolean)
              : form.conditions.specificNuances,
        },
      };

      const res = await updateVacancy(vacancy._id, data);
      onSave(res.data);
      onClose();
    } catch {
      alert("Памылка захавання");
    } finally {
      setSaving(false);
    }
  };

  // Дапаможны кампанент для адмалёўкі груп кнопак
  const MultiBtnGroup = ({ label, options, selectedValues, onToggle }) => (
    <div className="mb-4">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-800">
        {options.map((opt) => {
          const val = opt.value || opt;
          const lbl = opt.label || opt;
          const isActive = selectedValues?.includes(val);
          return (
            <button
              key={val}
              type="button"
              onClick={() => onToggle(val)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                isActive
                  ? "bg-emerald-500 border-emerald-500 text-slate-900 shadow-md shadow-emerald-500/20"
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 custom-scrollbar">
        {/* ЗАГАЛОВАК */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="font-semibold text-slate-100">
              Рэдагаванне вакансіі
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
          {/* СТАТУС (кнопкі замест селекта) */}
          <MultiBtnGroup
            label="Статус"
            options={MD.STATUSES}
            selectedValues={[form.status]}
            onToggle={(v) => setField("status", v)}
          />

          <Divider label="⚙️ Сістэмныя палі" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Назва для адмінкі (templateName)"
                value={form.templateName}
                onChange={(v) => setField("templateName", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Публічны загаловак"
                value={form.vacancydescription}
                onChange={(v) => setField("vacancydescription", v)}
              />
            </div>
            <Field
              label="Агенцыя"
              value={form.agencyName}
              onChange={(v) => setField("agencyName", v)}
            />
            <Field
              label="Брэнд / Завод"
              value={form.brand}
              onChange={(v) => setField("brand", v)}
            />
            <Field
              label="Тып дагавора"
              value={form.contractType}
              onChange={(v) => setField("contractType", v)}
            />
            <Field
              label="Дата прыезду"
              value={form.arrivalDate}
              onChange={(v) => setField("arrivalDate", v)}
              placeholder="напр. 20.04"
            />
            <Field
              label="Колькасць (count)"
              value={form.count}
              onChange={(v) => setField("count", v)}
            />
            <Field
              label="Ключавыя словы"
              value={form.keywords}
              onChange={(v) => setField("keywords", v)}
            />
          </div>

          <MultiBtnGroup
            label="Катэгорыя"
            options={MD.CATEGORIES}
            selectedValues={[form.category]} // Перадаем як масіў для падсветкі кнопкі
            onToggle={(v) => setField("category", v)} // Запісваем як адзіночнае значэнне (String)
          />

          <Divider label="📍 Лакацыя" />
          <MultiBtnGroup
            label="Ваяводствы"
            options={MD.VOIVODESHIPS}
            selectedValues={form.voivodeship}
            onToggle={(v) => toggleArrayItem("voivodeship", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Горад (location)"
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
                label="Поўны адрас (locationDescription)"
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

          <Divider label="💰 Аплата" />
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
            <Field
              label="Апісанне графіка"
              value={form.schedule?.description}
              onChange={(v) => setField("schedule.description", v)}
            />
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

          <Divider label="🛠 Абавязкі" />
          <textarea
            value={form.description || ""}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
          />

          <Divider label="📋 Патрабаванні" />
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
          <MultiBtnGroup
            label="Веданне моў"
            options={MD.LANGUAGES}
            selectedValues={form.requirements.languages}
            onToggle={(v) => toggleArrayItem("requirements.languages", v)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Гендар"
              value={form.requirements?.gender}
              onChange={(v) => setField("requirements.gender", v)}
            />
            <Field
              label="Макс. узрост"
              value={form.requirements?.ageMax}
              onChange={(v) => setField("requirements.ageMax", v)}
            />
            <Field
              label="Узровень польскай"
              value={form.requirements?.polishLanguageLevel}
              onChange={(v) => setField("requirements.polishLanguageLevel", v)}
            />
            <Field
              label="Фізічная нагрузка"
              value={form.requirements?.physicalLoad}
              onChange={(v) => setField("requirements.physicalLoad", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дадатковыя дакументы"
                value={form.requirements?.additionalDocsDetails}
                onChange={(v) =>
                  setField("requirements.additionalDocsDetails", v)
                }
              />
            </div>
          </div>

          <Divider label="🏠 Жытло" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Тып жытла"
              value={form.accommodation?.type}
              onChange={(v) => setField("accommodation.type", v)}
            />
            <Field
              label="Кошт"
              value={form.accommodation?.costRaw}
              onChange={(v) => setField("accommodation.costRaw", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі жытла"
                value={form.accommodation?.details}
                onChange={(v) => setField("accommodation.details", v)}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="forCouples"
                checked={!!form.accommodation?.forCouples}
                onChange={(e) =>
                  setField("accommodation.forCouples", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label htmlFor="forCouples" className="text-xs text-slate-400">
                Для пар
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="withChildren"
                checked={!!form.accommodation?.withChildren}
                onChange={(e) =>
                  setField("accommodation.withChildren", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label htmlFor="withChildren" className="text-xs text-slate-400">
                З дзецьмі
              </label>
            </div>
          </div>

          <Divider label="🚌 Транспарт" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="transportProvided"
                checked={!!form.transport?.provided}
                onChange={(e) =>
                  setField("transport.provided", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="transportProvided"
                className="text-xs text-slate-400"
              >
                Прадастаўляецца
              </label>
            </div>
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

          <Divider label="💸 Выдаткі і адказнасць" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasStartExpenses"
                checked={!!form.startExpenses?.hasStartExpenses}
                onChange={(e) =>
                  setField("startExpenses.hasStartExpenses", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="hasStartExpenses"
                className="text-xs text-slate-400"
              >
                Выдаткі на старце
              </label>
            </div>
            <div className="col-span-2">
              <Field
                label="Дэталі выдаткаў"
                value={form.startExpenses?.details}
                onChange={(v) => setField("startExpenses.details", v)}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasLiability"
                checked={!!form.earlyTerminationLiability?.hasLiability}
                onChange={(e) =>
                  setField(
                    "earlyTerminationLiability.hasLiability",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <label htmlFor="hasLiability" className="text-xs text-slate-400">
                Штраф за звальненне
              </label>
            </div>
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

          <Divider label="🌡 Умовы працы" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="workwearFree"
                checked={!!form.conditions?.workwearFree}
                onChange={(e) =>
                  setField("conditions.workwearFree", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label htmlFor="workwearFree" className="text-xs text-slate-400">
                Вопратка бясплатна
              </label>
            </div>
            <Field
              label="Тып харчавання"
              value={form.conditions?.foodType}
              onChange={(v) => setField("conditions.foodType", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі харчавання"
                value={form.conditions?.foodDetails}
                onChange={(v) => setField("conditions.foodDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Спецыфічныя нюансы"
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

          <Divider label="🎁 Кампенсацыі" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasCompensations"
                checked={!!form.employerCompensations?.hasCompensations}
                onChange={(e) =>
                  setField(
                    "employerCompensations.hasCompensations",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="hasCompensations"
                className="text-xs text-slate-400"
              >
                Ёсць кампенсацыі
              </label>
            </div>
            <div className="col-span-2">
              <Field
                label="Дэталі кампенсацый"
                value={form.employerCompensations?.details}
                onChange={(v) => setField("employerCompensations.details", v)}
              />
            </div>
          </div>

          <Divider label="📝 Дадаткова" />
          <textarea
            value={form.additionalNotes || ""}
            onChange={(e) => setField("additionalNotes", e.target.value)}
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="Дадатковыя нататкі..."
          />

          <Divider label="🔒 Для рэкрутэра" />
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
            {saving ? "Захаванне..." : "Захаваць змены"}
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
