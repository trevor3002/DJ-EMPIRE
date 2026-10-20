import React from 'react';
import { Volume2, VolumeX, Download, Flame } from 'lucide-react';
import { GameState } from '../game/types';
import { CAREER_RANKS } from '../game/constants';

interface HeaderHUDProps {
  state: GameState;
  onToggleSound: () => void;
  onOpenInstall: () => void;
  isInstallable: boolean;
}

export function formatRand(amount: number): string {
  if (amount >= 1_000_000_000) {
    return 'R' + (amount / 1_000_000_000).toFixed(2) + 'B';
  }
  if (amount >= 1_000_000) {
    return 'R' + (amount / 1_000_000).toFixed(2) + 'M';
  }
  if (amount >= 10_000) {
    return 'R' + (amount / 1_000).toFixed(1) + 'K';
  }
  return 'R' + Math.floor(amount).toLocaleString();
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 10_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return Math.floor(num).toLocaleString();
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  state,
  onToggleSound,
  onOpenInstall,
  isInstallable,
}) => {
  const currentRank = CAREER_RANKS[state.careerRankIndex] || CAREER_RANKS[0];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0e0a1a]/90 backdrop-blur-md border-b border-purple-900/30 px-3 py-2 pt-safe">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Cash Balance Display */}
        <div className="flex items-center gap-2 bg-[#17122a] border border-cyan-500/30 rounded-xl px-3 py-1.5 shadow-[0_0_12px_rgba(0,242,254,0.15)]">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
            R
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-cyan-300/70 leading-none">
              Cash
            </div>
            <div className="text-sm font-extrabold text-cyan-300 font-mono tabular-nums leading-tight">
              {formatRand(state.cash)}
            </div>
          </div>
        </div>

        {/* Fan Count Display */}
        <div className="flex items-center gap-2 bg-[#17122a] border border-purple-500/30 rounded-xl px-3 py-1.5 shadow-[0_0_12px_rgba(139,92,246,0.15)]">
          <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-purple-300/70 leading-none">
              Fans
            </div>
            <div className="text-sm font-extrabold text-purple-300 font-mono tabular-nums leading-tight">
              {formatNumber(state.fans)}
            </div>
          </div>
        </div>

        {/* Current Rank Badge & Sound / PWA Controls */}
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1 bg-[#1a1433] border border-white/10 rounded-xl px-2.5 py-1.5">
            <span className="text-sm">{currentRank.badge}</span>
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[90px]">
              {currentRank.title}
            </span>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={state.musicEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className={`min-w-[42px] min-h-[42px] rounded-xl flex items-center justify-center border transition-all active:scale-95 ${
              state.musicEnabled
                ? 'bg-purple-600/30 border-purple-500/60 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            {state.musicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* PWA Install Trigger */}
          {isInstallable && (
            <button
              onClick={onOpenInstall}
              title="Install DJ Empire PWA"
              className="min-w-[42px] min-h-[42px] rounded-xl flex items-center justify-center bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 transition-all active:scale-95 hover:bg-cyan-500/30"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
