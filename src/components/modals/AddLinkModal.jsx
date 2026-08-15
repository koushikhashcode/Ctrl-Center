/**
 * ==========================================
 * COMPONENT: AddLinkModal
 * ==========================================
 * Form popup to add or edit a shortcut link in the Quick Launchpad.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
export const AddLinkModal = ({ isOpen, onClose, onSave, initialData })=>{
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('work');
    const [shortcutKey, setShortcutKey] = useState('');
    const [iconName, setIconName] = useState('Globe');
    const { isDark } = useTheme();
    useEffect(()=>{
        if (initialData) {
            setName(initialData.name || '');
            setUrl(initialData.url || '');
            setCategory(initialData.category || 'work');
            setShortcutKey(initialData.shortcutKey || '');
            setIconName(initialData.iconName || 'Globe');
        } else {
            setName('');
            setUrl('');
            setCategory('work');
            setShortcutKey('');
            setIconName('Globe');
        }
    }, [
        initialData,
        isOpen
    ]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!name.trim() || !url.trim()) return;
        let formattedUrl = url.trim();
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            formattedUrl = `https://${formattedUrl}`;
        }
        onSave({
            id: initialData?.id || Date.now().toString(),
            name: name.trim(),
            url: formattedUrl,
            category,
            shortcutKey: shortcutKey.trim().toUpperCase() || undefined,
            iconName: iconName || name.trim()
        });
        onClose();
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
    }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" onClick={onClose}>
          <motion.div initial={{
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
    }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`border-4 rounded-2xl w-full max-w-md overflow-hidden transition-colors ${isDark ? 'bg-[#18181B] border-[#3F3F46] text-white shadow-editorial-lg-dark' : 'bg-[#FFFFFF] border-[#171717] text-[#171717] shadow-editorial-lg'}`}>
            { /* Modal Header */ }
            <div className={`px-6 py-4 flex items-center justify-between border-b-2 ${isDark ? 'bg-[#121214] text-white border-[#3F3F46]' : 'bg-[#171717] text-white border-[#171717]'}`}>
              <h3 className="font-heading text-xl font-bold tracking-wider flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#F25C23]"/>
                {initialData ? 'EDIT CONTROL TILE' : 'ADD NEW LAUNCH TILE'}
              </h3>
              <button onClick={onClose} className="p-1 text-stone-300 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/10">
                <X className="w-5 h-5"/>
              </button>
            </div>

            { /* Modal Body */ }
            <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans text-sm">
              <div>
                <label className={`block text-xs font-bold mb-1 font-mono uppercase ${isDark ? 'text-stone-200' : 'text-[#171717]'}`}>
                  Application Name *
                </label>
                <input type="text" required placeholder="e.g. GitHub, Figma, Linear" value={name} onChange={(e)=>setName(e.target.value)} className={`w-full border-2 rounded-lg p-2.5 font-semibold focus:outline-none focus:border-[#F25C23] transition-colors ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-white placeholder-stone-400 focus:bg-[#18181B]' : 'bg-[#F5F5F3] border-[#171717] text-[#171717] focus:bg-white'}`}/>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 font-mono uppercase ${isDark ? 'text-stone-200' : 'text-[#171717]'}`}>
                  Target URL *
                </label>
                <input type="text" required placeholder="https://github.com/my-profile" value={url} onChange={(e)=>setUrl(e.target.value)} className={`w-full border-2 rounded-lg p-2.5 font-semibold focus:outline-none focus:border-[#F25C23] transition-colors ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-white placeholder-stone-400 focus:bg-[#18181B]' : 'bg-[#F5F5F3] border-[#171717] text-[#171717] focus:bg-white'}`}/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1 font-mono uppercase ${isDark ? 'text-stone-200' : 'text-[#171717]'}`}>
                    Category
                  </label>
                  <select value={category} onChange={(e)=>setCategory(e.target.value)} className={`w-full border-2 rounded-lg p-2.5 font-semibold focus:outline-none focus:border-[#F25C23] ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-white' : 'bg-[#F5F5F3] border-[#171717] text-[#171717]'}`}>
                    <option value="work">Work</option>
                    <option value="dev">Dev</option>
                    <option value="social">Social</option>
                    <option value="creative">Creative</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 font-mono uppercase ${isDark ? 'text-stone-200' : 'text-[#171717]'}`}>
                    HotKey (⌘ + Key)
                  </label>
                  <input type="text" maxLength={1} placeholder="e.g. G, 1, D" value={shortcutKey} onChange={(e)=>setShortcutKey(e.target.value)} className={`w-full border-2 rounded-lg p-2.5 font-mono font-bold uppercase focus:outline-none focus:border-[#F25C23] ${isDark ? 'bg-[#27272A] border-[#3F3F46] text-white placeholder-stone-400' : 'bg-[#F5F5F3] border-[#171717] text-[#171717]'}`}/>
                </div>
              </div>

              { /* Modal Actions */ }
              <div className={`pt-4 border-t-2 flex items-center justify-end gap-3 ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
                <button type="button" onClick={onClose} className={`px-4 py-2 border-2 font-heading font-bold rounded-lg transition-colors cursor-pointer ${isDark ? 'bg-[#27272A] border-[#3F3F46] hover:bg-[#3F3F46] text-white' : 'bg-[#F5F5F3] border-[#171717] hover:bg-[#E8E8E5] text-[#171717]'}`}>
                  CANCEL
                </button>
                <button type="submit" className="px-5 py-2 border-2 border-[#171717] bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading font-bold rounded-lg transition-all cursor-pointer shadow-editorial-sm active:translate-x-[1px] active:translate-y-[1px]">
                  {initialData ? 'SAVE CHANGES' : 'CREATE TILE'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
