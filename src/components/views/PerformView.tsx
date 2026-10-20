import React, { useState } from 'react';
import { Play, Pause, ArrowUpCircle, Lock, Users, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { GameState, Venue } from '../../game/types';
import { DJBoothVisual } from '../DJBoothVisual';
import { formatRand, formatNumber } from '../HeaderHUD';

interface PerformViewProps {
  state: GameState;
  onStartGig: (venueId?: string) => void;
  onStopGig: () => void;
  onSelectVenue: (venueId: string) => void;
  onUpgradeVenue: (venueId: string) => void;
  onTriggerDrop: () => void;
}

export const PerformView: React.FC<PerformViewProps> = ({
  state,
  onStartGig,
  onStopGig,
  onSelectVenue,
  onUpgradeVenue,
  onTriggerDrop,
}) => {
  const currentVenue = state.venues.find((v) => v.id === state.currentVenueId) || state.venues[0];
  const hasAutoDj = state.staff.find((s) => s.id === 'staff_assistant')?.hired;
  const progressRatio = Math.min(1, state.gigElapsedSeconds / currentVenue.durationSeconds);
  const remainingSeconds = Math.max(0, Math.ceil(currentVenue.durationSeconds - state.gigElapsedSeconds));

  const [selectedVenueTab, setSelectedVenueTab] = useState<'current' | 'all'>('current');

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Interactive DJ Booth & Visualizer */}
      <DJBoothVisual
        venue={currentVenue}
        isGigActive={state.isGigActive}
        audienceExcitement={state.audienceExcitement}
        onTriggerDrop={onTriggerDrop}
        djName={state.djName}
      />

      {/* 2. Active Gig Status Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#18112c] to-[#100a20] border border-purple-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-base font-bold text-white tracking-wide">{currentVenue.name}</h2>
          </div>
          <div className="text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/40 rounded-lg px-2.5 py-1">
            Tier {currentVenue.tier} · Lvl {currentVenue.level}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">
              {state.isGigActive ? `Remaining: ${remainingSeconds}s` : 'Status: Idle'}
            </span>
            <span className="font-mono font-bold text-cyan-300">
              {Math.round(progressRatio * 100)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/60 border border-white/10 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-200 rounded-full shadow-[0_0_12px_#00f2fe]"
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>
        </div>

        {/* Potential Gig Rewards Strip */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Payout</span>
            <span className="font-extrabold text-cyan-300 font-mono">
              {formatRand(currentVenue.basePayout * (1 + (currentVenue.level - 1) * 0.35))}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-400">Fan Gain</span>
            <span className="font-extrabold text-purple-300 font-mono">
              +{formatNumber(currentVenue.fanGain * (1 + (currentVenue.level - 1) * 0.35))}
            </span>
          </div>
        </div>

        {/* Automated Assistant Status */}
        {hasAutoDj && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Assistant active: Gigs are booked & collected automatically!</span>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-1">
          {state.isGigActive ? (
            <button
              onClick={onStopGig}
              className="w-full min-h-[48px] rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 active:scale-[0.98] transition-transform"
            >
              <Pause className="w-4 h-4 text-slate-400" />
              <span>Pause Gig</span>
            </button>
          ) : (
            <button
              onClick={() => onStartGig(currentVenue.id)}
              disabled={state.cash < currentVenue.bookingFee}
              className={`w-full min-h-[50px] rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] ${
                state.cash >= currentVenue.bookingFee
                  ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white shadow-[0_0_20px_rgba(0,242,254,0.4)]'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {currentVenue.bookingFee > 0
                  ? `Start Gig (${formatRand(currentVenue.bookingFee)} Fee)`
                  : 'Start Free Livestream'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Venue Management & Upgrade Section */}
      <div className="p-4 rounded-2xl bg-[#140e26] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Venues & Club Roster</h3>
            <p className="text-xs text-slate-400">Unlock bigger venues as your reputation grows</p>
          </div>
          <div className="text-xs font-mono text-purple-300 font-semibold bg-purple-900/30 px-2 py-1 rounded-lg border border-purple-700/40">
            Rep: {state.reputation}
          </div>
        </div>

        {/* Venue Cards List */}
        <div className="space-y-2.5">
          {state.venues.map((venue) => {
            const isSelected = venue.id === state.currentVenueId;
            const canAffordUpgrade = state.cash >= venue.capacityUpgradeCost;

            return (
              <div
                key={venue.id}
                className={`p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-950/60 to-slate-900/80 border-cyan-400/60 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                    : venue.unlocked
                    ? 'bg-[#18112e]/70 border-white/10 hover:border-white/20'
                    : 'bg-black/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{venue.name}</span>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {venue.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-purple-400" />
                        Cap: {formatNumber(venue.baseAudience)}
                      </span>
                    </div>
                  </div>

                  {/* Booking / Switch Affordance */}
                  {venue.unlocked ? (
                    !isSelected && (
                      <button
                        onClick={() => onSelectVenue(venue.id)}
                        className="min-h-[40px] px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-semibold text-xs active:scale-95"
                      >
                        Select
                      </button>
                    )
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-mono bg-amber-950/40 px-2 py-1 rounded-md border border-amber-800/40">
                      <Lock className="w-3 h-3" />
                      <span>{venue.minReputation} Rep Req</span>
                    </div>
                  )}
                </div>

                {/* Venue stats & Upgrade Button (if unlocked) */}
                {venue.unlocked && (
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-400 font-mono">
                      Payout: <span className="text-cyan-300 font-bold">{formatRand(venue.basePayout)}</span> · Duration: {venue.durationSeconds}s
                    </div>

                    <button
                      onClick={() => onUpgradeVenue(venue.id)}
                      disabled={!canAffordUpgrade}
                      className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95 ${
                        canAffordUpgrade
                          ? 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/60 text-purple-200'
                          : 'bg-slate-800/60 border border-slate-700/40 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5 text-purple-400" />
                      <span>Upgrade ({formatRand(venue.capacityUpgradeCost)})</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
