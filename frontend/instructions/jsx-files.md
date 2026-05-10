// frontend/src/components/templates/TemplateViewModal.jsx
import React from "react";
import Divider from "../shared/Divider";
import {
MapPin,
Wallet,
Clock,
Info,
Shirt,
Check,
User,
Globe,
FileText,
Home,
Bus,
Utensils,
Tag,
} from "lucide-react";

export default function TemplateViewModal({ template, onClose, onEdit }) {
if (!template) return null;

const t = template;

return (

<div className="fixed inset-0 z-50 flex items-center justify-center">
<div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
{/_ ЗАГАЛОВАК _/}
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<div className="flex items-center gap-3 mb-1">
{t.agencyName && (
<span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20 uppercase tracking-wider font-bold">
{t.agencyName}
</span>
)}
</div>
<h2 className="font-bold text-slate-100 text-lg leading-tight">
{t.templateName}
</h2>
{t.vacancydescription &&
t.vacancydescription !== t.templateName && (
<p className="text-sm text-slate-400 mt-0.5">
{t.vacancydescription}
</p>
)}
</div>
<button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
✕
</button>
</div>

        {/* ЗМЕСТ */}
        <div className="px-6 py-5 space-y-6">
          {/* ЛАКАЦЫЯ */}
          {(t.location || t.checkInCity) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {t.location && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  <MapPin size={14} className="text-red-400" /> {t.location}
                </span>
              )}
              {t.checkInCity && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 text-xs">
                  📋 Аформленне: {t.checkInCity}
                </span>
              )}
              {t.country && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 text-xs">
                  <Globe size={12} className="text-blue-400" /> {t.country}
                </span>
              )}
            </div>
          )}

          {/* КЛЮЧАВЫЯ СЛОВЫ */}
          {t.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {t.keywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1 text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700/50"
                >
                  <Tag size={10} /> {kw}
                </span>
              ))}
            </div>
          )}

          {/* АПЛАТА */}
          {(t.salary?.baseNetto ||
            t.salary?.bonusDetails ||
            t.salary?.salaryNotes) && (
            <>
              <Divider label="💰 Аплата" />
              <div className="space-y-1.5 text-sm">
                {t.salary.baseNetto && (
                  <div className="text-slate-100 font-bold text-base flex items-center gap-2">
                    <Wallet size={16} className="text-slate-500 shrink-0" />
                    {t.salary.baseNetto}
                  </div>
                )}
                {t.salary.studentNetto && (
                  <div className="text-emerald-400/90 ml-6 font-medium">
                    Студэнты: {t.salary.studentNetto}
                  </div>
                )}
                {t.salary.hoursRange && (
                  <div className="text-slate-400 ml-6">
                    Гадзін: {t.salary.hoursRange}
                  </div>
                )}
                {t.salary.payoutDates && (
                  <div className="text-slate-400 ml-6">
                    Выплаты: {t.salary.payoutDates}
                  </div>
                )}
                {t.salary.bonusDetails && (
                  <div className="text-emerald-400 text-xs bg-emerald-500/5 py-1.5 px-3 rounded-lg mt-1 ml-6 border border-emerald-500/10">
                    🎁 {t.salary.bonusDetails}
                  </div>
                )}
                {t.salary.salaryNotes && (
                  <div className="text-amber-400/90 text-xs mt-2 italic border-l-2 border-amber-500/30 pl-3 ml-6">
                    {t.salary.salaryNotes}
                  </div>
                )}
              </div>
            </>
          )}

          {/* АБАВЯЗКІ */}
          {t.description && (
            <>
              <Divider label="🛠 Абавязкі" />
              <ul className="space-y-2">
                {t.description.split(/[.;]/).map(
                  (item, i) =>
                    item.trim() && (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <span className="text-emerald-500 mt-1 shrink-0">
                          <Check size={14} />
                        </span>
                        <span>{item.trim()}</span>
                      </li>
                    ),
                )}
              </ul>
            </>
          )}

          {/* ПАТРАБАВАННІ */}
          {(t.requirements?.gender?.length > 0 ||
            t.requirements?.ageMax ||
            t.requirements?.standardDocs?.length > 0 ||
            t.requirements?.polishLanguageLevel ||
            t.requirements?.physicalLoad) && (
            <>
              <Divider label="📋 Патрабаванні" />
              <div className="flex flex-wrap gap-2">
                {t.requirements.gender?.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <User size={12} className="text-blue-400" />
                    {Array.isArray(t.requirements.gender)
                      ? t.requirements.gender.join(", ")
                      : t.requirements.gender}
                  </span>
                )}
                {t.requirements.ageMax && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🎂 да {t.requirements.ageMax} гадоў
                  </span>
                )}
                {t.requirements.polishLanguageLevel && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🗣 {t.requirements.polishLanguageLevel}
                  </span>
                )}
                {t.requirements.standardDocs?.map((doc) => (
                  <span
                    key={doc}
                    className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20"
                  >
                    <FileText size={12} /> {doc}
                  </span>
                ))}
              </div>
              {t.requirements.physicalLoad && (
                <div className="text-xs text-slate-500 italic mt-2 pl-1">
                  {t.requirements.physicalLoad}
                </div>
              )}
            </>
          )}

          {/* ГРАФІК */}
          {(t.schedule?.description ||
            t.schedule?.workDaysWeek ||
            t.schedule?.hoursPerShift) && (
            <>
              <Divider label="🕒 Графік" />
              <div className="text-sm space-y-1.5 ml-1">
                {t.schedule.description && (
                  <div className="text-slate-300 flex items-start gap-2">
                    <Clock
                      size={16}
                      className="text-slate-500 shrink-0 mt-0.5"
                    />
                    {t.schedule.description}
                  </div>
                )}
                {t.schedule.workDaysWeek && (
                  <div className="text-slate-400 text-xs ml-6">
                    {t.schedule.workDaysWeek}
                  </div>
                )}
                {t.schedule.hoursPerShift && (
                  <div className="text-slate-400 text-xs font-mono ml-6 bg-slate-800/50 px-2 py-0.5 rounded inline-block">
                    {t.schedule.hoursPerShift}
                  </div>
                )}
                {t.schedule.breakDuration && (
                  <div className="text-slate-500 text-xs ml-6 italic">
                    Перапынак: {t.schedule.breakDuration}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ТЫП ДАГАВОРА */}
          {t.contractType && (
            <div className="text-sm text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800 inline-flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              Тып дагавора:{" "}
              <span className="text-slate-200 font-medium">
                {t.contractType}
              </span>
            </div>
          )}

          {/* ЖЫТЛО */}
          {(t.accommodation?.type || t.accommodation?.costRaw) && (
            <>
              <Divider label="🏠 Жытло" />
              <div className="text-sm space-y-1.5 ml-1">
                <div className="text-slate-300 font-medium flex items-center gap-2">
                  <Home size={16} className="text-orange-400" />
                  {t.accommodation.type}
                  {t.accommodation.forCouples && (
                    <span className="text-xs bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20 ml-1">
                      💑 Пары
                    </span>
                  )}
                </div>
                {t.accommodation.costRaw && (
                  <div className="text-slate-400 ml-6">
                    {t.accommodation.costRaw}
                  </div>
                )}
                {t.accommodation.details && (
                  <div className="text-slate-500 text-xs leading-relaxed ml-6">
                    {t.accommodation.details}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ТРАНСПАРТ */}
          {(t.transport?.provided ||
            t.transport?.costRaw ||
            t.transport?.details) && (
            <>
              <Divider label="🚌 Транспарт" />
              <div className="text-sm text-slate-300 flex items-start gap-2 ml-1">
                <Bus size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  {t.transport.costRaw && <span>{t.transport.costRaw}</span>}
                  {t.transport.details && (
                    <div className="text-slate-500 text-xs mt-0.5">
                      {t.transport.details}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ВЫДАТКІ І АДКАЗНАСЦЬ */}
          {(t.startExpenses?.hasStartExpenses ||
            t.earlyTerminationLiability?.hasLiability) && (
            <>
              <Divider label="💸 Выдаткі і адказнасць" />
              <div className="space-y-1.5 text-sm ml-1">
                {t.startExpenses?.hasStartExpenses &&
                  t.startExpenses.details && (
                    <div className="text-orange-400/80 text-xs bg-orange-500/5 px-3 py-2 rounded-lg border border-orange-500/10">
                      На старце: {t.startExpenses.details}
                    </div>
                  )}
                {t.earlyTerminationLiability?.hasLiability &&
                  t.earlyTerminationLiability.details && (
                    <div className="text-red-400/80 text-xs bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10">
                      Датэрміновае звальненне:{" "}
                      {t.earlyTerminationLiability.details}
                    </div>
                  )}
              </div>
            </>
          )}

          {/* УМОВЫ ПРАЦЫ */}
          {(t.conditions?.specificConditionsDetails ||
            t.conditions?.specificNuances?.length > 0 ||
            t.conditions?.foodType) && (
            <>
              <Divider label="🌡 Умовы працы" />
              <div className="space-y-2 text-sm ml-1">
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <Shirt size={12} className="text-orange-400" />
                    Вопратка:{" "}
                    {t.conditions.workwearFree
                      ? "Бясплатна"
                      : "За кошт работніка"}
                  </span>
                  {t.conditions.foodType && (
                    <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                      <Utensils size={12} className="text-emerald-400" />
                      {t.conditions.foodType}
                    </span>
                  )}
                </div>
                {t.conditions.specificNuances?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {t.conditions.specificNuances.map((n) => (
                      <span
                        key={n}
                        className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700/50"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                )}
                {t.conditions.specificConditionsDetails && (
                  <div className="text-slate-500 text-xs italic pl-1">
                    {t.conditions.specificConditionsDetails}
                  </div>
                )}
                {t.conditions.foodDetails && (
                  <div className="text-slate-500 text-xs italic pl-1">
                    {t.conditions.foodDetails}
                  </div>
                )}
              </div>
            </>
          )}

          {/* КАМПЕНСАЦЫІ */}
          {t.employerCompensations?.hasCompensations &&
            t.employerCompensations.details && (
              <>
                <Divider label="🎁 Кампенсацыі" />
                <div className="text-sm text-slate-300 ml-1">
                  {t.employerCompensations.details}
                </div>
              </>
            )}

          {/* ДАДАТКОВАЯ ІНФАРМАЦЫЯ */}
          {t.additionalNotes && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Info size={14} /> Дадатковая інфармацыя
              </div>
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {t.additionalNotes}
              </div>
            </div>
          )}

          {/* МЕТА */}
          <div className="text-[10px] text-slate-600 pt-4 border-t border-slate-800 flex justify-between font-mono">
            <span>ID: {t._id?.substring(t._id.length - 8).toUpperCase()}</span>
            {t.createdAt && (
              <span>
                ДАДАНА: {new Date(t.createdAt).toLocaleString("uk-UA")}
              </span>
            )}
          </div>
        </div>

        {/* КНОПКІ */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          {onEdit && (
            <button
              onClick={() => onEdit(t)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-all border border-slate-700"
            >
              ✏️ Рэдагаваць
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm rounded-lg transition-colors border border-slate-700 ml-auto"
          >
            Закрыць
          </button>
        </div>
      </div>
    </div>

);
}

---

// frontend/src/components/shared/Divider.jsx
export default function Divider({ label }) {
return (

<div className="flex items-center gap-3 my-4">
<span className="text-xs font-medium text-slate-500">{label}</span>
<div className="flex-1 h-px bg-slate-800" />
</div>
);
}

---

// frontend/src/components/shared/Field.jsx
export default function Field({
label,
value,
onChange,
placeholder,
type = "text",
}) {
return (

<div>
<label className="block text-xs text-slate-500 mb-1">{label}</label>
<input
type={type}
value={value || ""}
onChange={(e) => onChange(e.target.value)}
placeholder={placeholder}
className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
/>
</div>
);
}

---

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

export default function MultiSelect({
label,
options = [],
selected = [],
onChange,
placeholder = "Выбраць...",
}) {
const [isOpen, setIsOpen] = useState(false);
const containerRef = useRef(null);

useEffect(() => {
const handleClickOutside = (e) => {
if (containerRef.current && !containerRef.current.contains(e.target)) {
setIsOpen(false);
}
};
document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const toggleOption = (val) => {
const next = selected.includes(val)
? selected.filter((s) => s !== val)
: [...selected, val];
onChange(next);
};

return (

<div className="relative w-full" ref={containerRef}>
{label && (
<label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
{label}
</label>
)}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[38px] w-full bg-slate-800/50 border ${
          isOpen ? "border-emerald-500/50" : "border-slate-700"
        } rounded-xl px-3 py-1.5 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800`}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-slate-500 text-xs">{placeholder}</span>
          ) : (
            selected.map((val) => {
              // Шукаем аб'ект опцыі або выкарыстоўваем само значэнне
              const opt = options.find((o) => o.value === val || o === val);
              const displayLabel = opt?.label || opt || val;

              return (
                <span
                  key={val}
                  className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1"
                >
                  {displayLabel}
                  <X
                    size={10}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(val);
                    }}
                    className="hover:text-emerald-200 transition-colors"
                  />
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar p-1">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-500 italic">
              Няма варыянтаў
            </div>
          ) : (
            options.map((opt) => {
              const val = opt.value || opt;
              const lbl = opt.label || opt;
              const isSelected = selected.includes(val);

              return (
                <div
                  key={val}
                  onClick={() => toggleOption(val)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-600"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-slate-900 text-[10px]">✓</span>
                    )}
                  </div>
                  <span className="truncate">{lbl}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>

);
}

---

// frontend/src/components/candidates/ProfileModal.jsx
import { useEffect, useState } from "react";
import {
getCandidate,
updateCandidate,
addCandidateHistory,
matchVacanciesForCandidate,
} from "../../services/api";
import Divider from "../shared/Divider";
import EditCandidateModal from "./EditCandidateModal";

const STATUS_COLORS = {
new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
waiting: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
employed: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
left: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
blacklist: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATUS_LABELS = {
new: "Новы",
active: "Актыўны",
waiting: "Чакае",
employed: "Працуе",
left: "Сышоў",
blacklist: "Блэкліст",
};

export default function ProfileModal({ candidateId, onClose, onUpdate }) {
const [candidate, setCandidate] = useState(null);
const [loading, setLoading] = useState(true);
const [newNote, setNewNote] = useState("");
const [addingNote, setAddingNote] = useState(false);
const [editStatus, setEditStatus] = useState(false);
const [showEdit, setShowEdit] = useState(false);
const [matchedVacancies, setMatchedVacancies] = useState(null);
const [matchLoading, setMatchLoading] = useState(false);

const handleMatch = async () => {
setMatchLoading(true);
try {
const res = await matchVacanciesForCandidate(candidate.\_id);
setMatchedVacancies(res.data);
} catch {
alert("Памылка матчынгу");
} finally {
setMatchLoading(false);
}
};
useEffect(() => {
const load = async () => {
try {
const res = await getCandidate(candidateId);
setCandidate(res.data);
} catch {
console.error("Памылка загрузкі профілю");
} finally {
setLoading(false);
}
};
load();
}, [candidateId]);

const handleStatusChange = async (newStatus) => {
try {
const res = await updateCandidate(candidate.\_id, { status: newStatus });
setCandidate(res.data);
onUpdate(res.data);
setEditStatus(false);
} catch {
alert("Памылка змены статусу");
}
};

const handleAddNote = async () => {
if (!newNote.trim()) return;
setAddingNote(true);
try {
const res = await addCandidateHistory(candidate.\_id, {
type: "note",
text: newNote,
});
setCandidate(res.data);
setNewNote("");
} catch {
alert("Памылка дадання нататкі");
} finally {
setAddingNote(false);
}
};

const handleSaveEdit = (updated) => {
setCandidate(updated);
onUpdate(updated);
setShowEdit(false);
};

return (
<>

<div className="fixed inset-0 z-50 flex items-center justify-center">
<div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
{/_ Загаловак _/}
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<h2 className="font-semibold text-slate-100">Профіль кандыдата</h2>
<div className="flex items-center gap-2">
<button
onClick={() => setShowEdit(true)}
className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors" >
✏️ Рэдагаваць
</button>
<button
                onClick={handleMatch}
                disabled={matchLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors disabled:opacity-50"
              >
🎯 {matchLoading ? "Пошук..." : "Вакансіі"}
</button>
<button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
✕
</button>
</div>
</div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Загрузка...</div>
          ) : !candidate ? (
            <div className="p-8 text-center text-slate-500">Не знойдзена</div>
          ) : (
            <div className="px-6 py-5 space-y-5">
              {/* Асноўная інфа */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-100">
                    {candidate.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                    {candidate.contactType === "telegram" &&
                      candidate.telegram && (
                        <span>✈️ {candidate.telegram}</span>
                      )}
                    {(candidate.contactType === "viber" ||
                      candidate.contactType === "phone") &&
                      candidate.phone && <span>📞 {candidate.phone}</span>}
                    {candidate.nationality && (
                      <span>🌍 {candidate.nationality}</span>
                    )}
                    {candidate.currentLocation && (
                      <span>📍 {candidate.currentLocation}</span>
                    )}
                    {candidate.age && <span>🎂 {candidate.age} г.</span>}
                    {candidate.gender && (
                      <span>
                        {candidate.gender === "female"
                          ? "👩 Жанчына"
                          : "👨 Мужчына"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Статус */}
                <div className="shrink-0">
                  {editStatus ? (
                    <div className="flex flex-col gap-1">
                      {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                        <button
                          key={val}
                          onClick={() => handleStatusChange(val)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors text-left ${
                            candidate.status === val
                              ? "bg-emerald-500 text-slate-900"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                      <button
                        onClick={() => setEditStatus(false)}
                        className="text-xs text-slate-600 mt-1 text-center"
                      >
                        Адмена
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditStatus(true)}
                      className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer ${STATUS_COLORS[candidate.status]}`}
                    >
                      {STATUS_LABELS[candidate.status]} ▾
                    </button>
                  )}
                </div>
              </div>

              {/* Мета-інфа */}
              <div className="flex gap-4 text-xs text-slate-600">
                <span>
                  📅{" "}
                  {new Date(candidate.createdAt).toLocaleString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>
                  {candidate.source === "site"
                    ? "🌐 Сайт"
                    : candidate.source === "telegram_bot"
                      ? "✈️ Telegram"
                      : "✋ Ручны"}
                </span>
              </div>

              {/* Нататкі рэкрутэра */}
              {candidate.notes && (
                <>
                  <Divider label="📝 Нататкі" />
                  <p className="text-sm text-slate-400 bg-slate-800 rounded-lg px-3 py-2">
                    {candidate.notes}
                  </p>
                </>
              )}

              {/* Пажаданні */}
              {candidate.jobPreferences && (
                <>
                  <Divider label="🔍 Пажаданні да працы" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {candidate.jobPreferences.locationFlexible ? (
                      <div className="text-slate-400">
                        📍 Гатовы да пераезду
                      </div>
                    ) : candidate.jobPreferences.location ? (
                      <div className="text-slate-400">
                        📍 {candidate.jobPreferences.location}
                      </div>
                    ) : null}
                    {candidate.jobPreferences.readyDate && (
                      <div className="text-slate-400">
                        📅 Гатовы з: {candidate.jobPreferences.readyDate}
                      </div>
                    )}
                    {candidate.jobPreferences.needsAccommodation && (
                      <div className="text-slate-400">🏠 Патрэбна жытло</div>
                    )}
                    {candidate.jobPreferences.travelGroup && (
                      <div className="text-slate-400">
                        👥{" "}
                        {candidate.jobPreferences.travelGroup === "alone"
                          ? "Адзін/а"
                          : candidate.jobPreferences.travelGroup === "couple"
                            ? "Пара"
                            : "З сям'ёй"}
                      </div>
                    )}
                    {candidate.jobPreferences.schedule?.length > 0 && (
                      <div className="text-slate-400">
                        ⏰ {candidate.jobPreferences.schedule.join(", ")}
                      </div>
                    )}
                    {candidate.jobPreferences.contractType && (
                      <div className="text-slate-400">
                        📄 {candidate.jobPreferences.contractType}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Дакументы */}
              {candidate.documents && (
                <>
                  <Divider label="📄 Дакументы" />
                  <div className="flex gap-3 flex-wrap">
                    {[
                      [candidate.documents.hasVisa, "Віза"],
                      [candidate.documents.hasSanepid, "Санепід"],
                      [candidate.documents.hasUDT, "UDT"],
                    ].map(([has, label]) => (
                      <span
                        key={label}
                        className={`text-xs px-2 py-1 rounded-lg ${
                          has
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-600"
                        }`}
                      >
                        {has ? "✅" : "❌"} {label}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Заяўкі на вакансіі */}
              {candidate.appliedVacancies?.length > 0 && (
                <>
                  <Divider label="💼 Заяўкі на вакансіі" />
                  <div className="space-y-2">
                    {candidate.appliedVacancies.map((av, i) => (
                      <div
                        key={i}
                        className="bg-slate-800 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="text-slate-300">
                          {av.type === "want_work"
                            ? "🟢 Хоча працаваць"
                            : "💬 Хоча дэталі"}
                        </span>
                        {av.vacancyId?.title && (
                          <span className="text-slate-500 ml-2">
                            — {av.vacancyId.title}
                          </span>
                        )}
                        {av.vacancyId?.vacancyCode && (
                          <span className="text-slate-600 ml-2 font-mono text-xs">
                            ({av.vacancyId.vacancyCode})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* Матчынг вакансій */}
              {matchedVacancies !== null && (
                <>
                  <Divider label="🎯 Падыходзячыя вакансіі" />
                  {matchedVacancies.length === 0 ? (
                    <p className="text-xs text-slate-600">
                      Падыходзячых вакансій не знойдзена
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {matchedVacancies.map((v) => (
                        <div
                          key={v._id}
                          className="bg-slate-800 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-slate-200 font-medium">
                                {v.title}
                              </span>
                              {v.vacancyCode && (
                                <span className="text-xs font-mono text-slate-500 ml-2">
                                  ({v.vacancyCode})
                                </span>
                              )}
                            </div>
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                              ⭐ {v.matchScore}
                            </span>
                          </div>
                          <div className="flex gap-3 mt-1 text-xs text-slate-500">
                            <span>📍 {v.location}</span>
                            {v.agencyName && <span>🏢 {v.agencyName}</span>}
                            {v.salary?.base && <span>💰 {v.salary.base}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {/* Гісторыя */}
              <Divider label="🗂 Гісторыя зносін" />
              <div className="space-y-2 mb-3">
                {!candidate.history?.length ? (
                  <p className="text-xs text-slate-600">Гісторыя пустая</p>
                ) : (
                  [...candidate.history].reverse().map((h, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500">
                          {new Date(h.date).toLocaleString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                          {h.type === "call"
                            ? "📞 Званок"
                            : h.type === "chat"
                              ? "💬 Чат"
                              : "📝 Нататка"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{h.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Дадаць нататку */}
              <div className="flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Дадаць нататку..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
                >
                  Дадаць
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Мадалка рэдагавання */}
      {showEdit && candidate && (
        <EditCandidateModal
          candidate={candidate}
          onClose={() => setShowEdit(false)}
          onSave={handleSaveEdit}
        />
      )}
    </>

);
}

---

// frontend/src/components/candidates/EditCandidateModal.jsx
import { useState } from "react";
import { updateCandidate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

const STATUS_LABELS = {
new: "Новы",
active: "Актыўны",
waiting: "Чакае",
employed: "Працуе",
left: "Сышоў",
blacklist: "Блэкліст",
};

export default function EditCandidateModal({ candidate, onClose, onSave }) {
const [form, setForm] = useState({
name: candidate.name || "",
contactType: candidate.contactType || "telegram",
telegram: candidate.telegram || "",
phone: candidate.phone || "",
nationality: candidate.nationality || "",
currentLocation: candidate.currentLocation || "",
age: candidate.age || "",
gender: candidate.gender || "",
status: candidate.status || "new",
notes: candidate.notes || "",
blacklistReason: candidate.blacklistReason || "",
jobPreferences: {
location: candidate.jobPreferences?.location || "",
locationFlexible: candidate.jobPreferences?.locationFlexible || false,
schedule: candidate.jobPreferences?.schedule || [],
contractType: candidate.jobPreferences?.contractType || "any",
needsAccommodation: candidate.jobPreferences?.needsAccommodation || false,
travelGroup: candidate.jobPreferences?.travelGroup || "alone",
readyDate: candidate.jobPreferences?.readyDate || "",
notes: candidate.jobPreferences?.notes || "",
},
documents: {
hasVisa: candidate.documents?.hasVisa || false,
hasSanepid: candidate.documents?.hasSanepid || false,
hasUDT: candidate.documents?.hasUDT || false,
other: candidate.documents?.other || [],
},
});
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

const toggleSchedule = (val) => {
setForm((prev) => {
const cur = prev.jobPreferences.schedule;
const next = cur.includes(val)
? cur.filter((s) => s !== val)
: [...cur, val];
return {
...prev,
jobPreferences: { ...prev.jobPreferences, schedule: next },
};
});
};

const handleSave = async () => {
if (!form.name.trim()) return alert("Увядзіце імя");
setSaving(true);
try {
const res = await updateCandidate(candidate.\_id, {
...form,
age: form.age ? Number(form.age) : undefined,
});
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
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<h2 className="font-semibold text-slate-100">
Рэдагаванне кандыдата
</h2>
<p className="text-xs text-slate-500 mt-0.5">{candidate.name}</p>
</div>
<button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
✕
</button>
</div>

        <div className="px-6 py-5 space-y-4">
          <Field
            label="Імя і прозвішча *"
            value={form.name}
            onChange={(v) => setField("name", v)}
          />

          <Divider label="📞 Сувязь" />
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              Спосаб сувязі
            </label>
            <div className="flex gap-2 mb-3">
              {["telegram", "viber", "phone"].map((ct) => (
                <button
                  key={ct}
                  onClick={() => setField("contactType", ct)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.contactType === ct
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {ct === "telegram"
                    ? "✈️ Telegram"
                    : ct === "viber"
                      ? "📱 Viber"
                      : "📞 Тэлефон"}
                </button>
              ))}
            </div>
            {form.contactType === "telegram" ? (
              <Field
                label="Telegram username"
                value={form.telegram}
                onChange={(v) => setField("telegram", v)}
                placeholder="@username"
              />
            ) : (
              <Field
                label="Нумар тэлефона"
                value={form.phone}
                onChange={(v) => setField("phone", v)}
                placeholder="+380XXXXXXXXX"
              />
            )}
          </div>

          <Divider label="👤 Асабістыя дадзеныя" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Нацыянальнасць"
              value={form.nationality}
              onChange={(v) => setField("nationality", v)}
            />
            <Field
              label="Дзе знаходзіцца"
              value={form.currentLocation}
              onChange={(v) => setField("currentLocation", v)}
            />
            <Field
              label="Узрост"
              value={form.age}
              type="number"
              onChange={(v) => setField("age", v)}
            />
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Гендар
              </label>
              <div className="flex gap-2">
                {[
                  ["male", "👨 Мужчына"],
                  ["female", "👩 Жанчына"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setField("gender", val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.gender === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Статус</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setField("status", val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.status === val
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Прычына блэкліста */}
          {form.status === "blacklist" && (
            <Field
              label="Прычына блэкліста"
              value={form.blacklistReason}
              onChange={(v) => setField("blacklistReason", v)}
              placeholder="Апішыце прычыну..."
            />
          )}

          <Divider label="🔍 Пажаданні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Дзе шукае працу"
              value={form.jobPreferences.location}
              onChange={(v) => setField("jobPreferences.location", v)}
            />
            <Field
              label="Гатовы з"
              value={form.jobPreferences.readyDate}
              onChange={(v) => setField("jobPreferences.readyDate", v)}
              placeholder="01.05.2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Гатовы да пераезду
              </label>
              <div className="flex gap-2">
                {[
                  ["true", "Так"],
                  ["false", "Не"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setField(
                        "jobPreferences.locationFlexible",
                        val === "true",
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      String(form.jobPreferences.locationFlexible) === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Патрэбна жытло
              </label>
              <div className="flex gap-2">
                {[
                  ["true", "Так"],
                  ["false", "Не"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setField(
                        "jobPreferences.needsAccommodation",
                        val === "true",
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      String(form.jobPreferences.needsAccommodation) === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Еду</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["alone", "Адзін/а"],
                  ["couple", "Пара"],
                  ["family", "Сям'я"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setField("jobPreferences.travelGroup", val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.jobPreferences.travelGroup === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Графік
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["1_shift", "1 зм."],
                  ["2_shifts", "2 зм."],
                  ["3_shifts", "3 зм."],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => toggleSchedule(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.jobPreferences.schedule.includes(val)
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Divider label="📄 Дакументы" />
          <div className="flex gap-4 flex-wrap">
            {[
              ["hasVisa", "Віза"],
              ["hasSanepid", "Санепід"],
              ["hasUDT", "UDT"],
            ].map(([key, lbl]) => (
              <button
                key={key}
                onClick={() =>
                  setField(`documents.${key}`, !form.documents[key])
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  form.documents[key]
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {form.documents[key] ? "✅" : "❌"} {lbl}
              </button>
            ))}
          </div>

          <Divider label="📝 Нататкі" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Нататкі рэкрутэра
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={3}
              placeholder="Любая дадатковая інфармацыя..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

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

---

// frontend/src/components/candidates/CandidateFilters.jsx
import { EMPTY_CANDIDATE_FILTERS } from "../../constants/filters";

const SPHERES = [
{ value: "warehouse", label: "Склад" },
{ value: "food_production", label: "Харчаванне" },
{ value: "automotive", label: "Аўтазавод" },
{ value: "agriculture", label: "Сельская гаспадарка" },
{ value: "retail", label: "Магазін" },
{ value: "other", label: "Іншае" },
];

function Section({ label, children }) {
return (

<div className="mb-5">
<p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
{label}
</p>
{children}
</div>
);
}

function MultiBtn({ value, label, active, onClick }) {
return (
<button
onClick={() => onClick(value)}
className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors mb-1 mr-1 ${
        active
          ? "bg-emerald-500 text-slate-900"
          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
      }`} >
{label}
</button>
);
}

export default function CandidateFilters({ draft, onChange }) {
const toggle = (key, value) => {
const cur = draft[key];
const next = cur.includes(value)
? cur.filter((v) => v !== value)
: [...cur, value];
onChange({ ...draft, [key]: next });
};

const activeCount = Object.entries(draft).filter(([k, v]) => {
if (k === "search") return v.length > 0;
if (k === "status") return v !== "";
return Array.isArray(v) && v.length > 0;
}).length;

return (

<div className="h-full overflow-y-auto px-4 py-5">
{/_ Пошук _/}
<Section label="Пошук">
<div className="relative">
<input
type="text"
value={draft.search}
onChange={(e) => onChange({ ...draft, search: e.target.value })}
placeholder="Імя, тэлефон, горад..."
className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
/>
{draft.search && (
<button
onClick={() => onChange({ ...draft, search: "" })}
className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs" >
✕
</button>
)}
</div>
</Section>

      {/* Статус */}
      <Section label="Статус">
        <div className="flex flex-wrap">
          {[
            { value: "", label: "Усе" },
            { value: "new", label: "Новы" },
            { value: "active", label: "Актыўны" },
            { value: "waiting", label: "Чакае" },
            { value: "employed", label: "Працуе" },
            { value: "left", label: "Сышоў" },
            { value: "blacklist", label: "Блэкліст" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => onChange({ ...draft, status: s.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors mb-1 mr-1 ${
                draft.status === s.value
                  ? "bg-emerald-500 text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Гендар */}
      <Section label="Гендар">
        <div className="flex flex-wrap">
          {[
            { value: "female", label: "👩 Жанчыны" },
            { value: "male", label: "👨 Мужчыны" },
          ].map((g) => (
            <MultiBtn
              key={g.value}
              value={g.value}
              label={g.label}
              active={draft.gender.includes(g.value)}
              onClick={(v) => toggle("gender", v)}
            />
          ))}
        </div>
      </Section>

      {/* Нацыянальнасць */}
      <Section label="Нацыянальнасць">
        <div className="flex flex-wrap">
          {[
            { value: "Україна", label: "🇺🇦 Украіна" },
            { value: "Молдова", label: "🇲🇩 Малдова" },
            { value: "Білорусь", label: "🇧🇾 Беларусь" },
          ].map((n) => (
            <MultiBtn
              key={n.value}
              value={n.value}
              label={n.label}
              active={draft.nationality.includes(n.value)}
              onClick={(v) => toggle("nationality", v)}
            />
          ))}
        </div>
      </Section>

      {/* Сфера */}
      <Section label="Сфера">
        <div className="flex flex-wrap">
          {SPHERES.map((s) => (
            <MultiBtn
              key={s.value}
              value={s.value}
              label={s.label}
              active={draft.sphere.includes(s.value)}
              onClick={(v) => toggle("sphere", v)}
            />
          ))}
        </div>
      </Section>

      {/* Лакацыя */}
      <Section label="Лакацыя">
        <div className="flex flex-wrap">
          {[
            { value: "city", label: "📍 Канкрэтны горад" },
            { value: "city_area", label: "🏘 Горад + 50км" },
            { value: "region", label: "🗺 Рэгіён/ваяводства" },
            { value: "any", label: "✈️ Без розніцы" },
          ].map((l) => (
            <MultiBtn
              key={l.value}
              value={l.value}
              label={l.label}
              active={draft.location.includes(l.value)}
              onClick={(v) => toggle("location", v)}
            />
          ))}
        </div>
      </Section>

      {/* Жытло */}
      <Section label="Жытло">
        <div className="flex flex-wrap">
          {[
            { value: "needs", label: "🏠 Патрэбна жытло" },
            { value: "own", label: "❌ Сваё жытло" },
          ].map((a) => (
            <MultiBtn
              key={a.value}
              value={a.value}
              label={a.label}
              active={draft.accommodation.includes(a.value)}
              onClick={(v) => toggle("accommodation", v)}
            />
          ))}
        </div>
      </Section>

      {/* Група */}
      <Section label="Еду">
        <div className="flex flex-wrap">
          {[
            { value: "alone", label: "👤 Адзін/а" },
            { value: "couple", label: "👫 Пара" },
            { value: "family", label: "👨‍👩‍👧 Сям'я" },
          ].map((g) => (
            <MultiBtn
              key={g.value}
              value={g.value}
              label={g.label}
              active={draft.travelGroup.includes(g.value)}
              onClick={(v) => toggle("travelGroup", v)}
            />
          ))}
        </div>
      </Section>

      {/* Графік */}
      <Section label="Графік">
        <div className="flex flex-wrap">
          {[
            { value: "1_shift", label: "1 змена" },
            { value: "2_shifts", label: "2 змены" },
            { value: "3_shifts", label: "3 змены" },
          ].map((s) => (
            <MultiBtn
              key={s.value}
              value={s.value}
              label={s.label}
              active={draft.schedule.includes(s.value)}
              onClick={(v) => toggle("schedule", v)}
            />
          ))}
        </div>
      </Section>

      {/* Дакументы */}
      <Section label="Дакументы">
        <div className="flex flex-wrap">
          {[
            { value: "visa", label: "Віза/Пабыт" },
            { value: "sanepid", label: "Санепід" },
            { value: "udt", label: "UDT" },
          ].map((d) => (
            <MultiBtn
              key={d.value}
              value={d.value}
              label={d.label}
              active={draft.docs.includes(d.value)}
              onClick={(v) => toggle("docs", v)}
            />
          ))}
        </div>
      </Section>

      {/* Крыніца */}
      <Section label="Крыніца">
        <div className="flex flex-wrap">
          {[
            { value: "site", label: "🌐 Сайт" },
            { value: "manual", label: "✋ Ручны" },
            { value: "telegram_bot", label: "✈️ Telegram" },
          ].map((s) => (
            <MultiBtn
              key={s.value}
              value={s.value}
              label={s.label}
              active={draft.source.includes(s.value)}
              onClick={(v) => toggle("source", v)}
            />
          ))}
        </div>
      </Section>

      {/* Скінуць */}
      {activeCount > 0 && (
        <button
          onClick={() => onChange(EMPTY_CANDIDATE_FILTERS)}
          className="w-full mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors"
        >
          Скінуць усе фільтры ({activeCount})
        </button>
      )}
    </div>

);
}

---

// frontend/src/components/candidates/AddCandidateModal.jsx
import { useState } from "react";
import { createCandidate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

const STATUS_LABELS = {
new: "Новы",
active: "Актыўны",
waiting: "Чакае",
employed: "Працуе",
left: "Сышоў",
blacklist: "Блэкліст",
};

const EMPTY_FORM = {
name: "",
contactType: "telegram",
telegram: "",
phone: "",
nationality: "",
currentLocation: "",
age: "",
gender: "",
status: "new",
source: "manual",
notes: "",
jobPreferences: {
location: "",
locationFlexible: false,
schedule: [],
contractType: "any",
needsAccommodation: false,
travelGroup: "alone",
readyDate: "",
},
documents: {
hasVisa: false,
hasSanepid: false,
hasUDT: false,
},
};

export default function AddCandidateModal({ onClose, onAdd }) {
const [form, setForm] = useState(EMPTY_FORM);
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

const toggleSchedule = (val) => {
setForm((prev) => {
const cur = prev.jobPreferences.schedule;
const next = cur.includes(val)
? cur.filter((s) => s !== val)
: [...cur, val];
return {
...prev,
jobPreferences: { ...prev.jobPreferences, schedule: next },
};
});
};

const handleSave = async () => {
if (!form.name.trim()) return alert("Увядзіце імя");
setSaving(true);
try {
const res = await createCandidate({
...form,
age: form.age ? Number(form.age) : undefined,
});
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
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<h2 className="font-semibold text-slate-100">Новы кандыдат</h2>
<button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
✕
</button>
</div>

        <div className="px-6 py-5 space-y-4">
          <Field
            label="Імя і прозвішча *"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="Іван Іваноў"
          />

          <Divider label="📞 Сувязь" />
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              Спосаб сувязі
            </label>
            <div className="flex gap-2 mb-3">
              {["telegram", "viber", "phone"].map((ct) => (
                <button
                  key={ct}
                  onClick={() => setField("contactType", ct)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.contactType === ct
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {ct === "telegram"
                    ? "✈️ Telegram"
                    : ct === "viber"
                      ? "📱 Viber"
                      : "📞 Тэлефон"}
                </button>
              ))}
            </div>
            {form.contactType === "telegram" ? (
              <Field
                label="Telegram username"
                value={form.telegram}
                onChange={(v) => setField("telegram", v)}
                placeholder="@username"
              />
            ) : (
              <Field
                label="Нумар тэлефона"
                value={form.phone}
                onChange={(v) => setField("phone", v)}
                placeholder="+380XXXXXXXXX"
              />
            )}
          </div>

          <Divider label="👤 Асабістыя дадзеныя" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Нацыянальнасць"
              value={form.nationality}
              onChange={(v) => setField("nationality", v)}
              placeholder="Украіна"
            />
            <Field
              label="Дзе знаходзіцца"
              value={form.currentLocation}
              onChange={(v) => setField("currentLocation", v)}
              placeholder="Кіеў"
            />
            <Field
              label="Узрост"
              value={form.age}
              type="number"
              onChange={(v) => setField("age", v)}
            />
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Гендар
              </label>
              <div className="flex gap-2">
                {[
                  ["male", "👨 Мужчына"],
                  ["female", "👩 Жанчына"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setField("gender", val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.gender === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Статус</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setField("status", val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.status === val
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <Divider label="🔍 Пажаданні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Дзе шукае працу"
              value={form.jobPreferences.location}
              onChange={(v) => setField("jobPreferences.location", v)}
              placeholder="Варшава"
            />
            <Field
              label="Гатовы з"
              value={form.jobPreferences.readyDate}
              onChange={(v) => setField("jobPreferences.readyDate", v)}
              placeholder="01.05.2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Патрэбна жытло
              </label>
              <div className="flex gap-2">
                {[
                  ["true", "Так"],
                  ["false", "Не"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setField(
                        "jobPreferences.needsAccommodation",
                        val === "true",
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      String(form.jobPreferences.needsAccommodation) === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">Еду</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["alone", "Адзін/а"],
                  ["couple", "Пара"],
                  ["family", "Сям'я"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setField("jobPreferences.travelGroup", val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.jobPreferences.travelGroup === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Графік</label>
            <div className="flex gap-2">
              {[
                ["1_shift", "1 змена"],
                ["2_shifts", "2 змены"],
                ["3_shifts", "3 змены"],
              ].map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => toggleSchedule(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.jobPreferences.schedule.includes(val)
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <Divider label="📄 Дакументы" />
          <div className="flex gap-4 flex-wrap">
            {[
              ["hasVisa", "Віза"],
              ["hasSanepid", "Санепід"],
              ["hasUDT", "UDT"],
            ].map(([key, lbl]) => (
              <button
                key={key}
                onClick={() =>
                  setField(`documents.${key}`, !form.documents[key])
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  form.documents[key]
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {form.documents[key] ? "✅" : "❌"} {lbl}
              </button>
            ))}
          </div>

          <Divider label="📝 Нататкі" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Нататкі рэкрутэра
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={3}
              placeholder="Любая дадатковая інфармацыя..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            {saving ? "Захаванне..." : "Захаваць"}
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

---

✅ Userbot аўтарызаваны як: @InnaNovaWork
Menu
🎧 Userbot слухае паведамленні...
==> Your service is live 🎉
==>
==> ///////////////////////////////////////////////////////////
==>
==> Available at your primary URL https://job-vacancy-crm-backend.onrender.com
==>
==> ///////////////////////////////////////////////////////////
⚠️ Бот ужо запушчаны ў іншым месцы
🕒 Heartbeat OK
--- 👤 РУЧНЫ ПАРСІНГ: Напрамую ў Stage 2 (Groq) ---
🤖 Парсінг v2.0 ...
🤖 Запыт да Gemini: gemini-2.5-flash-lite
🤖 Форматаванне Telegram-посту...
🤖 Запыт да Gemini: gemini-2.5-flash-lite
✅ Вакансія адпраўлена ў Telegram (Markdown)
Cleaned up duplicates for hash: ольштинoctimвиробництвосоусівкетчупівмайонезівгірчицітаоцту2місцядляжінокна1805ставкаumowazlecenie2536злгоднеттоставкастудента3140неттомісцезнаходження11015olsztynek35кмвідмістаольштинобовязкивиконанняробітнавиробничійлінівстановленнятазняттятоварузлініконтрольякостіпродукцінаклеюванняетикетокнапродукціюпідготовкакартоннихкоробокдляпакуваннятоварівпакуванняготовопродукцізгіднозінструкціямиобслуговуванняобладнанняналаштуванняочищеннятапереналаштуваннявиробничихмашинроботазтехнікоюдлязмішуваннярозливупропарюваннямаркуваннязварюваннятатранспортуванняпродукцівмежахвиробничогопроцесутранспортуваннясировинитаготовопродукцізіскладутанаскладвручнуабозадопомогоюнавантажувачіврозташуваннясировинитапакувальнихматеріалівувиробничихприміщенняхсортуваннятазберіганнявідходівпобутовихмакулатурифольгиканістрпісляхімічнихречовинсортуваннятаскладанняпіддонівдляподальшоговикористанняграфікроботизпонеділкапопятницюзміни60014001400220022000600вимогидокандидатівчоловікивід18роківнаціональністьтількиукранціпольськамованакомунікативномурівніоплатазапроживанняпершиймісяць18злдоба20злдляпариздругого2666злотихдобаможливийдозддороботивзалежностівідмісцяпроживаннядодатковаінформаціявартістьмедичнихоглядівsanepid200злутримутьсяіззарплатиробочийодягтавзуттянадаютьсябезкоштовноконо
==> Detected service running on port 10000
==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
🕒 Heartbeat OK
📨 [Посередники APOLO] (ID: -1003863670200) 45 сімв.: "доброго вечора. чи є вакансія ДПД у Вроцлаві?..."
📡 RAW PUSH: ад "Посередники APOLO" (ID: -1003863670200) | Тэкст: доброго вечора. чи є вакансія ...
🗑️ Адхілена (Noise/Regex) ад "Посередники APOLO": "доброго вечора. чи є вакансія ДПД у Вроцлаві?..."
🚀 Server: http://localhost:10000
🤖 Запуск Telegram userbot (child process)...
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
⚠️ Бот ужо запушчаны ў іншым месцы
✅ MongoDB Connected
🤖 Запуск Telegram userbot...
[2026-05-10T16:28:01.587] [INFO] - [Running gramJS version 2.26.21]
[2026-05-10T16:28:01.590] [INFO] - [Connecting to 149.154.167.91:80/TCPFull...]
[2026-05-10T16:28:01.600] [INFO] - [Connection to 149.154.167.91:80/TCPFull complete!]
[2026-05-10T16:28:01.601] [INFO] - [Using LAYER 198 for initial connect]
✅ Userbot аўтарызаваны як: @InnaNovaWork
Menu
🎧 Userbot слухае паведамленні...
==> Your service is live 🎉
==>
==> ///////////////////////////////////////////////////////////
==>
==> Available at your primary URL https://job-vacancy-crm-backend.onrender.com
==>
==> ///////////////////////////////////////////////////////////
🕒 Heartbeat OK
--- 👤 РУЧНЫ ПАРСІНГ: Напрамую ў Stage 2 (Groq) ---
🤖 Парсінг v2.0 ...
🤖 Запыт да Gemini: gemini-2.5-flash-lite
🤖 Форматаванне Telegram-посту...
🤖 Запыт да Gemini: gemini-2.5-flash-lite
✅ Вакансія адпраўлена ў Telegram (Markdown)
Cleaned up duplicates for hash: ольштинoctimвиробництвосоусівкетчупівмайонезівгірчицітаоцту2місцядляжінокна1805ставкаumowazlecenie2536злгоднеттоставкастудента3140неттомісцезнаходження11015olsztynek35кмвідмістаольштинобовязкивиконанняробітнавиробничійлінівстановленнятазняттятоварузлініконтрольякостіпродукцінаклеюванняетикетокнапродукціюпідготовкакартоннихкоробокдляпакуваннятоварівпакуванняготовопродукцізгіднозінструкціямиобслуговуванняобладнанняналаштуванняочищеннятапереналаштуваннявиробничихмашинроботазтехнікоюдлязмішуваннярозливупропарюваннямаркуваннязварюваннятатранспортуванняпродукцівмежахвиробничогопроцесутранспортуваннясировинитаготовопродукцізіскладутанаскладвручнуабозадопомогоюнавантажувачіврозташуваннясировинитапакувальнихматеріалівувиробничихприміщенняхсортуваннятазберіганнявідходівпобутовихмакулатурифольгиканістрпісляхімічнихречовинсортуваннятаскладанняпіддонівдляподальшоговикористанняграфікроботизпонеділкапопятницюзміни60014001400220022000600вимогидокандидатівчоловікивід18роківнаціональністьтількиукранціпольськамованакомунікативномурівніоплатазапроживанняпершиймісяць18злдоба20злдляпариздругого2666злотихдобаможливийдозддороботивзалежностівідмісцяпроживаннядодатковаінформаціявартістьмедичнихоглядівsanepid200злутримутьсяіззарплатиробочийодягтавзуттянадаютьсябезкоштовноконо
🕒 Heartbeat OK
==> Detected service running on port 10000
==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
📨 [Посередники APOLO] (ID: -1003863670200) 45 сімв.: "доброго вечора. чи є вакансія ДПД у Вроцлаві?..."
📡 RAW PUSH: ад "Посередники APOLO" (ID: -1003863670200) | Тэкст: доброго вечора. чи є вакансія ...
🗑️ Адхілена (Noise/Regex) ад "Посередники APOLO": "доброго вечора. чи є вакансія ДПД у Вроцлаві?..."
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
📨 [Посередники APOLO] (ID: -1003863670200) 24 сімв.: "Вроцлав весь пока закрыт..."
📡 RAW PUSH: ад "Посередники APOLO" (ID: -1003863670200) | Тэкст: Вроцлав весь пока закрыт...
📥 Прынята: 24 сімв. ад "Посередники APOLO" (APOLO) [telegram_userbot]
💾 Захавана ў буфер: APOLO (ID: 6a00ce3cd46d7bf337caa15a)
🕒 Heartbeat OK
⚙️ КАНВЕЕР: Апрацоўка 1 паведамленняў...
📉 Кароткае паведамленне (24 сімв.), аўта-класіфікацыя: UPDATE
🕒 Heartbeat OK
🕒 Heartbeat OK
📨 [SOLANO БРИЖУК] (ID: -1003038801216) 42 сімв.: "Він вжн був у нас, за нього не буде премії..."
📡 RAW PUSH: ад "SOLANO БРИЖУК" (ID: -1003038801216) | Тэкст: Він вжн був у нас, за нього не...
📥 Прынята: 42 сімв. ад "SOLANO БРИЖУК" (SOLANO) [telegram_userbot]
💾 Захавана ў буфер: SOLANO (ID: 6a00d295d46d7bf337caa161)
⚙️ КАНВЕЕР: Апрацоўка 1 паведамленняў...
📉 Кароткае паведамленне (42 сімв.), аўта-класіфікацыя: UPDATE
🕒 Heartbeat OK
📨 [SOLANO БРИЖУК] (ID: -1003038801216) 17 сімв.: "Тоді не подавайте..."
📡 RAW PUSH: ад "SOLANO БРИЖУК" (ID: -1003038801216) | Тэкст: Тоді не подавайте...
📥 Прынята: 17 сімв. ад "SOLANO БРИЖУК" (SOLANO) [telegram_userbot]
💾 Захавана ў буфер: SOLANO (ID: 6a00d40dd46d7bf337caa168)
🕒 Heartbeat OK
⚙️ КАНВЕЕР: Апрацоўка 1 паведамленняў...
📉 Кароткае паведамленне (17 сімв.), аўта-класіфікацыя: UPDATE
🕒 Heartbeat OK
🕒 Heartbeat OK
🕒 Heartbeat OK
==> Running 'node index.js'
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️ override existing env vars with { override: true }
🚀 Server: http://localhost:10000
🤖 Запуск Telegram userbot (child process)...
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️ write to custom object with { processEnv: myObject }
✅ MongoDB Connected
🤖 Запуск Telegram userbot...
[2026-05-10T19:13:24.205] [INFO] - [Running gramJS version 2.26.21]
[2026-05-10T19:13:24.213] [INFO] - [Connecting to 149.154.167.91:80/TCPFull...]
[2026-05-10T19:13:24.296] [INFO] - [Connection to 149.154.167.91:80/TCPFull complete!]
[2026-05-10T19:13:24.297] [INFO] - [Using LAYER 198 for initial connect]
✅ Userbot аўтарызаваны як: @InnaNovaWork
🎧 Userbot слухае паведамленні...
🕒 Heartbeat OK

---

```markdown
## [0.5.3] - 2026-05-06 — Фільтрацыя EN-шуму, MULTI_VACANCY, прэ-валідацыя

### ✅ Backend (Фільтрацыя)

- **EN Noise Filter (`messageFilters.js`):** Дадан масіў `RECRUITER_CHAT_NOISE_EN`

  з паттэрнамі для англамоўнай перапіскі рэкрутэраў (кароткія пытанні,

  пацверджанні, анкеты кандыдатаў, @мэнцыі). Зменшае шум з INTRASERVICE

  і іншых чатаў якія вядуць перапіску па-англійску.

### ✅ Backend (Класіфікацыя)

- **MULTI_VACANCY (`gemini.service.js`):** У промпт Gemini дадана новая

  катэгорыя `MULTI_VACANCY` для паведамленняў якія змяшчаюць 2+ асобных

  вакансій з уласнымі пасадай/лакацыяй/стаўкай (напр. SG-пакеты).

  Gemini вяртае `vacancyCount` для дыягностыкі.

- **Prompt Refinement (`gemini.service.js`):** Дакладнізаваны крытэрыі

  `FULL_VACANCY` — цяпер патрабуе ўсе тры элементы (пасада + лакацыя + стаўка)

  для АДНОЙ вакансіі. Кароткія спісы з лакацыямі ("Eurocash Lublin 2ч")

  і анкеты кандыдатаў выразна адносяцца да `UPDATE`.

### ✅ Backend (Апрацоўка)

- **`hasMinimalVacancyData` (`inbox.js`):** Новая функцыя прэ-валідацыі

  перад запускам Groq. Правярае наяўнасць стаўкі (zł/€) і лакацыі (📍).

  Калі дадзеных недастаткова — зніжае катэгорыю з `vacancy` да `update`

  і пазбягае стварэння пустых вакансій (тып VAC-0061).

- **MULTI_VACANCY routing (`inbox.js`):** Паведамленні з катэгорыяй

  `MULTI_VACANCY` аўтаматычна накіроўваюцца ў `processVacancyMessage`

  (сплітэр + Groq), абыходзячы `hasMinimalVacancyData` праверку,

  бо кожная з вакансій у пакеце мае поўную структуру.

### 🐛 Fixes

- **VAC-0061 root cause:** Паведамленні тыпу "Актуалізація вакансій:

  Eurocash — Lublin 2ч, Kraków 2ч..." больш не будуць класіфікавацца

  як `FULL_VACANCY` і ствараць пустыя карткі вакансій.

## [0.5.3-hotfix] - 2026-05-06 — Крытычны фікс цыкла і санітайзер Markdown

### 🔴 Backend (Крытычны)

- **`isAutoDone` declaration (`inbox.js`):** Выпраўлена адсутнасць аб'яўлення

  `let isAutoDone = false` унутры цыкла `for (const msg of pending)`.

  Раней пераменная не скідалася паміж ітэрацыямі, што магло прывесці

  да `ReferenceError` і паўнага спынення фонавага працэсара.

### 🟡 Backend (Якасць)

- **Markdown Sanitizer (`vacancies.js`):** Дадана функцыя

  `sanitizeTelegramMarkdown`. Выдаляе незакрытыя `**`, `_`, `` ` ``,

  `[` перад адпраўкай у Telegram. Вырашае памылку

  `❌ Памылка Markdown` якая выклікала фолбэк на plain text

  і страту фарматавання паста. Санітайзер ужываецца ў

  `processVacancyMessage` і ў маршруце `ai-update`.

## [0.5.4] - 2026-05-06 — Фікс cooldown Gemini і пашырэнне фільтраў

### 🔴 Backend (Крытычны)

- **Gemini Cooldown Fix (`gemini.service.js`):** Выпраўлена логіка

  `getMsUntilSevenAM`. Раней замарозка заўсёды ставілася на

  **заўтра 07:00**, нават калі бягучы час 06:59 або 08:00.

  Цяпер: калі 07:00 сёння яшчэ не наступіла — замарожвае да сёння,

  інакш да заўтра. Гэта выправіла сітуацыю калі пасля рэстарту

  ўсе Gemini-мадэлі адразу замарожваліся паўторна.

### 🟡 Backend (Фільтрацыя)

- **UA Recruiter Noise (`messageFilters.js`):** Дададзены ўкраінскія

  паттэрны для рэкрутэрскага шуму: кароткія просьбы ("Цю беремо теж?",

  "тільки цю жіночку додати", "також внесіть"), анкеты кандыдатаў

  (ПРІЗВИЩЕ ІМʼЯ + пашпарт + email), сацыяльныя прывітанні

  ("доброго ранку", "добрий день").

  Зменшае смецце з INTRASERVICE і аналагічных чатаў.

## [0.5.6] - 2026-05-06 — Фікс сплітэра, sourceBlock, лакацыі

### 🔴 Backend (Крытычны)

- **Splitter max_tokens (`ai.service.js`):** Дадан `max_tokens: 8000`

  у выклік Groq у `splitMultipleVacancies`. Раней Groq абрэзаў адказ

  па дэфолтным ліміце і вяртаў толькі 5 з 12 вакансій пакета SG.

  Таксама ўваход абмежаваны да 12000 сімвалаў каб не перавысіць

  кантэкстнае акно `llama-3.1-8b-instant`.

- **Per-vacancy sourceBlock (`ai.service.js` + `vacancies.js`):**

  `parseMultipleVacancies` цяпер вяртае `{data, sourceBlock}` для

  кожнай вакансіі. `processVacancyMessage` захоўвае ў `originalText`

  толькі блок тэксту канкрэтнай вакансіі. Выправіла сітуацыю

  калі ўсе 5 вакансій SG захоўвалі ў `originalText` увесь пакет з 12.

### 🟡 Backend (Якасць парсінгу)

- **International Location (`ai.service.js`):** У `SYSTEM_INSTRUCTION`

  дадана правіла 4: для ўсіх краін акрамя Польшчы горад пішацца

  лацінкай з краінай у дужках ("Corsica (France)"). Выправіла

  "Корсика" кірыліцай у VAC-0065 і адсутнасць краіны ў VAC-0063..0067.

- **Transport formatting (`ai.service.js`):** У `FORMAT_PROMPT`

  дадана правіла транспарту: "Власний" → "Довіз: немає",

  "надається" → "Довіз: надається". Выправіла незразумелы

  "Давіз: Власний" у TG-постах.

  ## [0.5.7] - 2026-05-06 — Фікс бясконцай петлі і лімітаў AI

### 🔴 Backend (Крытычны)

- **Processing Loop Fix (`inbox.js`):** Выпраўлена бясконцая петля

  рэапрацоўкі пры рэстарце сервера. Паведамленне цяпер адразу

  атрымлівае `rawText: "__processing__"` у пачатку апрацоўкі,

  да выкліку AI. Гэта выключае яго з чаргі `rawText: ""`

  і не дазваляе паўторна апрацоўваць пры наступным старце.

- **Retry Limit (`inbox.js`):** Дадана лічылка `retryCount`.

  Паведамленні якія 5 разоў запар не прайшлі AI-аналіз з-за

  лімітаў аўтаматычна пазначаюцца як апрацаваныя і хаваюцца.

  Гэта выправіла сітуацыю калі 7+ паведамленняў APOLO

  блакавалі чаргу і перашкаджалі апрацоўцы новых.

### 🟡 Backend (Фільтрацыя)

- **UA Noise Patterns (`messageFilters.js`):** Дададзены паттэрны

  для ўкраінскага рэкрутэрскага шуму які прайшоў праз папярэднія

  фільтры: "так так", "чекаю відповідь", "впишіть в систему",

  "буде кімната", "залежить хто перший" і інш.

## [0.5.9] - 2026-05-06 — Фікс сплітэра і аптымізацыя фільтраў

### 🔴 Backend (Крытычна)

- **Splitter Token Limit (`ai.service.js`):** Дададзены `max_tokens: 8000`

  у функцыю `splitMultipleVacancies`. Гэта выправіла праблему, калі

  пры апрацоўцы вялікіх пакетаў (напрыклад, SG на 12 вакансій)

  Groq абразаў JSON-адказ, што прыводзіла да страты часткі вакансій.

### 🟡 Backend (Фільтрацыя)

- **Recruiter Noise Regex (`messageFilters.js`):** Прыбрана жорсткая

  прывязка да пачатку радка (`^`) у масіве `RECRUITER_CHAT_NOISE`.

  Цяпер фільтр лепш адсякае шум у чатах (асабліва INTRASERVICE),

  нават калі паведамленне пачынаецца з эмодзі або згадкі імя.

### 🟢 Backend (Стабільнасць)

- **Full Text Processing (`inbox.js`):** Пацверджана выкарыстанне

  арыгінальнага тэксту паведамлення для парсінгу замест кароткага

  перакладу-самары, што вырашыла праблему пустых палёў у VAC-0071 (Zara Psary).

## [2025-05-06] Мадэрнізацыя архітэктуры апрацоўкі паведамленняў і парсінгу

### Backend / Services & Routes

- **inbox.js**:
  - Укаранёны фонавы працэсар чаргі (FIFO) з інтэрвалам 5 хвілін.

  - Дададзены статус `__processing__` для прадухілення паўторнай апрацоўкі паведамленняў пры збоях.

  - Інтэгравана перадача кантэксту (паведамленні і вакансіі за сёння) у Gemini для разумнай дэдуплікацыі.

- **gemini.service.js**:
  - Створаны шматслойны ланцужок фолбэкаў (Gemini 2.5 Flash -> 2.0 Flash -> Groq Llama 8b).

  - Рэалізавана логіка разумнай замарозкі квот з аўтаматычным размарожваннем а 07:00 раніцы.

  - Укаранёна Stage 1 класіфікацыя: вызначэнне тыпу паведамлення (FULL_VACANCY, MULTI_VACANCY, UPDATE, INFO, NOISE).

- **ai.service.js**:
  - Рэалізаваны "Split & Parse" механізм: аўтаматычнае разбіццё паведамленняў з некалькімі вакансіямі на асобныя блокі.

  - Дададзена функцыя `enrichTextWithDocs`: аўтаматычная загрузка і ўключэнне тэксту з Google Docs па спасылках у паведамленні.

  - Укаранёна іерархія мадэляў для парсінгу: SMART (Llama 70b) -> FAST (Llama 8b).

  - Абноўлены геаграфічныя правілы: строгая лацінка для польскіх гарадоў і англійская мова для іншых краін.

- **messageFilters.js**:
  - Значна пашыраны фільтры шуму: дададзены адсеў сістэмных паведамленняў ботаў (`**processing**`), англамоўных дыялогаў рэкрутэраў і агра-спецыфічных працоўных чатаў.

  - Створаны блок `CANDIDATE_FORM_NOISE` для ідэнтыфікацыі і ігнаравання анкет кандыдатаў (пашпарты, спісы імёнаў).

  - Выпраўлена логіка `getWhitelistedAgency` для бяспечнай працы з кароткімі назвамі чатаў.

### Database / Models

- **UnprocessedMessage.js**: Дададзены індэксы для аптымізацыі чаргі і `prefixHash` для хуткай дэдуплікацыі на этапе прыёму (push).

- **Vacancy.js**: Замацавана ўнікальнасць `vacancyCode` і структура палёў v2.0.

## [0.6.0] - 2026-05-06 — Канвеер v2.0: Stage 1 (Gemini) -> Stage 2 (Groq)

### Added

- **Two-Stage Pipeline**: Укаранёна падзеленая апрацоўка. Stage 1 (Gemini) адказвае за класіфікацыю, дэдуплікацыю і поўны пераклад на ўкраінскую мову. Stage 2 (Groq) выконвае толькі структураваны парсінг у JSON, выкарыстоўваючы ўжо гатовы пераклад.

- **aiAnalyzed Flag**: У мадэль `UnprocessedMessage` дададзены маркер `aiAnalyzed`. Гэта дазваляе адрозніваць новыя паведамленні ад тых, што ўжо прайшлі AI-аналіз, але патрабуюць ручной апрацоўкі (Update/Info).

- **Google Docs Stage 0**: Збагачэнне тэксту з Google Docs цяпер адбываецца да класіфікацыі, што дазваляе AI бачыць поўны змест вакансіі пры вызначэнні катэгорыі.

### Fixed

- **Double Translation**: Выключана паўторнае выкарыстанне токенаў для перакладу. Groq цяпер атрымлівае чысты ўкраінскі тэкст ад Gemini.

- **Inbox Visibility**: Выпраўлена дэфолтная катэгорыя паведамленняў з `chat` на `info`. Цяпер усе паведамленні з вайтліста адразу бачныя ў пясочніцы.

- **FIFO Logic**: Фонавы працэсар цяпер строга прытрымліваецца чаргі ад старых паведамленняў да новых.

- **EN Noise Patterns**: Дададзены новыя рэджэкс-фільтры для англамоўнага шуму ("Not written", "Cucumbers are stopped", "Waiting for response").

### Changed

- **Multi-Vacancy Handling**: Паведамленні з некалькімі вакансіямі цяпер аўтаматычна класіфікуюцца як `update` і накіроўваюцца ў пясочніцу для ручнога кантролю, што эканоміць ліміты Groq.

## [0.6.1] - 2026-05-06 — Хотфікс тыпу rawText і self-loop

### 🔴 Backend (Крытычны)

- **rawText Cast Error (`inbox.js`):** Выпраўлена памылка

  `Cast to string failed for value (type Object)`.

  Калі Groq-фолбэк вяртаў `translatedText` як аб'ект,

  код спрабаваў запісаць яго ў `String`-поле MongoDB.

  Дадана тыпавая праверка: калі `analysis.translatedText`

  не радок — выкарыстоўваецца арыгінальны `enrichedText`.

- **NOVA WORK AGENCY Self-Loop (`messageFilters.js`):**

  Дадан запіс `{ id: "-1002851211149", agency: "IGNORE_SELF" }`.

  Паведамленні з уласнага канала агенцыі больш не будуць

  трапляць у буфер.

## [0.6.2] - 2026-05-08 — Стабілізацыя канвеера і разумная фільтрацыя

### ✅ Backend & AI

- **Аптымізацыя інтэрвалаў:** Інтэрвал фонавай апрацоўкі павялічаны да **10 хвілін**. Гэта дазваляе MacroDroid сабраць поўны тэкст паведамленняў (stitching) і эканоміць сутачныя ліміты Gemini (RPD).

- **Зняцце лімітаў чаргі:** Выдалена абмежаванне `.limit(10)` у `inbox.js`. Цяпер робат апрацоўвае ўсе назапашаныя паведамленні за адзін цыкл.

- **Строгая класіфікацыя вакансій:** У `gemini.service.js` уведзена правіла: паведамленне лічыцца `FULL_VACANCY` толькі калі яго даўжыня **> 300 сімвалаў** або яно змяшчае спасылку на **Google Docs**. Кароткія паведамленні аўтаматычна ідуць у Пясочніцу як `UPDATE`.

- **Smart Deduplication:** AI цяпер ігнаруе розніцу ў эмодзі і стандартных прывітаннях пры параўнанні паведамленняў, што выключае стварэнне дублікатаў пры дробных праўках тэксту агенцыямі.

- **Павялічаны тэрмін захавання:** `expires` для неапрацаваных паведамленняў павялічаны да **72 гадзін** (3 дні).

### 🧹 Фільтрацыя шуму

- **Узмацненне Regex:**
  - Выпраўлены паттэрн для пашпартоў у `CANDIDATE_FORM_NOISE` (цяпер патрабуе наяўнасць лічбаў), што выратавала вакансіі ад памылковага выдалення.

  - Дададзены новыя маркеры рэкрутэрскага чату: "маю жінку на", "звичайний песель", "сильна перевірка", "дзвоню, виясняю".

- **Дакладны Stitching:** `prefixHash` павялічаны да **250 сімвалаў**, каб пазбегнуць ілжывага склейвання розных вакансій з аднолькавымі прывітаннямі.

## [0.6.3] - 2026-05-08 — Візуалізацыя статусу AI ў Пясочніцы

### ✅ Frontend

- **Індыкацыя стану апрацоўкі:** Укаранёны бэйджы "Не апрацавана" (⏳) і "Апрацавана" (✨) для кожнага паведамлення ў Inbox.

- **Разумнае адлюстраванне тэксту:** Рэалізавана пераключэнне кантэнту — да аналізу паказваецца арыгінальны тэкст, пасля аналізу — украінскі пераклад (`rawText`).

- **Маніторынг чаргі:** У сетку статыстыкі дададзена новая картка "Чакаюць AI", якая паказвае колькасць паведамленняў у чарзе на апрацоўку.

- **Абарона ад памылак:** Кнопкі стварэння і абнаўлення вакансій цяпер заблакаваныя для паведамленняў без AI-аналізу, каб пазбегнуць выкарыстання некласіфікаваных даных.

- **Паляпшэнне UX:** Неапрацаваныя паведамленні візуальна аддзелены праз паніжаную празрыстасць (`opacity-70`), што дазваляе рэкрутэру факусавацца на гатовых да працы вакансіях.

## [0.6.4] - 2026-05-08 — Стабілізацыя чаргі і паляпшэнне якасці перакладу

### ✅ Backend & AI

- **Рэанімацыя чаргі:** У `inbox.js` укаранёны механізм аўтаматычнага аднаўлення паведамленняў, якія "завіслі" ў статусе апрацоўкі больш чым на 5 хвілін.

- **Абарона ад пропускаў:** Дададзена логіка `break` пры памылках AI. Калі робат сустракае ліміт (429), ён спыняе цыкл, пакідаючы астатнія паведамленні ў чарзе да наступнага запуску, што гарантуе 100% апрацоўку без пропускаў.

- **Якасць перакладу:** У `gemini.service.js` узмацнена правіла мовы. Цяпер усе паведамленні (англ/рус) прымусова перакладаюцца на ўкраінскую, а арыгінальны тэкст дадаецца знізу пасля раздзяляльніка `--- ORIGINAL ---`.

- **Аптымізацыя лімітаў:** Порг аўтаматычнага стварэння вакансій зніжаны з 300 да **200 сімвалаў**.

- **Фікс памылкі 413 (Groq):** У `ai.service.js` уваходны тэкст для сплітэра абмежаваны да 5000 сімвалаў, каб пазбегнуць перавышэння лімітаў TPM (Tokens Per Minute) на бясплатным тарыфе.

### 🧹 Фільтрацыя

- **FIFO Прыярытэт:** Фонавы працэсар цяпер строга прытрымліваецца храналагічнага парадку, апрацоўваючы самыя старыя паведамленні першымі.

## [0.6.5] - 2026-05-08 — Глыбокая ачыстка Пясочніцы і ўзмацненне AI-перакладу

### ✅ Backend & AI

- **Аўта-ачыстка чату:** Паведамленні пра статус канкрэтных кандыдатаў ("прыехаў", "адмовіўся", "ператэлефаную") і кароткія рэплікі рэкрутэраў цяпер класіфікуюцца як `NOISE`.

- **Схаванне смецця:** У `inbox.js` паведамленні катэгорыі `NOISE` цяпер атрымліваюць статус `processed: true`, што дазваляе аўтаматычна прыбіраць іх з Пясочніцы.

- **Прымусовы пераклад:** У `gemini.service.js` замацавана жорсткае правіла: любы тэкст на англійскай ці рускай мовах павінен быць перакладзены на ўкраінскую. Арыгінал дадаецца знізу пасля `--- ORIGINAL ---`.

- **Даступнасць вакансій:** Порг для `FULL_VACANCY` зніжаны да **200 сімвалаў**, каб кароткія вакансіі (напрыклад, ад SG) апрацоўваліся аўтаматычна.

### 🧹 Фільтрацыя шуму

- **Пашырэнне Regex-базы:** У `messageFilters.js` дададзены новыя маркеры для адсячэння тэхнічнай перапіскі яшчэ да звароту да AI: "дякую, забрали", "refused to work", "will arrive", "call you back", "team won't take" і інш.

## [0.6.6] - 2026-05-08 — Паляпшэнне класіфікацыі доўгіх вакансій

### ✅ Backend & AI

- **Фікс класіфікацыі (Кейс "Сушы"):** У `gemini.service.js` узмацнены промпт. Цяпер паведамленні з падрабязным апісаннем (абавязкі, патрабаванні, умовы) прымусова класіфікуюцца як `FULL_VACANCY`, нават калі яны прыходзяць з MANUAL-чатаў. Гэта выправіла памылку, калі доўгія вакансіі памылкова лічыліся апдэйтамі.

- **Паляпшэнне дэтэкцыі лакацыі:** У `inbox.js` пашыраны Regex для функцыі `hasMinimalVacancyData`. Дададзены ключавыя словы "місто", "локація", "адреса", што дазваляе робату лепш распазнаваць вакансіі без сімвала 📍.

- **Аптымізацыя Splitter:** У `ai.service.js` ліміт уваходнага тэксту для сплітэра зафіксаваны на **4000 сімвалаў**. Гэта забяспечвае баланс паміж паўнатой даных і абаронай ад памылкі 413 (Request too large) на бясплатным тарыфе Groq.

### 🧹 Фільтрацыя

- **Дакладнасць валідацыі:** Палепшаная прэ-валідацыя даных дазваляе больш дакладна адрозніваць паўнавартасныя аб'явы ад кароткіх інфармацыйных паведамленняў.

## [0.6.7] - 2026-05-09 — Уніфікацыя даных і паляпшэнне AI-парсінгу

### ✅ Backend & AI

- **Інтэлектуальная ачыстка брэндаў:** У `ai.service.js` укаранёны `BRAND_BLACKLIST` і функцыя `validateBrand`. Цяпер сістэма аўтаматычна выдаляе агульныя словы ("склад", "ферма", "завод") з поля брэнда, пакідаючы толькі ўласныя назвы.

- **Уніфікацыя агенцый:** Дададзена функцыя `normalizeAgency`, якая прыводзіць назвы агенцый да адзінага стандарту (UPPERCASE + мапінг) пры парсінгу і мерджы шаблонаў.

- **Паляпшэнне геаграфіі:** Укаранёна логіка `displayLocation`. Для вакансій па-за межамі Польшчы краіна аўтаматычна дадаецца ў дужках да горада ў загалоўку і лакацыі.

- **Строгія правілы парсінгу:** Абноўлены `SYSTEM_INSTRUCTION` для AI. Дададзены жорсткія патрабаванні па мапінгу дакументаў ("Біометрія", "PESEL UKR") і катэгарызацыі нюансаў працы.

### 🧹 Гігіена даных

- **Выдаленне дублікатаў:** Ачышчаны код функцыі `parseVacancyWithAI`, выдалены паўторныя блокі апрацоўкі загалоўкаў і зарплаты.

- **Экспарт утыліт:** Функцыі нармалізацыі даступныя для выкарыстання ў іншых маршрутах (напр. пры ручным рэдагаванні).

## [2.1.0] — 2026-05-09

### Backend / AI

- `ai.service.js`: додано `KNOWN_AGENCIES` список та функцію `normalizeAgency()`

  — агенцыі прыводзяцца да UPPER і маппінгу незалежна ад мовы ўводу

- `ai.service.js`: додано `BRAND_BLACKLIST` та функцію `validateBrand()`

  — агульныя словы ("ферма", "склад", "цех" і інш.) больш не трапляюць у поле `brand`

- `ai.service.js`: абноўлены `SYSTEM_INSTRUCTION` — дакладныя правілы для

  `brand`, `agencyName`, `standardDocs`, `specificNuances` з катэгорыямі

- `ai.service.js`: `mergeWithTemplate` цяпер таксама нармалізуе `agencyName`

- `ai.service.js`: экспартаваны `normalizeAgency` і `validateBrand`

  для выкарыстання ў іншых сэрвісах

### Frontend — EditVacancyModal

- Поле `agencyName` → `<select>` dropdown з эталонным спісам агенцый

- Поле `contractType` → кнопкі (Umowa zlecenie / Umowa o pracę / Іншае)

  з тэкставым полем для custom значэння

- Поле `count` → кнопкі (1 чалавек / Пара / Сям'я)

- Поле `polishLanguageLevel` → кнопкі замест тэкставага поля

- Поле `accommodation.type` → кнопкі (Надається / Надається для пар / Не надається)

  з аўтасінхранізацыяй `forCouples`

- Поле `foodType` → кнопкі (Власне / Обіди / Субсидоване)

- Выдалены дубліруючы чэкбокс `forCouples` (зараз кіруецца кнопкай тыпу жытла)

### Frontend — VacancyViewModal

- Уведзены кампаненты `SectionTitle`, `Row`, `Note` для двух памераў тэксту:

  загалоўкі секцый — буйней, апісальныя нататкі — дробны курсіў

- Брэнд (`brand`) перанесены ў шапку мадала побач з катэгорыяй

- Лакацыя цяпер заўжды адлюстроўвае краіну ў дужках для не-польскіх вакансій

- Абавязкі (`description`) дзеляцца строга па `;` (не па `.`)

- `physicalLoad` вылучаны курсівам з іконкай

- Дадатковыя дакументы (`additionalDocsDetails`) адлюстроўваюцца як `Note`

- Раздзел "Витрати" паказваецца толькі калі ёсць хаця б адно значэнне

### Frontend — Vacancies (картка ў спісе)

- Брэнд-тэг перанесены ў верхні радок побач з катэгорыяй

- Лакацыя заўжды з назвай краіны для замежных вакансій

- Зарплата хаваецца калі поле пустое (замест пустога месца)

## [2.2.0] — 2026-05-09

### Backend (Крытычны фікс)

- `index.js`: падключаны маршруты `/api/templates`, `/api/candidates`, `/api/apply`

  — гэта была галоўная прычына таго, чаму старонкі Templates і Candidates

  не грузіліся (500/404 на ўсіх запытах)

### Backend — candidates.js (маршрут)

- Выдалена старая логіка `match-vacancies` v1.0 (выкарыстоўвала `vacancy.sphere`,

  `vacancy.accommodation.available`, `requirements.docs` — палі якіх няма ў v2.0)

- Перапісана пад v2.0: `vacancy.category`, `accommodation.type`,

  `requirements.standardDocs`, `requirements.polishLanguageLevel`,

  `schedule.shiftsCount`, `accommodation.forCouples`

### Backend — apply.js

- Выпраўлена `vacancy.title` → `vacancy.vacancydescription || vacancy.templateName`

- Фармат паведамлення прыведзены да HTML (адпавядае `parse_mode: "HTML"`

  у `notifyRecruiter`)

### Backend — Template.js (схема)

- Дадана поле `brand: { type: String, default: "" }` — сінхранізацыя з Vacancy.js

- `requirements.ageMax`: `default: 99` → `default: null` — сінхранізацыя з Vacancy.js

### Backend — ai.service.js

- Дадана `"STAFF POWER"` у масіў `KNOWN_AGENCIES`

## [2.3.0] — 2026-05-09

### Backend / AI-Parser Improvements

- `ai.service.js`: радыкальна абноўлены `SPLIT_PROMPT`

  — уведзена "правіла адной вакансіі": AI забаронена рэзаць доўгія тэксты на часткі, калі яны апісваюць адну пазіцыю. Гэта вырашыла праблему страты лакацыі і дэталяў транспарту.

- `ai.service.js`: палепшана логіка вызначэння геаграфіі ў `SYSTEM_INSTRUCTION`

  — дададзены жорсткія маркеры для падзелу `location` (месца працы) і `checkInCity` (месца афармлення/офіс) на аснове ключавых слоў "оформлення", "приїзд", "місто".

- `ai.service.js`: аптымізавана функцыя `parseVacancyWithAI`

  — выпраўлена памылка дублявання аб'яўлення зменнай `parsed`.

  — укаранёна дынамічнае фарміраванне `displayLocation` для замежных вакансій: цяпер краіна аўтаматычна дадаецца ў дужках у загаловак.

- `ai.service.js`: удакладнены спіс `standardDocs`

  — дададзены пункт "Довідка резидента" для карэктнага распазнавання і фільтрацыі.

- `ai.service.js`: палепшаны `FORMAT_PROMPT` для Telegram

  — апісанне даезду (`transportDetails`) цяпер выводзіцца разгорнута побач са статусам "надається", што робіць пасты больш інфарматыўнымі.

## [2.4.0] — 2026-05-09

### Backend / AI & Routing (Мадэрнізацыя "Tier 1")

- `ai.service.js`: Укаранёны адзіны "бранябойны" рухавік `executeAIRequest` з ланцужком з 6 мадэляў (Gemini 2.0 Flash/Lite, 2.5 Flash/Lite і Groq 70b/8b).

- `ai.service.js`: Сплітар (разбіўка на некалькі вакансій) перанесены непасрэдна ў асноўны промпт парсера для захавання 100% кантэксту.

- `ai.service.js`: Укаранёна аўтаматычная класіфікацыя `parsingResultType` (FULL_VACANCY vs UPDATE) з улікам ліміту ў 250 сімвалаў.

- `ai.service.js`: Усталявана разумная паўза ў 1 гадзіну пры вычарпанні лімітаў усіх AI-правайдэраў (замест замарозкі да раніцы).

- `vacancies.js`: Функцыя `processVacancyMessage` цяпер працуе як інтэлектуальны дыспетчар: паўнавартасныя вакансіі ідуць у базу і Telegram, а кароткія апдэйты аўтаматычна накіроўваюцца ў Пясочніцу (`UnprocessedMessage`).

- `gemini.service.js`: Цалкам пераведзены на выкарыстанне адзінага AI-рухавіка, што спрасціла код і павялічыла надзейнасць Stage 1.

## [2.4.1] — 2026-05-10

### Backend / AI Stability & Logic

- `ai.service.js`: Аптымізаваны фармат запыту ў `executeAIRequest` (выкарыстанне масіва частак і версіі `v1beta`) для забеспячэння сумяшчальнасці з Enterprise/Tier 1 ключамі Google.

- `gemini.service.js`: Узмацнены правілы класіфікацыі ў `SYSTEM_PROMPT`. Уведзена жорсткае патрабаванне маркіраваць доўгія паведамленні (>300 сімв.) з дэталямі працы як `FULL_VACANCY`, каб пазбегнуць іх памылковага скіду ў Пясочніцу.

- `gemini.service.js`: Выдалены небяспечны фолбэк "па змаўчанні ў UPDATE" у блоку `catch`. Цяпер пры тэхнічных збоях (напр. `Error fetching`) сістэма вяртае `null`, што пакідае паведамленне ў буферы для паўторнай спробы і захоўвае яго зыходную якасць.

## [2.5.0] — 2026-05-10 — Архітэктура "Канвеер v2.0": Сплітар і Буфер

### ✅ Backend & AI (Мадэрнізацыя)

- **Двухэтапная апрацоўка (Pipeline):** Укаранёна падзеленая логіка апрацоўкі вакансій:
  - **Stage 1 (Gemini):** Класіфікацыя, поўны пераклад на ўкраінскую і інтэлектуальны спліцінг (разбіўка мульці-вакансій на масіў фрагментаў).

  - **Stage 2 (Groq/Gemini):** Ювелірны парсінг кожнага фрагмента ў структуру JSON v2.0.

- **15-хвілінны буфер (Scheduler):** Дададзены фонавы працэсар, які кожныя 15 хвілін правярае Пясочніцу і аўтаматычна апрацоўвае новыя паведамленні праз поўны AI-канвеер.

- **Stage 0 (Enrichment):** Функцыя загрузкі тэксту з Google Docs перанесена ў самы пачатак ланцужка, што дазволіла AI бачыць поўны кантэнт пры класіфікацыі.

- **Эканомія токенаў:** Уведзена "Жалезнае правіла 250 сімвалаў" — кароткія паведамленні без спасылак аўтаматычна ідуць у Пясочніцу як UPDATE без выкліку AI.

- **Zero-Output Rule:** Абноўлены `FORMAT_PROMPT` для Telegram. Цяпер пустыя палі, эмодзі і загалоўкі секцый цалкам хаваюцца, калі ў іх няма дадзеных.

- **Гігіена базы:** Кожная вакансія цяпер захоўвае ў `rawText` толькі свой рэлевантны фрагмент тэксту замест усяго агульнага паведамлення.

### 🛠 Тэхнічныя праўкі

- У `vacancies.js` рэалізаваны падзел на ручны парсінг (напрамую Stage 2) і аўтаматычны (Stage 1 + Stage 2).

- Захаваны маркер `isTruncated` для візуалізацыі абрэзаных паведамленняў на фронтэндзе.

- Уніфікаваны матор `executeAIRequest` цяпер выкарыстоўваецца ва ўсіх AI-сэрвісах.

## [2025-05-10] — Стабілізацыя канвеера апрацоўкі паведамленняў

### Выпраўлена:

- **Валідацыя UnprocessedMessage**: Дададзена `lowercase: true` для поля `category`. Цяпер катэгорыі ад AI (напр. `UPDATE`) аўтаматычна праходзяць валідацыю `enum`.

- **Завісанне канвеера (inbox.js)**: У цыкле апрацоўкі паведамленняў `break` заменены на `continue`. Цяпер памылка ў адным паведамленні не спыняе ўсю чаргу.

- **Памылка імпарту (inbox.js)**: Выпраўлены выклік `enrichTextWithDocs`, функцыя цяпер правільна імпартуецца з `gemini.service.js`.

- **Памылка валідацыі (vacancies.js)**: Поле `senderInfo` заменена на `sender` пры стварэнні sandbox-элемента, што вырашыла праблему `Path sender is required`.

- **Канфлікт планіроўшчыкаў**: Выдалены дублюючы `setInterval` з `vacancies.js`. Цяпер за апрацоўку чаргі адказвае толькі адзін планіроўшчык у `inbox.js`.

### Палепшана:

- **Фільтрацыя шуму**: У `messageFilters.js` дададзены новыя патэрны для адсейвання кароткіх чатавых паведамленняў ("наберу завтра", "дякую всім", "зателефоную").

- **Захаванне логікі**: У `vacancies.js` вернуты арыгінальныя каментары-страхоўкі і строгая ачыстка Telegram Markdown.

## [2025-05-10] — Пераход на карпаратыўны SDK Google AI (Agent Platform)

### Дададзена:

- **Аўтэнтыфікацыя ADC**: Сістэма пераведзена з API-ключаў на Application Default Credentials (ADC). На Render загружаны `adc.json` для бяспечнай аўтарызацыі праз карпаратыўны акаўнт.

- **Новы SDK**: Усталявана бібліятэка `@google/genai` для працы з Google Agent Platform (Vertex AI).

### Выпраўлена:

- **Памылка аўтарызацыі**: Вырашана праблема `API Keys are Disallowed` шляхам выкарыстання Service Account і ADC.

- **Памылка URL**: Выпраўлена памылка фармавання URL (`/mod`), якая ўзнікала ў старым SDK.

- **Захаванне катэгорый**: У `gemini.service.js` выдалены "шкодны" fallback, які ператвараў вакансіі ў "Інфа" пры памылках AI. Цяпер пры памылцы паведамленне застаецца неапрацаваным для паўторнай спробы.

- **Аптымізацыя мадэляў**: У `AI_CHAIN` прыярытэт аддадзены `flash-lite` версіям для максімальнай эканоміі токенаў. Выдалена слабая мадэль Groq, якая выклікала памылку 413 (Request too large).

### Тэхнічныя змены:

- Абноўлена ініцыялізацыя кліента `GoogleGenAI` з параметрам `vertexai: true`.

- Абноўлена логіка атрымання тэксту ў `executeAIRequest` пад новы фармат адказу SDK (`response.text`).

# Лаг зменаў

## 📂 ai.service.js

- Дададзена абмежаванне ўваходу (`substring(0, 6000)`) для абароны ад памылкі 413.

- Дададзена праверка cooldown праз `chainFrozenUntil`.

- Абноўлены блок **Gemini**:
  - Пераход на новы SDK `@google/genai` з ADC.

  - Правільны доступ да выніку праз `response.text`.

  - Дададзена падтрымка `responseMimeType` для JSON/plain.

- Абноўлены блок **Groq**:
  - Выклік праз `groq.chat.completions.create`.

  - Правільны фармат `messages` (system + user).

- Catch‐блок цяпер карэктна працягвае да наступнай мадэлі і вяртае `null`, калі ўсе мадэлі не адказалі.

---

## 📂 gemini.service.js

- Catch‐блок у enrichTextWithDocs і analyzeAndCompareWithGemini пакідае паведамленні “неапрацаванымі” пры памылках.

- Інтэграцыя з абноўленым `executeAIRequest`.

- Кэш і аўта‐класыфікацыя кароткіх паведамленняў (<250 сімвалаў) засталіся без змен.

---

## 📂 FORMAT_PROMPT

- Дададзены пустыя радкі паміж блокамі (💰, 🛠, 📋, 🕒, 📄, 🏠, 🚌, 💸, 🌡, 📝).

- 🏠 Accommodation:
  - Прыбрана дубляванне загалоўкаў.

  - Паказваецца толькі “🏠 Проживання” + радкі з дэталямі, калі ёсць даныя.

- 🚌 Transport:
  - Прыбрана дубляванне загалоўкаў.

  - Паказваецца толькі “🚌 Довіз: немає” або “🚌 Довіз: надається” + дэталі.

  - “Власний” больш не выкарыстоўваецца.

- 📍 Location:
  - Строга аддзяляецца “📍 Місто” (месца працы) ад “• Оформлення” (месца афармлення).

- 📝 Додаткова:
  - Арганізаваны трансфер з Украіны заўсёды пераносіцца сюды, а не ў Transport.

---

## 📂 SYSTEM_INSTRUCTION

- Дададзены блок **STRICT LOCATION VALIDATION**:
  - location = actual place of work.

  - checkInCity = registration/arrival city.

  - Калі ў сырым тэксце лакацыя напісана з памылкай (напрыклад, "Elena Gura"), аўтаматычна замяняць на правільную польскую назву ("Zielona Góra").

  - Завсёды выкарыстоўваць польскую арфаграфію (Latin alphabet).

  - Калі лакацыя не пазначана дакладна, пакідаць як ёсць, але дадаваць у additionalNotes для ручной праверкі.

---

# 📝 Вынік

- **ai.service.js** — абноўлены пад новы SDK, fallback працуе правільна.

- **gemini.service.js** — catch‐блок і кэш нармальна працуюць, інтэграцыя з новым `executeAIRequest`.

- **FORMAT_PROMPT** — больш кампактны, без дублявання, з падзеламі паміж блокамі.

- **SYSTEM_INSTRUCTION** — дададзена строгая праверка лакацыі, каб пазбегнуць памылак тыпу “Елена Гура”.

- **Дададзены слоўнік перакладу** (TRANSLATION_MAP) для аўтаматычнага мапінгу кірылічных назваў агенцый у лацінку (напр. "Прогрес" -> "PROGRES").

- **Выпраўлена лагічная памылка ў executeAIRequest**: прыбраны недасягальны return null, цяпер ланцужок правільна замарожваецца пры адмове ўсіх мадэляў.

- **У SYSTEM_INSTRUCTION** дададзена строгае правіла перакладу назваў агенцый для AI.
```

---

// frontend/src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
<StrictMode>
<App />
</StrictMode>,
);

---

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vacancies from "./pages/Vacancies";
import Candidates from "./pages/Candidates";
import Templates from "./pages/Templates";
import Inbox from "./pages/Inbox"; // Дадалі імпарт

export default function App() {
return (
<BrowserRouter>
<Layout>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/vacancies" element={<Vacancies />} />
<Route path="/candidates" element={<Candidates />} />
<Route path="/templates" element={<Templates />} />
<Route path="/inbox" element={<Inbox />} /> {/_ Дадалі маршрут _/}
</Routes>
</Layout>
</BrowserRouter>
);
}

---

import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom"; // Дадалі гэты радок
import {
getVacancies,
getTemplates,
deleteVacancy,
createVacancyAuto,
createVacancyFromTemplate,
} from "../services/api";
import EditVacancyModal from "../components/vacancies/EditVacancyModal";
import ApplyModal from "../components/vacancies/ApplyModal";
import VacancyMatchModal from "../components/vacancies/VacancyMatchModal";
import VacancyViewModal from "../components/vacancies/VacancyViewModal";
import VacancyFilters from "../components/vacancies/VacancyFilters";
import { EMPTY_FILTERS } from "../constants/filters";

const STATUS_COLORS = {
active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
closed: "bg-red-500/10 text-red-400 border border-red-500/20",
archived: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};

const STATUS_LABELS = {
active: "Актыўная",
closed: "Закрыта",
archived: "Архіў",
};

// 1. Поўная і карэктная функцыя фільтрацыі
function applyFilters(vacancies, filters) {
if (!vacancies) return [];

return vacancies.filter((v) => {
// --- 1. Пошук ---
if (filters.search) {
const s = filters.search.toLowerCase();
const matchSearch =
v.templateName?.toLowerCase().includes(s) ||
v.vacancydescription?.toLowerCase().includes(s) ||
v.location?.toLowerCase().includes(s) ||
v.agencyName?.toLowerCase().includes(s) ||
v.brand?.toLowerCase().includes(s) ||
v.vacancyCode?.toLowerCase().includes(s);
if (!matchSearch) return false;
}

    // --- 2. Статус і Катэгорыя ---
    if (filters.status?.length > 0 && !filters.status.includes(v.status))
      return false;
    if (filters.category?.length > 0 && !filters.category.includes(v.category))
      return false;

    // --- 3. Ваяводства / Рэгіён (ФІКС: Еўропа) ---
    if (filters.voivodeship?.length > 0) {
      const vVoiv = v.voivodeship;
      const isEurope =
        (v.country && v.country !== "Polska") ||
        vVoiv === "Європа (інші країни)";
      const currentRegion = isEurope ? "Європа (інші країни)" : vVoiv;

      if (!filters.voivodeship.includes(currentRegion)) return false;
    }

    // --- 4. Лакацыя ---
    if (filters.location?.length > 0) {
      const vLoc =
        v.country && v.country !== "Polska"
          ? `${v.location} (${v.country})`
          : v.location;
      if (!filters.location.includes(vLoc)) return false;
    }

    // --- 5. Жыллё ---
    if (filters.accommodation?.length > 0) {
      const accType = (v.accommodation?.type || "").toLowerCase();
      const isCouples = !!v.accommodation?.forCouples;
      const match = filters.accommodation.some((fa) => {
        if (fa === "provided") return accType && !accType.includes("власн");
        if (fa === "couples") return isCouples;
        if (fa === "none")
          return accType.includes("власн") || accType.includes("не надаєт");
        return false;
      });
      if (!match) return false;
    }

    // --- 6. Транспарт ---
    if (filters.transport?.length > 0) {
      const hasTransport = !!v.transport?.provided;
      const match = filters.transport.some((ft) =>
        ft === "provided" ? hasTransport : !hasTransport,
      );
      if (!match) return false;
    }

    // --- 7. Хто едзе ---
    if (filters.travelGroup?.length > 0) {
      const vGenders = Array.isArray(v.requirements?.gender)
        ? v.requirements.gender
        : [];
      const isCouples =
        !!v.accommodation?.forCouples || vGenders.includes("Пари");
      const isFamily = !!v.accommodation?.withChildren;
      const isAlone = !isCouples && !isFamily;

      const match = filters.travelGroup.some((fg) => {
        if (fg === "alone") return isAlone;
        if (fg === "couple") return isCouples;
        if (fg === "family") return isFamily;
        return false;
      });
      if (!match) return false;
    }

    // --- 8. Мова ---
    if (filters.language?.length > 0) {
      const vLang = v.requirements?.polishLanguageLevel || "Не вимагається";
      if (!filters.language.includes(vLang)) return false;
    }

    // --- 9. Нацыянальнасць ---
    if (filters.nationality?.length > 0) {
      const vNats =
        Array.isArray(v.requirements?.nationalities) &&
        v.requirements.nationalities.length > 0
          ? v.requirements.nationalities
          : ["Україна"];
      if (!filters.nationality.some((fn) => vNats.includes(fn))) return false;
    }

    // --- 10. Дакументы ---
    if (filters.docs?.length > 0) {
      const vDocs = v.requirements?.standardDocs || [];
      if (!filters.docs.some((d) => vDocs.includes(d))) return false;
    }

    // --- 11. Асаблівасці (ФІКС: па катэгорыях) ---
    if (filters.nuances?.length > 0) {
      const vNuances = v.conditions?.specificNuances || [];
      const hasMatch = filters.nuances.some((fn) =>
        vNuances.some((vn) => vn.startsWith(fn)),
      );
      if (!hasMatch) return false;
    }

    // --- 12. Агенцыя і Брэнд ---
    if (
      filters.agencyName?.length > 0 &&
      !filters.agencyName.includes(v.agencyName)
    )
      return false;
    if (filters.brand?.length > 0 && !filters.brand.includes(v.brand))
      return false;

    return true;

});
}

export default function Vacancies() {
const location = useLocation(); // Дадалі
const [vacancies, setVacancies] = useState([]);
const [loading, setLoading] = useState(true);
const [autoText, setAutoText] = useState("");
const [autoLoading, setAutoLoading] = useState(false);
const [showAutoForm, setShowAutoForm] = useState(false);
const [formMode, setFormMode] = useState("auto");

const [templates, setTemplates] = useState([]);
const [templatesLoading, setTemplatesLoading] = useState(false);
const [selectedAgency, setSelectedAgency] = useState("");
const [templateSearch, setTemplateSearch] = useState("");
const [selectedTemplate, setSelectedTemplate] = useState(null);

const [editVacancy, setEditVacancy] = useState(null);
const [applyVacancy, setApplyVacancy] = useState(null);
const [matchVacancy, setMatchVacancy] = useState(null);
const [viewVacancy, setViewVacancy] = useState(null);

const [draft, setDraft] = useState(EMPTY_FILTERS);
const [applied, setApplied] = useState(EMPTY_FILTERS);
const [sidebarOpen, setSidebarOpen] = useState(false);
const [sourceMessageId, setSourceMessageId] = useState(null);
const notifyUpdate = () => {
window.dispatchEvent(new CustomEvent("inboxUpdated"));
};
useEffect(() => {
if (location.state && location.state.initialText) {
setShowAutoForm(true);
setFormMode("auto");
setAutoText(location.state.initialText);
setSourceMessageId(location.state.messageId); // Захоўваем ID
window.history.replaceState({}, document.title);
}
}, [location.state]);

const fetchVacancies = async () => {
try {
const res = await getVacancies();
setVacancies(res.data);
} catch {
console.error("Памылка загрузкі вакансій");
} finally {
setLoading(false);
}
};
// Дадай гэта пасля fetchVacancies
useEffect(() => {
// Калі ўсе фільтры пустыя (скінуты), аўтаматычна прымяняем іх
if (JSON.stringify(draft) === JSON.stringify(EMPTY_FILTERS)) {
setApplied(EMPTY_FILTERS);
}
}, [draft]);
useEffect(() => {
fetchVacancies();
}, []);

useEffect(() => {
if (showAutoForm && formMode === "template" && templates.length === 0) {
setTemplatesLoading(true);
getTemplates()
.then((res) => setTemplates(res.data))
.catch(() => console.error("Памылка загрузкі шаблонаў"))
.finally(() => setTemplatesLoading(false));
}
}, [showAutoForm, formMode, templates.length]);

// Абноўлены dynamicData
const dynamicData = useMemo(() => {
const agencies = new Set();
const brands = new Set();
const locations = new Set();
const voivodeships = new Set();
const nuances = new Set();

    vacancies.forEach((v) => {
      if (v.agencyName) agencies.add(v.agencyName);
      if (v.brand) brands.add(v.brand);

      // Геаграфія (Разумны збор)
      const isEurope =
        (v.country && v.country !== "Polska") ||
        v.voivodeship === "Європа (інші країни)";

      if (isEurope) {
        voivodeships.add("Європа (інші країни)");
        const locName =
          v.country && v.country !== "Polska"
            ? `${v.location} (${v.country})`
            : v.location;
        locations.add(locName);
      } else {
        if (v.voivodeship) voivodeships.add(v.voivodeship);
        if (v.location) locations.add(v.location);
      }

      // Нюансы (Збіраем толькі катэгорыі для фільтра)
      if (v.conditions?.specificNuances) {
        v.conditions.specificNuances.forEach((n) => {
          const category = n.includes(" (") ? n.split(" (")[0] : n;
          nuances.add(category);
        });
      }
    });

    return {
      agencies: Array.from(agencies).sort(),
      brands: Array.from(brands).sort(),
      locations: Array.from(locations).sort(),
      voivodeships: Array.from(voivodeships).sort(),
      nuances: Array.from(nuances).sort(),
    };

}, [vacancies]);

const filteredTemplates = useMemo(() => {
return templates.filter((t) => {
const matchAgency = !selectedAgency || t.agencyName === selectedAgency;
const q = templateSearch.toLowerCase().trim();
const matchSearch =
!q ||
t.templateName?.toLowerCase().includes(q) ||
t.location?.toLowerCase().includes(q);
return matchAgency && matchSearch;
});
}, [templates, selectedAgency, templateSearch]);

const previewCount = useMemo(
() => applyFilters(vacancies, draft).length,
[vacancies, draft],
);
const filtered = useMemo(
() => applyFilters(vacancies, applied),
[vacancies, applied],
);
const isDirty = JSON.stringify(draft) !== JSON.stringify(applied);

const handleApplyFilters = () => {
setApplied(draft);
setSidebarOpen(false);
};

const handleDelete = async (id) => {
if (!confirm("Выдаліць вакансію?")) return;
try {
await deleteVacancy(id);
setVacancies((prev) => prev.filter((v) => v.\_id !== id));
} catch {
alert("Памылка выдалення");
}
};

const handleAutoCreate = async () => {
if (!autoText.trim()) return;
setAutoLoading(true);
try {
await createVacancyAuto(autoText, sourceMessageId);
notifyUpdate(); // <--- ДАДАЛІ
handleCloseForm();
await fetchVacancies();
} catch {
alert("Памылка стварэння");
} finally {
setAutoLoading(false);
}
};

const handleTemplateCreate = async () => {
if (!selectedTemplate || !autoText.trim())
return alert("Запоўніце ўсе палі");
setAutoLoading(true);
try {
await createVacancyFromTemplate(
selectedTemplate.\_id,
autoText,
sourceMessageId,
);
notifyUpdate(); // <--- ДАДАЛІ
handleCloseForm();
setSourceMessageId(null);
await fetchVacancies();
} catch {
alert("Памылка стварэння");
} finally {
setAutoLoading(false);
}
};

const handleCloseForm = () => {
setShowAutoForm(false);
setAutoText("");
setSelectedTemplate(null);
setFormMode("auto");
};

const handleSaveEdit = (updated) => {
setVacancies((prev) =>
prev.map((v) => (v.\_id === updated.\_id ? updated : v)),
);
};

return (

<div className="flex min-h-screen bg-slate-950">
{/_ САЙДБАР _/}
<aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-800 bg-slate-900/50 sticky top-16 h-[calc(100vh-4rem)]">
<VacancyFilters
          filters={draft}
          setFilters={setDraft}
          agencies={dynamicData.agencies}
          brands={dynamicData.brands}
          locations={dynamicData.locations}
          voivodeships={dynamicData.voivodeships}
          nuances={dynamicData.nuances}
        />
</aside>

      {/* МАБІЛЬНЫ САЙДБАР */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <VacancyFilters
                filters={draft}
                setFilters={setDraft}
                agencies={dynamicData.agencies}
                brands={dynamicData.brands}
                locations={dynamicData.locations}
                voivodeships={dynamicData.voivodeships}
                nuances={dynamicData.nuances} // ДАДАЦЬ ГЭТА
              />
            </div>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2.5 bg-emerald-500 text-slate-900 font-bold rounded-lg"
              >
                Паказаць {previewCount} вакансій
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden px-3 py-2 bg-slate-800 text-slate-300 rounded-lg"
            >
              ⚙️ Фільтры {isDirty && "●"}
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">
                Вакансіі
              </h1>
              <p className="text-sm text-slate-500">
                {filtered.length} з {vacancies.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoForm(!showAutoForm)}
            className="px-4 py-2 bg-emerald-500 text-slate-900 font-medium rounded-lg"
          >
            ＋ Дадаць
          </button>
        </div>

        {/* ФОРМА ДАДАВАННЯ */}
        {showAutoForm && (
          <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex gap-2 mb-4">
              {["auto", "template"].map((m) => (
                <button
                  key={m}
                  onClick={() => setFormMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${formMode === m ? "bg-emerald-500 text-slate-900" : "bg-slate-800 text-slate-400"}`}
                >
                  {m === "auto" ? "🤖 Аўта (AI)" : "📋 З шаблона"}
                </button>
              ))}
            </div>

            {formMode === "template" && (
              <div className="mb-4 space-y-3">
                <input
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Пошук шаблона..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                />
                {templateSearch && (
                  <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-lg p-1">
                    {filteredTemplates.map((t) => (
                      <button
                        key={t._id}
                        onClick={() => setSelectedTemplate(t)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedTemplate?._id === t._id ? "bg-emerald-500/10 text-emerald-400" : "text-slate-300 hover:bg-slate-800"}`}
                      >
                        {t.templateName} ({t.agencyName})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <textarea
              value={autoText}
              onChange={(e) => setAutoText(e.target.value)}
              placeholder="Устаўце тэкст вакансіі..."
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 resize-none"
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={
                  formMode === "template"
                    ? handleTemplateCreate
                    : handleAutoCreate
                }
                disabled={autoLoading || !autoText.trim()}
                className="px-4 py-2 bg-emerald-500 text-slate-900 font-medium rounded-lg disabled:opacity-50"
              >
                {autoLoading ? "Апрацоўка..." : "Апрацаваць і дадаць"}
              </button>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
              >
                Адмена
              </button>
            </div>
          </div>
        )}

        {/* СПІС ВАКАНСІЙ */}
        <div className="space-y-3">
          {filtered.map((v) => {
            // Лакацыя заўжды з краінай калі не Польшча
            const locationDisplay =
              v.country && v.country !== "Polska"
                ? `${v.location} (${v.country})`
                : v.location;

            return (
              <div
                key={v._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* РАДОК 1: код + статус + катэгорыя */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {v.vacancyCode}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                      >
                        {STATUS_LABELS[v.status]}
                      </span>
                      {v.category && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                          📁 {v.category}
                        </span>
                      )}
                      {/* БРЭНД — зверху, пасля катэгорыі */}
                      {v.brand && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          🏭 {v.brand}
                        </span>
                      )}
                    </div>

                    {/* ЗАГАЛОВАК */}
                    <h3 className="font-semibold text-slate-100 leading-snug mb-2">
                      {v.vacancydescription}
                    </h3>

                    {/* РАДОК 2: лакацыя + агенцыя + жытло + зарплата */}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      {/* ЛАКАЦЫЯ — заўжды з краінай */}
                      <span className="flex items-center gap-1">
                        📍{" "}
                        <span className="text-slate-300">
                          {locationDisplay}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        🏢 {v.agencyName}
                      </span>
                      <span className="flex items-center gap-1">
                        🏠 {v.accommodation?.type || "—"}
                      </span>
                      {v.salary?.baseNetto && (
                        <span className="text-slate-200 font-medium">
                          💰 {v.salary.baseNetto}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* КНОПКІ */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => setViewVacancy(v)}
                      className="px-3 py-1.5 text-slate-400 hover:bg-slate-800 rounded-lg text-xs transition-colors"
                    >
                      👁 Паглядзець
                    </button>
                    <button
                      onClick={() => setMatchVacancy(v)}
                      className="px-3 py-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs transition-colors"
                    >
                      🎯 Кандыдаты
                    </button>
                    <button
                      onClick={() => setEditVacancy(v)}
                      className="px-3 py-1.5 text-slate-400 hover:bg-slate-800 rounded-lg text-xs transition-colors"
                    >
                      ✏️ Рэд.
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ПЛАВАЮЧАЯ КНОПКА */}
      {isDirty && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <button
            onClick={handleApplyFilters}
            className="px-5 py-3 bg-emerald-500 text-slate-900 font-bold rounded-xl shadow-lg"
          >
            Паказаць {previewCount} вакансій ✓
          </button>
        </div>
      )}

      {/* МАДАЛКІ */}
      {editVacancy && (
        <EditVacancyModal
          vacancy={editVacancy}
          onClose={() => setEditVacancy(null)}
          onSave={handleSaveEdit}
        />
      )}
      {matchVacancy && (
        <VacancyMatchModal
          vacancy={matchVacancy}
          onClose={() => setMatchVacancy(null)}
        />
      )}
      {viewVacancy && (
        <VacancyViewModal
          vacancy={viewVacancy}
          onClose={() => setViewVacancy(null)}
          onEdit={(v) => {
            setViewVacancy(null);
            setEditVacancy(v);
          }}
          onDelete={(id) => {
            setViewVacancy(null);
            handleDelete(id);
          }}
          onMatch={(v) => {
            setViewVacancy(null);
            setMatchVacancy(v);
          }}
        />
      )}
    </div>

);
}

---

// frontend/src/pages/Templates.jsx
import { useEffect, useState } from "react";
import { getTemplates, deleteTemplate } from "../services/api";
import AddTemplateModal from "../components/templates/AddTemplateModal";
import EditTemplateModal from "../components/templates/EditTemplateModal";
import TemplateViewModal from "../components/templates/TemplateViewModal";

export default function Templates() {
const [templates, setTemplates] = useState([]);
const [loading, setLoading] = useState(true);
const [filterAgency, setFilterAgency] = useState("");
const [search, setSearch] = useState("");
const [showAddForm, setShowAddForm] = useState(false);
const [editTemplate, setEditTemplate] = useState(null);
const [viewTemplate, setViewTemplate] = useState(null);

const fetchTemplates = async () => {
setLoading(true);
try {
const res = await getTemplates();
setTemplates(res.data);
} catch {
console.error("Памылка загрузкі шаблонаў");
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchTemplates();
}, []);

const agencies = [...new Set(templates.map((t) => t.agencyName))].sort();

const filtered = templates.filter((t) => {
const matchAgency = !filterAgency || t.agencyName === filterAgency;
const q = search.toLowerCase().trim();
const matchSearch =
!q ||
t.templateName?.toLowerCase().includes(q) ||
t.title?.toLowerCase().includes(q) ||
t.location?.toLowerCase().includes(q) ||
t.keywords?.some((kw) => kw.toLowerCase().includes(q));
return matchAgency && matchSearch;
});

const handleDelete = async (id) => {
if (!confirm("Выдаліць шаблон?")) return;
try {
await deleteTemplate(id);
setTemplates((prev) => prev.filter((t) => t.\_id !== id));
} catch {
alert("Памылка выдалення");
}
};

const handleAdd = (newTemplate) => {
setTemplates((prev) => [...prev, newTemplate]);
};

const handleSaveEdit = (updated) => {
setTemplates((prev) =>
prev.map((t) => (t.\_id === updated.\_id ? updated : t)),
);
};

const handleEditFromView = (template) => {
setViewTemplate(null);
setEditTemplate(template);
};

return (

<div className="p-8">
{/_ Загаловак _/}
<div className="flex items-center justify-between mb-8">
<div>
<h1 className="text-2xl font-semibold text-slate-100">Шаблоны</h1>
<p className="text-sm text-slate-500 mt-1">
{filtered.length} з {templates.length} шаблонаў у {agencies.length}{" "}
агенцыях
</p>
</div>
<button
onClick={() => setShowAddForm(true)}
className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors" >
<span>＋</span> Новы шаблон
</button>
</div>

      {/* Пошук */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук па назве, фірме, горадзе, ключавых словах..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Фільтр па агенцыях */}
      {agencies.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilterAgency("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterAgency === ""
                ? "bg-emerald-500 text-slate-900"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Усе агенцыі
          </button>
          {agencies.map((a) => (
            <button
              key={a}
              onClick={() => setFilterAgency(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterAgency === a
                  ? "bg-emerald-500 text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      )}

      {/* Спіс шаблонаў */}
      {loading ? (
        <div className="text-slate-500 text-sm">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="text-4xl mb-3">📋</div>
          <div className="text-sm">
            {search
              ? `Нічога не знойдзена па «${search}»`
              : "Шаблонаў пакуль няма"}
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs text-emerald-500 hover:text-emerald-400"
            >
              Ачысціць пошук
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer"
              onClick={() => setViewTemplate(t)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono shrink-0">
                      {t.agencyName}
                    </span>
                    <h3 className="font-medium text-slate-100 truncate">
                      {t.templateName}
                    </h3>
                  </div>
                  {t.title && (
                    <p className="text-sm text-slate-400 mt-1 truncate">
                      {t.title}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.keywords?.slice(0, 6).map((kw) => (
                      <span
                        key={kw}
                        className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded"
                      >
                        {kw}
                      </span>
                    ))}
                    {t.keywords?.length > 6 && (
                      <span className="text-xs text-slate-600">
                        +{t.keywords.length - 6}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="flex gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setViewTemplate(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    title="Паглядзець"
                  >
                    👁
                  </button>
                  <button
                    onClick={() => setEditTemplate(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    title="Рэдагаваць"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                    title="Выдаліць"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddTemplateModal
          onClose={() => setShowAddForm(false)}
          onAdd={handleAdd}
        />
      )}

      {editTemplate && (
        <EditTemplateModal
          template={editTemplate}
          onClose={() => setEditTemplate(null)}
          onSave={handleSaveEdit}
        />
      )}

      {viewTemplate && (
        <TemplateViewModal
          template={viewTemplate}
          onClose={() => setViewTemplate(null)}
          onEdit={handleEditFromView}
        />
      )}
    </div>

);
}

---

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
getInboxMessages,
getInboxStats,
deleteInboxMessage,
bulkDeleteInbox,
getVacancies,
aiUpdateVacancy,
} from "../services/api";

const CATEGORY_LABELS = {
vacancy: {
label: "Вакансія",
color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
},
update: {
label: "Абнаўленне",
color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
},
info: {
label: "Інфа",
color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
},
};

const SOURCE_ICON = {
viber: "💜",
telegram: "✈️",
macrodroid_raw: "📱",
telegram_userbot: "🤖",
error_fallback: "⚠️",
};

export default function Inbox() {
const navigate = useNavigate();
const [messages, setMessages] = useState([]);
const [vacancies, setVacancies] = useState([]);
const [loading, setLoading] = useState(true);
const [stats, setStats] = useState({
total: 0,
vacancy: 0,
update: 0,
info: 0,
pendingAi: 0, // Новае поле для статыстыкі
});
const [categoryFilter, setCategoryFilter] = useState("all");
const [selected, setSelected] = useState(new Set());
const [expandedId, setExpandedId] = useState(null);
const [showUpdatePicker, setShowUpdatePicker] = useState(null);
const [processingId, setProcessingId] = useState(null);

const notifyUpdate = () => {
window.dispatchEvent(new CustomEvent("inboxUpdated"));
};

const fetchAll = useCallback(async () => {
try {
const [msgsRes, statsRes, vacRes] = await Promise.all([
getInboxMessages(),
getInboxStats(),
getVacancies(),
]);

      const msgs = msgsRes.data;
      setMessages(msgs);

      // Падлічваем колькасць тых, хто чакае AI, калі бэкенд яшчэ не аддае гэта ў stats
      const pendingAiCount = msgs.filter((m) => !m.aiAnalyzed).length;

      setStats({
        ...statsRes.data,
        pendingAi: pendingAiCount,
      });

      setVacancies(vacRes.data.filter((v) => v.status === "active"));
      notifyUpdate();
    } catch (err) {
      console.error("Памылка загрузкі:", err);
    } finally {
      setLoading(false);
    }

}, []);

useEffect(() => {
fetchAll();
}, [fetchAll]);

const handleDelete = async (id) => {
if (!window.confirm("Выдаліць паведамленне?")) return;
try {
await deleteInboxMessage(id);
setMessages((prev) => prev.filter((m) => m.\_id !== id));
notifyUpdate();
} catch (err) {
alert("Памылка выдалення");
}
};

const handleBulkDelete = async () => {
const ids = Array.from(selected);
if (!ids.length || !window.confirm(`Выдаліць ${ids.length} паведамленняў?`))
return;
try {
await bulkDeleteInbox({ ids });
setMessages((prev) => prev.filter((m) => !selected.has(m.\_id)));
setSelected(new Set());
notifyUpdate();
const res = await getInboxStats();
setStats(res.data);
} catch (err) {
alert("Памылка масавага выдалення");
}
};

const handleCreateVacancy = (msg) => {
navigate("/vacancies", {
state: { initialText: msg.rawText || msg.text, messageId: msg.\_id },
});
};

const handleAiUpdate = async (msg, vacancyId) => {
setProcessingId(msg.\_id);
try {
await aiUpdateVacancy(vacancyId, msg.rawText || msg.text, msg.\_id);
notifyUpdate();
alert("✅ Вакансія абноўлена!");
fetchAll();
} catch (err) {
alert("❌ Памылка: " + err.message);
} finally {
setProcessingId(null);
setShowUpdatePicker(null);
}
};

const toggleSelect = (id) => {
setSelected((prev) => {
const next = new Set(prev);
next.has(id) ? next.delete(id) : next.add(id);
return next;
});
};

const toggleSelectAll = () => {
if (selected.size === filtered.length) {
setSelected(new Set());
} else {
setSelected(new Set(filtered.map((m) => m.\_id)));
}
};

const filtered = messages.filter(
(m) => categoryFilter === "all" || m.category === categoryFilter,
);

if (loading)
return (

<div className="max-w-6xl mx-auto px-4 py-8 text-slate-500 text-center">
Загрузка...
</div>
);

return (

<div className="max-w-6xl mx-auto px-4 py-8">
<div className="flex items-start justify-between mb-6 flex-wrap gap-4">
<div>
<h1 className="text-2xl font-semibold text-slate-100">
Пясочніца (Inbox)
</h1>
<p className="text-sm text-slate-500 mt-1">
Апрацоўка ўваходных паведамленняў
</p>
</div>
<div className="flex gap-2">
{selected.size > 0 && (
<button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
            >
Выдаліць выбраныя ({selected.size})
</button>
)}
<button
            onClick={fetchAll}
            className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
Абнавіць спіс
</button>
</div>
</div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          {
            key: "all",
            label: "Усе",
            count: stats.total,
            color: "text-slate-300",
          },
          {
            key: "vacancy",
            label: "Вакансіі",
            count: stats.vacancy,
            color: "text-emerald-400",
          },
          {
            key: "update",
            label: "Абнаўленні",
            count: stats.update,
            color: "text-amber-400",
          },
          {
            key: "info",
            label: "Інфа",
            count: stats.info || 0,
            color: "text-blue-400",
          },
          {
            key: "pending",
            label: "Чакаюць AI",
            count: stats.pendingAi || 0,
            color: "text-indigo-400",
          },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => key !== "pending" && setCategoryFilter(key)}
            className={`bg-slate-900 border rounded-xl p-3 text-left transition-all ${categoryFilter === key ? "border-emerald-500/40 bg-emerald-500/5" : "border-slate-800"}`}
          >
            <div className={`text-2xl font-bold ${color}`}>{count}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_150px_100px_80px] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800 bg-slate-950">
          <input
            type="checkbox"
            checked={selected.size > 0 && selected.size === filtered.length}
            onChange={toggleSelectAll}
            className="accent-emerald-500"
          />
          <span>Змест паведамлення</span>
          <span>Агенцыя / Чат</span>
          <span>Час</span>
          <span className="text-right">Дзеянні</span>
        </div>

        <div className="divide-y divide-slate-800/50">
          {filtered.map((msg) => {
            const isExpanded = expandedId === msg._id;
            const isPicking = showUpdatePicker === msg._id;
            const isProcessing = processingId === msg._id;
            const cat = CATEGORY_LABELS[msg.category] || CATEGORY_LABELS.info;
            const isAnalyzed = msg.aiAnalyzed;

            return (
              <div
                key={msg._id}
                className={`${selected.has(msg._id) ? "bg-emerald-500/5" : ""} ${!isAnalyzed ? "opacity-70" : ""}`}
              >
                <div className="grid grid-cols-[40px_1fr_150px_100px_80px] gap-3 px-4 py-3 items-center hover:bg-slate-800/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={selected.has(msg._id)}
                    onChange={() => toggleSelect(msg._id)}
                    className="accent-emerald-500"
                  />
                  <div
                    className="min-w-0 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${cat.color}`}
                      >
                        {cat.label}
                      </span>

                      {/* СТАТУС AI */}
                      {isAnalyzed ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          ✨ Апрацавана
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 border-dashed font-medium">
                          ⏳ Не апрацавана
                        </span>
                      )}

                      {msg.agencyName && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {msg.agencyName}
                        </span>
                      )}
                      {msg.isTruncated && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold animate-pulse">
                          ⚠️ АБРЭЗАНА
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${isExpanded ? "text-slate-100" : "text-slate-400 truncate"}`}
                    >
                      {/* Паказваем пераклад, калі ён ёсць, інакш арыгінал */}
                      {isAnalyzed ? msg.rawText || msg.text : msg.text}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {SOURCE_ICON[msg.source] || "📩"} {msg.sender}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {new Date(msg.createdAt).toLocaleString("be-BY", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleCreateVacancy(msg)}
                      title="Стварыць"
                      disabled={!isAnalyzed}
                      className={`p-1.5 rounded-md ${isAnalyzed ? "hover:bg-emerald-500/20 text-emerald-500" : "text-slate-700 cursor-not-allowed"}`}
                    >
                      🤖
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-500 rounded-md"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-14 pb-4 animate-in fade-in slide-in-from-top-1">
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
                      {isAnalyzed ? msg.rawText || msg.text : msg.text}
                    </div>

                    {isAnalyzed && !isPicking && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleCreateVacancy(msg)}
                          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md transition-colors"
                        >
                          Стварыць вакансію
                        </button>
                        <button
                          onClick={() => setShowUpdatePicker(msg._id)}
                          className="text-xs bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-md transition-colors"
                        >
                          Абнавіць існуючую
                        </button>
                      </div>
                    )}

                    {isAnalyzed && isPicking && (
                      <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-amber-500/30">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            Выберыце вакансію:
                          </h4>
                          <button
                            onClick={() => setShowUpdatePicker(null)}
                            className="text-slate-500 hover:text-white text-xs"
                          >
                            Скасаваць
                          </button>
                        </div>
                        {isProcessing ? (
                          <div className="py-4 text-center text-amber-400 text-xs animate-pulse">
                            AI апрацоўвае...
                          </div>
                        ) : (
                          <div className="max-h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                            {vacancies.map((v) => (
                              <button
                                key={v._id}
                                onClick={() => handleAiUpdate(msg, v._id)}
                                className="w-full text-left p-2.5 text-xs hover:bg-slate-700 rounded border border-slate-700 text-slate-300 flex justify-between items-center group"
                              >
                                <span>
                                  <b className="text-emerald-500 mr-2">
                                    {v.vacancyCode}
                                  </b>
                                  {v.templateName || v.vacancydescription}
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                                  Выбраць
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!isAnalyzed && (
                      <div className="mt-3 text-[10px] text-slate-500 italic">
                        Паведамленне чакае чарговай ітэрацыі AI-аналізу (кожныя
                        10 хвілін)...
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>

);
}

---

// frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVacancies } from "../services/api";
import VacancyViewModal from "../components/vacancies/VacancyViewModal";
import ApplyModal from "../components/vacancies/ApplyModal";

const STATUS_COLORS = {
active: "bg-emerald-500/10 text-emerald-400",
closed: "bg-red-500/10 text-red-400",
archived: "bg-slate-500/10 text-slate-400",
};

export default function Home() {
const [vacancies, setVacancies] = useState([]);
const [loading, setLoading] = useState(true);
const [stats, setStats] = useState({ total: 0, active: 0, today: 0 });
const [viewVacancy, setViewVacancy] = useState(null);
const [applyVacancy, setApplyVacancy] = useState(null);
const [applyType, setApplyType] = useState(null);
useEffect(() => {
const load = async () => {
try {
const res = await getVacancies();
const all = res.data;
const today = new Date();
today.setHours(0, 0, 0, 0);

        setStats({
          total: all.length,
          active: all.filter((v) => v.status === "active").length,
          today: all.filter((v) => new Date(v.createdAt) >= today).length,
        });

        // 4 самых свежых актыўных вакансіі
        setVacancies(all.filter((v) => v.status === "active").slice(0, 4));
      } catch {
        console.error("Памылка загрузкі");
      } finally {
        setLoading(false);
      }
    };
    load();

}, []);

return (

<div className="min-h-screen bg-slate-950">
{/_ HERO _/}
<section className="relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-slate-950 to-slate-950" />
<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
<div className="max-w-3xl">
<div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
<span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
<span className="text-emerald-400 text-sm font-medium">
{stats.today > 0
? `+${stats.today} вакансій сёння`
: "Сістэма актыўная"}
</span>
</div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-100 leading-tight mb-6">
              Работа ў Польшчы
              <span className="block text-emerald-400">для ўкраінцаў</span>
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              Актуальныя вакансіі ад правераных агенцый. Безкаштоўнае
              пасрэдніцтва, афіцыйнае аформленне, жытло і транспарт.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/vacancies"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-colors"
              >
                Усе вакансіі &#8594;
              </Link>

              <a
                href="#vacancies"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-xl transition-colors"
              >
                Свежыя вакансіі
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* СТАТЫСТЫКА */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Усяго вакансій", value: stats.total },
            { label: "Актыўных", value: stats.active },
            { label: "Дадана сёння", value: stats.today },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center"
            >
              <div className="text-3xl font-bold text-emerald-400">
                {s.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* СВЕЖЫЯ ВАКАНСІІ */}
      <section
        id="vacancies"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Свежыя вакансіі
          </h2>
          <Link
            to="/vacancies"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Усе вакансіі &#8594;
          </Link>
        </div>

        {loading ? (
          <div className="text-slate-500 text-sm">Загрузка...</div>
        ) : vacancies.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <div className="text-3xl mb-2">💼</div>
            <div className="text-sm">Вакансій пакуль няма</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((v) => (
              <div
                key={v._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {v.vacancyCode && (
                        <span className="text-xs font-mono text-slate-600">
                          {v.vacancyCode}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}
                      >
                        Актыўная
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-100 truncate">
                      {v.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
                  <span>📍 {v.location}</span>
                  {v.agencyName && v.agencyName !== "Manual" && (
                    <span>🏢 {v.agencyName}</span>
                  )}
                  {v.salary?.base && <span>💰 {v.salary.base}</span>}
                  {v.requirements?.gender && (
                    <span>👤 {v.requirements.gender}</span>
                  )}
                  {v.arrivalDate && <span>📅 {v.arrivalDate}</span>}
                </div>

                <div className="text-xs text-slate-600">
                  {new Date(v.createdAt).toLocaleString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {/* Кнопкі */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setViewVacancy(v)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                  >
                    👁 Паглядзець
                  </button>
                  {v.status === "active" && (
                    <button
                      onClick={() => {
                        setApplyVacancy(v);
                        setApplyType("want_work");
                      }}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs rounded-lg transition-colors"
                    >
                      🟢 Хачу тут працаваць
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ФУТАР */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs">
                RC
              </div>
              <span className="text-sm text-slate-400">RecrutCRM</span>
            </div>
            <div className="text-xs text-slate-600">
              © 2026 · Безкаштоўнае пасрэдніцтва · Афіцыйнае аформленне
            </div>
          </div>
        </div>
      </footer>
      {viewVacancy && (
        <VacancyViewModal
          vacancy={viewVacancy}
          onClose={() => setViewVacancy(null)}
          onApply={(v, type) => {
            setViewVacancy(null);
            setApplyVacancy(v);
            setApplyType(type);
          }}
        />
      )}

      {applyVacancy && (
        <ApplyModal
          vacancy={applyVacancy}
          applyType={applyType}
          onClose={() => {
            setApplyVacancy(null);
            setApplyType(null);
          }}
        />
      )}
    </div>

);
}

---

// frontend/src/pages/Candidates.jsx
import { useEffect, useState, useMemo } from "react";
import { getCandidates, deleteCandidate } from "../services/api";
import ProfileModal from "../components/candidates/ProfileModal";
import AddCandidateModal from "../components/candidates/AddCandidateModal";
import CandidateFilters from "../components/candidates/CandidateFilters";
import { EMPTY_CANDIDATE_FILTERS } from "../constants/filters";

const STATUS_COLORS = {
new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
waiting: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
employed: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
left: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
blacklist: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATUS_LABELS = {
new: "Новы",
active: "Актыўны",
waiting: "Чакае",
employed: "Працуе",
left: "Сышоў",
blacklist: "Блэкліст",
};

function applyFilters(candidates, filters) {
return candidates.filter((c) => {
// Пошук
if (filters.search) {
const s = filters.search.toLowerCase();
if (
!c.name?.toLowerCase().includes(s) &&
!c.phone?.toLowerCase().includes(s) &&
!c.telegram?.toLowerCase().includes(s) &&
!c.currentLocation?.toLowerCase().includes(s)
)
return false;
}

    // Статус
    if (filters.status && c.status !== filters.status) return false;

    // Гендар
    if (filters.gender.length > 0) {
      if (!filters.gender.includes(c.gender)) return false;
    }

    // Нацыянальнасць
    if (filters.nationality.length > 0) {
      if (
        !filters.nationality.some(
          (n) => c.nationality?.toLowerCase() === n.toLowerCase(),
        )
      )
        return false;
    }

    // Сфера
    if (filters.sphere.length > 0) {
      const prefs = c.jobPreferences?.spheres || [];
      if (!filters.sphere.some((s) => prefs.includes(s))) return false;
    }

    // Лакацыя
    if (filters.location.length > 0) {
      const match = filters.location.some((l) => {
        if (l === "any") return c.jobPreferences?.locationFlexible;
        if (l === "city_area") return c.jobPreferences?.locationRadius;
        if (l === "region") return c.jobPreferences?.locationRadius;
        if (l === "city")
          return (
            !c.jobPreferences?.locationFlexible &&
            !c.jobPreferences?.locationRadius
          );
        return false;
      });
      if (!match) return false;
    }

    // Жытло
    if (filters.accommodation.length > 0) {
      const match = filters.accommodation.some((a) => {
        if (a === "needs") return c.jobPreferences?.needsAccommodation;
        if (a === "own") return !c.jobPreferences?.needsAccommodation;
        return false;
      });
      if (!match) return false;
    }

    // Група
    if (filters.travelGroup.length > 0) {
      if (!filters.travelGroup.includes(c.jobPreferences?.travelGroup))
        return false;
    }

    // Графік
    if (filters.schedule.length > 0) {
      const prefs = c.jobPreferences?.schedule || [];
      if (!filters.schedule.some((s) => prefs.includes(s))) return false;
    }

    // Дакументы
    if (filters.docs.length > 0) {
      const match = filters.docs.some((d) => {
        if (d === "visa") return c.documents?.hasVisa;
        if (d === "sanepid") return c.documents?.hasSanepid;
        if (d === "udt") return c.documents?.hasUDT;
        return false;
      });
      if (!match) return false;
    }

    // Крыніца
    if (filters.source.length > 0) {
      if (!filters.source.includes(c.source)) return false;
    }

    return true;

});
}

export default function Candidates() {
const [candidates, setCandidates] = useState([]);
const [loading, setLoading] = useState(true);
const [profileId, setProfileId] = useState(null);
const [showAddForm, setShowAddForm] = useState(false);
const [draft, setDraft] = useState(EMPTY_CANDIDATE_FILTERS);
const [applied, setApplied] = useState(EMPTY_CANDIDATE_FILTERS);
const [sidebarOpen, setSidebarOpen] = useState(false);

useEffect(() => {
const load = async () => {
setLoading(true);
try {
const res = await getCandidates();
setCandidates(res.data);
} catch {
console.error("Памылка загрузкі кандыдатаў");
} finally {
setLoading(false);
}
};
load();
}, []);

const previewCount = useMemo(
() => applyFilters(candidates, draft).length,
[candidates, draft],
);

const filtered = useMemo(
() => applyFilters(candidates, applied),
[candidates, applied],
);

const isDirty = JSON.stringify(draft) !== JSON.stringify(applied);

const handleApplyFilters = () => {
setApplied(draft);
setSidebarOpen(false);
};

const handleResetFilters = () => {
setDraft(EMPTY_CANDIDATE_FILTERS);
setApplied(EMPTY_CANDIDATE_FILTERS);
};

const handleDelete = async (id) => {
if (!confirm("Выдаліць кандыдата?")) return;
try {
await deleteCandidate(id);
setCandidates((prev) => prev.filter((c) => c.\_id !== id));
} catch {
alert("Памылка выдалення");
}
};

const handleUpdate = (updated) => {
setCandidates((prev) =>
prev.map((c) => (c.\_id === updated.\_id ? updated : c)),
);
};

const handleAdd = (newCandidate) => {
setCandidates((prev) => [newCandidate, ...prev]);
};

return (

<div className="flex min-h-screen bg-slate-950">
{/_ САЙДБАР — дэсктоп _/}
<aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-800 bg-slate-900/50 sticky top-16 h-[calc(100vh-4rem)]">
<div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
<span className="text-sm font-medium text-slate-300">Фільтры</span>
{isDirty && (
<button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
Скінуць
</button>
)}
</div>
<CandidateFilters draft={draft} onChange={setDraft} />
</aside>

      {/* САЙДБАР — мабільны */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-sm font-medium text-slate-300">
                Фільтры
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-500 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CandidateFilters draft={draft} onChange={setDraft} />
            </div>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm rounded-lg transition-colors"
              >
                Паказаць {previewCount} кандыдатаў
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ГАЛОЎНАЯ ВОБЛАСЦЬ */}
      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
            >
              ⚙️ Фільтры
              {isDirty && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">
                Кандыдаты
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {filtered.length} з {candidates.length} кандыдатаў
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            <span>＋</span> Дадаць кандыдата
          </button>
        </div>

        {/* Спіс */}
        {loading ? (
          <div className="text-slate-500 text-sm">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-sm">
              Кандыдатаў па гэтых фільтрах не знойдзена
            </div>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors"
            >
              Скінуць фільтры
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer"
                onClick={() => setProfileId(c._id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}
                      >
                        {STATUS_LABELS[c.status]}
                      </span>
                      <span className="text-xs text-slate-600">
                        {c.source === "site"
                          ? "🌐 Сайт"
                          : c.source === "telegram_bot"
                            ? "✈️ Telegram"
                            : "✋ Ручны"}
                      </span>
                      <span className="text-xs text-slate-700">
                        {new Date(c.createdAt).toLocaleDateString("uk-UA")}
                      </span>
                    </div>

                    <h3 className="font-medium text-slate-100">{c.name}</h3>

                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                      {c.contactType === "telegram" && c.telegram && (
                        <span>✈️ {c.telegram}</span>
                      )}
                      {(c.contactType === "viber" ||
                        c.contactType === "phone") &&
                        c.phone && <span>📞 {c.phone}</span>}
                      {c.nationality && <span>🌍 {c.nationality}</span>}
                      {c.currentLocation && <span>📍 {c.currentLocation}</span>}
                      {c.age && <span>🎂 {c.age} г.</span>}
                      {c.gender && (
                        <span>{c.gender === "female" ? "👩" : "👨"}</span>
                      )}
                    </div>

                    {c.jobPreferences?.locationFlexible && (
                      <div className="mt-2 text-xs text-slate-600">
                        🔍 Гатовы да пераезду
                      </div>
                    )}
                    {!c.jobPreferences?.locationFlexible &&
                      c.jobPreferences?.location && (
                        <div className="mt-2 text-xs text-slate-600">
                          🔍 Шукае: {c.jobPreferences.location}
                        </div>
                      )}
                  </div>

                  <div
                    className="flex gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setProfileId(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                    >
                      👤 Профіль
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ПЛАВАЮЧАЯ КНОПКА */}
      {isDirty && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            Паказаць {previewCount} кандыдатаў ✓
          </button>
        </div>
      )}

      {profileId && (
        <ProfileModal
          candidateId={profileId}
          onClose={() => setProfileId(null)}
          onUpdate={handleUpdate}
        />
      )}
      {showAddForm && (
        <AddCandidateModal
          onClose={() => setShowAddForm(false)}
          onAdd={handleAdd}
        />
      )}
    </div>

);
}

---

//Layout.jsx
import { useState, useEffect, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import { getInboxStats } from "../services/api";

const NAV_ITEMS = [
{ to: "/", label: "Галоўная", exact: true },
{ to: "/vacancies", label: "Вакансіі" },
{ to: "/candidates", label: "Кандыдаты" },
{ to: "/templates", label: "Шаблоны" },
{ to: "/agencies", label: "Агенцыі" },
{ to: "/inbox", label: "Уваходныя" },
];

export default function Layout({ children }) {
const [menuOpen, setMenuOpen] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);

// Функцыя загрузкі статыстыкі
const fetchUnread = useCallback(async () => {
try {
const res = await getInboxStats();
setUnreadCount(res.data.total || 0);
} catch (err) {
console.error("Error fetching stats:", err);
}
}, []);

useEffect(() => {
// Выкарыстоўваем setTimeout, каб пазбегнуць памылкі "cascading renders"
// Гэта робіць выклік асінхронным адносна цела эфекту
const timeoutId = setTimeout(() => {
fetchUnread();
}, 0);

    // Слухаем падзею абнаўлення інбокса
    const handleUpdate = () => fetchUnread();
    window.addEventListener("inboxUpdated", handleUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("inboxUpdated", handleUpdate);
    };

}, [fetchUnread]);

return (

<div className="min-h-screen bg-slate-950 text-slate-100 font-['IBM_Plex_Sans']">
<header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex items-center justify-between h-16">
<Link to="/" className="flex items-center gap-3 shrink-0">
<div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">
RC
</div>
<span className="font-semibold text-slate-100 hidden sm:block">
RecrutCRM
</span>
</Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }`
                  }
                >
                  {item.label}
                  {item.to === "/inbox" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="relative">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      menuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
                {!menuOpen && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
                )}
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900">
            <nav className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800"
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.to === "/inbox" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
      <main className="pt-16">{children}</main>
    </div>

);
}

---

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

---

// frontend/src/components/candidates/AddCandidateModal.jsx
import { useState } from "react";
import { createCandidate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

const STATUS_LABELS = {
new: "Новы",
active: "Актыўны",
waiting: "Чакае",
employed: "Працуе",
left: "Сышоў",
blacklist: "Блэкліст",
};

const EMPTY_FORM = {
name: "",
contactType: "telegram",
telegram: "",
phone: "",
nationality: "",
currentLocation: "",
age: "",
gender: "",
status: "new",
source: "manual",
notes: "",
jobPreferences: {
location: "",
locationFlexible: false,
schedule: [],
contractType: "any",
needsAccommodation: false,
travelGroup: "alone",
readyDate: "",
},
documents: {
hasVisa: false,
hasSanepid: false,
hasUDT: false,
},
};

export default function AddCandidateModal({ onClose, onAdd }) {
const [form, setForm] = useState(EMPTY_FORM);
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

const toggleSchedule = (val) => {
setForm((prev) => {
const cur = prev.jobPreferences.schedule;
const next = cur.includes(val)
? cur.filter((s) => s !== val)
: [...cur, val];
return {
...prev,
jobPreferences: { ...prev.jobPreferences, schedule: next },
};
});
};

const handleSave = async () => {
if (!form.name.trim()) return alert("Увядзіце імя");
setSaving(true);
try {
const res = await createCandidate({
...form,
age: form.age ? Number(form.age) : undefined,
});
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
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<h2 className="font-semibold text-slate-100">Новы кандыдат</h2>
<button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
✕
</button>
</div>

        <div className="px-6 py-5 space-y-4">
          <Field
            label="Імя і прозвішча *"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="Іван Іваноў"
          />

          <Divider label="📞 Сувязь" />
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              Спосаб сувязі
            </label>
            <div className="flex gap-2 mb-3">
              {["telegram", "viber", "phone"].map((ct) => (
                <button
                  key={ct}
                  onClick={() => setField("contactType", ct)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.contactType === ct
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {ct === "telegram"
                    ? "✈️ Telegram"
                    : ct === "viber"
                      ? "📱 Viber"
                      : "📞 Тэлефон"}
                </button>
              ))}
            </div>
            {form.contactType === "telegram" ? (
              <Field
                label="Telegram username"
                value={form.telegram}
                onChange={(v) => setField("telegram", v)}
                placeholder="@username"
              />
            ) : (
              <Field
                label="Нумар тэлефона"
                value={form.phone}
                onChange={(v) => setField("phone", v)}
                placeholder="+380XXXXXXXXX"
              />
            )}
          </div>

          <Divider label="👤 Асабістыя дадзеныя" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Нацыянальнасць"
              value={form.nationality}
              onChange={(v) => setField("nationality", v)}
              placeholder="Украіна"
            />
            <Field
              label="Дзе знаходзіцца"
              value={form.currentLocation}
              onChange={(v) => setField("currentLocation", v)}
              placeholder="Кіеў"
            />
            <Field
              label="Узрост"
              value={form.age}
              type="number"
              onChange={(v) => setField("age", v)}
            />
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Гендар
              </label>
              <div className="flex gap-2">
                {[
                  ["male", "👨 Мужчына"],
                  ["female", "👩 Жанчына"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setField("gender", val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.gender === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Статус</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setField("status", val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.status === val
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <Divider label="🔍 Пажаданні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Дзе шукае працу"
              value={form.jobPreferences.location}
              onChange={(v) => setField("jobPreferences.location", v)}
              placeholder="Варшава"
            />
            <Field
              label="Гатовы з"
              value={form.jobPreferences.readyDate}
              onChange={(v) => setField("jobPreferences.readyDate", v)}
              placeholder="01.05.2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Патрэбна жытло
              </label>
              <div className="flex gap-2">
                {[
                  ["true", "Так"],
                  ["false", "Не"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setField(
                        "jobPreferences.needsAccommodation",
                        val === "true",
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      String(form.jobPreferences.needsAccommodation) === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">Еду</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["alone", "Адзін/а"],
                  ["couple", "Пара"],
                  ["family", "Сям'я"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setField("jobPreferences.travelGroup", val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.jobPreferences.travelGroup === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Графік</label>
            <div className="flex gap-2">
              {[
                ["1_shift", "1 змена"],
                ["2_shifts", "2 змены"],
                ["3_shifts", "3 змены"],
              ].map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => toggleSchedule(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.jobPreferences.schedule.includes(val)
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <Divider label="📄 Дакументы" />
          <div className="flex gap-4 flex-wrap">
            {[
              ["hasVisa", "Віза"],
              ["hasSanepid", "Санепід"],
              ["hasUDT", "UDT"],
            ].map(([key, lbl]) => (
              <button
                key={key}
                onClick={() =>
                  setField(`documents.${key}`, !form.documents[key])
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  form.documents[key]
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {form.documents[key] ? "✅" : "❌"} {lbl}
              </button>
            ))}
          </div>

          <Divider label="📝 Нататкі" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Нататкі рэкрутэра
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={3}
              placeholder="Любая дадатковая інфармацыя..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
          >
            {saving ? "Захаванне..." : "Захаваць"}
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

---

// frontend/src/components/candidates/CandidateFilters.jsx
import { EMPTY_CANDIDATE_FILTERS } from "../../constants/filters";

const SPHERES = [
{ value: "warehouse", label: "Склад" },
{ value: "food_production", label: "Харчаванне" },
{ value: "automotive", label: "Аўтазавод" },
{ value: "agriculture", label: "Сельская гаспадарка" },
{ value: "retail", label: "Магазін" },
{ value: "other", label: "Іншае" },
];

function Section({ label, children }) {
return (

<div className="mb-5">
<p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
{label}
</p>
{children}
</div>
);
}

function MultiBtn({ value, label, active, onClick }) {
return (
<button
onClick={() => onClick(value)}
className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors mb-1 mr-1 ${
        active
          ? "bg-emerald-500 text-slate-900"
          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
      }`} >
{label}
</button>
);
}

export default function CandidateFilters({ draft, onChange }) {
const toggle = (key, value) => {
const cur = draft[key];
const next = cur.includes(value)
? cur.filter((v) => v !== value)
: [...cur, value];
onChange({ ...draft, [key]: next });
};

const activeCount = Object.entries(draft).filter(([k, v]) => {
if (k === "search") return v.length > 0;
if (k === "status") return v !== "";
return Array.isArray(v) && v.length > 0;
}).length;

return (

<div className="h-full overflow-y-auto px-4 py-5">
{/_ Пошук _/}
<Section label="Пошук">
<div className="relative">
<input
type="text"
value={draft.search}
onChange={(e) => onChange({ ...draft, search: e.target.value })}
placeholder="Імя, тэлефон, горад..."
className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
/>
{draft.search && (
<button
onClick={() => onChange({ ...draft, search: "" })}
className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs" >
✕
</button>
)}
</div>
</Section>

      {/* Статус */}
      <Section label="Статус">
        <div className="flex flex-wrap">
          {[
            { value: "", label: "Усе" },
            { value: "new", label: "Новы" },
            { value: "active", label: "Актыўны" },
            { value: "waiting", label: "Чакае" },
            { value: "employed", label: "Працуе" },
            { value: "left", label: "Сышоў" },
            { value: "blacklist", label: "Блэкліст" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => onChange({ ...draft, status: s.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors mb-1 mr-1 ${
                draft.status === s.value
                  ? "bg-emerald-500 text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Гендар */}
      <Section label="Гендар">
        <div className="flex flex-wrap">
          {[
            { value: "female", label: "👩 Жанчыны" },
            { value: "male", label: "👨 Мужчыны" },
          ].map((g) => (
            <MultiBtn
              key={g.value}
              value={g.value}
              label={g.label}
              active={draft.gender.includes(g.value)}
              onClick={(v) => toggle("gender", v)}
            />
          ))}
        </div>
      </Section>

      {/* Нацыянальнасць */}
      <Section label="Нацыянальнасць">
        <div className="flex flex-wrap">
          {[
            { value: "Україна", label: "🇺🇦 Украіна" },
            { value: "Молдова", label: "🇲🇩 Малдова" },
            { value: "Білорусь", label: "🇧🇾 Беларусь" },
          ].map((n) => (
            <MultiBtn
              key={n.value}
              value={n.value}
              label={n.label}
              active={draft.nationality.includes(n.value)}
              onClick={(v) => toggle("nationality", v)}
            />
          ))}
        </div>
      </Section>

      {/* Сфера */}
      <Section label="Сфера">
        <div className="flex flex-wrap">
          {SPHERES.map((s) => (
            <MultiBtn
              key={s.value}
              value={s.value}
              label={s.label}
              active={draft.sphere.includes(s.value)}
              onClick={(v) => toggle("sphere", v)}
            />
          ))}
        </div>
      </Section>

      {/* Лакацыя */}
      <Section label="Лакацыя">
        <div className="flex flex-wrap">
          {[
            { value: "city", label: "📍 Канкрэтны горад" },
            { value: "city_area", label: "🏘 Горад + 50км" },
            { value: "region", label: "🗺 Рэгіён/ваяводства" },
            { value: "any", label: "✈️ Без розніцы" },
          ].map((l) => (
            <MultiBtn
              key={l.value}
              value={l.value}
              label={l.label}
              active={draft.location.includes(l.value)}
              onClick={(v) => toggle("location", v)}
            />
          ))}
        </div>
      </Section>

      {/* Жытло */}
      <Section label="Жытло">
        <div className="flex flex-wrap">
          {[
            { value: "needs", label: "🏠 Патрэбна жытло" },
            { value: "own", label: "❌ Сваё жытло" },
          ].map((a) => (
            <MultiBtn
              key={a.value}
              value={a.value}
              label={a.label}
              active={draft.accommodation.includes(a.value)}
              onClick={(v) => toggle("accommodation", v)}
            />
          ))}
        </div>
      </Section>

      {/* Група */}
      <Section label="Еду">
        <div className="flex flex-wrap">
          {[
            { value: "alone", label: "👤 Адзін/а" },
            { value: "couple", label: "👫 Пара" },
            { value: "family", label: "👨‍👩‍👧 Сям'я" },
          ].map((g) => (
            <MultiBtn
              key={g.value}
              value={g.value}
              label={g.label}
              active={draft.travelGroup.includes(g.value)}
              onClick={(v) => toggle("travelGroup", v)}
            />
          ))}
        </div>
      </Section>

      {/* Графік */}
      <Section label="Графік">
        <div className="flex flex-wrap">
          {[
            { value: "1_shift", label: "1 змена" },
            { value: "2_shifts", label: "2 змены" },
            { value: "3_shifts", label: "3 змены" },
          ].map((s) => (
            <MultiBtn
              key={s.value}
              value={s.value}
              label={s.label}
              active={draft.schedule.includes(s.value)}
              onClick={(v) => toggle("schedule", v)}
            />
          ))}
        </div>
      </Section>

      {/* Дакументы */}
      <Section label="Дакументы">
        <div className="flex flex-wrap">
          {[
            { value: "visa", label: "Віза/Пабыт" },
            { value: "sanepid", label: "Санепід" },
            { value: "udt", label: "UDT" },
          ].map((d) => (
            <MultiBtn
              key={d.value}
              value={d.value}
              label={d.label}
              active={draft.docs.includes(d.value)}
              onClick={(v) => toggle("docs", v)}
            />
          ))}
        </div>
      </Section>

      {/* Крыніца */}
      <Section label="Крыніца">
        <div className="flex flex-wrap">
          {[
            { value: "site", label: "🌐 Сайт" },
            { value: "manual", label: "✋ Ручны" },
            { value: "telegram_bot", label: "✈️ Telegram" },
          ].map((s) => (
            <MultiBtn
              key={s.value}
              value={s.value}
              label={s.label}
              active={draft.source.includes(s.value)}
              onClick={(v) => toggle("source", v)}
            />
          ))}
        </div>
      </Section>

      {/* Скінуць */}
      {activeCount > 0 && (
        <button
          onClick={() => onChange(EMPTY_CANDIDATE_FILTERS)}
          className="w-full mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors"
        >
          Скінуць усе фільтры ({activeCount})
        </button>
      )}
    </div>

);
}

---

// frontend/src/components/candidates/EditCandidateModal.jsx
import { useState } from "react";
import { updateCandidate } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

const STATUS_LABELS = {
new: "Новы",
active: "Актыўны",
waiting: "Чакае",
employed: "Працуе",
left: "Сышоў",
blacklist: "Блэкліст",
};

export default function EditCandidateModal({ candidate, onClose, onSave }) {
const [form, setForm] = useState({
name: candidate.name || "",
contactType: candidate.contactType || "telegram",
telegram: candidate.telegram || "",
phone: candidate.phone || "",
nationality: candidate.nationality || "",
currentLocation: candidate.currentLocation || "",
age: candidate.age || "",
gender: candidate.gender || "",
status: candidate.status || "new",
notes: candidate.notes || "",
blacklistReason: candidate.blacklistReason || "",
jobPreferences: {
location: candidate.jobPreferences?.location || "",
locationFlexible: candidate.jobPreferences?.locationFlexible || false,
schedule: candidate.jobPreferences?.schedule || [],
contractType: candidate.jobPreferences?.contractType || "any",
needsAccommodation: candidate.jobPreferences?.needsAccommodation || false,
travelGroup: candidate.jobPreferences?.travelGroup || "alone",
readyDate: candidate.jobPreferences?.readyDate || "",
notes: candidate.jobPreferences?.notes || "",
},
documents: {
hasVisa: candidate.documents?.hasVisa || false,
hasSanepid: candidate.documents?.hasSanepid || false,
hasUDT: candidate.documents?.hasUDT || false,
other: candidate.documents?.other || [],
},
});
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

const toggleSchedule = (val) => {
setForm((prev) => {
const cur = prev.jobPreferences.schedule;
const next = cur.includes(val)
? cur.filter((s) => s !== val)
: [...cur, val];
return {
...prev,
jobPreferences: { ...prev.jobPreferences, schedule: next },
};
});
};

const handleSave = async () => {
if (!form.name.trim()) return alert("Увядзіце імя");
setSaving(true);
try {
const res = await updateCandidate(candidate.\_id, {
...form,
age: form.age ? Number(form.age) : undefined,
});
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
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<h2 className="font-semibold text-slate-100">
Рэдагаванне кандыдата
</h2>
<p className="text-xs text-slate-500 mt-0.5">{candidate.name}</p>
</div>
<button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
✕
</button>
</div>

        <div className="px-6 py-5 space-y-4">
          <Field
            label="Імя і прозвішча *"
            value={form.name}
            onChange={(v) => setField("name", v)}
          />

          <Divider label="📞 Сувязь" />
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              Спосаб сувязі
            </label>
            <div className="flex gap-2 mb-3">
              {["telegram", "viber", "phone"].map((ct) => (
                <button
                  key={ct}
                  onClick={() => setField("contactType", ct)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.contactType === ct
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {ct === "telegram"
                    ? "✈️ Telegram"
                    : ct === "viber"
                      ? "📱 Viber"
                      : "📞 Тэлефон"}
                </button>
              ))}
            </div>
            {form.contactType === "telegram" ? (
              <Field
                label="Telegram username"
                value={form.telegram}
                onChange={(v) => setField("telegram", v)}
                placeholder="@username"
              />
            ) : (
              <Field
                label="Нумар тэлефона"
                value={form.phone}
                onChange={(v) => setField("phone", v)}
                placeholder="+380XXXXXXXXX"
              />
            )}
          </div>

          <Divider label="👤 Асабістыя дадзеныя" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Нацыянальнасць"
              value={form.nationality}
              onChange={(v) => setField("nationality", v)}
            />
            <Field
              label="Дзе знаходзіцца"
              value={form.currentLocation}
              onChange={(v) => setField("currentLocation", v)}
            />
            <Field
              label="Узрост"
              value={form.age}
              type="number"
              onChange={(v) => setField("age", v)}
            />
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Гендар
              </label>
              <div className="flex gap-2">
                {[
                  ["male", "👨 Мужчына"],
                  ["female", "👩 Жанчына"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setField("gender", val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.gender === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Статус</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setField("status", val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.status === val
                      ? "bg-emerald-500 text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Прычына блэкліста */}
          {form.status === "blacklist" && (
            <Field
              label="Прычына блэкліста"
              value={form.blacklistReason}
              onChange={(v) => setField("blacklistReason", v)}
              placeholder="Апішыце прычыну..."
            />
          )}

          <Divider label="🔍 Пажаданні" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Дзе шукае працу"
              value={form.jobPreferences.location}
              onChange={(v) => setField("jobPreferences.location", v)}
            />
            <Field
              label="Гатовы з"
              value={form.jobPreferences.readyDate}
              onChange={(v) => setField("jobPreferences.readyDate", v)}
              placeholder="01.05.2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Гатовы да пераезду
              </label>
              <div className="flex gap-2">
                {[
                  ["true", "Так"],
                  ["false", "Не"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setField(
                        "jobPreferences.locationFlexible",
                        val === "true",
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      String(form.jobPreferences.locationFlexible) === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Патрэбна жытло
              </label>
              <div className="flex gap-2">
                {[
                  ["true", "Так"],
                  ["false", "Не"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setField(
                        "jobPreferences.needsAccommodation",
                        val === "true",
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      String(form.jobPreferences.needsAccommodation) === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Еду</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["alone", "Адзін/а"],
                  ["couple", "Пара"],
                  ["family", "Сям'я"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setField("jobPreferences.travelGroup", val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.jobPreferences.travelGroup === val
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Графік
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["1_shift", "1 зм."],
                  ["2_shifts", "2 зм."],
                  ["3_shifts", "3 зм."],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => toggleSchedule(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.jobPreferences.schedule.includes(val)
                        ? "bg-emerald-500 text-slate-900"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Divider label="📄 Дакументы" />
          <div className="flex gap-4 flex-wrap">
            {[
              ["hasVisa", "Віза"],
              ["hasSanepid", "Санепід"],
              ["hasUDT", "UDT"],
            ].map(([key, lbl]) => (
              <button
                key={key}
                onClick={() =>
                  setField(`documents.${key}`, !form.documents[key])
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  form.documents[key]
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {form.documents[key] ? "✅" : "❌"} {lbl}
              </button>
            ))}
          </div>

          <Divider label="📝 Нататкі" />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Нататкі рэкрутэра
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={3}
              placeholder="Любая дадатковая інфармацыя..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

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

---

// frontend/src/components/candidates/ProfileModal.jsx
import { useEffect, useState } from "react";
import {
getCandidate,
updateCandidate,
addCandidateHistory,
matchVacanciesForCandidate,
} from "../../services/api";
import Divider from "../shared/Divider";
import EditCandidateModal from "./EditCandidateModal";

const STATUS_COLORS = {
new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
waiting: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
employed: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
left: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
blacklist: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATUS_LABELS = {
new: "Новы",
active: "Актыўны",
waiting: "Чакае",
employed: "Працуе",
left: "Сышоў",
blacklist: "Блэкліст",
};

export default function ProfileModal({ candidateId, onClose, onUpdate }) {
const [candidate, setCandidate] = useState(null);
const [loading, setLoading] = useState(true);
const [newNote, setNewNote] = useState("");
const [addingNote, setAddingNote] = useState(false);
const [editStatus, setEditStatus] = useState(false);
const [showEdit, setShowEdit] = useState(false);
const [matchedVacancies, setMatchedVacancies] = useState(null);
const [matchLoading, setMatchLoading] = useState(false);

const handleMatch = async () => {
setMatchLoading(true);
try {
const res = await matchVacanciesForCandidate(candidate.\_id);
setMatchedVacancies(res.data);
} catch {
alert("Памылка матчынгу");
} finally {
setMatchLoading(false);
}
};
useEffect(() => {
const load = async () => {
try {
const res = await getCandidate(candidateId);
setCandidate(res.data);
} catch {
console.error("Памылка загрузкі профілю");
} finally {
setLoading(false);
}
};
load();
}, [candidateId]);

const handleStatusChange = async (newStatus) => {
try {
const res = await updateCandidate(candidate.\_id, { status: newStatus });
setCandidate(res.data);
onUpdate(res.data);
setEditStatus(false);
} catch {
alert("Памылка змены статусу");
}
};

const handleAddNote = async () => {
if (!newNote.trim()) return;
setAddingNote(true);
try {
const res = await addCandidateHistory(candidate.\_id, {
type: "note",
text: newNote,
});
setCandidate(res.data);
setNewNote("");
} catch {
alert("Памылка дадання нататкі");
} finally {
setAddingNote(false);
}
};

const handleSaveEdit = (updated) => {
setCandidate(updated);
onUpdate(updated);
setShowEdit(false);
};

return (
<>

<div className="fixed inset-0 z-50 flex items-center justify-center">
<div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
{/_ Загаловак _/}
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<h2 className="font-semibold text-slate-100">Профіль кандыдата</h2>
<div className="flex items-center gap-2">
<button
onClick={() => setShowEdit(true)}
className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors" >
✏️ Рэдагаваць
</button>
<button
                onClick={handleMatch}
                disabled={matchLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors disabled:opacity-50"
              >
🎯 {matchLoading ? "Пошук..." : "Вакансіі"}
</button>
<button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
✕
</button>
</div>
</div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Загрузка...</div>
          ) : !candidate ? (
            <div className="p-8 text-center text-slate-500">Не знойдзена</div>
          ) : (
            <div className="px-6 py-5 space-y-5">
              {/* Асноўная інфа */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-100">
                    {candidate.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                    {candidate.contactType === "telegram" &&
                      candidate.telegram && (
                        <span>✈️ {candidate.telegram}</span>
                      )}
                    {(candidate.contactType === "viber" ||
                      candidate.contactType === "phone") &&
                      candidate.phone && <span>📞 {candidate.phone}</span>}
                    {candidate.nationality && (
                      <span>🌍 {candidate.nationality}</span>
                    )}
                    {candidate.currentLocation && (
                      <span>📍 {candidate.currentLocation}</span>
                    )}
                    {candidate.age && <span>🎂 {candidate.age} г.</span>}
                    {candidate.gender && (
                      <span>
                        {candidate.gender === "female"
                          ? "👩 Жанчына"
                          : "👨 Мужчына"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Статус */}
                <div className="shrink-0">
                  {editStatus ? (
                    <div className="flex flex-col gap-1">
                      {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                        <button
                          key={val}
                          onClick={() => handleStatusChange(val)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors text-left ${
                            candidate.status === val
                              ? "bg-emerald-500 text-slate-900"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                      <button
                        onClick={() => setEditStatus(false)}
                        className="text-xs text-slate-600 mt-1 text-center"
                      >
                        Адмена
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditStatus(true)}
                      className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer ${STATUS_COLORS[candidate.status]}`}
                    >
                      {STATUS_LABELS[candidate.status]} ▾
                    </button>
                  )}
                </div>
              </div>

              {/* Мета-інфа */}
              <div className="flex gap-4 text-xs text-slate-600">
                <span>
                  📅{" "}
                  {new Date(candidate.createdAt).toLocaleString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>
                  {candidate.source === "site"
                    ? "🌐 Сайт"
                    : candidate.source === "telegram_bot"
                      ? "✈️ Telegram"
                      : "✋ Ручны"}
                </span>
              </div>

              {/* Нататкі рэкрутэра */}
              {candidate.notes && (
                <>
                  <Divider label="📝 Нататкі" />
                  <p className="text-sm text-slate-400 bg-slate-800 rounded-lg px-3 py-2">
                    {candidate.notes}
                  </p>
                </>
              )}

              {/* Пажаданні */}
              {candidate.jobPreferences && (
                <>
                  <Divider label="🔍 Пажаданні да працы" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {candidate.jobPreferences.locationFlexible ? (
                      <div className="text-slate-400">
                        📍 Гатовы да пераезду
                      </div>
                    ) : candidate.jobPreferences.location ? (
                      <div className="text-slate-400">
                        📍 {candidate.jobPreferences.location}
                      </div>
                    ) : null}
                    {candidate.jobPreferences.readyDate && (
                      <div className="text-slate-400">
                        📅 Гатовы з: {candidate.jobPreferences.readyDate}
                      </div>
                    )}
                    {candidate.jobPreferences.needsAccommodation && (
                      <div className="text-slate-400">🏠 Патрэбна жытло</div>
                    )}
                    {candidate.jobPreferences.travelGroup && (
                      <div className="text-slate-400">
                        👥{" "}
                        {candidate.jobPreferences.travelGroup === "alone"
                          ? "Адзін/а"
                          : candidate.jobPreferences.travelGroup === "couple"
                            ? "Пара"
                            : "З сям'ёй"}
                      </div>
                    )}
                    {candidate.jobPreferences.schedule?.length > 0 && (
                      <div className="text-slate-400">
                        ⏰ {candidate.jobPreferences.schedule.join(", ")}
                      </div>
                    )}
                    {candidate.jobPreferences.contractType && (
                      <div className="text-slate-400">
                        📄 {candidate.jobPreferences.contractType}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Дакументы */}
              {candidate.documents && (
                <>
                  <Divider label="📄 Дакументы" />
                  <div className="flex gap-3 flex-wrap">
                    {[
                      [candidate.documents.hasVisa, "Віза"],
                      [candidate.documents.hasSanepid, "Санепід"],
                      [candidate.documents.hasUDT, "UDT"],
                    ].map(([has, label]) => (
                      <span
                        key={label}
                        className={`text-xs px-2 py-1 rounded-lg ${
                          has
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-600"
                        }`}
                      >
                        {has ? "✅" : "❌"} {label}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Заяўкі на вакансіі */}
              {candidate.appliedVacancies?.length > 0 && (
                <>
                  <Divider label="💼 Заяўкі на вакансіі" />
                  <div className="space-y-2">
                    {candidate.appliedVacancies.map((av, i) => (
                      <div
                        key={i}
                        className="bg-slate-800 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="text-slate-300">
                          {av.type === "want_work"
                            ? "🟢 Хоча працаваць"
                            : "💬 Хоча дэталі"}
                        </span>
                        {av.vacancyId?.title && (
                          <span className="text-slate-500 ml-2">
                            — {av.vacancyId.title}
                          </span>
                        )}
                        {av.vacancyId?.vacancyCode && (
                          <span className="text-slate-600 ml-2 font-mono text-xs">
                            ({av.vacancyId.vacancyCode})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* Матчынг вакансій */}
              {matchedVacancies !== null && (
                <>
                  <Divider label="🎯 Падыходзячыя вакансіі" />
                  {matchedVacancies.length === 0 ? (
                    <p className="text-xs text-slate-600">
                      Падыходзячых вакансій не знойдзена
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {matchedVacancies.map((v) => (
                        <div
                          key={v._id}
                          className="bg-slate-800 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-slate-200 font-medium">
                                {v.title}
                              </span>
                              {v.vacancyCode && (
                                <span className="text-xs font-mono text-slate-500 ml-2">
                                  ({v.vacancyCode})
                                </span>
                              )}
                            </div>
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                              ⭐ {v.matchScore}
                            </span>
                          </div>
                          <div className="flex gap-3 mt-1 text-xs text-slate-500">
                            <span>📍 {v.location}</span>
                            {v.agencyName && <span>🏢 {v.agencyName}</span>}
                            {v.salary?.base && <span>💰 {v.salary.base}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {/* Гісторыя */}
              <Divider label="🗂 Гісторыя зносін" />
              <div className="space-y-2 mb-3">
                {!candidate.history?.length ? (
                  <p className="text-xs text-slate-600">Гісторыя пустая</p>
                ) : (
                  [...candidate.history].reverse().map((h, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500">
                          {new Date(h.date).toLocaleString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                          {h.type === "call"
                            ? "📞 Званок"
                            : h.type === "chat"
                              ? "💬 Чат"
                              : "📝 Нататка"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{h.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Дадаць нататку */}
              <div className="flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Дадаць нататку..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
                >
                  Дадаць
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Мадалка рэдагавання */}
      {showEdit && candidate && (
        <EditCandidateModal
          candidate={candidate}
          onClose={() => setShowEdit(false)}
          onSave={handleSaveEdit}
        />
      )}
    </>

);
}

---

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
const res = await updateTemplate(template.\_id, data);
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
{/_ ЗАГАЛОВАК _/}
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

---

// frontend/src/components/templates/TemplateViewModal.jsx
import React from "react";
import Divider from "../shared/Divider";
import {
MapPin,
Wallet,
Clock,
Info,
Shirt,
Check,
User,
Globe,
FileText,
Home,
Bus,
Utensils,
Tag,
} from "lucide-react";

export default function TemplateViewModal({ template, onClose, onEdit }) {
if (!template) return null;

const t = template;

return (

<div className="fixed inset-0 z-50 flex items-center justify-center">
<div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
{/_ ЗАГАЛОВАК _/}
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<div className="flex items-center gap-3 mb-1">
{t.agencyName && (
<span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20 uppercase tracking-wider font-bold">
{t.agencyName}
</span>
)}
</div>
<h2 className="font-bold text-slate-100 text-lg leading-tight">
{t.templateName}
</h2>
{t.vacancydescription &&
t.vacancydescription !== t.templateName && (
<p className="text-sm text-slate-400 mt-0.5">
{t.vacancydescription}
</p>
)}
</div>
<button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
✕
</button>
</div>

        {/* ЗМЕСТ */}
        <div className="px-6 py-5 space-y-6">
          {/* ЛАКАЦЫЯ */}
          {(t.location || t.checkInCity) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {t.location && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  <MapPin size={14} className="text-red-400" /> {t.location}
                </span>
              )}
              {t.checkInCity && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 text-xs">
                  📋 Аформленне: {t.checkInCity}
                </span>
              )}
              {t.country && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 text-xs">
                  <Globe size={12} className="text-blue-400" /> {t.country}
                </span>
              )}
            </div>
          )}

          {/* КЛЮЧАВЫЯ СЛОВЫ */}
          {t.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {t.keywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1 text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700/50"
                >
                  <Tag size={10} /> {kw}
                </span>
              ))}
            </div>
          )}

          {/* АПЛАТА */}
          {(t.salary?.baseNetto ||
            t.salary?.bonusDetails ||
            t.salary?.salaryNotes) && (
            <>
              <Divider label="💰 Аплата" />
              <div className="space-y-1.5 text-sm">
                {t.salary.baseNetto && (
                  <div className="text-slate-100 font-bold text-base flex items-center gap-2">
                    <Wallet size={16} className="text-slate-500 shrink-0" />
                    {t.salary.baseNetto}
                  </div>
                )}
                {t.salary.studentNetto && (
                  <div className="text-emerald-400/90 ml-6 font-medium">
                    Студэнты: {t.salary.studentNetto}
                  </div>
                )}
                {t.salary.hoursRange && (
                  <div className="text-slate-400 ml-6">
                    Гадзін: {t.salary.hoursRange}
                  </div>
                )}
                {t.salary.payoutDates && (
                  <div className="text-slate-400 ml-6">
                    Выплаты: {t.salary.payoutDates}
                  </div>
                )}
                {t.salary.bonusDetails && (
                  <div className="text-emerald-400 text-xs bg-emerald-500/5 py-1.5 px-3 rounded-lg mt-1 ml-6 border border-emerald-500/10">
                    🎁 {t.salary.bonusDetails}
                  </div>
                )}
                {t.salary.salaryNotes && (
                  <div className="text-amber-400/90 text-xs mt-2 italic border-l-2 border-amber-500/30 pl-3 ml-6">
                    {t.salary.salaryNotes}
                  </div>
                )}
              </div>
            </>
          )}

          {/* АБАВЯЗКІ */}
          {t.description && (
            <>
              <Divider label="🛠 Абавязкі" />
              <ul className="space-y-2">
                {t.description.split(/[.;]/).map(
                  (item, i) =>
                    item.trim() && (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <span className="text-emerald-500 mt-1 shrink-0">
                          <Check size={14} />
                        </span>
                        <span>{item.trim()}</span>
                      </li>
                    ),
                )}
              </ul>
            </>
          )}

          {/* ПАТРАБАВАННІ */}
          {(t.requirements?.gender?.length > 0 ||
            t.requirements?.ageMax ||
            t.requirements?.standardDocs?.length > 0 ||
            t.requirements?.polishLanguageLevel ||
            t.requirements?.physicalLoad) && (
            <>
              <Divider label="📋 Патрабаванні" />
              <div className="flex flex-wrap gap-2">
                {t.requirements.gender?.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <User size={12} className="text-blue-400" />
                    {Array.isArray(t.requirements.gender)
                      ? t.requirements.gender.join(", ")
                      : t.requirements.gender}
                  </span>
                )}
                {t.requirements.ageMax && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🎂 да {t.requirements.ageMax} гадоў
                  </span>
                )}
                {t.requirements.polishLanguageLevel && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🗣 {t.requirements.polishLanguageLevel}
                  </span>
                )}
                {t.requirements.standardDocs?.map((doc) => (
                  <span
                    key={doc}
                    className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20"
                  >
                    <FileText size={12} /> {doc}
                  </span>
                ))}
              </div>
              {t.requirements.physicalLoad && (
                <div className="text-xs text-slate-500 italic mt-2 pl-1">
                  {t.requirements.physicalLoad}
                </div>
              )}
            </>
          )}

          {/* ГРАФІК */}
          {(t.schedule?.description ||
            t.schedule?.workDaysWeek ||
            t.schedule?.hoursPerShift) && (
            <>
              <Divider label="🕒 Графік" />
              <div className="text-sm space-y-1.5 ml-1">
                {t.schedule.description && (
                  <div className="text-slate-300 flex items-start gap-2">
                    <Clock
                      size={16}
                      className="text-slate-500 shrink-0 mt-0.5"
                    />
                    {t.schedule.description}
                  </div>
                )}
                {t.schedule.workDaysWeek && (
                  <div className="text-slate-400 text-xs ml-6">
                    {t.schedule.workDaysWeek}
                  </div>
                )}
                {t.schedule.hoursPerShift && (
                  <div className="text-slate-400 text-xs font-mono ml-6 bg-slate-800/50 px-2 py-0.5 rounded inline-block">
                    {t.schedule.hoursPerShift}
                  </div>
                )}
                {t.schedule.breakDuration && (
                  <div className="text-slate-500 text-xs ml-6 italic">
                    Перапынак: {t.schedule.breakDuration}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ТЫП ДАГАВОРА */}
          {t.contractType && (
            <div className="text-sm text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800 inline-flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              Тып дагавора:{" "}
              <span className="text-slate-200 font-medium">
                {t.contractType}
              </span>
            </div>
          )}

          {/* ЖЫТЛО */}
          {(t.accommodation?.type || t.accommodation?.costRaw) && (
            <>
              <Divider label="🏠 Жытло" />
              <div className="text-sm space-y-1.5 ml-1">
                <div className="text-slate-300 font-medium flex items-center gap-2">
                  <Home size={16} className="text-orange-400" />
                  {t.accommodation.type}
                  {t.accommodation.forCouples && (
                    <span className="text-xs bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20 ml-1">
                      💑 Пары
                    </span>
                  )}
                </div>
                {t.accommodation.costRaw && (
                  <div className="text-slate-400 ml-6">
                    {t.accommodation.costRaw}
                  </div>
                )}
                {t.accommodation.details && (
                  <div className="text-slate-500 text-xs leading-relaxed ml-6">
                    {t.accommodation.details}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ТРАНСПАРТ */}
          {(t.transport?.provided ||
            t.transport?.costRaw ||
            t.transport?.details) && (
            <>
              <Divider label="🚌 Транспарт" />
              <div className="text-sm text-slate-300 flex items-start gap-2 ml-1">
                <Bus size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  {t.transport.costRaw && <span>{t.transport.costRaw}</span>}
                  {t.transport.details && (
                    <div className="text-slate-500 text-xs mt-0.5">
                      {t.transport.details}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ВЫДАТКІ І АДКАЗНАСЦЬ */}
          {(t.startExpenses?.hasStartExpenses ||
            t.earlyTerminationLiability?.hasLiability) && (
            <>
              <Divider label="💸 Выдаткі і адказнасць" />
              <div className="space-y-1.5 text-sm ml-1">
                {t.startExpenses?.hasStartExpenses &&
                  t.startExpenses.details && (
                    <div className="text-orange-400/80 text-xs bg-orange-500/5 px-3 py-2 rounded-lg border border-orange-500/10">
                      На старце: {t.startExpenses.details}
                    </div>
                  )}
                {t.earlyTerminationLiability?.hasLiability &&
                  t.earlyTerminationLiability.details && (
                    <div className="text-red-400/80 text-xs bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10">
                      Датэрміновае звальненне:{" "}
                      {t.earlyTerminationLiability.details}
                    </div>
                  )}
              </div>
            </>
          )}

          {/* УМОВЫ ПРАЦЫ */}
          {(t.conditions?.specificConditionsDetails ||
            t.conditions?.specificNuances?.length > 0 ||
            t.conditions?.foodType) && (
            <>
              <Divider label="🌡 Умовы працы" />
              <div className="space-y-2 text-sm ml-1">
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <Shirt size={12} className="text-orange-400" />
                    Вопратка:{" "}
                    {t.conditions.workwearFree
                      ? "Бясплатна"
                      : "За кошт работніка"}
                  </span>
                  {t.conditions.foodType && (
                    <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                      <Utensils size={12} className="text-emerald-400" />
                      {t.conditions.foodType}
                    </span>
                  )}
                </div>
                {t.conditions.specificNuances?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {t.conditions.specificNuances.map((n) => (
                      <span
                        key={n}
                        className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700/50"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                )}
                {t.conditions.specificConditionsDetails && (
                  <div className="text-slate-500 text-xs italic pl-1">
                    {t.conditions.specificConditionsDetails}
                  </div>
                )}
                {t.conditions.foodDetails && (
                  <div className="text-slate-500 text-xs italic pl-1">
                    {t.conditions.foodDetails}
                  </div>
                )}
              </div>
            </>
          )}

          {/* КАМПЕНСАЦЫІ */}
          {t.employerCompensations?.hasCompensations &&
            t.employerCompensations.details && (
              <>
                <Divider label="🎁 Кампенсацыі" />
                <div className="text-sm text-slate-300 ml-1">
                  {t.employerCompensations.details}
                </div>
              </>
            )}

          {/* ДАДАТКОВАЯ ІНФАРМАЦЫЯ */}
          {t.additionalNotes && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Info size={14} /> Дадатковая інфармацыя
              </div>
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {t.additionalNotes}
              </div>
            </div>
          )}

          {/* МЕТА */}
          <div className="text-[10px] text-slate-600 pt-4 border-t border-slate-800 flex justify-between font-mono">
            <span>ID: {t._id?.substring(t._id.length - 8).toUpperCase()}</span>
            {t.createdAt && (
              <span>
                ДАДАНА: {new Date(t.createdAt).toLocaleString("uk-UA")}
              </span>
            )}
          </div>
        </div>

        {/* КНОПКІ */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          {onEdit && (
            <button
              onClick={() => onEdit(t)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-all border border-slate-700"
            >
              ✏️ Рэдагаваць
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm rounded-lg transition-colors border border-slate-700 ml-auto"
          >
            Закрыць
          </button>
        </div>
      </div>
    </div>

);
}

---

// frontend/src/components/vacancies/ApplyModal.jsx
import { useState } from "react";
import { submitApplication } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";

export default function ApplyModal({ vacancy, applyType, onClose }) {
const [form, setForm] = useState({
name: "",
contactType: "telegram",
telegram: "",
phone: "",
nationality: "",
currentLocation: "",
age: "",
gender: "",
jobPreferences: {
location: "",
locationFlexible: false,
needsAccommodation: false,
travelGroup: "alone",
readyDate: "",
schedule: [],
contractType: "any",
},
});
const [sending, setSending] = useState(false);
const [sent, setSent] = useState(false);

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

const toggleSchedule = (val) => {
setForm((prev) => {
const cur = prev.jobPreferences.schedule;
const next = cur.includes(val)
? cur.filter((s) => s !== val)
: [...cur, val];
return {
...prev,
jobPreferences: { ...prev.jobPreferences, schedule: next },
};
});
};

const handleSubmit = async () => {
if (!form.name.trim()) return alert("Увядзіце імя");
if (form.contactType === "telegram" && !form.telegram.trim())
return alert("Увядзіце Telegram username");
if (
(form.contactType === "viber" || form.contactType === "phone") &&
!form.phone.trim()
)
return alert("Увядзіце нумар тэлефона");

    setSending(true);
    try {
      await submitApplication({
        vacancyId: vacancy._id,
        applyType,
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      setSent(true);
    } catch {
      alert("Памылка адпраўкі заяўкі");
    } finally {
      setSending(false);
    }

};

return (

<div className="fixed inset-0 z-50 flex items-center justify-center">
<div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<h2 className="font-semibold text-slate-100">
{applyType === "want_work"
? "🟢 Хачу тут працаваць"
: "💬 Дазнацца дэталі"}
</h2>
<p className="text-xs text-slate-500 mt-0.5">{vacancy.title}</p>
</div>
<button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
✕
</button>
</div>

        {sent ? (
          <div className="px-6 py-16 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-semibold text-slate-100 mb-2">
              Заяўка адпраўлена!
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Рэкрутэр звяжацца з вамі ў бліжэйшы час.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
            >
              Закрыць
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 space-y-4">
              <Field
                label="Імя і прозвішча *"
                value={form.name}
                onChange={(v) => setField("name", v)}
                placeholder="Іван Іваноў"
              />

              <Divider label="📞 Спосаб сувязі" />
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Як з вамі звязацца? *
                </label>
                <div className="flex gap-2 mb-3">
                  {["telegram", "viber", "phone"].map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setField("contactType", ct)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        form.contactType === ct
                          ? "bg-emerald-500 text-slate-900"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {ct === "telegram"
                        ? "✈️ Telegram"
                        : ct === "viber"
                          ? "📱 Viber"
                          : "📞 Тэлефон"}
                    </button>
                  ))}
                </div>
                {form.contactType === "telegram" ? (
                  <Field
                    label="Telegram username *"
                    value={form.telegram}
                    onChange={(v) => setField("telegram", v)}
                    placeholder="@username"
                  />
                ) : (
                  <Field
                    label="Нумар тэлефона *"
                    value={form.phone}
                    onChange={(v) => setField("phone", v)}
                    placeholder="+380XXXXXXXXX"
                  />
                )}
              </div>

              <Divider label="👤 Асабістыя дадзеныя" />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Нацыянальнасць"
                  value={form.nationality}
                  onChange={(v) => setField("nationality", v)}
                  placeholder="Украіна"
                />
                <Field
                  label="Дзе зараз знаходзіцеся"
                  value={form.currentLocation}
                  onChange={(v) => setField("currentLocation", v)}
                  placeholder="Кіеў"
                />
                <Field
                  label="Узрост *"
                  value={form.age}
                  type="number"
                  onChange={(v) => setField("age", v)}
                  placeholder="25"
                />
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Гендар
                  </label>
                  <div className="flex gap-2">
                    {[
                      ["male", "👨 Мужчына"],
                      ["female", "👩 Жанчына"],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() => setField("gender", val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          form.gender === val
                            ? "bg-emerald-500 text-slate-900"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Divider label="🔍 Пажаданні да працы" />
              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Дзе шукаеце працу?
                </label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {[
                    ["here", "Дзе зараз знаходжуся"],
                    ["specific", "У пэўным месцы"],
                    ["flexible", "Гатовы да пераезду"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => {
                        setField(
                          "jobPreferences.locationFlexible",
                          val === "flexible",
                        );
                        if (val === "here")
                          setField(
                            "jobPreferences.location",
                            form.currentLocation,
                          );
                        if (val !== "specific")
                          setField("jobPreferences.location", "");
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        (val === "flexible" &&
                          form.jobPreferences.locationFlexible) ||
                        (val === "here" &&
                          !form.jobPreferences.locationFlexible &&
                          form.jobPreferences.location ===
                            form.currentLocation) ||
                        (val === "specific" &&
                          !form.jobPreferences.locationFlexible &&
                          form.jobPreferences.location &&
                          form.jobPreferences.location !== form.currentLocation)
                          ? "bg-emerald-500 text-slate-900"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                {!form.jobPreferences.locationFlexible && (
                  <Field
                    label="Горад"
                    value={form.jobPreferences.location}
                    onChange={(v) => setField("jobPreferences.location", v)}
                    placeholder="напр. Варшава"
                  />
                )}
              </div>

              <Field
                label="Калі гатовы прыступіць"
                value={form.jobPreferences.readyDate}
                onChange={(v) => setField("jobPreferences.readyDate", v)}
                placeholder="напр. 01.05.2026"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Патрэбна жытло?
                  </label>
                  <div className="flex gap-2">
                    {[
                      ["true", "Так"],
                      ["false", "Не"],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() =>
                          setField(
                            "jobPreferences.needsAccommodation",
                            val === "true",
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          String(form.jobPreferences.needsAccommodation) === val
                            ? "bg-emerald-500 text-slate-900"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Еду
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      ["alone", "Адзін/а"],
                      ["couple", "Пара"],
                      ["family", "З сям'ёй"],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() =>
                          setField("jobPreferences.travelGroup", val)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          form.jobPreferences.travelGroup === val
                            ? "bg-emerald-500 text-slate-900"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Графік працы
                </label>
                <div className="flex gap-2">
                  {[
                    ["1_shift", "1 змена"],
                    ["2_shifts", "2 змены"],
                    ["3_shifts", "3 змены"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => toggleSchedule(val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        form.jobPreferences.schedule.includes(val)
                          ? "bg-emerald-500 text-slate-900"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2">
                  Тып дагавора
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    ["zlecenie", "Umowa zlecenie"],
                    ["o_prace", "Umowa o pracę"],
                    ["any", "Любы"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() =>
                        setField("jobPreferences.contractType", val)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        form.jobPreferences.contractType === val
                          ? "bg-emerald-500 text-slate-900"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-medium text-sm rounded-lg transition-colors"
              >
                {sending ? "Адпраўка..." : "Адправіць заяўку"}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
              >
                Адмена
              </button>
            </div>
          </>
        )}
      </div>
    </div>

);
}

---

import { useState } from "react";
import { updateVacancy } from "../../services/api";
import Field from "../shared/Field";
import Divider from "../shared/Divider";
import \* as MD from "../../constants/masterData";

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
{ value: "1", label: "1 чалавек" },
{ value: "2", label: "Пара (2)" },
{ value: "сім'я", label: "Сям'я" },
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
? vacancy.conditions.specificNuances.join(", ")
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
const res = await updateVacancy(vacancy.\_id, data);
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
className={`flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded-xl border border-slate-800`} >
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
              }`} >
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
              }`} >
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
Агенцыя
</label>
<select
value={form.agencyName || "MANUAL"}
onChange={(e) => setField("agencyName", e.target.value)}
className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" >
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
{/_ ШАПКА _/}
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
                label="Назва для адмінкі"
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

            {/* АГЕНЦЫЯ — dropdown */}
            <AgencyDropdown />

            <Field
              label="Брэнд / Завод"
              value={form.brand}
              onChange={(v) => setField("brand", v)}
            />

            <Field
              label="Дата прыезду"
              value={form.arrivalDate}
              onChange={(v) => setField("arrivalDate", v)}
            />

            <Field
              label="Ключавыя словы"
              value={form.keywords}
              onChange={(v) => setField("keywords", v)}
            />
          </div>

          {/* КОЛЬКАСЦЬ — кнопкі */}
          <SingleBtnGroup
            label="Колькасць / Хто едзе"
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

          <Divider label="📍 Лакацыя" />
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

          <Divider label="🛠 Абавязкі" />
          <textarea
            value={form.description || ""}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            placeholder="Абавязкі праз кропку з коскай (;)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
          />

          <Divider label="📋 Патрабаванні" />
          <MultiBtnGroup
            label="Набор (Гендар)"
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
              label="Макс. узрост"
              value={form.requirements?.ageMax || ""}
              onChange={(v) =>
                setField("requirements.ageMax", v === "" ? null : Number(v))
              }
              type="number"
            />
            <Field
              label="Фізічная нагрузка"
              value={form.requirements?.physicalLoad}
              onChange={(v) => setField("requirements.physicalLoad", v)}
            />
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

          <Divider label="🏠 Жытло" />

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

          <Divider label="🚌 Транспарт" />
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

          <Divider label="🌡 Умовы працы" />

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

          <Divider label="💸 Выдаткі і адказнасць" />
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

          <Divider label="🎁 Кампенсацыі" />
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

---

// frontend/src/components/vacancies/VacancyFilters.jsx
import { EMPTY_FILTERS } from "../../constants/filters";
import \* as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";

function Section({ label, children }) {
return <div className="mb-5">{children}</div>;
}

export default function VacancyFilters({
filters = EMPTY_FILTERS,
setFilters,
agencies = [],
brands = [],
locations = [],
voivodeships = [],
nuances = [],
}) {
const draft = filters || EMPTY_FILTERS;

const updateField = (key, val) => {
setFilters({ ...draft, [key]: val });
};

// Падлік актыўных фільтраў (акрамя пошуку)
const activeCount = Object.entries(draft).reduce((acc, [key, val]) => {
if (key === "search") return acc;
if (Array.isArray(val) && val.length > 0) return acc + 1;
return acc;
}, 0);

return (

<div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 h-full overflow-y-auto custom-scrollbar">
<div className="flex items-center justify-between mb-6">
<h3 className="text-lg font-black text-emerald-400 tracking-tight italic">
ФІЛЬТРЫ
</h3>
{activeCount > 0 && (
<button
onClick={() => setFilters(EMPTY_FILTERS)}
className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase" >
Скінуць ({activeCount})
</button>
)}
</div>

      {/* ПОШУК */}
      <Section>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          Пошук
        </label>
        <input
          type="text"
          value={draft.search || ""}
          onChange={(e) => setFilters({ ...draft, search: e.target.value })}
          placeholder="Назва, апісанне..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
        />
      </Section>

      {/* СТАТУС */}
      <Section>
        <MultiSelect
          label="Статус"
          options={MD.STATUSES}
          selected={draft.status}
          onChange={(v) => updateField("status", v)}
          placeholder="Усе статусы"
        />
      </Section>

      {/* КАТЭГОРЫЯ */}
      <Section>
        <MultiSelect
          label="Катэгорыя"
          options={MD.CATEGORIES}
          selected={draft.category}
          onChange={(v) => updateField("category", v)}
          placeholder="Усе катэгорыі"
        />
      </Section>

      {/* ВАЯВОДСТВА (Дынамічнае) */}
      <Section>
        <MultiSelect
          label="Ваяводства"
          options={voivodeships}
          selected={draft.voivodeship}
          onChange={(v) => updateField("voivodeship", v)}
          placeholder="Усе рэгіёны"
        />
      </Section>

      {/* ЛАКАЦЫЯ (Дынамічная) */}
      <Section>
        <MultiSelect
          label="Горад"
          options={locations}
          selected={draft.location}
          onChange={(v) => updateField("location", v)}
          placeholder="Усе гарады"
        />
      </Section>

      {/* ЖЫТЛО */}
      <Section>
        <MultiSelect
          label="Жыллё"
          options={MD.ACCOMMODATION_OPTIONS}
          selected={draft.accommodation}
          onChange={(v) => updateField("accommodation", v)}
          placeholder="Любыя ўмовы"
        />
      </Section>

      {/* ТРАНСПАРТ */}
      <Section>
        <MultiSelect
          label="Давоз да працы"
          options={MD.TRANSPORT_OPTIONS}
          selected={draft.transport}
          onChange={(v) => updateField("transport", v)}
          placeholder="Не важна"
        />
      </Section>

      {/* ХТО ЕДЗЕ */}
      <Section>
        <MultiSelect
          label="Хто едзе"
          options={MD.TRAVEL_GROUPS}
          selected={draft.travelGroup}
          onChange={(v) => updateField("travelGroup", v)}
          placeholder="Будзь-хто"
        />
      </Section>

      {/* МОВА */}
      <Section>
        <MultiSelect
          label="Узровень польскай"
          options={MD.LANGUAGES}
          selected={draft.language}
          onChange={(v) => updateField("language", v)}
          placeholder="Любы ўзровень"
        />
      </Section>

      {/* НАЦЫЯНАЛЬНАСЦЬ */}
      <Section>
        <MultiSelect
          label="Нацыянальнасць"
          options={MD.NATIONALITIES}
          selected={draft.nationality}
          onChange={(v) => updateField("nationality", v)}
          placeholder="Усе нацыі"
        />
      </Section>

      {/* ДАКУМЕНТЫ */}
      <Section>
        <MultiSelect
          label="Дакументы"
          options={MD.DOCS}
          selected={draft.docs}
          onChange={(v) => updateField("docs", v)}
          placeholder="Любыя дакументы"
        />
      </Section>

      {/* НЮАНСЫ (ЧЭК-ЛІСТ) */}
      <Section>
        <MultiSelect
          label="Асаблівасці (Чэк-ліст)"
          options={nuances} // 2. ВЫКАРЫСТАЦЬ НАПРАМУ ЗАМЕСТ dynamicData.nuances
          selected={draft.nuances}
          onChange={(v) => updateField("nuances", v)}
          placeholder="Выбраць нюансы..."
        />
      </Section>

      {/* АГЕНЦЫЯ (Дынамічная) */}
      <Section>
        <MultiSelect
          label="Агенцыя"
          options={agencies}
          selected={draft.agencyName}
          onChange={(v) => updateField("agencyName", v)}
          placeholder="Усе агенцыі"
        />
      </Section>

      {/* БРЭНД (Дынамічны) */}
      <Section>
        <MultiSelect
          label="Брэнд / Завод"
          options={brands}
          selected={draft.brand}
          onChange={(v) => updateField("brand", v)}
          placeholder="Усе брэнды"
        />
      </Section>
    </div>

);
}

---

// frontend/src/components/vacancies/VacancyMatchModal.jsx
import { useEffect, useState } from "react";
import { matchCandidatesForVacancy } from "../../services/api";

const STATUS_COLORS = {
new: "bg-blue-500/10 text-blue-400",
active: "bg-emerald-500/10 text-emerald-400",
waiting: "bg-yellow-500/10 text-yellow-400",
employed: "bg-purple-500/10 text-purple-400",
left: "bg-slate-500/10 text-slate-400",
blacklist: "bg-red-500/10 text-red-400",
};

const STATUS_LABELS = {
new: "Новы",
active: "Актыўны",
waiting: "Чакае",
employed: "Працуе",
left: "Сышоў",
blacklist: "Блэкліст",
};

export default function VacancyMatchModal({ vacancy, onClose }) {
const [candidates, setCandidates] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const load = async () => {
try {
const res = await matchCandidatesForVacancy(vacancy.\_id);
setCandidates(res.data);
} catch {
console.error("Памылка матчынгу");
} finally {
setLoading(false);
}
};
load();
}, [vacancy._id]);

return (

<div className="fixed inset-0 z-50 flex items-center justify-center">
<div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
<div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
{/_ Загаловак _/}
<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
<div>
<h2 className="font-semibold text-slate-100">
🎯 Падыходзячыя кандыдаты
</h2>
<p className="text-xs text-slate-500 mt-0.5">
{vacancy.title}
{vacancy.vacancyCode && (
<span className="font-mono ml-2">({vacancy.vacancyCode})</span>
)}
</p>
</div>
<button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
✕
</button>
</div>

        {/* Змест */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Пошук кандыдатаў...
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">Падыходзячых кандыдатаў не знойдзена</p>
              <p className="text-xs text-slate-700 mt-1">
                Упэўніцеся што ў базе ёсць кандыдаты са статусамі
                new/active/waiting
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-4">
                Знойдзена {candidates.length} кандыдатаў
              </p>
              <div className="space-y-3">
                {candidates.map((c) => (
                  <div
                    key={c._id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-100 text-sm">
                            {c.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}
                          >
                            {STATUS_LABELS[c.status]}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          {c.contactType === "telegram" && c.telegram && (
                            <span>✈️ {c.telegram}</span>
                          )}
                          {(c.contactType === "viber" ||
                            c.contactType === "phone") &&
                            c.phone && <span>📞 {c.phone}</span>}
                          {c.nationality && <span>🌍 {c.nationality}</span>}
                          {c.currentLocation && (
                            <span>📍 {c.currentLocation}</span>
                          )}
                          {c.age && <span>🎂 {c.age} г.</span>}
                          {c.gender && (
                            <span>{c.gender === "female" ? "👩" : "👨"}</span>
                          )}
                        </div>

                        {/* Пажаданні */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {c.jobPreferences?.locationFlexible && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                              🗺 Гатовы да пераезду
                            </span>
                          )}
                          {c.jobPreferences?.needsAccommodation && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                              🏠 Патрэбна жытло
                            </span>
                          )}
                          {c.jobPreferences?.readyDate && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                              📅 Гатовы з: {c.jobPreferences.readyDate}
                            </span>
                          )}
                        </div>

                        {/* Дакументы */}
                        <div className="flex gap-2 mt-2">
                          {[
                            [c.documents?.hasVisa, "Віза"],
                            [c.documents?.hasSanepid, "Санепід"],
                            [c.documents?.hasUDT, "UDT"],
                          ].map(([has, label]) => (
                            <span
                              key={label}
                              className={`text-xs px-2 py-0.5 rounded ${
                                has
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-slate-700 text-slate-600"
                              }`}
                            >
                              {has ? "✅" : "❌"} {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="shrink-0 text-center">
                        <div className="text-lg font-bold text-emerald-400">
                          {c.matchScore}
                        </div>
                        <div className="text-xs text-slate-600">балаў</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>

);
}

---

import React, { useState } from "react";
import { Copy, Check, X, Factory, Tag } from "lucide-react";

// Два памеры: загалоўкі (SectionTitle) і апісальны тэкст (Note)
const SectionTitle = ({
icon,
label,
color = "text-emerald-400",
border = "border-emerald-500/20",
}) => (

  <h3
    className={`text-sm font-bold ${color} uppercase tracking-widest mb-3 border-b ${border} pb-1`}
  >
    {icon} {label}
  </h3>
);

// Апісальны радок — курсіў, меньшы
const Note = ({ children }) =>
children ? (
<p className="text-xs text-slate-400 italic mt-1 leading-relaxed">
{children}
</p>
) : null;

// Звычайны радок значэння
const Row = ({ label, value }) =>
value ? (
<p className="text-sm text-slate-200 leading-snug">
• <span className="font-semibold text-slate-300">{label}:</span>{" "}
<span>{value}</span>
</p>
) : null;

export default function VacancyViewModal({
vacancy,
onClose,
onEdit,
onDelete,
onMatch,
}) {
const [copied, setCopied] = useState(false);
if (!vacancy) return null;
const v = vacancy;

const handleCopyTelegram = () => {
navigator.clipboard.writeText(v.telegramPost || "");
setCopied(true);
setTimeout(() => setCopied(false), 2000);
};

// Лакацыя з краінай (калі не Польшча)
const locationDisplay =
v.country && v.country !== "Polska"
? `${v.location} (${v.country})`
: v.location;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
<div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        {/* ШАПКА */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              {v.vacancyCode}
            </span>
            {v.status && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                  v.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : v.status === "closed"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}
              >
                {v.status === "active"
                  ? "Актыўная"
                  : v.status === "closed"
                    ? "Закрыта"
                    : "Архіў"}
              </span>
            )}
            {/* КАТЭГОРЫЯ */}
            {v.category && (
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/20 uppercase tracking-wider">
                <Tag size={9} className="inline mr-1" />
                {v.category}
              </span>
            )}
            {/* БРЭНД — зверху, побач з катэгорыяй */}
            {v.brand && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20 uppercase tracking-wider">
                <Factory size={9} className="inline mr-1" />
                {v.brand}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyTelegram}
              className="p-2 text-slate-400 hover:text-emerald-400 transition-all"
              title="Капіяваць пост"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-7">
          {/* ГАЛОЎНЫ ЗАГАЛОВАК */}
          <div>
            <h2 className="text-xl font-black text-white leading-tight mb-3">
              {v.vacancydescription}
            </h2>
            <div className="space-y-1">
              {/* ЛАКАЦЫЯ ЗАЎЖДЫ З КРАІНАЙ (калі не Польшча) */}
              <p className="text-base text-slate-200">
                📍 <span className="font-semibold">Місто:</span>{" "}
                <span className="text-white font-bold">{locationDisplay}</span>
              </p>
              {v.checkInCity && (
                <p className="text-sm text-slate-300">
                  🏢 <span className="font-semibold">Оформлення:</span> м.{" "}
                  {v.checkInCity}
                </p>
              )}
              <p className="text-sm text-slate-300">
                👥 <span className="font-semibold">Набір:</span>{" "}
                {Array.isArray(v.requirements?.gender)
                  ? v.requirements.gender.join(", ")
                  : v.requirements?.gender}
                {v.arrivalDate && (
                  <span className="text-emerald-400">
                    , приїзд {v.arrivalDate}
                  </span>
                )}
              </p>
              {v.count && (
                <p className="text-sm text-slate-300">
                  🔢 <span className="font-semibold">Кількість:</span> {v.count}
                </p>
              )}
            </div>
          </div>

          {/* АПЛАТА */}
          <section>
            <SectionTitle
              icon="💰"
              label="Оплата праці"
              color="text-emerald-400"
              border="border-emerald-500/20"
            />
            <div className="space-y-1.5">
              <Row label="Ставка" value={v.salary?.baseNetto} />
              <Row label="Студенти" value={v.salary?.studentNetto} />
              <Row label="Годин на місяць" value={v.salary?.hoursRange} />
              <Row label="Виплати" value={v.salary?.payoutDates} />
              {v.salary?.bonusDetails && (
                <p className="text-sm text-emerald-400 mt-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                  🎁 {v.salary.bonusDetails}
                </p>
              )}
              <Note>{v.salary?.salaryNotes}</Note>
            </div>
          </section>

          {/* АБАВЯЗКІ */}
          <section>
            <SectionTitle
              icon="🛠"
              label="Характер роботи"
              color="text-blue-400"
              border="border-blue-500/20"
            />
            <div className="space-y-1.5">
              {v.description?.split(/[;]/).map(
                (item, i) =>
                  item.trim() && (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                      <span className="text-sm text-slate-200 leading-snug">
                        {item.trim()}
                      </span>
                    </div>
                  ),
              )}
            </div>
          </section>

          {/* ПАТРАБАВАННІ */}
          <section>
            <SectionTitle
              icon="📋"
              label="Вимоги"
              color="text-amber-400"
              border="border-amber-500/20"
            />
            <div className="space-y-1.5">
              {v.requirements?.ageMax && v.requirements.ageMax < 65 && (
                <Row label="Вік" value={`до ${v.requirements.ageMax} років`} />
              )}
              <Row
                label="Документи"
                value={v.requirements?.standardDocs?.join(", ")}
              />
              {v.requirements?.additionalDocsDetails && (
                <Note>Додатково: {v.requirements.additionalDocsDetails}</Note>
              )}
              <Row label="Мова" value={v.requirements?.polishLanguageLevel} />
              {v.requirements?.physicalLoad && (
                <p className="text-sm text-amber-300 italic">
                  ⚡ {v.requirements.physicalLoad}
                </p>
              )}
            </div>
          </section>

          {/* ГРАФІК І ДАГАВОР */}
          <section>
            <SectionTitle
              icon="🕒"
              label="Графік та договір"
              color="text-purple-400"
              border="border-purple-500/20"
            />
            <div className="space-y-1.5">
              {v.schedule?.description && (
                <p className="text-sm text-slate-200 leading-relaxed">
                  {v.schedule.description}
                </p>
              )}
              <Row label="Робочі дні" value={v.schedule?.workDaysWeek} />
              <Row label="Перерва" value={v.schedule?.breakDuration} />
              {v.contractType && (
                <p className="mt-2 text-sm text-blue-400 font-bold">
                  📄 Тип договору: {v.contractType}
                </p>
              )}
            </div>
          </section>

          {/* ЖЫТЛО І ТРАНСПАРТ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SectionTitle
                icon="🏠"
                label="Проживання"
                color="text-orange-400"
                border="border-orange-500/20"
              />
              <div className="space-y-1">
                {v.accommodation?.type ? (
                  <p className="text-sm text-slate-200 font-semibold">
                    {v.accommodation.type}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 italic">Не вказано</p>
                )}
                {v.accommodation?.withChildren && (
                  <p className="text-xs text-emerald-400">✓ Можна з дітьми</p>
                )}
                {v.accommodation?.withPets && (
                  <p className="text-xs text-emerald-400">
                    ✓ Можна з тваринами
                  </p>
                )}
                <Note>{v.accommodation?.details}</Note>
              </div>
            </div>
            <div>
              <SectionTitle
                icon="🚌"
                label="Транспорт"
                color="text-cyan-400"
                border="border-cyan-500/20"
              />
              <div className="space-y-1">
                <p className="text-sm text-slate-200 font-semibold">
                  {v.transport?.provided ? "Надається" : "Власний"}
                </p>
                {v.transport?.costRaw && (
                  <p className="text-sm text-cyan-300">{v.transport.costRaw}</p>
                )}
                <Note>{v.transport?.details}</Note>
              </div>
            </div>
          </section>

          {/* УМОВЫ ПРАЦЫ */}
          <section>
            <SectionTitle
              icon="🌡"
              label="Умови праці"
              color="text-rose-400"
              border="border-rose-500/20"
            />
            <div className="space-y-1.5">
              <Row
                label="Робочий одяг"
                value={
                  v.conditions?.workwearFree
                    ? "Безкоштовно"
                    : "За рахунок працівника"
                }
              />
              <Row label="Харчування" value={v.conditions?.foodType} />
              <Note>{v.conditions?.foodDetails}</Note>

              {/* НЮАНСЫ — тэгі */}
              {v.conditions?.specificNuances?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {v.conditions.specificNuances.map((n, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}
              <Note>{v.conditions?.specificConditionsDetails}</Note>
            </div>
          </section>

          {/* ВЫДАТКІ І КАМПЕНСАЦЫІ */}
          {(v.startExpenses?.hasStartExpenses ||
            v.earlyTerminationLiability?.hasLiability ||
            v.employerCompensations?.hasCompensations) && (
            <section className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-3">
              {v.startExpenses?.hasStartExpenses && v.startExpenses.details && (
                <div>
                  <p className="text-xs font-bold text-orange-400 uppercase mb-1">
                    💸 Витрати на старті
                  </p>
                  <p className="text-sm text-slate-300">
                    {v.startExpenses.details}
                  </p>
                </div>
              )}
              {v.earlyTerminationLiability?.hasLiability &&
                v.earlyTerminationLiability.details && (
                  <div>
                    <p className="text-xs font-bold text-red-400 uppercase mb-1">
                      ⚠️ При достроковому звільненні
                    </p>
                    <p className="text-sm text-slate-300">
                      {v.earlyTerminationLiability.details}
                    </p>
                  </div>
                )}
              {v.employerCompensations?.hasCompensations &&
                v.employerCompensations.details && (
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase mb-1">
                      🎁 Компенсації
                    </p>
                    <p className="text-sm text-slate-300">
                      {v.employerCompensations.details}
                    </p>
                  </div>
                )}
            </section>
          )}

          {/* ДАДАТКОВАЯ ІНФАРМАЦЫЯ */}
          {v.additionalNotes && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2">
                📝 Додаткова інформація
              </p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {v.additionalNotes}
              </p>
            </div>
          )}

          {/* КРЫНІЦА */}
          <section className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            {v.isTruncated && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                ⚠️ Увага: Гэтая вакансія створана з абрэзанага паведамлення.
              </div>
            )}
            <details className="group">
              <summary className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors list-none flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform inline-block">
                  ▶
                </span>
                Тэкст паведамлення (Пераклад)
              </summary>
              <div className="mt-4 p-4 bg-black/40 rounded-xl border border-slate-800 text-[12px] text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
                {v.rawText || "Тэкст адсутнічае"}
              </div>
            </details>
          </section>

          {/* МЕТА */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-600">
            <span>ID: {v._id}</span>
            <span>СТВОРАНА: {new Date(v.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* КНОПКІ ДЗЕЯННЯЎ */}
        <div className="flex flex-wrap gap-3 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          <button
            onClick={() => onMatch(v)}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm rounded-xl transition-all"
          >
            🎯 Кандыдаты
          </button>
          <button
            onClick={() => onEdit(v)}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition-all"
          >
            ✏️ Рэдагаваць
          </button>
          <button
            onClick={() => onDelete(v._id)}
            className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-semibold rounded-xl border border-red-500/20 ml-auto transition-all"
          >
            🗑 Выдаліць
          </button>
        </div>
      </div>
    </div>

);
}
