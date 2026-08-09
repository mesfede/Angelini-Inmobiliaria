import React, { useMemo } from 'react';
import { Home, Play, ArrowUpRight, MapPin, Maximize, Bed, Bath, Car, Video, Instagram } from 'lucide-react';
import { Property } from '../types';
import { getAssetUrl, formatLocationName, formatFullAddress } from '../lib/utils';


interface RecentSpotlightProps {
  properties: Property[];
  currency: 'USD' | 'ARS';
  onSelectProperty: (property: Property) => void;
}

export const RecentSpotlight: React.FC<RecentSpotlightProps> = ({
  properties,
  currency,
  onSelectProperty,
}) => {
  // Find the spotlight property: the one marked as featured, or fallback to the first property
  const spotlightProperty = useMemo(() => {
    if (!properties || properties.length === 0) return null;
    return properties.find((p) => p.featured) || properties[0];
  }, [properties]);

  if (!spotlightProperty) return null;

  const displayPrice = () => {
    if ((!spotlightProperty.priceARS || spotlightProperty.priceARS <= 0) && (!spotlightProperty.priceUSD || spotlightProperty.priceUSD <= 0)) {
      return 'Consultar';
    }
    if (spotlightProperty.priceARS && spotlightProperty.priceARS > 0) {
      return `$ ${spotlightProperty.priceARS.toLocaleString('es-AR')} ARS`;
    }
    if (currency === 'USD' && spotlightProperty.priceUSD > 0) {
      return `USD $${spotlightProperty.priceUSD.toLocaleString('en-US')}`;
    }
    const ars = spotlightProperty.priceARS || (spotlightProperty.priceUSD ? spotlightProperty.priceUSD * 1350 : 0);
    if (ars > 0) {
      return `$ ${ars.toLocaleString('es-AR')} ARS`;
    }
    return 'Consultar';
  };

  const getOperationBadgeColor = (op?: string) => {
    switch (op) {
      case 'VENTA':
        return 'bg-[#85681E] text-white shadow-xs';
      case 'ALQUILER':
      case 'ALQUILER TEMPORAL':
        return 'bg-[#c9b67e] text-[#2C2518] shadow-xs';
      case 'LOTES':
        return 'bg-[#EFE6D5] text-[#85681E] border border-[#c9b67e]/30 shadow-xs';
      default:
        return 'bg-[#85681E] text-white shadow-xs';
    }
  };

  const hasVideoOrReel = Boolean(spotlightProperty.videoUrl || spotlightProperty.instagramUrl);

  return (
    <div className="bg-[#FBF9F4] rounded-3xl p-6 sm:p-8 text-[#2C2518] border-2 border-[#c9b67e]/30 shadow-xl relative overflow-hidden group">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9b67e]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-stretch">
        {/* MEDIA PREVIEW CONTAINER (Always Main Selected Image) */}
        <div
          className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-full rounded-2xl overflow-hidden bg-black/5 border border-[#c9b67e]/30 shadow-xl cursor-pointer flex flex-col justify-between group/img"
          onClick={() => onSelectProperty(spotlightProperty)}
        >
          {/* Main property image */}
          <img
            src={spotlightProperty.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
            alt={spotlightProperty.title}
            className="absolute inset-0 w-full h-full object-cover scale-[1.05] origin-center group-hover/img:scale-[1.09] transition-transform duration-700 brightness-[1.04] contrast-[1.02] saturate-[1.06]"
            onError={(e) => {
              if (e.currentTarget.dataset.hasError) return;
              e.currentTarget.dataset.hasError = 'true';
              e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Silvio Ciuffardi Watermark Logo in pure white with transparency, no background box */}
          <div className="absolute bottom-4 right-4 pointer-events-none z-10 flex items-center gap-2 opacity-75">
            <svg viewBox="0 3 100 29" className="w-3.5 h-2.5 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="21" y1="27" x2="50" y2="4" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <rect x="29" y="8" width="4.5" height="11" fill="#FFFFFF" />
              <polygon points="50,4 78,25 74,29 50,11" fill="#FFFFFF" />
              <rect x="42.5" y="16" width="6" height="6" fill="#FFFFFF" />
              <rect x="51.5" y="16" width="6" height="6" fill="#FFFFFF" />
              <rect x="42.5" y="25" width="6" height="6" fill="#FFFFFF" />
              <rect x="51.5" y="25" width="6" height="6" fill="#FFFFFF" />
            </svg>
            <div className="text-left leading-none text-white">
              <span className="block font-['Quicksand',sans-serif] tracking-tight font-bold text-[10px] sm:text-[11px] whitespace-nowrap">
                Silvio Ciuffardi
              </span>
              <span className="block font-['Quicksand',sans-serif] text-[6px] sm:text-[7px] tracking-[0.25em] font-medium text-center uppercase mt-0">
                Inmobiliaria
              </span>
            </div>
          </div>

          {hasVideoOrReel && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/img:bg-transparent transition-colors pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/90 text-white flex items-center justify-center shadow-xl group-hover/img:scale-110 transition-transform border-2 border-white/80">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Clear, luminous vignette keeping top skies bright */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55 pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {/* 1. Propiedad destacada tag with house icon and pulsing animation */}
            <span className="bg-[#226619] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-[#226619]/30 animate-pulse">
              <Home className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Propiedad destacada</span>
            </span>

            {/* 2. Operation Tag (Venta, Alquiler, Lotes) */}
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${getOperationBadgeColor(spotlightProperty.operation)}`}>
              {spotlightProperty.operation}
            </span>

            {/* 3. Video tag conditionally rendered */}
            {hasVideoOrReel && (
              <span className="bg-[#c9b67e] text-[#2C2518] border border-[#c9b67e]/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Instagram className="w-3.5 h-3.5 text-[#2C2518] shrink-0" />
                <span>Video IG</span>
              </span>
            )}
          </div>

          <div className="relative z-10 p-3 mt-auto flex items-center justify-between text-xs font-semibold text-white">
            <span className="bg-white/95 backdrop-blur-md text-[#2C2518] px-3 py-1.5 rounded-lg border border-[#c9b67e]/30 flex items-center gap-1.5 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#85681E] shrink-0" />
              <span>{formatLocationName(spotlightProperty.location.zone, spotlightProperty.location.city)}</span>
            </span>
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              {/* 1. Title first */}
              <h3
                onClick={() => onSelectProperty(spotlightProperty)}
                className="text-xl sm:text-2xl font-black text-[#2C2518] leading-snug hover:text-[#85681E] transition-colors cursor-pointer drop-shadow-sm"
              >
                {spotlightProperty.title}
              </h3>

              {/* 2. Price / Consultar second */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-[#85681E] tracking-tight inline-block">
                  {displayPrice()}
                </span>
              </div>

              {/* 3. Address & location */}
              <p className="text-xs text-[#544212] font-semibold flex items-center gap-1 mt-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#85681E] shrink-0" />
                <span>{formatFullAddress(spotlightProperty.location.address, spotlightProperty.location.zone, spotlightProperty.location.city)}</span>
              </p>
            </div>

            {/* Description (Hidden on mobile) */}
            <p className="hidden sm:block text-xs text-[#544212]/80 line-clamp-3 leading-relaxed">
              {spotlightProperty.description}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-4 gap-2 text-center bg-white border border-[#c9b67e]/30 text-[#2C2518] py-3 px-2 rounded-xl shadow-sm">
              <div className="flex flex-col items-center justify-center">
                <span className="font-black text-[#2C2518] text-sm sm:text-base leading-none">
                  {spotlightProperty.coveredArea || spotlightProperty.totalArea ? `${spotlightProperty.coveredArea || spotlightProperty.totalArea} m²` : '—'}
                </span>
                <Maximize className="w-[22px] h-[22px] text-[#85681E] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-black text-[#2C2518] text-sm sm:text-base leading-none">
                  {spotlightProperty.bedrooms || '—'}
                </span>
                <Bed className="w-[22px] h-[22px] text-[#85681E] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-black text-[#2C2518] text-sm sm:text-base leading-none">
                  {spotlightProperty.bathrooms || '—'}
                </span>
                <Bath className="w-[22px] h-[22px] text-[#85681E] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-black text-[#2C2518] text-sm sm:text-base leading-none">
                  {spotlightProperty.garages || '—'}
                </span>
                <Car className="w-[22px] h-[22px] text-[#85681E] mt-2" />
              </div>
            </div>
          </div>

          {/* Actions - Aligned with the bottom of the image */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onSelectProperty(spotlightProperty)}
              className="flex-1 bg-[#85681E] hover:bg-[#725816] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md border border-[#85681E]/20"
            >
              <span>Ver Ficha</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>
            <a
              href={`https://wa.me/5492281591989?text=Hola%20Inmobiliaria%20Silvio%20Ciuffardi,%20quiero%20consultar%20por%20la%20propiedad%20${encodeURIComponent(spotlightProperty.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-white hover:bg-[#F4EFE6] text-[#85681E] border border-[#c9b67e]/50 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center cursor-pointer shadow-sm"
            >
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

