
const getInstagramEmbedUrl = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return `https://www.instagram.com/p/${match[1]}/embed/`;
  }
  return null;
};

const getYouTubeEmbedUrl = (url?: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1`;
  }
  return null;
};
import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, Maximize, Bed, Bath, Car, Phone, Mail, CheckCircle2, ChevronLeft, ChevronRight, Share2, Heart, Trees, Video, ExternalLink, Star, FileText, Plus, Minus, Home } from 'lucide-react';
import { Property } from '../types';
import { getAssetUrl, formatLocationName, formatFullAddress } from '../lib/utils';
import { Logo } from './Logo';


interface PropertyDetailModalProps {
  property: Property | null;
  currency: 'USD' | 'ARS';
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isAdmin?: boolean;
  onEditProperty?: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  currency,
  onClose,
  isFavorite,
  onToggleFavorite,
  isAdmin,
  onEditProperty,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'video' | 'amenities' | 'location'>(
    property?.videoUrl || property?.instagramUrl ? 'video' : 'info'
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(15);

  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRef.current) {
      const activeEl = thumbnailRef.current.children[activeImageIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeImageIndex]);

  if (!property) return null;

  const currentPhotoUrl = property.images[activeImageIndex] || property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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
    const calculatedARS = property.priceUSD ? property.priceUSD * 1350 : 0;
    if (calculatedARS > 0) {
      return `$ ${calculatedARS.toLocaleString('es-AR')} ARS`;
    }
    return 'Consultar';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Google Maps location query
  const mapQuery = property.location.lat && property.location.lng
    ? `${property.location.lat},${property.location.lng}`
    : encodeURIComponent(`${property.location.address}, ${property.location.zone}, ${property.location.city}, Argentina`);

  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=${mapZoom}&output=embed`;
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-5 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-zinc-200">
        {/* TOP MODAL HEADER */}
        <div className="bg-[#85681E] text-white px-4 py-2.5 sm:px-5 flex items-center justify-between border-b border-[#725816] shrink-0">
          <div className="flex items-center gap-3">
            <Logo variant="light" size="md" />
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onEditProperty && (
              <button
                onClick={() => {
                  onEditProperty(property);
                  onClose();
                }}
                className="bg-black/20 hover:bg-black/35 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-white/20 transition-colors cursor-pointer"
                title="Editar propiedad en Firebase"
              >
                <span>Editar Propiedad</span>
              </button>
            )}

            <button
              onClick={() => onToggleFavorite(property.id)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Guardar en favoritos"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white text-white' : 'text-white'}`} />
            </button>

            <div className="relative">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                title="Compartir enlace"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {copiedLink && (
                <div className="absolute top-full right-0 mt-1 bg-[#2C2518] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap z-50 animate-fadeIn">
                  ¡Enlace copiado!
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* MODAL MAIN CONTENT */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-5 space-y-4">
          {/* HERO SPLIT SECTION: PHOTOS (LEFT) + KEY DETAILS (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* LEFT COLUMN: IMAGE GALLERY */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              <div
                onDoubleClick={() => setZoomImage(currentPhotoUrl)}
                className="relative aspect-4/3 sm:aspect-4/3 lg:aspect-4/3 min-h-[280px] sm:min-h-[340px] lg:min-h-[380px] w-full rounded-2xl overflow-hidden bg-zinc-900 group shadow-md border border-zinc-200 cursor-zoom-in"
                title="Haga doble clic para ampliar a pantalla completa"
              >
                <img
                  src={currentPhotoUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
                  alt={property.title}
                  className="w-full h-full object-cover scale-[1.05] origin-center transition-all duration-300 group-hover:scale-[1.07]"
                  onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
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

                {/* Center Side-to-Side Status Banner */}
                {property.statusBanner && property.statusBanner !== 'NINGUNA' && (
                  <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 z-25 py-4 sm:py-5 px-6 text-center font-black text-lg sm:text-2xl uppercase tracking-widest pointer-events-none transition-all shadow-2xl ${
                    property.statusBanner.toLowerCase().includes('vendida')
                      ? 'bg-[#85681E]/92 text-white border-y-2 border-[#2C2518]'
                      : property.statusBanner.toLowerCase().includes('reservada')
                      ? 'bg-[#c9b67e]/90 text-[#2C2518] border-y-2 border-[#544212]'
                      : 'bg-[#2C2518]/90 text-white border-y-2 border-[#85681E]'
                  }`}>
                    <span className={property.statusBanner.toLowerCase().includes('vendida') ? 'text-white mr-3' : 'text-[#85681E] mr-3'}>●</span>
                    {property.statusBanner}
                    <span className={property.statusBanner.toLowerCase().includes('vendida') ? 'text-white ml-3' : 'text-[#85681E] ml-3'}>●</span>
                  </div>
                )}

                {/* Double click instruction overlay badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize className="w-3 h-3 text-[#85681E]" />
                  <span>Doble clic para ampliar</span>
                </div>

                {/* Operation & Featured Overlay Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-md ${getOperationBadgeColor(property.operation)}`}>
                    {property.operation}
                  </span>
                  {property.featured && (
                    <span className="bg-[#226619] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-[#226619]/30 animate-pulse">
                      <Home className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>Propiedad destacada</span>
                    </span>
                  )}
                </div>

                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(
                          (prev) => (prev - 1 + property.images.length) % property.images.length
                        );
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer shadow-md"
                      title="Foto anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev + 1) % property.images.length);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer shadow-md"
                      title="Siguiente foto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {activeImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail selector strip with navigation arrows */}
              {property.images.length > 1 && (
                <div className="relative flex items-center gap-1.5 mt-2">
                  {property.images.length > 4 && (
                    <button
                      type="button"
                      onClick={() => scrollThumbnails('left')}
                      className="p-1 rounded-lg bg-zinc-800 text-white hover:bg-black transition-colors shrink-0 cursor-pointer shadow-xs"
                      title="Fotos anteriores"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div
                    ref={thumbnailRef}
                    className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth flex-1 items-center"
                  >
                    {property.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        onDoubleClick={() => setZoomImage(img)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          idx === activeImageIndex
                            ? 'border-[#85681E] scale-102 shadow-md ring-2 ring-[#85681E]/20'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={`Foto ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>

                  {property.images.length > 4 && (
                    <button
                      type="button"
                      onClick={() => scrollThumbnails('right')}
                      className="p-1 rounded-lg bg-zinc-800 text-white hover:bg-black transition-colors shrink-0 cursor-pointer shadow-xs"
                      title="Siguientes fotos"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: ESSENTIAL INFO (TITLE, PRICE, SPECS & ACTIONS) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#FBF9F4] p-4 rounded-2xl border border-[#c9b67e]/25 gap-3">
              <div className="space-y-2.5">
                {/* Category & Zone */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#85681E] uppercase tracking-wider">
                    <span>{property.type}</span>
                    <span className="text-zinc-400 font-normal">/</span>
                    <span>{formatLocationName(property.location.zone, property.location.city)}</span>
                  </div>
                </div>

                {/* Main Title */}
                <h2 className="text-lg sm:text-xl font-extrabold text-[#2C2518] leading-snug">
                  {property.title}
                </h2>

                {/* Address */}
                <p className="text-xs text-[#544212]/80 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#85681E] shrink-0" />
                  <span>
                    {formatFullAddress(property.location.address, property.location.zone, property.location.city)}
                  </span>
                </p>

                {/* Price Display */}
                <div className="bg-white p-3.5 rounded-xl border border-[#c9b67e]/35 shadow-xs">
                  <span className="text-[9px] text-[#544212]/75 font-bold uppercase block tracking-wider">
                    Precio
                  </span>
                  <div className="flex items-baseline justify-between gap-2 mt-0.5">
                    <span className={`text-xl sm:text-2xl font-black ${displayPrice() === 'Consultar' ? 'text-[#85681E]' : 'text-[#2C2518]'}`}>
                      {displayPrice()}
                    </span>
                  </div>
                  {Boolean(property.expensesARS && property.expensesARS > 0) && (
                    <span className="text-[11px] text-[#544212]/80 block font-medium mt-0.5">
                      + Expensas: ${property.expensesARS?.toLocaleString()} ARS
                    </span>
                  )}
                </div>

                {/* 2x2 SPECS GRID */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-[#c9b67e]/25 flex items-center gap-2">
                    <div className="p-1.5 bg-[#85681E]/10 text-[#85681E] rounded-lg">
                      <Maximize className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-[#544212]/75 font-bold uppercase block">Superficie</span>
                      <span className="text-xs font-bold text-[#2C2518]">{property.coveredArea} m² cub.</span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#c9b67e]/25 flex items-center gap-2">
                    <div className="p-1.5 bg-[#85681E]/10 text-[#85681E] rounded-lg">
                      <Bed className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-[#544212]/75 font-bold uppercase block">Dormitorios</span>
                      <span className="text-xs font-bold text-[#2C2518]">
                        {property.bedrooms > 0 ? `${property.bedrooms} dorm.` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#c9b67e]/25 flex items-center gap-2">
                    <div className="p-1.5 bg-[#85681E]/10 text-[#85681E] rounded-lg">
                      <Bath className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-[#544212]/75 font-bold uppercase block">Baños</span>
                      <span className="text-xs font-bold text-[#2C2518]">
                        {property.bathrooms > 0 ? `${property.bathrooms} baños` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#c9b67e]/25 flex items-center gap-2">
                    <div className="p-1.5 bg-[#85681E]/10 text-[#85681E] rounded-lg">
                      <Car className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-[#544212]/75 font-bold uppercase block">Cocheras</span>
                      <span className="text-xs font-bold text-[#2C2518]">
                        {property.garages > 0 ? `${property.garages} coch.` : 'Sin coch.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTION BUTTON */}
              <div className="space-y-1.5 pt-1 border-t border-[#c9b67e]/30">
                <a
                  href={`https://wa.me/5492281591989?text=Hola%20Inmobiliaria%20Silvio%20Ciuffardi,%20quiero%20consultar%20por%20la%20propiedad%20${encodeURIComponent(property.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#85681E] hover:bg-[#725816] text-white py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="border-b border-[#c9b67e]/25 flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'info'
                  ? 'border-[#85681E] text-[#85681E]'
                  : 'border-transparent text-[#544212]/85 hover:text-[#2C2518]'
              }`}
            >
              Descripción
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'border-[#85681E] text-[#85681E]'
                  : 'border-transparent text-[#544212]/85 hover:text-[#2C2518]'
              }`}
            >
              <Video className="w-4 h-4 text-rose-500" />
              <span>Video Tour / IG</span>
              {(property.videoUrl || property.instagramUrl) && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'amenities'
                  ? 'border-[#85681E] text-[#85681E]'
                  : 'border-transparent text-[#544212]/85 hover:text-[#2C2518]'
              }`}
            >
              Amenities
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'location'
                  ? 'border-[#85681E] text-[#85681E]'
                  : 'border-transparent text-[#544212]/85 hover:text-[#2C2518]'
              }`}
            >
              Ubicación
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-600" />
                    <span>Video Tour de la Propiedad</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Recorrido audiovisual publicado por Inmobiliaria Silvio Ciuffardi
                  </p>
                </div>

                {property.instagramUrl && (
                  <a
                    href={property.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <span>Ver Reel en Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {(() => {
                const videoOrIgUrl = property.instagramUrl || property.videoUrl;
                const igEmbedUrl = getInstagramEmbedUrl(videoOrIgUrl);
                const ytEmbedUrl = getYouTubeEmbedUrl(property.videoUrl);

                if (igEmbedUrl) {
                  return (
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="relative w-full max-w-[380px] h-[580px] sm:h-[620px] rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800 flex items-center justify-center mx-auto">
                        <iframe
                          src={igEmbedUrl}
                          className="w-full h-full border-0 rounded-2xl"
                          scrolling="no"
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          allowFullScreen
                          title="Instagram Reel / Video"
                        />
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-2 text-center">
                        Visualización en formato vertical de Instagram. Si tenés problemas para reproducir, usá el botón "Ver Reel en Instagram".
                      </p>
                    </div>
                  );
                }

                if (ytEmbedUrl) {
                  return (
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-16/9 shadow-lg border border-zinc-800">
                      <iframe
                        src={ytEmbedUrl}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube Video"
                      />
                    </div>
                  );
                }

                if (property.videoUrl) {
                  return (
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-16/9 shadow-lg border border-zinc-800">
                      <video
                        src={getAssetUrl(property.videoUrl)}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover scale-[1.08] origin-center"
                      />
                    </div>
                  );
                }

                return null;
              })() || (
                <div className="bg-[#FBF9F4] border border-[#c9b67e]/30 rounded-2xl p-8 text-center space-y-3">
                  <Video className="w-10 h-10 text-[#c9b67e] mx-auto" />
                  <h4 className="font-bold text-[#2C2518] text-sm">Video individual en edición</h4>
                  <p className="text-xs text-[#544212]/80 max-w-md mx-auto">
                    Podés solicitar el video completo del recorrido directo a nuestro WhatsApp o ver nuestros Reels actualizados en Instagram.
                  </p>
                  <a
                    href={`https://wa.me/5492281591989?text=Hola%20Inmobiliaria%20Silvio%20Ciuffardi,%20quisiera%20solicitar%20el%20video%20de%20la%20propiedad%20${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#85681E] hover:bg-[#725816] text-white rounded-xl text-xs font-bold"
                  >
                    <span>Pedir Video por WhatsApp</span>
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
          {activeTab === 'info' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c9b67e]/25 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#85681E]/10 rounded-xl text-[#85681E]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2C2518]">Descripción & Detalles</h3>
                    <p className="text-xs text-[#544212]/80 font-medium">Información completa de la propiedad</p>
                  </div>
                </div>
              </div>

              {/* Main Description Box with stylish accent filete */}
              <div className="bg-white border-l-4 border-l-[#85681E] border border-[#c9b67e]/30 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                {property.description.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-sm text-[#2C2518]/90 leading-relaxed font-normal">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* LOTE SPECIFIC FEATURES IF APPLICABLE */}
              {property.lotFeatures && (
                <div className="bg-[#85681E]/5 border border-[#c9b67e]/40 p-4.5 rounded-2xl space-y-2.5 text-xs">
                  <h4 className="font-bold text-[#2C2518] flex items-center gap-1.5 text-sm">
                    <Trees className="w-4 h-4 text-[#85681E]" />
                    <span>Datos Técnicos del Lote</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[#2C2518] font-medium">
                    {property.lotFeatures.frontageMeters && (
                      <div className="bg-white/90 p-2.5 rounded-xl border border-[#c9b67e]/35 shadow-2xs">
                        <span className="text-[10px] text-[#544212]/70 font-bold uppercase block">Frente</span>
                        <strong className="text-xs text-[#2C2518]">{property.lotFeatures.frontageMeters} metros</strong>
                      </div>
                    )}
                    {property.lotFeatures.depthMeters && (
                      <div className="bg-white/90 p-2.5 rounded-xl border border-[#c9b67e]/35 shadow-2xs">
                        <span className="text-[10px] text-[#544212]/70 font-bold uppercase block">Fondo</span>
                        <strong className="text-xs text-[#2C2518]">{property.lotFeatures.depthMeters} metros</strong>
                      </div>
                    )}
                    <div className="bg-white/90 p-2.5 rounded-xl border border-[#c9b67e]/35 shadow-2xs">
                      <span className="text-[10px] text-[#544212]/70 font-bold uppercase block">Salida al Agua</span>
                      <strong className="text-xs text-[#2C2518]">{property.lotFeatures.waterAccess ? 'Sí (Directa)' : 'No'}</strong>
                    </div>
                    {property.lotFeatures.fosiFos && (
                      <div className="bg-white/90 p-2.5 rounded-xl border border-[#c9b67e]/35 shadow-2xs">
                        <span className="text-[10px] text-[#544212]/70 font-bold uppercase block">Factibilidad FOS/FOT</span>
                        <strong className="text-xs text-[#2C2518]">{property.lotFeatures.fosiFos}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#2C2518]">Amenities & Equipamiento</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#c9b67e]/25 text-xs font-semibold text-[#2C2518]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#85681E]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#2C2518] flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-[#85681E]" />
                    <span>Ubicación de la Propiedad</span>
                  </h3>
                  <p className="text-xs text-[#544212]/80 font-medium">
                    {formatFullAddress(property.location.address, property.location.zone, property.location.city)}
                  </p>
                </div>
                <a
                  href={externalGoogleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2C2518] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <span>Abrir en Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#85681E]" />
                </a>
              </div>

              <div className="relative w-full h-[340px] sm:h-[420px] rounded-2xl overflow-hidden shadow-md border border-zinc-300 bg-zinc-100 group">
                <iframe
                  key={mapZoom}
                  title={`Mapa ${property.title}`}
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
                {/* Overlay Map Zoom Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-zinc-300 p-1 gap-1 z-10">
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.min(prev + 1, 19))}
                    disabled={mapZoom >= 19}
                    className="p-2 hover:bg-zinc-100 disabled:opacity-40 text-zinc-800 transition-colors cursor-pointer rounded-lg"
                    title="Acercar mapa (+)"
                  >
                    <Plus className="w-4 h-4 text-[#85681E]" />
                  </button>
                  <div className="h-px bg-zinc-200 w-full" />
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.max(prev - 1, 10))}
                    disabled={mapZoom <= 10}
                    className="p-2 hover:bg-[#FBF9F4] disabled:opacity-40 text-zinc-800 transition-colors cursor-pointer rounded-lg"
                    title="Alejar mapa (-)"
                  >
                    <Minus className="w-4 h-4 text-[#544212]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX ZOOM MODAL (DOUBLE-CLICK ZOOM) */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fadeIn"
          onClick={() => setZoomImage(null)}
        >
          <div className="w-full flex items-center justify-between text-white max-w-6xl">
            <div className="text-xs font-bold text-zinc-300">
              <span className="text-[#85681E]">{property.title}</span> — {formatLocationName(property.location.zone, property.location.city)}
            </div>
            <button
              onClick={() => setZoomImage(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              title="Cerrar vista ampliada"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative max-w-6xl max-h-[85vh] flex items-center justify-center overflow-hidden my-auto p-2">
            <div className="relative inline-flex items-center justify-center max-w-full max-h-[82vh]">
              <img
                src={zoomImage}
                alt="Foto ampliada"
                className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl border border-zinc-800"
                onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
                onClick={(e) => e.stopPropagation()}
              />
              {/* Solid Silvio Ciuffardi Watermark Badge to cover old watermarks */}
              <div className="absolute bottom-6 right-6 pointer-events-none z-10 bg-white/45 backdrop-blur-[1.5px] border border-[#c9b67e]/20 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 opacity-65">
                <svg viewBox="0 3 100 29" className="w-3.5 h-2.5 object-contain opacity-90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="21" y1="27" x2="50" y2="4" stroke="#85681E" strokeWidth="3" strokeLinecap="round" />
                  <rect x="29" y="8" width="4.5" height="11" fill="#85681E" />
                  <polygon points="50,4 78,25 74,29 50,11" fill="#85681E" />
                  <rect x="42.5" y="16" width="6" height="6" fill="#85681E" />
                  <rect x="51.5" y="16" width="6" height="6" fill="#85681E" />
                  <rect x="42.5" y="25" width="6" height="6" fill="#85681E" />
                  <rect x="51.5" y="25" width="6" height="6" fill="#85681E" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block font-['Quicksand',sans-serif] tracking-tight font-bold text-[#2C2518] text-[10px] sm:text-[11px] whitespace-nowrap">
                    Silvio Ciuffardi
                  </span>
                  <span className="block font-['Quicksand',sans-serif] text-[6px] sm:text-[7px] tracking-[0.25em] font-medium text-center text-[#544212]/85 uppercase mt-0">
                    Inmobiliaria
                  </span>
                </div>
              </div>
            </div>
            {property.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const idx = property.images.indexOf(zoomImage);
                    const prevIdx = idx > 0 ? idx - 1 : property.images.length - 1;
                    setZoomImage(property.images[prevIdx]);
                    setActiveImageIndex(prevIdx);
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer shadow-xl border border-zinc-700"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const idx = property.images.indexOf(zoomImage);
                    const nextIdx = idx < property.images.length - 1 ? idx + 1 : 0;
                    setZoomImage(property.images[nextIdx]);
                    setActiveImageIndex(nextIdx);
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer shadow-xl border border-zinc-700"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="text-center text-xs text-zinc-400 font-medium">
            Haz clic fuera de la imagen o presiona la cruz para cerrar
          </div>
        </div>
      )}
    </div>
  );
};
