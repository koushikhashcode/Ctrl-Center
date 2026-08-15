/**
 * ==========================================
 * COMPONENT: AddToolModal
 * ==========================================
 * Form popup to add a new developer tool.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LayoutGrid, Plus, Trash2 } from 'lucide-react';
export const AddToolModal = ({ isOpen, onClose, onSave, isDark = true })=>{
    const [name, setName] = useState('');
    const [badge, setBadge] = useState('');
    const [multiUrls, setMultiUrls] = useState([
        {
            id: '1',
            name: '',
            url: ''
        },
        {
            id: '2',
            name: '',
            url: ''
        }
    ]);
    const normalizeUrl = (raw)=>{
        const trimmed = raw.trim();
        if (!trimmed) return '';
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return `https://${trimmed}`;
    };
    const handleAddUrlRow = ()=>{
        setMultiUrls((prev)=>[
                ...prev,
                {
                    id: Date.now().toString(),
                    name: '',
                    url: ''
                }
            ]);
    };
    const handleRemoveUrlRow = (id)=>{
        if (multiUrls.length <= 1) return;
        setMultiUrls((prev)=>prev.filter((item)=>item.id !== id));
    };
    const handleUpdateUrlRow = (id, field, value)=>{
        setMultiUrls((prev)=>prev.map((item)=>item.id === id ? {
                    ...item,
                    [field]: value
                } : item));
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!name.trim()) return;
        const validEntries = multiUrls.map((entry)=>({
                name: entry.name.trim() || entry.url.replace(/^https?:\/\//i, '').split('/')[0] || 'Tab',
                url: normalizeUrl(entry.url)
            })).filter((entry)=>entry.url.length > 0);
        const urls = validEntries.length > 0 ? validEntries.map((e)=>e.url) : [
            'https://google.com'
        ];
        const tabNames = validEntries.length > 0 ? validEntries.map((e)=>e.name) : [
            'Tab 1'
        ];
        const primaryUrl = urls[0];
        const defaultDesc = tabNames.slice(0, 4).join(', ') + (tabNames.length > 4 ? ` +${tabNames.length - 4}` : '');
        onSave({
            id: Date.now().toString(),
            name: name.trim(),
            description: defaultDesc,
            url: primaryUrl,
            urls: urls,
            tabNames: tabNames,
            iconName: name.trim(),
            badge: badge.trim() || (urls.length > 1 ? `${urls.length} TABS` : undefined)
        });
        // Reset fields
        setName('');
        setBadge('');
        setMultiUrls([
            {
                id: '1',
                name: '',
                url: ''
            },
            {
                id: '2',
                name: '',
                url: ''
            }
        ]);
        onClose();
    };
    return <AnimatePresence>
      {isOpen && <motion.div id="add-tool-modal-backdrop" initial={{
        opacity: 0
    }} animate={{
        opacity: 1
    }} exit={{
        opacity: 0
    }} transition={{
        duration: 0.2
    }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
          <motion.div id="add-tool-modal-container" initial={{
        opacity: 0,
        scale: 0.95,
        y: 12
    }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
    }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 12
    }} transition={{
        type: 'spring',
        stiffness: 420,
        damping: 28
    }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`w-full max-w-lg rounded-2xl border-2 shadow-2xl overflow-hidden my-6 transition-all ${isDark ? 'bg-[#18181B] text-white border-[#3F3F46]' : 'bg-white text-[#171717] border-[#171717]'}`}>
            { /* Header */ }
            <div className={`px-5 sm:px-6 py-4 flex items-center justify-between border-b-2 ${isDark ? 'bg-[#121214] border-[#3F3F46] text-white' : 'bg-[#171717] border-[#171717] text-white'}`}>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#27272A] border border-[#3F3F46] text-[#F25C23]">
                  <LayoutGrid className="w-5 h-5"/>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold tracking-wider">
                  ADD WORKSPACE TOOL
                </h3>
              </div>
              <button id="close-add-tool-btn" onClick={onClose} className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-[#27272A] cursor-pointer transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 font-sans text-sm max-h-[75vh] overflow-y-auto">
              { /* Tool Name & Badge */ }
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold font-mono uppercase mb-1 ${isDark ? 'text-stone-300' : 'text-[#171717]'}`}>
                    Tool Name *
                  </label>
                  <input type="text" id="tool-name-input" required placeholder="e.g. Design Suite" value={name} onChange={(e)=>setName(e.target.value)} className={`w-full border-2 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-[#F25C23] ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-white placeholder-stone-500' : 'bg-[#F5F5F3] border-[#171717] text-[#171717] placeholder-stone-400'}`}/>
                </div>

                <div>
                  <label className={`block text-xs font-bold font-mono uppercase mb-1 ${isDark ? 'text-stone-300' : 'text-[#171717]'}`}>
                    Badge (Optional)
                  </label>
                  <input type="text" id="tool-badge-input" placeholder="e.g. 5 TABS" value={badge} onChange={(e)=>setBadge(e.target.value)} className={`w-full border-2 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-[#F25C23] font-mono text-xs ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-white placeholder-stone-500' : 'bg-[#F5F5F3] border-[#171717] text-[#171717] placeholder-stone-400'}`}/>
                </div>
              </div>

              { /* URLs Section */ }
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className={`block text-xs font-bold font-mono uppercase ${isDark ? 'text-stone-300' : 'text-[#171717]'}`}>
                    URLs ({multiUrls.length})
                  </label>
                  <button type="button" id="add-url-row-btn" onClick={handleAddUrlRow} className="px-2.5 py-1 rounded-lg bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-editorial-sm transition-all">
                    <Plus className="w-3.5 h-3.5"/>
                    Add URL
                  </button>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {multiUrls.map((entry, idx)=><div key={entry.id} className={`p-2.5 rounded-xl border-2 flex items-center gap-2 ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-[#F5F5F3] border-[#171717]'}`}>
                      <span className="w-5 h-5 rounded-full bg-[#18181B] text-stone-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-[#3F3F46]">
                        {idx + 1}
                      </span>

                      { /* Tab Name */ }
                      <input type="text" placeholder="Tab Name" value={entry.name} onChange={(e)=>handleUpdateUrlRow(entry.id, 'name', e.target.value)} className={`w-1/3 border rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#F25C23] ${isDark ? 'bg-[#18181B] border-[#3F3F46] text-white placeholder-stone-500' : 'bg-white border-stone-300 text-[#171717] placeholder-stone-400'}`}/>

                      { /* Target URL */ }
                      <input type="text" required={idx === 0} placeholder="https://..." value={entry.url} onChange={(e)=>handleUpdateUrlRow(entry.id, 'url', e.target.value)} className={`flex-1 border rounded-lg px-2 py-1.5 font-mono text-xs focus:outline-none focus:border-[#F25C23] ${isDark ? 'bg-[#18181B] border-[#3F3F46] text-white placeholder-stone-500' : 'bg-white border-stone-300 text-[#171717] placeholder-stone-400'}`}/>

                      { /* Remove row */ }
                      {multiUrls.length > 1 && <button type="button" onClick={()=>handleRemoveUrlRow(entry.id)} className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg hover:bg-[#18181B] cursor-pointer transition-colors shrink-0" title="Remove URL">
                          <Trash2 className="w-4 h-4"/>
                        </button>}
                    </div>)}
                </div>
              </div>

              { /* Footer Actions */ }
              <div className={`pt-4 border-t-2 flex items-center justify-end gap-3 ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
                <button type="button" id="cancel-add-tool-btn" onClick={onClose} className={`px-4 py-2 border-2 font-heading font-bold rounded-xl cursor-pointer text-xs transition-colors ${isDark ? 'border-[#3F3F46] bg-[#27272A] text-stone-300 hover:text-white hover:bg-[#3F3F46]' : 'border-[#171717] bg-[#F5F5F3] text-[#171717] hover:bg-stone-200'}`}>
                  CANCEL
                </button>
                <button type="submit" id="submit-add-tool-btn" className="px-5 py-2 border-2 border-[#171717] bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading font-bold rounded-xl cursor-pointer shadow-editorial-sm transition-all text-xs flex items-center gap-1.5">
                  <Plus className="w-4 h-4 stroke-[2.5]"/>
                  ADD TOOL
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
