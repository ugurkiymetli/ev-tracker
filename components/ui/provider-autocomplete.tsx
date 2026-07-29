"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Plus, ChevronDown, Check, Star, Flame, Globe } from "lucide-react";

export interface ProviderSimple {
  id: string;
  name: string;
  stationCount?: number;
}

interface ProviderAutocompleteProps {
  providers: ProviderSimple[];
  userTopProviderIds?: string[];
  initialValue?: string;
  onChange?: (val: string) => void;
  name?: string;
  placeholder?: string;
}

export function ProviderAutocomplete({
  providers = [],
  userTopProviderIds = [],
  initialValue = "",
  onChange,
  name = "providerName",
  placeholder = "Select or type provider name...",
}: ProviderAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanQuery = query.toLowerCase().trim();

  // 1. Separate user's top 3 providers
  const userTopProviders = providers.filter((p) => userTopProviderIds.includes(p.id));
  const userTopIdSet = new Set(userTopProviders.map((p) => p.id));

  // 2. Remaining providers explicitly sorted by station count desc
  const remainingProviders = providers
    .filter((p) => !userTopIdSet.has(p.id))
    .sort((a, b) => (b.stationCount || 0) - (a.stationCount || 0));

  // 3. Top 15 popular providers by station count among remaining
  const popularTop15 = remainingProviders.slice(0, 15);
  const popularIdSet = new Set(popularTop15.map((p) => p.id));

  // 4. All other providers sorted alphabetically
  const otherProviders = remainingProviders
    .filter((p) => !popularIdSet.has(p.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Search filtering
  const filterList = (list: ProviderSimple[]) =>
    cleanQuery ? list.filter((p) => p.name.toLowerCase().includes(cleanQuery)) : list;

  const filteredUserTop = filterList(userTopProviders);
  const filteredPopular = filterList(popularTop15);
  const filteredOthers = filterList(otherProviders);

  const exactMatch = providers.some((p) => p.name.toLowerCase() === cleanQuery);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (providerName: string) => {
    setQuery(providerName);
    setIsOpen(false);
    if (onChange) onChange(providerName);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          name={name}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (onChange) onChange(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="glass-input w-full px-3.5 py-2.5 pr-9 rounded-xl text-sm font-medium focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
        />
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute right-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Categorized Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-64 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl divide-y divide-neutral-100 dark:divide-neutral-800/80 font-sans text-xs">
          
          {/* SECTION 1: User's Top 3 Most Used */}
          {filteredUserTop.length > 0 && (
            <div className="p-1 space-y-0.5">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>En Çok Kullandıklarınız</span>
              </div>
              {filteredUserTop.map((prov) => {
                const isSelected = prov.name.toLowerCase() === cleanQuery;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => handleSelect(prov.name)}
                    className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {prov.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* SECTION 2: Top 15 Popular Providers by Station Count */}
          {filteredPopular.length > 0 && (
            <div className="p-1 space-y-0.5">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                <span>Popüler Şarj Ağları (Top 15)</span>
              </div>
              {filteredPopular.map((prov) => {
                const isSelected = prov.name.toLowerCase() === cleanQuery;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => handleSelect(prov.name)}
                    className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {prov.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {prov.stationCount ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                          {prov.stationCount.toLocaleString()} istasyon
                        </span>
                      ) : null}
                      {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* SECTION 3: All Other Providers */}
          {filteredOthers.length > 0 && (
            <div className="p-1 space-y-0.5">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-neutral-400" />
                <span>Tüm Şarj Ağları</span>
              </div>
              {filteredOthers.map((prov) => {
                const isSelected = prov.name.toLowerCase() === cleanQuery;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => handleSelect(prov.name)}
                    className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {prov.name}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty Search Fallback */}
          {filteredUserTop.length === 0 && filteredPopular.length === 0 && filteredOthers.length === 0 && (
            <div className="px-3.5 py-3 text-neutral-400 italic">No matching providers found</div>
          )}

          {/* SECTION 4: Custom User Provider Addition Option */}
          {cleanQuery.length > 0 && !exactMatch && (
            <button
              type="button"
              onClick={() => handleSelect(query.trim())}
              className="w-full px-3.5 py-2.5 flex items-center gap-2 text-left bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>
                Yeni İstasyon Ekle: <strong>&quot;{query.trim()}&quot;</strong>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
