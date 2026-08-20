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
import './SharedModals.css';

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
      {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="modal-overlay modal-overlay-start" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`modal-container max-w-xl ${isDark ? 'theme-dark' : 'theme-light'}`} style={{display: 'flex', flexDirection: 'column'}}>
            { /* Search Header */ }
            <div className={`search-input-wrap ${isDark ? 'theme-dark' : 'theme-light'}`}>
              <Search className="w-5 h-5 text-[#F25C23] flex-shrink-0"/>
              <input ref={inputRef} type="text" placeholder="Search links, playlists, workspace tools or documents..." value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={handleInputKeyDown} className="search-input"/>
              <button onClick={onClose} className="modal-close-btn" style={{padding: '0.25rem'}}>
                <X className="w-5 h-5"/>
              </button>
            </div>

            { /* Search Results */ }
            <div className="search-results-area">
              {totalMatches === 0 ? <div style={{textAlign: 'center', padding: '2.5rem 0'}}>
                  <p className={`font-mono text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    No matching shortcuts, tools, or documents found for "{query}".
                  </p>
                </div> : <>
                  { /* Launch Links */ }
                  {matchingLinks.length > 0 && <div>
                      <h4 className={`search-group-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
                        🚀 LAUNCH TILES ({matchingLinks.length})
                      </h4>
                      <div className="space-y-1" style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        {matchingLinks.map((link)=>{
        const itemIdx = flatResults.findIndex((r)=>r.id === `link-${link.id}`);
        const isSelected = selectedIndex === itemIdx;
        return <div key={link.id} onClick={()=>{
            onOpenLink(link);
            onClose();
        }} onMouseEnter={()=>setSelectedIndex(itemIdx)} className={`search-result-item ${isSelected ? 'is-selected' : isDark ? 'theme-dark' : 'theme-light'}`}>
                              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden'}}>
                                <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{link.name}</span>
                                <span className={`search-badge ${isSelected ? 'is-selected' : isDark ? 'theme-dark' : 'theme-light'}`}>
                                  {link.category}
                                </span>
                              </div>
                              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0}}>
                                {link.shortcutKey && <kbd className={`search-kbd ${isSelected ? 'is-selected' : isDark ? 'theme-dark' : 'theme-light'}`}>
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
                      <h4 className={`search-group-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
                        ⚙️ WORKSPACE TOOLS ({matchingTools.length})
                      </h4>
                      <div className="space-y-1" style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        {matchingTools.map((tool)=>{
        const itemIdx = flatResults.findIndex((r)=>r.id === `tool-${tool.id}`);
        const isSelected = selectedIndex === itemIdx;
        return <div key={tool.id} onClick={()=>{
            onOpenTool(tool);
            onClose();
        }} onMouseEnter={()=>setSelectedIndex(itemIdx)} className={`search-result-item ${isSelected ? 'is-selected' : isDark ? 'theme-dark' : 'theme-light'}`}>
                              <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{tool.name}</span>
                              <span className="search-badge" style={isSelected ? {color: 'white'} : {opacity: 0.8, background: 'transparent', border: 'none'}}>
                                {tool.description}
                              </span>
                            </div>;
    })}
                      </div>
                    </div>}

                  { /* YouTube Playlists */ }
                  {matchingPlaylists.length > 0 && <div>
                      <h4 className={`search-group-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
                        📺 YOUTUBE PLAYLISTS ({matchingPlaylists.length})
                      </h4>
                      <div className="space-y-1" style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        {matchingPlaylists.map((pl)=>{
        const itemIdx = flatResults.findIndex((r)=>r.id === `playlist-${pl.id}`);
        const isSelected = selectedIndex === itemIdx;
        return <div key={pl.id} onClick={()=>{
            onOpenPlaylist(pl);
            onClose();
        }} onMouseEnter={()=>setSelectedIndex(itemIdx)} className={`search-result-item ${isSelected ? 'is-selected' : isDark ? 'theme-dark' : 'theme-light'}`}>
                              <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{pl.title}</span>
                              <span className="search-badge" style={isSelected ? {color: 'white'} : {opacity: 0.8, background: 'transparent', border: 'none'}}>
                                {pl.videoCount} videos
                              </span>
                            </div>;
    })}
                      </div>
                    </div>}

                  { /* Vault Documents */ }
                  {matchingDocs.length > 0 && <div>
                      <h4 className={`search-group-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
                        🛡️ VAULT DOCUMENTS ({matchingDocs.length})
                      </h4>
                      <div className="space-y-1" style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        {matchingDocs.map((doc)=>{
        const itemIdx = flatResults.findIndex((r)=>r.id === `doc-${doc.id}`);
        const isSelected = selectedIndex === itemIdx;
        return <div key={doc.id} onClick={()=>{
            onOpenVault();
            onClose();
        }} onMouseEnter={()=>setSelectedIndex(itemIdx)} className={`search-result-item ${isSelected ? 'is-selected' : isDark ? 'theme-dark' : 'theme-light'}`}>
                              <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{doc.title}</span>
                              <span className="search-badge" style={isSelected ? {color: 'white'} : {opacity: 0.8, background: 'transparent', border: 'none'}}>
                                {doc.category}
                              </span>
                            </div>;
    })}
                      </div>
                    </div>}
                </>}
            </div>

            { /* Footer info */ }
            <div className={`search-footer ${isDark ? 'theme-dark' : 'theme-light'}`}>
              <span>
                Navigate with <kbd className={`search-kbd ${isDark ? 'theme-dark' : 'theme-light'}`}>↑↓</kbd>
              </span>
              <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold', color: isDark ? 'white' : '#171717'}}>
                Press <CornerDownLeft className="w-3 h-3"/> to launch
              </span>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
