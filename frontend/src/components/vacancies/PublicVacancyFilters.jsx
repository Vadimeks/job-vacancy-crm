import React, { useState } from "react";
import * as MD from "../../constants/masterData";
import MultiSelect from "../shared/MultiSelect";
import { Search } from "lucide-react";

export default function PublicVacancyFilters({ filters, setFilters, locations = [], voivodeships = [] }) {
  const updateField = (key, val) => setFilters({ ...filters, [key]: val });

  return (
    <div className="space-y-6 p-1">
      {/* Пошук */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Пошук</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => updateField("search", e.target.value)}
            placeholder="Назва вакансії або місто..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Катэгорыя */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Сфера діяльності</label>
        <MultiSelect
          options={MD.CATEGORIES}
          selected={filters.category}
          onChange={(v) => updateField("category", v)}
          placeholder="Усі категорії"
        />
      </div>

      {/* Рэгіён */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Регіон Польщі</label>
        <MultiSelect
          options={voivodeships}
          selected={filters.voivodeship}
          onChange={(v) => updateField("voivodeship", v)}
          placeholder="Усі регіони"
        />
      </div>

      {/* Зарплата */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Зарплата (PLN)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minSalary || ""}
            onChange={(e) => updateField("minSalary", e.target.value)}
            placeholder="Від"
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            type="number"
            value={filters.maxSalary || ""}
            onChange={(e) => updateField("maxSalary", e.target.value)}
            placeholder="До"
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Жытло */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Проживання</label>
        <MultiSelect
          options={MD.ACCOMMODATION_OPTIONS}
          selected={filters.accommodation}
          onChange={(v) => updateField("accommodation", v)}
          placeholder="Будь-які умови"
        />
      </div>

      {/* Хто едзе */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Для кого</label>
        <MultiSelect
          options={MD.GENDERS}
          selected={filters.gender}
          onChange={(v) => updateField("gender", v)}
          placeholder="Будь-хто"
        />
      </div>
    </div>
  );
}