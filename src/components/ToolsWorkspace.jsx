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
export const ToolsWorkspace = ({ tools, onOpenTool, onAddTool })=>{
    const { isDark } = useTheme();
    return <div className={`p-5 sm:p-6 flex flex-col justify-between h-full relative transition-colors ${isDark ? 'bg-[#18181B] text-white' : 'bg-[#FFFFFF] text-[#171717]'}`}>
      { /* Header */ }
      <div className={`flex items-center justify-between border-b-2 pb-3 mb-4 ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
        <div className="flex items-center gap-2">
          <div className="bg-[#171717] text-[#F25C23] p-1.5 rounded-md">
            <LayoutGrid className="w-5 h-5 text-[#F25C23]"/>
          </div>
          <h2 className={`font-heading text-2xl sm:text-3xl font-extrabold tracking-wide ${isDark ? 'text-white' : 'text-[#171717]'}`}>
            TOOLS & WORKSPACE
          </h2>
        </div>

        <button onClick={onAddTool} className={`p-1.5 rounded-md hover:bg-[#F25C23] hover:text-white border-2 transition-colors cursor-pointer shadow-editorial-sm ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-white' : 'bg-[#F5F5F3] border-[#171717] text-[#171717]'}`} title="Add Tool">
          <Plus className="w-4 h-4 stroke-[3]"/>
        </button>
      </div>

      { /* Grid of Tools */ }
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-1">
        {tools.map((tool)=><motion.button key={tool.id} onClick={()=>onOpenTool(tool)} whileTap={{
            scale: 0.94
        }} whileHover={{
            scale: 1.02,
            y: -2
        }} transition={{
            type: 'spring',
            stiffness: 450,
            damping: 25
        }} className={`group border-2 rounded-xl p-3 flex flex-col items-start justify-between min-h-[90px] cursor-pointer relative touch-manipulation select-none ${isDark ? 'bg-[#27272A] hover:bg-[#F25C23] hover:text-white border-[#3F3F46] text-white shadow-editorial-sm-dark hover:shadow-editorial-dark' : 'bg-[#F5F5F3] hover:bg-[#F25C23] hover:text-white border-[#171717] text-[#171717] shadow-editorial-sm hover:shadow-editorial'}`}>
            {tool.badge && <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-[#171717] text-white px-1.5 py-0.5 rounded border border-[#3F3F46]">
                {tool.badge}
              </span>}

            <div className={`p-1.5 rounded border transition-colors ${isDark ? 'bg-[#18181B] border-[#3F3F46] group-hover:bg-[#171717] text-white' : 'bg-[#FFFFFF] border-[#171717] group-hover:bg-[#171717] text-[#171717] group-hover:text-white'}`}>
              <BrandIcon name={tool.iconName || tool.name} className="w-5 h-5"/>
            </div>

            <div className="w-full text-left mt-2">
              <span className={`font-sans font-bold text-xs sm:text-sm truncate block ${isDark ? 'text-white group-hover:text-white' : 'text-[#171717] group-hover:text-white'}`}>
                {tool.name}
              </span>
              <span className={`text-[10px] line-clamp-1 block ${isDark ? 'text-stone-300 group-hover:text-white/80' : 'text-[#171717]/70 group-hover:text-white/80'}`}>
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
    }} className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center min-h-[90px] gap-1 cursor-pointer hover:border-[#F25C23] group touch-manipulation select-none ${isDark ? 'bg-[#27272A] border-[#3F3F46] hover:bg-[#3F3F46] text-white' : 'bg-[#F5F5F3] border-[#171717] hover:bg-[#E8E8E5] text-[#171717]'}`}>
          <Plus className="w-5 h-5 stroke-[2.5] group-hover:text-[#F25C23]"/>
          <span className="font-heading text-xs font-bold tracking-wider">ADD TOOL</span>
        </motion.button>
      </div>

      { /* Footer */ }
      <div className={`pt-3 border-t-2 mt-3 text-right ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
        <span className={`font-mono text-xs font-semibold ${isDark ? 'text-stone-400' : 'text-[#171717]/70'}`}>
          DAILY PRODUCTION LAUNCHER
        </span>
      </div>
    </div>;
};
