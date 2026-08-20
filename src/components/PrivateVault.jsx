/**
 * ==========================================
 * COMPONENT: PrivateVault
 * ==========================================
 * The tall secure documents section on the right side of the dashboard.
 */
import { VaultDial } from './VaultDial';
import { ShieldCheck, Unlock, Key, LockKeyhole } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './PrivateVault.css';

export const PrivateVault = ({ isUnlocked, documents, onOpenVaultModal, onLockVault }) => {
    const { isDark } = useTheme();
    const standardCount = documents.filter((d)=>!d.requiresLevel2 && d.category !== 'classified' && d.category !== 'key').length;
    return <div className={`private-vault-container ${isDark ? 'theme-dark' : 'theme-light'}`}>
      { /* Block Header */ }
      <div className="private-vault-header-block">
        <div className={`private-vault-header ${isDark ? 'theme-dark' : 'theme-light'}`}>
          <div className="private-vault-title-container">
            <div className="private-vault-icon-wrapper">
              <ShieldCheck className="w-5 h-5 text-[#F25C23]"/>
            </div>
            <div className="private-vault-title-text">
              <h2 className={`private-vault-title ${isDark ? 'theme-dark' : 'theme-light'}`}>
                PRIVATE VAULT
              </h2>
              <span className="private-vault-subtitle">
                QUANTUM ENCRYPTED STORAGE
              </span>
            </div>
          </div>
          {isUnlocked && <button onClick={onLockVault} className="private-vault-lock-btn">
              <LockKeyhole className="w-3.5 h-3.5"/> LOCK
            </button>}
        </div>

        <p className={`private-vault-desc ${isDark ? 'theme-dark' : 'theme-light'}`}>
          Encrypted gateway for credentials, certificates & private API keys.
        </p>
      </div>

      { /* Futuristic Dial Centerpiece */ }
      <VaultDial isUnlocked={isUnlocked} onToggleUnlock={onOpenVaultModal}/>

      { /* Action Button */ }
      <div className={`private-vault-action-container ${isDark ? 'theme-dark' : 'theme-light'}`}>
        {isUnlocked ? <button onClick={onOpenVaultModal} className="private-vault-action-btn unlocked">
            <Unlock className="private-vault-action-btn-icon"/> EXPLORE VAULT REPOSITORY ({standardCount} FILES)
          </button> : <button onClick={onOpenVaultModal} className="private-vault-action-btn locked">
            <Key className="private-vault-action-btn-icon locked"/> UNLOCK QUANTUM VAULT
          </button>}
      </div>
    </div>;
};
