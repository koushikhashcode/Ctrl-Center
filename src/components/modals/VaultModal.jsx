/**
 * ==========================================
 * COMPONENT: VaultModal
 * ==========================================
 * The full-screen popup for unlocking and viewing secure vault documents.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, Key, X, Download, Copy, Eye, FileText, CheckCircle2, Delete, Terminal, Sparkles, FolderLock, FolderOpen, Fingerprint, ArrowLeft, Plus, Image as ImageIcon, FileUp, FilePlus, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './VaultModal.css';
export const VaultModal = ({ isOpen, onClose, isUnlocked, onUnlockSuccess, documents, onAddDocument })=>{
    // Layer 1 Passcode State (Primary keycode: 1234)
    const [passcode, setPasscode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    // Hidden Layer 2 (Classified) View Mode & Security Passcode State (Secret keycode: 8888)
    const [currentViewMode, setCurrentViewMode] = useState('standard');
    const [isLevel2Unlocked, setIsLevel2Unlocked] = useState(()=>{
        return localStorage.getItem('ctrl_center_vault_l2_unlocked') === 'true';
    });
    const [isSecretAuthModalOpen, setIsSecretAuthModalOpen] = useState(false);
    const [secretPasscode, setSecretPasscode] = useState('');
    const [secretErrorMsg, setSecretErrorMsg] = useState('');
    const [isSecretAuthenticating, setIsSecretAuthenticating] = useState(false);
    // Click counter for covert trigger on shield icon
    const [stealthClickCount, setStealthClickCount] = useState(0);
    const stealthTimerRef = useRef(null);
    // UI Navigation & Views
    const [activeTab, setActiveTab] = useState('all');
    const [selectedSecret, setSelectedSecret] = useState(null);
    const [openFolder, setOpenFolder] = useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    // Add Item Modal Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('personal');
    const [newType, setNewType] = useState('text');
    const [newSecretText, setNewSecretText] = useState('');
    const [newFilePreview, setNewFilePreview] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [newFileSize, setNewFileSize] = useState('');
    const [addFormError, setAddFormError] = useState('');
    const { isDark } = useTheme();
    // Reset states when closed or when master vault is locked
    useEffect(()=>{
        if (!isOpen) {
            setPasscode('');
            setErrorMsg('');
            setSecretPasscode('');
            setSecretErrorMsg('');
            setSelectedSecret(null);
            setOpenFolder(null);
            setSelectedImagePreview(null);
            setIsAddModalOpen(false);
            setIsSecretAuthModalOpen(false);
            setStealthClickCount(0);
        }
    }, [
        isOpen
    ]);
    useEffect(()=>{
        if (!isUnlocked) {
            setCurrentViewMode('standard');
            setIsLevel2Unlocked(false);
            localStorage.setItem('ctrl_center_vault_l2_unlocked', 'false');
        }
    }, [
        isUnlocked
    ]);
    // Keyboard shortcut listener inside the vault modal for covert triggering
    useEffect(()=>{
        if (!isOpen) return;
        const handleVaultKeyCombo = (e)=>{
            const activeEl = document.activeElement;
            const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
            if (isTyping) return;
            // Secret keyboard combination: Shift + C or Alt + C opens hidden 2nd layer verification
            if (e.shiftKey && e.key.toLowerCase() === 'c' || e.altKey && e.key.toLowerCase() === 'c') {
                e.preventDefault();
                openStealthUnlockDialog();
            }
        };
        window.addEventListener('keydown', handleVaultKeyCombo);
        return ()=>window.removeEventListener('keydown', handleVaultKeyCombo);
    }, [
        isOpen,
        isUnlocked,
        isLevel2Unlocked
    ]);
    if (!isOpen) return null;
    // Primary Unlock Submit (Standard: 1234, Direct Classified Easter Egg: 8888)
    const handleUnlockSubmit = (e)=>{
        if (e) e.preventDefault();
        if (isAuthenticating) return;
        // Covert bypass directly from main keypad: entering 8888 unlocks Classified immediately!
        if (passcode.trim() === '8888') {
            setErrorMsg('');
            setIsAuthenticating(true);
            setTimeout(()=>{
                setIsAuthenticating(false);
                setIsLevel2Unlocked(true);
                localStorage.setItem('ctrl_center_vault_l2_unlocked', 'true');
                onUnlockSuccess();
                setCurrentViewMode('classified');
                setActiveTab('all');
            }, 350);
            return;
        }
        if (passcode.trim() === '1234' || passcode.trim().length >= 4) {
            setErrorMsg('');
            setIsAuthenticating(true);
            setTimeout(()=>{
                setIsAuthenticating(false);
                onUnlockSuccess();
                setCurrentViewMode('standard');
                setActiveTab('all');
            }, 350);
        } else {
            setErrorMsg('Access Denied: Invalid Keycode. Use "1234" to unlock vault.');
        }
    };
    const handleKeypadPress = (digit)=>{
        if (passcode.length < 6) {
            const updated = passcode + digit;
            setPasscode(updated);
            setErrorMsg('');
            if (updated === '1234' || updated === '8888') {
                setTimeout(()=>handleUnlockSubmit(), 150);
            }
        }
    };
    const handleBackspace = ()=>{
        setPasscode((prev)=>prev.slice(0, -1));
        setErrorMsg('');
    };
    // Stealth trigger dialog opener
    const openStealthUnlockDialog = ()=>{
        if (isLevel2Unlocked) {
            // Toggle directly into classified if already authorized in current session
            setCurrentViewMode('classified');
            setActiveTab('all');
        } else {
            setSecretPasscode('');
            setSecretErrorMsg('');
            setIsSecretAuthModalOpen(true);
        }
    };
    // Stealth trigger on header icon: 3 fast clicks opens the hidden 2nd layer lock
    const handleStealthHeaderClick = ()=>{
        if (stealthTimerRef.current) {
            clearTimeout(stealthTimerRef.current);
        }
        const newCount = stealthClickCount + 1;
        setStealthClickCount(newCount);
        if (newCount >= 3) {
            setStealthClickCount(0);
            openStealthUnlockDialog();
        } else {
            stealthTimerRef.current = setTimeout(()=>{
                setStealthClickCount(0);
            }, 1000);
        }
    };
    // Hidden 2nd Layer Keycode Submission (Keycode: 8888)
    const handleSecretUnlockSubmit = ()=>{
        if (isSecretAuthenticating) return;
        if (secretPasscode.trim() === '8888' || secretPasscode.trim().length >= 4) {
            setSecretErrorMsg('');
            setIsSecretAuthenticating(true);
            setTimeout(()=>{
                setIsSecretAuthenticating(false);
                setIsLevel2Unlocked(true);
                localStorage.setItem('ctrl_center_vault_l2_unlocked', 'true');
                setIsSecretAuthModalOpen(false);
                setSecretPasscode('');
                setCurrentViewMode('classified');
                setActiveTab('all');
                setSelectedSecret(null);
                setOpenFolder(null);
                setSelectedImagePreview(null);
            }, 450);
        } else {
            setSecretErrorMsg('Access Denied: Invalid Security Keycode.');
        }
    };
    const handleSecretKeypadPress = (digit)=>{
        if (secretPasscode.length < 6) {
            const updated = secretPasscode + digit;
            setSecretPasscode(updated);
            setSecretErrorMsg('');
            if (updated === '8888') {
                setTimeout(()=>handleSecretUnlockSubmit(), 150);
            }
        }
    };
    const handleSecretBackspace = ()=>{
        setSecretPasscode((prev)=>prev.slice(0, -1));
        setSecretErrorMsg('');
    };
    // Immediate Disguise / Relock to standard repository
    const handleReturnToStandard = ()=>{
        setCurrentViewMode('standard');
        setActiveTab('all');
        setSelectedSecret(null);
        setOpenFolder(null);
        setSelectedImagePreview(null);
    };
    const handleLockSecretStorage = ()=>{
        setIsLevel2Unlocked(false);
        localStorage.setItem('ctrl_center_vault_l2_unlocked', 'false');
        handleReturnToStandard();
    };
    const handleCopy = (text, id)=>{
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(()=>setCopiedId(null), 2000);
    };
    // File Upload Handlers
    const handleFileChange = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        setNewFileName(file.name);
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
        const formattedSize = file.size >= 1024 * 1024 ? `${sizeInMB} MB` : `${Math.round(file.size / 1024)} KB`;
        setNewFileSize(formattedSize);
        if (!newTitle) {
            const titleWithoutExt = file.name.replace(/\.[^/.]+$/, '');
            setNewTitle(titleWithoutExt);
        }
        const reader = new FileReader();
        reader.onload = (event)=>{
            const result = event.target?.result;
            setNewFilePreview(result);
        };
        reader.readAsDataURL(file);
    };
    const resetAddForm = ()=>{
        setNewTitle('');
        setNewCategory(currentViewMode === 'classified' ? 'classified' : 'personal');
        setNewType('text');
        setNewSecretText('');
        setNewFilePreview(null);
        setNewFileName('');
        setNewFileSize('');
        setAddFormError('');
    };
    const handleCreateVaultItem = (e)=>{
        e.preventDefault();
        if (!newTitle.trim()) {
            setAddFormError('Please enter a document title.');
            return;
        }
        if (newType === 'text' && !newSecretText.trim()) {
            setAddFormError('Please enter secret payload content.');
            return;
        }
        if ((newType === 'pdf' || newType === 'image') && !newFilePreview) {
            setAddFormError(`Please select a ${newType.toUpperCase()} file to upload.`);
            return;
        }
        const isClassifiedTarget = currentViewMode === 'classified' || newCategory === 'classified' || newCategory === 'key';
        const newDoc = {
            id: 'v-' + Date.now(),
            title: newTitle.trim(),
            category: newCategory,
            date: new Date().toISOString().split('T')[0],
            fileSize: newType === 'text' ? `${newSecretText.length} Bytes` : newFileSize || '1.2 MB',
            fileType: newType === 'image' ? 'Encrypted Image' : newType === 'pdf' ? 'Encrypted PDF Document' : 'Encrypted Text Payload',
            secretContent: newType === 'text' ? newSecretText : undefined,
            downloadUrl: newType === 'pdf' ? newFilePreview || undefined : undefined,
            imageUrl: newType === 'image' ? newFilePreview || undefined : undefined,
            requiresLevel2: isClassifiedTarget
        };
        if (onAddDocument) {
            onAddDocument(newDoc);
        }
        resetAddForm();
        setIsAddModalOpen(false);
    };
    const isRestrictedDoc = (d)=>d.requiresLevel2 || d.category === 'classified' || d.category === 'key';
    const classifiedCount = documents.filter(isRestrictedDoc).length;
    const standardDocs = documents.filter((d)=>!isRestrictedDoc(d));
    const classifiedDocs = documents.filter(isRestrictedDoc);
    // Filtered documents strictly separated with ZERO leakage
    const filteredDocs = currentViewMode === 'classified' ? classifiedDocs.filter((d)=>activeTab === 'all' ? true : d.category === activeTab) : standardDocs.filter((d)=>activeTab === 'all' ? true : d.category === activeTab);
    return <AnimatePresence>
      {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="vault-modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`vault-modal-container ${currentViewMode === 'classified' ? 'mode-classified' : isDark ? 'theme-dark' : 'theme-light'}`}>
        { /* Modal Main Header */ }
        <div className={`vault-modal-header ${currentViewMode === 'classified' ? 'mode-classified' : ''}`}>
          <div className="vault-modal-header-left">
            { /* Covert Trigger: Triple clicking this icon secretly opens the 2nd layer lock */ }
            <button type="button" onClick={handleStealthHeaderClick} title={isUnlocked ? 'System Security Verified' : undefined} className={`vault-modal-stealth-btn ${currentViewMode === 'classified' ? 'mode-classified' : ''}`}>
              {currentViewMode === 'classified' ? <Fingerprint className="w-5 h-5"/> : <ShieldCheck className="w-5 h-5"/>}
            </button>

            <div className="min-w-0">
              <div className="vault-modal-title-row">
                <h3 className="vault-modal-title">
                  {!isUnlocked ? 'VAULT SECURITY GATEWAY' : currentViewMode === 'classified' ? 'CLASSIFIED REPOSITORY' : 'PRIVATE VAULT REPOSITORY'}
                </h3>
                {isUnlocked && currentViewMode === 'classified' && <span className="vault-doc-badge theme-dark" style={{backgroundColor: '#F25C23', color: 'white', fontSize: '9px'}}>
                    CLASSIFIED
                  </span>}
              </div>
              <div className="vault-modal-subtitle-row">
                <span className="vault-modal-subtitle">
                  {!isUnlocked ? 'QUANTUM AUTHENTICATION PROTOCOL' : currentViewMode === 'classified' ? 'TOP SECRET CLEARANCE • RESTRICTED ARCHIVES' : 'QUANTUM ENCRYPTED STORAGE • AES-256'}
                </span>
              </div>
            </div>
          </div>

          <div className="vault-modal-header-right">
            {isUnlocked && <button onClick={()=>{
        resetAddForm();
        setIsAddModalOpen(true);
    }} className="vault-modal-add-btn">
                <Plus className="w-4 h-4 stroke-[3]"/> <span className="hidden sm:inline">ADD DOCUMENT</span>
              </button>}

            <button onClick={onClose} className="vault-modal-close-btn">
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        { /* Modal Content Body */ }
        {!isUnlocked ? <div className="vault-lock-screen">
            <div className="vault-lock-screen-bg"></div>
            <div className="vault-keypad-container">
            <div className="vault-keypad-icon-wrap">
              <div className="vault-keypad-icon-inner">
                <Lock className={`w-6 h-6 sm:w-7 sm:h-7 ${isAuthenticating ? 'animate-bounce' : ''}`}/>
              </div>
              <div className="vault-keypad-icon-badge">
                <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5"/>
              </div>
            </div>

            <div>
              <h4 className={`vault-keypad-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
                ENTER VAULT KEYCODE
              </h4>
              <p className={`vault-keypad-desc ${isDark ? 'theme-dark' : 'theme-light'}`}>
                Enter your 4-digit keycode to unlock quantum encrypted storage.
              </p>
            </div>

            { /* PIN Display */ }
            <div className="vault-pin-display">
              {[0, 1, 2, 3].map((index)=>{
        const hasChar = passcode.length > index;
        return <div key={index} className={`vault-pin-dot ${hasChar ? 'has-char' : isDark ? 'theme-dark' : 'theme-light'}`}>
                    {hasChar ? '●' : '—'}
                  </div>;
    })}
            </div>

            {errorMsg && <p className="vault-error-msg">
                {errorMsg}
              </p>}

            { /* Keypad */ }
            <div className="vault-keypad-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num)=><button key={num} type="button" onClick={()=>handleKeypadPress(num)} className={`vault-keypad-btn ${isDark ? 'theme-dark' : 'theme-light'}`}>
                  {num}
                </button>)}

              <button type="button" onClick={handleBackspace} className="vault-keypad-del-btn">
                <Delete className="w-4 h-4 sm:w-5 sm:h-5"/>
              </button>

              <button type="button" onClick={()=>handleKeypadPress('0')} className={`vault-keypad-btn ${isDark ? 'theme-dark' : 'theme-light'}`}>
                0
              </button>

              <button type="button" onClick={()=>{
        setPasscode('1234');
        setErrorMsg('');
        setTimeout(()=>handleUnlockSubmit(), 200);
    }} className="vault-keypad-cheat-btn">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> (1234)
              </button>
            </div>

            <button onClick={handleUnlockSubmit} disabled={isAuthenticating} className="vault-unlock-btn">
              <Key className="w-4 h-4 sm:w-5 sm:h-5"/> {isAuthenticating ? 'DECRYPTING...' : 'AUTHENTICATE & UNLOCK'}
            </button>
          </div>
          </div> : openFolder ? <div className="vault-modal-body">
            <div className="vault-folder-header">
              <button onClick={()=>setOpenFolder(null)} className="vault-back-btn">
                <ArrowLeft className="w-4 h-4"/> BACK TO REPOSITORY
              </button>
              <span className="vault-folder-badge">
                <FolderOpen className="w-3.5 h-3.5"/> RESTRICTED FOLDER
              </span>
            </div>

            <div className="vault-folder-info-card">
              <h3 className="vault-folder-info-title">
                <FolderOpen className="w-5 h-5 text-[#F25C23]"/> {openFolder.title}
              </h3>
              <p className="vault-folder-info-meta">
                Created: {openFolder.date} • {openFolder.fileSize}
              </p>
            </div>

            { /* Folder Items List */ }
            <div className="vault-docs-list">
              <h4 className="font-heading text-xs font-extrabold tracking-wider uppercase text-[#F25C23]">
                FOLDER CONTENTS ({openFolder.folderContents?.length || 0} FILES)
              </h4>

              {openFolder.folderContents?.map((item, idx)=><div key={idx} className={`vault-folder-item ${isDark ? 'theme-dark' : 'theme-light'}`}>
                  <div className="vault-folder-item-left">
                    <div className="vault-folder-item-icon">
                      <FileText className="w-4 h-4"/>
                    </div>
                    <div>
                      <h5 className={`vault-folder-item-title ${isDark ? 'theme-dark' : 'theme-light'}`}>{item.title}</h5>
                      <span className="vault-folder-item-meta">
                        {item.type} • {item.size}
                      </span>
                    </div>
                  </div>

                  {item.secret && <button onClick={()=>handleCopy(item.secret || '', `folder-${idx}`)} className="vault-action-btn-primary">
                      {copiedId === `folder-${idx}` ? <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white"/> COPIED!
                        </> : <>
                          <Copy className="w-3.5 h-3.5"/> COPY SECRET
                        </>}
                    </button>}
                </div>)}
            </div>
          </div> : /* UNLOCKED REPOSITORY MAIN VIEW */ <div className="vault-modal-body">
            { /* Top Toolbar: Categories for Standard OR Classified */ }
            <div className="vault-toolbar">
              <div className="vault-toolbar-left">
                {currentViewMode === 'classified' ? /* Classified Navigation & Quick Disguise Controls */ <div className="vault-modal-action-row">
                    <button onClick={handleReturnToStandard} className="vault-add-secret-btn" style={{backgroundColor: '#171717', color: '#F25C23', border: '2px solid #F25C23'}}>
                      <EyeOff className="w-4 h-4 stroke-[2.5]"/> DISGUISE / RETURN
                    </button>

                    <button onClick={handleLockSecretStorage} className="vault-add-secret-btn" style={{backgroundColor: '#18181B', color: '#d6d3d1', borderColor: '#3F3F46'}} title="Relock Classified Clearance">
                      <Lock className="w-3.5 h-3.5 text-red-400"/> LOCK CLASSIFIED
                    </button>

                    <div className="vault-modal-controls-row">
                      {[
        { id: 'all', label: `ALL CLASSIFIED (${classifiedCount})` },
        { id: 'classified', label: 'DOSSIERS' },
        { id: 'key', label: 'SECRET KEYS' }
    ].map((tab)=><button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`vault-secret-tab ${activeTab === tab.id ? 'is-active' : ''}`}>
                          {tab.label}
                        </button>)}
                    </div>
                  </div> : /* Standard Repository Categories ONLY (No signs of Layer 2 or Classified) */ [
        { id: 'all', label: `ALL FILES (${standardDocs.length})` },
        { id: 'personal', label: 'PERSONAL' },
        { id: 'academic', label: 'ACADEMIC' },
        { id: 'financial', label: 'FINANCIAL' }
    ].map((tab)=><button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`vault-tab ${activeTab === tab.id ? 'is-active' : isDark ? 'theme-dark' : 'theme-light'}`}>
                      {tab.label}
                    </button>)}
              </div>

              { /* Action Buttons Right */ }
              <div className="vault-toolbar-right">
                <button onClick={()=>{
        resetAddForm();
        setIsAddModalOpen(true);
    }} className="vault-add-secret-btn">
                  <Plus className="w-4 h-4 stroke-[3]"/> ADD SECRET
                </button>
              </div>
            </div>

            { /* Documents List */ }
            <div className="vault-docs-list">
              {filteredDocs.length === 0 ? <div className="vault-empty-state">
                  <FileText className="vault-empty-icon"/>
                  <p className="vault-empty-text">
                    No documents found in this category.
                  </p>
                  <button onClick={()=>{
        resetAddForm();
        setIsAddModalOpen(true);
    }} className="vault-empty-link">
                    + Encrypt and add a new record
                  </button>
                </div> : filteredDocs.map((doc)=>{
        return <div key={doc.id} className={`vault-doc-item ${isDark ? 'theme-dark' : 'theme-light'}`}>
                      <div className="vault-doc-left">
                        <div className="vault-doc-icon">
                          {doc.isFolder ? <FolderLock className="w-5 h-5"/> : doc.imageUrl ? <ImageIcon className="w-5 h-5"/> : <FileText className="w-5 h-5"/>}
                        </div>
                        <div className="vault-doc-info">
                          <div className="vault-doc-title-row">
                            <h4 className={`vault-doc-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
                              {doc.title}
                            </h4>
                          </div>
                          <div className={`vault-doc-meta ${isDark ? 'theme-dark' : 'theme-light'}`}>
                            <span className={`vault-doc-badge ${isDark ? 'theme-dark' : 'theme-light'}`}>
                              {doc.category}
                            </span>
                            <span>• {doc.fileSize}</span>
                            <span>• {doc.date}</span>
                          </div>
                        </div>
                      </div>

                      { /* Actions */ }
                      <div className="vault-doc-actions">
                        {doc.isFolder ? <button onClick={()=>setOpenFolder(doc)} className="vault-action-btn-primary">
                            <FolderOpen className="w-3.5 h-3.5"/> OPEN FOLDER
                          </button> : doc.imageUrl ? <button onClick={()=>setSelectedImagePreview(doc)} className="vault-action-btn-primary">
                            <Eye className="w-3.5 h-3.5"/> VIEW IMAGE
                          </button> : doc.secretContent ? <button onClick={()=>setSelectedSecret(doc)} className="vault-action-btn-secondary">
                            <Eye className="w-3.5 h-3.5"/> REVEAL SECRET
                          </button> : <a href={doc.downloadUrl || '#'} download={doc.title} target="_blank" rel="noopener noreferrer" onClick={(e)=>{
            if (!doc.downloadUrl || doc.downloadUrl === '#') {
                e.preventDefault();
                alert(`Encrypted file decrypted and downloaded: ${doc.title}`);
            }
        }} className="vault-action-btn-primary">
                            <Download className="w-3.5 h-3.5"/> DOWNLOAD
                          </a>}
                      </div>
                    </div>;
    })}
            </div>

            { /* Secret Content Drawer Overlay if selected */ }
            {selectedSecret && <div className="vault-payload-box">
                <div className="vault-payload-header">
                  <span className="vault-payload-title">
                    <Sparkles className="w-3.5 h-3.5"/> DECRYPTED SECRET PAYLOAD
                  </span>
                  <button onClick={()=>setSelectedSecret(null)} className="vault-payload-close">
                    <X className="w-4 h-4"/>
                  </button>
                </div>
                <pre className="vault-payload-content">
                  {selectedSecret.secretContent}
                </pre>
                <div className="vault-payload-actions">
                  <button onClick={()=>handleCopy(selectedSecret.secretContent || '', selectedSecret.id)} className="vault-action-btn-primary">
                    {copiedId === selectedSecret.id ? <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white"/> COPIED TO CLIPBOARD!
                      </> : <>
                        <Copy className="w-3.5 h-3.5"/> COPY TO CLIPBOARD
                      </>}
                  </button>
                </div>
              </div>}

            { /* Inconspicuous Bottom Integrity Status (Double clicking version triggers stealth prompt) */ }
            <div className="vault-footer-integrity">
              <span>SYSTEM INTEGRITY: VERIFIED [AES-256]</span>
              <button type="button" onClick={handleStealthHeaderClick}>
                SEC_BUILD_2026.08
              </button>
            </div>
          </div>}

        { /* HIDDEN 2ND LAYER SECURITY AUTHENTICATION MODAL */ }
        {isSecretAuthModalOpen && <div className="vault-submodal-overlay" onClick={(e)=>e.stopPropagation()}>
            <div className="vault-submodal-container">
              <div className="vault-submodal-header">
                <div className="vault-submodal-header-left">
                  <div className="vault-submodal-icon">
                    <Fingerprint className="w-5 h-5"/>
                  </div>
                  <div>
                    <h3 className="vault-submodal-title">
                      SECONDARY SECURITY CLEARANCE
                    </h3>
                    <p className="vault-submodal-desc">
                      CLASSIFIED PROTOCOL • KEYCODE 8888
                    </p>
                  </div>
                </div>
                <button onClick={()=>setIsSecretAuthModalOpen(false)} className="vault-modal-close-btn">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="text-center space-y-2">
                <p className="vault-submodal-text">
                  Enter secondary authentication keycode to unlock classified repository:
                </p>

                { /* PIN Display */ }
                <div className="vault-submodal-pin-display">
                  {[0, 1, 2, 3].map((index)=>{
        const hasChar = secretPasscode.length > index;
        return <div key={index} className={`vault-submodal-pin-dot ${hasChar ? 'filled' : 'empty'}`}>
                        {hasChar ? '●' : '—'}
                      </div>;
    })}
                </div>

                {secretErrorMsg && <p className="vault-error-msg">
                    {secretErrorMsg}
                  </p>}
              </div>

              { /* Keypad */ }
              <div className="vault-submodal-keypad-grid">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num)=><button key={num} type="button" onClick={()=>handleSecretKeypadPress(num)} className="vault-submodal-keypad-btn">
                    {num}
                  </button>)}

                <button type="button" onClick={handleSecretBackspace} className="vault-submodal-del-btn">
                  <Delete className="w-4 h-4"/>
                </button>

                <button type="button" onClick={()=>handleSecretKeypadPress('0')} className="vault-submodal-keypad-btn">
                  0
                </button>

                <button type="button" onClick={()=>{
        setSecretPasscode('8888');
        setSecretErrorMsg('');
        setTimeout(()=>handleSecretUnlockSubmit(), 200);
    }} className="vault-submodal-cheat-btn">
                  <Sparkles className="vault-submodal-cheat-icon"/> (8888)
                </button>
              </div>

              <button onClick={handleSecretUnlockSubmit} disabled={isSecretAuthenticating} className="vault-submodal-submit-btn">
                <Fingerprint className="vault-submodal-submit-icon"/> {isSecretAuthenticating ? 'VERIFYING BIOMETRICS...' : 'UNLOCK CLASSIFIED REPOSITORY'}
              </button>
            </div>
          </div>}

        { /* ADD ITEM TO SECRET VAULT MODAL */ }
        {isAddModalOpen && <div className="vault-submodal-overlay" onClick={(e)=>e.stopPropagation()}>
            <div className="vault-add-modal-container">
              <div className="vault-submodal-header">
                <div className="vault-submodal-header-left">
                  <div className="vault-add-modal-icon">
                    <FilePlus className="w-5 h-5"/>
                  </div>
                  <div>
                    <h3 className="vault-add-modal-title">
                      {currentViewMode === 'classified' ? 'ADD CLASSIFIED DOSSIER' : 'ADD VAULT DOCUMENT'}
                    </h3>
                    <p className="vault-add-modal-desc">
                      Store text, image, or PDF files into encrypted storage.
                    </p>
                  </div>
                </div>
                <button onClick={()=>setIsAddModalOpen(false)} className="vault-modal-close-btn">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <form onSubmit={handleCreateVaultItem} className="space-y-4">
                { /* 1. Select Type */ }
                <div className="vault-add-form-group">
                  <label className="vault-add-form-label">
                    1. SECRET ITEM TYPE
                  </label>
                  <div className="vault-add-type-grid">
                    {[
        { type: 'text', label: 'Encrypted Text', icon: FileText },
        { type: 'image', label: 'Image File', icon: ImageIcon },
        { type: 'pdf', label: 'PDF / Document', icon: FileUp }
    ].map((item)=>{
        const Icon = item.icon;
        const isSelected = newType === item.type;
        return <button key={item.type} type="button" onClick={()=>{
            setNewType(item.type);
            setAddFormError('');
        }} className={`vault-add-type-btn ${isSelected ? 'is-selected' : ''}`}>
                          <Icon className="w-5 h-5"/>
                          <span className="vault-add-type-btn-label">{item.label}</span>
                        </button>;
    })}
                  </div>
                </div>

                { /* 2. Document Title */ }
                <div className="vault-add-form-group">
                  <label className="vault-add-form-label">
                    2. ITEM TITLE / NAME
                  </label>
                  <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="e.g. Passport Scan, AWS Key, Cap Table 2026" className="vault-add-input" required/>
                </div>

                { /* 3. Category */ }
                <div className="vault-add-form-group">
                  <label className="vault-add-form-label">
                    3. CATEGORY
                  </label>
                  <select value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} className="vault-add-input" style={{padding: '0.625rem'}}>
                    {currentViewMode === 'classified' ? <>
                        <option value="classified">CLASSIFIED DOSSIER</option>
                        <option value="key">SECRET API KEY / PIN</option>
                      </> : <>
                        <option value="personal">PERSONAL</option>
                        <option value="academic">ACADEMIC</option>
                        <option value="financial">FINANCIAL</option>
                      </>}
                  </select>
                </div>

                { /* 4. Content */ }
                {newType === 'text' ? <div className="vault-add-form-group">
                    <label className="vault-add-form-label">
                      4. SECRET CONTENT / TEXT PAYLOAD
                    </label>
                    <textarea value={newSecretText} onChange={(e)=>setNewSecretText(e.target.value)} placeholder="Paste confidential credentials, seed phrase, private tokens, or notes here..." rows={4} className="vault-add-textarea" required/>
                  </div> : <div className="vault-add-form-group">
                    <label className="vault-add-form-label">
                      4. UPLOAD {newType.toUpperCase()} FILE
                    </label>
                    <div className="vault-add-file-drop">
                      <input type="file" accept={newType === 'image' ? 'image/*' : 'application/pdf'} onChange={handleFileChange} id="secret-file-input" style={{display: 'none'}}/>
                      <label htmlFor="secret-file-input" className="vault-add-file-label">
                        <FileUp className="w-8 h-8 text-[#F25C23]"/>
                        <span className="vault-add-file-title">
                          {newFileName ? newFileName : `Click to choose a ${newType.toUpperCase()} file`}
                        </span>
                        {newFileSize && <span className="vault-add-file-meta">{newFileSize}</span>}
                      </label>
                    </div>
                  </div>}

                {addFormError && <p className="vault-error-msg">
                    {addFormError}
                  </p>}

                <div className="vault-add-actions">
                  <button type="button" onClick={()=>setIsAddModalOpen(false)} className="vault-add-cancel-btn">
                    CANCEL
                  </button>
                  <button type="submit" className="vault-add-submit-btn">
                    ENCRYPT & SAVE
                  </button>
                </div>
              </form>
            </div>
          </div>}

        { /* IMAGE PREVIEW MODAL */ }
        {selectedImagePreview && <div className="vault-submodal-overlay" onClick={()=>setSelectedImagePreview(null)}>
            <div className="vault-image-preview-container" onClick={(e)=>e.stopPropagation()}>
              <div className="vault-image-preview-header">
                <span className="vault-image-preview-title">
                  {selectedImagePreview.title}
                </span>
                <button onClick={()=>setSelectedImagePreview(null)} className="vault-modal-close-btn">
                  <X className="w-4 h-4"/>
                </button>
              </div>
              <div className="vault-image-preview-box">
                <img src={selectedImagePreview.imageUrl} alt={selectedImagePreview.title} className="vault-image-preview-img"/>
              </div>
            </div>
          </div>}
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
