import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'color'; // dark: dark/black text, light: white text, color: gold text (#946E00)
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
}) => {
  // Sizing definitions
  const sizeConfigs = {
    sm: {
      svgHeight: 'h-2 sm:h-2.5',
      mainTextSize: 'text-xs sm:text-sm',
      subtextSize: 'text-[5.5px] sm:text-[7px]',
      gap: 'gap-0',
    },
    md: {
      svgHeight: 'h-2.5 sm:h-3',
      mainTextSize: 'text-lg sm:text-xl md:text-2xl',
      subtextSize: 'text-[9px] sm:text-[10px]',
      gap: 'gap-0',
    },
    lg: {
      svgHeight: 'h-3 sm:h-4',
      mainTextSize: 'text-xl sm:text-2xl md:text-3xl',
      subtextSize: 'text-[10px] sm:text-[11px]',
      gap: 'gap-0.5',
    },
    xl: {
      svgHeight: 'h-4 sm:h-5',
      mainTextSize: 'text-2xl sm:text-3xl md:text-4xl',
      subtextSize: 'text-[11px] sm:text-[13px]',
      gap: 'gap-0.5',
    },
  };

  const config = sizeConfigs[size];

  const textColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'color'
      ? 'text-[#946E00]'
      : 'text-[#181818]';

  const subtextColor =
    variant === 'light'
      ? 'text-zinc-100'
      : variant === 'color'
      ? 'text-[#7A5B00]'
      : 'text-zinc-600';

  const iconColor =
    variant === 'light'
      ? '#FFFFFF'
      : '#946E00';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* SVG House Icon matching Silvio Ciuffardi Logo */}
      <div className="flex flex-col justify-center items-center shrink-0">
        <div className={`flex flex-col items-center ${config.gap}`}>
          <svg
            viewBox="0 3 100 29"
            className={`w-auto ${config.svgHeight} object-contain`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left roof line (diagonal thin stroke) */}
            <line x1="21" y1="27" x2="50" y2="4" stroke={iconColor} strokeWidth="3" strokeLinecap="round" />
            
            {/* Chimney (solid vertical block) */}
            <rect x="29" y="8" width="4.5" height="11" fill={iconColor} />
            
            {/* Right roof slab (solid filled polygon/parallelepiped) */}
            <polygon points="50,4 78,25 74,29 50,11" fill={iconColor} />
            
            {/* Window (4 small solid square panes in a 2x2 grid) */}
            <rect x="42.5" y="16" width="6" height="6" fill={iconColor} />
            <rect x="51.5" y="16" width="6" height="6" fill={iconColor} />
            <rect x="42.5" y="25" width="6" height="6" fill={iconColor} />
            <rect x="51.5" y="25" width="6" height="6" fill={iconColor} />
          </svg>
          
          {/* Typography */}
          <div className="text-center leading-none">
            <span className={`block font-['Quicksand',sans-serif] tracking-tight font-bold whitespace-nowrap ${config.mainTextSize} ${textColor}`}>
              Silvio Ciuffardi
            </span>
            <span className={`block font-['Quicksand',sans-serif] tracking-[0.25em] font-medium text-center mt-0 uppercase ${config.subtextSize} ${subtextColor}`}>
              Inmobiliaria
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};



