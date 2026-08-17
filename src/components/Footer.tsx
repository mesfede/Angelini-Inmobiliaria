import React from 'react';
import { Phone, Mail, MapPin, Instagram, Lock, ArrowRight, Clock } from 'lucide-react';
import { OperationType } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  onSelectOperation: (op: OperationType | 'TODAS') => void;
  onOpenValuationModal?: () => void;
  onOpenAdminLogin?: () => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectOperation,
  onOpenAdminLogin,
}) => {
  return (
    <footer id="contacto" className="bg-gradient-to-b from-[#041020] via-[#041020] to-[#020912] text-[#dbdad8] pt-16 pb-8 border-t-4 border-[#B08237] relative overflow-hidden">
      {/* Background radial glow in Angelini brand colors */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B08237]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <Logo variant="scrolled" size="md" />

            <p className="text-xs sm:text-sm text-[#dbdad8] leading-relaxed max-w-md pt-1">
              Gestión inmobiliaria profesional y transparente en Azul y toda la región. Venta, alquiler, tasaciones y comercialización de casas, departamentos, terrenos, lotes y campos.
            </p>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/15 pb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B08237]" />
              Navegación
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-medium">
              <li>
                <button
                  onClick={() => onSelectOperation('VENTA')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group text-[#dbdad8]"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#B08237] group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:text-white">Propiedades en Venta</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectOperation('ALQUILER')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group text-[#dbdad8]"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#B08237] group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:text-white">Propiedades en Alquiler</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectOperation('LOTES')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group text-[#dbdad8]"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#B08237] group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:text-white">Lotes y Terrenos</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/15 pb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B08237]" />
              Contacto Directo
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#B08237] shrink-0 mt-0.5 shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-slate-200 leading-snug">
                  <strong className="text-white block font-bold">De Paula 1216</strong>
                  <span>Azul, Provincia de Buenos Aires</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#dbdad8] shrink-0 mt-0.5 shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-slate-200 leading-snug">
                  <strong className="text-white block font-bold">Horario de Atención</strong>
                  <span>Lunes a Viernes de 9:00 a 15:00 hs.</span>
                </div>
              </li>

              <li className="flex items-center">
                <a
                  href="https://wa.me/5492281301464?text=Hola%20Inmobiliaria%20Angelini,%20quisiera%20hacer%20una%20consulta."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#B08237] shrink-0 shadow-sm group-hover:bg-[#B08237] group-hover:text-white transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="leading-snug">
                    <span className="text-[10px] text-slate-400 block font-medium">WhatsApp / Llamadas</span>
                    <span className="font-bold text-white group-hover:text-[#B08237] transition-colors text-sm">
                      2281-301464 (+54 9 2281 301464)
                    </span>
                  </div>
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="https://www.instagram.com/angelini_inmobiliaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#B08237] shrink-0 shadow-sm group-hover:bg-[#B08237] group-hover:text-white transition-all">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div className="leading-snug">
                    <span className="text-[10px] text-slate-400 block font-medium">Instagram Oficial</span>
                    <span className="font-bold text-white group-hover:text-[#B08237] transition-colors">
                      @angelini_inmobiliaria
                    </span>
                  </div>
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="mailto:contacto@angeliniinmobiliaria.ar"
                  className="flex items-center gap-3 group transition-colors truncate"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#dbdad8] shrink-0 shadow-sm group-hover:bg-white/20 group-hover:text-white transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[#dbdad8] group-hover:text-white transition-colors truncate">
                    contacto@angeliniinmobiliaria.ar
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="group flex items-center gap-1.5 flex-wrap">
            <span>© {new Date().getFullYear()} Inmobiliaria Angelini. Todos los derechos reservados.</span>
            {onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center justify-center text-slate-500 hover:text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 hover:opacity-100 cursor-pointer p-1.5 rounded-lg ml-1"
                title="Acceso de Administración"
                aria-label="Acceso de Administración"
                id="footer-admin-login-btn"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </p>
          <p className="text-[11px] text-slate-400">
            De Paula 1216 · Azul, Prov. de Buenos Aires
          </p>
        </div>
      </div>
    </footer>
  );
};
