// frontend/src/components/templates/EditTemplateModal.jsx
import { useState } from "react";
import { updateTemplate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

export default function EditTemplateModal({ template, onClose, onSave }) {
  const [form, setForm] = useState({
    ...template,
    keywords: Array.isArray(template.keywords)
      ? template.keywords.join(", ")
      : "",
    requirements: {
      ...template.requirements,
      gender: Array.isArray(template.requirements?.gender)
        ? template.requirements.gender.join(", ")
        : template.requirements?.gender || "",
      standardDocs: Array.isArray(template.requirements?.standardDocs)
        ? template.requirements.standardDocs.join(", ")
        : template.requirements?.standardDocs || "",
      nationalities: Array.isArray(template.requirements?.nationalities)
        ? template.requirements.nationalities.join(", ")
        : template.requirements?.nationalities || "",
    },
    conditions: {
      ...template.conditions,
      specificNuances: Array.isArray(template.conditions?.specificNuances)
        ? template.conditions.specificNuances.join(", ")
        : template.conditions?.specificNuances || "",
    },
  });
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
          [parts[1]]: {
            ...next[parts[0]]?.[parts[1]],
            [parts[2]]: value,
          },
        };
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
        keywords:
          typeof form.keywords === "string"
            ? form.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : form.keywords,
        requirements: {
          ...form.requirements,
          gender:
            typeof form.requirements.gender === "string"
              ? form.requirements.gender
                  .split(",")
                  .map((g) => g.trim())
                  .filter(Boolean)
              : form.requirements.gender,
          standardDocs:
            typeof form.requirements.standardDocs === "string"
              ? form.requirements.standardDocs
                  .split(",")
                  .map((d) => d.trim())
                  .filter(Boolean)
              : form.requirements.standardDocs,
          nationalities:
            typeof form.requirements.nationalities === "string"
              ? form.requirements.nationalities
                  .split(",")
                  .map((n) => n.trim())
                  .filter(Boolean)
              : form.requirements.nationalities,
        },
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
      const res = await updateTemplate(template._id, data);
      onSave(res.data);
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
        {/* ЗАГАЛОВАК */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="font-semibold text-slate-100">
              Рэдагаванне шаблона
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              <span className="text-emerald-400 font-mono">
                {template.agencyName}
              </span>
              {" · "}
              {template.templateName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          {/* СІСТЭМНЫЯ ПАЛІ */}
          <Divider label="⚙️ Сістэмныя палі" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Агенцыя *"
              value={form.agencyName}
              onChange={(v) => setField("agencyName", v)}
            />
            <Field
              label="Назва шаблона *"
              value={form.templateName}
              onChange={(v) => setField("templateName", v)}
            />
            <div className="col-span-2">
              <Field
                label="Публічны загаловак (vacancydescription)"
                value={form.vacancydescription}
                onChange={(v) => setField("vacancydescription", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Ключавыя словы (праз коску)"
                value={form.keywords}
                onChange={(v) => setField("keywords", v)}
              />
            </div>
            <Field
              label="Катэгорыя"
              value={form.category}
              onChange={(v) => setField("category", v)}
            />
            <Field
              label="Тып дагавора"
              value={form.contractType}
              onChange={(v) => setField("contractType", v)}
            />
          </div>

          {/* ЛАКАЦЫЯ */}
          <Divider label="📍 Лакацыя" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Горад (location)"
              value={form.location}
              onChange={(v) => setField("location", v)}
            />
            <Field
              label="Горад аформлення (checkInCity)"
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
              label="Ваяводства"
              value={form.voivodeship}
              onChange={(v) => setField("voivodeship", v)}
            />
            <Field
              label="Краіна"
              value={form.country}
              onChange={(v) => setField("country", v)}
            />
          </div>

          {/* АПЛАТА */}
          <Divider label="💰 Аплата" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Базавая стаўка (baseNetto)"
              value={form.salary?.baseNetto}
              onChange={(v) => setField("salary.baseNetto", v)}
            />
            <Field
              label="Студэнцкая стаўка (studentNetto)"
              value={form.salary?.studentNetto}
              onChange={(v) => setField("salary.studentNetto", v)}
            />
            <Field
              label="Гадзін у месяц (hoursRange)"
              value={form.salary?.hoursRange}
              onChange={(v) => setField("salary.hoursRange", v)}
            />
            <Field
              label="Даты выплат (payoutDates)"
              value={form.salary?.payoutDates}
              onChange={(v) => setField("salary.payoutDates", v)}
            />
            <div className="col-span-2">
              <Field
                label="Бонусы (bonusDetails)"
                value={form.salary?.bonusDetails}
                onChange={(v) => setField("salary.bonusDetails", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Нататкі па аплаце (salaryNotes)"
                value={form.salary?.salaryNotes}
                onChange={(v) => setField("salary.salaryNotes", v)}
              />
            </div>
          </div>

          {/* ГРАФІК */}
          <Divider label="🕒 Графік" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field
                label="Апісанне графіка (description)"
                value={form.schedule?.description}
                onChange={(v) => setField("schedule.description", v)}
              />
            </div>
            <Field
              label="Колькасць змен (shiftsCount)"
              value={form.schedule?.shiftsCount}
              onChange={(v) => setField("schedule.shiftsCount", v)}
            />
            <Field
              label="Гадзін за змену (hoursPerShift)"
              value={form.schedule?.hoursPerShift}
              onChange={(v) => setField("schedule.hoursPerShift", v)}
            />
            <Field
              label="Дні тыдня (workDaysWeek)"
              value={form.schedule?.workDaysWeek}
              onChange={(v) => setField("schedule.workDaysWeek", v)}
            />
            <Field
              label="Перапынак (breakDuration)"
              value={form.schedule?.breakDuration}
              onChange={(v) => setField("schedule.breakDuration", v)}
            />
          </div>

          {/* АБАВЯЗКІ */}
          <Divider label="🛠 Абавязкі" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Апісанне (праз кропку)
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* ПАТРАБАВАННІ */}
          <Divider label="📋 Патрабаванні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Гендар (праз коску)"
              value={form.requirements?.gender}
              onChange={(v) => setField("requirements.gender", v)}
            />
            <Field
              label="Максімальны ўзрост (ageMax)"
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
                label="Дакументы (праз коску)"
                value={form.requirements?.standardDocs}
                onChange={(v) => setField("requirements.standardDocs", v)}
              />
            </div>
            <div className="col-span-2">
              <Field
                label="Нацыянальнасці (праз коску)"
                value={form.requirements?.nationalities}
                onChange={(v) => setField("requirements.nationalities", v)}
              />
            </div>
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

          {/* ЖЫТЛО */}
          <Divider label="🏠 Жытло" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Тып жытла (type)"
              value={form.accommodation?.type}
              onChange={(v) => setField("accommodation.type", v)}
            />
            <Field
              label="Кошт (costRaw)"
              value={form.accommodation?.costRaw}
              onChange={(v) => setField("accommodation.costRaw", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі"
                value={form.accommodation?.details}
                onChange={(v) => setField("accommodation.details", v)}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplForCouples"
                checked={!!form.accommodation?.forCouples}
                onChange={(e) =>
                  setField("accommodation.forCouples", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label htmlFor="tplForCouples" className="text-xs text-slate-400">
                Для пар
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplWithChildren"
                checked={!!form.accommodation?.withChildren}
                onChange={(e) =>
                  setField("accommodation.withChildren", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplWithChildren"
                className="text-xs text-slate-400"
              >
                З дзецьмі
              </label>
            </div>
          </div>

          {/* ТРАНСПАРТ */}
          <Divider label="🚌 Транспарт" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplTransportProvided"
                checked={!!form.transport?.provided}
                onChange={(e) =>
                  setField("transport.provided", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplTransportProvided"
                className="text-xs text-slate-400"
              >
                Прадастаўляецца
              </label>
            </div>
            <Field
              label="Кошт (costRaw)"
              value={form.transport?.costRaw}
              onChange={(v) => setField("transport.costRaw", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі"
                value={form.transport?.details}
                onChange={(v) => setField("transport.details", v)}
              />
            </div>
          </div>

          {/* ВЫДАТКІ */}
          <Divider label="💸 Выдаткі і адказнасць" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplHasStartExpenses"
                checked={!!form.startExpenses?.hasStartExpenses}
                onChange={(e) =>
                  setField("startExpenses.hasStartExpenses", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplHasStartExpenses"
                className="text-xs text-slate-400"
              >
                Ёсць выдаткі на старце
              </label>
            </div>
            <div className="col-span-2">
              <Field
                label="Дэталі выдаткаў на старце"
                value={form.startExpenses?.details}
                onChange={(v) => setField("startExpenses.details", v)}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplHasLiability"
                checked={!!form.earlyTerminationLiability?.hasLiability}
                onChange={(e) =>
                  setField(
                    "earlyTerminationLiability.hasLiability",
                    e.target.checked,
                  )
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplHasLiability"
                className="text-xs text-slate-400"
              >
                Ёсць штраф за датэрміновае звальненне
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

          {/* УМОВЫ ПРАЦЫ */}
          <Divider label="🌡 Умовы працы" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplWorkwearFree"
                checked={!!form.conditions?.workwearFree}
                onChange={(e) =>
                  setField("conditions.workwearFree", e.target.checked)
                }
                className="accent-emerald-500"
              />
              <label
                htmlFor="tplWorkwearFree"
                className="text-xs text-slate-400"
              >
                Вопратка бясплатна
              </label>
            </div>
            <Field
              label="Тып харчавання (foodType)"
              value={form.conditions?.foodType}
              onChange={(v) => setField("conditions.foodType", v)}
            />
            <div className="col-span-2">
              <Field
                label="Дэталі харчавання (foodDetails)"
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
                label="Дэталі ўмоў (specificConditionsDetails)"
                value={form.conditions?.specificConditionsDetails}
                onChange={(v) =>
                  setField("conditions.specificConditionsDetails", v)
                }
              />
            </div>
          </div>

          {/* КАМПЕНСАЦЫІ */}
          <Divider label="🎁 Кампенсацыі" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tplHasCompensations"
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
                htmlFor="tplHasCompensations"
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

          {/* ДАДАТКОВАЯ ІНФАРМАЦЫЯ */}
          <Divider label="📝 Дадаткова" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Дадатковыя нататкі
            </label>
            <textarea
              value={form.additionalNotes || ""}
              onChange={(e) => setField("additionalNotes", e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* КНОПКІ */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
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
