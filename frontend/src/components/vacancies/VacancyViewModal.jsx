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

  const handleCopyTelegram = () => {
    navigator.clipboard.writeText(vacancy.telegramPost || "");
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
        {/* Загалавак */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {vacancy.vacancyCode && (
                <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  {vacancy.vacancyCode}
                </span>
              )}
              {vacancy.agencyName && vacancy.agencyName !== "Manual" && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20 uppercase tracking-wider font-bold">
                  {vacancy.agencyName}
                </span>
              )}
            </div>
            <h2 className="font-bold text-slate-100 text-lg leading-tight">
              {vacancy.title}
            </h2>
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

        {/* Змест */}
        <div className="px-6 py-5 space-y-6">
          {/* Асноўная інфа (БЕЗ поля count) */}
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              <MapPin size={14} className="text-red-400" /> {vacancy.location}
            </span>
            {vacancy.country && vacancy.country !== "Польща" && (
              <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 font-medium">
                <Globe size={14} className="text-blue-400" /> {vacancy.country}
              </span>
            )}
            {vacancy.arrivalDate && (
              <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                <Calendar size={14} /> Прыезд: {vacancy.arrivalDate}
              </span>
            )}
          </div>

          {/* Аплата */}
          {(vacancy.salary?.base ||
            vacancy.salary?.monthly ||
            vacancy.salary?.notes) && (
            <>
              <Divider label="💰 Аплата" />
              <div className="space-y-1 text-sm">
                {vacancy.salary.base && (
                  <div className="text-slate-100 font-bold text-base flex items-center gap-2">
                    <Wallet size={16} className="text-slate-500" />{" "}
                    {vacancy.salary.base}
                  </div>
                )}
                {vacancy.salary.monthly && (
                  <div className="text-slate-400 ml-6">
                    {vacancy.salary.monthly}
                  </div>
                )}
                {vacancy.salary.student && (
                  <div className="text-emerald-400/90 ml-6 font-medium">
                    Студэнты: {vacancy.salary.student}
                  </div>
                )}
                {vacancy.salary.bonus && (
                  <div className="text-emerald-400 text-xs bg-emerald-500/5 py-1 px-2 rounded inline-block mt-1 ml-6 border border-emerald-500/10">
                    🎁 {vacancy.salary.bonus}
                  </div>
                )}
                {vacancy.salary.notes && (
                  <div className="text-amber-400/90 text-xs mt-2 italic border-l-2 border-amber-500/30 pl-3 ml-6">
                    {vacancy.salary.notes}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Апісанне / Абавязкі */}
          {vacancy.description && (
            <>
              <Divider label="🛠 Абавязкі" />
              <ul className="space-y-2">
                {vacancy.description.split(";").map(
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

          {/* Патрабаванні */}
          {(vacancy.requirements?.gender ||
            vacancy.requirements?.age ||
            (vacancy.requirements?.docs &&
              vacancy.requirements.docs.length > 0) ||
            (vacancy.requirements?.nationalities &&
              vacancy.requirements.nationalities.length > 0)) && (
            <>
              <Divider label="📋 Патрабаванні" />
              <div className="flex flex-wrap gap-2">
                {vacancy.requirements.gender && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <User size={12} className="text-blue-400" />{" "}
                    {vacancy.requirements.gender}
                  </span>
                )}
                {vacancy.requirements.age && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🎂 {vacancy.requirements.age}
                  </span>
                )}
                {vacancy.requirements.docs?.map((doc) => (
                  <span
                    key={doc}
                    className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700"
                  >
                    <FileText size={12} className="text-slate-500" /> {doc}
                  </span>
                ))}
                {vacancy.requirements.nationalities?.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <Globe size={12} className="text-emerald-500" />{" "}
                    {vacancy.requirements.nationalities.join(", ")}
                  </span>
                )}
              </div>
              {vacancy.requirements.physical && (
                <div className="text-xs text-slate-500 italic mt-2 pl-1">
                  {vacancy.requirements.physical}
                </div>
              )}
            </>
          )}

          {/* Графік */}
          {vacancy.schedule?.shifts && (
            <>
              <Divider label="🕒 Графік" />
              <div className="text-sm space-y-1 ml-1">
                <div className="text-slate-300 flex items-center gap-2">
                  <Clock size={16} className="text-slate-500" />
                  {vacancy.schedule.shifts}
                </div>
                {vacancy.schedule.details && (
                  <div className="text-slate-500 text-xs ml-6 italic">
                    {vacancy.schedule.details}
                  </div>
                )}
                {vacancy.schedule.hours && (
                  <div className="text-slate-400 text-xs font-mono ml-6 bg-slate-800/50 px-2 py-0.5 rounded inline-block">
                    {vacancy.schedule.hours}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Тып дагавора */}
          {vacancy.contractType && (
            <div className="text-sm text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800 inline-flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              <span>
                Тып дагавора:{" "}
                <span className="text-slate-200 font-medium">
                  {vacancy.contractType}
                </span>
              </span>
            </div>
          )}

          {/* Жытло */}
          {vacancy.accommodation?.cost && (
            <>
              <Divider label="🏠 Жытло" />
              <div className="text-sm space-y-1 ml-1">
                <div className="text-slate-300 font-medium flex items-center gap-2">
                  <Home size={16} className="text-orange-400" />
                  {vacancy.accommodation.cost}
                </div>
                {vacancy.accommodation.details && (
                  <div className="text-slate-500 text-xs leading-relaxed ml-6">
                    {vacancy.accommodation.details}
                  </div>
                )}
                {vacancy.accommodation.deposit && (
                  <div className="text-orange-400/80 text-[10px] uppercase tracking-wider font-bold ml-6 mt-1">
                    💰 Кауцыя: {vacancy.accommodation.deposit}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Транспарт */}
          {vacancy.transport?.cost && (
            <>
              <Divider label="🚌 Транспарт" />
              <div className="text-sm text-slate-300 flex items-center gap-2 ml-1">
                <Bus size={16} className="text-blue-400" />
                <span>{vacancy.transport.cost}</span>
                {vacancy.transport.details && (
                  <span className="text-slate-500 text-xs border-l border-slate-700 pl-2">
                    {vacancy.transport.details}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Умовы працы */}
          {(vacancy.conditions?.temperature ||
            vacancy.conditions?.workwear ||
            vacancy.conditions?.food ||
            vacancy.conditions?.notes) && (
            <>
              <Divider label="🌡 Умовы працы" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {vacancy.conditions.temperature && (
                  <div className="text-slate-300 flex items-center gap-2 bg-slate-800/30 p-2 rounded-lg">
                    <Thermometer size={16} className="text-blue-400" />
                    {vacancy.conditions.temperature}
                  </div>
                )}
                {vacancy.conditions.workwear && (
                  <div className="text-slate-300 flex items-center gap-2 bg-slate-800/30 p-2 rounded-lg">
                    <Shirt size={16} className="text-orange-400" />
                    {vacancy.conditions.workwear}
                  </div>
                )}
                {vacancy.conditions.food && (
                  <div className="text-slate-300 flex items-center gap-2 bg-slate-800/30 p-2 rounded-lg">
                    <Utensils size={16} className="text-emerald-400" />
                    {vacancy.conditions.food}
                  </div>
                )}
                {vacancy.conditions.notes && (
                  <div className="text-slate-500 text-xs italic bg-slate-800/30 p-2 rounded-lg col-span-full">
                    <Info size={14} className="inline mr-1" />{" "}
                    {vacancy.conditions.notes}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Дадатковая інфармацыя */}
          {vacancy.additionalNotes && (
            <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Info size={14} /> Важна ведаць
              </div>
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {vacancy.additionalNotes}
              </div>
            </div>
          )}

          {/* Мета-інфармацыя */}
          <div className="text-[10px] text-slate-600 pt-6 border-t border-slate-800 flex justify-between font-mono">
            <span>
              ID: {vacancy._id.substring(vacancy._id.length - 8).toUpperCase()}
            </span>
            <span>
              ДАДАНА: {new Date(vacancy.createdAt).toLocaleString("be-BY")}
            </span>
          </div>
        </div>

        {/* Кнопкі дзеянняў */}
        <div className="flex flex-wrap gap-2 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 z-10">
          {onApply && vacancy.status === "active" && (
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
          )}

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
