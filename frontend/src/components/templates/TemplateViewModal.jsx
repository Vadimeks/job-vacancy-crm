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
        {/* ЗАГАЛОВАК */}
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
