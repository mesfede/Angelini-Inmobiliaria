import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AngeliniEmblem } from './Logo';

interface PreloaderProps {
  isLoading: boolean;
  minDisplayTimeMs?: number;
  onFinished?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  isLoading,
  minDisplayTimeMs = 1200,
  onFinished,
}) => {
  const [shouldShow, setShouldShow] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Iniciando plataforma...');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDisplayTimeMs);

    return () => clearTimeout(timer);
  }, [minDisplayTimeMs]);

  // Simulate smooth progressive loading stages
  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Cargando catálogo de propiedades...');
    }, 300);

    const t2 = setTimeout(() => {
      setProgress(80);
      setStatusText('Optimizando imágenes y mapa...');
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && minTimeElapsed) {
      setProgress(100);
      setStatusText('¡Bienvenido!');
      const hideTimer = setTimeout(() => {
        setShouldShow(false);
        if (onFinished) onFinished();
      }, 400);
      return () => clearTimeout(hideTimer);
    }
  }, [isLoading, minTimeElapsed, onFinished]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="angelini-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-[#041020] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Subtle Ambient Radial Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,130,55,0.15)_0%,rgba(4,16,32,0.95)_70%)] pointer-events-none" />

          {/* Center Content Container */}
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
            
            {/* Animated Logo Container with Glow & Outer Ring */}
            <div className="relative mb-6 flex items-center justify-center">
              {/* Outer Rotating Accent Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-dashed border-[#B08237]/40 pointer-events-none"
              />

              {/* Pulsing Backlight */}
              <motion.div
                animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#B08237]/25 blur-xl pointer-events-none"
              />

              {/* Core Angelini Emblem with Brown Bull and Blue Ground */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative z-10 shadow-2xl rounded-full"
              >
                <AngeliniEmblem sizeClass="w-20 h-20 sm:w-24 sm:h-24" />
              </motion.div>
            </div>

            {/* Brand Title & Typography */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="space-y-1.5 mb-8"
            >
              <h1 className="text-xl sm:text-2xl font-bold tracking-[0.18em] text-white font-['Playfair_Display','Libre_Baskerville',Georgia,serif] uppercase">
                Angelini
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#B08237] uppercase">
                Inmobiliaria
              </p>
            </motion.div>

            {/* Progress Bar & Status */}
            <div className="w-full max-w-[220px] space-y-2">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#B08237] via-[#D4A559] to-[#B08237] rounded-full"
                  initial={{ width: '10%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              <p className="text-[10px] text-[#dbdad8]/70 tracking-wider font-mono">
                {statusText}
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="absolute bottom-6 text-[10px] tracking-widest text-white/30 uppercase font-sans">
            Azul • Buenos Aires
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
