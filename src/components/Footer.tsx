import React from 'react';
import { Phone, Mail, MapPin, Instagram, Lock, ArrowRight, Award } from 'lucide-react';
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
    <footer id="contacto" className="bg-gradient-to-b from-[#121212] via-[#181818] to-black text-zinc-300 pt-16 pb-8 border-t-2 border-[#946E00] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#946E00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="light" size="md" />

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md pt-1">
              Gestión inmobiliaria integral, venta y alquiler de viviendas, tasaciones profesionales y comercialización de lotes, quintas, campos y administración de consorcios en Azul y la zona.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-500 font-medium bg-amber-950/30 p-2.5 rounded-xl border border-amber-900/40 w-fit">
              <Award className="w-4 h-4 text-[#946E00] shrink-0" />
              <span>Martillero, Corredor y Admin. Consorcios · Mat. 1933 T. VII F. 224</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#946E00]" />
              Navegación
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-medium">
              <li>
                <button
                  onClick={() => onSelectOperation('VENTA')}
                  className="hover:text-[#946E00] transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-[#946E00] transition-colors" />
                  <span>Propiedades en Venta</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectOperation('ALQUILER')}
                  className="hover:text-[#946E00] transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-[#946E00] transition-colors" />
                  <span>Propiedades en Alquiler</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectOperation('LOTES')}
                  className="hover:text-[#946E00] transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-[#946E00] transition-colors" />
                  <span>Lotes y Terrenos</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#946E00]" />
              Contacto Directo
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#946E00] shrink-0 mt-0.5 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-zinc-300 leading-snug">
                  Azul, Provincia de Buenos Aires • Atención en Azul, Tandil, CABA y la Zona.
                </span>
              </li>

              <li className="flex items-center">
                <a
                  href="https://wa.me/5492281591989"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#946E00] shrink-0 shadow-xs group-hover:border-[#946E00] group-hover:bg-[#946E00]/20 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white group-hover:text-[#946E00] transition-colors">
                    +54 9 2281 591989
                  </span>
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="https://www.instagram.com/inmobiliaria_silvio_ciuffardi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-amber-500 shrink-0 shadow-xs group-hover:border-amber-500 group-hover:bg-amber-500/20 transition-all">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white group-hover:text-amber-300 transition-colors">
                    @inmobiliaria_silvio_ciuffardi
                  </span>
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="mailto:contacto@inmobiliariasilviociuffardi.ar"
                  className="flex items-center gap-3 group transition-colors truncate"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#946E00] shrink-0 shadow-xs group-hover:border-[#946E00] group-hover:bg-[#946E00]/20 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-zinc-300 group-hover:text-white transition-colors truncate">
                    contacto@inmobiliariasilviociuffardi.ar
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p className="flex items-center gap-1.5 flex-wrap">
            <span>© {new Date().getFullYear()} Inmobiliaria Silvio Ciuffardi. Todos los derechos reservados.</span>
            {onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center text-zinc-600 hover:text-zinc-300 transition-opacity cursor-pointer p-0.5 rounded opacity-0 hover:opacity-100 focus:opacity-100 ml-1"
                title="Acceso de Administración"
                aria-label="Acceso de Administración"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};


