/**
 * ==========================================
 * COMPONENT: ShortcutsModal
 * ==========================================
 * The cheat sheet popup showing all available keyboard shortcuts.
 */
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, ExternalLink } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './SharedModals.css';

export const ShortcutsModal = ({ isOpen, onClose, links = [], onOpenLink, onOpenSearch, onOpenVault })=>{
    const { isDark } = useTheme();
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
      {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`modal-container max-w-lg ${isDark ? 'theme-dark' : 'theme-light'}`}>
            { /* Header */ }
            <div className={`modal-header ${isDark ? 'theme-dark' : 'theme-light'}`}>
              <div className="modal-header-left">
                <HelpCircle className="w-6 h-6 text-[#F25C23]"/>
                <h3 className="modal-title" style={{fontSize: '1.25rem', padding: '0.25rem 0'}}>
                  KEYBOARD HOTKEY LEGEND
                </h3>
              </div>
              <button onClick={onClose} className="modal-close-btn">
                <X className="w-5 h-5"/>
              </button>
            </div>

            { /* Content */ }
            <div className="modal-body modal-body-scroll">
              { /* Section 1: Quick Launch */ }
              <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${isDark ? '#3F3F46' : '#171717'}`, paddingBottom: '0.25rem'}}>
                  <h4 className={`search-group-title ${isDark ? 'theme-dark' : 'theme-light'}`} style={{marginBottom: 0, border: 'none'}}>
                    PRIMARY LAUNCH HOTKEYS (PRESS 1-9 OR ⌘1-9)
                  </h4>
                  <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: '0.625rem', color: isDark ? '#a8a29e' : '#78716c'}}>CLICK TO LAUNCH</span>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem'}}>
                  {topLinks.map((link, i)=><motion.button key={link.id || i} type="button" whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 450, damping: 25 }} onClick={()=>{
            onClose();
            if (onOpenLink) onOpenLink(link);
        }} className={`shortcuts-legend-btn ${isDark ? 'theme-dark' : 'theme-light'}`}>
                      <span className="shortcuts-legend-text" style={{display: 'flex', alignItems: 'center', gap: '0.375rem', overflow: 'hidden'}}>
                        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{link.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-50 shrink-0"/>
                      </span>
                      <kbd className="shortcuts-legend-kbd">
                        {link.shortcutKey ? `⌘${link.shortcutKey} / ${link.shortcutKey}` : `${i + 1}`}
                      </kbd>
                    </motion.button>)}
                </div>
              </div>

              { /* Section 2: Global Commands */ }
              <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <div style={{borderBottom: `2px solid ${isDark ? '#3F3F46' : '#171717'}`, paddingBottom: '0.25rem'}}>
                  <h4 className={`search-group-title ${isDark ? 'theme-dark' : 'theme-light'}`} style={{marginBottom: 0, border: 'none'}}>
                    GLOBAL SYSTEM COMMANDS
                  </h4>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem'}}>
                  {globalCommands.map((cmd, i)=><motion.button key={i} type="button" whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 450, damping: 25 }} onClick={cmd.action} className={`shortcuts-legend-btn ${isDark ? 'theme-dark' : 'theme-light'}`}>
                      <span className="shortcuts-legend-text">
                        {cmd.label}
                      </span>
                      <kbd className="shortcuts-legend-kbd">
                        {cmd.key}
                      </kbd>
                    </motion.button>)}
                </div>
              </div>

              <div style={{paddingTop: '0.5rem', borderTop: `2px solid ${isDark ? '#3F3F46' : '#171717'}`, textAlign: 'center'}}>
                <span style={{fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: isDark ? '#a8a29e' : '#78716c', fontWeight: 600}}>
                  PRESS <kbd className="shortcuts-legend-kbd" style={isDark ? {backgroundColor: '#27272A', color: 'white', borderColor: '#3F3F46', padding: '0.125rem 0.375rem'} : {backgroundColor: 'white', color: '#171717', borderColor: '#171717', padding: '0.125rem 0.375rem'}}>ESC</kbd> TO CLOSE LEGEND
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
