import React, { useState, useEffect } from "react"; // Дадалі useEffect
import { 
  Copy, Check, X, Factory, Tag, Building2, 
  ChevronLeft, ChevronRight, Sparkles, Send, 
  AlertCircle, Share2, Image, Link, Calendar, RefreshCw 
} from "lucide-react";
import { generateVacancyPreview, publishVacancy, reparseVacancy } from "../../services/api";
const formatText = (text) => {
  if (!text || typeof text !== "string") return "";

  // Калі ў тэксце ўжо ёсць пераносы радкоў — значыць, AI ўжо яго аформіў, вяртаем як ёсць
  if (text.includes("\n")) return text;

  // Разбіваем тэкст па:
  // 1. Кропцы з коскай (;)
  // 2. Кропцы (.), пасля якой ідзе прабел і ВЯЛІКАЯ літара (каб не зламаць "м. Poznań" ці "25.36")
  const parts = text
    .split(/[;]\s*|\.\s+(?=[A-ZА-ЯЁІЎ])/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length > 1) {
    // Дадаем буліт да кожнага пункта і злучаем пераносам радка
    return "• " + parts.join("\n• ");
  }

  return text;
};
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

const Note = ({ children }) =>
  children ? (
    <p className="text-xs text-slate-700 italic mt-1 leading-relaxed">
      {children}
    </p>
  ) : null;

const Row = ({ label, value }) =>
  value ? (
    <p className="text-sm text-slate-700 leading-snug">
      • <span className="font-semibold text-slate-700">{label}:</span>{" "}
      <span>{value}</span>
    </p>
  ) : null;

export default function VacancyViewModal({
  vacancy,
  onClose,
  onEdit,
  onUpdate, // 👈 ДАДАДЗЕНА: новы проп для ціхага абнаўлення
  onDelete,
  onMatch,
  onNext,
  onPrev,
  currentIndex,
  totalCount
}) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editedFull, setEditedFull] = useState(vacancy?.telegramFull || "");
  const [editedShort, setEditedShort] = useState(vacancy?.telegramShort || "");
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState("full"); // 'full' або 'short'
  const [selectedFile, setSelectedFile] = useState(null);
  const [isReparsing, setIsReparsing] = useState(false);

  const handleReparse = async () => {
    if (!confirm("Запустити повторний аналіз тексту через AI? Це оновить дані вакансії.")) return;
    setIsReparsing(true);
    try {
      const res = await reparseVacancy(v._id);
       // 💡 ЗМЕНЕНА: Выклікаем onUpdate, каб застацца ў рэжыме прагляду
      if (onUpdate) onUpdate(res.data);
      alert("✅ Дані вакансії оновлено праз AI!");
    } catch (err) {
      alert("Помилка AI-аналізу: " + (err.response?.data?.message || err.message));
    } finally {
      setIsReparsing(false);
    }
  };
  // Скрол уверх пры змене вакансіі
  useEffect(() => {
    const modalElement = document.getElementById("vacancy-view-modal-content");
    if (modalElement) modalElement.scrollTop = 0;
  }, [vacancy?._id]);
  // 👈 ФІКС ПАМЫЛКІ: Сінхранізацыя стэйту пры змене вакансіі (карусель)
  // Гэты патэрн працуе хутчэй за useEffect і не выклікае памылак лінтэра
 
 const [prevId, setPrevId] = useState(vacancy?._id);
  const [lastUpdated, setLastUpdated] = useState(vacancy?.updatedAt); // 👈 ДАДАДЗЕНА

  if (vacancy?._id !== prevId || vacancy?.updatedAt !== lastUpdated) {
    setPrevId(vacancy?._id);
    setLastUpdated(vacancy?.updatedAt); // 👈 ЗАПАМІНАЕМ час абнаўлення
    setEditedFull(vacancy?.telegramFull || "");
    setEditedShort(vacancy?.telegramShort || "");
    // Не чапаем setShowEditor, каб не закрываць яго, калі карыстальнік яго ўжо адкрыў
  }
  // Кіраванне клавіятурай
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, onClose]);
  
  if (!vacancy) return null;
  const v = vacancy;

 const handleCopyTelegram = () => {
    // Калі рэдактар адкрыты — капіюем адрэдагаваны тэкст з актыўнай укладкі
    const textToCopy = showEditor 
      ? (activeTab === "full" ? editedFull : editedShort)
      : (vacancy?.telegramPost || ""); // 👈 Выкарыстоўваем vacancy для надзейнасці
      
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
const handleGenerate = async () => {
    setIsGenerating(true);
    try {
     const res = await reparseVacancy(vacancy._id); // 👈 ФІКС: выкарыстоўваем vacancy._id напрамую
      // 💡 ЗМЕНЕНА: Выклікаем onUpdate замест onEdit, каб не адкрываць мадалку рэдагавання
      if (onUpdate) {
        onUpdate(res.data);
      } else if (onEdit) {
        onEdit(res.data); 
      }
      
      alert("✅ Дані вакансії оновлено праз AI!");
    } catch (err) {
      alert("Помилка AI-аналізу: " + (err.response?.data?.message || err.message));
    } finally {
      setIsReparsing(false);
    }
  
  };

  const handlePublish = async () => {
    const modeLabel = activeTab === 'full' ? 'ПОВНУ' : 'КОРОТКУ';
    if (!confirm(`Опублікувати ${modeLabel} версію в Telegram?`)) return;
    
    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append("fullText", editedFull);
      formData.append("shortText", editedShort);
      formData.append("mode", activeTab);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await publishVacancy(v._id, formData); // Перадаем formData замест JSON
      alert("✅ Опубліковано!");
    } catch (err) {
      alert("Помилка публікації: " + (err.response?.data?.message || err.message));
    } finally {
      setIsPublishing(true); // Пакідаем true, пакуль не закрыем (або ставім false)
      setIsPublishing(false);
    }
  };
  const handleShare = async () => {
    const text = activeTab === "full" ? editedFull : editedShort;
    if (navigator.share) {
      try {
        await navigator.share({ title: v.vacancydescription, text: text });
      } catch (err) { console.log("Share failed", err); }
    } else {
      handleCopyTelegram(); // Фолбэк на капіяванне
      alert("Спасылка скапіявана (ваш браўзер не падтрымлівае Share API)");
    }
  };
  // Разумная лакацыя: дадаем краіну толькі калі яе няма ў назве горада
  const locationDisplay =
    v.country && v.country !== "Polska" && !v.location?.includes(v.country)
      ? `${v.location} (${v.country})`
      : v.location;

  // Статусы на ўкраінскай
  const STATUS_LABELS = {
    active: "Активна",
    closed: "Закрита",
    archived: "Архів",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* КНОПКА НАЗАД (Desktop) */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="hidden lg:flex absolute left-8 z-50 w-14 h-14 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* КНОПКА НАПЕРАД (Desktop) */}
      {onNext && (
        <button
          onClick={onNext}
          className="hidden lg:flex absolute right-8 z-50 w-14 h-14 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
        >
          <ChevronRight size={32} />
        </button>
      )}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div id="vacancy-view-modal-content" className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        {/* ШАПКА */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex flex-wrap gap-2 items-center">
            {currentIndex && totalCount && (
  <span className="text-[10px] font-black bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-sm mr-2">
    {currentIndex} / {totalCount}
  </span>
)}
<span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-100">
  {v.vacancyCode}
</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                v.status === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : v.status === "closed"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-slate-300/10 text-slate-700 border-slate-500/20"
              }`}
            >
              {STATUS_LABELS[v.status] || v.status}
            </span>
            {v.agencyName && (
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-100 uppercase tracking-wider">
                <Building2 size={9} className="inline mr-1" /> {v.agencyName}
              </span>
            )}
            {v.category && (
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-100 uppercase tracking-wider">
                <Tag size={9} className="inline mr-1" /> {v.category}
              </span>
            )}
            {v.brand && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-100 uppercase tracking-wider">
                <Factory size={9} className="inline mr-1" /> {v.brand}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyTelegram}
              className="p-2 text-slate-700 hover:text-emerald-400 transition-all"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-700 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-7">
          {/* ГАЛОЎНЫ ЗАГАЛОВАК І ЛАКАЦЫЯ */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">
              {v.vacancydescription}
            </h2>
            <div className="space-y-1">
              <p className="text-base text-slate-700">
                📍 <span className="font-semibold">Місто:</span>{" "}
                <span className="text-slate-700 font-bold">
                  {locationDisplay}
                </span>
              </p>
              {v.checkInCity && (
                <p className="text-sm text-slate-700">
                  🏢 <span className="font-semibold">Оформлення:</span> м.{" "}
                  {v.checkInCity}
                </p>
              )}
              <p className="text-sm text-slate-700">
                👥 <span className="font-semibold">Набір:</span>{" "}
                <span className="text-slate-700 font-bold">
                  {v.gender ||
                    (Array.isArray(v.requirements?.gender)
                      ? v.requirements.gender.join(", ")
                      : "Будь-хто")}
                </span>
                {v.requirements?.genderDescription && (
                  <span className="text-slate-700 ml-1 italic">
                    ({v.requirements.genderDescription})
                  </span>
                )}
                {v.arrivalDate && (
                  <span className="text-emerald-500 font-bold">
                    , приїзд {v.arrivalDate}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* АРЫГІНАЛЬНЫ ТЭКСТ (Перанесены сюды і стылізаваны) */}
          <details className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <summary className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors list-none flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform inline-block text-xs">
                ▶
              </span>
              Оригінальний текст повідомлення
            </summary>
            <div className="px-5 pb-4 text-[11px] text-slate-600 font-mono leading-relaxed whitespace-pre-wrap border-t border-slate-100 pt-3">
              {v.rawText || "Текст повідомлення відсутній"}
            </div>
          </details>
{/* --- TELEGRAM РЭДАКТАР (ІДЭНТЫЧНЫ СТЫЛЬ) --- */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden" open={showEditor}>
        <summary className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors list-none flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform inline-block text-xs">▶</span>
            <Sparkles size={12} className="text-emerald-500" />
            <span>Telegram Редактор</span>
            {v.postOutdated && (
              <span className="ml-2 text-amber-600 animate-pulse">● Потребує оновлення</span>
            )}
          </div>
          {v.postGeneratedAt && (
            <span className="text-[9px] font-mono opacity-60 lowercase tracking-tighter">
              згенеровано: {new Date(v.postGeneratedAt).toLocaleString("uk-UA")}
            </span>
          )}
        </summary>
        
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
          {/* Падказка і кнопка генерацыі */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/50 p-3 rounded-xl border border-slate-100">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Якщо ви хочете згенерувати пост для Telegram або оновити вже існуючий пост на основі актуальних даних вакансії, натисніть кнопку:
            </p>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="shrink-0 flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-[10px] font-black rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw size={12} className={isGenerating ? "animate-spin" : ""} />
              {isGenerating ? "ОБРОБКА..." : "ЗГЕНЕРУВАТИ ПОСТ"}
            </button>
          </div>

          {/* Рэдактар */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-inner">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {["full", "short"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-emerald-600 border-b-2 border-emerald-500" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {tab === "full" ? "Повний пост" : "Короткий пост"}
                </button>
              ))}
            </div>
            
            <textarea
              value={activeTab === "full" ? editedFull : editedShort}
              onChange={(e) => activeTab === "full" ? setEditedFull(e.target.value) : setEditedShort(e.target.value)}
              className="w-full h-64 bg-transparent text-slate-700 p-4 text-xs font-mono leading-relaxed focus:outline-none resize-none custom-scrollbar"
              placeholder="Текст поста з'явиться тут..."
            />

            <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className={`text-[9px] font-bold ${(activeTab === "full" ? editedFull : editedShort).length > 4000 ? "text-red-500" : "text-slate-400"}`}>
                  Символів: {(activeTab === "full" ? editedFull : editedShort).length} / 4096
                </span>
                <button onClick={handleShare} className="text-slate-400 hover:text-emerald-500 transition-colors">
                  <Share2 size={14} />
                </button>
              </div>
              
              <button 
                onClick={handlePublish}
                disabled={isPublishing || !(activeTab === "full" ? editedFull : editedShort)}
                className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black rounded-lg transition-all disabled:opacity-50"
              >
                <Send size={12} /> {isPublishing ? "ВІДПРАВКА..." : "ОПУБЛІКУВАТИ В TG"}
              </button>
            </div>
          </div>

          {/* Загрузка файла */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Додати медіа (фото/відео)</label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-400 transition-all">
                <Image size={14} className="text-slate-400" />
                <span className="text-[11px] text-slate-500 truncate">
                  {selectedFile ? selectedFile.name : "Оберіть файл з комп'ютера..."}
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </label>
              
              {selectedFile && (
                <button onClick={() => setSelectedFile(null)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </details>
          {/* ОПЛАТА ПРАЦІ */}
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
                <div className="text-sm text-emerald-400 mt-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 flex items-start gap-2">
                  <span className="shrink-0">🎁</span>
                  <span>{formatText(v.salary.bonusDetails)}</span>
                </div>
              )}
              <Note>{v.salary?.salaryNotes}</Note>
            </div>
          </section>

          {/* ХАРАКТЕР РОБОТИ (АБАВЯЗКІ) */}
          <section>
            <SectionTitle
              icon="🛠"
              label="Характер роботи"
              color="text-blue-400"
              border="border-blue-500/20"
            />
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
              {v.description ? (
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {formatText(v.description)}
                </div>
              ) : (
                <p className="text-sm text-slate-700 italic">
                  Опис обов'язків відсутній
                </p>
              )}
            </div>
          </section>

          {/* ВИМОГИ */}
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

              {/* Бяспечны вывад нацыянальнасцяў */}
              {Array.isArray(v.requirements?.nationalities) &&
                v.requirements.nationalities.length > 0 && (
                  <Row
                    label="Національність"
                    value={v.requirements.nationalities.join(", ")}
                  />
                )}

              {/* Бяспечны вывад дакументаў */}
              {Array.isArray(v.requirements?.standardDocs) &&
                v.requirements.standardDocs.length > 0 && (
                  <Row
                    label="Документи"
                    value={v.requirements.standardDocs.join(", ")}
                  />
                )}

              {v.requirements?.additionalDocsDetails && (
                <Note>
                  Додатково:{" "}
                  {v.requirements.additionalDocsDetails.replace(/^з\s+/i, "")}
                </Note>
              )}

              <Row label="Мова" value={v.requirements?.polishLanguageLevel} />

              {v.requirements?.physicalLoad === true && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 font-bold text-sm">
                  <span>⚡</span>
                  <span>Фізично важка праця</span>
                </div>
              )}
            </div>
          </section>

          {/* ГРАФІК ТА ДОГОВІР */}
          <section>
            <SectionTitle
              icon="🕒"
              label="Графік та договір"
              color="text-purple-400"
              border="border-purple-500/20"
            />
            <div className="space-y-1.5">
              {v.schedule?.description && (
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2 whitespace-pre-wrap">
                  {formatText(v.schedule.description)}
                </p>
              )}
              <Row label="Робочі дні" value={v.schedule?.workDaysWeek} />
              <Row label="Перерва" value={v.schedule?.breakDuration} />

              {v.contractType && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Тип договору:
                  </span>
                  <span className="text-sm text-blue-400 font-black bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {v.contractType}
                  </span>
                </div>
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
                  <p className="text-sm text-slate-700 font-semibold">
                    {v.accommodation.type}
                    {v.accommodation?.forCouples && " (можливо для пар 👫)"}
                  </p>
                ) : (
                  <p className="text-sm text-slate-700 italic">
                    Інформація про житло відсутня
                  </p>
                )}
                {v.accommodation?.withChildren && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span>✓</span> Можна з дітьми
                  </p>
                )}
                {v.accommodation?.withPets && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span>✓</span> Можна з тваринами
                  </p>
                )}
                <div className="text-xs text-slate-700 whitespace-pre-wrap mt-2">
                  {v.accommodation?.details}
                </div>
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
                <p className="text-sm text-slate-700 font-semibold">
                  {v.transport?.provided
                    ? "Надається роботодавцем"
                    : "Власний / Не надається"}
                </p>
                {v.transport?.costRaw && (
                  <p className="text-sm text-cyan-300 font-medium">
                    {v.transport.costRaw}
                  </p>
                )}
                <Note>{v.transport?.details}</Note>
              </div>
            </div>
          </section>

          {/* УМОВИ ПРАЦІ ТА НЮАНСИ */}
          <section>
            <SectionTitle
              icon="🌡"
              label="Умови праці"
              color="text-rose-400"
              border="border-rose-500/20"
            />
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Row
                  label="Робочий одяг"
                  value={
                    v.conditions?.workwearFree
                      ? "Безкоштовно"
                      : "За рахунок працівника"
                  }
                />
                <Row label="Харчування" value={v.conditions?.foodType} />
              </div>
              <Note>{v.conditions?.foodDetails}</Note>

              {/* РАЗУМНАЯ ДЭДУПЛІКАЦЫЯ НЮАНСАЎ */}
              {Array.isArray(v.conditions?.specificNuances) &&
                v.conditions.specificNuances.length > 0 && (
                  <div className="flex flex-col gap-2 mt-4">
                    {v.conditions.specificNuances.map((n, idx) => {
                      const text = (typeof n === "object" ? n.text : n) || "";
                      const category =
                        (typeof n === "object" ? n.category : "other") ||
                        "other";

                      // Збіраем увесь тэкст для праверкі на дублікаты
                      const mainText =
                        `${v.vacancydescription || ""} ${v.description || ""} ${v.conditions?.characterOfWork || ""}`.toLowerCase();

                      // Калі тэкст нюансу ўжо ёсць у апісанні — не рэндэрым яго
                      if (text && mainText.includes(text.toLowerCase()))
                        return null;

                      const categoryLabels = {
                        "Температурний режим": "Температурний режим",
                        "Фізично-важка праця": "Фізично-важка праця",
                        "Санітарні обмеження": "Санітарні обмеження",
                        "Запахи та алергени": "Запахи та алергени",
                        Шум: "Шум",
                        "Характер праці": "Характер праці",
                        "Специфічні навички": "Специфічні навички",
                        Норми: "Норми",
                        "Тести при вступі": "Тести при вступі",
                        Інше: "Особливості",
                      };

                      const isUrgent =
                        category === "Температурний режим" ||
                        category === "Фізично-важка праця";

                      return (
                        <div
                          key={idx}
                          className={`px-4 py-3 rounded-xl border flex flex-col gap-1 transition-all hover:bg-slate-300/50 ${
                            isUrgent
                              ? "bg-red-500/5 text-red-400 border-red-500/10"
                              : "bg-slate-50 text-slate-700 border-slate-800"
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                            {categoryLabels[category] || categoryLabels.other}
                          </span>
                          <span className="text-sm leading-relaxed font-medium">
                            {text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              <Note>{v.conditions?.specificConditionsDetails}</Note>
            </div>
          </section>

          {/* ВИТРАТИ ТА КОМПЕНСАЦІЇ */}
          {(v.startExpenses?.hasStartExpenses ||
            v.earlyTerminationLiability?.hasLiability ||
            v.employerCompensations?.hasCompensations) && (
            <section className="bg-slate-50 p-5 rounded-2xl border border-slate-800 space-y-4">
              {v.startExpenses?.hasStartExpenses &&
                v.startExpenses?.details && (
                  <div>
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1.5">
                      💸 Витрати на старті
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {v.startExpenses.details}
                    </p>
                  </div>
                )}
              {v.earlyTerminationLiability?.hasLiability &&
                v.earlyTerminationLiability?.details && (
                  <div>
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1.5">
                      ⚠️ При достроковому звільненні
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {v.earlyTerminationLiability.details}
                    </p>
                  </div>
                )}
              {v.employerCompensations?.hasCompensations &&
                v.employerCompensations?.details && (
                  <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">
                      🎁 Компенсації та бонуси
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {v.employerCompensations.details}
                    </p>
                  </div>
                )}
            </section>
          )}

          {/* ДОДАТКОВА ІНФОРМАЦІЯ */}
          {v.additionalNotes && (
            <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-2">
                📝 Додаткова інформація
              </p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {formatText(v.additionalNotes)}
              </p>
            </div>
          )}

          {/* ДЖЕРЕЛО ТА СИСТЕМНА ІНФО */}
          <section className="mt-8 pt-6 border-t border-slate-800 space-y-4">
            {v.isTruncated && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span>
                  Увага: Ця вакансія створена з обрізаного повідомлення. Деякі
                  деталі можуть бути відсутні.
                </span>
              </div>
            )}

            
          </section>

          {/* МЕТА-ДАНІ */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[9px] font-mono text-slate-700 uppercase tracking-tighter">
            <span>ID: {v._id}</span>
            <span>
              СТВОРЕНО: {new Date(v.createdAt).toLocaleString("uk-UA")}
            </span>
          </div>
        </div>

        {/* КНОПКИ ДІЙ */}
        <div className="flex flex-wrap gap-2 px-4 md:px-8 py-4 md:py-6 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md z-10">
  <button
    onClick={() => onMatch(v)}
    className="flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-xs md:text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1"
  >
    <span>🎯</span>
    <span className="hidden md:inline">КАНДИДАТИ</span>
  </button>

  <button
    onClick={handleReparse}
    disabled={isReparsing}
    className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl border border-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
    title="Перезібрати дані з оригінального тексту праз AI"
  >
    <RefreshCw size={16} className={isReparsing ? "animate-spin" : ""} />
    <span className="hidden md:inline">{isReparsing ? "ОБРОБКА..." : "AI ОБНОВИТИ"}</span>
  </button>

  <button
    onClick={() => onEdit(v)}
    className="flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 bg-slate-100 hover:bg-slate-300 text-slate-700 text-xs md:text-sm font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1"
  >
    <span>✏️</span>
    <span className="hidden md:inline">РЕДАГУВАТИ</span>
  </button>
  <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete(v._id);
    }}
    className="flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs md:text-sm font-bold rounded-xl border border-red-500/20 md:ml-auto transition-all flex items-center justify-center gap-1"
  >
    <span>🗑️</span>
    <span className="hidden md:inline">ВИДАЛИТИ</span>
  </button>
</div>
      </div>
    </div>
  );
}
