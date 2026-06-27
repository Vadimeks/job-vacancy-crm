import React, { useState, useEffect } from "react";
import { X, Send, Plus, Trash2, Image, AlertCircle, Sparkles, FileText } from "lucide-react";
import { generateBulkPreview, publishBulk } from "../../services/api";

export default function BulkPublishModal({ selectedIds, onClose }) {
  const [parts, setParts] = useState([""]); 
  const [caption, setCaption] = useState(""); // 👈 Подпіс да фота
  const [previewUrl, setPreviewUrl] = useState(null); // 👈 Для прэв'ю файла
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 1. Загрузка і разумнае разбіццё тэксту пры адкрыцці
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await generateBulkPreview(selectedIds);
        setParts([res.data.text]); // 👈 Увесь тэкст у адзін блок па змаўчанні
      } catch (err) {
        alert("Памылка загрузкі: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [selectedIds]);
useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);
  // 2. Кіраванне часткамі
  const updatePart = (index, value) => {
    const newParts = [...parts];
    newParts[index] = value;
    setParts(newParts);
  };

  const addPart = () => setParts([...parts, ""]);
  
  const removePart = (index) => {
    if (parts.length > 1) {
      setParts(parts.filter((_, i) => i !== index));
    }
  };

  // 3. Адпраўка
  const handlePublish = async () => {
    if (!confirm(`Апублікаваць дайджэст у Telegram?`)) return;

    setPublishing(true);
    try {
      const formData = new FormData();
      // Збіраем подпіс (калі ёсць) і ўсе часткі ў адзін масіў, потым склейваем
      const allContent = [];
      if (selectedFile && caption.trim()) allContent.push(caption);
      parts.forEach(p => { if(p.trim()) allContent.push(p); });

      formData.append("text", allContent.join("\n\n=== SPLIT ===\n\n"));
      if (selectedFile) formData.append("file", selectedFile);

      await publishBulk(formData);
      alert("✅ Апублікавана!");
      onClose();
    } catch (err) {
      alert("Памылка: " + (err.response?.data?.message || err.message));
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-3xl flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600">Рыхтую дайджэст...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative bg-slate-50 border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* ШАПКА */}
        <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-emerald-500" size={20} />
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Канструктар дайджэста</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Выбрана вакансій: {selectedIds.length}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* КАНТЭНТ (ЧАСТКІ) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* 1. ВЫБАР ФАЙЛА */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Медыя-файл (фота/відэа)</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 transition-all">
                <Image size={20} className="text-slate-400" />
                <span className="text-sm text-slate-500 truncate">{selectedFile ? selectedFile.name : "Дадаць медыя..."}</span>
                <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </label>
              {selectedFile && (
                <button onClick={() => setSelectedFile(null)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
              )}
            </div>
          </div>

          {/* 2. НУЛЯВЫ БЛОК (ПОДПІС ДА МЕДЫЯ) */}
          {selectedFile && (
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 animate-in zoom-in-95 duration-300">
              <div className="flex gap-4 mb-4">
                {previewUrl && (
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-emerald-200 shadow-sm bg-white">
                    {selectedFile.type.startsWith('video') 
                      ? <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-[10px]">VIDEO</div>
                      : <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                    }
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Блок 0: Подпіс да медыя</span>
                    <span className={`text-[10px] font-bold ${caption.length > 1024 ? "text-red-500" : "text-emerald-600/60"}`}>
                      {caption.length} / 1024 сімвалаў
                    </span>
                  </div>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full h-24 bg-white border border-emerald-200 rounded-xl p-3 text-sm text-slate-700 focus:border-emerald-500 outline-none resize-none"
                    placeholder="Устаўце тут апісанне для паста з фота (да 1000 сімв.)..."
                  />
                </div>
              </div>
              {caption.length > 1024 && (
                <p className="text-[10px] text-red-500 font-bold uppercase flex items-center gap-1">
                  <AlertCircle size={12} /> Зашмат тэксту для подпісу! Перанясіце частку ў Блок 1.
                </p>
              )}
            </div>
          )}

          {/* 3. АСНОЎНЫЯ БЛОКІ ТЭКСТУ */}
          {parts.map((text, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                  Блок {idx + 1}
                </span>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold ${text.length > 4000 ? "text-red-500" : "text-slate-400"}`}>
                    {text.length} / 4096 сімвалаў
                  </span>
                  {parts.length > 1 && (
                    <button onClick={() => removePart(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  )}
                </div>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => updatePart(idx, e.target.value)}
                className={`w-full h-64 bg-white border ${text.length > 4000 ? 'border-red-300 ring-4 ring-red-500/5' : 'border-slate-200'} rounded-2xl p-5 text-sm font-mono leading-relaxed text-slate-700 focus:border-emerald-500 outline-none transition-all shadow-sm resize-none`}
                placeholder="Тэкст паведамлення..."
              />
              
              {text.length > 4000 && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2 text-red-600">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-medium">
                    <strong>Зашмат сімвалаў!</strong> Telegram не прыме такі доўгі пост. 
                    Націсніце "Дадаць яшчэ адзін блок" ніжэй і перанясіце туды частку тэксту.
                  </p>
                </div>
              )}
            </div>
          ))}

          <button 
            onClick={addPart}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center gap-1"
          >
            <div className="flex items-center gap-2 font-bold text-sm"><Plus size={20} /> ДАДАЦЬ НОВЫ БЛОК</div>
            <span className="text-[10px] opacity-60">Каб разбіць дайджэст на некалькі паведамленняў</span>
          </button>
        </div>

        {/* ФУТЭР */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex items-center justify-between">
          <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors">
            Скасаваць
          </button>
          <button 
            onClick={handlePublish}
            disabled={publishing || parts.some(p => !p.trim())}
            className="flex items-center gap-3 px-10 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                АДПРАЎКА...
              </>
            ) : (
              <>
                <Send size={18} /> АПУБЛІКАВАЦЬ У ТЭЛЕГРАМ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}