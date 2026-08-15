/**
 * ==========================================
 * COMPONENT: ShortcutBar
 * ==========================================
 * The footer bar showing quick keyboard shortcuts for the user.
 */
import { HelpCircle, Terminal } from 'lucide-react';
export const ShortcutBar = ({ links = [], onOpenLink, onOpenSearch, onOpenShortcutsModal })=>{
    // Find top links with shortcuts
    const shortcutLinks = links.slice(0, 5);
    return <footer className="w-full bg-[#171717] text-white border-t-3 border-[#171717] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 relative z-20 text-xs font-mono select-none">
      { /* Left: Quick Command Chips */ }
      <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
        <span className="text-[#F25C23] font-bold flex items-center gap-1 mr-1 shrink-0">
          <Terminal className="w-3.5 h-3.5"/>
          <span>HOTKEYS:</span>
        </span>

        {shortcutLinks.map((link, i)=><button key={link.id || i} type="button" onClick={()=>onOpenLink && onOpenLink(link)} className="flex items-center gap-1.5 bg-[#222222] hover:bg-[#2e2e33] border border-[#A8A8A3]/30 px-2.5 py-1 rounded-md text-white whitespace-nowrap hover:border-[#F25C23] hover:text-[#F25C23] transition-all cursor-pointer group active:scale-95" title={`Launch ${link.name}`}>
            <span className="text-stone-300 group-hover:text-white text-[11px] font-sans font-semibold">
              {link.name}
            </span>
          </button>)}

        <button type="button" onClick={()=>onOpenSearch && onOpenSearch()} className="flex items-center gap-1.5 bg-[#222222] hover:bg-[#2e2e33] border border-[#A8A8A3]/30 px-2.5 py-1 rounded-md text-white whitespace-nowrap hover:border-[#F25C23] hover:text-[#F25C23] transition-all cursor-pointer group active:scale-95" title="Global Search Palette">
          <span className="text-stone-300 group-hover:text-white text-[11px] font-sans font-semibold">
            Search
          </span>
        </button>
      </div>

      { /* Right: Help trigger */ }
      <button onClick={onOpenShortcutsModal} className="flex items-center gap-1.5 text-stone-300 hover:text-[#F25C23] transition-colors cursor-pointer ml-auto font-sans font-bold shrink-0">
        <HelpCircle className="w-4 h-4 text-[#F25C23]"/>
        <span className="hidden sm:inline">Shortcuts List</span>
      </button>
    </footer>;
};
