import React, { useState } from "react";
import Divider from "../shared/Divider";
import { Copy, Check, X, Factory, Tag } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        {/* ВЕРХНЯЯ ПАНЭЛЬ (СІСТЭМНАЯ) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              {v.vacancyCode}
            </span>
            {v.category && (
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/20 uppercase tracking-wider">
                <Tag size={10} className="inline mr-1" /> {v.category}
              </span>
            )}
            {v.brand && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20 uppercase tracking-wider">
                <Factory size={10} className="inline mr-1" /> {v.brand}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
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

        <div className="px-8 py-6 space-y-8">
          {/* ГАЛОЎНЫ ЗАГАЛОВАК */}
          <div>
            <h2 className="text-2xl font-black text-white leading-tight mb-2">
              {v.vacancydescription}
            </h2>
            <div className="space-y-1 text-slate-300">
              <p>
                📍 <span className="font-semibold">Місто:</span> {v.location}
              </p>
              {v.checkInCity && (
                <p>
                  🏢 <span className="font-semibold">Оформлення:</span> м.{" "}
                  {v.checkInCity}
                </p>
              )}
              <p>
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
            </div>
          </div>

          {/* АПЛАТА */}
          <section>
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3 border-b border-emerald-500/20 pb-1">
              💰 Оплата праці
            </h3>
            <div className="space-y-1.5 text-slate-200">
              <p>
                • <span className="font-semibold">Ставка:</span>{" "}
                {v.salary?.baseNetto}
              </p>
              {v.salary?.studentNetto && (
                <p>
                  •{" "}
                  <span className="font-semibold text-emerald-400">
                    Студенти:
                  </span>{" "}
                  {v.salary.studentNetto}
                </p>
              )}
              {v.salary?.hoursRange && (
                <p>
                  • <span className="font-semibold">Годин на місяць:</span>{" "}
                  {v.salary.hoursRange}
                </p>
              )}
              {v.salary?.payoutDates && (
                <p>
                  • <span className="font-semibold">Виплати:</span>{" "}
                  {v.salary.payoutDates}
                </p>
              )}
              {v.salary?.bonusDetails && (
                <p className="text-emerald-400 mt-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                  🎁 {v.salary.bonusDetails}
                </p>
              )}
              {v.salary?.salaryNotes && (
                <p className="text-xs text-slate-400 italic mt-1">
                  {v.salary.salaryNotes}
                </p>
              )}
            </div>
          </section>

          {/* АБАВЯЗКІ */}
          <section>
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3 border-b border-blue-500/20 pb-1">
              🛠 Характер роботи
            </h3>
            <div className="space-y-2">
              {v.description?.split(/[.;]/).map(
                (item, i) =>
                  item.trim() && (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-slate-300"
                    >
                      <span className="text-blue-500 mt-1.5">•</span>
                      <span>{item.trim()}</span>
                    </div>
                  ),
              )}
            </div>
          </section>

          {/* ПАТРАБАВАННІ */}
          <section>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3 border-b border-amber-500/20 pb-1">
              📋 Вимоги
            </h3>
            <div className="space-y-1.5 text-slate-200">
              <p>
                • <span className="font-semibold">Вік:</span> до{" "}
                {v.requirements?.ageMax} років
              </p>
              <p>
                • <span className="font-semibold">Документи:</span>{" "}
                {v.requirements?.standardDocs?.join(", ")}
              </p>
              <p>
                • <span className="font-semibold">Мова:</span>{" "}
                {v.requirements?.polishLanguageLevel}
              </p>
              {v.requirements?.physicalLoad && (
                <p>
                  • <span className="font-semibold">Навантаження:</span>{" "}
                  {v.requirements.physicalLoad}
                </p>
              )}
            </div>
          </section>

          {/* ГРАФІК І ДАГАВОР */}
          <section>
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-3 border-b border-purple-500/20 pb-1">
              🕒 Графік та договір
            </h3>
            <div className="space-y-1.5 text-slate-200">
              <p>
                • <span className="font-semibold">Зміни:</span>{" "}
                {v.schedule?.description}
              </p>
              <p>
                • <span className="font-semibold">Робочі дні:</span>{" "}
                {v.schedule?.workDaysWeek}
              </p>
              {v.schedule?.breakDuration && (
                <p>
                  • <span className="font-semibold">Перерва:</span>{" "}
                  {v.schedule.breakDuration}
                </p>
              )}
              <p className="mt-3 text-blue-400 font-bold">
                📄 Тип договору: {v.contractType}
              </p>
            </div>
          </section>

          {/* ЖЫТЛО І ТРАНСПАРТ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-3 border-b border-orange-500/20 pb-1">
                🏠 Проживання
              </h3>
              <div className="space-y-1 text-slate-300">
                <p>
                  <span className="font-semibold">Тип:</span>{" "}
                  {v.accommodation?.type}
                </p>
                {v.accommodation?.costRaw && (
                  <p className="text-orange-400">{v.accommodation.costRaw}</p>
                )}
                {v.accommodation?.details && (
                  <p className="text-xs text-slate-500 mt-1">
                    {v.accommodation.details}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3 border-b border-cyan-500/20 pb-1">
                🚌 Транспорт
              </h3>
              <div className="space-y-1 text-slate-300">
                <p>
                  <span className="font-semibold">Давіз:</span>{" "}
                  {v.transport?.provided ? "Надається" : "Власний"}
                </p>
                {v.transport?.costRaw && (
                  <p className="text-cyan-400">{v.transport.costRaw}</p>
                )}
                {v.transport?.details && (
                  <p className="text-xs text-slate-500 mt-1">
                    {v.transport.details}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* УМОВЫ ПРАЦЫ */}
          <section>
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-3 border-b border-rose-500/20 pb-1">
              🌡 Умови праці
            </h3>
            <div className="space-y-1.5 text-slate-200">
              <p>
                • <span className="font-semibold">Робочий одяг:</span>{" "}
                {v.conditions?.workwearFree
                  ? "Безкоштовно"
                  : "За рахунок працівника"}
              </p>
              <p>
                • <span className="font-semibold">Харчування:</span>{" "}
                {v.conditions?.foodType}
              </p>
              {v.conditions?.specificNuances?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {v.conditions.specificNuances.map((n) => (
                    <span
                      key={n}
                      className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}
              {v.conditions?.foodDetails && (
                <p className="text-xs text-slate-500 italic mt-1">
                  {v.conditions.foodDetails}
                </p>
              )}
            </div>
          </section>

          {/* ВЫДАТКІ І КАМПЕНСАЦЫІ */}
          {(v.startExpenses?.hasStartExpenses ||
            v.employerCompensations?.hasCompensations) && (
            <section className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
              {v.startExpenses?.hasStartExpenses && (
                <div className="mb-3">
                  <p className="text-xs font-bold text-orange-400 uppercase mb-1">
                    💸 Витрати на старті
                  </p>
                  <p className="text-sm text-slate-300">
                    {v.startExpenses.details}
                  </p>
                </div>
              )}
              {v.employerCompensations?.hasCompensations && (
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

          {/* МЕТА-ДАНЫ */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-600">
            <span>ID: {v._id?.toUpperCase()}</span>
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
