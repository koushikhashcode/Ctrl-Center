/**
 * ==========================================
 * DATA: MUSIC FOLDERS
 * ==========================================
 * This section contains the default music categories 
 * and playlists used in the Lo-Fi & Beats tab.
 */
export const INITIAL_MUSIC_FOLDERS = [
    {
        id: 'mf-fav',
        name: 'All Time Fav',
        category: 'All Time Fav',
        iconName: 'Heart',
        color: '#F25C23',
        description: 'Your favorite tracks of all time, stored locally',
        songs: [
            {
                id: 'fav-1',
                title: 'Bhare Naina',
                artist: 'Local Artist',
                duration: '4:05',
                url: '/music/Bhare Naina Ra One 128 Kbps.mp3',
                genre: 'Favorites'
            },
            {
                id: 'fav-2',
                title: 'Paapam',
                artist: 'Local Artist',
                duration: '3:20',
                url: '/music/Paapam(KoshalWorld.Com).mp3',
                genre: 'Favorites'
            },
            {
                id: 'fav-3',
                title: 'Amsham',
                artist: 'Local Artist',
                duration: '4:05',
                url: '/music/Amsham(KoshalWorld.Com).mp3',
                genre: 'Favorites'
            }
        ]
    },
    {
        id: 'mf-bengali',
        name: 'Bengali',
        category: 'Bengali',
        iconName: 'Music',
        color: '#F25C23',
        description: 'Melodious Bengali songs, traditional & modern mix',
        songs: [
            {
                id: 'bengali-1',
                title: 'Bengali Song 1',
                artist: 'Bengali Artist',
                duration: '4:15',
                url: '/music/bengali-1.mp3',
                genre: 'Bengali'
            },
            {
                id: 'bengali-2',
                title: 'Shada Shada Kala Kala',
                artist: 'Chanchal Chowdhury Nazifa Tushi',
                duration: '3:45',
                url: '/music/Shada-Shada-Kala-Kala-HAWA-Chanchal-Chowdhury-Nazifa-Tushi-Cinema-Song-2022-Jaaz.mp3',
                genre: 'Bengali'
            }
        ]
    },
    {
        id: 'mf-hiphop',
        name: 'Hip Hop',
        category: 'Hip Hop',
        iconName: 'Headphones',
        color: '#F25C23',
        description: 'Top local hip hop beats, rap & urban concentration rhythms',
        songs: [
            {
                id: 'hiphop-1',
                title: 'Hip Hop Track 1',
                artist: 'Hip Hop Artist',
                duration: '2:50',
                url: '/music/hiphop-1.mp3',
                genre: 'Hip Hop'
            },
            {
                id: 'hiphop-2',
                title: 'Hip Hop Track 2',
                artist: 'Hip Hop Artist',
                duration: '3:10',
                url: '/music/hiphop-2.mp3',
                genre: 'Hip Hop'
            }
        ]
    },
    {
        id: 'mf-hindi',
        name: 'Hindi',
        category: 'hindi classical',
        iconName: 'Flame',
        color: '#F25C23',
        description: 'Upbeat electro, synthpop anthems & adrenaline motivation',
        songs: [
            {
                id: 'hindi-1',
                title: 'Sehmi Hai Dhadkan',
                artist: 'Arijit Singh',
                duration: '2:43',
                url: '/music/Sehmi_Hai_Dhadkan.mp3',
                genre: 'Hindi'
            },
            {
                id: 'energy-2',
                title: 'Blinding Lights',
                artist: 'The Weeknd',
                duration: '3:20',
                url: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
                genre: 'Dance Pop'
            },
            {
                id: 'energy-3',
                title: 'Harder, Better, Faster, Stronger',
                artist: 'Daft Punk',
                duration: '3:44',
                url: 'https://www.youtube.com/watch?v=gAjR4_CbPpQ',
                genre: 'French House'
            }
        ]
    },
    {
        id: 'mf-acoustic',
        name: 'Acoustic & Indie Vibes',
        category: 'Indie / Acoustic',
        iconName: 'Heart',
        color: '#F25C23',
        description: 'Warm acoustic guitar, organic indie folk & serene melodies',
        songs: [
            {
                id: 'acoustic-1',
                title: 'Sunset Acoustic Guitar & Chill Melodies',
                artist: 'Acoustic Cafe Collective',
                duration: '4:15',
                url: 'https://www.youtube.com/watch?v=w9Qv72y0PqI',
                genre: 'Fingerstyle Acoustic'
            },
            {
                id: 'acoustic-2',
                title: 'Ophelia',
                artist: 'The Lumineers',
                duration: '2:40',
                url: 'https://www.youtube.com/watch?v=pTOC_q0NLTk',
                genre: 'Indie Folk'
            },
            {
                id: 'acoustic-3',
                title: 'Rivers and Roads',
                artist: 'The Head and the Heart',
                duration: '4:42',
                url: 'https://www.youtube.com/watch?v=e2J-0EtsCpo',
                genre: 'Folk / Indie'
            }
        ]
    }
];
/**
 * ==========================================
 * DATA: FAVORITE SONGS
 * ==========================================
 * This array holds individual song tracks that 
 * are displayed in the music player.
 */
export const INITIAL_FAVORITE_SONGS = [
    {
        id: 's1',
        title: 'Starboy',
        artist: 'The Weeknd ft. Daft Punk',
        duration: '3:50',
        url: 'https://www.youtube.com/watch?v=34Na4j8AVgA',
        genre: 'Synthpop'
    },
    {
        id: 's2',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        duration: '3:20',
        url: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
        genre: 'Pop'
    },
    {
        id: 's3',
        title: 'Lofi Hip Hop Radio - Beats to Relax/Study',
        artist: 'Lofi Girl',
        duration: 'Live 24/7',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        genre: 'Lofi'
    },
    {
        id: 's4',
        title: 'Midnight City',
        artist: 'M83',
        duration: '4:03',
        url: 'https://www.youtube.com/watch?v=dX3k_QDnzHE',
        genre: 'Electronic'
    }
];
/**
 * ==========================================
 * DATA: QUICK LAUNCH LINKS
 * ==========================================
 * This is the main list of applications and websites 
 * shown on the dashboard (Quick Launchpad). You can 
 * easily add or modify these links to suit your needs.
 */
export const INITIAL_LINKS = [
    {
        id: 'linkedin',
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/koushik-mandal-29ba12284/',
        category: 'work',
        iconName: 'Linkedin',
        shortcutKey: '1',
        isFavorite: true,
        clickCount: 142
    },
    {
        id: 'github',
        name: 'GitHub',
        url: 'https://github.com/koushikhashcode',
        category: 'dev',
        iconName: 'Github',
        shortcutKey: '2',
        isFavorite: true,
        clickCount: 210
    },
    {
        id: 'portfolio',
        name: 'Portfolio',
        url: 'https://www.heykoushik.site/',
        category: 'creative',
        iconName: 'Globe',
        shortcutKey: 'P',
        isFavorite: true,
        clickCount: 88
    },
    {
        id: 'gmail',
        name: 'Gmail',
        url: 'https://mail.google.com',
        category: 'work',
        iconName: 'Mail',
        shortcutKey: '4',
        isFavorite: true,
        clickCount: 195
    },
    {
        id: 'youtube',
        name: 'YouTube',
        url: 'https://www.youtube.com/@Koushik-Mandal-km',
        category: 'social',
        iconName: 'Youtube',
        shortcutKey: 'Y',
        isFavorite: true,
        clickCount: 310
    },
    {
        id: 'leetcode',
        name: 'LeetCode',
        url: 'https://leetcode.com/u/CkNjvVea0o/',
        category: 'dev',
        iconName: 'Code2',
        shortcutKey: 'L',
        isFavorite: true,
        clickCount: 120
    },
    {
        id: 'notion',
        name: 'Notion',
        url: 'https://notion.so',
        category: 'work',
        iconName: 'BookOpen',
        shortcutKey: '5',
        isFavorite: true,
        clickCount: 165
    },
    {
        id: 'twitter',
        name: 'Twitter / X',
        url: 'https://x.com',
        category: 'social',
        iconName: 'Twitter',
        shortcutKey: 'X',
        isFavorite: false,
        clickCount: 75
    },
    {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/_koushikmandal/?hl=en',
        category: 'social',
        iconName: 'Instagram',
        shortcutKey: 'I',
        isFavorite: false,
        clickCount: 62
    },
    {
        id: 'drive',
        name: 'Google Drive',
        url: 'https://drive.google.com',
        category: 'work',
        iconName: 'HardDrive',
        shortcutKey: '3',
        isFavorite: true,
        clickCount: 140
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        url: 'https://web.whatsapp.com',
        category: 'social',
        iconName: 'MessageSquare',
        shortcutKey: 'W',
        isFavorite: false,
        clickCount: 180
    },
    {
        id: 'figma',
        name: 'Figma',
        url: 'https://figma.com',
        category: 'creative',
        iconName: 'Figma',
        shortcutKey: 'F',
        isFavorite: true,
        clickCount: 115
    },
    {
        id: 'spotify',
        name: 'Spotify',
        url: 'https://open.spotify.com',
        category: 'personal',
        iconName: 'Music',
        shortcutKey: 'S',
        isFavorite: true,
        clickCount: 240
    },
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        category: 'dev',
        iconName: 'Bot',
        shortcutKey: 'C',
        isFavorite: true,
        clickCount: 290
    },
    {
        id: 'vscode',
        name: 'VS Code Web',
        url: 'https://vscode.dev',
        category: 'dev',
        iconName: 'Terminal',
        shortcutKey: 'V',
        isFavorite: true,
        clickCount: 175
    },
    {
        id: 'facebook',
        name: 'Facebook',
        url: 'https://www.facebook.com',
        category: 'social',
        iconName: 'Facebook',
        shortcutKey: 'F',
        isFavorite: true,
        clickCount: 195
    }
];
/**
 * ==========================================
 * DATA: YOUTUBE PLAYLISTS
 * ==========================================
 * Contains embedded YouTube playlist links that render 
 * inside the Playlist Panel on the dashboard.
 */
export const INITIAL_PLAYLISTS = [
    {
        id: 'p1',
        title: 'Fullstack Web Architecture 2026',
        videoCount: 24,
        url: 'https://youtube.com/playlist?list=demo1',
        category: 'Engineering',
        channelName: 'Fireship & Tech',
        thumbnailBg: 'from-zinc-900 to-black'
    },
    {
        id: 'p2',
        title: 'DSA in Java & System Design',
        videoCount: 18,
        url: 'https://youtube.com/playlist?list=demo2',
        category: 'CS Core',
        channelName: 'NeetCode Labs',
        thumbnailBg: 'from-orange-900 to-black'
    },
    {
        id: 'p3',
        title: 'Editorial UI/UX & Craft Systems',
        videoCount: 15,
        url: 'https://youtube.com/playlist?list=demo3',
        category: 'Design',
        channelName: 'Juxtapose Design',
        thumbnailBg: 'from-stone-800 to-zinc-900'
    },
    {
        id: 'p4',
        title: 'Productivity & Focus Soundscapes',
        videoCount: 32,
        url: 'https://youtube.com/playlist?list=demo4',
        category: 'Audio',
        channelName: 'Lofi Girl & Deep Work',
        thumbnailBg: 'from-amber-950 to-black'
    }
];
/**
 * ==========================================
 * DATA: WORKSPACE TOOLS
 * ==========================================
 * A collection of developer and utility tools that 
 * can be launched directly from the Workspace section.
 */
export const INITIAL_TOOLS = [
    {
        id: 't1',
        name: 'Notion Workspace',
        description: 'Personal Knowledge Base & Task Master',
        url: 'https://notion.so',
        iconName: 'BookOpen',
        badge: 'Daily'
    },
    {
        id: 't2',
        name: 'Google Docs',
        description: 'Specs & Drafting Sheets',
        url: 'https://docs.google.com',
        iconName: 'FileText'
    },
    {
        id: 't3',
        name: 'Creative Suite (5-in-1)',
        description: '• Figma • Pinterest • YouTube • OneNote • Notion',
        url: 'https://www.figma.com',
        urls: [
            'https://www.figma.com',
            'https://www.pinterest.com',
            'https://www.youtube.com',
            'https://www.onenote.com',
            'https://www.notion.so'
        ],
        tabNames: [
            'Figma',
            'Pinterest',
            'YouTube',
            'OneNote',
            'Notion'
        ],
        iconName: 'Layers',
        badge: '5 Tabs'
    },
    {
        id: 't4',
        name: 'Canva Pro',
        description: 'Brand Assets & Pitch Decks',
        url: 'https://canva.com',
        iconName: 'Layout'
    },
    {
        id: 't5',
        name: 'Postman API',
        description: 'REST & GraphQL Sandbox',
        url: 'https://postman.com',
        iconName: 'Send'
    },
    {
        id: 't6',
        name: 'Excalidraw',
        description: 'Virtual Architecture Whiteboard',
        url: 'https://excalidraw.com',
        iconName: 'Edit3',
        badge: 'Diagram'
    }
];
/**
 * ==========================================
 * DATA: RECENT ITEMS (ACTIVITY LOG)
 * ==========================================
 * This is the default history of recently opened 
 * links, tools, and documents for the Activity Feed.
 */
export const INITIAL_RECENTS = [
    {
        id: 'r1',
        title: 'Resume_Senior_Engineer_2026.pdf',
        type: 'doc',
        timestamp: '2 min ago',
        fileSize: '1.2 MB',
        category: 'Career'
    },
    {
        id: 'r2',
        title: 'System_Design_CheatSheet_v4.md',
        type: 'doc',
        timestamp: '15 min ago',
        fileSize: '340 KB',
        category: 'Dev'
    },
    {
        id: 'r3',
        title: 'Semester_6_Transcript_Official.pdf',
        type: 'vault',
        timestamp: '1 hr ago',
        fileSize: '2.4 MB',
        category: 'Academic'
    },
    {
        id: 'r4',
        title: 'Hackathon_Global_Winner_Certificate.pdf',
        type: 'vault',
        timestamp: 'Yesterday',
        fileSize: '4.8 MB',
        category: 'Achievements'
    }
];
/**
 * ==========================================
 * DATA: PRIVATE VAULT DOCUMENTS
 * ==========================================
 * These are the secure files stored inside the 
 * Encrypted Private Vault module.
 */
export const INITIAL_VAULT_DOCS = [
    {
        id: 'v1',
        title: '10th Result.pdf',
        category: 'academic',
        date: '2026-05-20',
        fileSize: '2.4 MB',
        fileType: 'PDF Document',
        downloadUrl: 'public/private vault/cisce.org-X_compressed.pdf'
    },
    {
        id: 'v1-1',
        title: '12th Result.pdf',
        category: 'academic',
        date: '2026-05-20',
        fileSize: '2.4 MB',
        fileType: 'PDF Document',
        downloadUrl: '/docs/12th-Result.pdf'
    },
    {
        id: 'v1-2',
        title: 'College All 8 Sem Result.pdf',
        category: 'academic',
        date: '2026-05-20',
        fileSize: '5.4 MB',
        fileType: 'PDF Document',
        downloadUrl: '/docs/College-Result.pdf'
    },
    {
        id: 'v2',
        title: 'Global Hackathon 1st Place Certificate.pdf',
        category: 'academic',
        date: '2026-03-12',
        fileSize: '4.8 MB',
        fileType: 'PDF Certificate',
        downloadUrl: '#'
    },
    {
        id: 'v3',
        title: 'Tax Declaration & Income W2 Record.pdf',
        category: 'financial',
        date: '2026-01-15',
        fileSize: '1.1 MB',
        fileType: 'PDF Financial',
        downloadUrl: '#'
    },
    {
        id: 'v4',
        title: 'Master API Keys & Cloud Access Tokens',
        category: 'key',
        date: '2026-08-01',
        fileSize: 'Secret Note',
        fileType: 'Encrypted Text',
        requiresLevel2: true,
        secretContent: 'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nOPENAI_KEY=sk-proj-4912048029184018240182\nSTRIPE_LIVE_SECRET=sk_live_51M0x98124019284'
    },
    {
        id: 'v5',
        title: 'Birth Certificate.pdf',
        category: 'personal',
        date: '2025-11-10',
        fileSize: '3.6 MB',
        fileType: 'Encrypted PDF',
        downloadUrl: '/docs/Birth-Certificate.pdf'
    },
    {
        id: 'v5-1',
        title: 'Aadhaar Card.pdf',
        category: 'personal',
        date: '2025-11-10',
        fileSize: '1.2 MB',
        fileType: 'Encrypted PDF',
        downloadUrl: '/docs/Aadhaar-Card.pdf'
    },
    {
        id: 'v6',
        title: 'Biometric Crypto Cold Storage & Hardware Keys',
        category: 'classified',
        date: '2026-08-10',
        fileSize: '4 Items',
        fileType: 'Secure Vault Folder',
        requiresLevel2: true,
        isFolder: true,
        folderContents: [
            {
                title: 'Bip39_24_Word_Mnemonic_Seed.txt',
                type: 'Encrypted Text',
                size: '2 KB',
                secret: 'ocean matrix spiral venture quantum phantom zenith crystal orbit cascade thunder eclipse'
            },
            {
                title: 'Ledger_Nano_X_Master_PIN.txt',
                type: 'PIN Note',
                size: '1 KB',
                secret: 'HARDWARE_PIN: 9812-4019 | RECOVERY_PASS: #Quantum99'
            },
            {
                title: 'Ethereum_Validator_Keystore.json',
                type: 'JSON Key',
                size: '12 KB',
                secret: '{"address":"0x71C7656EC7ab88b098defB751B7401B5f6d8976F","crypto":{...}}'
            }
        ]
    },
    {
        id: 'v7',
        title: 'Offshore Trust & High-Security Financial Records',
        category: 'classified',
        date: '2026-07-25',
        fileSize: '3 Files',
        fileType: 'Encrypted Folder',
        requiresLevel2: true,
        isFolder: true,
        folderContents: [
            {
                title: 'Offshore_Trust_Agreement_2026.pdf',
                type: 'PDF Legal',
                size: '3.8 MB'
            },
            {
                title: 'Private_Banking_SWIFT_Key.txt',
                type: 'Secret Note',
                size: '1 KB',
                secret: 'SWIFT_ID: CHASEUS33XXX | ACCOUNT: 984019284102 | PIN: 7712'
            },
            {
                title: 'Corporate_Equity_CapTable.xlsx',
                type: 'Spreadsheet',
                size: '890 KB'
            }
        ]
    }
];
