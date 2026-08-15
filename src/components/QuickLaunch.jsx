/**
 * ==========================================
 * COMPONENT: QuickLaunch
 * ==========================================
 * The large hero section containing the grid of your app/website shortcuts.
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { LaunchTile } from './LaunchTile';
import { Plus, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const QuickLaunch = ({ links, onOpenLink, onAddLink, onEditLink, onDeleteLink })=>{
    const [activeCategory, setActiveCategory] = useState('all');
    const { isDark } = useTheme();
    const categories = [
        {
            id: 'all',
            label: 'ALL'
        },
        {
            id: 'work',
            label: 'WORK'
        },
        {
            id: 'dev',
            label: 'DEV'
        },
        {
            id: 'social',
            label: 'SOCIAL'
        },
        {
            id: 'creative',
            label: 'CREATIVE'
        },
        {
            id: 'personal',
            label: 'PERSONAL'
        }
    ];
    const filteredLinks = links.filter((link)=>activeCategory === 'all' || link.category === activeCategory);
    return <div className={`p-4 sm:p-6 flex flex-col justify-between h-full relative transition-colors ${isDark ? 'bg-[#18181B] text-white' : 'bg-[#FFFFFF] text-[#171717]'}`}>
      { /* Block Header */ }
      <div className={`flex flex-wrap items-center justify-between gap-3 mb-5 border-b-2 pb-4 ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
        <div className="flex items-center gap-2">
          <div className="bg-[#171717] text-[#F25C23] p-1.5 rounded-md border border-[#3F3F46]">
            <Zap className="w-5 h-5 fill-[#F25C23]"/>
          </div>
          <h2 className={`font-heading text-2xl sm:text-3xl font-extrabold tracking-wide ${isDark ? 'text-white' : 'text-[#171717]'}`}>
            QUICK LAUNCH
          </h2>
          <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ml-1 border ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-stone-200' : 'bg-[#F5F5F3] border-[#171717] text-[#171717]'}`}>
            {filteredLinks.length}
          </span>
        </div>

        { /* Action button */ }
        <button onClick={onAddLink} className="bg-[#171717] text-white hover:bg-[#F25C23] border-2 border-[#171717] px-3.5 py-1.5 rounded-lg font-heading text-xs sm:text-sm font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-editorial-sm active:translate-x-[1px] active:translate-y-[1px]">
          <Plus className="w-4 h-4 stroke-[3]"/> ADD LINK
        </button>
      </div>

      { /* Category Filter Chips */ }
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((cat)=>{
        const isActive = activeCategory === cat.id;
        return <button key={cat.id} onClick={()=>setActiveCategory(cat.id)} className={`font-condensed text-xs font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer whitespace-nowrap ${isActive ? 'bg-[#F25C23] text-white border-[#F25C23] shadow-editorial-sm' : isDark ? 'bg-[#27272A] text-stone-300 border-[#3F3F46] hover:border-[#F25C23]' : 'bg-[#F5F5F3] text-[#171717] border-transparent hover:border-[#171717]'}`}>
              {cat.label}
            </button>;
    })}
      </div>

      { /* Grid of Launch Tiles */ }
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 flex-1">
        {filteredLinks.map((link)=><LaunchTile key={link.id} link={link} onOpenLink={onOpenLink} onEditLink={onEditLink} onDeleteLink={onDeleteLink}/>)}

        { /* Add Link Dashed Button Tile */ }
        <motion.button onClick={onAddLink} whileTap={{
        scale: 0.92
    }} whileHover={{
        scale: 1.02,
        y: -4
    }} transition={{
        type: 'spring',
        stiffness: 450,
        damping: 25
    }} className={`h-28 sm:h-32 border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#F25C23] group touch-manipulation select-none ${isDark ? 'bg-[#27272A] border-[#3F3F46] hover:bg-[#3F3F46]' : 'bg-[#F5F5F3] border-[#171717] hover:bg-[#E8E8E5]'}`}>
          <div className={`w-9 h-9 rounded-full border-2 group-hover:bg-[#F25C23] group-hover:text-white transition-colors flex items-center justify-center ${isDark ? 'bg-[#18181B] border-[#3F3F46] text-white' : 'bg-[#FFFFFF] border-[#171717] text-[#171717]'}`}>
            <Plus className="w-5 h-5 stroke-[2.5]"/>
          </div>
          <span className={`font-heading text-xs font-bold tracking-wider ${isDark ? 'text-stone-200' : 'text-[#171717]'}`}>
            ADD NEW TILE
          </span>
        </motion.button>
      </div>
    </div>;
};
