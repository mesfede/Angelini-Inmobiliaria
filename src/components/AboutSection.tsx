import React from 'react';
import { MessageCircle, ArrowRight, Instagram, Camera, Globe, ShieldCheck } from 'lucide-react';
import { AngeliniEmblem } from './Logo';

export const AboutSection: React.FC = () => {
  const whatsappUrl = `https://wa.me/5492281301464?text=${encodeURIComponent(
    'Hola Inmobiliaria Angelini! Quisiera consultarte para vender, comprar o tasar una propiedad en Azul o la zona.'
  )}`;

  return (
    <section id="nosotros" className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-[#071D3F] via-[#0B2F64] to-[#051329] rounded-3xl p-6 sm:p-8 lg:p-10 text-white border border-white/15 shadow-2xl relative overflow-hidden">
        {/* Subtle glow background in Angelini Red and Navy */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D3122A]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#0B2F64]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 text-left">
          {/* Header Row: Badge & Slogan */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AngeliniEmblem sizeClass="w-9 h-9 sm:w-10 sm:h-10" />
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#051329]/80 border border-white/20 text-[#D3122A] bg-white text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                  ¿Querés vender, comprar o tasar?
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l-2 border-[#D3122A]">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">
                Fuerte en raíces · Sólido en hogares
              </span>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-['Playfair_Display','Libre_Baskerville',Georgia,serif] font-bold tracking-tight leading-snug text-pretty">
            Vendé o alquilá con total solidez, te acompañamos con <span className="text-[#e3171d] underline decoration-[#e3171d]/40 underline-offset-4">la mejor difusión</span>.
          </h2>

          {/* Subtitle & Action Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-1">
            <div className="max-w-2xl space-y-2.5">
              <div className="text-xs sm:text-sm md:text-[15px] text-slate-200 font-medium leading-relaxed space-y-1.5 text-pretty">
                <p>
                  Presentamos tu inmueble con <strong className="text-white font-bold">fotos y video HD</strong>, difusión destacada en <strong className="text-white font-bold">Instagram</strong> y presencia en nuestra <strong className="text-white font-bold">plataforma web</strong>.
                </p>
                <p className="text-slate-300">
                  Brindamos atención personalizada, segura y transparente en <strong className="text-white font-semibold">Azul y toda la región</strong>.
                </p>
              </div>

              {/* Compact feature chips */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href="#catalogo"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5 text-[#e3171d]" />
                  <span>Fotos & Video HD</span>
                </a>
                <a
                  href="https://www.instagram.com/angelini_inmobiliaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-[#e3171d] text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#e3171d]" />
                  <span>@angelini_inmobiliaria</span>
                </a>
                <div
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#93C5FD]" />
                  <span>De Paula 1216 · 9 a 15 hs</span>
                </div>
              </div>
            </div>

            {/* WhatsApp button in Official WhatsApp Green (#25D366) */}
            <div className="w-full lg:w-auto shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-xl hover:shadow-[#25D366]/40 transition-all cursor-pointer flex items-center justify-center gap-2.5 group border border-white/20"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Escribinos por WhatsApp</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

