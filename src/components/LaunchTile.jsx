/**
 * ==========================================
 * COMPONENT: LaunchTile
 * ==========================================
 * An individual clickable square app icon inside the QuickLaunch box.
 */
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { BrandIcon } from './BrandIcon';
import { MoreVertical, Trash2, Edit2, Copy, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const LaunchTile = ({ link, onOpenLink, onEditLink, onDeleteLink })=>{
    const [showOptions, setShowOptions] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const { isDark } = useTheme();
    const tileRef = useRef(null);
    useEffect(()=>{
        if (!showOptions) return;
        const handleClickOutside = (event)=>{
            if (tileRef.current && !tileRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [
        showOptions
    ]);
    const handleCopyLink = (e)=>{
        e.stopPropagation();
        if (link.url) {
            navigator.clipboard.writeText(link.url);
            setCopied(true);
            setTimeout(()=>setCopied(false), 2000);
        }
    };
    return <div className="relative group select-none" ref={tileRef}>
      <motion.button onClick={()=>{
        if (showOptions) {
            setShowOptions(false);
            return;
        }
        onOpenLink(link);
    }} whileTap={{
        scale: 0.92
    }} whileHover={{
        scale: 1.02,
        y: -4
    }} transition={{
        type: 'spring',
        stiffness: 450,
        damping: 25
    }} className={`w-full h-28 sm:h-32 hover:bg-[#F25C23] hover:text-white border-2 rounded-xl p-3 flex flex-col items-center justify-between cursor-pointer group/tile relative overflow-hidden touch-manipulation ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-white shadow-editorial-sm-dark hover:shadow-editorial-dark' : 'bg-[#FFFFFF] border-[#171717] text-[#171717] shadow-editorial-sm hover:shadow-editorial'}`}>
        { /* Shortcut Badge at Top Left */ }
        {link.shortcutKey && <span className={`absolute top-2 left-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors ${isDark ? 'bg-[#18181B] border-[#3F3F46] text-stone-200 group-hover/tile:bg-[#171717] group-hover/tile:text-white' : 'bg-[#F5F5F3] border-[#171717] text-[#171717] group-hover/tile:bg-[#171717] group-hover/tile:text-white'}`}>
            ⌘{link.shortcutKey}
          </span>}

        { /* Copy Link Trigger at Bottom Left */ }
        <div onClick={handleCopyLink} className={`absolute bottom-2 left-2 p-1 opacity-0 group-hover/tile:opacity-100 group-hover/tile:text-white transition-opacity rounded hover:bg-black/10 z-10 ${isDark ? 'text-stone-300' : 'text-[#171717]'}`} title={copied ? "Copied Link!" : "Copy Link"}>
          {copied ? <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]"/> : <Copy className="w-4 h-4"/>}
        </div>

        { /* Options trigger */ }
        <div onClick={(e)=>{
        e.stopPropagation();
        setShowOptions(!showOptions);
    }} className={`absolute top-2 right-2 p-1 opacity-0 group-hover/tile:opacity-100 group-hover/tile:text-white transition-opacity rounded hover:bg-black/10 z-10 ${isDark ? 'text-stone-300' : 'text-[#171717]'}`} title="Tile Options">
          <MoreVertical className="w-4 h-4"/>
        </div>

        { /* Center Logo */ }
        <div className="flex-1 flex items-center justify-center pt-2">
          <div className="p-2.5 rounded-lg group-hover/tile:scale-110 transition-transform duration-200">
            <BrandIcon name={link.iconName || link.name} className="w-8 h-8 sm:w-9 sm:h-9"/>
          </div>
        </div>

        { /* Bottom Label */ }
        <div className="w-full text-center">
          <span className="font-sans font-bold text-xs sm:text-sm tracking-tight truncate block group-hover/tile:text-white">
            {link.name}
          </span>
        </div>
      </motion.button>

      { /* Invisible backdrop to capture outside clicks immediately */ }
      {showOptions && <div className="fixed inset-0 z-20 cursor-default" onClick={(e)=>{
        e.stopPropagation();
        setShowOptions(false);
    }}/>}

      { /* Options Dropdown */ }
      {showOptions && <div onMouseLeave={()=>setShowOptions(false)} className={`absolute top-8 right-2 z-30 border-2 rounded-lg p-1 w-32 flex flex-col gap-1 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100 ${isDark ? 'bg-[#18181B] border-[#3F3F46] text-white shadow-editorial-dark' : 'bg-[#FFFFFF] border-[#171717] text-[#171717] shadow-editorial'}`}>
          <button onClick={(e)=>{
        e.stopPropagation();
        setShowOptions(false);
        onEditLink(link);
    }} className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F25C23] hover:text-white rounded transition-colors text-left w-full cursor-pointer">
            <Edit2 className="w-3.5 h-3.5"/> Edit Link
          </button>
          <button onClick={(e)=>{
        e.stopPropagation();
        setShowOptions(false);
        onDeleteLink(link.id);
    }} className="flex items-center gap-2 px-2 py-1.5 hover:bg-red-600 hover:text-white rounded transition-colors text-left w-full text-red-500 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5"/> Delete
          </button>
        </div>}
    </div>;
};
