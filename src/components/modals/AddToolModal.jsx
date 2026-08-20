/**
 * ==========================================
 * COMPONENT: AddToolModal
 * ==========================================
 * Form popup to add a new developer tool.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LayoutGrid, Plus, Trash2 } from 'lucide-react';
import './SharedModals.css';

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
      {isOpen && <motion.div id="add-tool-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="modal-overlay modal-overlay-start overflow-y-auto" onClick={onClose}>
          <motion.div id="add-tool-modal-container" initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`modal-container max-w-lg my-6 ${isDark ? 'theme-dark' : 'theme-light'}`}>
            { /* Header */ }
            <div className={`modal-header ${isDark ? 'theme-dark' : 'theme-light'}`}>
              <div className="modal-header-left">
                <div className="quick-action-icon-wrap" style={{padding: '0.375rem'}}>
                  <LayoutGrid className="w-5 h-5"/>
                </div>
                <h3 className="modal-title">
                  ADD WORKSPACE TOOL
                </h3>
              </div>
              <button id="close-add-tool-btn" onClick={onClose} className="modal-close-btn">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body modal-body-scroll">
              { /* Tool Name & Badge */ }
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{display: 'grid', gap: '0.75rem'}}>
                <div className="sm:col-span-2" style={{gridColumn: 'span 2 / span 2'}}>
                  <label className={`modal-label ${isDark ? 'theme-dark' : 'theme-light'}`}>
                    Tool Name *
                  </label>
                  <input type="text" id="tool-name-input" required placeholder="e.g. Design Suite" value={name} onChange={(e)=>setName(e.target.value)} className={`modal-input ${isDark ? 'theme-dark' : 'theme-light'}`}/>
                </div>

                <div>
                  <label className={`modal-label ${isDark ? 'theme-dark' : 'theme-light'}`}>
                    Badge (Optional)
                  </label>
                  <input type="text" id="tool-badge-input" placeholder="e.g. 5 TABS" value={badge} onChange={(e)=>setBadge(e.target.value)} className={`modal-input ${isDark ? 'theme-dark' : 'theme-light'}`} style={{fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem'}}/>
                </div>
              </div>

              { /* URLs Section */ }
              <div className="space-y-3 pt-1" style={{paddingTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <div className="flex items-center justify-between" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <label className={`modal-label ${isDark ? 'theme-dark' : 'theme-light'}`} style={{marginBottom: 0}}>
                    URLs ({multiUrls.length})
                  </label>
                  <button type="button" id="add-url-row-btn" onClick={handleAddUrlRow} className="modal-btn-submit" style={{padding: '0.25rem 0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem'}}>
                    <Plus className="w-3.5 h-3.5"/>
                    Add URL
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto pr-1" style={{display: 'flex', flexDirection: 'column', gap: '0.625rem', maxHeight: '16rem', overflowY: 'auto', paddingRight: '0.25rem'}}>
                  {multiUrls.map((entry, idx)=><div key={entry.id} className={`tool-url-row ${isDark ? 'theme-dark' : 'theme-light'}`}>
                      <span className="tool-url-index">
                        {idx + 1}
                      </span>

                      { /* Tab Name */ }
                      <input type="text" placeholder="Tab Name" value={entry.name} onChange={(e)=>handleUpdateUrlRow(entry.id, 'name', e.target.value)} className={`tool-url-input-name ${isDark ? 'theme-dark' : 'theme-light'}`}/>

                      { /* Target URL */ }
                      <input type="text" required={idx === 0} placeholder="https://..." value={entry.url} onChange={(e)=>handleUpdateUrlRow(entry.id, 'url', e.target.value)} className={`tool-url-input-url ${isDark ? 'theme-dark' : 'theme-light'}`}/>

                      { /* Remove row */ }
                      {multiUrls.length > 1 && <button type="button" onClick={()=>handleRemoveUrlRow(entry.id)} className="modal-close-btn" style={{flexShrink: 0}} title="Remove URL">
                          <Trash2 className="w-4 h-4"/>
                        </button>}
                    </div>)}
                </div>
              </div>

              { /* Footer Actions */ }
              <div className={`modal-footer ${isDark ? 'theme-dark' : 'theme-light'}`}>
                <button type="button" id="cancel-add-tool-btn" onClick={onClose} className={`modal-btn-cancel ${isDark ? 'theme-dark' : 'theme-light'}`}>
                  CANCEL
                </button>
                <button type="submit" id="submit-add-tool-btn" className="modal-btn-submit" style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                  <Plus className="w-4 h-4 stroke-[2.5]"/>
                  ADD TOOL
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
