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
          {(vacancy.salary?.base || vacancy.salary?.monthly) && (
            <>
              <Divider label="💰 Аплата" />
              <div className="space-y-1 text-sm">
                {vacancy.salary.base && (
                  <div className="text-slate-300">{vacancy.salary.base}</div>
                )}
                {vacancy.salary.monthly && (
                  <div className="text-slate-400">{vacancy.salary.monthly}</div>
                )}
                {vacancy.salary.student && (
                  <div className="text-slate-500">
                    Студэнты: {vacancy.salary.student}
                  </div>
                )}
                {vacancy.salary.bonus && (
                  <div className="text-emerald-400 text-xs">
                    {vacancy.salary.bonus}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Апісанне */}
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
            vacancy.requirements?.docs?.length > 0) && (
            <>
              <Divider label="📋 Патрабаванні" />
              <div className="flex flex-wrap gap-2">
                {vacancy.requirements.gender && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                    👤 {vacancy.requirements.gender}
                  </span>
                )}
                {vacancy.requirements.age && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                    🎂 {vacancy.requirements.age}
                  </span>
                )}
                {vacancy.requirements.docs?.map((doc) => (
                  <span
                    key={doc}
                    className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full"
                  >
                    📄 {doc}
                  </span>
                ))}
                {vacancy.requirements.nationalities?.length > 0 && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                    🌍 {vacancy.requirements.nationalities.join(", ")}
                  </span>
                )}
              </div>
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
                  <div className="text-slate-500 text-xs">
                    {vacancy.schedule.hours}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Тып дагавора */}
          {vacancy.contractType && (
            <div className="text-sm text-slate-500">
              📄 Тып дагавора:{" "}
              <span className="text-slate-300">{vacancy.contractType}</span>
            </div>
          )}

          {/* Жытло */}
          {vacancy.accommodation?.cost && (
            <>
              <Divider label="🏠 Жытло" />
              <div className="text-sm space-y-1">
                <div className="text-slate-300">
                  {vacancy.accommodation.cost}
                </div>
                {vacancy.accommodation.details && (
                  <div className="text-slate-500 text-xs">
                    {vacancy.accommodation.details}
                  </div>
                )}
                {vacancy.accommodation.deposit && (
                  <div className="text-slate-500 text-xs">
                    {vacancy.accommodation.deposit}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Транспарт */}
          {vacancy.transport?.cost && (
            <>
              <Divider label="🚌 Транспарт" />
              <div className="text-sm text-slate-300">
                {vacancy.transport.cost}
                {vacancy.transport.details && (
                  <span className="text-slate-500 ml-2">
                    ({vacancy.transport.details})
                  </span>
                )}
              </div>
            </>
          )}

          {/* Умовы */}
          {(vacancy.conditions?.temperature ||
            vacancy.conditions?.workwear ||
            vacancy.conditions?.food) && (
            <>
              <Divider label="🌡 Умовы працы" />
              <div className="text-sm space-y-1">
                {vacancy.conditions.temperature && (
                  <div className="text-slate-400">
                    🌡 {vacancy.conditions.temperature}
                  </div>
                )}
                {vacancy.conditions.workwear && (
                  <div className="text-slate-400">
                    👔 {vacancy.conditions.workwear}
                  </div>
                )}
                {vacancy.conditions.food && (
                  <div className="text-slate-400">
                    🍽 {vacancy.conditions.food}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Дата */}
          <div className="text-xs text-slate-600 pt-2">
            Дадана:{" "}
            {new Date(vacancy.createdAt).toLocaleString("uk-UA", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Кнопкі */}
        <div className="flex flex-wrap gap-2 px-6 py-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          {/* Для кандыдатаў */}
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

          {/* Для рэкрутэра */}
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
              className="px-4 py-2 bg-slate-800 hover:bg-red-500/10 text-red-400 text-sm rounded-lg transition-colors"
            >
              🗑 Выдаліць
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
