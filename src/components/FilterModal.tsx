import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check, Building2, Trees, DollarSign, MapPin, Video, Sparkles } from 'lucide-react';
import { OperationType, PropertyType, SearchFilters } from '../types';
import { ZONES_LIST, AMENITIES_LIST } from '../data/properties';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onUpdateFilters: (updated: Partial<SearchFilters>) => void;
  onResetFilters: () => void;
  matchingCount: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  matchingCount,
}) => {
  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities;
    if (current.includes(amenity)) {
      onUpdateFilters({ amenities: current.filter((a) => a !== amenity) });
    } else {
      onUpdateFilters({ amenities: [...current, amenity] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white min-h-screen shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#071D3F] via-[#0B2F64] to-[#051329] text-white p-5 flex items-center justify-between border-b border-white/15 z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#D3122A]" />
            <h2 className="text-lg font-bold tracking-wide font-['Playfair_Display','Libre_Baskerville',Georgia,serif]">Filtros Avanzados</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Special Highlights Toggles */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <button
              onClick={() => onUpdateFilters({ onlyWithVideo: !filters.onlyWithVideo })}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                filters.onlyWithVideo
                  ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Video className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs">Solo con Video</span>
                <span className="text-[10px] text-slate-400 font-normal">Video Tour / IG Reel</span>
              </div>
            </button>

            <button
              onClick={() => onUpdateFilters({ onlyRecentlyUploaded: !filters.onlyRecentlyUploaded })}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                filters.onlyRecentlyUploaded
                  ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs">Recién Subidas</span>
                <span className="text-[10px] text-slate-400 font-normal">Publicaciones recientes</span>
              </div>
            </button>
          </div>

          {/* Operation Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Operación
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['TODAS', 'VENTA', 'ALQUILER', 'LOTES', 'ALQUILER TEMPORAL'] as const).map((op) => {
                let activeStyle = 'bg-[#051329] text-white border-[#051329]';
                if (op === 'VENTA') activeStyle = 'bg-[#02275c] text-white border-[#02275c]';
                if (op === 'ALQUILER' || op === 'ALQUILER TEMPORAL') activeStyle = 'bg-[#0284c7] text-white border-[#0284c7]';
                if (op === 'LOTES') activeStyle = 'bg-emerald-600 text-white border-emerald-600';

                return (
                  <button
                    key={op}
                    onClick={() => onUpdateFilters({ operation: op as any })}
                    className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border cursor-pointer truncate ${
                      filters.operation === op
                        ? activeStyle
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {op === 'TODAS' ? 'Todas' : op}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Tipo de Propiedad
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => onUpdateFilters({ propertyType: e.target.value as PropertyType | 'TODOS' })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#0B2F64]"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
              <option value="Duplex">Duplex</option>
              <option value="Local / Oficina">Local / Oficina</option>
              <option value="Galpón">Galpón</option>
              <option value="Lote / Terreno">Lote / Terreno</option>
            </select>
          </div>

          {/* Zone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Ubicación / Zona
            </label>
            <select
              value={filters.zone}
              onChange={(e) => onUpdateFilters({ zone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#0B2F64]"
            >
              {ZONES_LIST.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Rango de Precio ({filters.currency})
              </label>
              <span className="text-xs font-bold text-[#D3122A]">
                {filters.minPrice > 0 ? `$${filters.minPrice.toLocaleString()}` : 'Sin mín'} -{' '}
                {filters.maxPrice < 2000000 ? `$${filters.maxPrice.toLocaleString()}` : 'Sin máx'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Precio Mínimo"
                  value={filters.minPrice || ''}
                  onChange={(e) => onUpdateFilters({ minPrice: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2F64]"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Precio Máximo"
                  value={filters.maxPrice < 2000000 ? filters.maxPrice : ''}
                  onChange={(e) =>
                    onUpdateFilters({ maxPrice: Number(e.target.value) || 2000000 })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2F64]"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Dormitorios Mínimos
              </label>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => onUpdateFilters({ minBedrooms: num })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded border cursor-pointer ${
                      filters.minBedrooms === num
                        ? 'bg-[#0B2F64] text-white border-[#0B2F64]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {num === 0 ? 'Indist.' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Baños Mínimos
              </label>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => onUpdateFilters({ minBathrooms: num })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded border cursor-pointer ${
                      filters.minBathrooms === num
                        ? 'bg-[#0B2F64] text-white border-[#0B2F64]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {num === 0 ? 'Indist.' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Min Area (m2) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Superficie Cubierta Mínima (m²)
            </label>
            <input
              type="number"
              placeholder="Ej: 100 m²"
              value={filters.minCoveredArea || ''}
              onChange={(e) => onUpdateFilters({ minCoveredArea: Number(e.target.value) || 0 })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2F64]"
            />
          </div>

          {/* Keyword Search */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Búsqueda por Palabra Clave
            </label>
            <input
              type="text"
              placeholder="Ej: quincho, centro, pileta..."
              value={filters.refCodeSearch}
              onChange={(e) => onUpdateFilters({ refCodeSearch: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2F64]"
            />
          </div>

          {/* Amenities & Characteristics Checklist */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Características & Amenities
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-lg">
              {AMENITIES_LIST.map((amenity) => {
                const isSelected = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold transition-all border text-left cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B2F64]/10 border-[#0B2F64] text-[#0B2F64]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'bg-[#0B2F64] border-[#0B2F64] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-slate-200 flex items-center gap-3">
          <button
            onClick={onResetFilters}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpiar</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-[#D3122A] hover:bg-[#B30E22] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer text-center"
          >
            Ver {matchingCount} Propiedades
          </button>
        </div>
      </div>
    </div>
  );
};
