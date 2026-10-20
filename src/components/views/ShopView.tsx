import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Headphones,
  Laptop,
  Sparkles,
  ArrowUpCircle,
  CheckCircle2,
  Disc3,
  Speaker,
} from 'lucide-react';
import { GameState, EquipmentCategory, Equipment } from '../../game/types';
import { formatRand } from '../HeaderHUD';

interface ShopViewProps {
  state: GameState;
  onUpgradeEquipment: (equipmentId: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ state, onUpgradeEquipment }) => {
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('decks');

  const categories: { id: EquipmentCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'decks', label: 'Controllers & Decks', icon: <Disc3 className="w-4 h-4" /> },
    { id: 'audio', label: 'Audio & Monitors', icon: <Headphones className="w-4 h-4" /> },
    { id: 'studio', label: 'Studio Hardware', icon: <Laptop className="w-4 h-4" /> },
    { id: 'lights', label: 'Stage Lasers & FX', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const filteredEquipment = state.equipment.filter((e) => e.category === activeCategory);

  return (
    <div className="space-y-4 pb-20">
      {/* Shop Category Navigation */}
      <div className="p-4 rounded-2xl bg-[#140e26] border border-white/10 shadow-lg space-y-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">DJ Pro Equipment Store</h2>
          <p className="text-xs text-slate-400">
            Upgrade your hardware to boost gig payouts, audience excitement & track speed
          </p>
        </div>

        {/* Category Pills/Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat.icon}
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Items List */}
      <div className="space-y-3">
        {filteredEquipment.map((item) => {
          const isMax = item.level >= item.maxLevel;
          const currentCost = Math.round(item.baseCost * Math.pow(item.costMultiplier, item.level));
          const canAfford = state.cash >= currentCost && !isMax;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.level > 0
                  ? 'bg-[#18112e] border-purple-500/30 shadow-md'
                  : 'bg-[#110a20] border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.name}</span>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                      Tier {item.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                {/* Level Tag */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-purple-300">
                    Lvl {item.level} / {item.maxLevel}
                  </div>
                </div>
              </div>

              {/* Benefit Indicator */}
              <div className="mt-3 p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.benefitText}</span>
                </div>

                {/* Upgrade Button */}
                {isMax ? (
                  <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MAX LEVEL</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onUpgradeEquipment(item.id)}
                    disabled={!canAfford}
                    className={`min-h-[42px] px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 ${
                      canAfford
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>
                      {item.level === 0
                        ? `Purchase (${formatRand(currentCost)})`
                        : `Upgrade (${formatRand(currentCost)})`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
