import React, { useState } from 'react';
import { Play, Sparkles, Disc, Radio, Flame } from 'lucide-react';
import { sound } from '../audio/synth';

interface TitleScreenProps {
  onStartGame: (djName: string) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  const [nameInput, setNameInput] = useState('DJ Nova');

  const handleStart = () => {
    sound.startMusic();
    sound.playLevelUp();
    onStartGame(nameInput.trim() || 'DJ Nova');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#110822] via-[#090514] to-[#04020a] text-white overflow-y-auto pt-safe pb-safe select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

      {/* Top Tagline */}
      <div className="text-center pt-4 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>IDLE MUSIC TYCOON</span>
        </div>
      </div>

      {/* Center Hero Lockup & Turntable Art */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 my-auto py-6">
        {/* Animated Turntable Art */}
        <div className="relative w-36 h-36 rounded-full bg-[#170e2f] border-4 border-cyan-400/40 p-2 shadow-[0_0_40px_rgba(0,242,254,0.35)] flex items-center justify-center">
          <div className="w-full h-full rounded-full border-2 border-purple-500/50 bg-[radial-gradient(#201242_40%,#0c061a_80%)] flex items-center justify-center animate-vinyl-spin">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center shadow-lg">
              <Disc className="w-5 h-5 text-black" />
            </div>
          </div>
          {/* Tone Arm */}
          <div className="absolute -top-2 right-2 w-8 h-14 border-r-4 border-t-4 border-slate-300 rounded-tr-xl pointer-events-none" />
        </div>

        {/* Title Lockup */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 drop-shadow-[0_0_24px_rgba(0,242,254,0.4)]">
            DJ EMPIRE
          </h1>
          <p className="text-xs uppercase font-extrabold tracking-widest text-cyan-300/80">
            From Bedroom to Mainstage
          </p>
        </div>

        {/* Career Starting Stats Badge */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-center">
            <div className="text-[10px] text-slate-400">Cash</div>
            <div className="font-bold text-cyan-300">R1,000</div>
          </div>
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-center">
            <div className="text-[10px] text-slate-400">Fans</div>
            <div className="font-bold text-purple-300">0</div>
          </div>
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-center">
            <div className="text-[10px] text-slate-400">Tracks</div>
            <div className="font-bold text-pink-300">1 Release</div>
          </div>
        </div>

        {/* DJ Stage Name Input */}
        <div className="w-full max-w-xs space-y-1 text-left">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Your DJ Stage Name
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            maxLength={18}
            className="w-full bg-black/60 border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-400 shadow-inner"
          />
        </div>
      </div>

      {/* Bottom Start CTA */}
      <div className="w-full max-w-xs relative z-10 pb-4">
        <button
          onClick={handleStart}
          className="w-full min-h-[52px] rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(0,242,254,0.5)] active:scale-95 transition-transform"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>START DJ CAREER</span>
        </button>
        <p className="text-[10px] text-center text-slate-500 mt-2">
          Tap start to activate audio synthesizer & begin idle mixing
        </p>
      </div>
    </div>
  );
};
