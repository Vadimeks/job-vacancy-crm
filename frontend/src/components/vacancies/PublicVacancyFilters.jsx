import React from "react";
import * as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";
import { Search, Sun, Home } from "lucide-react";

export default function PublicVacancyFilters({ filters, setFilters, locations = [], voivodeships = [] }) {
  const updateField = (key, val) => setFilters({ ...filters, [key]: val });

  return (
    <div className="space-y-5 p-1">
      {/* Хуткія кнопкі */}
      <div className="grid grid-cols-1 gap-2 mb-4">
        <button
          onClick={() => updateField("onlyDayShifts", !filters.onlyDayShifts)}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            filters.onlyDayShifts ? "bg-blue-500 border-blue-600 text-white shadow-md" : "bg-slate-50 border-slate-100 text-slate-400"
          }`}
        >
          <Sun size={14} /> Тільки денні зміни
        </button>
        <button
          onClick={() => updateField("freeHousing", !filters.freeHousing)}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            filters.freeHousing ? "bg-indigo-500 border-indigo-600 text-white shadow-md" : "bg-slate-50 border-slate-100 text-slate-400"
          }`}
        >
          <Home size={14} /> Безкоштовне житло
        </button>
      </div>

      {/* Катэгорыя */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Сфера діяльності</label>
        <MultiSelect options={MD.CATEGORIES} selected={filters.category} onChange={(v) => updateField("category", v)} placeholder="Усі сфери" />
      </div>

      {/* Рэгіён */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Регіон (Воєводство)</label>
        <MultiSelect options={voivodeships} selected={filters.voivodeship} onChange={(v) => updateField("voivodeship", v)} placeholder="Усі регіони" />
      </div>

      {/* Горад */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Місто</label>
        <MultiSelect options={locations.map(l => ({ value: l, label: l }))} selected={filters.location} onChange={(v) => updateField("location", v)} placeholder="Усі міста" />
      </div>

      {/* Зарплата */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Зарплата (PLN)</label>
        <div className="flex gap-2">
          <input type="number" value={filters.minSalary || ""} onChange={(e) => updateField("minSalary", e.target.value)} placeholder="Від" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          <input type="number" value={filters.maxSalary || ""} onChange={(e) => updateField("maxSalary", e.target.value)} placeholder="До" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" />
        </div>
      </div>

      {/* Дагавор */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Тип договору</label>
        <MultiSelect options={MD.CONTRACT_TYPES} selected={filters.contractType} onChange={(v) => updateField("contractType", v)} placeholder="Будь-який" />
      </div>

      {/* Гадзіны */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Години на місяць</label>
        <MultiSelect options={MD.HOURS_RANGE_OPTIONS} selected={filters.hoursRange} onChange={(v) => updateField("hoursRange", v)} placeholder="Будь-яка кількість" />
      </div>

      {/* Жытло (дэталёва) */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Умови проживання</label>
        <MultiSelect options={MD.ACCOMMODATION_OPTIONS} selected={filters.accommodation} onChange={(v) => updateField("accommodation", v)} placeholder="Усі варіанти" />
      </div>

      {/* Давоз */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Довіз до роботи</label>
        <MultiSelect options={MD.TRANSPORT_OPTIONS} selected={filters.transport} onChange={(v) => updateField("transport", v)} placeholder="Не важливо" />
      </div>

      {/* Хто едзе */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Для кого (набір)</label>
        <MultiSelect options={MD.GENDERS} selected={filters.gender} onChange={(v) => updateField("gender", v)} placeholder="Будь-хто" />
      </div>

      {/* Узровень польскай */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Знання польської</label>
        <MultiSelect options={MD.LANGUAGES} selected={filters.language} onChange={(v) => updateField("language", v)} placeholder="Будь-який рівень" />
      </div>

      {/* Нацыянальнасць */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Національність</label>
        <MultiSelect options={MD.NATIONALITIES} selected={filters.nationality} onChange={(v) => updateField("nationality", v)} placeholder="Усі" />
      </div>

      {/* Дакументы */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Документи</label>
        <MultiSelect options={MD.DOCS} selected={filters.docs} onChange={(v) => updateField("docs", v)} placeholder="Будь-які" />
      </div>

      {/* Нюансы */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Особливості роботи</label>
        <MultiSelect options={MD.CHECKLIST_ITEMS} selected={filters.nuances} onChange={(v) => updateField("nuances", v)} placeholder="Вибрати..." />
      </div>
    </div>
  );
}