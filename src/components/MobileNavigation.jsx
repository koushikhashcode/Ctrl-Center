/**
 * ==========================================
 * COMPONENT: MobileNavigation
 * ==========================================
 * A slide-out menu that replaces the desktop tabs on mobile phones.
 */
import { motion, AnimatePresence } from 'motion/react';
import { X, Command, Shield, Zap, LayoutGrid, HelpCircle, Disc, Terminal, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const MobileNavigation = ({ isOpen, onClose, activeTab, setActiveTab, onOpenSearch, onOpenShortcuts })=>{
    const { isDark } = useTheme();
    const navItems = [
        {
            id: 'dashboard',
            label: 'OVERVIEW',
            desc: 'All bento modules',
            icon: LayoutGrid
        },
        {
            id: 'launchpad',
            label: 'LAUNCHPAD',
            desc: 'Quick app shortcuts',
            icon: Zap
        },
        {
            id: 'vault',
            label: 'VAULT DOCS',
            desc: 'Encrypted secrets & keys',
            icon: Shield
        },
        {
            id: 'playlists',
            label: 'LO-FI & BEATS',
            desc: 'Vinyl player & audio',
            icon: Disc
        },
        {
            id: 'tools',
            label: 'DEV TOOLS',
            desc: 'Developer workspace tools',
            icon: Terminal
        },
        {
            id: 'scratchpad',
            label: 'SCRATCHPAD',
            desc: 'Notes & command buffer',
            icon: Edit3
        }
    ];
    return <AnimatePresence>
      {isOpen && <motion.div initial={{
        opacity: 0
    }} animate={{
        opacity: 1
    }} exit={{
        opacity: 0
    }} transition={{
        duration: 0.2
    }} className="fixed inset-0 z-50 flex justify-start bg-black/80 backdrop-blur-xs" onClick={onClose}>
          <motion.div initial={{
        x: '-100%'
    }} animate={{
        x: 0
    }} exit={{
        x: '-100%'
    }} transition={{
        type: 'spring',
        stiffness: 380,
        damping: 30
    }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`w-full max-w-xs h-full p-6 flex flex-col justify-between overflow-y-auto border-r-4 transition-colors ${isDark ? 'bg-[#18181B] border-[#3F3F46] text-white shadow-editorial-lg-dark' : 'bg-[#FFFFFF] border-[#171717] text-[#171717] shadow-editorial-lg'}`}>
            <div>
              { /* Header */ }
              <div className={`flex items-center justify-between border-b-3 pb-4 mb-5 ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F25C23] animate-pulse"/>
                  <div>
                    <span className={`font-heading text-lg font-black tracking-wider block leading-none ${isDark ? 'text-white' : 'text-[#171717]'}`}>
                      CTRL // CENTER
                    </span>
                    <span className="text-[10px] font-mono text-[#F25C23] font-bold">
                      DEVELOPER DASHBOARD
                    </span>
                  </div>
                </div>
                <button onClick={onClose} className={`p-1.5 rounded-full border-2 transition-colors cursor-pointer ${isDark ? 'border-[#3F3F46] bg-[#27272A] hover:bg-[#F25C23] text-white' : 'border-[#171717] bg-[#F5F5F3] hover:bg-[#F25C23] hover:text-white text-[#171717]'}`}>
                  <X className="w-5 h-5"/>
                </button>
              </div>

              { /* Nav Items */ }
              <nav className="space-y-2">
                {navItems.map((item)=>{
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return <button key={item.id} onClick={()=>{
            setActiveTab(item.id);
            onClose();
        }} className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${isActive ? 'bg-[#F25C23] text-white border-[#171717] shadow-editorial-sm' : isDark ? 'bg-[#27272A] text-stone-200 border-[#3F3F46] hover:bg-[#3F3F46]' : 'bg-[#F5F5F3] text-[#171717] border-[#171717] hover:bg-[#E8E8E5]'}`}>
                      <div className={`p-2 rounded-lg border ${isActive ? 'bg-[#171717] text-white border-white/30' : isDark ? 'bg-[#18181B] text-[#F25C23] border-[#3F3F46]' : 'bg-white text-[#F25C23] border-[#171717]'}`}>
                        <IconComponent className="w-4 h-4"/>
                      </div>
                      <div>
                        <div className="font-heading text-sm font-extrabold leading-none">{item.label}</div>
                        <div className={`text-[10px] font-mono mt-0.5 ${isActive ? 'text-white/80' : isDark ? 'text-stone-400' : 'text-[#171717]/60'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </button>;
    })}
              </nav>
            </div>

            { /* Quick Drawer Utilities */ }
            <div className={`space-y-2.5 pt-4 border-t-3 mt-4 ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
              <button onClick={()=>{
        onClose();
        onOpenSearch();
    }} className={`w-full p-2.5 rounded-xl font-heading text-xs font-bold border-2 flex items-center justify-center gap-2 cursor-pointer shadow-editorial-sm transition-colors ${isDark ? 'bg-[#121214] text-white hover:bg-[#F25C23] border-[#3F3F46]' : 'bg-[#171717] text-white hover:bg-[#F25C23] border-[#171717]'}`}>
                <Command className="w-4 h-4 text-[#F25C23]"/> SEARCH COMMAND (⌘K)
              </button>

              <button onClick={()=>{
        onClose();
        onOpenShortcuts();
    }} className={`w-full p-2.5 rounded-xl font-heading text-xs font-bold border-2 flex items-center justify-center gap-2 cursor-pointer transition-colors ${isDark ? 'bg-[#27272A] text-white hover:bg-[#3F3F46] border-[#3F3F46]' : 'bg-[#F5F5F3] text-[#171717] hover:bg-[#E8E8E5] border-[#171717]'}`}>
                <HelpCircle className="w-4 h-4 text-[#F25C23]"/> HOTKEY LEGEND (?)
              </button>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
