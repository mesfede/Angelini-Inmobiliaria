import React from 'react';
import { X, Trash2, Heart, ArrowUpRight, MapPin } from 'lucide-react';
import { Property } from '../types';
import { formatPropertyTitle } from '../lib/utils';
import { BRAND_PLACEHOLDER_IMAGE, sanitizeImageUrl } from '../lib/brandPlaceholder';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteProperties: Property[];
  currency: 'USD' | 'ARS';
  onRemoveFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoriteProperties,
  currency,
  onRemoveFavorite,
  onSelectProperty,
}) => {
  if (!isOpen) return null;

  const displayPrice = (property: Property) => {
    if ((!property.priceARS || property.priceARS <= 0) && (!property.priceUSD || property.priceUSD <= 0)) {
      return 'Consultar';
    }
    if (property.priceARS && property.priceARS > 0) {
      return `$ ${property.priceARS.toLocaleString('es-AR')} ARS`;
    }
    if (currency === 'USD' && property.priceUSD && property.priceUSD > 0) {
      return `USD $${property.priceUSD.toLocaleString('en-US')}`;
    }
    const ars = property.priceARS || (property.priceUSD ? property.priceUSD * 1350 : 0);
    if (ars > 0) {
      return `$ ${ars.toLocaleString('es-AR')} ARS`;
    }
    return 'Consultar';
  };

  const shareFavoritesWhatsApp = () => {
    const items = favoriteProperties.map((p) => `${p.title} (${p.location.zone})`).join('\n- ');
    const text = encodeURIComponent(
      `Hola Inmobiliaria Angelini, estuve guardando estas propiedades en la web y quisiera más información:\n- ${items}`
    );
    window.open(`https://wa.me/5492281301464?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="relative w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#041020] via-[#041020] to-[#020912] text-white p-5 flex items-center justify-between border-b border-white/15">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#B08237] text-[#B08237]" />
            <h2 className="text-lg font-bold font-['Playfair_Display','Libre_Baskerville',Georgia,serif]">
              Mis Favoritos ({favoriteProperties.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {favoriteProperties.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-slate-400">
              <Heart className="w-12 h-12 mx-auto stroke-1 text-[#dbdad8]" />
              <p className="text-sm font-medium text-slate-600">No tenés propiedades guardadas aún.</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Hacé clic en el ícono de corazón en cualquier propiedad para guardarla y compararla fácilmente aquí.
              </p>
            </div>
          ) : (
            favoriteProperties.map((p) => (
              <div
                key={p.id}
                className="bg-[#dbdad8]/15 border border-[#dbdad8] p-3 rounded-2xl flex gap-3 items-center hover:bg-[#dbdad8]/30 transition-all group"
              >
                <img
                  src={sanitizeImageUrl(p.images?.[0])}
                  alt={p.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                  onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = BRAND_PLACEHOLDER_IMAGE; }}
                  onClick={() => {
                    onSelectProperty(p);
                    onClose();
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#B08237] uppercase tracking-wider">
                      {p.operation} • {p.location.zone}
                    </span>
                    <button
                      onClick={() => onRemoveFavorite(p.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                      title="Quitar de favoritos"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectProperty(p);
                      onClose();
                    }}
                    className="text-xs font-bold text-[#041020] truncate cursor-pointer hover:text-[#B08237]"
                  >
                    {formatPropertyTitle(p.title)}
                  </h4>

                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#B08237]" />
                    <span>{p.location.zone}</span>
                  </p>

                  <p className="text-sm font-bold text-[#041020] mt-1">
                    {displayPrice(p)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favoriteProperties.length > 0 && (
          <div className="p-4 bg-white border-t border-[#dbdad8] space-y-2">
            <button
              onClick={shareFavoritesWhatsApp}
              className="w-full bg-[#B08237] hover:bg-[#9A702D] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-white/20"
            >
              <span>Consultar Selección por WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
