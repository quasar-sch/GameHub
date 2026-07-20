import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  ExternalLink, 
  Gamepad2, 
  X, 
  Search,
  Check
} from 'lucide-react';
import { Game, Category } from './types';

// =========================================================================
// 🚀 게임 및 카테고리 데이터 설정 (이곳에서 아주 쉽게 링크와 카테고리를 편집하실 수 있습니다!)
// =========================================================================

export const CATEGORIES: Category[] = [
  { id: 'puzzle', name: 'Puzzle', colorClass: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' },
  { id: 'strategy', name: 'Strategy', colorClass: 'bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30' },
  { id: 'simulation', name: 'Simulation', colorClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
  { id: 'board_game', name: 'Board Game', colorClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  { id: 'logic', name: 'Logic', colorClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30' },
];

export const GAMES: Game[] = [
  {
    id: '1',
    title: "기사의 모험 Knight's Tour",
    description: "체스판을 정복하라!",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/KnightsTour/',
    iconType: 'emoji',
    iconValue: '♞'
  },
  {
    id: '2',
    title: "강 건너기 River Crossing",
    description: "강 건너는 것을 도와주세요!",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/CrossingRiver/',
    iconType: 'emoji',
    iconValue: '⛵'
  },
  {
    id: '3',
    title: "하노이의 탑 Hanoi Tower",
    description: "탑을 옮겨라!",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/HanoiTower/',
    iconType: 'emoji',
    iconValue: '🏗️'
  },
  {
    id: '4',
    title: "한 붓 그리기 One-line",
    description: "모든 선을 한 붓으로 지나기!",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/CrossingBridge/',
    iconType: 'emoji',
    iconValue: '🖌️'
  },
  {
    id: '5',
    title: "물통 퍼즐 Water Bucket",
    description: "알맞은 물의 양을 구하세요!",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/WaterBucket/',
    iconType: 'emoji',
    iconValue: '🫗'
  },
  {
    id: '6',
    title: "나인멘즈모리스 Nine Men's Morris",
    description: "전략을 잘 짜서 상대방을 이기세요!",
    category: 'strategy',
    link: 'https://quasar-sch.github.io/NineMen-sMorris/',
    iconType: 'emoji',
    iconValue: 'Ⓜ️'
  },
  {
    id: '7',
    title: "님 게임 Nim Game",
    description: "마지막으로 가져가지 말 것!",
    category: 'strategy',
    link: 'https://quasar-sch.github.io/Nimgame/',
    iconType: 'emoji',
    iconValue: '🔥'
  },
  {
    id: '8',
    title: "바그찰 Bagchal",
    description: "염소와 호랑이 중 누가 더 세나",
    category: 'strategy',
    link: 'https://quasar-sch.github.io/Bagchal/',
    iconType: 'emoji',
    iconValue: '🐐'
  },
  {
    id: '9',
    title: "체커 Draughts",
    description: "대각게임 원조",
    category: 'strategy',
    link: 'https://quasar-sch.github.io/Draughts/',
    iconType: 'emoji',
    iconValue: '⚪'
  },
  {
    id: '10',
    title: "소코반 Sokoban",
    description: "박스를 잘 옮기기!",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/Sokoban/',
    iconType: 'emoji',
    iconValue: '💣'
  },
  {
    id: '11',
    title: "몬티홀 문제 Montihall Dilemma",
    description: "선택을 바꿀것인가 말것인가",
    category: 'simulation',
    link: 'https://quasar-sch.github.io/MontyHall/',
    iconType: 'emoji',
    iconValue: '🚪'
  },
  {
    id: '12',
    title: "세 명의 총잡이 Three-way duel",
    description: "최후의 생존자는?",
    category: 'simulation',
    link: 'https://quasar-sch.github.io/ThreeGunners/',
    iconType: 'emoji',
    iconValue: '🔫'
  }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [qrModalGame, setQrModalGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // 카테고리 & 검색 필터링 적용
  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // 클립보드 복사 유틸
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-gray-200 selection:bg-primary-neon selection:text-black pb-24">
      
      {/* 1. TOP HEADER (게임 허브 스타일 네비게이션) */}
      <header className="sticky top-0 w-full z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedCategory('all')}>
            <Gamepad2 className="text-primary-neon w-6 h-6 animate-pulse" />
            <h1 className="font-display text-2xl md:text-3xl font-black italic tracking-tighter text-primary-neon neon-glow-text">
              GAME HUB
            </h1>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6 md:gap-8">
            <button 
              onClick={() => setSelectedCategory('all')} 
              className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary-neon border-b-2 border-primary-neon pb-1 transition-all"
            >
              ALL GAMES
            </button>
            
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full border border-primary-neon/30 overflow-hidden cursor-pointer hover:border-primary-neon transition-colors">
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrg9xO4tn7KZx0Iv9tkn-pF-bw_aYHlV0YUmEib9D2pRTfiAbFklwgUpSp018bc6IakvG5BMbpdB7ufR-j398hWzu6sLwQSol3ouHKSPXmAlKlWkUELC2tQ8qVqdPtk5MT7LH9fBtQz3sUt5FAX6OKebbpskQ_auI_oAaPn3rWyM9LMb4-62C6m06QNJK04y-QQmzMqDsObTimryEFxc2T9qjlPoLojxi8VFwkVYOYsIiYhnjlAiw68YPn5BxONIAZ1XzZkuZi7w"
                referrerPolicy="no-referrer"
              />
            </div>
          </nav>
        </div>
      </header>

      {/* 2. CHIP FILTER BAR */}
      <div className="w-full bg-[#050505]/40 border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`filter-chip px-5 py-2 text-xs md:text-sm uppercase font-semibold tracking-wider rounded-full border cursor-pointer transition-all ${
              selectedCategory === 'all' 
                ? 'active border-primary-neon text-primary-neon bg-primary-neon/10' 
                : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            }`}
          >
            ALL
          </button>
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`filter-chip px-5 py-2 text-xs md:text-sm uppercase font-semibold tracking-wider rounded-full border cursor-pointer transition-all ${
                selectedCategory === cat.id 
                  ? 'active border-primary-neon text-primary-neon bg-primary-neon/10' 
                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
        
        {/* Title area & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-primary-neon neon-glow-text">
              Game Collection
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
              Enter the grid and choose your challenge. Click the QR icon to get a smartphone connection link instantly!
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search challenge..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-neon/50 text-white placeholder-gray-500 transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. GAME GRID */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game) => {
                const catInfo = CATEGORIES.find(c => c.id === game.category);

                return (
                  <motion.div 
                    key={game.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="game-card neon-card rounded-xl p-4 md:p-6 flex flex-col relative group overflow-hidden border border-white/5 bg-white/[0.02]"
                  >
                    {/* Icon Area */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-primary-neon/30 transition-all duration-300">
                        {game.iconType === 'emoji' ? (
                          <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300 select-none">
                            {game.iconValue}
                          </span>
                        ) : (
                          <img 
                            src={game.iconValue} 
                            alt={game.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-md group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150";
                            }}
                          />
                        )}
                      </div>

                      {/* Autogenerated QR Trigger */}
                      <button 
                        title="Scan to Play"
                        onClick={() => setQrModalGame(game)}
                        className="p-1.5 rounded-lg bg-primary-neon/10 border border-primary-neon/20 text-primary-neon hover:bg-primary-neon/20 hover:border-primary-neon/40 active:scale-90 transition-all cursor-pointer"
                      >
                        <QrCode className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>

                    {/* Meta */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-extrabold text-sm md:text-base text-white tracking-wider group-hover:text-primary-neon transition-colors truncate">
                          {game.title}
                        </h3>
                        <p className="text-[11px] md:text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity">
                          {game.description}
                        </p>
                      </div>

                      {/* Badge / Play link */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className={`text-[9px] md:text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          catInfo ? catInfo.colorClass : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}>
                          {catInfo ? catInfo.name : 'Uncategorized'}
                        </span>
                        
                        <a 
                          href={game.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-primary-neon/70 group-hover:text-primary-neon flex items-center gap-0.5 hover:underline"
                        >
                          PLAY 
                          <span className="text-[8px]">▶</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
            <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-white">No challenges found</h3>
            <p className="text-gray-500 text-sm mt-1">Try resetting the category filter or search term</p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-primary-neon/10 hover:bg-primary-neon/25 text-primary-neon text-xs font-bold uppercase tracking-wider rounded-lg border border-primary-neon/30 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      {/* 4. AUTOGENERATED QR MODAL (링크 주소에 따른 QR코드 실시간 자동 생성!) */}
      <AnimatePresence>
        {qrModalGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setQrModalGame(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-[#0e0e0e] border border-primary-neon/30 rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(165,231,255,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 text-center relative">
                {/* Close Button */}
                <button 
                  onClick={() => setQrModalGame(null)} 
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <h4 className="font-display text-2xl font-black text-primary-neon tracking-wider uppercase mb-1">
                  Scan to Play
                </h4>
                <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-6">
                  {qrModalGame.title}
                </p>

                {/* 🔗 링크 데이터만 넣으면 QR 서버가 즉석에서 알맞은 이미지를 띄워줍니다! */}
                <div className="bg-white p-4.5 rounded-xl inline-block shadow-inner mb-6 relative">
                  <img 
                    alt={`QR Code for ${qrModalGame.title}`} 
                    className="w-44 h-44 select-none" 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrModalGame.link)}`}
                  />
                </div>

                <div className="px-2 mb-6">
                  <button 
                    onClick={() => copyToClipboard(qrModalGame.link)}
                    className="text-xs text-gray-400 hover:text-primary-neon transition-colors w-full truncate block bg-white/5 py-1.5 px-3 rounded border border-white/5 font-mono cursor-pointer"
                    title="Click to copy link"
                  >
                    {copiedLink === qrModalGame.link ? (
                      <span className="text-green-400 flex items-center justify-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Copied link!
                      </span>
                    ) : (
                      `Link: ${qrModalGame.link}`
                    )}
                  </button>
                </div>

                <div className="flex gap-2.5">
                  <a 
                    href={qrModalGame.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-primary-neon hover:bg-[#c2f0ff] text-black font-black uppercase text-xs tracking-widest rounded-lg transition-all active:scale-95 shadow-[0_0_15px_rgba(165,231,255,0.4)] flex items-center justify-center gap-1"
                  >
                    Direct Play 
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button 
                    onClick={() => setQrModalGame(null)}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold uppercase text-xs tracking-widest rounded-lg transition-all active:scale-95 border border-white/10 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. BOTTOM STATUS BAR */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-black/95 border-t border-white/5 flex items-center justify-between px-6 md:px-12 z-30 text-[10px] text-gray-500 font-mono">
        <div>
          STATUS: <span className="text-green-400 font-bold">● ONLINE</span>
        </div>
        <div className="hidden sm:block">
          TOTAL CHALLENGES: {GAMES.length}
        </div>
        <div>
          GAME HUB V2.0
        </div>
      </footer>

    </div>
  );
}
