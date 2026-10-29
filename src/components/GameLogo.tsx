import React, { useId } from 'react';

interface GameLogoProps {
  size?: 'sm' | 'md' | 'lg';
  tagline?: string;
  tone?: 'light' | 'dark';
}

/**
 * JaveTalento emblem: a navy university seal with a gold rim, a gilded samán tree
 * (wide umbrella canopy over a branching trunk) and a small spark for "talent".
 */
export const GameLogo: React.FC<GameLogoProps> = ({ size = 'md', tagline, tone = 'light' }) => {
  // Unique ids so several logos on screen don't share gradient definitions
  const uid = useId().replace(/:/g, '');
  const gold = `jt-gold-${uid}`;
  const goldSoft = `jt-gold-soft-${uid}`;
  const navy = `jt-navy-${uid}`;

  return (
    <div className={`game-logo logo-${size} logo-${tone}`}>
      <svg className="game-logo-seal" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id={gold} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FBE7B5" />
            <stop offset="0.5" stopColor="#E2B866" />
            <stop offset="1" stopColor="#B07F2C" />
          </linearGradient>
          <linearGradient id={goldSoft} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F6DC9E" />
            <stop offset="1" stopColor="#C8963E" />
          </linearGradient>
          <radialGradient id={navy} cx="0.5" cy="0.38" r="0.65">
            <stop offset="0" stopColor="#1D4A7D" />
            <stop offset="1" stopColor="#0B2545" />
          </radialGradient>
        </defs>

        {/* Seal: gold rim, navy field, fine inner ring */}
        <circle cx="32" cy="32" r="31" fill={`url(#${gold})`} />
        <circle cx="32" cy="32" r="28.6" fill={`url(#${navy})`} />
        <circle
          cx="32"
          cy="32"
          r="25.8"
          fill="none"
          stroke={`url(#${goldSoft})`}
          strokeOpacity="0.55"
          strokeWidth="0.7"
          strokeDasharray="0.6 1.6"
          strokeLinecap="round"
        />

        <g transform="translate(32 33.6) scale(1.08) translate(-32 -32)">
          {/* Samán canopy: broad umbrella crown with a soft leafy edge */}
          <path
            d="M11.5 31.2C11.2 27.6 14 24.6 17.6 24.4C18.6 20.9 22.2 18.9 25.6 19.7C27.6 16.4 31.6 15.3 34.9 16.9C37.6 15.8 41 16.9 42.6 19.6C46.2 19.2 49.4 21.6 49.8 24.9C52.8 25.6 54.8 28.4 52.5 31.4C51.9 32.2 50.8 32.6 49.7 32.4C44.4 31.4 38.3 31 32 31C25.7 31 19.6 31.4 14.3 32.4C13 32.6 11.6 32.2 11.5 31.2Z"
            fill={`url(#${gold})`}
          />
          {/* Canopy underside shadow line for depth */}
          <path
            d="M15.5 31.6C20.6 30.7 26.2 30.3 32 30.3C37.8 30.3 43.4 30.7 48.5 31.6"
            fill="none"
            stroke="#0B2545"
            strokeOpacity="0.35"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Trunk and spreading branches */}
          <g fill="none" stroke={`url(#${gold})`} strokeLinecap="round" strokeLinejoin="round">
            <path d="M32 48.5C31.6 44.5 31.4 40.6 31.8 37.4" strokeWidth="2.8" />
            <path d="M31.8 38.2C29.9 35.6 26.6 33.6 22.4 32.4" strokeWidth="1.7" />
            <path d="M31.9 37.6C34 35.1 37.4 33.3 41.8 32.3" strokeWidth="1.7" />
            <path d="M31.8 36.6C31.2 35 30.4 33.6 29 32.4" strokeWidth="1.2" />
            <path d="M32 36.4C33.2 35 34.2 33.8 35.6 32.6" strokeWidth="1.2" />
          </g>

          {/* Ground line */}
          <path
            d="M20 49.2C24 48.4 28 48.1 32 48.1C36 48.1 40 48.4 44 49.2"
            fill="none"
            stroke={`url(#${gold})`}
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
        </g>

        {/* Talent spark */}
        <path
          d="M46.5 9.8L47.4 12.6L50.2 13.5L47.4 14.4L46.5 17.2L45.6 14.4L42.8 13.5L45.6 12.6Z"
          fill="#FBE7B5"
        />
      </svg>
      <div className="game-logo-text">
        <span className="game-logo-name">
          <span className="jave">Jave</span>
          <span className="talento">Talento</span>
        </span>
        {tagline && <span className="game-logo-tagline">{tagline}</span>}
      </div>
    </div>
  );
};
