// frontend/src/components/vacancies/VacancyViewModal.jsx
import React, { useState } from "react";
import Divider from "../shared/Divider";
import {
  Calendar,
  MapPin,
  Wallet,
  Clock,
  Info,
  Thermometer,
  Shirt,
  Copy,
  Check,
  User,
  Globe,
  FileText,
  Home,
  Bus,
  Utensils,
  Tag,
} from "lucide-react";

export default function VacancyViewModal({
  vacancy,
  onClose,
  onEdit,
  onDelete,
  onApply,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        {/* ЗАГАЛОВАК */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              {v.vacancyCode && (
                <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  {v.vacancyCode}
                </span>
              )}
              {v.agencyName && v.agencyName !== "Manual" && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20 uppercase tracking-wider font-bold">
                  {v.agencyName}
                </span>
              )}
            </div>
            <h2 className="font-bold text-slate-100 text-lg leading-tight">
              {v.templateName || v.vacancydescription || "Без назвы"}
            </h2>
            {v.vacancydescription &&
              v.templateName !== v.vacancydescription && (
                <p className="text-sm text-slate-400 mt-0.5">
                  {v.vacancydescription}
                </p>
              )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTelegram}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-all"
              title="Скапіяваць для Telegram"
            >
              {copied ? (
                <Check size={18} className="text-emerald-400" />
              ) : (
                <Copy size={18} />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ЗМЕСТ */}
        <div className="px-6 py-5 space-y-6">
          {/* Лакацыя і даты */}
          <div className="flex flex-wrap gap-2 text-sm">
            {v.location && (
              <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                <MapPin size={14} className="text-red-400" /> {v.location}
              </span>
            )}
            {v.checkInCity && (
              <span className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 text-xs">
                📋 Аформленне: {v.checkInCity}
              </span>
            )}
            {v.arrivalDate && (
              <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                <Calendar size={14} /> Прыезд: {v.arrivalDate}
              </span>
            )}
            {v.count && (
              <span className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 text-xs">
                👥 {v.count}
              </span>
            )}
          </div>

          {/* АПЛАТА */}
          {(v.salary?.baseNetto ||
            v.salary?.bonusDetails ||
            v.salary?.salaryNotes) && (
            <>
              <Divider label="💰 Аплата" />
              <div className="space-y-1.5 text-sm">
                {v.salary.baseNetto && (
                  <div className="text-slate-100 font-bold text-base flex items-center gap-2">
                    <Wallet size={16} className="text-slate-500 shrink-0" />
                    {v.salary.baseNetto}
                  </div>
                )}
                {v.salary.studentNetto && (
                  <div className="text-emerald-400/90 ml-6 font-medium">
                    Студэнты: {v.salary.studentNetto}
                  </div>
                )}
                {v.salary.hoursRange && (
                  <div className="text-slate-400 ml-6">
                    Гадзін: {v.salary.hoursRange}
                  </div>
                )}
                {v.salary.payoutDates && (
                  <div className="text-slate-400 ml-6">
                    Выплаты: {v.salary.payoutDates}
                  </div>
                )}
                {v.salary.bonusDetails && (
                  <div className="text-emerald-400 text-xs bg-emerald-500/5 py-1.5 px-3 rounded-lg mt-1 ml-6 border border-emerald-500/10">
                    🎁 {v.salary.bonusDetails}
                  </div>
                )}
                {v.salary.salaryNotes && (
                  <div className="text-amber-400/90 text-xs mt-2 italic border-l-2 border-amber-500/30 pl-3 ml-6">
                    {v.salary.salaryNotes}
                  </div>
                )}
              </div>
            </>
          )}

          {/* АПІСАННЕ / АБАВЯЗКІ */}
          {v.description && (
            <>
              <Divider label="🛠 Абавязкі" />
              <ul className="space-y-2">
                {v.description.split(/[.;]/).map(
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
          {(v.requirements?.gender?.length > 0 ||
            v.requirements?.ageMax ||
            v.requirements?.standardDocs?.length > 0 ||
            v.requirements?.polishLanguageLevel ||
            v.requirements?.physicalLoad) && (
            <>
              <Divider label="📋 Патрабаванні" />
              <div className="flex flex-wrap gap-2">
                {v.requirements.gender?.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <User size={12} className="text-blue-400" />
                    {Array.isArray(v.requirements.gender)
                      ? v.requirements.gender.join(", ")
                      : v.requirements.gender}
                  </span>
                )}
                {v.requirements.ageMax && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🎂 да {v.requirements.ageMax} гадоў
                  </span>
                )}
                {v.requirements.polishLanguageLevel && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🗣 {v.requirements.polishLanguageLevel}
                  </span>
                )}
                {v.requirements.standardDocs?.map((doc) => (
                  <span
                    key={doc}
                    className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20"
                  >
                    <FileText size={12} /> {doc}
                  </span>
                ))}
              </div>
              {v.requirements.physicalLoad && (
                <div className="text-xs text-slate-500 italic mt-2 pl-1">
                  {v.requirements.physicalLoad}
                </div>
              )}
            </>
          )}

          {/* ГРАФІК */}
          {(v.schedule?.description ||
            v.schedule?.workDaysWeek ||
            v.schedule?.hoursPerShift) && (
            <>
              <Divider label="🕒 Графік" />
              <div className="text-sm space-y-1.5 ml-1">
                {v.schedule.description && (
                  <div className="text-slate-300 flex items-start gap-2">
                    <Clock
                      size={16}
                      className="text-slate-500 shrink-0 mt-0.5"
                    />
                    {v.schedule.description}
                  </div>
                )}
                {v.schedule.workDaysWeek && (
                  <div className="text-slate-400 text-xs ml-6">
                    {v.schedule.workDaysWeek}
                  </div>
                )}
                {v.schedule.hoursPerShift && (
                  <div className="text-slate-400 text-xs font-mono ml-6 bg-slate-800/50 px-2 py-0.5 rounded inline-block">
                    {v.schedule.hoursPerShift}
                  </div>
                )}
                {v.schedule.breakDuration && (
                  <div className="text-slate-500 text-xs ml-6 italic">
                    Перапынак: {v.schedule.breakDuration}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ТЫП ДАГАВОРА */}
          {v.contractType && (
            <div className="text-sm text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800 inline-flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              <span>
                Тып дагавора:{" "}
                <span className="text-slate-200 font-medium">
                  {v.contractType}
                </span>
              </span>
            </div>
          )}

          {/* ЖЫТЛО */}
          {(v.accommodation?.type || v.accommodation?.costRaw) && (
            <>
              <Divider label="🏠 Жытло" />
              <div className="text-sm space-y-1.5 ml-1">
                <div className="text-slate-300 font-medium flex items-center gap-2">
                  <Home size={16} className="text-orange-400" />
                  {v.accommodation.type}
                  {v.accommodation.forCouples && (
                    <span className="text-xs bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20 ml-1">
                      💑 Пары
                    </span>
                  )}
                </div>
                {v.accommodation.costRaw && (
                  <div className="text-slate-400 ml-6">
                    {v.accommodation.costRaw}
                  </div>
                )}
                {v.accommodation.details && (
                  <div className="text-slate-500 text-xs leading-relaxed ml-6">
                    {v.accommodation.details}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ТРАНСПАРТ */}
          {(v.transport?.provided ||
            v.transport?.costRaw ||
            v.transport?.details) && (
            <>
              <Divider label="🚌 Транспарт" />
              <div className="text-sm text-slate-300 flex items-start gap-2 ml-1">
                <Bus size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  {v.transport.costRaw && <span>{v.transport.costRaw}</span>}
                  {v.transport.details && (
                    <div className="text-slate-500 text-xs mt-0.5">
                      {v.transport.details}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ВЫДАТКІ І АДКАЗНАСЦЬ */}
          {(v.startExpenses?.hasStartExpenses ||
            v.earlyTerminationLiability?.hasLiability) && (
            <>
              <Divider label="💸 Выдаткі і адказнасць" />
              <div className="space-y-1.5 text-sm ml-1">
                {v.startExpenses?.hasStartExpenses &&
                  v.startExpenses.details && (
                    <div className="text-orange-400/80 text-xs bg-orange-500/5 px-3 py-2 rounded-lg border border-orange-500/10">
                      На старце: {v.startExpenses.details}
                    </div>
                  )}
                {v.earlyTerminationLiability?.hasLiability &&
                  v.earlyTerminationLiability.details && (
                    <div className="text-red-400/80 text-xs bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10">
                      Датэрміновае звальненне:{" "}
                      {v.earlyTerminationLiability.details}
                    </div>
                  )}
              </div>
            </>
          )}

          {/* УМОВЫ ПРАЦЫ */}
          {(v.conditions?.specificConditionsDetails ||
            v.conditions?.specificNuances?.length > 0 ||
            v.conditions?.foodType ||
            v.conditions?.foodDetails) && (
            <>
              <Divider label="🌡 Умовы працы" />
              <div className="space-y-2 text-sm ml-1">
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <Shirt size={12} className="text-orange-400" />
                    Вопратка:{" "}
                    {v.conditions.workwearFree
                      ? "Бясплатна"
                      : "За кошт работніка"}
                  </span>
                  {v.conditions.foodType && (
                    <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                      <Utensils size={12} className="text-emerald-400" />
                      {v.conditions.foodType}
                    </span>
                  )}
                </div>
                {v.conditions.specificNuances?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 ml-1">
                    {v.conditions.specificNuances.map((n) => (
                      <span
                        key={n}
                        className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700/50"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                )}
                {v.conditions.specificConditionsDetails && (
                  <div className="text-slate-500 text-xs italic pl-1">
                    {v.conditions.specificConditionsDetails}
                  </div>
                )}
                {v.conditions.foodDetails && (
                  <div className="text-slate-500 text-xs italic pl-1">
                    {v.conditions.foodDetails}
                  </div>
                )}
              </div>
            </>
          )}

          {/* КАМПЕНСАЦЫІ АД ПРАЦАДАЎЦЫ */}
          {v.employerCompensations?.hasCompensations &&
            v.employerCompensations.details && (
              <>
                <Divider label="🎁 Кампенсацыі" />
                <div className="text-sm text-slate-300 ml-1">
                  {v.employerCompensations.details}
                </div>
              </>
            )}

          {/* ДАДАТКОВАЯ ІНФАРМАЦЫЯ */}
          {v.additionalNotes && (
            <div className="mt-2 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Info size={14} /> Важна ведаць
              </div>
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {v.additionalNotes}
              </div>
            </div>
          )}

          {/* УНУТРАНЫЯ НАТАТКІ РЭКРУТЭРА */}
          {v.forRecruiter?.internalNotes && (
            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                🔒 Нататкі рэкрутэра
              </div>
              <div className="text-xs text-slate-400 whitespace-pre-wrap">
                {v.forRecruiter.internalNotes}
              </div>
            </div>
          )}

          {/* МЕТА */}
          <div className="text-[10px] text-slate-600 pt-4 border-t border-slate-800 flex justify-between font-mono">
            <span>ID: {v._id?.substring(v._id.length - 8).toUpperCase()}</span>
            <span>
              ДАДАНА:{" "}
              {new Date(v.createdAt).toLocaleString("uk-UA", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* КНОПКІ ДЗЕЯННЯЎ */}
        <div className="flex flex-wrap gap-2 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          {/* {onApply && vacancy.status === "active" && (
            <>
              <button
                onClick={() => onApply(vacancy, "want_work")}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm rounded-lg transition-all shadow-lg shadow-emerald-500/10"
              >
                🟢 Хачу працаваць
              </button>
              <button
                onClick={() => onApply(vacancy, "want_info")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-all border border-slate-700"
              >
                💬 Дэталі
              </button>
            </>
          )} */}
          {onMatch && (
            <button
              onClick={() => onMatch(vacancy)}
              className="px-4 py-2 bg-slate-800 hover:bg-emerald-500/10 text-emerald-400 text-sm font-semibold rounded-lg transition-all border border-slate-700"
            >
              🎯 Кандыдаты
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(vacancy)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-all border border-slate-700"
            >
              ✏️ Рэдагаваць
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(vacancy._id)}
              className="px-4 py-2 bg-red-500/5 hover:bg-red-500/10 text-red-500/70 text-sm font-semibold rounded-lg transition-all border border-red-500/10 ml-auto"
            >
              🗑 Выдаліць
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
