import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Layers, 
  Settings, 
  Gamepad2, 
  Image as ImageIcon, 
  Smile, 
  X, 
  Check, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { Game, Category } from './types';

// ==========================================
// 1. EASY CONFIGURATION DATA (쉽고 빠른 초기 설정 데이터)
// 사용자가 소스코드에서 게임이나 카테고리를 편하게 직접 추가/수정할 수 있도록 최상단에 배치했습니다.
// ==========================================

const INITIAL_CATEGORIES: Category[] = [
  { id: 'strategy', name: 'Strategy', colorClass: 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 hover:bg-fuchsia-500/20' },
  { id: 'puzzle', name: 'Puzzle', colorClass: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20' },
  { id: 'simulation', name: 'Simulation', colorClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20' },
  { id: 'board_game', name: 'Board Game', colorClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' },
  { id: 'logic', name: 'Logic', colorClass: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' },
];

const INITIAL_GAMES: Game[] = [
  {
    id: '1',
    title: "Knight's Tour",
    description: "Master the chess board with strategic movements.",
    category: 'strategy',
    link: 'https://quasar-sch.github.io/KnightsTour/',
    iconType: 'emoji',
    iconValue: '♞'
  },
  {
    id: '2',
    title: "River Crossing",
    description: "Classic logic puzzles to test your sequence thinking.",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/CrossingRiver/',
    iconType: 'emoji',
    iconValue: '🧩'
  },
  {
    id: '3',
    title: "Hanoi Tower",
    description: "Recursive complexity in a beautiful neon stack.",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/HanoiTower/',
    iconType: 'emoji',
    iconValue: '🏗️'
  },
  {
    id: '4',
    title: "One-line",
    description: "Connect the dots without lifting your digital pen.",
    category: 'logic',
    link: 'https://quasar-sch.github.io/CrossingBridge/',
    iconType: 'emoji',
    iconValue: '🖌'
  },
  {
    id: '5',
    title: "Water Bucket",
    description: "The ultimate volume measurement challenge.",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/WaterBucket/',
    iconType: 'emoji',
    iconValue: '🫗'
  },
  {
    id: '6',
    title: "Nine Men's",
    description: "Ancient strategic warfare on a digital grid.",
    category: 'strategy',
    link: 'https://quasar-sch.github.io/NineMen-sMorris/',
    iconType: 'emoji',
    iconValue: '⚪'
  },
  {
    id: '7',
    title: "Monty Hall",
    description: "Test your probability against the neon doors.",
    category: 'simulation',
    link: 'https://quasar-sch.github.io/MontyHall/',
    iconType: 'emoji',
    iconValue: '🚪'
  },
  {
    id: '8',
    title: "Three Gunners",
    description: "High-octane tactical combat simulation.",
    category: 'simulation',
    link: 'https://quasar-sch.github.io/ThreeGunners/',
    iconType: 'emoji',
    iconValue: '🔫'
  },
  {
    id: '9',
    title: "Nim Game",
    description: "Mathematical strategy in a neon void.",
    category: 'board_game',
    link: 'https://quasar-sch.github.io/Nimgame/',
    iconType: 'emoji',
    iconValue: '🎮'
  },
  {
    id: '10',
    title: "Bagchal",
    description: "Tigers vs Goats: An asymmetric neon hunt.",
    category: 'strategy',
    link: 'https://quasar-sch.github.io/Bagchal/',
    iconType: 'emoji',
    iconValue: '🐯'
  },
  {
    id: '11',
    title: "Draughts",
    description: "The classic checkering game, modernized for the grid.",
    category: 'board_game',
    link: 'https://quasar-sch.github.io/Draughts/',
    iconType: 'emoji',
    iconValue: '⚪'
  },
  {
    id: '12',
    title: "Sokoban",
    description: "Heavy lifting puzzles in a cyber-warehouse.",
    category: 'puzzle',
    link: 'https://quasar-sch.github.io/Sokoban/',
    iconType: 'emoji',
    iconValue: '💣'
  }
];

// 카테고리 추가 시 사용할 꼬마 배경 색상 프리셋
const COLOR_PRESETS = [
  'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 hover:bg-fuchsia-500/20',
  'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20',
  'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20',
  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20',
  'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20',
  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20',
  'bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20',
  'bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20',
];

export default function App() {
  // 상태 관리 (인메모리에서 상태 변화 지원 - 탭, 게임 목록, 카테고리 목록)
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // 모달 상태들
  const [qrModalGame, setQrModalGame] = useState<Game | null>(null);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isManageCategoryOpen, setIsManageCategoryOpen] = useState(false);

  // 상단 네비게이션 탭 (ALL GAMES / MANAGE PANEL)
  const [activeNav, setActiveNav] = useState<'all_games' | 'manage'>('all_games');

  // 신규 게임 생성 폼 상태
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameDesc, setNewGameDesc] = useState('');
  const [newGameCategory, setNewGameCategory] = useState(INITIAL_CATEGORIES[0]?.id || '');
  const [newGameLink, setNewGameLink] = useState('');
  const [newGameIconType, setNewGameIconType] = useState<'emoji' | 'image'>('emoji');
  const [newGameIconValue, setNewGameIconValue] = useState('');

  // 신규 카테고리 생성 폼 상태
  const [newCatName, setNewCatName] = useState('');
  const [selectedPresetColor, setSelectedPresetColor] = useState(COLOR_PRESETS[0]);

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');

  // 필터링 및 검색된 게임 목록
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [games, selectedCategory, searchQuery]);

  // 게임 추가 핸들러
  const handleAddGame = (e: FormEvent) => {
    e.preventDefault();
    if (!newGameTitle.trim() || !newGameLink.trim()) return;

    const newGame: Game = {
      id: Date.now().toString(),
      title: newGameTitle,
      description: newGameDesc || 'No description provided.',
      category: newGameCategory,
      link: newGameLink,
      iconType: newGameIconType,
      iconValue: newGameIconValue.trim() || (newGameIconType === 'emoji' ? '🎮' : 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150'),
    };

    setGames(prev => [newGame, ...prev]);
    
    // 폼 초기화 및 모달 닫기
    setNewGameTitle('');
    setNewGameDesc('');
    setNewGameLink('');
    setNewGameIconValue('');
    setIsAddGameOpen(false);
  };

  // 게임 삭제 핸들러
  const handleDeleteGame = (id: string) => {
    if (confirm('Are you sure you want to remove this game?')) {
      setGames(prev => prev.filter(game => game.id !== id));
    }
  };

  // 카테고리 추가 핸들러
  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const formattedId = newCatName.toLowerCase().replace(/\s+/g, '_');
    
    // 중복 방지
    if (categories.some(cat => cat.id === formattedId)) {
      alert('This category already exists.');
      return;
    }

    const newCat: Category = {
      id: formattedId,
      name: newCatName.trim(),
      colorClass: selectedPresetColor
    };

    setCategories(prev => [...prev, newCat]);
    
    // 새로 추가한 카테고리를 게임 등록 폼의 기본값으로 세팅
    if (!newGameCategory) {
      setNewGameCategory(formattedId);
    }

    setNewCatName('');
  };

  // 카테고리 삭제 핸들러
  const handleDeleteCategory = (catId: string) => {
    if (confirm('Deleting this category will set associated games to Uncategorized. Proceed?')) {
      // 카테고리 목록에서 제거
      setCategories(prev => prev.filter(cat => cat.id !== catId));
      // 해당 카테고리를 사용하는 게임들을 무분류(uncategorized) 처리
      setGames(prev => prev.map(game => game.category === catId ? { ...game, category: '' } : game));
      if (selectedCategory === catId) {
        setSelectedCategory('all');
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-gray-200 selection:bg-primary-neon selection:text-black">
      
      {/* 2. HEADER NAVBAR */}
      <header className="sticky top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(165,231,255,0.05)]">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-primary-neon w-6 h-6 animate-pulse" />
            <h1 className="font-display text-2xl md:text-3xl font-black italic tracking-tighter text-primary-neon cursor-pointer" onClick={() => { setSelectedCategory('all'); setActiveNav('all_games'); }}>
              GAME HUB
            </h1>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setActiveNav('all_games')} 
              className={`text-xs md:text-sm font-bold uppercase tracking-widest transition-all py-2 border-b-2 ${
                activeNav === 'all_games' 
                  ? 'text-primary-neon border-primary-neon' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              All Games
            </button>
            <button 
              onClick={() => setActiveNav('manage')} 
              className={`text-xs md:text-sm font-bold uppercase tracking-widest transition-all py-2 border-b-2 flex items-center gap-1.5 ${
                activeNav === 'manage' 
                  ? 'text-secondary-neon border-secondary-neon' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Manage Studio
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-12 pb-24">
        
        {/* VIEW 1: ALL GAMES GRID */}
        {activeNav === 'all_games' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-xs font-bold tracking-widest text-primary-neon uppercase bg-primary-neon/10 px-3 py-1 rounded border border-primary-neon/20">
                  SYSTEM READY
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-black mt-3 text-primary-neon neon-glow-text">
                  Game Collection
                </h2>
                <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
                  Choose a card to jump into the grid. Scan the QR code to instantly play on your mobile phone!
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <input 
                  type="text" 
                  placeholder="Search games..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-primary-neon/50 text-white placeholder-gray-500 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Category Filtering Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar scroll-smooth">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`filter-chip px-5 py-2 text-xs md:text-sm uppercase font-semibold tracking-wider rounded-full border cursor-pointer transition-all ${
                  selectedCategory === 'all' 
                    ? 'active border-primary-neon text-primary-neon' 
                    : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                ALL
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`filter-chip px-5 py-2 text-xs md:text-sm uppercase font-semibold tracking-wider rounded-full border cursor-pointer transition-all ${
                    selectedCategory === cat.id 
                      ? 'active border-primary-neon text-primary-neon' 
                      : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Game Cards Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredGames.map((game, idx) => {
                    // 카테고리 정보 조회
                    const catInfo = categories.find(c => c.id === game.category);
                    const isNew = idx < 2 && !INITIAL_GAMES.some(g => g.id === game.id); // 새로 추가한 게임 강조

                    return (
                      <motion.div 
                        key={game.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        className="game-card neon-card rounded-xl p-4 md:p-6 flex flex-col relative group overflow-hidden border border-white/5 bg-white/[0.02]"
                      >
                        {/* New Tag Accent */}
                        {isNew && (
                          <span className="absolute top-0 right-0 bg-primary-neon text-black text-[9px] font-black px-2 py-0.5 rounded-bl uppercase tracking-wider">
                            NEW
                          </span>
                        )}

                        {/* Thumbnail Icon Area */}
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
                                className="w-10 h-10 object-cover rounded-md group-hover:scale-115 transition-transform duration-300"
                                onError={(e) => {
                                  // 핫링크 에러 시 엑박 대신 디폴트 아이콘 대체
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150";
                                }}
                              />
                            )}
                          </div>

                          {/* Quick Actions (QR & Link) */}
                          <div className="flex items-center gap-1.5">
                            {/* Autogenerated QR Trigger */}
                            <button 
                              title="Show Autogenerated QR Code"
                              onClick={() => setQrModalGame(game)}
                              className="p-1.5 rounded-lg bg-primary-neon/10 border border-primary-neon/20 text-primary-neon hover:bg-primary-neon/20 hover:border-primary-neon/40 active:scale-90 transition-all"
                            >
                              <QrCode className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            
                            {/* Direct Link */}
                            <a 
                              href={game.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white active:scale-90 transition-all"
                            >
                              <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                          </div>
                        </div>

                        {/* Game Meta */}
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-display font-extrabold text-sm md:text-base text-white tracking-wider group-hover:text-primary-neon transition-colors truncate">
                              {game.title}
                            </h3>
                            <p className="text-[11px] md:text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity">
                              {game.description}
                            </p>
                          </div>

                          {/* Bottom Category Badge */}
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
                <h3 className="text-lg font-bold text-white">No games found</h3>
                <p className="text-gray-500 text-sm mt-1">Try resetting the filter or search term</p>
                <button 
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 bg-primary-neon/10 hover:bg-primary-neon/25 text-primary-neon text-xs font-bold uppercase tracking-wider rounded-lg border border-primary-neon/30 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        )}


        {/* VIEW 2: MANAGE STUDIO PANEL (쉽고 편리한 커스텀 추가/설정 관리) */}
        {activeNav === 'manage' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left/Middle Column: Game Management & Add Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Add New Game Form Box */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 shadow-inner">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-secondary-neon/10 text-secondary-neon rounded-lg">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Add New Studio Game</h3>
                    <p className="text-xs text-gray-400">Fill in the fields. Your QR code will generate dynamically.</p>
                  </div>
                </div>

                <form onSubmit={handleAddGame} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Game Title *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Action Maze" 
                        value={newGameTitle}
                        onChange={(e) => setNewGameTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-secondary-neon/50 transition-all"
                      />
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Category Mapping *</label>
                      <div className="flex gap-2">
                        <select 
                          value={newGameCategory}
                          onChange={(e) => setNewGameCategory(e.target.value)}
                          className="flex-grow bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-secondary-neon/50 transition-all cursor-pointer"
                        >
                          <option value="" className="bg-black text-white">-- Uncategorized --</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-black text-white">
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <button 
                          type="button"
                          onClick={() => setIsManageCategoryOpen(true)}
                          className="px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          title="Manage/Create Categories"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Target Link (QR Target) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Target Link / URL * <span className="text-[10px] text-primary-neon lowercase font-normal">(Used to auto-generate QR)</span>
                    </label>
                    <input 
                      type="url" 
                      required
                      placeholder="e.g. https://play.google.com/..." 
                      value={newGameLink}
                      onChange={(e) => setNewGameLink(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-secondary-neon/50 transition-all"
                    />
                  </div>

                  {/* Icon Option Segment (Emoji or Hotlink Image URL) */}
                  <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Game Visual Display</span>
                      <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
                        <button 
                          type="button"
                          onClick={() => { setNewGameIconType('emoji'); setNewGameIconValue(''); }}
                          className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
                            newGameIconType === 'emoji' 
                              ? 'bg-secondary-neon text-black font-extrabold' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Smile className="w-3.5 h-3.5" />
                          Emoji
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setNewGameIconType('image'); setNewGameIconValue(''); }}
                          className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
                            newGameIconType === 'image' 
                              ? 'bg-secondary-neon text-black font-extrabold' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          Image URL
                        </button>
                      </div>
                    </div>

                    {newGameIconType === 'emoji' ? (
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Pick or type an Emoji (Leaves as default 🎮 if empty)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            maxLength={5}
                            placeholder="e.g. ♟, 👾, 🎯, 🧩" 
                            value={newGameIconValue}
                            onChange={(e) => setNewGameIconValue(e.target.value)}
                            className="w-24 bg-white/5 border border-white/10 rounded-lg p-2.5 text-center text-xl text-white focus:outline-none focus:border-secondary-neon/50"
                          />
                          <div className="flex flex-wrap items-center gap-1 text-lg">
                            {['👾','🎯','🧩','🎳','🎪','⚔️','🃏','♟','👑','🚀','🐉','🔑'].map(em => (
                              <button 
                                key={em}
                                type="button" 
                                onClick={() => setNewGameIconValue(em)}
                                className={`w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 border ${
                                  newGameIconValue === em ? 'border-secondary-neon text-secondary-neon' : 'border-transparent'
                                }`}
                              >
                                {em}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Hotlink Image URL (e.g. https://domain.com/image.png)</label>
                        <input 
                          type="url" 
                          placeholder="https://images.unsplash.com/photo-..." 
                          value={newGameIconValue}
                          onChange={(e) => setNewGameIconValue(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-secondary-neon/50 transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Game Description</label>
                    <textarea 
                      placeholder="Short catchphrase or play instruction." 
                      rows={2}
                      value={newGameDesc}
                      onChange={(e) => setNewGameDesc(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-secondary-neon/50 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full py-3 bg-secondary-neon hover:bg-[#e19bf3] text-black font-black uppercase text-xs tracking-widest rounded-lg transition-all active:scale-98 shadow-[0_0_15px_rgba(237,177,255,0.3)] flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Hub Collection
                    </button>
                  </div>
                </form>
              </div>

              {/* Game List with Delete Action */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-gray-400" />
                    Existing Games List ({games.length})
                  </h3>
                  <span className="text-[10px] text-gray-500 uppercase">Warning: Deletion is instant</span>
                </div>

                <div className="divide-y divide-white/5 max-h-96 overflow-y-auto pr-2">
                  {games.map(game => {
                    const cInfo = categories.find(c => c.id === game.category);
                    return (
                      <div key={game.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 truncate">
                          <span className="text-2xl w-8 text-center select-none">
                            {game.iconType === 'emoji' ? game.iconValue : '🖼️'}
                          </span>
                          <div className="truncate">
                            <h4 className="text-sm font-bold text-white truncate">{game.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-semibold text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase">
                                {cInfo?.name || 'Uncategorized'}
                              </span>
                              <span className="text-[10px] text-gray-500 truncate max-w-xs">{game.link}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={game.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button 
                            onClick={() => handleDeleteGame(game.id)}
                            className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Category Management Card */}
            <div className="space-y-8">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-inner">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-neon/10 text-primary-neon rounded-lg">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Categories Setup</h3>
                    <p className="text-xs text-gray-400">Add categories here to immediately map your games.</p>
                  </div>
                </div>

                {/* Categories Creation Form */}
                <form onSubmit={handleAddCategory} className="space-y-4 mb-6 pb-6 border-b border-white/5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">New Category Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Adventure, Arcade" 
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary-neon/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Preset Color Accent</label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_PRESETS.map((color, idx) => {
                        const wordColor = color.match(/text-(\w+-\d+)/)?.[1] || 'gray-400';
                        return (
                          <button 
                            key={idx}
                            type="button"
                            onClick={() => setSelectedPresetColor(color)}
                            className={`h-10 rounded-lg border flex items-center justify-center transition-all ${
                              selectedPresetColor === color 
                                ? 'border-primary-neon bg-white/5' 
                                : 'border-white/5 bg-transparent'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full bg-${wordColor} inline-block shadow-[0_0_8px_currentColor]`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2 bg-primary-neon hover:bg-[#c2f0ff] text-black font-extrabold uppercase text-xs tracking-widest rounded-lg transition-all active:scale-98 shadow-[0_0_12px_rgba(165,231,255,0.2)] flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Create Category
                  </button>
                </form>

                {/* List of current Categories */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Active Categories ({categories.length})</h4>
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {categories.map(cat => {
                      const count = games.filter(g => g.category === cat.id).length;
                      return (
                        <div key={cat.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                          <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${cat.colorClass}`}>
                            {cat.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 font-mono font-bold">{count} Games</span>
                            {/* 기본 카테고리는 삭제 불가, 동적 생성만 삭제 가능하도록 설정 혹은 전체 가능 */}
                            <button 
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Developer Tip Box */}
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-primary-neon uppercase flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  Code Customization Guide
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We've isolated <code className="text-secondary-neon bg-white/5 px-1 py-0.5 rounded">INITIAL_CATEGORIES</code> and <code className="text-secondary-neon bg-white/5 px-1 py-0.5 rounded">INITIAL_GAMES</code> at the top of the file so you can easily add, edit, or remove the hardcoded JSON structures right inside the code.
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed pt-1 border-t border-white/5">
                  QR Codes generate instantly via server-side pixel translation. No local files required!
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* 3. AUTOGENERATED QR MODAL (링크 주소에 따른 QR코드 자동 생성) */}
      <AnimatePresence>
        {qrModalGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setQrModalGame(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-neutral-900 border border-primary-neon/30 rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(165,231,255,0.15)]"
              onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
            >
              <div className="p-6 md:p-8 text-center relative">
                {/* Close Button */}
                <button 
                  onClick={() => setQrModalGame(null)} 
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <h4 className="font-display text-2xl font-black text-primary-neon tracking-wider uppercase mb-1">
                  Scan to Play
                </h4>
                <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-6">
                  {qrModalGame.title}
                </p>

                {/* Instant QR Code generator utilizing the link directly! */}
                <div className="bg-white p-4.5 rounded-xl inline-block shadow-inner mb-6 relative group">
                  <img 
                    alt={`QR Code for ${qrModalGame.title}`} 
                    className="w-48 h-48 select-none" 
                    // 외부 QR 생성 무료 API를 사용하여 링크 입력만으로 알아서 QR이 생성되어 가져오게 설계했습니다.
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrModalGame.link)}`}
                  />
                  
                  {/* Loading indicator behind QR */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <span className="text-[10px] font-bold text-black uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Dynamic Link
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-6 px-4 truncate" title={qrModalGame.link}>
                  Link: <span className="text-primary-neon underline font-mono">{qrModalGame.link}</span>
                </p>

                <div className="flex gap-2">
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
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold uppercase text-xs tracking-widest rounded-lg transition-all active:scale-95 border border-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODAL: Category Creator Quick overlay */}
      <AnimatePresence>
        {isManageCategoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsManageCategoryOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-neutral-900 border border-white/10 p-6 rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary-neon" />
                  Manage Studio Categories
                </h3>
                <button onClick={() => setIsManageCategoryOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form inside modal */}
              <form onSubmit={handleAddCategory} className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sports, Retro" 
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary-neon/50"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-2 bg-primary-neon hover:bg-[#c2f0ff] text-black font-extrabold text-xs uppercase rounded-lg transition-all"
                >
                  Create Category
                </button>
              </form>

              {/* List inside modal */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${cat.colorClass}`}>
                      {cat.name}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-gray-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. BOTTOM STATUS BAR (HUMBLE & PROFESSIONAL DESIGN) */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-black/95 border-t border-white/5 flex items-center justify-between px-4 md:px-12 z-30">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-neon animate-pulse inline-block" />
          Game Hub System Online
        </div>
        <div className="text-[10px] text-gray-500 font-mono uppercase">
          Dynamic QR API Binding Active
        </div>
      </footer>
    </div>
  );
}
