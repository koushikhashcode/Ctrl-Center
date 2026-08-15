/**
 * ==========================================
 * COMPONENT: QuickActionMenu
 * ==========================================
 * The popup menu to add new items, triggered by the Overlapping Plus Button.
 */
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ShieldCheck, Play, LayoutGrid, Zap } from 'lucide-react';
export const QuickActionMenu = ({ isOpen, onClose, onAddLink, onAddPlaylist, onAddTool, onToggleVault, onOpenSearch })=>{
    const actions = [
        {
            icon: Zap,
            title: 'ADD LAUNCH TILE',
            desc: 'Add new application or Stream Deck shortcut',
            onClick: ()=>{
                onClose();
                onAddLink();
            }
        },
        {
            icon: Play,
            title: 'ADD YOUTUBE PLAYLIST',
            desc: 'Embed a curated video series or study vault',
            onClick: ()=>{
                onClose();
                onAddPlaylist();
            }
        },
        {
            icon: LayoutGrid,
            title: 'ADD WORKSPACE TOOL',
            desc: 'Connect daily utility or web app',
            onClick: ()=>{
                onClose();
                onAddTool();
            }
        },
        {
            icon: ShieldCheck,
            title: 'TOGGLE PRIVATE VAULT',
            desc: 'Authenticate to reveal confidential files',
            onClick: ()=>{
                onClose();
                onToggleVault();
            }
        },
        {
            icon: Search,
            title: 'GLOBAL SEARCH (⌘K)',
            desc: 'Search all tiles, playlists & records',
            onClick: ()=>{
                onClose();
                onOpenSearch();
            }
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
    }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" onClick={onClose}>
          <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 12
    }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
    }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 12
    }} transition={{
        type: 'spring',
        stiffness: 420,
        damping: 28
    }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className="bg-[#FFFFFF] border-4 border-[#171717] rounded-2xl w-full max-w-md shadow-editorial-lg overflow-hidden">
            { /* Header */ }
            <div className="bg-[#171717] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#171717]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F25C23] text-white flex items-center justify-center font-bold">
                  +
                </div>
                <h3 className="font-heading text-xl font-bold tracking-wider">
                  QUICK COMMAND ACTION
                </h3>
              </div>
              <button onClick={onClose} className="p-1 text-stone-300 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/10">
                <X className="w-5 h-5"/>
              </button>
            </div>

            { /* Action Items */ }
            <div className="p-4 space-y-2 font-sans">
              {actions.map((act, i)=>{
        const Icon = act.icon;
        return <motion.button key={i} onClick={act.onClick} whileTap={{
            scale: 0.97
        }} whileHover={{
            scale: 1.01,
            x: 2
        }} transition={{
            type: 'spring',
            stiffness: 450,
            damping: 25
        }} className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#F25C23] hover:text-white border-2 border-[#171717] rounded-xl flex items-center gap-3 transition-all cursor-pointer shadow-editorial-sm group text-left touch-manipulation">
                    <div className="p-2 rounded-lg bg-[#171717] text-[#F25C23] group-hover:bg-white group-hover:text-[#171717] transition-colors flex-shrink-0">
                      <Icon className="w-5 h-5"/>
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-extrabold tracking-wide text-[#171717] group-hover:text-white">
                        {act.title}
                      </h4>
                      <p className="text-xs font-medium text-[#171717]/70 group-hover:text-white/80">
                        {act.desc}
                      </p>
                    </div>
                  </motion.button>;
    })}
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
