/**
 * ==========================================
 * COMPONENT: SearchModal
 * ==========================================
 * The global search popup triggered by Cmd+K or clicking the search bar.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ExternalLink, CornerDownLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
export const SearchModal = ({ isOpen, onClose, links, playlists, tools, documents, onOpenLink, onOpenPlaylist, onOpenTool, onOpenVault })=>{
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const { isDark } = useTheme();
    useEffect(()=>{
        if (isOpen) {
            setTimeout(()=>inputRef.current?.focus(), 50);
        } else {
            setQuery('');
        }
    }, [
        isOpen
    ]);
    const normalizedQuery = query.toLowerCase().trim();
    const matchingLinks = links.filter((l)=>l.name.toLowerCase().includes(normalizedQuery) || l.category.toLowerCase().includes(normalizedQuery) || l.url.toLowerCase().includes(normalizedQuery));
    const matchingPlaylists = playlists.filter((p1)=>p1.title.toLowerCase().includes(normalizedQuery) || p1.category.toLowerCase().includes(normalizedQuery));
    const matchingTools = tools.filter((t)=>t.name.toLowerCase().includes(normalizedQuery) || t.description.toLowerCase().includes(normalizedQuery));
    const matchingDocs = documents.filter((d)=>!d.requiresLevel2 && d.category !== 'classified' && d.category !== 'key' && (d.title.toLowerCase().includes(normalizedQuery) || d.category.toLowerCase().includes(normalizedQuery)));
    const totalMatches = matchingLinks.length + matchingPlaylists.length + matchingTools.length + matchingDocs.length;
    const flatResults = [
        ...matchingLinks.map((link)=>({
                id: `link-${link.id}`,
                type: 'link',
                title: link.name,
                subtitle: link.category.toUpperCase(),
                action: ()=>{
                    onOpenLink(link);
                    onClose();
                }
            })),
        ...matchingTools.map((tool)=>({
                id: `tool-${tool.id}`,
                type: 'tool',
                title: tool.name,
                subtitle: 'TOOL',
                action: ()=>{
                    onOpenTool(tool);
                    onClose();
                }
            })),
        ...matchingPlaylists.map((pl)=>({
                id: `playlist-${pl.id}`,
                type: 'playlist',
                title: pl.title,
                subtitle: `${pl.videoCount} VIDEOS`,
                action: ()=>{
                    onOpenPlaylist(pl);
                    onClose();
                }
            })),
        ...matchingDocs.map((doc)=>({
                id: `doc-${doc.id}`,
                type: 'doc',
                title: doc.title,
                subtitle: doc.category.toUpperCase(),
                action: ()=>{
                    onOpenVault();
                    onClose();
                }
            }))
    ];
    const [selectedIndex, setSelectedIndex] = useState(0);
    // Reset selected index when query changes
    useEffect(()=>{
        setSelectedIndex(0);
    }, [
        query
    ]);
    // Handle keyboard navigation (ArrowUp, ArrowDown, Enter)
    const handleInputKeyDown = (e)=>{
        if (flatResults.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev)=>(prev + 1) % flatResults.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev)=>(prev - 1 + flatResults.length) % flatResults.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (flatResults[selectedIndex]) {
                flatResults[selectedIndex].action();
            }
        }
    };
    return <AnimatePresence>
      {isOpen && <motion.div initial={{
        opacity: 0
    }} animate={{
        opacity: 1
    }} exit={{
        opacity: 0
    }} transition={{
        duration: 0.2
    }} className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-xs" onClick={onClose}>
          <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: -8
    }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
    }} exit={{
        opacity: 0,
        scale: 0.95,
        y: -8
    }} transition={{
        type: 'spring',
        stiffness: 420,
        damping: 28
    }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`border-4 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col transition-colors ${isDark ? 'bg-[#18181B] border-[#3F3F46] text-white shadow-editorial-lg-dark' : 'bg-[#FFFFFF] border-[#171717] text-[#171717] shadow-editorial-lg'}`}>
            { /* Search Header */ }
            <div className={`p-4 flex items-center gap-3 border-b-2 ${isDark ? 'bg-[#121214] text-white border-[#3F3F46]' : 'bg-[#171717] text-white border-[#171717]'}`}>
              <Search className="w-5 h-5 text-[#F25C23] flex-shrink-0"/>
              <input ref={inputRef} type="text" placeholder="Search links, playlists, workspace tools or documents..." value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={handleInputKeyDown} className="w-full bg-transparent text-white placeholder-stone-400 font-sans font-bold text-base focus:outline-none"/>
              <button onClick={onClose} className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/10">
                <X className="w-5 h-5"/>
              </button>
            </div>

            { /* Search Results */ }
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4 font-sans text-sm">
              {totalMatches === 0 ? <div className="text-center py-10">
                  <p className={`font-mono text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    No matching shortcuts, tools, or documents found for "{query}".
                  </p>
                </div> : <>
                  { /* Launch Links */ }
                  {matchingLinks.length > 0 && <div>
                      <h4 className={`font-heading font-extrabold text-xs uppercase tracking-wider mb-2 pb-1 border-b ${isDark ? 'text-white border-[#3F3F46]' : 'text-[#171717] border-[#171717]/20'}`}>
                        🚀 LAUNCH TILES ({matchingLinks.length})
                      </h4>
                      <div className="space-y-1">
                        {matchingLinks.map((link)=>{
        const itemIdx = flatResults.findIndex((r)=>r.id === `link-${link.id}`);
        const isSelected = selectedIndex === itemIdx;
        return <div key={link.id} onClick={()=>{
            onOpenLink(link);
            onClose();
        }} onMouseEnter={()=>setSelectedIndex(itemIdx)} className={`p-2.5 border rounded-lg flex items-center justify-between cursor-pointer transition-colors font-semibold ${isSelected ? 'bg-[#F25C23] text-white border-[#F25C23] shadow-sm' : isDark ? 'bg-[#27272A] hover:bg-[#F25C23] hover:text-white border-[#3F3F46] text-white' : 'bg-[#F5F5F3] hover:bg-[#F25C23] hover:text-white border-[#171717] text-[#171717]'}`}>
                              <div className="flex items-center gap-2 truncate">
                                <span className="truncate">{link.name}</span>
                                <span className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border ${isSelected ? 'bg-white/20 text-white border-white/40' : isDark ? 'bg-[#18181B] text-stone-300 border-[#3F3F46]' : 'bg-white text-stone-600 border-[#171717]/20'}`}>
                                  {link.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {link.shortcutKey && <kbd className={`font-mono text-xs px-1.5 py-0.5 rounded border font-bold ${isSelected ? 'bg-white text-[#171717] border-white' : isDark ? 'bg-[#18181B] text-[#F25C23] border-[#3F3F46]' : 'bg-white text-[#171717] border-[#171717]'}`}>
                                    ⌘{link.shortcutKey}
                                  </kbd>}
                                <ExternalLink className="w-3.5 h-3.5 opacity-60"/>
                              </div>
                            </div>;
    })}
                      </div>
                    </div>}

                  { /* Workspace Tools */ }
                  {matchingTools.length > 0 && <div>
                      <h4 className={`font-heading font-extrabold text-xs uppercase tracking-wider mb-2 pb-1 border-b ${isDark ? 'text-white border-[#3F3F46]' : 'text-[#171717] border-[#171717]/20'}`}>
                        ⚙️ WORKSPACE TOOLS ({matchingTools.length})
                      </h4>
                      <div className="space-y-1">
                        {matchingTools.map((tool)=>{
        const itemIdx = flatResults.findIndex((r)=>r.id === `tool-${tool.id}`);
        const isSelected = selectedIndex === itemIdx;
        return <div key={tool.id} onClick={()=>{
            onOpenTool(tool);
            onClose();
        }} onMouseEnter={()=>setSelectedIndex(itemIdx)} className={`p-2.5 border rounded-lg flex items-center justify-between cursor-pointer transition-colors font-semibold ${isSelected ? 'bg-[#F25C23] text-white border-[#F25C23] shadow-sm' : isDark ? 'bg-[#27272A] hover:bg-[#F25C23] hover:text-white border-[#3F3F46] text-white' : 'bg-[#F5F5F3] hover:bg-[#F25C23] hover:text-white border-[#171717] text-[#171717]'}`}>
                              <span className="truncate">{tool.name}</span>
                              <span className={`font-mono text-[10px] ${isSelected ? 'text-white font-bold' : 'opacity-80'}`}>
                                {tool.description}
                              </span>
                            </div>;
    })}
                      </div>
                    </div>}

                  { /* YouTube Playlists */ }
                  {matchingPlaylists.length > 0 && <div>
                      <h4 className={`font-heading font-extrabold text-xs uppercase tracking-wider mb-2 pb-1 border-b ${isDark ? 'text-white border-[#3F3F46]' : 'text-[#171717] border-[#171717]/20'}`}>
                        📺 YOUTUBE PLAYLISTS ({matchingPlaylists.length})
                      </h4>
                      <div className="space-y-1">
                        {matchingPlaylists.map((pl)=>{
        const itemIdx = flatResults.findIndex((r)=>r.id === `playlist-${pl.id}`);
        const isSelected = selectedIndex === itemIdx;
        return <div key={pl.id} onClick={()=>{
            onOpenPlaylist(pl);
            onClose();
        }} onMouseEnter={()=>setSelectedIndex(itemIdx)} className={`p-2.5 border rounded-lg flex items-center justify-between cursor-pointer transition-colors font-semibold ${isSelected ? 'bg-[#F25C23] text-white border-[#F25C23] shadow-sm' : isDark ? 'bg-[#27272A] hover:bg-[#F25C23] hover:text-white border-[#3F3F46] text-white' : 'bg-[#F5F5F3] hover:bg-[#F25C23] hover:text-white border-[#171717] text-[#171717]'}`}>
                              <span className="truncate">{pl.title}</span>
                              <span className={`font-mono text-[10px] ${isSelected ? 'text-white font-bold' : 'opacity-80'}`}>
                                {pl.videoCount} videos
                              </span>
                            </div>;
    })}
                      </div>
                    </div>}

                  { /* Vault Documents */ }
                  {matchingDocs.length > 0 && <div>
                      <h4 className={`font-heading font-extrabold text-xs uppercase tracking-wider mb-2 pb-1 border-b ${isDark ? 'text-white border-[#3F3F46]' : 'text-[#171717] border-[#171717]/20'}`}>
                        🛡️ VAULT DOCUMENTS ({matchingDocs.length})
                      </h4>
                      <div className="space-y-1">
                        {matchingDocs.map((doc)=>{
        const itemIdx = flatResults.findIndex((r)=>r.id === `doc-${doc.id}`);
        const isSelected = selectedIndex === itemIdx;
        return <div key={doc.id} onClick={()=>{
            onOpenVault();
            onClose();
        }} onMouseEnter={()=>setSelectedIndex(itemIdx)} className={`p-2.5 border rounded-lg flex items-center justify-between cursor-pointer transition-colors font-semibold ${isSelected ? 'bg-[#F25C23] text-white border-[#F25C23] shadow-sm' : isDark ? 'bg-[#27272A] hover:bg-[#F25C23] hover:text-white border-[#3F3F46] text-white' : 'bg-[#F5F5F3] hover:bg-[#F25C23] hover:text-white border-[#171717] text-[#171717]'}`}>
                              <span className="truncate">{doc.title}</span>
                              <span className={`font-mono text-[10px] uppercase ${isSelected ? 'text-white font-bold' : 'opacity-80'}`}>
                                {doc.category}
                              </span>
                            </div>;
    })}
                      </div>
                    </div>}
                </>}
            </div>

            { /* Footer info */ }
            <div className={`border-t-2 p-2.5 px-4 flex items-center justify-between text-[11px] font-mono ${isDark ? 'bg-[#121214] border-[#3F3F46] text-stone-300' : 'bg-[#F5F5F3] border-[#171717] text-[#171717]/70'}`}>
              <span>
                Navigate with <kbd className={`border px-1 rounded ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-white' : 'bg-white border-[#171717] text-[#171717]'}`}>↑↓</kbd>
              </span>
              <span className={`flex items-center gap-1 font-bold ${isDark ? 'text-white' : 'text-[#171717]'}`}>
                Press <CornerDownLeft className="w-3 h-3"/> to launch
              </span>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
