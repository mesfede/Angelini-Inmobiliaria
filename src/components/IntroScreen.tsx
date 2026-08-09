import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-100 bg-white flex flex-col justify-between items-center p-6 sm:p-10 select-none overflow-hidden"
    >
      {/* Top spacer */}
      <div className="h-4" />

      {/* Center Logo */}
      <div className="flex flex-col items-center justify-center text-center my-auto px-4 max-w-sm w-full">
        <div className="flex items-center justify-center py-4">
          <Logo variant="dark" size="lg" />
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full max-w-sm flex flex-col items-center pb-10 sm:pb-14">
        <button
          onClick={onEnter}
          className="group relative py-2 px-4 transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 active:scale-95"
        >
          <span className="text-sm sm:text-base font-light tracking-[0.2em] text-zinc-700 group-hover:text-[#48A82D] transition-colors">
            descubrí la nueva web
          </span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4 text-[#48A82D] stroke-[1.5]" />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
};

