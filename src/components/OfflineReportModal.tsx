import React from 'react';
import { Sparkles, Coins, Flame, Disc, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfflineReport } from '../game/types';
import { formatRand, formatNumber } from './HeaderHUD';
import { sound } from '../audio/synth';

interface OfflineReportModalProps {
  report: OfflineReport;
  onDismiss: () => void;
}

export const OfflineReportModal: React.FC<OfflineReportModalProps> = ({ report, onDismiss }) => {
  const hours = Math.floor(report.secondsOffline / 3600);
  const minutes = Math.floor((report.secondsOffline % 3600) / 60);

  const handleCollect = () => {
    sound.playCashChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1c1236] to-[#0d071a] border border-cyan-400/50 p-6 shadow-[0_0_32px_rgba(0,242,254,0.3)] space-y-4">
        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto text-cyan-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-lg font-black text-white tracking-wide">WELCOME BACK, DJ!</h2>
          <p className="text-xs text-slate-400">
            Your empire continued generating revenue while you were away for{' '}
            <span className="text-purple-300 font-mono font-bold">
              {hours > 0 ? `${hours}h ` : ''}
              {minutes}m
            </span>
          </p>
        </div>

        {/* Offline Earnings Stats Breakdown */}
        <div className="space-y-2 rounded-2xl bg-black/40 border border-white/10 p-3.5 text-xs font-mono">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Coins className="w-4 h-4 text-cyan-400" />
              <span>Total Idle Earnings</span>
            </span>
            <span className="font-extrabold text-cyan-300 text-sm">
              {formatRand(report.cashEarned)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Flame className="w-4 h-4 text-purple-400" />
              <span>New Fans Gained</span>
            </span>
            <span className="font-bold text-purple-300">
              +{formatNumber(report.fansGained)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Disc className="w-4 h-4 text-pink-400" />
              <span>Streams Accumulated</span>
            </span>
            <span className="font-bold text-pink-300">
              +{formatNumber(report.streamsGenerated)}
            </span>
          </div>

          {report.performancesCompleted > 0 && (
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Automated Gigs</span>
              <span className="font-bold text-white">{report.performancesCompleted}</span>
            </div>
          )}
        </div>

        {/* Collect CTA */}
        <button
          onClick={handleCollect}
          className="w-full min-h-[50px] rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,242,254,0.4)] active:scale-95 transition-transform"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Collect {formatRand(report.cashEarned)}</span>
        </button>
      </div>
    </div>
  );
};
