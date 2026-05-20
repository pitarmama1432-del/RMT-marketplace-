import { useState, useEffect, FormEvent, DragEvent, ChangeEvent } from 'react';
import { GameType, CategoryType, GamingListing } from '../types';
import { PlusCircle, LineChart, ShieldAlert, BadgeInfo, Star, Layers, DollarSign, Sparkles, Upload, Image as ImageIcon, X, Trash2, Edit2, Archive, Power } from 'lucide-react';

interface SellerDashboardProps {
  currentUser: string;
  onAddListing: (newListing: any) => void;
  onNavigateToCatalog: () => void;
}

export default function SellerDashboard({ currentUser, onAddListing, onNavigateToCatalog }: SellerDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'stats' | 'listings'>('listings');

  const [myListings, setMyListings] = useState<GamingListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  const [editingListing, setEditingListing] = useState<GamingListing | null>(null);

  const fetchMyListings = async () => {
    setLoadingListings(true);
    try {
      const res = await fetch('/api/listings?all=true');
      if (res.ok) {
        const data = await res.json();
        const mine = data.filter((l: any) => l.seller.username === currentUser);
        setMyListings(mine);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingListings(false);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchMyListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveEditedListing = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;
    try {
      const res = await fetch(`/api/listings/${editingListing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingListing)
      });
      if (res.ok) {
        setEditingListing(null);
        fetchMyListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'listings') {
      fetchMyListings();
    }
  }, [activeSubTab]);

  const toggleListingActive = async (id: string, currentActiveStatus: boolean) => {
    try {
      const res = await fetch(`/api/listings/${id}/toggleActive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActiveStatus })
      });
      if (res.ok) {
        fetchMyListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // New Listing State Fields
  const [title, setTitle] = useState('');
  const [game, setGame] = useState<GameType>('PUBG Mobile');
  const [categoriesList, setCategoriesList] = useState<string[]>(['Account', 'Currency', 'Item', 'Coaching']);
  const [category, setCategory] = useState<string>('Account');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [price, setPrice] = useState('1800');
  const [description, setDescription] = useState('');
  const [deliveryType, setDeliveryType] = useState('Instant Delivery');

  // Spec states
  const [specRank, setSpecRank] = useState('Diamond 2');
  const [specOutfitsSkins, setSpecOutfitsSkins] = useState('45+ Premium Skins');
  const [specAccess, setSpecAccess] = useState('Full Access Key');

  // Images states
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Dynamic AI Scanner
  const [scanning, setScanning] = useState(false);
  const [aiReport, setAiReport] = useState<{ riskScore: number; advice: string | null }>({
    riskScore: 4,
    advice: null
  });

  // Run dynamic analysis on typing
  const runTextAnalysis = async (textVal: string) => {
    if (textVal.length < 15) return;
    setScanning(true);
    try {
      // Direct call to Gemini backend api
      const response = await fetch('/api/ai/analyze-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          game,
          description: textVal,
          price: parseFloat(price) || 1000,
          category
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiReport({
          riskScore: result.scamProbability,
          advice: result.riskReason
        });
      }
    } catch (e) {
      // offline heuristics fallback
      const dangerous = /telegram|bypass|direct payment|bkash raw|cheat/i.test(textVal);
      setAiReport({
        riskScore: dangerous ? 45 : 6,
        advice: dangerous
          ? 'CRITICAL WARNING: Description contains off-platform transaction words ("telegram" or "direct payment"). This listing violates safety guidelines.'
          : 'Description text matches legitimate gaming sales templates.'
      });
    } finally {
      setScanning(false);
    }
  };

  const handleDescChange = (val: string) => {
    setDescription(val);
    // Debounce simple trigger
    const timeout = setTimeout(() => {
      runTextAnalysis(val);
    }, 1000);
    return () => clearTimeout(timeout);
  };

  // Image helpers
  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setUploadedImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublishListing = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !description.trim()) return;

    const mockStats: Record<string, string> = {
      'Rank': specRank,
      'Skins/Bundles': specOutfitsSkins,
      'Full Access': specAccess
    };

    const newListingData = {
      title,
      game,
      category,
      price: parseFloat(price) || 1200,
      description,
      deliveryTime: deliveryType,
      stats: mockStats,
      tags: [specRank, 'Verified'],
      screenshots: uploadedImages,
      sellerTrades: 1
    };

    onAddListing(newListingData);
    onNavigateToCatalog();
  };

  return (
    <div className="space-y-6 pb-12 text-left animate-fade-in">
      {/* Upper header */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Seller Dashboard Center</h2>
            <span className="text-[10px] bg-green-500/10 text-green-400 font-mono font-bold px-2 py-0.5 rounded border border-green-500/10">ACTIVE VERIFIED SELLER</span>
          </div>
          <p className="text-xs text-slate-500 font-mono">KYC ID: GT-91283-KYC • commission rate: 2.5% (Premium Class)</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            id="seller-tab-create"
            onClick={() => setActiveSubTab('create')}
            className={`px-4.5 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider cursor-pointer border transition-all ${
              activeSubTab === 'create'
                ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Create New Listing
          </button>
          <button
            id="seller-tab-listings"
            onClick={() => setActiveSubTab('listings')}
            className={`px-4.5 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider cursor-pointer border transition-all ${
              activeSubTab === 'listings'
                ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            My Listings
          </button>
          <button
            id="seller-tab-stats"
            onClick={() => setActiveSubTab('stats')}
            className={`px-4.5 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider cursor-pointer border transition-all ${
              activeSubTab === 'stats'
                ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Analytics & Earnings
          </button>
        </div>
      </div>

      {activeSubTab === 'listings' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wide font-mono flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              My Inventory Listings
            </h3>
            <button
              onClick={fetchMyListings}
              className="text-[10px] text-purple-400 font-bold uppercase hover:text-purple-300 font-mono tracking-wider cursor-pointer bg-white/5 px-2.5 py-1.5 rounded transition-colors"
            >
              Refresh List
            </button>
          </div>

          {loadingListings ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs animate-pulse">
              Syncing inventory data...
            </div>
          ) : myListings.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs space-y-2">
              <p>No listings found.</p>
              <button 
                onClick={() => setActiveSubTab('create')} 
                className="text-purple-400 underline cursor-pointer hover:text-purple-300"
              >
                Create your first listing now.
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myListings.map((listing: any) => (
                <div key={listing.id} className="bg-slate-950/80 border border-white/5 rounded-2xl overflow-hidden flex flex-col group">
                  <div className="relative h-32 w-full bg-slate-900 border-b border-white/5">
                    {listing.screenshots && listing.screenshots.length > 0 ? (
                       <img src={listing.screenshots[0]} alt="cover" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                         <ImageIcon className="w-8 h-8 mb-1" />
                         <span className="text-[10px] font-mono uppercase">Media</span>
                       </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      {listing.isActive === false ? (
                        <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-600 text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono shadow-sm">
                          Inactive
                        </span>
                      ) : listing.approved === true ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-[9px] text-emerald-400 font-bold uppercase tracking-wider font-mono shadow-sm">
                          Active & Live
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-[9px] text-amber-400 font-bold uppercase tracking-wider font-mono shadow-sm">
                          Pending Approval
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight">{listing.game}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">{listing.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-tight line-clamp-2">{listing.title}</h4>
                      <p className="text-purple-400 font-black text-xs font-mono">৳ {listing.price.toLocaleString()}</p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex gap-2">
                      <button 
                        onClick={() => toggleListingActive(listing.id, listing.isActive !== false)}
                        className={`flex-1 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          listing.isActive !== false
                            ? 'bg-amber-950/30 text-amber-500 border border-amber-900/40 hover:bg-amber-900/40'
                            : 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/40 hover:bg-emerald-900/40'
                        }`}
                        title={listing.isActive !== false ? "Deactivate" : "Activate"}
                      >
                        <Power className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          const newPrice = window.prompt("Enter new price in BDT:", listing.price.toString());
                          if (newPrice !== null) {
                            const newP = parseFloat(newPrice);
                            if (!isNaN(newP)) {
                              setEditingListing({ ...listing, price: newP });
                              // Simple update mock trigger (to keep it fast, we do inline)
                              const updated = { ...listing, price: newP };
                              fetch(`/api/listings/${listing.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updated)
                              }).then(() => fetchMyListings());
                            }
                          }
                        }}
                        className="flex-1 py-1.5 bg-blue-950/30 text-blue-400 border border-blue-900/40 hover:bg-blue-900/40 rounded text-[10px] uppercase font-bold tracking-wider font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Edit Price"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => deleteListing(listing.id)}
                        className="flex-1 py-1.5 bg-red-950/30 text-red-500 border border-red-900/40 hover:bg-red-900/40 rounded text-[10px] uppercase font-bold tracking-wider font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Delete Listing permanently"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Creator Form */}
          <form onSubmit={handlePublishListing} className="lg:col-span-8 bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wide font-mono text-purple-400 flex items-center gap-2">
              <PlusCircle className="w-4.5 h-4.5" />
              <span>Register Gaming Listing</span>
            </h3>

            {/* Secure in-app delivery notice card */}
            <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-1">
              <span className="text-[10px] bg-purple-600/30 text-purple-300 font-mono font-bold px-2 py-0.5 rounded border border-purple-500/20">ESCROW PHOTO PROTECTION COVERS ACTIVE</span>
              <p className="text-xs text-white font-bold font-sans">📸 Product Media Upload Option Enabled</p>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                You can now upload screenshots or paste image links to showcase game cosmetics. Direct in-app secure handover rules still apply to protect account credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Listing Public Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Stacked Valorant Diamond 3 Account with Reaver Vandal"
                  className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              {/* Game selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Game Category</label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value as any)}
                  className="w-full bg-slate-950 rounded-xl px-3 py-3 text-xs text-slate-300 border border-white/10 focus:border-purple-400 focus:outline-none font-mono"
                >
                  <option value="PUBG Mobile">PUBG Mobile</option>
                  <option value="Free Fire">Free Fire</option>
                  <option value="Mobile Legends">Mobile Legends</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Call of Duty">Call of Duty</option>
                  <option value="FC Mobile">FC Mobile</option>
                  <option value="Roblox">Roblox</option>
                  <option value="Genshin Impact">Genshin Impact</option>
                  <option value="Free Fire">Free Fire</option>
                </select>
              </div>

              {/* Item category */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block flex justify-between">
                  <span>Trading Category</span>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="text-[9px] text-purple-400 hover:text-purple-300 underline font-semibold font-mono"
                  >
                    {showCustomInput ? "Choose List" : "+ Add Option"}
                  </button>
                </label>
                
                {showCustomInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="e.g., Battlepass"
                      className="flex-grow bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customCategoryInput.trim()) {
                          const cleaned = customCategoryInput.trim();
                          if (!categoriesList.includes(cleaned)) {
                            setCategoriesList(prev => [...prev, cleaned]);
                          }
                          setCategory(cleaned);
                          setCustomCategoryInput('');
                          setShowCustomInput(false);
                        }
                      }}
                      className="px-3 bg-purple-650 hover:bg-purple-600 border border-purple-500 text-white rounded-xl text-xs font-mono font-bold"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 rounded-xl px-3 py-3 text-xs text-slate-300 border border-white/10 focus:border-purple-400 focus:outline-none font-mono"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1 font-mono">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Price in BDT (৳)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1800"
                    className="w-full bg-slate-950 rounded-xl pl-8 pr-3 py-3 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Delivery Speed */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Guaranteed Delivery Commitment</label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="w-full bg-slate-950 rounded-xl px-3 py-3 text-xs text-slate-300 border border-white/10 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-405 font-mono"
                >
                  <option value="Instant Delivery">Instant (Automated escrow handover)</option>
                  <option value="Within 1 Hour">Highly Urgent (Within 1 hour)</option>
                  <option value="Within 2 Hours">Quick Transfer (Within 2 hours)</option>
                  <option value="Within 24 Hours">Next Day (Within 24 hours)</option>
                </select>
              </div>

              {/* Details specifications - custom Rank, cosmetics size */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Primary Level/Rank Specification</label>
                <input
                  type="text"
                  value={specRank}
                  onChange={(e) => setSpecRank(e.target.value)}
                  placeholder="e.g., Level AR 58 / Mythical Merit"
                  className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Secondary Inventory Specification</label>
                <input
                  type="text"
                  value={specOutfitsSkins}
                  onChange={(e) => setSpecOutfitsSkins(e.target.value)}
                  placeholder="e.g., 60+ Outfits / Elite weapon blueprints"
                  className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Image / Screenshots Handover Panel */}
            <div className="space-y-3 pt-2 text-left">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block flex justify-between items-center">
                <span>Product Showcase Images / Proof Screenshots</span>
                <span className="text-[9px] text-purple-400 font-semibold lowercase">Supports drag & drop or custom URLs</span>
              </label>

              {/* Drag and Drop Container */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${
                  dragActive
                    ? 'border-purple-400 bg-purple-950/30'
                    : 'border-white/10 bg-slate-950 hover:border-purple-500/50 hover:bg-slate-950/80'
                }`}
              >
                <input
                  type="file"
                  id="product-image-file-input"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <label
                  htmlFor="product-image-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white font-bold font-sans">
                      Drag & Drop gaming screenshots or click to browse
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono uppercase">
                      PNG, JPG, WEBP, GIF up to 5MB each
                    </p>
                  </div>
                </label>
              </div>

              {/* Paste URL Input for extra versatility */}
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-xs">URL</span>
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Or paste direct image URL (e.g. web link)..."
                    className="w-full bg-slate-950 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none font-sans"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4.5 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  Add URL
                </button>
              </div>

              {/* Thumbnails list preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/30 group bg-slate-950">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-950/80 border border-red-500/40 text-red-400 hover:text-white rounded-lg transition-colors shadow-md animate-fade-in"
                        title="Remove Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-1 left-2 bg-black/70 px-1.5 py-0.5 rounded text-[8px] font-mono text-white uppercase tracking-wider">
                        Screenshot #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description containing Text change scanner */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Full Item Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => handleDescChange(e.target.value)}
                placeholder="Include details about linking, platform logins, rare bundles, or coin stacks..."
                className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            <button
              type="submit"
              id="btn-publish-listing-action"
              className="cursor-pointer w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-lg shadow-lg shadow-purple-500/20 border border-purple-400/20 text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all font-mono"
            >
              <span>Verify & Publish Listing Securely</span>
            </button>
          </form>

          {/* AI Scanner Realtime Report sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                  <h4 className="font-extrabold text-white text-xs font-mono uppercase tracking-wide">Real-time Scam Probe</h4>
                </div>
                {scanning && (
                  <span className="text-[10px] text-purple-400 font-mono animate-pulse">Running Scan...</span>
                )}
              </div>

              {/* Score indicator */}
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-xs text-slate-500 font-bold uppercase">Computed Scam Risk:</span>
                  <span className={`font-black text-sm px-2 py-0.5 rounded ${
                    aiReport.riskScore > 20 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {aiReport.riskScore}% Risk
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${
                    aiReport.riskScore > 20 ? 'bg-red-400' : 'bg-green-400'
                  }`} style={{ width: `${aiReport.riskScore}%` }} />
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1 text-xs">
                  <p className="text-purple-400 font-mono font-bold text-[9px] uppercase tracking-wider">AI Audit Evaluation Advisory:</p>
                  <p className="text-slate-300 font-light leading-relaxed font-sans">
                    {aiReport.advice || 'Type details into the description input to execute automated scam & safe-commerce checkups instantly.'}
                  </p>
                </div>

                {/* Interactive hints */}
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1.5 text-[11px] leading-relaxed">
                  <p className="font-bold text-slate-300 flex items-center gap-1">
                    <BadgeInfo className="w-3.5 h-3.5" />
                    <span>How to test scam guard:</span>
                  </p>
                  <p className="text-slate-400 font-light leading-relaxed font-sans">
                    Try writing phrases like <code className="text-purple-400 bg-slate-950 px-1 py-0.5 rounded font-mono">"pay directly bypass"</code> or <code className="text-purple-400 bg-slate-950 px-1 py-0.5 rounded font-mono">"add my telegram links"</code> in the description to watch the AI-scammed analyzer automatically flag keyword anomalies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 text-left">
            <p className="text-slate-500 text-[10px] uppercase">My Real-Time Wallet Balance</p>
            <h3 className="text-green-400 font-black text-2xl">৳ 18,400</h3>
            <p className="text-[10px] text-slate-500">Available for withdrawal instantly.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 text-left">
            <p className="text-slate-500 text-[10px] uppercase">Lifetime Total Earnings</p>
            <h3 className="text-white font-black text-2xl">৳ 142,500</h3>
            <p className="text-[10px] text-purple-400 font-bold uppercase text-xs">53 Trades Completed</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 text-left">
            <p className="text-slate-500 text-[10px] uppercase">Shop Merchant Rating</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span className="text-white font-black text-lg">5.0 Star</span>
              <span className="text-slate-500 text-xs">(234 reviews)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">99.4% trade success reputation.</p>
          </div>
        </div>
      )}
    </div>
  );
}
