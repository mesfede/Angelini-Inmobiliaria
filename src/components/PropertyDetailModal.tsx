import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, Maximize, Bed, Bath, Car, Phone, Mail, CheckCircle2, ChevronLeft, ChevronRight, Share2, Heart, Trees, Video, ExternalLink, Star, FileText, Plus, Minus, Home, Flame, Instagram } from 'lucide-react';
import { Property } from '../types';
import { getAssetUrl, formatLocationName, formatFullAddress, formatPropertyTitle } from '../lib/utils';
import { Logo } from './Logo';
import { BRAND_PLACEHOLDER_IMAGE } from '../lib/brandPlaceholder';

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

  const currentPhotoUrl = property.images[activeImageIndex] || property.images[0] || BRAND_PLACEHOLDER_IMAGE;

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
        return 'bg-[#041020] text-white shadow-xs';
      case 'ALQUILER':
      case 'ALQUILER TEMPORAL':
        return 'bg-[#B08237] text-white shadow-xs';
      case 'LOTES':
      case 'LOTEO':
        return 'bg-emerald-700 text-white shadow-xs';
      default:
        return 'bg-[#041020] text-white shadow-xs';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-5 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-[#dbdad8]">
        {/* TOP MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#041020] via-[#041020] to-[#020912] text-white px-4 py-3 sm:px-6 flex items-center justify-between border-b border-white/15 shrink-0">
          <div className="flex items-center gap-3">
            <Logo variant="scrolled" size="md" />
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onEditProperty && (
              <button
                onClick={() => {
                  onEditProperty(property);
                  onClose();
                }}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 border border-white/20 transition-colors cursor-pointer"
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
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#B08237] text-[#B08237]' : 'text-white'}`} />
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
                <div className="absolute top-full right-0 mt-1 bg-[#041020] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap z-50 animate-fadeIn border border-[#B08237]/40">
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
                className="relative aspect-4/3 sm:aspect-4/3 lg:aspect-4/3 min-h-[280px] sm:min-h-[340px] lg:min-h-[380px] w-full rounded-2xl overflow-hidden bg-zinc-900 group shadow-md border border-[#dbdad8] cursor-zoom-in"
                title="Haga doble clic para ampliar a pantalla completa"
              >
                <img
                  src={currentPhotoUrl || BRAND_PLACEHOLDER_IMAGE}
                  alt={property.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover scale-[1.05] origin-center transition-all duration-300 group-hover:scale-[1.07]"
                  onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = BRAND_PLACEHOLDER_IMAGE; }}
                />

                {/* Angelini Inmobiliaria Official Watermark Logo */}
                <div className="absolute bottom-3 right-3 pointer-events-none z-10 opacity-35 drop-shadow-sm">
                  <Logo variant="scrolled" size="sm" className="scale-90 origin-bottom-right" />
                </div>

                {/* Center Side-to-Side Status Banner */}
                {property.statusBanner && property.statusBanner !== 'NINGUNA' && (
                  <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 z-25 py-4 sm:py-5 px-6 text-center font-black text-lg sm:text-2xl uppercase tracking-widest pointer-events-none transition-all shadow-2xl ${
                    property.statusBanner.toLowerCase().includes('vendida')
                      ? 'bg-[#B08237]/95 text-white border-y-2 border-white/40'
                      : property.statusBanner.toLowerCase().includes('reservada')
                      ? 'bg-[#041020]/95 text-white border-y-2 border-[#B08237]'
                      : 'bg-[#041020]/95 text-white border-y-2 border-white/30'
                  }`}>
                    <span className="text-[#B08237] mr-3">●</span>
                    {property.statusBanner}
                    <span className="text-[#B08237] ml-3">●</span>
                  </div>
                )}

                {/* Double click instruction overlay badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize className="w-3 h-3 text-[#B08237]" />
                  <span>Doble clic para ampliar</span>
                </div>

                {/* Operation, Featured & Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-md ${getOperationBadgeColor(property.operation)}`}>
                    {property.operation}
                  </span>
                  {property.featured && (
                    <span className="bg-[#B08237] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-white/20">
                      <Home className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>Propiedad destacada</span>
                    </span>
                  )}
                  {property.isRecentlyUploaded && (
                    <span className="bg-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-white/20">
                      <Flame className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                      <span>Recién subida</span>
                    </span>
                  )}
                  {(property.videoUrl || property.instagramUrl) && (
                    <span className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-white/20">
                      <Instagram className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>Video IG</span>
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
                        setActiveImageIndex(
                          (prev) => (prev + 1) % property.images.length
                        );
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer shadow-md"
                      title="Foto siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {property.images.length > 1 && (
                <div className="relative flex items-center">
                  <button
                    onClick={() => scrollThumbnails('left')}
                    className="p-1.5 rounded-lg bg-[#dbdad8]/50 hover:bg-[#dbdad8] text-[#041020] transition-colors mr-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div
                    ref={thumbnailRef}
                    className="flex gap-2 overflow-x-auto no-scrollbar py-1"
                  >
                    {property.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          idx === activeImageIndex
                            ? 'border-[#B08237] scale-105 shadow-md'
                            : 'border-[#dbdad8] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${property.title} miniatura ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => scrollThumbnails('right')}
                    className="p-1.5 rounded-lg bg-[#dbdad8]/50 hover:bg-[#dbdad8] text-[#041020] transition-colors ml-1 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: PROPERTY INFO SUMMARY */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-[#dbdad8]/15 p-4 rounded-2xl border border-[#dbdad8]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#B08237] uppercase tracking-wider">
                    <span>{property.type}</span>
                    <span className="text-zinc-400 font-normal">/</span>
                    <span>{formatLocationName(property.location.zone, property.location.city)}</span>
                  </div>
                </div>

                {/* Main Title */}
                <h2 className="text-lg sm:text-xl font-extrabold text-[#041020] leading-snug font-['Playfair_Display','Libre_Baskerville',Georgia,serif]">
                  {formatPropertyTitle(property.title)}
                </h2>

                {/* Address */}
                <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#B08237] shrink-0" />
                  <span>
                    {formatFullAddress(property.location.address, property.location.zone, property.location.city)}
                  </span>
                </p>

                {/* Price Display */}
                <div className="bg-white p-3.5 rounded-xl border border-[#dbdad8] shadow-xs">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">
                    Precio
                  </span>
                  <div className="flex items-baseline justify-between gap-2 mt-0.5">
                    <span className={`text-xl sm:text-2xl font-black ${displayPrice() === 'Consultar' ? 'text-[#B08237]' : 'text-[#041020]'}`}>
                      {displayPrice()}
                    </span>
                  </div>
                  {Boolean(property.expensesARS && property.expensesARS > 0) && (
                    <span className="text-[11px] text-slate-500 block font-medium mt-0.5">
                      + Expensas: ${property.expensesARS?.toLocaleString()} ARS
                    </span>
                  )}
                </div>

                {/* 2x2 SPECS GRID */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-[#dbdad8] flex items-center gap-2">
                    <div className="p-1.5 bg-[#B08237]/10 text-[#B08237] rounded-lg">
                      <Maximize className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Superficie</span>
                      <span className="text-xs font-bold text-[#041020]">{property.coveredArea} m² cub.</span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#dbdad8] flex items-center gap-2">
                    <div className="p-1.5 bg-[#B08237]/10 text-[#B08237] rounded-lg">
                      <Bed className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Dormitorios</span>
                      <span className="text-xs font-bold text-[#041020]">
                        {property.bedrooms > 0 ? `${property.bedrooms} dorm.` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#dbdad8] flex items-center gap-2">
                    <div className="p-1.5 bg-[#B08237]/10 text-[#B08237] rounded-lg">
                      <Bath className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Baños</span>
                      <span className="text-xs font-bold text-[#041020]">
                        {property.bathrooms > 0 ? `${property.bathrooms} baños` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#dbdad8] flex items-center gap-2">
                    <div className="p-1.5 bg-[#B08237]/10 text-[#B08237] rounded-lg">
                      <Car className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Cocheras</span>
                      <span className="text-xs font-bold text-[#041020]">
                        {property.garages > 0 ? `${property.garages} coch.` : 'Sin coch.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTION BUTTON */}
              <div className="space-y-1.5 pt-1 border-t border-[#dbdad8]">
                <a
                  href={`https://wa.me/5492281301464?text=Hola%20Inmobiliaria%20Angelini,%20quiero%20consultar%20por%20la%20propiedad%20${encodeURIComponent(property.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#B08237] hover:bg-[#9A702D] text-white py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-[#B08237]/30 border border-white/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="border-b border-[#dbdad8] flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'info'
                  ? 'border-[#B08237] text-[#041020]'
                  : 'border-transparent text-slate-500 hover:text-[#041020]'
              }`}
            >
              Descripción
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'border-[#B08237] text-[#041020]'
                  : 'border-transparent text-slate-500 hover:text-[#041020]'
              }`}
            >
              <Video className="w-4 h-4 text-[#B08237]" />
              <span>Video Tour / IG</span>
              {(property.videoUrl || property.instagramUrl) && (
                <span className="w-2 h-2 rounded-full bg-[#B08237] animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'amenities'
                  ? 'border-[#B08237] text-[#041020]'
                  : 'border-transparent text-slate-500 hover:text-[#041020]'
              }`}
            >
              Amenities
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'location'
                  ? 'border-[#B08237] text-[#041020]'
                  : 'border-transparent text-slate-500 hover:text-[#041020]'
              }`}
            >
              Ubicación
            </button>
          </div>

          {/* TAB CONTENTS */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              {(() => {
                const igUrl = getInstagramEmbedUrl(property.instagramUrl || property.videoUrl);
                const ytUrl = getYouTubeEmbedUrl(property.videoUrl);

                if (igUrl) {
                  return (
                    <div className="max-w-md mx-auto aspect-9/16 sm:aspect-4/5 w-full bg-black rounded-2xl overflow-hidden shadow-lg border border-[#dbdad8]">
                      <iframe
                        src={igUrl}
                        className="w-full h-full border-0"
                        allowTransparency
                        allow="encrypted-media"
                      />
                    </div>
                  );
                }

                if (ytUrl) {
                  return (
                    <div className="aspect-video w-full max-w-2xl mx-auto bg-black rounded-2xl overflow-hidden shadow-lg border border-[#dbdad8]">
                      <iframe
                        src={ytUrl}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }

                return null;
              })() || (
                <div className="bg-[#dbdad8]/20 border border-[#dbdad8] rounded-2xl p-8 text-center space-y-3">
                  <Video className="w-10 h-10 text-[#B08237] mx-auto" />
                  <h4 className="font-bold text-[#041020] text-sm">Video individual en edición</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Podés solicitar el video completo del recorrido directo a nuestro WhatsApp o ver nuestros Reels actualizados en Instagram.
                  </p>
                  <a
                    href={`https://wa.me/5492281301464?text=Hola%20Inmobiliaria%20Angelini,%20quisiera%20solicitar%20el%20video%20de%20la%20propiedad%20${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#B08237] hover:bg-[#9A702D] text-white rounded-xl text-xs font-bold shadow-sm border border-white/20"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dbdad8] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#B08237]/10 rounded-xl text-[#B08237]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#041020]">Descripción & Detalles</h3>
                    <p className="text-xs text-slate-500 font-medium">Información completa de la propiedad</p>
                  </div>
                </div>
              </div>

              {/* Main Description Box with stylish accent filete */}
              <div className="bg-white border-l-4 border-l-[#B08237] border border-[#dbdad8] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                {property.description.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-sm text-[#041020]/90 leading-relaxed font-normal">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* LOTE SPECIFIC FEATURES IF APPLICABLE */}
              {property.lotFeatures && (
                <div className="bg-[#dbdad8]/20 border border-[#dbdad8] p-4.5 rounded-2xl space-y-2.5 text-xs">
                  <h4 className="font-bold text-[#041020] flex items-center gap-1.5 text-sm">
                    <Trees className="w-4 h-4 text-[#B08237]" />
                    <span>Datos Técnicos del Lote</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[#041020] font-medium">
                    {property.lotFeatures.frontageMeters && (
                      <div className="bg-white p-2.5 rounded-xl border border-[#dbdad8] shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Frente</span>
                        <strong className="text-xs text-[#041020]">{property.lotFeatures.frontageMeters} metros</strong>
                      </div>
                    )}
                    {property.lotFeatures.depthMeters && (
                      <div className="bg-white p-2.5 rounded-xl border border-[#dbdad8] shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Fondo</span>
                        <strong className="text-xs text-[#041020]">{property.lotFeatures.depthMeters} metros</strong>
                      </div>
                    )}
                    <div className="bg-white p-2.5 rounded-xl border border-[#dbdad8] shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Salida al Agua</span>
                      <strong className="text-xs text-[#041020]">{property.lotFeatures.waterAccess ? 'Sí (Directa)' : 'No'}</strong>
                    </div>
                    {property.lotFeatures.fosiFos && (
                      <div className="bg-white p-2.5 rounded-xl border border-[#dbdad8] shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Factibilidad FOS/FOT</span>
                        <strong className="text-xs text-[#041020]">{property.lotFeatures.fosiFos}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#041020]">Amenities & Equipamiento</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#dbdad8] text-xs font-semibold text-[#041020]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#B08237]" />
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
                  <h3 className="text-base font-bold text-[#041020] flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-[#B08237]" />
                    <span>Ubicación de la Propiedad</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {formatFullAddress(property.location.address, property.location.zone, property.location.city)}
                  </p>
                </div>
                <a
                  href={externalGoogleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#041020] hover:bg-[#061a33] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs border border-[#B08237]/40"
                >
                  <span>Abrir en Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B08237]" />
                </a>
              </div>

              <div className="relative w-full h-[340px] sm:h-[420px] rounded-2xl overflow-hidden shadow-md border border-[#dbdad8] bg-zinc-100 group">
                <iframe
                  key={mapZoom}
                  title={`Mapa ${property.title}`}
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
                {/* Overlay Map Zoom Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-[#dbdad8] p-1 gap-1 z-10">
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.min(prev + 1, 19))}
                    disabled={mapZoom >= 19}
                    className="p-2 hover:bg-[#dbdad8]/30 disabled:opacity-40 text-[#041020] transition-colors cursor-pointer rounded-lg"
                    title="Acercar mapa (+)"
                  >
                    <Plus className="w-4 h-4 text-[#B08237]" />
                  </button>
                  <div className="h-px bg-[#dbdad8] w-full" />
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.max(prev - 1, 10))}
                    disabled={mapZoom <= 10}
                    className="p-2 hover:bg-[#dbdad8]/30 disabled:opacity-40 text-[#041020] transition-colors cursor-pointer rounded-lg"
                    title="Alejar mapa (-)"
                  >
                    <Minus className="w-4 h-4 text-slate-700" />
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
            <div className="text-xs font-bold text-[#dbdad8]">
              <span className="text-[#B08237]">{property.title}</span> — {formatLocationName(property.location.zone, property.location.city)}
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
                src={zoomImage || BRAND_PLACEHOLDER_IMAGE}
                alt="Foto ampliada"
                className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl border border-zinc-800"
                onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = BRAND_PLACEHOLDER_IMAGE; }}
                onClick={(e) => e.stopPropagation()}
              />
              {/* Solid Angelini Inmobiliaria Watermark Badge */}
              <div className="absolute bottom-6 right-6 pointer-events-none z-10 opacity-35 drop-shadow-md">
                <Logo variant="scrolled" size="md" />
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

          <div className="text-center text-xs text-[#dbdad8] font-medium">
            Haz clic fuera de la imagen o presiona la cruz para cerrar
          </div>
        </div>
      )}
    </div>
  );
};
