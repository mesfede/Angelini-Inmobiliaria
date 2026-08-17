import React, { useState } from 'react';
import { Heart, MapPin, Maximize, Bed, Bath, Car, Trees, ArrowUpRight, ChevronLeft, ChevronRight, Video, Play, Flame, Instagram, Edit3, Trash2, ArrowUp, ArrowDown, Home } from 'lucide-react';
import { Property } from '../types';
import { formatFullAddress, formatPropertyTitle } from '../lib/utils';
import { Logo } from './Logo';

interface PropertyCardProps {
  property: Property;
  currency: 'USD' | 'ARS';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  isAdmin?: boolean;
  onEditProperty?: (property: Property) => void;
  onDeleteProperty?: (id: string, refCode?: string) => void;
  onMoveUpProperty?: (id: string) => void;
  onMoveDownProperty?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currency,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  isAdmin,
  onEditProperty,
  onDeleteProperty,
  onMoveUpProperty,
  onMoveDownProperty,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
      } else {
        setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
      }
    }
    setTouchStartX(null);
  };

  const displayPrice = () => {
    if ((!property.priceARS || property.priceARS <= 0) && (!property.priceUSD || property.priceUSD <= 0)) {
      return 'Consultar';
    }
    if (property.priceARS && property.priceARS > 0) {
      return `$ ${property.priceARS.toLocaleString('es-AR')} ARS`;
    }
    if (currency === 'USD' && property.priceUSD > 0) {
      return `USD $${property.priceUSD.toLocaleString('en-US')}`;
    }
    const ars = property.priceARS || (property.priceUSD ? property.priceUSD * 1350 : 0);
    if (ars > 0) {
      return `$ ${ars.toLocaleString('es-AR')} ARS`;
    }
    return 'Consultar';
  };

  const getOperationBadgeColor = () => {
    switch (property.operation) {
      case 'VENTA':
        return 'bg-[#041020] text-white shadow-xs';
      case 'ALQUILER':
      case 'ALQUILER TEMPORAL':
        return 'bg-[#B08237] text-white shadow-xs';
      case 'LOTES':
        return 'bg-emerald-700 text-white shadow-xs';
      default:
        return 'bg-[#041020] text-white shadow-xs';
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#dbdad8] shadow-sm hover:shadow-xl hover:border-[#B08237]/50 transition-all duration-300 flex flex-col justify-between">
      {/* CARD TOP IMAGE CONTAINER */}
      <div 
        className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer select-none" 
        onClick={() => onSelectProperty(property)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={property.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
          alt={property.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover scale-[1.05] origin-center group-hover:scale-[1.09] transition-transform duration-500 pointer-events-none"
          onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
        />
        
        {/* Angelini Inmobiliaria Official Watermark Logo (All white with transparency) */}
        <div className="absolute bottom-2 right-2 pointer-events-none z-10 opacity-35 drop-shadow-sm">
          <Logo variant="light" size="sm" className="scale-75 origin-bottom-right" />
        </div>

        {/* Video IG Tag at bottom-left (opposite to watermark) */}
        {(property.videoUrl || property.instagramUrl) && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white uppercase tracking-wider flex items-center gap-1 shadow-md border border-white/20">
              <Instagram className="w-3 h-3 text-white shrink-0" />
              <span>Video IG</span>
            </span>
          </div>
        )}

        {/* Center Side-to-Side Status Banner */}
        {property.statusBanner && property.statusBanner !== 'NINGUNA' && (
          <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 py-3 sm:py-4 px-4 text-center font-black text-sm sm:text-base uppercase tracking-widest pointer-events-none transition-all shadow-2xl ${
            property.statusBanner.toLowerCase().includes('vendida')
              ? 'bg-[#B08237]/95 text-white border-y-2 border-white/40'
              : property.statusBanner.toLowerCase().includes('reservada')
              ? 'bg-[#041020]/95 text-white border-y-2 border-[#B08237]'
              : 'bg-[#041020]/95 text-white border-y-2 border-white/30'
          }`}>
            <span className="text-[#B08237] mr-2">●</span>
            {property.statusBanner}
            <span className="text-[#B08237] ml-2">●</span>
          </div>
        )}

        {/* Carousel arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Image dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {property.images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Operation & Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${getOperationBadgeColor()}`}>
            {property.operation}
          </span>
          {property.featured && (
            <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-[#B08237] text-white uppercase tracking-wider flex items-center gap-1 shadow-md border border-white/20">
              <Home className="w-3 h-3 text-white shrink-0" />
              <span>DESTACADA</span>
            </span>
          )}
          {property.isRecentlyUploaded && (
            <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-amber-600 text-white uppercase tracking-wider flex items-center gap-1 shadow-md border border-white/20">
              <Flame className="w-3 h-3 fill-white text-white shrink-0" />
              <span>RECIÉN SUBIDA</span>
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition-all cursor-pointer border border-[#dbdad8]"
          title="Guardar en favoritos"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#B08237] text-[#B08237]' : 'text-slate-400 hover:text-[#B08237]'
            }`}
          />
        </button>
      </div>

      {/* CARD BODY DETAILS */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xl font-black text-[#041020] tracking-tight">
              {displayPrice()}
            </span>
            {Boolean(property.expensesARS && property.expensesARS > 0) && (
              <span className="text-xs text-slate-500 font-medium">
                Expensas: ${property.expensesARS?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProperty(property)}
            className="text-base font-bold text-[#041020] group-hover:text-[#B08237] transition-colors line-clamp-1 cursor-pointer"
          >
            {formatPropertyTitle(property.title)}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#B08237] shrink-0" />
            <span className="truncate">{formatFullAddress(property.location.address, property.location.zone, property.location.city)}</span>
          </div>
        </div>

        {/* SPECS STRIP */}
        <div className="pt-3 border-t border-[#dbdad8]/50 grid grid-cols-4 gap-1.5 text-center bg-[#dbdad8]/20 border border-[#dbdad8] py-3 px-2 rounded-xl">
          {property.operation === 'LOTES' || property.type === 'Lote / Terreno' ? (
            <>
              <div className="col-span-2 flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#041020] text-sm leading-none">{property.totalArea} m²</span>
                <Maximize className="w-[22px] h-[22px] text-[#B08237] mt-2" />
              </div>
              <div className="col-span-2 flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#B08237] text-xs leading-none">
                  {property.lotFeatures?.waterAccess ? 'Agua' : 'Plano'}
                </span>
                <Trees className="w-[22px] h-[22px] text-[#B08237] mt-2" />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#041020] text-sm sm:text-base leading-none">
                  {property.coveredArea > 0 ? `${property.coveredArea} m²` : '—'}
                </span>
                <Maximize className="w-[22px] h-[22px] text-[#B08237] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#041020] text-sm sm:text-base leading-none">
                  {property.bedrooms > 0 ? property.bedrooms : '—'}
                </span>
                <Bed className="w-[22px] h-[22px] text-[#B08237] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#041020] text-sm sm:text-base leading-none">
                  {property.bathrooms > 0 ? property.bathrooms : '—'}
                </span>
                <Bath className="w-[22px] h-[22px] text-[#B08237] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#041020] text-sm sm:text-base leading-none">
                  {property.garages > 0 ? property.garages : '—'}
                </span>
                <Car className="w-[22px] h-[22px] text-[#B08237] mt-2" />
              </div>
            </>
          )}
        </div>

        {/* CARD FOOTER ACTIONS */}
        {showConfirmDelete ? (
          <div className="pt-2 flex items-center justify-between gap-2 bg-red-50 p-2.5 rounded-xl border border-red-300 animate-fadeIn">
            <span className="text-[11px] font-bold text-red-900">¿Eliminar esta propiedad?</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(false);
                  if (onDeleteProperty) {
                    onDeleteProperty(property.id, property.refCode);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer shadow-sm"
              >
                Sí, Eliminar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(false);
                }}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2 flex items-center gap-1.5">
            {isAdmin && (
              <>
                {onMoveUpProperty && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveUpProperty(property.id);
                    }}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-emerald-300"
                    title="Mover propiedad arriba en el catálogo"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                )}
                {onMoveDownProperty && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveDownProperty(property.id);
                    }}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-emerald-300"
                    title="Mover propiedad abajo en el catálogo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditProperty) onEditProperty(property);
                  }}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-amber-300"
                  title="Editar propiedad en Firebase"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmDelete(true);
                  }}
                  className="bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-red-300"
                  title="Eliminar propiedad"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              onClick={() => onSelectProperty(property)}
              className="flex-1 bg-white hover:bg-[#dbdad8]/30 text-[#041020] hover:text-[#041020] font-extrabold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer border border-[#dbdad8] shadow-xs"
            >
              <span>Ver Ficha</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B08237]" />
            </button>

            <a
              href={`https://wa.me/5492281301464?text=Hola%20Inmobiliaria%20Angelini,%20quiero%20consultar%20por%20la%20propiedad%20${encodeURIComponent(property.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#B08237] hover:bg-[#9A702D] text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1 cursor-pointer shadow-sm border border-white/20"
              title="Consultar por WhatsApp"
            >
              <span>Consultar</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
