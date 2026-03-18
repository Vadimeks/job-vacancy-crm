// frontend/src/components/vacancies/VacancyViewModal.jsx
import Divider from "../shared/Divider";

export default function VacancyViewModal({
  vacancy,
  onClose,
  onEdit,
  onDelete,
  onApply,
  onMatch,
}) {
  if (!vacancy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Загаловак */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {vacancy.vacancyCode && (
                <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  {vacancy.vacancyCode}
                </span>
              )}
              {vacancy.agencyName && vacancy.agencyName !== "Manual" && (
                <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                  {vacancy.agencyName}
                </span>
              )}
            </div>
            <h2 className="font-semibold text-slate-100">{vacancy.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Змест */}
        <div className="px-6 py-5 space-y-4">
          {/* Асноўная інфа */}
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span>📍 {vacancy.location}</span>
            {vacancy.country && vacancy.country !== "Польща" && (
              <span>🌍 {vacancy.country}</span>
            )}
            {vacancy.arrivalDate && (
              <span>📅 Прыезд: {vacancy.arrivalDate}</span>
            )}
            {vacancy.count && <span>👥 {vacancy.count} чал.</span>}
          </div>

          {/* Аплата */}
          {(vacancy.salary?.base ||
            vacancy.salary?.monthly ||
            vacancy.salary?.notes) && (
            <>
              <Divider label="💰 Аплата" />
              <div className="space-y-1 text-sm">
                {vacancy.salary.base && (
                  <div className="text-slate-300 font-medium">
                    {vacancy.salary.base}
                  </div>
                )}
                {vacancy.salary.monthly && (
                  <div className="text-slate-400">{vacancy.salary.monthly}</div>
                )}
                {vacancy.salary.student && (
                  <div className="text-emerald-400/90">
                    Студэнты: {vacancy.salary.student}
                  </div>
                )}
                {vacancy.salary.bonus && (
                  <div className="text-emerald-400 text-xs bg-emerald-500/5 py-1 px-2 rounded inline-block mt-1">
                    🎁 {vacancy.salary.bonus}
                  </div>
                )}
                {/* Новае поле для нататак па зарплаце (напрыклад, пра карту 1.5 зл) */}
                {vacancy.salary.notes && (
                  <div className="text-amber-400/90 text-xs mt-1 italic border-l-2 border-amber-500/30 pl-2">
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
              <ul className="space-y-1">
                {vacancy.description.split(";").map(
                  (item, i) =>
                    item.trim() && (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-400"
                      >
                        <span className="text-emerald-500 mt-0.5">•</span>
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
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    👤 {vacancy.requirements.gender}
                  </span>
                )}
                {vacancy.requirements.age && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🎂 {vacancy.requirements.age}
                  </span>
                )}
                {vacancy.requirements.docs?.map((doc) => (
                  <span
                    key={doc}
                    className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700"
                  >
                    📄 {doc}
                  </span>
                ))}
                {vacancy.requirements.nationalities?.length > 0 && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    🌍 {vacancy.requirements.nationalities.join(", ")}
                  </span>
                )}
              </div>
              {/* Фізічныя патрабаванні */}
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
              <div className="text-sm space-y-1">
                <div className="text-slate-300">{vacancy.schedule.shifts}</div>
                {vacancy.schedule.details && (
                  <div className="text-slate-500 text-xs">
                    {vacancy.schedule.details}
                  </div>
                )}
                {vacancy.schedule.hours && (
                  <div className="text-slate-400 text-xs font-mono">
                    {vacancy.schedule.hours}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Тып дагавора */}
          {vacancy.contractType && (
            <div className="text-sm text-slate-500 bg-slate-800/30 p-2 rounded-lg border border-slate-800/50 inline-block">
              📄 Тып дагавора:{" "}
              <span className="text-slate-300">{vacancy.contractType}</span>
            </div>
          )}

          {/* Жытло */}
          {vacancy.accommodation?.cost && (
            <>
              <Divider label="🏠 Жытло" />
              <div className="text-sm space-y-1">
                <div className="text-slate-300 font-medium">
                  {vacancy.accommodation.cost}
                </div>
                {vacancy.accommodation.details && (
                  <div className="text-slate-500 text-xs leading-relaxed">
                    {vacancy.accommodation.details}
                  </div>
                )}
                {vacancy.accommodation.deposit && (
                  <div className="text-orange-400/80 text-[11px] uppercase tracking-wider font-bold">
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
              <div className="text-sm text-slate-300 flex items-center gap-2">
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
              <div className="text-sm space-y-2">
                {vacancy.conditions.temperature && (
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="w-5 text-center">🌡</span>{" "}
                    {vacancy.conditions.temperature}
                  </div>
                )}
                {vacancy.conditions.workwear && (
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="w-5 text-center">👔</span>{" "}
                    {vacancy.conditions.workwear}
                  </div>
                )}
                {vacancy.conditions.food && (
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="w-5 text-center">🍽</span>{" "}
                    {vacancy.conditions.food}
                  </div>
                )}
                {/* Нататкі па ўмовах */}
                {vacancy.conditions.notes && (
                  <div className="text-slate-500 text-xs italic pl-7">
                    {vacancy.conditions.notes}
                  </div>
                )}
              </div>
            </>
          )}

          {/* НОВАЕ ПОЛЕ: Дадатковая інфармацыя (H&M, паведамленні для рэкрутэраў і г.д.) */}
          {vacancy.additionalNotes && (
            <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2">
                📝 Дадатковая інфармацыя
              </div>
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {vacancy.additionalNotes}
              </div>
            </div>
          )}

          {/* Дата дадання */}
          <div className="text-[10px] text-slate-600 pt-4 border-t border-slate-800 flex justify-between">
            <span>
              ID: {vacancy._id.substring(vacancy._id.length - 6).toUpperCase()}
            </span>
            <span>
              Дадана:{" "}
              {new Date(vacancy.createdAt).toLocaleString("uk-UA", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Кнопкі */}
        <div className="flex flex-wrap gap-2 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          {onApply && vacancy.status === "active" && (
            <>
              <button
                onClick={() => onApply(vacancy, "want_work")}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-medium text-sm rounded-lg transition-colors"
              >
                🟢 Хачу тут працаваць
              </button>
              <button
                onClick={() => onApply(vacancy, "want_info")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
              >
                💬 Дазнацца дэталі
              </button>
            </>
          )}

          {onMatch && (
            <button
              onClick={() => onMatch(vacancy)}
              className="px-4 py-2 bg-slate-800 hover:bg-emerald-500/10 text-emerald-400 text-sm rounded-lg transition-colors"
            >
              🎯 Кандыдаты
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(vacancy)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
            >
              ✏️ Рэдагаваць
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(vacancy._id)}
              className="px-4 py-2 bg-slate-800 hover:bg-red-500/10 text-red-400 text-sm rounded-lg transition-colors ml-auto"
            >
              🗑 Выдаліць
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
