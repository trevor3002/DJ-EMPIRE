import React from 'react';
import { Award, Disc3, Mic2, ShoppingBag, Globe2 } from 'lucide-react';
import { NavigationTab } from '../game/types';

interface BottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  hasUnclaimedAchievements?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  hasUnclaimedAchievements = false,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'CAREER', label: 'Career', icon: <Award className="w-5 h-5" /> },
    { id: 'PERFORM', label: 'Perform', icon: <Disc3 className="w-5 h-5" /> },
    { id: 'STUDIO', label: 'Studio', icon: <Mic2 className="w-5 h-5" /> },
    { id: 'SHOP', label: 'Shop', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'EMPIRE', label: 'Empire', icon: <Globe2 className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0817]/95 backdrop-blur-lg border-t border-purple-900/40 pb-safe">
      <div className="max-w-2xl mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-90 ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Notification dot for unclaimed achievements */}
              {tab.id === 'CAREER' && hasUnclaimedAchievements && (
                <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_6px_#ec4899]" />
              )}

              {/* Active Tab Ambient Glow Background */}
              {isActive && (
                <div className="absolute inset-x-2 top-1 bottom-1 bg-cyan-500/10 rounded-xl -z-10 border border-cyan-400/20" />
              )}

              <div
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110 text-cyan-300 drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]' : ''
                }`}
              >
                {tab.icon}
              </div>

              <span className="text-[11px] tracking-wide mt-1 uppercase leading-none">
                {tab.label}
              </span>

              {/* Bottom active pill underline */}
              {isActive && (
                <div className="absolute bottom-1 w-6 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f2fe]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
