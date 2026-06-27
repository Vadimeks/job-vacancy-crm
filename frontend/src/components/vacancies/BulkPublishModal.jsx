import React, { useState, useEffect } from "react";
import { X, Send, Plus, Trash2, Image, AlertCircle, Sparkles, FileText } from "lucide-react";
import { generateBulkPreview, publishBulk } from "../../services/api";

export default function BulkPublishModal({ selectedIds, onClose }) {
  const [parts, setParts] = useState([""]); // Масіў частак паведамлення
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 1. Загрузка і разумнае разбіццё тэксту пры адкрыцці
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await generateBulkPreview(selectedIds);
        const rawText = res.data.text;

        // Разумны спліт: разбіваем па 3800 сімвалаў, каб не разарваць вакансію
        const chunks = [];
        let currentText = rawText;
        const LIMIT = 3800;

        while (currentText.length > 0) {
          if (currentText.length <= LIMIT) {
            chunks.push(currentText);
            break;
          }

          // Шукаем бліжэйшы раздзяляльнік вакансій перад лімітам
          let splitIndex = currentText.lastIndexOf("-------------------", LIMIT);
          if (splitIndex === -1) splitIndex = LIMIT; // Калі няма раздзяляльніка — рэжам па ліміце

          chunks.push(currentText.substring(0, splitIndex).trim());
          currentText = currentText.substring(splitIndex).trim();
        }

        setParts(chunks.length > 0 ? chunks : [""]);
      } catch (err) {
        alert("Памылка загрузкі прэв'ю: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [selectedIds]);

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
    if (!confirm(`Апублікаваць дайджэст з ${parts.length} частак у Telegram?`)) return;

    setPublishing(true);
    try {
      const formData = new FormData();
      // Склеіваем часткі праз наш маркер для бэкенда
      formData.append("text", parts.join("\n\n=== SPLIT ===\n\n"));
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await publishBulk(formData);
      alert("✅ Дайджэст паспяхова адпраўлены!");
      onClose();
    } catch (err) {
      alert("Памылка публікацыі: " + (err.response?.data?.message || err.message));
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
          
          {/* Блок медыя (толькі для першай часткі) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Галоўнае фота/відэа (дадаецца да 1-й часткі)</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all">
                <Image size={20} className="text-slate-400" />
                <span className="text-sm text-slate-500 truncate">
                  {selectedFile ? selectedFile.name : "Выберыце файл для вокладкі..."}
                </span>
                <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </label>
              {selectedFile && (
                <button onClick={() => setSelectedFile(null)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Спіс частак */}
          {parts.map((text, idx) => (
            <div key={idx} className="relative group animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                  Частка {idx + 1}
                </span>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold ${text.length > 4000 ? "text-red-500" : "text-slate-400"}`}>
                    {text.length} / 4096 сімвалаў
                  </span>
                  {parts.length > 1 && (
                    <button onClick={() => removePart(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => updatePart(idx, e.target.value)}
                className="w-full h-64 bg-white border border-slate-200 rounded-2xl p-5 text-sm font-mono leading-relaxed text-slate-700 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm resize-none"
                placeholder="Увядзіце тэкст паведамлення..."
              />
              
              {text.length > 4000 && (
                <div className="mt-2 flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase">
                  <AlertCircle size={12} /> Перавышаны ліміт Telegram! Тэкст будзе абрэзаны.
                </div>
              )}
            </div>
          ))}

          {/* Кнопка дадання часткі */}
          <button 
            onClick={addPart}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2 font-bold text-sm"
          >
            <Plus size={20} /> ДАДАЦЬ ЯШЧЭ АДНУ ЧАСТКУ
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