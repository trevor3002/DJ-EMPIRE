import React, { useState } from 'react';
import {
  Globe2,
  Users2,
  FileCheck,
  Package,
  Plane,
  Coins,
  CheckCircle2,
  Lock,
  Sparkles,
  MapPin,
  Building2,
} from 'lucide-react';
import { GameState } from '../../game/types';
import { formatRand, formatNumber } from '../HeaderHUD';

interface EmpireViewProps {
  state: GameState;
  onHireStaff: (staffId: string) => void;
  onSignLabel: (labelId: string) => void;
  onTravelToCity: (cityId: string) => void;
  onManufactureMerch: (merchId: string) => void;
  onUnlockMerch: (merchId: string) => void;
}

type EmpireSubTab = 'tour' | 'staff' | 'labels' | 'merch';

export const EmpireView: React.FC<EmpireViewProps> = ({
  state,
  onHireStaff,
  onSignLabel,
  onTravelToCity,
  onManufactureMerch,
  onUnlockMerch,
}) => {
  const [subTab, setSubTab] = useState<EmpireSubTab>('tour');

  return (
    <div className="space-y-4 pb-20">
      {/* Empire Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#170e2b] to-[#120822] border border-purple-500/30 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white tracking-wide">DJ Empire Management</h2>
          </div>
          <div className="text-xs font-mono text-purple-300 bg-purple-950/60 border border-purple-800/40 rounded-lg px-2.5 py-1">
            Global Fame: {formatNumber(state.fans)} Fans
          </div>
        </div>

        {/* Sub-tabs switcher */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/50 rounded-xl border border-white/5">
          <button
            onClick={() => setSubTab('tour')}
            className={`py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1 ${
              subTab === 'tour'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Tour</span>
          </button>
          <button
            onClick={() => setSubTab('staff')}
            className={`py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1 ${
              subTab === 'staff'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Staff</span>
          </button>
          <button
            onClick={() => setSubTab('labels')}
            className={`py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1 ${
              subTab === 'labels'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Labels</span>
          </button>
          <button
            onClick={() => setSubTab('merch')}
            className={`py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1 ${
              subTab === 'merch'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Merch</span>
          </button>
        </div>
      </div>

      {/* 1. WORLD TOUR */}
      {subTab === 'tour' && (
        <div className="space-y-3">
          {/* World Map Banner Art */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1c1236] to-[#0d071a] border border-cyan-500/20 text-center space-y-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#00f2fe_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />
            <h3 className="text-sm font-bold text-white relative z-10">International Tour Schedule</h3>
            <p className="text-xs text-slate-400 relative z-10">
              Fly between international festival capitals to perform stadium shows
            </p>
          </div>

          <div className="space-y-2.5">
            {state.worldTourCities.map((city) => {
              const canAfford = state.cash >= city.travelCost;
              return (
                <div
                  key={city.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    city.unlocked
                      ? 'bg-[#150f29] border-purple-500/30'
                      : 'bg-black/30 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-sm font-bold text-white">{city.name}</span>
                        <span className="text-[10px] text-purple-300 font-semibold bg-purple-950/60 px-2 py-0.5 rounded">
                          {city.country}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Festival: <span className="text-cyan-300">{city.festivalName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Stadium Cap: {formatNumber(city.stadiumCapacity)} · Reward: x{city.tourRewardMultiplier}
                      </div>
                    </div>

                    {city.unlocked ? (
                      <button
                        onClick={() => onTravelToCity(city.id)}
                        disabled={!canAfford}
                        className={`min-h-[44px] px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 ${
                          canAfford
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        <Plane className="w-4 h-4" />
                        <span>
                          {city.travelCost > 0
                            ? `Tour (${formatRand(city.travelCost)})`
                            : 'Home Gig (Free)'}
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-mono bg-amber-950/40 px-2 py-1 rounded-md border border-amber-800/40">
                        <Lock className="w-3 h-3" />
                        <span>{formatNumber(city.minFans)} Fans Req</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. STAFF & MANAGEMENT */}
      {subTab === 'staff' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#140e26] border border-white/10 space-y-1">
            <h3 className="text-sm font-bold text-white">Hire Professional Crew & Management</h3>
            <p className="text-xs text-slate-400">
              Staff provide passive automation, gig earnings bonuses, and rapid fan acquisition
            </p>
          </div>

          <div className="space-y-2.5">
            {state.staff.map((member) => {
              const canAfford = state.cash >= member.hireCost;
              return (
                <div
                  key={member.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    member.hired
                      ? 'bg-gradient-to-r from-[#170e2b] to-[#120822] border-cyan-500/40 shadow-sm'
                      : 'bg-[#110a20] border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-xl shrink-0">
                        {member.avatar}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{member.name}</span>
                          <span className="text-[10px] text-cyan-400 font-semibold">{member.role}</span>
                        </div>
                        <div className="text-xs font-semibold text-purple-300">
                          {member.perkTitle}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {member.perkDescription}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {member.hired ? (
                        <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Hired</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onHireStaff(member.id)}
                          disabled={!canAfford}
                          className={`min-h-[40px] px-3 rounded-xl font-bold text-xs transition-transform active:scale-95 ${
                            canAfford
                              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          Hire ({formatRand(member.hireCost)})
                        </button>
                      )}
                      <div className="text-[10px] font-mono text-slate-500 mt-1">
                        Salary: {formatRand(member.salaryPerSec)}/s
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RECORD LABELS & SPONSORS */}
      {subTab === 'labels' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#140e26] border border-white/10 space-y-1">
            <h3 className="text-sm font-bold text-white">Record Label Contracts</h3>
            <p className="text-xs text-slate-400">
              Sign with larger electronic record labels for huge cash advances & higher royalty shares
            </p>
          </div>

          <div className="space-y-2.5">
            {state.labels.map((label) => {
              const meetsFans = state.fans >= label.minFans;
              return (
                <div
                  key={label.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    label.signed
                      ? 'bg-gradient-to-r from-purple-950/80 to-[#120822] border-cyan-400/60 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                      : 'bg-[#110a20] border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{label.name}</span>
                        <span className="text-[10px] text-purple-300 font-mono">
                          Tier {label.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{label.description}</p>
                      <div className="flex items-center gap-2 text-[11px] font-mono pt-1">
                        <span className="text-cyan-300">
                          Royalties: x{label.royaltyRateMultiplier}
                        </span>
                        <span>·</span>
                        <span className="text-purple-300">
                          Bonus: {formatRand(label.signingBonus)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {label.signed ? (
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2 py-1 rounded-lg">
                          Active Contract
                        </span>
                      ) : meetsFans ? (
                        <button
                          onClick={() => onSignLabel(label.id)}
                          className="min-h-[40px] px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs shadow-md active:scale-95"
                        >
                          Sign Deal
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-mono bg-amber-950/40 px-2 py-1 rounded-md border border-amber-800/40">
                          <Lock className="w-3 h-3" />
                          <span>{formatNumber(label.minFans)} Fans Req</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MERCHANDISE STORE */}
      {subTab === 'merch' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#140e26] border border-white/10 space-y-1">
            <h3 className="text-sm font-bold text-white">DJ Merch Brand & Apparel</h3>
            <p className="text-xs text-slate-400">
              Produce inventory batches that sell automatically based on your fanbase demand
            </p>
          </div>

          <div className="space-y-2.5">
            {state.merch.map((item) => {
              const canAfford = state.cash >= item.batchCost;
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#150f29] border border-white/10 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">{item.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Sell Price: <span className="text-cyan-300 font-bold">{formatRand(item.sellPrice)}</span> · Cost: {formatRand(item.costToMake)}/unit
                      </div>
                    </div>

                    <button
                      onClick={() => onManufactureMerch(item.id)}
                      disabled={!canAfford}
                      className={`min-h-[40px] px-3 rounded-xl font-bold text-xs transition-transform active:scale-95 ${
                        canAfford
                          ? 'bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/60 text-purple-200'
                          : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      Make Batch ({formatRand(item.batchCost)})
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-black/40">
                      <span className="text-slate-500">In Stock:</span>{' '}
                      <span className="font-bold text-white">{item.stock} units</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40">
                      <span className="text-slate-500">Total Sold:</span>{' '}
                      <span className="font-bold text-cyan-300">{item.totalSold}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
