// frontend/src/components/templates/TemplateViewModal.jsx
import React from "react";
import Divider from "../shared/Divider";
import {
  MapPin,
  Wallet,
  Clock,
  Info,
  Thermometer,
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
        {/* Загалавак */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20 uppercase tracking-wider font-bold">
                {t.agencyName}
              </span>
            </div>
            <h2 className="font-bold text-slate-100 text-lg leading-tight">
              {t.templateName}
            </h2>
            {t.title && t.title !== t.templateName && (
              <p className="text-sm text-slate-400 mt-0.5">{t.title}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Змест */}
        <div className="px-6 py-5 space-y-6">
          {/* Лакацыя */}
          {t.location && (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                <MapPin size={14} className="text-red-400" /> {t.location}
              </span>
              {t.country && t.country !== "Польща" && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  <Globe size={14} className="text-blue-400" /> {t.country}
                </span>
              )}
            </div>
          )}

          {/* Ківорды */}
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

          {/* Аплата */}
          {(t.salary?.base ||
            t.salary?.student ||
            t.salary?.monthly ||
            t.salary?.bonus ||
            t.salary?.notes) && (
            <>
              <Divider label="💰 Аплата" />
              <div className="space-y-1.5 text-sm">
                {t.salary.base && (
                  <div className="text-slate-100 font-bold text-base flex items-center gap-2">
                    <Wallet size={16} className="text-slate-500 shrink-0" />
                    {t.salary.base}
                  </div>
                )}
                {t.salary.monthly && (
                  <div className="text-slate-400 ml-6">{t.salary.monthly}</div>
                )}
                {t.salary.student && (
                  <div className="text-emerald-400/90 ml-6 font-medium">
                    Студэнты: {t.salary.student}
                  </div>
                )}
                {t.salary.bonus && (
                  <div className="text-emerald-400 text-xs bg-emerald-500/5 py-1.5 px-3 rounded-lg mt-1 ml-6 border border-emerald-500/10">
                    🎁 {t.salary.bonus}
                  </div>
                )}
                {t.salary.notes && (
                  <div className="text-amber-400/90 text-xs mt-2 italic border-l-2 border-amber-500/30 pl-3 ml-6">
                    {t.salary.notes}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Абавязкі */}
          {t.description && (
            <>
              <Divider label="🛠 Абавязкі" />
              <ul className="space-y-2">
                {t.description.split(";").map(
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
          {(t.requirements?.gender ||
            t.requirements?.age ||
            t.requirements?.docs?.length > 0 ||
            t.requirements?.nationalities?.length > 0 ||
            t.requirements?.physical) && (
            <>
              <Divider label="📋 Патрабаванні" />
              <div className="flex flex-wrap gap-2">
                {t.requirements.gender && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <User size={12} className="text-blue-400" />
                    {t.requirements.gender}
                  </span>
                )}
                {t.requirements.age && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🎂 {t.requirements.age}
                  </span>
                )}
                {t.requirements.nationalities?.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    <Globe size={12} className="text-emerald-500" />
                    {t.requirements.nationalities.join(", ")}
                  </span>
                )}
                {t.requirements.docs?.map((doc) => (
                  <span
                    key={doc}
                    className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20"
                  >
                    <FileText size={12} /> {doc}
                  </span>
                ))}
              </div>
              {t.requirements.physical && (
                <div className="text-xs text-slate-500 italic mt-2 pl-1 leading-relaxed">
                  {t.requirements.physical}
                </div>
              )}
            </>
          )}

          {/* Графік */}
          {(t.schedule?.shifts || t.schedule?.hours || t.schedule?.details) && (
            <>
              <Divider label="🕒 Графік" />
              <div className="text-sm space-y-1.5 ml-1">
                {t.schedule.shifts && (
                  <div className="text-slate-300 flex items-start gap-2">
                    <Clock
                      size={16}
                      className="text-slate-500 shrink-0 mt-0.5"
                    />
                    {t.schedule.shifts}
                  </div>
                )}
                {t.schedule.hours && (
                  <div className="text-slate-400 text-xs font-mono ml-6 bg-slate-800/50 px-2 py-0.5 rounded inline-block">
                    {t.schedule.hours}
                  </div>
                )}
                {t.schedule.details && (
                  <div className="text-slate-500 text-xs ml-6 italic leading-relaxed">
                    {t.schedule.details}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Тып дагавора */}
          {t.contractType && (
            <div className="text-sm text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800 inline-flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              Тып дагавора:{" "}
              <span className="text-slate-200 font-medium">
                {t.contractType}
              </span>
            </div>
          )}

          {/* Жытло */}
          {(t.accommodation?.available !== undefined ||
            t.accommodation?.cost ||
            t.accommodation?.details) && (
            <>
              <Divider label="🏠 Жытло" />
              <div className="text-sm space-y-1.5 ml-1">
                {t.accommodation?.available === false ? (
                  <div className="text-slate-500 flex items-center gap-2">
                    <Home size={16} className="text-slate-600" />
                    Жытло не прадастаўляецца
                  </div>
                ) : (
                  <>
                    {t.accommodation?.cost && (
                      <div className="text-slate-300 font-medium flex items-center gap-2">
                        <Home size={16} className="text-orange-400" />
                        {t.accommodation.cost}
                      </div>
                    )}
                    {t.accommodation?.details && (
                      <div className="text-slate-500 text-xs leading-relaxed ml-6">
                        {t.accommodation.details}
                      </div>
                    )}
                    {t.accommodation?.deposit && (
                      <div className="text-orange-400/80 text-[10px] uppercase tracking-wider font-bold ml-6 mt-1">
                        💰 Кауцыя: {t.accommodation.deposit}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* Транспарт */}
          {(t.transport?.provided !== undefined ||
            t.transport?.cost ||
            t.transport?.details) && (
            <>
              <Divider label="🚌 Транспарт" />
              <div className="text-sm space-y-1 ml-1">
                {t.transport?.provided === false ? (
                  <div className="text-slate-500 flex items-center gap-2">
                    <Bus size={16} className="text-slate-600" />
                    Транспарт не прадастаўляецца
                  </div>
                ) : (
                  <div className="text-slate-300 flex items-start gap-2">
                    <Bus size={16} className="text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      {t.transport?.cost && <span>{t.transport.cost}</span>}
                      {t.transport?.details && (
                        <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                          {t.transport.details}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Умовы працы */}
          {(t.conditions?.temperature ||
            t.conditions?.workwear ||
            t.conditions?.food ||
            t.conditions?.notes) && (
            <>
              <Divider label="🌡 Умовы працы" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {t.conditions.temperature && (
                  <div className="text-slate-300 flex items-center gap-2 bg-slate-800/30 p-2 rounded-lg">
                    <Thermometer size={16} className="text-blue-400 shrink-0" />
                    {t.conditions.temperature}
                  </div>
                )}
                {t.conditions.workwear && (
                  <div className="text-slate-300 flex items-center gap-2 bg-slate-800/30 p-2 rounded-lg">
                    <Shirt size={16} className="text-orange-400 shrink-0" />
                    {t.conditions.workwear}
                  </div>
                )}
                {t.conditions.food && (
                  <div className="text-slate-300 flex items-center gap-2 bg-slate-800/30 p-2 rounded-lg">
                    <Utensils size={16} className="text-emerald-400 shrink-0" />
                    {t.conditions.food}
                  </div>
                )}
                {t.conditions.notes && (
                  <div className="text-slate-500 text-xs italic bg-slate-800/30 p-2 rounded-lg sm:col-span-2">
                    <Info size={12} className="inline mr-1" />
                    {t.conditions.notes}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Дадатковая інфармацыя */}
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

          {/* Мета */}
          <div className="text-[10px] text-slate-600 pt-4 border-t border-slate-800 flex justify-between font-mono">
            <span>ID: {t._id?.substring(t._id.length - 8).toUpperCase()}</span>
            {t.createdAt && (
              <span>
                ДАДАНА: {new Date(t.createdAt).toLocaleString("uk-UA")}
              </span>
            )}
          </div>
        </div>

        {/* Кнопкі */}
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
