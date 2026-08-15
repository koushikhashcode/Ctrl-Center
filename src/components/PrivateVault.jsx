/**
 * ==========================================
 * COMPONENT: PrivateVault
 * ==========================================
 * The tall secure documents section on the right side of the dashboard.
 */
import { VaultDial } from './VaultDial';
import { ShieldCheck, Unlock, Key, LockKeyhole } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const PrivateVault = ({ isUnlocked, documents, onOpenVaultModal, onLockVault })=>{
    const { isDark } = useTheme();
    const standardCount = documents.filter((d)=>!d.requiresLevel2 && d.category !== 'classified' && d.category !== 'key').length;
    return <div className={`p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden transition-colors ${isDark ? 'bg-[#18181B] text-white' : 'bg-[#FFFFFF] text-[#171717]'}`}>
      { /* Block Header */ }
      <div className="mt-1">
        <div className={`flex items-center justify-between border-b-2 pb-3 mb-2.5 ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
          <div className="flex items-center gap-2">
            <div className="bg-[#171717] text-[#F25C23] p-1.5 rounded-lg border border-[#F25C23]/40 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#F25C23]"/>
            </div>
            <div>
              <h2 className={`font-heading text-xl sm:text-2xl font-black tracking-wider leading-none ${isDark ? 'text-white' : 'text-[#171717]'}`}>
                PRIVATE VAULT
              </h2>
              <span className="text-[10px] font-mono text-[#F25C23] font-bold tracking-tight">
                QUANTUM ENCRYPTED STORAGE
              </span>
            </div>
          </div>
          {isUnlocked && <button onClick={onLockVault} className="text-xs font-mono font-bold bg-[#171717] text-[#F25C23] hover:bg-[#F25C23] hover:text-white px-2.5 py-1.5 rounded-md border border-[#F25C23] transition-all cursor-pointer flex items-center gap-1 shadow-sm">
              <LockKeyhole className="w-3.5 h-3.5"/> LOCK
            </button>}
        </div>

        <p className={`font-sans text-xs leading-snug font-medium ${isDark ? 'text-stone-300' : 'text-[#171717]/80'}`}>
          Encrypted gateway for credentials, certificates & private API keys.
        </p>
      </div>

      { /* Futuristic Dial Centerpiece */ }
      <VaultDial isUnlocked={isUnlocked} onToggleUnlock={onOpenVaultModal}/>

      { /* Action Button */ }
      <div className={`mt-1 pt-3 border-t-2 ${isDark ? 'border-[#3F3F46]' : 'border-[#171717]'}`}>
        {isUnlocked ? <button onClick={onOpenVaultModal} className="w-full bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading text-xs sm:text-sm font-extrabold tracking-wider py-3 px-4 rounded-xl border-2 border-[#171717] transition-all cursor-pointer shadow-editorial active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2">
            <Unlock className="w-4 h-4"/> EXPLORE VAULT REPOSITORY ({standardCount} FILES)
          </button> : <button onClick={onOpenVaultModal} className="w-full bg-[#F25C23] hover:bg-[#FF5A1F] text-white font-heading text-xs sm:text-sm font-extrabold tracking-wider py-3 px-4 rounded-xl border-2 border-[#171717] transition-all cursor-pointer shadow-editorial active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2">
            <Key className="w-4 h-4 stroke-[2.5]"/> UNLOCK QUANTUM VAULT
          </button>}
      </div>
    </div>;
};
