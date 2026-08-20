/**
 * ==========================================
 * COMPONENT: MobileNavigation
 * ==========================================
 * A slide-out menu that replaces the desktop tabs on mobile phones.
 */
import { motion, AnimatePresence } from 'motion/react';
import { X, Command, Shield, Zap, LayoutGrid, HelpCircle, Disc, Terminal, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './MobileNavigation.css';

export const MobileNavigation = ({ isOpen, onClose, activeTab, setActiveTab, onOpenSearch, onOpenShortcuts }) => {
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
    }} className="mobile-nav-overlay" onClick={onClose}>
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
    }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`mobile-nav-drawer ${isDark ? 'theme-dark' : 'theme-light'}`}>
            <div>
              { /* Header */ }
              <div className={`mobile-nav-header ${isDark ? 'theme-dark' : 'theme-light'}`}>
                <div className="mobile-nav-brand-container">
                  <div className="mobile-nav-brand-dot"/>
                  <div>
                    <span className={`mobile-nav-brand-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
                      CTRL // CENTER
                    </span>
                    <span className="mobile-nav-brand-subtitle">
                      DEVELOPER DASHBOARD
                    </span>
                  </div>
                </div>
                <button onClick={onClose} className={`mobile-nav-close-btn ${isDark ? 'theme-dark' : 'theme-light'}`}>
                  <X className="w-5 h-5"/>
                </button>
              </div>

              { /* Nav Items */ }
              <nav className="mobile-nav-items-container">
                {navItems.map((item)=>{
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return <button key={item.id} onClick={()=>{
            setActiveTab(item.id);
            onClose();
        }} className={`mobile-nav-item-btn ${isActive ? 'active' : 'inactive'} ${isDark ? 'theme-dark' : 'theme-light'}`}>
                      <div className={`mobile-nav-item-icon-wrapper ${isActive ? 'active' : 'inactive'} ${isDark ? 'theme-dark' : 'theme-light'}`}>
                        <IconComponent className="w-4 h-4"/>
                      </div>
                      <div>
                        <div className="mobile-nav-item-label">{item.label}</div>
                        <div className={`mobile-nav-item-desc ${isActive ? 'active' : 'inactive'} ${isDark ? 'theme-dark' : 'theme-light'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </button>;
    })}
              </nav>
            </div>

            { /* Quick Drawer Utilities */ }
            <div className={`mobile-nav-utils ${isDark ? 'theme-dark' : 'theme-light'}`}>
              <button onClick={()=>{
        onClose();
        onOpenSearch();
    }} className={`mobile-nav-util-btn primary ${isDark ? 'theme-dark' : 'theme-light'}`}>
                <Command className="w-4 h-4 text-[#F25C23]"/> SEARCH COMMAND (⌘K)
              </button>

              <button onClick={()=>{
        onClose();
        onOpenShortcuts();
    }} className={`mobile-nav-util-btn secondary ${isDark ? 'theme-dark' : 'theme-light'}`}>
                <HelpCircle className="w-4 h-4 text-[#F25C23]"/> HOTKEY LEGEND (?)
              </button>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
