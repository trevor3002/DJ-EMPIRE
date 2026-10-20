import React, { useState, useEffect } from 'react';
import { Zap, Radio } from 'lucide-react';
import { Venue } from '../game/types';

interface DJBoothVisualProps {
  venue: Venue;
  isGigActive: boolean;
  audienceExcitement: number;
  onTriggerDrop: () => void;
  djName: string;
}

export const DJBoothVisual: React.FC<DJBoothVisualProps> = ({
  venue,
  isGigActive,
  audienceExcitement,
  onTriggerDrop,
  djName,
}) => {
  const [vuHeights, setVuHeights] = useState<number[]>([40, 65, 80, 50, 90, 75, 45, 60]);
  const [isDropEffect, setIsDropEffect] = useState(false);

  // Animate VU meters when gig is active
  useEffect(() => {
    if (!isGigActive) {
      setVuHeights([15, 20, 25, 20, 15, 20, 15, 20]);
      return;
    }

    const interval = setInterval(() => {
      setVuHeights(
        Array.from({ length: 10 }, () => Math.floor(Math.random() * 65) + 35)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isGigActive]);

  const handleDropClick = () => {
    setIsDropEffect(true);
    onTriggerDrop();
    setTimeout(() => setIsDropEffect(false), 800);
  };

  const isHighTier = venue.tier >= 6;
  const isFestival = venue.tier >= 8;

  return (
    <div className="relative w-full aspect-[16/11] max-h-[340px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#130b24] via-[#0b0717] to-[#06040d] border border-purple-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none">
      {/* Background Lighting & Lasers */}
      {isGigActive && (
        <>
          {/* Laser beam 1 (Cyan) */}
          <div className="absolute inset-x-0 bottom-1/3 h-64 origin-bottom pointer-events-none opacity-60 animate-laser-1">
            <div className="w-1.5 h-full mx-auto bg-gradient-to-t from-transparent via-cyan-400 to-cyan-200 shadow-[0_0_15px_#00f2fe]" />
          </div>

          {/* Laser beam 2 (Magenta) */}
          <div className="absolute inset-x-0 bottom-1/3 h-64 origin-bottom pointer-events-none opacity-60 animate-laser-2">
            <div className="w-1.5 h-full mx-auto bg-gradient-to-t from-transparent via-pink-500 to-pink-200 shadow-[0_0_15px_#ec4899]" />
          </div>

          {/* Strobe flash on drops */}
          {isDropEffect && (
            <div className="absolute inset-0 bg-white/35 z-20 pointer-events-none animate-strobe" />
          )}

          {/* Ambient Bass Bloom */}
          <div
            className={`absolute top-0 inset-x-0 h-32 bg-radial from-purple-600/30 via-pink-500/10 to-transparent transition-opacity duration-300 pointer-events-none ${
              audienceExcitement > 75 ? 'opacity-100' : 'opacity-40'
            }`}
          />
        </>
      )}

      {/* Stage Backdrop Visuals by Venue Tier */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-start pt-3">
        {/* Venue Location & Stage Banner */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-semibold text-slate-300 backdrop-blur-sm">
          <Radio className={`w-3 h-3 ${isGigActive ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
          <span className="uppercase tracking-wider">{venue.name}</span>
          <span className="text-white/40">·</span>
          <span className="text-cyan-400 font-mono text-[10px]">{venue.location}</span>
        </div>

        {/* LED Stage Screen (Mid-ground) */}
        <div className="mt-2 w-3/4 h-24 rounded-xl border border-cyan-500/20 bg-gradient-to-b from-[#181033] to-[#0c081a] relative overflow-hidden flex flex-col items-center justify-center p-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          {/* LED Grid effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6px_6px]" />
          
          <div className="relative text-center z-10">
            <span className="text-xs uppercase tracking-widest text-pink-400 font-extrabold drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
              {djName}
            </span>
            <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">
              {isGigActive ? (isFestival ? '★ MAINSTAGE LIVE ★' : 'LIVE IN THE MIX') : 'BOOTH STANDBY'}
            </div>
          </div>

          {/* Equalizer Spectrum Bars on LED wall */}
          <div className="absolute bottom-1 inset-x-4 h-6 flex items-end justify-between gap-1 opacity-80">
            {vuHeights.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={`w-full rounded-t-sm transition-all duration-100 ${
                  h > 75
                    ? 'bg-gradient-to-t from-pink-500 to-yellow-400'
                    : 'bg-gradient-to-t from-cyan-500 to-purple-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DJ Character SVG & Turntable Mixing Console */}
      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center z-10 pointer-events-none">
        {/* DJ Head & Headphones */}
        <div className={`relative mb-[-12px] z-10 ${isGigActive ? 'animate-bounce' : ''}`} style={{ animationDuration: '0.6s' }}>
          {/* Head */}
          <div className="w-12 h-12 rounded-full bg-[#f6c8a4] border-2 border-black/80 relative shadow-md">
            {/* Sunglasses / Cyber Visor */}
            <div className="absolute top-4 inset-x-1 h-3 rounded-sm bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_8px_#00f2fe]" />
            {/* Smile / Mouth */}
            <div className="absolute bottom-2.5 left-4 right-4 h-1 rounded-full bg-slate-800" />
          </div>

          {/* Neon Headphones */}
          <div className="absolute -top-1.5 -inset-x-2 h-7 rounded-t-full border-t-4 border-cyan-400 pointer-events-none shadow-[0_0_8px_#00f2fe]" />
          <div className="absolute top-3 -left-3 w-3.5 h-6 rounded-md bg-purple-600 border border-cyan-400 shadow-[0_0_6px_#a855f7]" />
          <div className="absolute top-3 -right-3 w-3.5 h-6 rounded-md bg-pink-600 border border-cyan-400 shadow-[0_0_6px_#ec4899]" />
        </div>

        {/* DJ Mixing Console SVG */}
        <div className="w-[88%] max-w-[420px] h-20 bg-gradient-to-b from-[#22173d] to-[#120b22] rounded-t-2xl border-t border-x border-cyan-500/40 p-2 shadow-[0_-4px_24px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2">
          {/* Deck A (Turntable / Platter) */}
          <div className="relative w-16 h-16 rounded-full bg-[#0a0713] border-2 border-[#3b2d66] flex items-center justify-center shadow-inner">
            <div
              className={`w-14 h-14 rounded-full border border-purple-500/40 flex items-center justify-center bg-[radial-gradient(#18112e_40%,#090514_70%)] ${
                isGigActive ? 'animate-vinyl-spin' : ''
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-cyan-400/80 flex items-center justify-center shadow-[0_0_6px_#00f2fe]">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
              </div>
            </div>
            {/* Tone arm */}
            <div className="absolute top-1 right-1 w-5 h-8 border-r-2 border-t-2 border-slate-400 rounded-tr-md pointer-events-none" />
          </div>

          {/* Center Mixer (Faders, Knobs & Crossfader) */}
          <div className="flex-1 h-full bg-[#18112c] rounded-xl border border-white/10 px-2 py-1 flex flex-col justify-between">
            {/* Channel Level Meters */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((k) => (
                  <div key={k} className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500" />
                ))}
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 h-3 rounded-xs ${
                      isGigActive && bar <= Math.ceil(audienceExcitement / 20)
                        ? bar > 3
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Horizontal Crossfader */}
            <div className="relative w-full h-3 bg-black/60 rounded-full border border-white/10 flex items-center px-1">
              <div
                className={`w-3.5 h-4.5 rounded-sm bg-gradient-to-b from-cyan-400 to-cyan-600 shadow-[0_0_6px_#00f2fe] transition-all duration-300 ${
                  isGigActive ? 'translate-x-12' : 'translate-x-4'
                }`}
              />
            </div>
          </div>

          {/* Deck B (Turntable / Platter) */}
          <div className="relative w-16 h-16 rounded-full bg-[#0a0713] border-2 border-[#3b2d66] flex items-center justify-center shadow-inner">
            <div
              className={`w-14 h-14 rounded-full border border-purple-500/40 flex items-center justify-center bg-[radial-gradient(#18112e_40%,#090514_70%)] ${
                isGigActive ? 'animate-vinyl-spin' : ''
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-pink-500/80 flex items-center justify-center shadow-[0_0_6px_#ec4899]">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
              </div>
            </div>
            {/* Tone arm */}
            <div className="absolute top-1 left-1 w-5 h-8 border-l-2 border-t-2 border-slate-400 rounded-tl-md pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Dancing Crowd Silhouettes (Foreground) */}
      <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none overflow-hidden flex items-end justify-between px-2 opacity-85 z-20">
        <svg
          viewBox="0 0 400 40"
          className={`w-full h-full fill-black ${
            isGigActive ? (audienceExcitement > 75 ? 'animate-crowd-fast' : 'animate-crowd-bounce') : ''
          }`}
          preserveAspectRatio="none"
        >
          {/* Stylized crowd hands and heads silhouette */}
          <path d="M0,40 L0,28 C10,24 15,30 20,22 C25,12 28,15 32,25 C38,18 45,15 50,22 C55,10 60,8 65,20 C70,14 78,16 85,25 C92,10 98,6 105,18 C112,12 118,22 125,25 C132,14 138,8 145,16 C152,10 158,14 165,22 C172,12 178,6 185,15 C192,8 198,12 205,24 C212,10 218,6 225,18 C232,12 238,20 245,26 C252,14 258,8 265,16 C272,8 278,14 285,24 C292,12 298,8 305,19 C312,14 318,22 325,26 C332,10 338,6 345,16 C352,12 358,18 365,24 C372,14 378,8 385,20 C392,16 398,22 400,28 L400,40 Z" />
        </svg>
      </div>

      {/* Interactive Quick Hype Trigger Button (Bottom-Right overlay) */}
      {isGigActive && (
        <button
          onClick={handleDropClick}
          className="absolute bottom-3 right-3 z-30 min-h-[44px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_16px_rgba(236,72,153,0.6)] active:scale-95 transition-transform"
        >
          <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300 animate-pulse" />
          <span>DROP!</span>
        </button>
      )}

      {/* Excitement Hype Bar Badge (Top-Right overlay) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 border border-purple-500/30 backdrop-blur-md">
        <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">Hype</span>
        <span className="text-xs font-mono font-bold text-cyan-300 tabular-nums">
          {Math.round(audienceExcitement)}%
        </span>
      </div>
    </div>
  );
};
