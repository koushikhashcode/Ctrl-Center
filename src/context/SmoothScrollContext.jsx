/**
 * ==========================================
 * COMPONENT: SmoothScrollContext
 * ==========================================
 * Wraps the app in Lenis to provide buttery-smooth momentum scrolling.
 */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
const SmoothScrollContext = createContext({
    lenis: null,
    scrollTo: ()=>{},
    stop: ()=>{},
    start: ()=>{}
});
export const SmoothScrollProvider = ({ children })=>{
    const [lenisInstance, setLenisInstance] = useState(null);
    const lenisRef = useRef(null);
    const reqIdRef = useRef(null);
    useEffect(()=>{
        // Initialize Lenis with smooth physics easing
        const lenis = new Lenis({
            duration: 1.15,
            easing: (t)=>Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.8,
            infinite: false
        });
        lenisRef.current = lenis;
        setLenisInstance(lenis);
        // Continuous Animation Frame loop
        const raf = (time)=>{
            lenis.raf(time);
            reqIdRef.current = requestAnimationFrame(raf);
        };
        reqIdRef.current = requestAnimationFrame(raf);
        // Handle window resize dynamically
        const handleResize = ()=>{
            lenis.resize();
        };
        window.addEventListener('resize', handleResize);
        return ()=>{
            if (reqIdRef.current) {
                cancelAnimationFrame(reqIdRef.current);
            }
            window.removeEventListener('resize', handleResize);
            lenis.destroy();
            lenisRef.current = null;
            setLenisInstance(null);
        };
    }, []);
    const scrollTo = (target, options)=>{
        if (lenisRef.current) {
            lenisRef.current.scrollTo(target, {
                duration: 1.2,
                easing: (t)=>Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                ...options
            });
        } else if (typeof target === 'number') {
            window.scrollTo({
                top: target,
                behavior: 'smooth'
            });
        } else if (typeof target === 'string') {
            const el = document.querySelector(target);
            el?.scrollIntoView({
                behavior: 'smooth'
            });
        } else if (target instanceof HTMLElement) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    };
    const stop = ()=>{
        lenisRef.current?.stop();
    };
    const start = ()=>{
        lenisRef.current?.start();
    };
    return <SmoothScrollContext.Provider value={{
        lenis: lenisInstance,
        scrollTo,
        stop,
        start
    }}>
      {children}
    </SmoothScrollContext.Provider>;
};
export const useSmoothScroll = ()=>{
    return useContext(SmoothScrollContext);
};
