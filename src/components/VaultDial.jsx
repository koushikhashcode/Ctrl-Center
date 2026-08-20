/**
 * ==========================================
 * COMPONENT: VaultDial
 * ==========================================
 * The animated circular lock dial shown when the vault is locked.
 */
import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import './VaultDial.css';

export const VaultDial = ({ isUnlocked, onToggleUnlock }) => {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const handleDialClick = ()=>{
        if (isSpinning) return;
        setIsSpinning(true);
        // Mechanical turn 180deg
        setRotation((prev)=>prev + 180);
        setTimeout(()=>{
            setIsSpinning(false);
            onToggleUnlock();
        }, 500);
    };
    return <div className="vault-dial-container">
      { /* Sci-Fi Complex Lock Outer Container */ }
      <div onClick={handleDialClick} className="vault-dial-outer">
        { /* Layer 0: Ambient Orange Radial Glow */ }
        <div className={`vault-dial-glow ${isUnlocked ? 'unlocked' : 'locked'}`}/>

        { /* Layer 1: Heavy Steel Outer Frame */ }
        <div className="vault-dial-frame">
          
          { /* Futuristic Circuit Grid Lines */ }
          <div className="vault-circuit-bg"/>

          { /* Layer 2: Outer Accent Ring */ }
          <div style={{
        transform: `rotate(${-rotation * 0.75}deg)`
    }} className="vault-dial-outer-ring"/>

          { /* Layer 3: Rotating Inner Segmented Ring */ }
          <div style={{
        transform: `rotate(${rotation * 1.25}deg)`
    }} className="vault-dial-inner-ring"/>

          { /* Layer 4: Concentric Tech Core Enclosure */ }
          <div className="vault-dial-core-enclosure">
            
            { /* Top Laser Target Sight */ }
            <div className="vault-dial-laser-sight">
              <div className="vault-dial-laser-sight-inner"/>
            </div>

            { /* Layer 5: Interactive Mechanical Vault Core Dial (ROTATES) */ }
            <div style={{
        transform: `rotate(${rotation}deg)`
    }} className={`vault-dial-rotator ${isSpinning ? 'spinning' : 'idle'}`}>
              { /* Radial Cyber Grip Teeth (12 Notch Nodes) */ }
              {[
        0,
        30,
        60,
        90,
        120,
        150,
        180,
        210,
        240,
        270,
        300,
        330
    ].map((deg)=><div key={deg} style={{
            transform: `rotate(${deg}deg) translateY(-54px)`
        }} className={`vault-dial-tooth ${isUnlocked ? 'unlocked' : deg % 90 === 0 ? 'locked cardinal' : 'locked non-cardinal'}`}/>)}

              { /* Laser Scanning Beam inside dial during spin */ }
              {isSpinning && <div className="vault-dial-laser-beam"/>}

              { /* Outer Calibration Indicator LED */ }
              <div className="vault-dial-led"/>
            </div>

            { /* Layer 6: FIXED Central Biometric Lock Logo Core (DOES NOT ROTATE) */ }
            <div className={`vault-dial-logo-core ${isUnlocked ? 'unlocked' : 'locked'}`}>
              { /* Micro Circuit Lines on Core */ }
              <div className="vault-dial-logo-lines"/>

              {isUnlocked ? <div className="vault-dial-logo-content unlocked">
                  <Unlock className="vault-dial-icon-unlocked"/>
                  <span className="vault-dial-text-unlocked">
                    DECRYPTED
                  </span>
                </div> : <div className="vault-dial-logo-content locked">
                  <Lock className="vault-dial-icon-locked"/>
                  <span className="vault-dial-text-locked">
                    LOCKED
                  </span>
                </div>}
            </div>
          </div>
        </div>
      </div>

      { /* Cyber Status Badge Pill - Orange/Black/White Theme */ }
      <div className={`vault-dial-status-badge ${isUnlocked ? 'unlocked' : 'locked'}`}>
        <span className="vault-dial-status-dot"/>
        <span className="vault-dial-status-text">
          {isUnlocked ? 'VAULT UNLOCKED // QUANTUM SESSION ACTIVE' : 'QUANTUM LOCK // TAP DIAL TO DECRYPT'}
        </span>
      </div>
    </div>;
};
