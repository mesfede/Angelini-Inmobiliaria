import React from 'react';
import { ArrowRight, Calculator, Instagram, MapPin, ShieldCheck } from 'lucide-react';
import { getAssetUrl } from '../lib/utils';

interface AboutSectionProps {
  onOpenTasacion?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenTasacion }) => {
  const whatsappSellUrl = `https://wa.me/5492281301464?text=${encodeURIComponent(
    'Hola Inmobiliaria Angelini! Estoy por vender mi propiedad y me gustaría conversar sobre la mejor estrategia de venta y tasación en Azul y la zona.'
  )}`;

  return (
    <section id="nosotros" className="pt-16 sm:pt-24 lg:pt-40 mt-4 sm:mt-6 lg:mt-8 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative select-none">
      
      {/* ========================================================================= */}
      {/* MOBILE / TABLET ONLY: OVERFLOWING MODEL AT TOP (HEAD & SHOULDERS ON WHITE) */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex justify-center -mb-12 sm:-mb-16 relative z-20 pointer-events-none">
        <div className="relative w-56 sm:w-68 max-w-[80vw]">
          <img
            src={getAssetUrl('angelini_dueño_ok.png')}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('angelini_dueno_user.png')) {
                target.src = getAssetUrl('angelini_dueno_user.png');
              }
            }}
            alt="Silvio Angelini - Asesor Inmobiliario y Martillero"
            className="w-full h-auto max-h-[300px] sm:max-h-[360px] object-contain object-bottom drop-shadow-[0_15px_25px_rgba(4,16,32,0.25)]"
            loading="lazy"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER WRAPPER                                                    */}
      {/* ========================================================================= */}
      <div className="relative">
        
        {/* 1. RECTANGULAR MODULE (#041020 Dark Navy with subtle gold borders) */}
        <div className="rounded-2xl sm:rounded-3xl shadow-2xl border border-[#B08237]/40 bg-gradient-to-br from-[#041020] via-[#061830] to-[#020912] text-white relative z-10 overflow-hidden">
          
          {/* Ambient Subtle Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B08237]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

          {/* INNER CONTENT: ADAPTED FOR BOTH MOBILE & DESKTOP */}
          <div className="relative z-10 pt-16 sm:pt-20 pb-6 px-4 sm:px-8 lg:py-8 lg:px-10 lg:pl-[420px] xl:pl-[480px] flex flex-col justify-between min-h-[340px] lg:min-h-[370px]">
            
            {/* HEADLINES & VALUE STATEMENTS (ALL IN CLEAN WHITE / NO RED TEXT) */}
            <div className="space-y-3.5">
              
              {/* MAIN HERO HEADLINE: ¿VAS A VENDER TU PROPIEDAD? */}
              <div className="space-y-1 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-[36px] lg:text-[42px] font-['Playfair_Display','Libre_Baskerville',Georgia,serif] font-black text-white tracking-tight leading-[1.1]">
                  ¿VAS A VENDER TU PROPIEDAD?
                </h2>
              </div>

              {/* CLEAN WHITE / GOLD DIVIDER LINE */}
              <div className="w-full max-w-xs h-[2px] bg-gradient-to-r from-white/80 via-[#B08237]/60 to-transparent rounded-full mx-auto lg:mx-0" />

              {/* SUBHEADLINE: ANTES DE PUBLICARLA, CONSULTANOS. (TODO EN BLANCO) */}
              <div className="text-center lg:text-left">
                <p className="text-base sm:text-lg md:text-[20px] font-extrabold tracking-tight leading-snug text-white">
                  ANTES DE PUBLICARLA, CONSULTANOS.
                </p>
              </div>

              {/* CLEAN VALUE PROPOSITION STATEMENTS (TODO EN BLANCO / SIN RECUADROS NI ROJO) */}
              <div className="space-y-1.5 pt-1 max-w-2xl text-center lg:text-left">
                <p className="text-[#dbdad8] text-xs sm:text-sm md:text-base leading-snug font-normal">
                  Una buena estrategia desde el inicio puede <strong className="text-white font-bold">hacer la diferencia.</strong>
                </p>
                <p className="text-xs sm:text-sm font-black tracking-wider uppercase text-white">
                  SI ESTÁS POR VENDER, CONVERSEMOS.
                </p>
              </div>

            </div>

            {/* CALL TO ACTION BUTTONS & TRUST BADGES */}
            <div className="pt-6 space-y-4">
              
              {/* Actions Row: Circular WhatsApp + Unboxed Text & Tasación Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                
                {/* WhatsApp Link: Circular Logo + Free Text */}
                <a
                  href={whatsappSellUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] flex items-center justify-center shadow-lg hover:shadow-[#25D366]/50 group-hover:scale-105 active:scale-95 transition-all shrink-0 border-2 border-white/20">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <span className="text-white group-hover:text-[#25D366] font-extrabold text-sm sm:text-base tracking-wide transition-colors flex items-center gap-1.5">
                    Escribinos por WhatsApp
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                {/* Divider on desktop */}
                <div className="hidden sm:block h-6 w-px bg-white/20" />

                {/* Tasación Modal Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenTasacion) {
                      onOpenTasacion();
                    } else {
                      window.open(whatsappSellUrl, '_blank');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#B08237] hover:bg-[#9A702D] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/25"
                >
                  <Calculator className="w-3.5 h-3.5 text-white" />
                  <span>Solicitar Tasación</span>
                </button>

              </div>

              {/* Trust Footer Badges (All in White / Neutral) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 pt-1 text-[10px] sm:text-[11px] font-bold text-[#dbdad8]">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B08237]" />
                  <span>Martillero Matriculado · Colegiado</span>
                </span>
                <a
                  href="https://www.instagram.com/angelini_inmobiliaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 hover:border-white text-white transition-colors shadow-2xs cursor-pointer"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#B08237]" />
                  <span>@angelini_inmobiliaria</span>
                </a>
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-[#B08237]" />
                  <span>De Paula 1216 · Azul</span>
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* DESKTOP ONLY: LARGE PERSON OVERFLOWING (HEAD & SHOULDERS WAY ABOVE MODULE) */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex absolute left-2 xl:left-6 -top-44 xl:-top-52 bottom-0 z-20 items-end pointer-events-none">
          <div className="relative w-[440px] xl:w-[500px] h-[640px] xl:h-[720px] flex items-end">
            
            {/* Cutout image enlarged to significantly exceed the height of the card */}
            <img
              src={getAssetUrl('angelini_dueño_ok.png')}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('angelini_dueno_user.png')) {
                  target.src = getAssetUrl('angelini_dueno_user.png');
                }
              }}
              alt="Silvio Angelini - Asesor Inmobiliario y Martillero"
              className="w-full h-full object-contain object-bottom drop-shadow-[0_25px_35px_rgba(4,16,32,0.30)] filter brightness-[1.01] contrast-[1.02]"
              loading="lazy"
            />

          </div>
        </div>

      </div>
    </section>
  );
};
