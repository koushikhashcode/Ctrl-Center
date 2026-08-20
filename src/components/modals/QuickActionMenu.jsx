/**
 * ==========================================
 * COMPONENT: QuickActionMenu
 * ==========================================
 * The popup menu to add new items, triggered by the Overlapping Plus Button.
 */
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ShieldCheck, Play, LayoutGrid, Zap } from 'lucide-react';
import './SharedModals.css';

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
      {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className="modal-container max-w-md theme-light">
            { /* Header */ }
            <div className="modal-header theme-light">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F25C23] text-white flex items-center justify-center font-bold" style={{width: '2rem', height: '2rem', borderRadius: '9999px', backgroundColor: '#F25C23', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                  +
                </div>
                <h3 className="modal-title">
                  QUICK COMMAND ACTION
                </h3>
              </div>
              <button onClick={onClose} className="modal-close-btn" style={{color: '#a8a29e'}}>
                <X className="w-5 h-5"/>
              </button>
            </div>

            { /* Action Items */ }
            <div className="modal-body" style={{padding: '1rem', gap: '0.5rem'}}>
              {actions.map((act, i)=>{
        const Icon = act.icon;
        return <motion.button key={i} onClick={act.onClick} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01, x: 2 }} transition={{ type: 'spring', stiffness: 450, damping: 25 }} className="quick-action-btn">
                    <div className="quick-action-icon-wrap">
                      <Icon className="w-5 h-5"/>
                    </div>
                    <div>
                      <h4 className="quick-action-title">
                        {act.title}
                      </h4>
                      <p className="quick-action-desc">
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
