/**
 * ==========================================
 * COMPONENT: BrandIcon
 * ==========================================
 * Renders the small logo icon seen in the top navigation.
 */
import * as LucideIcons from 'lucide-react';
export const BrandIcon = ({ name, className = 'brand-icon-default' })=>{
    const normalized = name.toLowerCase();
    // Custom SVG paths for iconic tech brands
    if (normalized.includes('linkedin')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
      </svg>;
    }
    if (normalized.includes('github')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
      </svg>;
    }
    if (normalized.includes('twitter') || normalized.includes('x')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>;
    }
    if (normalized.includes('youtube')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>;
    }
    if (normalized.includes('leetcode')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.17 5.79a1.374 1.374 0 0 0-.012 1.936l4.636 4.7a1.38 1.38 0 0 0 1.968 0 1.374 1.374 0 0 0 0-1.936l-3.652-3.702 5.334-5.352a1.374 1.374 0 0 0-.961-2.436zM17.8 7.37a1.374 1.374 0 0 0-.97.402l-1.91 1.928a1.374 1.374 0 0 0 .007 1.938l6.892 6.984a1.374 1.374 0 0 0 1.96 0 1.374 1.374 0 0 0 0-1.938l-5.912-5.992 1.89-1.908a1.374 1.374 0 0 0-.957-2.414zM4.14 11.238a1.374 1.374 0 0 0-.97.402l-2.732 2.76a1.374 1.374 0 0 0 0 1.938l9.62 9.748a1.374 1.374 0 0 0 1.96 0l7.854-7.957a1.374 1.374 0 0 0 0-1.938 1.374 1.374 0 0 0-1.96 0l-6.874 6.964-8.64-8.756a1.374 1.374 0 0 0-.258-.161z"/>
      </svg>;
    }
    if (normalized.includes('figma')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm0-8a4 4 0 0 1 4-4h4a4 4 0 1 1 0 8h-4a4 4 0 0 1-4-4zm0 16a4 4 0 0 1 4-4h4v4a4 4 0 1 1-8 0zm0-8a4 4 0 0 1 4-4h4v8h-4a4 4 0 0 1-4-4z"/>
      </svg>;
    }
    if (normalized.includes('pinterest')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0a12 12 0 0 0-4.37 23.18c-.05-.98-.1-2.48.02-3.55.11-.97.74-6.28.74-6.28s-.19-.38-.19-.94c0-.88.51-1.54 1.15-1.54.54 0 .8.41.8.9 0 .55-.35 1.37-.53 2.13-.15.63.32 1.15.94 1.15 1.13 0 2-1.19 2-2.91 0-1.52-1.09-2.58-2.65-2.58-1.81 0-2.87 1.36-2.87 2.76 0 .55.21 1.13.48 1.45.05.07.06.13.04.2-.06.24-.19.77-.22.87-.04.14-.12.17-.28.1-1.03-.48-1.67-1.98-1.67-3.19 0-2.6 1.89-4.98 5.45-4.98 2.86 0 5.08 2.04 5.08 4.76 0 2.84-1.79 5.13-4.28 5.13-.84 0-1.62-.43-1.89-.95l-.51 1.96c-.19.72-.69 1.63-1.03 2.18A12 12 0 1 0 12 0z"/>
      </svg>;
    }
    if (normalized.includes('notion')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.047-.327L17.84 1.64c-.466-.374-1.073-.654-2.285-.56L2.64 2.06c-.373.047-.466.28-.327.42l2.146 1.728zm.933 3.686v13.543c0 .653.373.84 1.026.793l14.195-.84c.653-.047.84-.467.84-1.027V6.634c0-.56-.28-.84-.793-.793l-14.428.84c-.56.047-.84.42-.84.92zm11.71 1.493c.093.42.046.84-.374.887l-.746.14v7.792c0 .653-.327.933-.887.98l-3.36.186c-.466.047-.7-.186-.886-.606l-3.08-4.852v4.852l1.166.233c.42.093.42.56.42.793v.093l-3.033.187c-.093-.374-.047-.793.373-.84l.747-.14V9.957l-1.073-.093c-.42-.047-.42-.513-.42-.746v-.093l3.22-.187c.606-.047.933.233 1.213.653l3.033 4.759V9.677l-1.073-.233c-.42-.093-.42-.56-.42-.793v-.093l3.22-.187c-.046.047.047.467.047.887z"/>
      </svg>;
    }
    if (normalized.includes('onenote')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 4v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-8 4h4V6h-4v2zm0 4h4v-2h-4v2zm0 4h4v-2h-4v2zM6 8H4v8h2v-1.5l2-5V8H6zm5.8 4.2L9.5 8h-1v8h1.6v-4.5l2.4 4.5h.9V8h-1.6v4.2z"/>
      </svg>;
    }
    if (normalized.includes('layers') || normalized.includes('stack') || normalized.includes('multi')) {
        return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>;
    }
    if (normalized.includes('spotify')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.38 9.78-.72 13.5 1.56.36.24.54.84.24 1.261zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z"/>
      </svg>;
    }
    if (normalized.includes('facebook')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>;
    }
    if (normalized.includes('chatgpt') || normalized.includes('bot')) {
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.28 10.96a6.03 6.03 0 0 0-.52-4.9 6.07 6.07 0 0 0-6.19-3.05 6.04 6.04 0 0 0-4.63-2.01A6.07 6.07 0 0 0 5.1 3.52a6.04 6.04 0 0 0-4.14 3.86 6.07 6.07 0 0 0 .97 6.8 6.03 6.03 0 0 0 .52 4.9 6.07 6.07 0 0 0 6.19 3.05 6.04 6.04 0 0 0 4.63 2.01 6.07 6.07 0 0 0 5.84-2.52 6.04 6.04 0 0 0 4.14-3.86 6.07 6.07 0 0 0-.97-6.8zM12 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-3.5-4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
      </svg>;
    }
    // Fallback to Lucide React icons
    const iconMap = {
        mail: 'Mail',
        globe: 'Globe',
        code2: 'Code2',
        bookopen: 'BookOpen',
        instagram: 'Instagram',
        harddrive: 'HardDrive',
        messagesquare: 'MessageSquare',
        terminal: 'Terminal',
        bot: 'Bot',
        music: 'Music',
        filetext: 'FileText',
        table: 'Table',
        layout: 'Layout',
        send: 'Send',
        edit3: 'Edit3'
    };
    const matchedKey = Object.keys(iconMap).find((k)=>normalized.includes(k));
    const iconName = matchedKey ? iconMap[matchedKey] : 'ExternalLink';
    const IconComponent = LucideIcons[iconName] || LucideIcons.ExternalLink;
    return <IconComponent className={className}/>;
};
