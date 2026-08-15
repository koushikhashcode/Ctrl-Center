/**
 * ==========================================
 * COMPONENT: RecentlyOpened
 * ==========================================
 * Shows a history of recently opened links, tools, and documents.
 */
import { Clock, FileText, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const RecentlyOpened = ({ items, onOpenItem, onClearHistory })=>{
    const { isDark } = useTheme();
    return <div className={`p-5 sm:p-6 flex flex-col justify-between h-full relative transition-colors ${isDark ? 'bg-[#18181B] text-white' : 'bg-[#FFFFFF] text-[#171717]'}`}>
      { /* Header */ }
      <div>
        <div className={`flex items-center justify-between border-b-2 pb-3 mb-3 ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
          <div className="flex items-center gap-2">
            <div className="bg-[#171717] text-[#F25C23] p-1.5 rounded-md">
              <Clock className="w-5 h-5 text-[#F25C23]"/>
            </div>
            <h2 className={`font-heading text-2xl sm:text-3xl font-extrabold tracking-wide ${isDark ? 'text-white' : 'text-[#171717]'}`}>
              RECENTLY OPENED
            </h2>
          </div>

          {onClearHistory && <button onClick={onClearHistory} className={`text-[11px] font-mono font-bold hover:text-[#F25C23] transition-colors cursor-pointer ${isDark ? 'text-stone-400' : 'text-[#171717]/70'}`}>
              CLEAR HISTORY
            </button>}
        </div>

        { /* Rows */ }
        <div className="space-y-2 mt-3">
          {items.length === 0 ? <div className={`p-4 text-center text-xs font-mono border border-dashed rounded-lg ${isDark ? 'border-[#3F3F46] text-stone-400' : 'border-[#171717] text-[#171717]/60'}`}>
              No recent items launched yet.
            </div> : items.slice(0, 4).map((item)=><div key={item.id} onClick={()=>onOpenItem(item)} className={`group p-2.5 border rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${isDark ? 'bg-[#27272A] hover:bg-[#F25C23] hover:text-white border-[#3F3F46] text-white' : 'bg-[#F5F5F3] hover:bg-[#171717] hover:text-white border-[#171717] text-[#171717]'}`}>
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className={`p-1.5 rounded border flex-shrink-0 transition-colors ${isDark ? 'bg-[#18181B] border-[#3F3F46] group-hover:bg-[#F25C23] text-white' : 'bg-[#FFFFFF] border-[#171717] group-hover:bg-[#F25C23] text-[#171717] group-hover:text-white'}`}>
                    <FileText className="w-3.5 h-3.5"/>
                  </div>
                  <div className="min-w-0">
                    <span className={`font-sans font-bold truncate block ${isDark ? 'text-white' : 'text-[#171717] group-hover:text-white'}`}>
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-stone-300 group-hover:text-white/70' : 'text-[#171717]/70 group-hover:text-white/70'}`}>
                      {item.category || 'General'} {item.fileSize ? `• ${item.fileSize}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isDark ? 'bg-[#18181B] group-hover:bg-white/20 text-stone-200 group-hover:text-white' : 'bg-[#E8E8E5] group-hover:bg-white/20 text-[#171717] group-hover:text-white'}`}>
                    {item.timestamp}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#F25C23] opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>
              </div>)}
        </div>
      </div>

      { /* Footer info */ }
      <div className={`pt-3 border-t-2 mt-3 flex items-center justify-between text-[11px] font-mono ${isDark ? 'border-[#3F3F46] text-stone-400' : 'border-[#171717] text-[#171717]/70'}`}>
        <span>AUTO-TRACKING ACTIVE</span>
        <span className="text-[#F25C23] font-bold">⌘K READY</span>
      </div>
    </div>;
};
