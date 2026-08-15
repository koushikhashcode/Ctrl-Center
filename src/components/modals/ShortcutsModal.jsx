/**
 * ==========================================
 * COMPONENT: ShortcutsModal
 * ==========================================
 * The cheat sheet popup showing all available keyboard shortcuts.
 */
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, ExternalLink } from 'lucide-react';
export const ShortcutsModal = ({ isOpen, onClose, links = [], onOpenLink, onOpenSearch, onOpenVault })=>{
    const topLinks = links.slice(0, 5);
    const globalCommands = [
        {
            key: '⌘K or /',
            label: 'Global Search Palette',
            action: ()=>{
                onClose();
                if (onOpenSearch) onOpenSearch();
            }
        },
        {
            key: 'V',
            label: 'Toggle Private Vault',
            action: ()=>{
                onClose();
                if (onOpenVault) onOpenVault();
            }
        },
        {
            key: 'N',
            label: 'Create New Launch Tile',
            action: ()=>{
                onClose();
            }
        },
        {
            key: 'Q',
            label: 'Quick Action Center',
            action: ()=>{
                onClose();
            }
        },
        {
            key: 'T',
            label: 'Toggle Dev Tools View',
            action: ()=>{
                onClose();
            }
        },
        {
            key: 'M',
            label: 'Toggle Lo-Fi Beats View',
            action: ()=>{
                onClose();
            }
        },
        {
            key: '0',
            label: 'Reset to Dashboard Overview',
            action: ()=>{
                onClose();
            }
        },
        {
            key: '? or H',
            label: 'Show Shortcuts Legend',
            action: ()=>{}
        },
        {
            key: 'ESC',
            label: 'Close Active Modal',
            action: onClose
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
    }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className="bg-[#FFFFFF] dark:bg-[#18181B] border-4 border-[#171717] dark:border-[#3F3F46] rounded-2xl w-full max-w-lg shadow-editorial-lg dark:shadow-editorial-lg-dark overflow-hidden text-[#171717] dark:text-white">
            { /* Header */ }
            <div className="bg-[#171717] dark:bg-[#121214] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#171717] dark:border-[#3F3F46]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#F25C23]"/>
                <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-wider">
                  KEYBOARD HOTKEY LEGEND
                </h3>
              </div>
              <button onClick={onClose} className="p-1 text-stone-300 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/10">
                <X className="w-5 h-5"/>
              </button>
            </div>

            { /* Content */ }
            <div className="p-5 sm:p-6 space-y-5 font-sans text-sm max-h-[75vh] overflow-y-auto">
              { /* Section 1: Quick Launch */ }
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b-2 border-[#171717] dark:border-[#3F3F46] pb-1">
                  <h4 className="font-heading text-xs font-extrabold text-[#171717] dark:text-white uppercase tracking-wider">
                    PRIMARY LAUNCH HOTKEYS (PRESS 1-9 OR ⌘1-9)
                  </h4>
                  <span className="font-mono text-[10px] text-stone-500 dark:text-stone-400">CLICK TO LAUNCH</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topLinks.map((link, i)=><motion.button key={link.id || i} type="button" whileTap={{
            scale: 0.96
        }} whileHover={{
            scale: 1.01
        }} transition={{
            type: 'spring',
            stiffness: 450,
            damping: 25
        }} onClick={()=>{
            onClose();
            if (onOpenLink) onOpenLink(link);
        }} className="p-2.5 bg-[#F5F5F3] dark:bg-[#27272A] hover:bg-[#F25C23] dark:hover:bg-[#F25C23] hover:text-white dark:hover:text-white border border-[#171717] dark:border-[#3F3F46] rounded-lg flex items-center justify-between font-mono text-xs cursor-pointer group transition-colors text-left">
                      <span className="font-sans font-semibold text-[#171717] dark:text-stone-200 group-hover:text-white text-xs truncate mr-2 flex items-center gap-1.5">
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 shrink-0"/>
                      </span>
                      <kbd className="bg-[#171717] dark:bg-[#121214] text-[#F25C23] group-hover:bg-white group-hover:text-[#171717] font-bold px-2 py-0.5 rounded border border-[#171717] dark:border-[#3F3F46] shrink-0">
                        {link.shortcutKey ? `⌘${link.shortcutKey} / ${link.shortcutKey}` : `${i + 1}`}
                      </kbd>
                    </motion.button>)}
                </div>
              </div>

              { /* Section 2: Global Commands */ }
              <div className="space-y-2">
                <div className="border-b-2 border-[#171717] dark:border-[#3F3F46] pb-1">
                  <h4 className="font-heading text-xs font-extrabold text-[#171717] dark:text-white uppercase tracking-wider">
                    GLOBAL SYSTEM COMMANDS
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {globalCommands.map((cmd, i)=><motion.button key={i} type="button" whileTap={{
            scale: 0.96
        }} whileHover={{
            scale: 1.01
        }} transition={{
            type: 'spring',
            stiffness: 450,
            damping: 25
        }} onClick={cmd.action} className="p-2.5 bg-[#F5F5F3] dark:bg-[#27272A] hover:bg-[#F25C23] dark:hover:bg-[#F25C23] hover:text-white dark:hover:text-white border border-[#171717] dark:border-[#3F3F46] rounded-lg flex items-center justify-between font-mono text-xs cursor-pointer group transition-colors text-left">
                      <span className="font-sans font-semibold text-[#171717] dark:text-stone-200 group-hover:text-white text-xs">
                        {cmd.label}
                      </span>
                      <kbd className="bg-[#171717] dark:bg-[#121214] text-[#F25C23] group-hover:bg-white group-hover:text-[#171717] font-bold px-2 py-0.5 rounded border border-[#171717] dark:border-[#3F3F46] shrink-0">
                        {cmd.key}
                      </kbd>
                    </motion.button>)}
                </div>
              </div>

              <div className="pt-2 border-t-2 border-[#171717] dark:border-[#3F3F46] text-center">
                <span className="font-mono text-xs text-[#171717]/70 dark:text-stone-400 font-semibold">
                  PRESS <kbd className="bg-[#171717] dark:bg-[#27272A] text-white px-1.5 py-0.5 rounded border dark:border-[#3F3F46]">ESC</kbd> TO CLOSE LEGEND
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
