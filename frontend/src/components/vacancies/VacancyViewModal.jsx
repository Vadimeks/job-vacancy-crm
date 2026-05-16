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
                  ? "Активна"
                  : v.status === "closed"
                    ? "Закрита"
                    : "Архів"}
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
                <span className="text-white">
                  {v.gender ||
                    (Array.isArray(v.requirements?.gender)
                      ? v.requirements.gender.join(", ")
                      : v.requirements?.gender)}
                </span>
                {v.requirements?.genderDescription && (
                  <span className="text-slate-400 ml-1 italic">
                    ({v.requirements.genderDescription})
                  </span>
                )}
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
              {v.requirements?.ageMax && (
                <Row label="Вік" value={v.requirements.ageMax} />
              )}
              {v.requirements?.nationalities?.length > 0 && (
                <Row
                  label="Національність"
                  value={v.requirements.nationalities.join(", ")}
                />
              )}
              <Row
                label="Документи"
                value={v.requirements?.standardDocs?.join(", ")}
              />
              {v.requirements?.additionalDocsDetails && (
                <Note>Додатково: {v.requirements.additionalDocsDetails}</Note>
              )}
              <Row label="Мова" value={v.requirements?.polishLanguageLevel} />
              {v.requirements?.physicalLoad === true && (
                <p className="text-sm text-red-400 font-bold flex items-center gap-2">
                  ⚡ Фізично важка праця
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

              {/* НЮАНСЫ — каляровыя тэгі v2.1 */}
              {v.conditions?.specificNuances?.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                  {v.conditions.specificNuances.map((n, idx) => {
                    const text = typeof n === "object" ? n.text : n;
                    const category =
                      typeof n === "object" ? n.category : "Інше";
                    const isUrgent =
                      category === "temperature" ||
                      category === "physical_load";

                    return (
                      <div
                        key={idx}
                        className={`px-3 py-2 rounded-lg text-xs border flex flex-col gap-0.5 ${isUrgent ? "bg-red-500/5 text-red-400 border-red-500/10" : "bg-slate-800/50 text-slate-300 border-slate-700"}`}
                      >
                        <span className="text-[10px] font-bold uppercase opacity-50 tracking-wider">
                          {category}
                        </span>
                        <span className="font-medium">{text}</span>
                      </div>
                    );
                  })}
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
            <span>
              СТВОРЕНО: {new Date(v.createdAt).toLocaleString("uk-UA")}
            </span>
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
