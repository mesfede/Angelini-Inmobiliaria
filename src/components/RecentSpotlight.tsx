import React, { useMemo } from 'react';
import { Home, Play, ArrowUpRight, MapPin, Maximize, Bed, Bath, Car, Video, Instagram } from 'lucide-react';
import { Property } from '../types';
import { getAssetUrl, formatLocationName, formatFullAddress, formatPropertyTitle } from '../lib/utils';
import { Logo } from './Logo';


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
        return 'bg-[#02275c] text-white border border-white/30 shadow-xs';
      case 'ALQUILER':
      case 'ALQUILER TEMPORAL':
        return 'bg-[#0284c7] text-white shadow-xs';
      case 'LOTES':
      case 'LOTEO':
        return 'bg-emerald-600 text-white shadow-xs';
      default:
        return 'bg-[#02275c] text-white border border-white/30 shadow-xs';
    }
  };

  const hasVideoOrReel = Boolean(spotlightProperty.videoUrl || spotlightProperty.instagramUrl);

  return (
    <div className="bg-[#02275c] rounded-3xl p-6 sm:p-8 text-white border border-[#033b8a] shadow-2xl relative overflow-hidden group">
      {/* Background ambient accents in red and blue */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#e3171d]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-stretch">
        {/* MEDIA PREVIEW CONTAINER (Always Main Selected Image) */}
        <div
          className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-full rounded-2xl overflow-hidden bg-black/20 border border-white/15 shadow-xl cursor-pointer flex flex-col justify-between group/img"
          onClick={() => onSelectProperty(spotlightProperty)}
        >
          {/* Main property image */}
          <img
            src={spotlightProperty.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
            alt={spotlightProperty.title}
            className="absolute inset-0 w-full h-full object-cover scale-[1.05] origin-center group-hover/img:scale-[1.09] transition-transform duration-700 brightness-[1.03] contrast-[1.02] saturate-[1.06]"
            onError={(e) => {
              if (e.currentTarget.dataset.hasError) return;
              e.currentTarget.dataset.hasError = 'true';
              e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Angelini Inmobiliaria Official Watermark Logo (All white with transparency) */}
          <div className="absolute bottom-3.5 right-3.5 pointer-events-none z-10 opacity-35 drop-shadow-sm">
            <Logo variant="light" size="sm" className="scale-85 origin-bottom-right" />
          </div>

          {/* Video IG Tag at bottom-left (opposite to watermark) */}
          {hasVideoOrReel && (
            <div className="absolute bottom-3.5 left-3.5 z-10">
              <span className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-white/25">
                <Instagram className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Video IG</span>
              </span>
            </div>
          )}

          {hasVideoOrReel && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover/img:bg-transparent transition-colors pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-2xl group-hover/img:scale-110 transition-transform border-2 border-white/90">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Clear, luminous vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {/* 1. Propiedad destacada tag with color #A8772C and beating / pulsating animation */}
            <span className="bg-[#A8772C] text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wider flex items-center gap-1.5 shadow-lg border border-white/25 animate-pulse">
              <Home className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Propiedad destacada</span>
            </span>

            {/* 2. Operation Tag (Venta, Alquiler, Loteo) */}
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${getOperationBadgeColor(spotlightProperty.operation)}`}>
              {spotlightProperty.operation}
            </span>
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              {/* Header Label */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e3171d] animate-ping shrink-0" />
                <span className="text-xs font-semibold text-blue-200">
                  Oportunidad exclusiva Angelini
                </span>
              </div>

              {/* 1. Title (first uppercase, rest lowercase) */}
              <h3
                onClick={() => onSelectProperty(spotlightProperty)}
                className="text-xl sm:text-2xl font-bold text-white leading-snug hover:text-blue-200 transition-colors cursor-pointer drop-shadow-sm font-['Playfair_Display','Libre_Baskerville',Georgia,serif]"
              >
                {formatPropertyTitle(spotlightProperty.title)}
              </h3>

              {/* 2. Price / Consultar */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight inline-block">
                  {displayPrice()}
                </span>
              </div>

              {/* 3. Address & location */}
              <div className="flex items-center justify-between gap-2 mt-2.5 flex-wrap">
                <p className="text-xs text-blue-100/90 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#e3171d] shrink-0" />
                  <span>{formatFullAddress(spotlightProperty.location.address, spotlightProperty.location.zone, spotlightProperty.location.city)}</span>
                </p>
              </div>
            </div>

            {/* Description (White / light text) */}
            <p className="hidden sm:block text-xs text-blue-100/85 line-clamp-3 leading-relaxed">
              {spotlightProperty.description}
            </p>

            {/* Quick Specs with red icon accents and white text */}
            <div className="grid grid-cols-4 gap-2 text-center bg-white/10 backdrop-blur-xs border border-white/15 text-white py-3 px-2 rounded-2xl shadow-inner">
              <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-white text-sm sm:text-base leading-none">
                  {spotlightProperty.coveredArea || spotlightProperty.totalArea ? `${spotlightProperty.coveredArea || spotlightProperty.totalArea} m²` : '—'}
                </span>
                <Maximize className="w-[22px] h-[22px] text-[#e3171d] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-white text-sm sm:text-base leading-none">
                  {spotlightProperty.bedrooms || '—'}
                </span>
                <Bed className="w-[22px] h-[22px] text-[#e3171d] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-white text-sm sm:text-base leading-none">
                  {spotlightProperty.bathrooms || '—'}
                </span>
                <Bath className="w-[22px] h-[22px] text-[#e3171d] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-white text-sm sm:text-base leading-none">
                  {spotlightProperty.garages || '—'}
                </span>
                <Car className="w-[22px] h-[22px] text-[#e3171d] mt-2" />
              </div>
            </div>
          </div>

          {/* Actions - White button for ficha, Red button for WhatsApp consultation */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onSelectProperty(spotlightProperty)}
              className="flex-1 bg-white hover:bg-slate-100 text-[#02275c] font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02]"
            >
              <span>Ver Ficha</span>
              <ArrowUpRight className="w-4 h-4 text-[#02275c]" />
            </button>
            <a
              href={`https://wa.me/5492281301464?text=Hola%20Inmobiliaria%20Angelini,%20quiero%20consultar%20por%20la%20propiedad%20${encodeURIComponent(spotlightProperty.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-[#e3171d] hover:bg-[#c01016] text-white rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center cursor-pointer shadow-lg hover:scale-[1.02] border border-white/20"
            >
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

