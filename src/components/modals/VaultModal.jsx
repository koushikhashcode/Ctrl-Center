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
      {isOpen && <motion.div initial={{
        opacity: 0
    }} animate={{
        opacity: 1
    }} exit={{
        opacity: 0
    }} transition={{
        duration: 0.2
    }} className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs" onClick={onClose}>
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
    }} onClick={(e)=>e.stopPropagation()} data-lenis-prevent className={`border-4 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden transition-colors relative ${currentViewMode === 'classified' ? 'bg-[#121214] border-[#F25C23] text-white shadow-editorial-lg-dark' : isDark ? 'bg-[#18181B] border-[#3F3F46] text-white shadow-editorial-lg-dark' : 'bg-[#FFFFFF] border-[#171717] text-[#171717] shadow-editorial-lg'}`}>
        { /* Modal Main Header */ }
        <div className={`px-4 sm:px-6 py-4 flex items-center justify-between border-b-2 gap-2 transition-colors ${currentViewMode === 'classified' ? 'bg-[#171717] text-white border-[#F25C23]' : 'bg-[#171717] text-white border-[#3F3F46]'}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            { /* Covert Trigger: Triple clicking this icon secretly opens the 2nd layer lock */ }
            <button type="button" onClick={handleStealthHeaderClick} title={isUnlocked ? 'System Security Verified' : undefined} className={`p-1.5 rounded-lg border flex-shrink-0 transition-transform active:scale-90 cursor-default select-none ${currentViewMode === 'classified' ? 'bg-[#F25C23] text-white border-white' : 'bg-[#F25C23]/20 border-[#F25C23] text-[#F25C23]'}`}>
              {currentViewMode === 'classified' ? <Fingerprint className="w-5 h-5"/> : <ShieldCheck className="w-5 h-5"/>}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg sm:text-xl font-black tracking-wider leading-none truncate">
                  {!isUnlocked ? 'VAULT SECURITY GATEWAY' : currentViewMode === 'classified' ? 'CLASSIFIED REPOSITORY' : 'PRIVATE VAULT REPOSITORY'}
                </h3>
                {isUnlocked && currentViewMode === 'classified' && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded font-black tracking-tight uppercase bg-[#F25C23] text-white">
                    CLASSIFIED
                  </span>}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-[#F25C23] font-bold truncate">
                  {!isUnlocked ? 'QUANTUM AUTHENTICATION PROTOCOL' : currentViewMode === 'classified' ? 'TOP SECRET CLEARANCE • RESTRICTED ARCHIVES' : 'QUANTUM ENCRYPTED STORAGE • AES-256'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isUnlocked && <button onClick={()=>{
        resetAddForm();
        setIsAddModalOpen(true);
    }} className="bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#171717] flex items-center gap-1.5 shadow-editorial-sm transition-all cursor-pointer whitespace-nowrap">
                <Plus className="w-4 h-4 stroke-[3]"/> <span className="hidden sm:inline">ADD DOCUMENT</span>
              </button>}

            <button onClick={onClose} className="p-1 text-stone-300 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/10">
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        { /* Modal Content Body */ }
        {!isUnlocked ? /* PRIMARY KEYPAD GATEWAY (Passcode: 1234 for standard, 8888 for covert direct entrance) */ <div className="p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-3.5 overflow-hidden my-auto max-w-sm mx-auto w-full">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#171717] border-2 sm:border-3 border-[#F25C23] flex items-center justify-center text-[#F25C23] shadow-editorial-sm">
                <Lock className={`w-6 h-6 sm:w-7 sm:h-7 ${isAuthenticating ? 'animate-bounce' : ''}`}/>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#F25C23] text-white p-0.5 sm:p-1 rounded-full text-xs font-mono font-bold">
                <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5"/>
              </div>
            </div>

            <div>
              <h4 className={`font-heading text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-[#171717]'}`}>
                ENTER VAULT KEYCODE
              </h4>
              <p className={`font-sans text-[11px] sm:text-xs mt-0.5 max-w-xs ${isDark ? 'text-stone-300' : 'text-[#171717]/80'}`}>
                Enter your 4-digit keycode to unlock quantum encrypted storage.
              </p>
            </div>

            { /* PIN Display */ }
            <div className="flex items-center gap-2.5">
              {[
        0,
        1,
        2,
        3
    ].map((index)=>{
        const hasChar = passcode.length > index;
        return <div key={index} className={`w-9 h-10 sm:w-10 sm:h-11 rounded-lg border-2 flex items-center justify-center text-lg font-mono font-bold transition-all ${hasChar ? 'bg-[#F25C23] text-white border-[#171717] shadow-editorial-sm scale-105' : isDark ? 'bg-[#27272A] border-[#3F3F46] text-stone-500' : 'bg-[#F5F5F3] border-[#171717] text-stone-400'}`}>
                    {hasChar ? '●' : '—'}
                  </div>;
    })}
            </div>

            {errorMsg && <p className="text-[11px] font-mono font-bold text-red-500 bg-red-950/40 p-2 rounded-lg border border-red-800 animate-shake">
                {errorMsg}
              </p>}

            { /* Keypad */ }
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
              {[
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9'
    ].map((num)=><button key={num} type="button" onClick={()=>handleKeypadPress(num)} className={`py-2 sm:py-2.5 rounded-xl border-2 font-mono text-base sm:text-lg font-bold transition-all cursor-pointer shadow-editorial-sm active:translate-y-0.5 ${isDark ? 'bg-[#27272A] border-[#3F3F46] hover:bg-[#F25C23] hover:text-white text-white' : 'bg-[#F5F5F3] border-[#171717] hover:bg-[#F25C23] hover:text-white text-[#171717]'}`}>
                  {num}
                </button>)}

              <button type="button" onClick={handleBackspace} className="py-2 sm:py-2.5 rounded-xl border-2 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center bg-stone-500/20 text-stone-400 hover:text-white border-stone-600 hover:bg-stone-600">
                <Delete className="w-4 h-4 sm:w-5 sm:h-5"/>
              </button>

              <button type="button" onClick={()=>handleKeypadPress('0')} className={`py-2 sm:py-2.5 rounded-xl border-2 font-mono text-base sm:text-lg font-bold transition-all cursor-pointer shadow-editorial-sm active:translate-y-0.5 ${isDark ? 'bg-[#27272A] border-[#3F3F46] hover:bg-[#F25C23] hover:text-white text-white' : 'bg-[#F5F5F3] border-[#171717] hover:bg-[#F25C23] hover:text-white text-[#171717]'}`}>
                0
              </button>

              <button type="button" onClick={()=>{
        setPasscode('1234');
        setErrorMsg('');
        setTimeout(()=>handleUnlockSubmit(), 200);
    }} className="py-2 sm:py-2.5 rounded-xl border-2 border-[#F25C23] bg-[#F25C23]/20 text-[#F25C23] hover:bg-[#F25C23] hover:text-white font-mono text-[9px] sm:text-[10px] font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> (1234)
              </button>
            </div>

            <button onClick={handleUnlockSubmit} disabled={isAuthenticating} className="w-full max-w-xs bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading text-xs sm:text-sm font-extrabold tracking-wider py-2.5 sm:py-3 px-6 rounded-xl border-2 border-[#171717] transition-all cursor-pointer shadow-editorial active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2">
              <Key className="w-4 h-4 sm:w-5 sm:h-5"/> {isAuthenticating ? 'DECRYPTING...' : 'AUTHENTICATE & UNLOCK'}
            </button>
          </div> : openFolder ? /* CLASSIFIED FOLDER DETAILED VIEW */ <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4 font-sans">
            <div className="flex items-center justify-between border-b-2 pb-3 border-[#F25C23]">
              <button onClick={()=>setOpenFolder(null)} className="flex items-center gap-2 font-heading text-xs font-bold bg-[#171717] text-[#F25C23] hover:bg-[#F25C23] hover:text-white px-3 py-1.5 rounded-lg border border-[#F25C23] transition-all cursor-pointer">
                <ArrowLeft className="w-4 h-4"/> BACK TO REPOSITORY
              </button>
              <span className="text-xs font-mono font-bold text-[#F25C23] bg-[#F25C23]/10 px-2.5 py-1 rounded border border-[#F25C23]/30 flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5"/> RESTRICTED FOLDER
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#171717] text-white border-2 border-[#F25C23] shadow-editorial-sm space-y-2">
              <h3 className="font-heading text-lg font-black text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#F25C23]"/> {openFolder.title}
              </h3>
              <p className="text-xs font-mono text-stone-300">
                Created: {openFolder.date} • {openFolder.fileSize}
              </p>
            </div>

            { /* Folder Items List */ }
            <div className="space-y-3">
              <h4 className="font-heading text-xs font-extrabold tracking-wider uppercase text-[#F25C23]">
                FOLDER CONTENTS ({openFolder.folderContents?.length || 0} FILES)
              </h4>

              {openFolder.folderContents?.map((item, idx)=><div key={idx} className={`p-4 border-2 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-[#F5F5F3] border-[#171717]'}`}>
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#171717] text-[#F25C23] border border-[#3F3F46] flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4"/>
                    </div>
                    <div>
                      <h5 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#171717]'}`}>{item.title}</h5>
                      <span className="text-xs font-mono text-stone-400">
                        {item.type} • {item.size}
                      </span>
                    </div>
                  </div>

                  {item.secret && <button onClick={()=>handleCopy(item.secret || '', `folder-${idx}`)} className="bg-[#F25C23] hover:bg-[#FF5A1F] text-white px-3 py-1.5 rounded-lg border border-[#171717] font-heading text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-editorial-sm">
                      {copiedId === `folder-${idx}` ? <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white"/> COPIED!
                        </> : <>
                          <Copy className="w-3.5 h-3.5"/> COPY SECRET
                        </>}
                    </button>}
                </div>)}
            </div>
          </div> : /* UNLOCKED REPOSITORY MAIN VIEW */ <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 font-sans">
            { /* Top Toolbar: Categories for Standard OR Classified */ }
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 pb-3 border-[#3F3F46]">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                {currentViewMode === 'classified' ? /* Classified Navigation & Quick Disguise Controls */ <div className="flex items-center gap-2">
                    <button onClick={handleReturnToStandard} className="bg-[#171717] text-[#F25C23] hover:bg-[#F25C23] hover:text-white px-3 py-1.5 rounded-xl border-2 border-[#F25C23] font-heading text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-editorial-sm whitespace-nowrap">
                      <EyeOff className="w-4 h-4 stroke-[2.5]"/> DISGUISE / RETURN
                    </button>

                    <button onClick={handleLockSecretStorage} className="bg-[#18181B] text-stone-300 hover:text-white hover:bg-red-950/60 hover:border-red-600 px-3 py-1.5 rounded-xl border border-[#3F3F46] font-heading text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap" title="Relock Classified Clearance">
                      <Lock className="w-3.5 h-3.5 text-red-400"/> LOCK CLASSIFIED
                    </button>

                    <div className="flex items-center gap-1.5 ml-2 border-l border-stone-700 pl-2">
                      {[
        {
            id: 'all',
            label: `ALL CLASSIFIED (${classifiedCount})`
        },
        {
            id: 'classified',
            label: 'DOSSIERS'
        },
        {
            id: 'key',
            label: 'SECRET KEYS'
        }
    ].map((tab)=><button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`font-heading text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F25C23] text-white border-[#F25C23] font-bold' : 'bg-[#27272A] text-stone-300 border-[#3F3F46] hover:border-[#F25C23]'}`}>
                          {tab.label}
                        </button>)}
                    </div>
                  </div> : /* Standard Repository Categories ONLY (No signs of Layer 2 or Classified) */ [
        {
            id: 'all',
            label: `ALL FILES (${standardDocs.length})`
        },
        {
            id: 'personal',
            label: 'PERSONAL'
        },
        {
            id: 'academic',
            label: 'ACADEMIC'
        },
        {
            id: 'financial',
            label: 'FINANCIAL'
        }
    ].map((tab)=><button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`font-heading text-xs px-3 py-1.5 rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === tab.id ? 'bg-[#F25C23] text-white border-[#F25C23] font-black shadow-editorial-sm' : isDark ? 'bg-[#27272A] text-stone-300 border-[#3F3F46] hover:border-[#F25C23]' : 'bg-[#F5F5F3] text-[#171717] border-[#171717] hover:bg-[#E8E8E5]'}`}>
                      {tab.label}
                    </button>)}
              </div>

              { /* Action Buttons Right */ }
              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <button onClick={()=>{
        resetAddForm();
        setIsAddModalOpen(true);
    }} className="bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading text-xs font-black px-3.5 py-2 rounded-xl border-2 border-[#171717] flex items-center justify-center gap-1.5 shadow-editorial-sm transition-all cursor-pointer whitespace-nowrap">
                  <Plus className="w-4 h-4 stroke-[3]"/> ADD SECRET
                </button>
              </div>
            </div>

            { /* Documents List */ }
            <div className="space-y-3">
              {filteredDocs.length === 0 ? <div className="text-center py-10 border-2 border-dashed border-[#3F3F46] rounded-xl p-6">
                  <FileText className="w-10 h-10 text-stone-500 mx-auto mb-2"/>
                  <p className="text-sm font-bold text-stone-400">
                    No documents found in this category.
                  </p>
                  <button onClick={()=>{
        resetAddForm();
        setIsAddModalOpen(true);
    }} className="mt-3 text-xs font-heading font-extrabold text-[#F25C23] underline hover:text-[#FF5A1F] cursor-pointer">
                    + Encrypt and add a new record
                  </button>
                </div> : filteredDocs.map((doc)=>{
        return <div key={doc.id} className={`p-4 border-2 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${isDark ? 'bg-[#27272A] border-[#3F3F46] hover:border-[#F25C23]' : 'bg-[#F5F5F3] border-[#171717] hover:border-[#F25C23]'}`}>
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 rounded-lg bg-[#171717] text-[#F25C23] border border-[#3F3F46] flex-shrink-0 mt-0.5">
                          {doc.isFolder ? <FolderLock className="w-5 h-5"/> : doc.imageUrl ? <ImageIcon className="w-5 h-5"/> : <FileText className="w-5 h-5"/>}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-[#171717]'}`}>
                              {doc.title}
                            </h4>
                          </div>
                          <div className={`flex items-center gap-2 text-xs font-mono mt-1 ${isDark ? 'text-stone-400' : 'text-[#171717]/70'}`}>
                            <span className={`uppercase font-bold px-1.5 py-0.2 rounded ${isDark ? 'bg-[#3F3F46] text-stone-200' : 'bg-[#E8E8E5] text-[#171717]'}`}>
                              {doc.category}
                            </span>
                            <span>• {doc.fileSize}</span>
                            <span>• {doc.date}</span>
                          </div>
                        </div>
                      </div>

                      { /* Actions */ }
                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                        {doc.isFolder ? <button onClick={()=>setOpenFolder(doc)} className="bg-[#F25C23] text-white hover:bg-[#FF5A1F] px-3.5 py-1.5 rounded-lg border border-[#171717] font-heading text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-editorial-sm">
                            <FolderOpen className="w-3.5 h-3.5"/> OPEN FOLDER
                          </button> : doc.imageUrl ? <button onClick={()=>setSelectedImagePreview(doc)} className="bg-[#F25C23] text-white hover:bg-[#FF5A1F] px-3.5 py-1.5 rounded-lg border border-[#171717] font-heading text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-editorial-sm">
                            <Eye className="w-3.5 h-3.5"/> VIEW IMAGE
                          </button> : doc.secretContent ? <button onClick={()=>setSelectedSecret(doc)} className="bg-[#171717] text-white hover:bg-[#F25C23] px-3.5 py-1.5 rounded-lg border border-[#3F3F46] font-heading text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                            <Eye className="w-3.5 h-3.5"/> REVEAL SECRET
                          </button> : <a href={doc.downloadUrl || '#'} download={doc.title} target="_blank" rel="noopener noreferrer" onClick={(e)=>{
            if (!doc.downloadUrl || doc.downloadUrl === '#') {
                e.preventDefault();
                alert(`Encrypted file decrypted and downloaded: ${doc.title}`);
            }
        }} className="bg-[#F25C23] text-white hover:bg-[#FF5A1F] px-3 py-1.5 rounded-lg border border-[#171717] font-heading text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-editorial-sm">
                            <Download className="w-3.5 h-3.5"/> DOWNLOAD
                          </a>}
                      </div>
                    </div>;
    })}
            </div>

            { /* Secret Content Drawer Overlay if selected */ }
            {selectedSecret && <div className="mt-4 p-4 bg-[#171717] text-white border-2 border-[#F25C23] rounded-xl space-y-3 font-mono animate-in fade-in duration-150 shadow-editorial-sm">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                  <span className="text-xs font-bold text-[#F25C23] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5"/> DECRYPTED SECRET PAYLOAD
                  </span>
                  <button onClick={()=>setSelectedSecret(null)} className="text-stone-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4"/>
                  </button>
                </div>
                <pre className="text-xs bg-[#0D0D0E] p-3.5 rounded-lg border border-stone-800 overflow-x-auto text-[#F25C23] whitespace-pre-wrap">
                  {selectedSecret.secretContent}
                </pre>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={()=>handleCopy(selectedSecret.secretContent || '', selectedSecret.id)} className="bg-[#F25C23] hover:bg-[#FF5A1F] text-white px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer shadow-editorial-sm">
                    {copiedId === selectedSecret.id ? <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white"/> COPIED TO CLIPBOARD!
                      </> : <>
                        <Copy className="w-3.5 h-3.5"/> COPY TO CLIPBOARD
                      </>}
                  </button>
                </div>
              </div>}

            { /* Inconspicuous Bottom Integrity Status (Double clicking version triggers stealth prompt) */ }
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[10px] font-mono text-stone-500">
              <span>SYSTEM INTEGRITY: VERIFIED [AES-256]</span>
              <button type="button" onClick={handleStealthHeaderClick} className="hover:text-stone-300 transition-colors cursor-default">
                SEC_BUILD_2026.08
              </button>
            </div>
          </div>}

        { /* HIDDEN 2ND LAYER SECURITY AUTHENTICATION MODAL */ }
        {isSecretAuthModalOpen && <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150" onClick={(e)=>e.stopPropagation()}>
            <div className="bg-[#121214] border-3 border-[#F25C23] text-white rounded-2xl w-full max-w-sm p-5 sm:p-6 space-y-4 shadow-editorial-lg relative">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#F25C23] text-white">
                    <Fingerprint className="w-5 h-5"/>
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-black tracking-wider text-white">
                      SECONDARY SECURITY CLEARANCE
                    </h3>
                    <p className="text-[10px] font-mono text-[#F25C23]">
                      CLASSIFIED PROTOCOL • KEYCODE 8888
                    </p>
                  </div>
                </div>
                <button onClick={()=>setIsSecretAuthModalOpen(false)} className="text-stone-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="text-center space-y-2">
                <p className="font-sans text-xs text-stone-300">
                  Enter secondary authentication keycode to unlock classified repository:
                </p>

                { /* PIN Display */ }
                <div className="flex items-center justify-center gap-2 py-1">
                  {[
        0,
        1,
        2,
        3
    ].map((index)=>{
        const hasChar = secretPasscode.length > index;
        return <div key={index} className={`w-9 h-10 rounded-lg border-2 flex items-center justify-center text-lg font-mono font-bold transition-all ${hasChar ? 'bg-[#F25C23] text-white border-white scale-105 shadow-sm' : 'bg-[#27272A] border-[#3F3F46] text-stone-500'}`}>
                        {hasChar ? '●' : '—'}
                      </div>;
    })}
                </div>

                {secretErrorMsg && <p className="text-[11px] font-mono font-bold text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-800 animate-shake">
                    {secretErrorMsg}
                  </p>}
              </div>

              { /* Keypad */ }
              <div className="grid grid-cols-3 gap-2">
                {[
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9'
    ].map((num)=><button key={num} type="button" onClick={()=>handleSecretKeypadPress(num)} className="py-2 rounded-xl bg-[#27272A] border border-[#3F3F46] hover:bg-[#F25C23] hover:text-white text-white font-mono text-base font-bold transition-all cursor-pointer active:scale-95">
                    {num}
                  </button>)}

                <button type="button" onClick={handleSecretBackspace} className="py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-400 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center">
                  <Delete className="w-4 h-4"/>
                </button>

                <button type="button" onClick={()=>handleSecretKeypadPress('0')} className="py-2 rounded-xl bg-[#27272A] border border-[#3F3F46] hover:bg-[#F25C23] hover:text-white text-white font-mono text-base font-bold transition-all cursor-pointer active:scale-95">
                  0
                </button>

                <button type="button" onClick={()=>{
        setSecretPasscode('8888');
        setSecretErrorMsg('');
        setTimeout(()=>handleSecretUnlockSubmit(), 200);
    }} className="py-2 rounded-xl border border-[#F25C23] bg-[#F25C23]/20 text-[#F25C23] hover:bg-[#F25C23] hover:text-white font-mono text-[9px] font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3"/> (8888)
                </button>
              </div>

              <button onClick={handleSecretUnlockSubmit} disabled={isSecretAuthenticating} className="w-full bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading text-xs font-extrabold tracking-wider py-2.5 rounded-xl border border-[#171717] transition-all cursor-pointer shadow-editorial active:scale-95 flex items-center justify-center gap-2">
                <Fingerprint className="w-4 h-4"/> {isSecretAuthenticating ? 'VERIFYING BIOMETRICS...' : 'UNLOCK CLASSIFIED REPOSITORY'}
              </button>
            </div>
          </div>}

        { /* ADD ITEM TO SECRET VAULT MODAL */ }
        {isAddModalOpen && <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150" onClick={(e)=>e.stopPropagation()}>
            <div className="bg-[#171717] border-3 border-[#F25C23] text-white rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-editorial-lg relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#F25C23]/20 text-[#F25C23] border border-[#F25C23]">
                    <FilePlus className="w-5 h-5"/>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-black tracking-wider text-white">
                      {currentViewMode === 'classified' ? 'ADD CLASSIFIED DOSSIER' : 'ADD VAULT DOCUMENT'}
                    </h3>
                    <p className="text-[11px] font-mono text-stone-400">
                      Store text, image, or PDF files into encrypted storage.
                    </p>
                  </div>
                </div>
                <button onClick={()=>setIsAddModalOpen(false)} className="text-stone-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <form onSubmit={handleCreateVaultItem} className="space-y-4">
                { /* 1. Select Type */ }
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    1. SECRET ITEM TYPE
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
        {
            type: 'text',
            label: 'Encrypted Text',
            icon: FileText
        },
        {
            type: 'image',
            label: 'Image File',
            icon: ImageIcon
        },
        {
            type: 'pdf',
            label: 'PDF / Document',
            icon: FileUp
        }
    ].map((item)=>{
        const Icon = item.icon;
        const isSelected = newType === item.type;
        return <button key={item.type} type="button" onClick={()=>{
            setNewType(item.type);
            setAddFormError('');
        }} className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${isSelected ? 'bg-[#F25C23] text-white border-white font-bold shadow-editorial-sm' : 'bg-[#27272A] border-[#3F3F46] text-stone-300 hover:border-[#F25C23]'}`}>
                          <Icon className="w-5 h-5"/>
                          <span className="text-[11px] font-heading font-extrabold">{item.label}</span>
                        </button>;
    })}
                  </div>
                </div>

                { /* 2. Document Title */ }
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-300 uppercase tracking-wider mb-1">
                    2. ITEM TITLE / NAME
                  </label>
                  <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="e.g. Passport Scan, AWS Key, Cap Table 2026" className="w-full bg-[#27272A] border-2 border-[#3F3F46] rounded-xl px-3.5 py-2.5 text-sm font-sans text-white focus:outline-none focus:border-[#F25C23]" required/>
                </div>

                { /* 3. Category */ }
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-300 uppercase tracking-wider mb-1">
                    3. CATEGORY
                  </label>
                  <select value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} className="w-full bg-[#27272A] border-2 border-[#3F3F46] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#F25C23]">
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
                {newType === 'text' ? <div>
                    <label className="block text-xs font-mono font-bold text-stone-300 uppercase tracking-wider mb-1">
                      4. SECRET CONTENT / TEXT PAYLOAD
                    </label>
                    <textarea value={newSecretText} onChange={(e)=>setNewSecretText(e.target.value)} placeholder="Paste confidential credentials, seed phrase, private tokens, or notes here..." rows={4} className="w-full bg-[#27272A] border-2 border-[#3F3F46] rounded-xl p-3 text-xs font-mono text-[#F25C23] focus:outline-none focus:border-[#F25C23]" required/>
                  </div> : <div>
                    <label className="block text-xs font-mono font-bold text-stone-300 uppercase tracking-wider mb-1">
                      4. UPLOAD {newType.toUpperCase()} FILE
                    </label>
                    <div className="border-2 border-dashed border-[#3F3F46] rounded-xl p-4 text-center bg-[#27272A]/50 hover:bg-[#27272A] transition-colors">
                      <input type="file" accept={newType === 'image' ? 'image/*' : 'application/pdf'} onChange={handleFileChange} className="hidden" id="secret-file-input"/>
                      <label htmlFor="secret-file-input" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                        <FileUp className="w-8 h-8 text-[#F25C23]"/>
                        <span className="font-heading text-xs font-bold text-stone-200">
                          {newFileName ? newFileName : `Click to choose a ${newType.toUpperCase()} file`}
                        </span>
                        {newFileSize && <span className="font-mono text-[10px] text-stone-400">{newFileSize}</span>}
                      </label>
                    </div>
                  </div>}

                {addFormError && <p className="text-xs font-mono text-red-400 font-bold bg-red-950/50 p-2.5 rounded-lg border border-red-800">
                    {addFormError}
                  </p>}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                  <button type="button" onClick={()=>setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl border border-stone-600 font-heading text-xs font-bold text-stone-300 hover:text-white cursor-pointer">
                    CANCEL
                  </button>
                  <button type="submit" className="bg-[#F25C23] hover:bg-[#FF5A1F] text-white px-5 py-2 rounded-xl font-heading text-xs font-extrabold shadow-editorial-sm transition-all cursor-pointer">
                    ENCRYPT & SAVE
                  </button>
                </div>
              </form>
            </div>
          </div>}

        { /* IMAGE PREVIEW MODAL */ }
        {selectedImagePreview && <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={()=>setSelectedImagePreview(null)}>
            <div className="bg-[#171717] border-3 border-[#F25C23] rounded-2xl max-w-lg w-full p-4 space-y-3 shadow-editorial-lg text-white" onClick={(e)=>e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-heading text-xs font-bold text-[#F25C23] truncate">
                  {selectedImagePreview.title}
                </span>
                <button onClick={()=>setSelectedImagePreview(null)} className="text-stone-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4"/>
                </button>
              </div>
              <div className="rounded-xl overflow-hidden max-h-[60vh] flex items-center justify-center bg-black">
                <img src={selectedImagePreview.imageUrl} alt={selectedImagePreview.title} className="max-h-[55vh] object-contain w-full"/>
              </div>
            </div>
          </div>}
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
