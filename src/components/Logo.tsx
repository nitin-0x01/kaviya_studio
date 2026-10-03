import React from 'react';
import { Link } from 'react-router-dom';

export interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  logoUrl?: string;
  showText?: boolean;
  linkToHome?: boolean;
  collapsed?: boolean;
  customHeight?: number;
  alt?: string;
}

export const OFFICIAL_LOGO_PATH = '/images/kaviya-studio-logo.jpg';
export const ORIGINAL_LOGO_BACKUP_PATH = '/images/kaviya-studio-logo-original.jpg';

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  logoUrl,
  showText = false,
  linkToHome = false,
  collapsed = false,
  customHeight,
  alt = 'Kaviya Studio official logo',
}) => {
  // Use provided logoUrl or default to official brand asset
  const activeLogo = logoUrl && logoUrl.trim() !== '' ? logoUrl : OFFICIAL_LOGO_PATH;

  // Responsive, proportion-preserving sizing classes
  const sizeClasses = {
    xs: 'h-7 max-w-[120px]',
    sm: 'h-9 sm:h-10 max-w-[150px]',
    md: 'h-11 sm:h-12 md:h-14 max-w-[200px]',
    lg: 'h-16 sm:h-20 max-w-[260px]',
    xl: 'h-24 sm:h-28 max-w-[340px]',
  };

  const collapsedSizeClasses = {
    xs: 'h-7 w-7',
    sm: 'h-9 w-9',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };

  const imageElement = (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      style={customHeight ? { height: `${customHeight}px` } : undefined}
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded transition-transform duration-300 ${
          collapsed
            ? `${collapsedSizeClasses[size]} bg-[#121218] border border-[#2b2b3a]/50 p-0.5`
            : ''
        }`}
      >
        <img
          src={activeLogo}
          alt={alt}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`${
            customHeight ? 'h-full w-auto' : collapsed ? 'w-full h-full' : sizeClasses[size]
          } object-contain transition-opacity duration-300`}
          onError={(e) => {
            // Graceful fallback to original backup if active logo fails
            const target = e.target as HTMLImageElement;
            if (target.src !== ORIGINAL_LOGO_BACKUP_PATH) {
              target.src = ORIGINAL_LOGO_BACKUP_PATH;
            }
          }}
        />
      </div>

      {showText && !collapsed && (
        <div className="flex flex-col justify-center">
          <span
            className="font-serif tracking-[0.24em] uppercase font-semibold text-[#f5eedc] text-sm sm:text-base leading-tight"
            style={{ fontFamily: 'var(--font-display, Cinzel, serif)' }}
          >
            Kaviya Studio
          </span>
          <span className="tracking-[0.28em] uppercase text-[#c5a059] font-medium text-[9px] sm:text-[10px] leading-tight mt-0.5">
            Janakpur · Nepal
          </span>
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link
        to="/"
        className="group inline-flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a059] rounded"
        title="Kaviya Studio - Return to Homepage"
      >
        {imageElement}
      </Link>
    );
  }

  return imageElement;
};
