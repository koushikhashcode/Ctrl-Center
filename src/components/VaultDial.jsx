/**
 * ==========================================
 * COMPONENT: VaultDial
 * ==========================================
 * The animated circular lock dial shown when the vault is locked.
 */
import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
export const VaultDial = ({ isUnlocked, onToggleUnlock })=>{
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
    return <div className="flex flex-col items-center justify-center py-2 relative my-1 select-none">
      { /* Sci-Fi Complex Lock Outer Container */ }
      <div onClick={handleDialClick} className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full p-2 flex items-center justify-center cursor-pointer group transition-all">
        { /* Layer 0: Ambient Orange Radial Glow */ }
        <div className={`absolute inset-0 rounded-full transition-all duration-500 blur-lg ${isUnlocked ? 'bg-[#F25C23]/40 shadow-[0_0_35px_#F25C23]' : 'bg-[#F25C23]/15 group-hover:bg-[#F25C23]/30'}`}/>

        { /* Layer 1: Heavy Steel Outer Frame */ }
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#27272A] via-[#18181B] to-[#0A0A0C] p-2.5 border-3 border-[#171717] dark:border-[#3F3F46] shadow-editorial-lg flex items-center justify-center overflow-hidden">
          
          { /* Futuristic Circuit Grid Lines */ }
          <div className="absolute inset-0 bg-[radial-gradient(#F25C23_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none"/>

          { /* Layer 2: Outer Accent Ring */ }
          <div style={{
        transform: `rotate(${-rotation * 0.75}deg)`
    }} className="absolute inset-2 rounded-full border-2 border-dashed border-[#F25C23]/40 transition-transform duration-700 ease-out pointer-events-none"/>

          { /* Layer 3: Rotating Inner Segmented Ring */ }
          <div style={{
        transform: `rotate(${rotation * 1.25}deg)`
    }} className="absolute inset-5 rounded-full border border-dotted border-white/25 transition-transform duration-700 ease-out pointer-events-none"/>

          { /* Layer 4: Concentric Tech Core Enclosure */ }
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[#121214] border-2 border-[#171717] dark:border-[#3F3F46] flex items-center justify-center relative shadow-inner">
            
            { /* Top Laser Target Sight */ }
            <div className="absolute top-0.5 w-3 h-3 bg-[#F25C23] rounded-sm z-20 flex items-center justify-center shadow-[0_0_10px_#F25C23]">
              <div className="w-1 h-1 bg-white rounded-full"/>
            </div>

            { /* Layer 5: Interactive Mechanical Vault Core Dial (ROTATES) */ }
            <div style={{
        transform: `rotate(${rotation}deg)`
    }} className={`w-32 h-32 sm:w-38 sm:h-38 rounded-full bg-gradient-to-b from-[#27272A] via-[#18181B] to-[#0F0F11] border-2 border-[#171717] dark:border-[#3F3F46] flex items-center justify-center cursor-pointer transition-transform duration-500 ease-out relative shadow-2xl ${isSpinning ? 'scale-95 brightness-125' : 'group-hover:scale-105'}`}>
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
        }} className={`absolute w-1.5 h-3.5 rounded-full transition-colors ${isUnlocked ? 'bg-[#F25C23] shadow-[0_0_6px_#F25C23]' : deg % 90 === 0 ? 'bg-[#F25C23]' : 'bg-[#A8A8A3]/40 group-hover:bg-[#F25C23]'}`}/>)}

              { /* Laser Scanning Beam inside dial during spin */ }
              {isSpinning && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#F25C23]/40 to-transparent animate-spin rounded-full pointer-events-none"/>}

              { /* Outer Calibration Indicator LED */ }
              <div className="absolute top-2 w-2 h-2 rounded-full bg-[#F25C23] shadow-[0_0_8px_#F25C23]"/>
            </div>

            { /* Layer 6: FIXED Central Biometric Lock Logo Core (DOES NOT ROTATE) */ }
            <div className={`absolute z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex flex-col items-center justify-center shadow-2xl pointer-events-none transition-all ${isUnlocked ? 'bg-[#18181B] border-[#F25C23] text-white shadow-[0_0_20px_rgba(242,92,35,0.6)]' : 'bg-[#121214] border-[#F25C23]/60 text-[#F25C23] shadow-[0_0_12px_rgba(242,92,35,0.2)]'}`}>
              { /* Micro Circuit Lines on Core */ }
              <div className="absolute inset-1 rounded-full border border-dashed border-[#F25C23]/30 pointer-events-none"/>

              {isUnlocked ? <div className="flex flex-col items-center justify-center animate-in zoom-in-90 duration-200">
                  <Unlock className="w-7 h-7 text-[#F25C23] stroke-[2.5] animate-pulse"/>
                  <span className="text-[7px] font-mono font-black text-[#F25C23] tracking-wider mt-0.5">
                    DECRYPTED
                  </span>
                </div> : <div className="flex flex-col items-center justify-center">
                  <Lock className="w-7 h-7 text-[#F25C23] stroke-[2.5] group-hover:scale-110 transition-transform"/>
                  <span className="text-[7px] font-mono font-black tracking-widest mt-0.5 text-[#F25C23]">
                    LOCKED
                  </span>
                </div>}
            </div>
          </div>
        </div>
      </div>

      { /* Cyber Status Badge Pill - Orange/Black/White Theme */ }
      <div className={`mt-2.5 flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider transition-all shadow-sm ${isUnlocked ? 'bg-[#18181B] border-[#F25C23] text-white shadow-[0_0_12px_rgba(242,92,35,0.3)]' : 'bg-[#171717] border-[#3F3F46] text-white hover:border-[#F25C23]'}`}>
        <span className="w-2 h-2 rounded-full bg-[#F25C23] animate-ping"/>
        <span className="text-[11px] uppercase tracking-wider">
          {isUnlocked ? 'VAULT UNLOCKED // QUANTUM SESSION ACTIVE' : 'QUANTUM LOCK // TAP DIAL TO DECRYPT'}
        </span>
      </div>
    </div>;
};
