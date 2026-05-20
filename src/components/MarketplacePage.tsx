import { useState, useEffect } from 'react';
import { GamingListing, GameType, CategoryType } from '../types';
import { Search, SlidersHorizontal, ShieldCheck, Check, Star, RefreshCw, AlertCircle } from 'lucide-react';

interface MarketplacePageProps {
  onViewListing: (listing: GamingListing) => void;
  initialGameFilter?: string;
  onNavigateToSell: () => void;
}

export default function MarketplacePage({ onViewListing, initialGameFilter = '', onNavigateToSell }: MarketplacePageProps) {
  const [listings, setListings] = useState<GamingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>(initialGameFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [maxRisk, setMaxRisk] = useState<number>(30);

  // Sync initial game filter if passed down
  useEffect(() => {
    if (initialGameFilter) {
      setSelectedGame(initialGameFilter);
    }
  }, [initialGameFilter]);

  // Fetch listings from real backend
  const loadListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listings');
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Fallback
      import('../data').then(({ INITIAL_LISTINGS }) => {
        setListings(INITIAL_LISTINGS);
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  // Filter logic
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.seller.username.toLowerCase().includes(search.toLowerCase());
    const matchesGame = selectedGame ? item.game === selectedGame : true;
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesPrice = item.price <= maxPrice;
    const matchesVerified = onlyVerified ? item.verifiedSeller : true;
    const matchesRisk = item.riskScore <= maxRisk;

    return matchesSearch && matchesGame && matchesCategory && matchesPrice && matchesVerified && matchesRisk;
  });

  const GAMES: GameType[] = [
    'PUBG Mobile',
    'Free Fire',
    'Mobile Legends',
    'Valorant',
    'Call of Duty',
    'FC Mobile',
    'Roblox',
    'Genshin Impact'
  ];

  const CATEGORIES = Array.from(new Set([
    'Account', 'Item', 'Coaching', 'Currency',
    ...listings.map(l => l.category)
  ]));

  return (
    <div className="space-y-8 pb-10 text-left animate-fade-in">
      {/* Header Banner */}
      <div className="p-8 md:p-12 rounded-3xl bg-slate-900/20 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="space-y-2 relative">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
            Gaming <span className="underline decoration-purple-500 decoration-3 underline-offset-4">Marketplace</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-lg font-light">
            Search thousands of accounts, verified top-ups, and legendary coaching passes. Fully shielded by automated AI security rules.
          </p>
        </div>
        <button
          id="btn-nav-sell"
          onClick={onNavigateToSell}
          className="cursor-pointer px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-sm text-white shadow-lg shadow-purple-500/20 transition-all"
        >
          Sell Assets Now
        </button>
      </div>

      {/* Grid of Search, Filters and Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel Sidebar */}
        <div className="lg:col-span-1 space-y-6 bg-slate-900/20 border border-white/5 p-5 rounded-2xl">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 font-bold text-white text-xs font-mono tracking-widest uppercase">
              <SlidersHorizontal className="w-4 h-4 text-purple-500" />
              <span>FILTERS</span>
            </div>
            <button
              id="btn-filter-reset"
              onClick={() => {
                setSearch('');
                setSelectedGame('');
                setSelectedCategory('');
                setMaxPrice(6000);
                setOnlyVerified(false);
                setMaxRisk(30);
              }}
              className="text-[11px] text-purple-400 hover:text-purple-300 font-mono tracking-tight cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Keyword Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search skins, titles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Game Select */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Select Game</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                id="btn-game-select-all"
                onClick={() => setSelectedGame('')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  !selectedGame ? 'bg-purple-600 text-white shadow-md font-bold' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                }`}
              >
                All Games
              </button>
              {GAMES.map((game) => (
                <button
                  key={game}
                  id={`btn-game-${game.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedGame(game)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    selectedGame === game ? 'bg-purple-600 text-white shadow-md font-bold' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Item Category</label>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`btn-cat-${cat.toLowerCase()}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                  className={`px-2 py-2 rounded-lg text-[11px] font-mono font-bold text-center cursor-pointer transition-all border ${
                    selectedCategory === cat
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-extrabold'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 font-mono">
            <div className="flex justify-between items-baseline text-xs">
              <label className="font-bold text-gray-400 uppercase">Max Budget</label>
              <span className="text-purple-400 font-bold">৳ {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-purple-500 bg-slate-950 rounded-lg cursor-pointer max-w-sm"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-bold">
              <span>৳ 200</span>
              <span>৳ 10,000+</span>
            </div>
          </div>

          {/* AI Maximum Risk Tolerance Filter */}
          <div className="space-y-2 font-mono pb-2 border-b border-white/5">
            <div className="flex justify-between items-baseline text-xs">
              <label className="font-bold text-slate-400 uppercase tracking-tight">AI Risk Score Limit</label>
              <span className={`font-bold ${maxRisk <= 10 ? 'text-green-400' : maxRisk <= 20 ? 'text-amber-400' : 'text-red-400'}`}>
                {maxRisk}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={maxRisk}
              onChange={(e) => setMaxRisk(parseInt(e.target.value))}
              className="w-full accent-purple-500 bg-white/5 rounded-lg cursor-pointer max-w-sm"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold">
              <span className="text-green-400 hover:underline">Low Risk (&lt;10%)</span>
              <span className="text-red-400">High Risk (30%)</span>
            </div>
          </div>

          {/* Verified Seller Switch */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={() => setOnlyVerified(!onlyVerified)}
              className="rounded-md border-white/10 bg-white/5 accent-purple-500 w-4 h-4 cursor-pointer"
            />
            <div className="space-y-0.5 text-left">
              <p className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Verified Sellers Only</span>
              </p>
              <p className="text-[10px] text-slate-500 font-light leading-none">Filters listings backed by verified KYC.</p>
            </div>
          </label>
        </div>

        {/* Listings Display Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <p className="text-[11px] font-mono text-slate-400 tracking-wider">
              SHOWING <span className="text-purple-400 font-bold">{filteredListings.length}</span> GAME PRODUCTS
            </p>
            <button
              id="refresh-listings"
              onClick={loadListings}
              className="p-1 px-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Feed</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-panel h-64 rounded-2xl p-6 space-y-4 animate-pulse">
                  <div className="h-4 bg-purple-950/50 rounded w-1/4" />
                  <div className="h-6 bg-slate-900 rounded w-3/4" />
                  <div className="h-20 bg-slate-950/40 rounded" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-purple-950/65 rounded w-1/3" />
                    <div className="h-6 bg-slate-900 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="p-16 text-center glass-panel rounded-3xl border border-dashed border-purple-900/30 space-y-4 max-w-xl mx-auto">
              <AlertCircle className="w-12 h-12 text-purple-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-white font-bold text-base">No Matching Listings Found</h3>
                <p className="text-xs text-gray-500 font-light">Try expanding your budget parameters, reducing the AI Safety threshold, or widening your game selection tags.</p>
              </div>
              <button
                id="btn-clear-search"
                onClick={() => {
                  setSearch('');
                  setSelectedGame('');
                  setSelectedCategory('');
                  setMaxPrice(6000);
                  setOnlyVerified(false);
                  setMaxRisk(30);
                }}
                className="cursor-pointer px-4 py-2 bg-purple-900/40 rounded-xl border border-purple-500/20 text-xs font-bold text-purple-300 hover:bg-purple-900/60"
              >
                Deactivate All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onViewListing(item)}
                  className="group relative rounded-2xl bg-white/5 border border-white/10 p-4 transition-all hover:border-purple-500/50 hover:bg-white/[0.08] cursor-pointer flex flex-col justify-between duration-300 transform hover:-translate-y-1"
                >
                  {/* Card Image Area */}
                  <div className="h-36 w-full bg-slate-800 rounded-xl mb-3 overflow-hidden relative">
                    {item.screenshots && item.screenshots.length > 0 ? (
                      <img
                        src={item.screenshots[0]}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-65 group-hover:opacity-80 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 border border-purple-500/10 rounded-xl relative overflow-hidden select-none">
                        <div className="absolute inset-0 bg-radial-gradient from-purple-900/10 to-transparent pointer-events-none" />
                        <ShieldCheck className="w-7 h-7 text-purple-400 shrink-0 mb-1 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">DIRECT IN-APP DELIVERY</span>
                        <span className="text-[8px] font-mono text-purple-400 font-extrabold uppercase mt-0.5">Escrow Credentials Protected</span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 bg-purple-950/90 border border-purple-500/30 px-2.5 py-1 rounded text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                      {item.game}
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 border border-white/15 px-2 py-0.5 rounded text-[10px] font-mono text-slate-200">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.riskScore < 10 ? 'bg-green-400' : 'bg-amber-400'}`} />
                      <span>{item.riskScore}% RISK</span>
                    </div>

                    <div className="absolute bottom-2 left-2 flex gap-1.5">
                      <span className="bg-black/50 border border-white/10 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-purple-400 uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-3 flex-grow flex flex-col justify-between">
                    <div className="space-y-1 text-left">
                      <h3 className="font-extrabold text-white text-sm tracking-tight group-hover:text-purple-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-xs font-light line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Stats key values */}
                    {Object.keys(item.stats).length > 0 && (
                      <div className="grid grid-cols-2 gap-2 p-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-mono">
                        {Object.entries(item.stats).slice(0, 2).map(([key, val]) => (
                          <div key={key} className="flex justify-between px-1 text-slate-400">
                            <span className="uppercase text-slate-500 text-[9px]">{key}:</span>
                            <span className="text-slate-200 font-bold truncate max-w-[70px]">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer Info Seller and price */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.seller.avatarUrl}
                          alt={item.seller.username}
                          className="w-6 h-6 rounded-full border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-1 leading-none">
                            {item.seller.username}
                            {item.seller.isVerified && <span className="text-[10px] text-purple-400">★</span>}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5 text-[9px] font-mono text-slate-400">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span className="text-amber-400 font-bold">{item.seller.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[8px] text-purple-400 uppercase tracking-wider font-mono font-semibold leading-none">Escrow Armed</p>
                        <p className="text-sm font-extrabold text-white font-mono mt-0.5 leading-none">
                          ৳{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
