import React from 'react';
import { DuckAccessory } from '../types';

interface DuckSpriteProps {
  color?: string;
  accessory?: DuckAccessory;
  wobble?: number;
  isBoosting?: boolean;
  quacking?: boolean;
  size?: number;
  className?: string;
}

export const DuckSprite: React.FC<DuckSpriteProps> = ({
  color = '#FACC15',
  accessory = 'none',
  wobble = 0,
  isBoosting = false,
  quacking = false,
  size = 64,
  className = '',
}) => {
  const rotation = wobble * 8; // gentle rocking
  const wingRotation = isBoosting ? Math.sin(Date.now() / 80) * 25 : Math.sin(Date.now() / 200) * 10;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Water ripple gradient */}
          <linearGradient id={`waterGrad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
          </linearGradient>

          {/* Duck body shading */}
          <linearGradient id={`duckShade-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="60%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Water Ripple trail when swimming */}
        <ellipse
          cx="48"
          cy="85"
          rx={isBoosting ? 44 : 36}
          ry="7"
          fill="#38bdf8"
          opacity={isBoosting ? '0.6' : '0.4'}
          className={isBoosting ? 'animate-pulse' : ''}
        />
        <ellipse
          cx="42"
          cy="85"
          rx="24"
          ry="4"
          fill="#ffffff"
          opacity="0.7"
        />

        {/* Tail feathers */}
        <path
          d="M 12 55 Q 2 45 10 38 Q 20 46 25 54 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Main Body */}
        <path
          d="M 22 55 C 18 75 42 85 68 82 C 84 80 88 68 84 56 C 80 46 68 45 54 48 C 36 50 25 45 22 55 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        {/* Soft body gradient overlay */}
        <path
          d="M 22 55 C 18 75 42 85 68 82 C 84 80 88 68 84 56 C 80 46 68 45 54 48 C 36 50 25 45 22 55 Z"
          fill={`url(#duckShade-${color.replace('#', '')})`}
        />

        {/* Duck Head */}
        <circle
          cx="68"
          cy="36"
          r="20"
          fill={color}
          stroke="#000000"
          strokeWidth="2.8"
        />
        {/* Head highlight */}
        <ellipse
          cx="64"
          cy="26"
          rx="8"
          ry="4"
          fill="#ffffff"
          opacity="0.35"
        />

        {/* Cheeks - rosy blush */}
        <circle cx="68" cy="44" r="4.5" fill="#f43f5e" opacity="0.45" />

        {/* Eye */}
        <circle cx="73" cy="32" r="4" fill="#0f172a" />
        <circle cx="74.5" cy="30.5" r="1.5" fill="#ffffff" />

        {/* Beak / Mỏ vịt */}
        {quacking ? (
          // Open quacking beak
          <g>
            <path
              d="M 84 32 Q 99 28 97 37 Q 88 40 85 41 Z"
              fill="#fb923c"
              stroke="#000000"
              strokeWidth="2"
            />
            <path
              d="M 85 41 Q 95 44 91 48 Q 82 46 80 42 Z"
              fill="#ea580c"
              stroke="#000000"
              strokeWidth="2"
            />
          </g>
        ) : (
          // Normal cute beak
          <path
            d="M 84 33 Q 98 34 96 42 Q 87 47 80 41 Z"
            fill="#fb923c"
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        )}

        {/* Wing / Cánh vịt */}
        <g
          transform={`translate(42, 60) rotate(${wingRotation}) translate(-42, -60)`}
          className="transition-transform duration-75"
        >
          <path
            d="M 30 58 C 30 50 48 48 56 55 C 62 60 58 72 46 72 C 36 72 30 66 30 58 Z"
            fill="#f59e0b"
            stroke="#000000"
            strokeWidth="2.4"
          />
          {/* Feather line */}
          <path
            d="M 38 60 Q 48 64 54 59"
            stroke="#000000"
            strokeWidth="1.8"
            fill="none"
          />
        </g>

        {/* ACCESSORIES */}
        {accessory === 'crown' && (
          <g transform="translate(62, 10)">
            <path
              d="M 0 10 L 4 0 L 9 6 L 14 0 L 18 10 Z"
              fill="#facc15"
              stroke="#b45309"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="4" cy="1" r="1.5" fill="#ef4444" />
            <circle cx="9" cy="6" r="1.5" fill="#3b82f6" />
            <circle cx="14" cy="1" r="1.5" fill="#ef4444" />
          </g>
        )}

        {accessory === 'sunglasses' && (
          <g transform="translate(67, 30)">
            {/* Sunglasses frame */}
            <path
              d="M 0 2 L 6 0 L 16 1 L 22 4 L 18 9 L 6 8 Z"
              fill="#0f172a"
              stroke="#000000"
              strokeWidth="1.5"
            />
            {/* Lens reflection */}
            <path d="M 4 3 L 8 1" stroke="#38bdf8" strokeWidth="1.5" />
            <path d="M 12 4 L 15 3" stroke="#38bdf8" strokeWidth="1.5" />
          </g>
        )}

        {accessory === 'cap' && (
          <g transform="translate(56, 14)">
            {/* Baseball cap */}
            <path
              d="M 4 10 C 6 2 24 2 26 10 Z"
              fill="#ef4444"
              stroke="#000000"
              strokeWidth="2"
            />
            {/* Visor */}
            <path
              d="M 20 10 Q 32 9 32 14 Q 24 14 20 10"
              fill="#dc2626"
              stroke="#000000"
              strokeWidth="1.8"
            />
            <circle cx="15" cy="4" r="2" fill="#facc15" />
          </g>
        )}

        {accessory === 'flower' && (
          <g transform="translate(54, 18)">
            <circle cx="6" cy="2" r="3" fill="#ec4899" />
            <circle cx="2" cy="6" r="3" fill="#ec4899" />
            <circle cx="10" cy="6" r="3" fill="#ec4899" />
            <circle cx="6" cy="10" r="3" fill="#ec4899" />
            <circle cx="6" cy="6" r="2.5" fill="#facc15" />
          </g>
        )}

        {accessory === 'bow' && (
          <g transform="translate(68, 52)">
            {/* Bowtie on neck */}
            <polygon points="0,0 8,-5 8,5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
            <polygon points="16,0 8,-5 8,5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
            <circle cx="8" cy="0" r="2.5" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />
          </g>
        )}

        {/* Speed / Boost Flames behind tail when boosting */}
        {isBoosting && (
          <g transform="translate(0, 52)">
            <path
              d="M 8 2 Q -12 6 2 12 Q -8 18 10 20 Z"
              fill="#f97316"
              className="animate-pulse"
            />
            <path
              d="M 6 5 Q -6 8 3 12 Q -3 15 8 16 Z"
              fill="#facc15"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
