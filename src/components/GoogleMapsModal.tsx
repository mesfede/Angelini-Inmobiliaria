import React, { useState } from 'react';
import { X, MapPin, ExternalLink, Building2, Search, Navigation, DollarSign, Trees, ArrowRight, Eye } from 'lucide-react';
import { Property, OperationType } from '../types';
import { getAssetUrl } from '../lib/utils';
import { Logo } from './Logo';


interface GoogleMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const GoogleMapsModal: React.FC<GoogleMapsModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
}) => {
  const [selectedOp, setSelectedOp] = useState<OperationType | 'TODAS'>('TODAS');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredProperties = properties.filter((p) => {
    const matchesOp = selectedOp === 'TODAS' || p.operation === selectedOp;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOp && matchesSearch;
  });

  const activeProp = selectedProperty || filteredProperties[0] || properties[0];

  // Map Embed Query: use exact address or latitude/longitude for maximum accuracy
  const mapQuery = activeProp
    ? `${activeProp.location.lat},${activeProp.location.lng}`
    : '-36.7769,-59.8585';

  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
  const externalGoogleMapsUrl = activeProp
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${activeProp.location.address}, ${activeProp.location.city}, Buenos Aires`
      )}`
    : 'https://www.google.com/maps';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#2C2518]/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-6xl h-[92vh] max-h-[850px] rounded-2xl shadow-2xl border border-[#c9b67e]/35 overflow-hidden flex flex-col">
        {/* MODAL HEADER */}
        <div className="bg-[#85681E] text-white p-4 sm:px-6 flex items-center justify-between shrink-0 border-b border-[#725816]">
          <div className="flex items-center gap-3">
            <Logo variant="light" size="sm" />
            <div className="hidden sm:block border-l border-white/20 pl-3 text-left">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Ubicación de Propiedades en Google Maps
              </h3>
              <p className="text-[11px] text-[#FBF9F4]/90">
                Visualización interactiva de casas, quintas, departamentos y lotes en Azul, Tandil, CABA y zona
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar mapa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL NAVBAR / OPERATION FILTERS */}
        <div className="bg-[#FBF9F4] border-b border-[#c9b67e]/30 px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-2 shrink-0">
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedOp('TODAS')}
              className={`hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedOp === 'TODAS'
                  ? 'bg-[#85681E] text-white shadow-xs'
                  : 'bg-white text-[#544212]/85 hover:bg-[#EFE6D5]/40 border border-[#c9b67e]/35'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedOp('VENTA')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedOp === 'VENTA'
                  ? 'bg-[#85681E] text-white shadow-xs'
                  : 'bg-white text-[#544212]/85 hover:bg-[#EFE6D5]/40 border border-[#c9b67e]/35'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 shrink-0 ${selectedOp === 'VENTA' ? 'text-white' : 'text-[#85681E]'}`} />
              <span>Ventas</span>
            </button>
            <button
              onClick={() => setSelectedOp('ALQUILER')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedOp === 'ALQUILER'
                  ? 'bg-[#85681E] text-white shadow-xs'
                  : 'bg-white text-[#544212]/85 hover:bg-[#EFE6D5]/40 border border-[#c9b67e]/35'
              }`}
            >
              <DollarSign className={`w-3.5 h-3.5 shrink-0 ${selectedOp === 'ALQUILER' ? 'text-white' : 'text-[#85681E]'}`} />
              <span>Alquileres</span>
            </button>
            <button
              onClick={() => setSelectedOp('LOTES')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedOp === 'LOTES'
                  ? 'bg-[#85681E] text-white shadow-xs'
                  : 'bg-white text-[#544212]/85 hover:bg-[#EFE6D5]/40 border border-[#c9b67e]/35'
              }`}
            >
              <Trees className={`w-3.5 h-3.5 shrink-0 ${selectedOp === 'LOTES' ? 'text-white' : 'text-[#85681E]'}`} />
              <span>Lotes</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-full sm:max-w-xs hidden sm:block">
            <Search className="w-3.5 h-3.5 text-[#544212]/60 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar ubicación o título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#c9b67e]/35 rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium text-[#2C2518] focus:outline-none focus:ring-2 focus:ring-[#85681E]"
            />
          </div>
        </div>

        {/* MODAL MAIN CONTENT: SIDEBAR + MAP IFRAME */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* PROPERTY SELECTOR SIDEBAR */}
          <div className="w-full md:w-80 lg:w-96 bg-[#FBF9F4] border-r border-[#c9b67e]/30 flex flex-col shrink-0 h-[160px] sm:h-[175px] md:h-full overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto p-2 gap-2 items-stretch">
              {filteredProperties.length === 0 ? (
                <div className="p-6 text-center text-[#544212]/70 text-xs font-medium w-full">
                  No se encontraron propiedades con ese criterio.
                </div>
              ) : (
                filteredProperties.map((p) => {
                  const isSelected = activeProp?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProperty(p)}
                      onDoubleClick={() => {
                        onClose();
                        onSelectProperty(p);
                      }}
                      title="Haz clic para ubicar en el mapa, o doble clic para ver la ficha completa"
                      className={`w-full shrink-0 p-2.5 rounded-xl border text-left cursor-pointer transition-all flex gap-3 items-center group relative ${
                        isSelected
                          ? 'bg-[#EFE6D5]/90 text-[#2C2518] border-2 border-[#85681E] shadow-md'
                          : 'bg-white text-[#2C2518] border-[#c9b67e]/30 hover:border-[#85681E] hover:shadow-xs'
                      }`}
                    >
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className={`w-16 h-16 rounded-lg object-cover shrink-0 border ${isSelected ? 'border-[#85681E]/40' : 'border-[#c9b67e]/30'}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className="text-[9px] font-black uppercase tracking-wider text-[#85681E]"
                          >
                            {p.location.zone}
                          </span>
                          <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-[#85681E]/80' : 'text-[#544212]/80'}`}>
                            {p.operation}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold truncate mt-0.5 text-[#2C2518]">{p.title}</h4>
                        <p className={`text-[11px] font-medium truncate flex items-center gap-1 ${isSelected ? 'text-[#544212]/90' : 'text-[#544212]/70'}`}>
                          <MapPin className="w-3 h-3 text-[#85681E] shrink-0" />
                          <span>{p.location.address}</span>
                        </p>
                        <div className={`flex items-center justify-between mt-1 pt-1 border-t ${isSelected ? 'border-[#85681E]/20' : 'border-[#c9b67e]/20'}`}>
                          <p className="text-xs font-extrabold text-[#85681E]">
                            {p.priceARS && p.priceARS > 0
                              ? `$ ${p.priceARS.toLocaleString('es-AR')} ARS`
                              : p.priceUSD && p.priceUSD > 0
                              ? `USD $${p.priceUSD.toLocaleString('en-US')}`
                              : 'Consultar'}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              onSelectProperty(p);
                            }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                              isSelected
                                ? 'bg-[#85681E] text-white hover:bg-[#725816]'
                                : 'bg-[#EFE6D5]/50 text-[#85681E] hover:bg-[#85681E] hover:text-white border border-[#c9b67e]/40'
                            }`}
                          >
                            Ver Ficha
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* GOOGLE MAPS IFRAME STAGE */}
          <div className="flex-1 bg-zinc-200 relative flex flex-col">
            {/* MAP IFRAME */}
            <div className="w-full h-full relative overflow-hidden bg-zinc-100">
              <iframe
                title="Google Maps Visualizer"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
