/**
 * ==========================================
 * COMPONENT: ToolsWorkspace
 * ==========================================
 * The module containing developer tools and utility links.
 */
import { motion } from 'motion/react';
import { LayoutGrid, Plus } from 'lucide-react';
import { BrandIcon } from './BrandIcon';
import { useTheme } from '../context/ThemeContext';
import './ToolsWorkspace.css';

export const ToolsWorkspace = ({ tools, onOpenTool, onAddTool })=>{
    const { isDark } = useTheme();
    return <div className={`tools-workspace ${isDark ? 'theme-dark' : 'theme-light'}`}>
      { /* Header */ }
      <div className={`tools-workspace-header ${isDark ? 'theme-dark' : 'theme-light'}`}>
        <div className="tools-workspace-header-left">
          <div className="tools-workspace-icon-wrap">
            <LayoutGrid className="w-5 h-5"/>
          </div>
          <h2 className={`tools-workspace-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
            TOOLS & WORKSPACE
          </h2>
        </div>

        <button onClick={onAddTool} className={`tools-workspace-add-btn ${isDark ? 'theme-dark' : 'theme-light'}`} title="Add Tool">
          <Plus className="w-4 h-4 stroke-[3]"/>
        </button>
      </div>

      { /* Grid of Tools */ }
      <div className="tools-workspace-grid">
        {tools.map((tool)=><motion.button key={tool.id} onClick={()=>onOpenTool(tool)} whileTap={{
            scale: 0.94
        }} whileHover={{
            scale: 1.02,
            y: -2
        }} transition={{
            type: 'spring',
            stiffness: 450,
            damping: 25
        }} className={`tool-card ${isDark ? 'theme-dark' : 'theme-light'}`}>
            {tool.badge && <span className="tool-card-badge">
                {tool.badge}
              </span>}

            <div className={`tool-card-icon-wrap ${isDark ? 'theme-dark' : 'theme-light'}`}>
              <BrandIcon name={tool.iconName || tool.name} className="tool-card-brand-icon"/>
            </div>

            <div className="tool-card-text">
              <span className={`tool-card-name ${isDark ? 'theme-dark' : 'theme-light'}`}>
                {tool.name}
              </span>
              <span className={`tool-card-desc ${isDark ? 'theme-dark' : 'theme-light'}`}>
                {tool.description}
              </span>
            </div>
          </motion.button>)}

        { /* Add Tool Tile */ }
        <motion.button onClick={onAddTool} whileTap={{
        scale: 0.94
    }} whileHover={{
        scale: 1.02,
        y: -2
    }} transition={{
        type: 'spring',
        stiffness: 450,
        damping: 25
    }} className={`tools-workspace-add-tile ${isDark ? 'theme-dark' : 'theme-light'}`}>
          <Plus className="tools-workspace-add-tile-icon"/>
          <span className="tools-workspace-add-tile-label">ADD TOOL</span>
        </motion.button>
      </div>

      { /* Footer */ }
      <div className={`tools-workspace-footer ${isDark ? 'theme-dark' : 'theme-light'}`}>
        <span className={`tools-workspace-footer-text ${isDark ? 'theme-dark' : 'theme-light'}`}>
          DAILY PRODUCTION LAUNCHER
        </span>
      </div>
    </div>;
};
