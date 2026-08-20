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
import './QuickLaunch.css';

export const QuickLaunch = ({ links, onOpenLink, onAddLink, onEditLink, onDeleteLink }) => {
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
    return <div className={`quick-launch-container ${isDark ? 'theme-dark' : 'theme-light'}`}>
      { /* Block Header */ }
      <div className={`quick-launch-header ${isDark ? 'theme-dark' : 'theme-light'}`}>
        <div className="quick-launch-title-container">
          <div className="quick-launch-icon-wrapper">
            <Zap className="w-5 h-5 fill-[#F25C23]"/>
          </div>
          <h2 className={`quick-launch-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
            QUICK LAUNCH
          </h2>
          <span className={`quick-launch-count-badge ${isDark ? 'theme-dark' : 'theme-light'}`}>
            {filteredLinks.length}
          </span>
        </div>

        { /* Action button */ }
        <button onClick={onAddLink} className="quick-launch-add-btn">
          <Plus className="w-4 h-4 stroke-[3]"/> ADD LINK
        </button>
      </div>

      { /* Category Filter Chips */ }
      <div className="quick-launch-filters">
        {categories.map((cat)=>{
        const isActive = activeCategory === cat.id;
        return <button key={cat.id} onClick={()=>setActiveCategory(cat.id)} className={`quick-launch-filter-chip ${isActive ? 'active' : 'inactive'} ${isDark ? 'theme-dark' : 'theme-light'}`}>
              {cat.label}
            </button>;
    })}
      </div>

      { /* Grid of Launch Tiles */ }
      <div className="quick-launch-grid">
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
    }} className={`quick-launch-add-tile ${isDark ? 'theme-dark' : 'theme-light'}`}>
          <div className={`quick-launch-add-tile-icon-wrapper ${isDark ? 'theme-dark' : 'theme-light'}`}>
            <Plus className="w-5 h-5 stroke-[2.5]"/>
          </div>
          <span className={`quick-launch-add-tile-text ${isDark ? 'theme-dark' : 'theme-light'}`}>
            ADD NEW TILE
          </span>
        </motion.button>
      </div>
    </div>;
};
