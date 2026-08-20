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
import './SharedModals.css';

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
      {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`modal-container max-w-md ${isDark ? 'theme-dark' : 'theme-light'}`}>
            { /* Modal Header */ }
            <div className={`modal-header ${isDark ? 'theme-dark' : 'theme-light'}`}>
              <h3 className="modal-title">
                <Plus className="w-5 h-5 text-[#F25C23]"/>
                {initialData ? 'EDIT CONTROL TILE' : 'ADD NEW LAUNCH TILE'}
              </h3>
              <button onClick={onClose} className="modal-close-btn">
                <X className="w-5 h-5"/>
              </button>
            </div>

            { /* Modal Body */ }
            <form onSubmit={handleSubmit} className="modal-body">
              <div>
                <label className={`modal-label ${isDark ? 'theme-dark' : 'theme-light'}`}>
                  Application Name *
                </label>
                <input type="text" required placeholder="e.g. GitHub, Figma, Linear" value={name} onChange={(e)=>setName(e.target.value)} className={`modal-input ${isDark ? 'theme-dark' : 'theme-light'}`}/>
              </div>

              <div>
                <label className={`modal-label ${isDark ? 'theme-dark' : 'theme-light'}`}>
                  Target URL *
                </label>
                <input type="text" required placeholder="https://github.com/my-profile" value={url} onChange={(e)=>setUrl(e.target.value)} className={`modal-input ${isDark ? 'theme-dark' : 'theme-light'}`}/>
              </div>

              <div className="grid grid-cols-2 gap-3" style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem'}}>
                <div>
                  <label className={`modal-label ${isDark ? 'theme-dark' : 'theme-light'}`}>
                    Category
                  </label>
                  <select value={category} onChange={(e)=>setCategory(e.target.value)} className={`modal-input ${isDark ? 'theme-dark' : 'theme-light'}`} style={{padding: '0.625rem'}}>
                    <option value="work">Work</option>
                    <option value="dev">Dev</option>
                    <option value="social">Social</option>
                    <option value="creative">Creative</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className={`modal-label ${isDark ? 'theme-dark' : 'theme-light'}`}>
                    HotKey (⌘ + Key)
                  </label>
                  <input type="text" maxLength={1} placeholder="e.g. G, 1, D" value={shortcutKey} onChange={(e)=>setShortcutKey(e.target.value)} className={`modal-input ${isDark ? 'theme-dark' : 'theme-light'}`} style={{fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase'}}/>
                </div>
              </div>

              { /* Modal Actions */ }
              <div className={`modal-footer ${isDark ? 'theme-dark' : 'theme-light'}`}>
                <button type="button" onClick={onClose} className={`modal-btn-cancel ${isDark ? 'theme-dark' : 'theme-light'}`}>
                  CANCEL
                </button>
                <button type="submit" className="modal-btn-submit">
                  {initialData ? 'SAVE CHANGES' : 'CREATE TILE'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
