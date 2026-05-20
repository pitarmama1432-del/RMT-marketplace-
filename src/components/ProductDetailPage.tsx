import { useState, useEffect, FormEvent } from 'react';
import { GamingListing, ChatMessage } from '../types';
import { ShieldAlert, Sparkles, MessageCircle, ArrowLeft, Star, ShoppingCart, ShieldCheck, Mail, Send, AlertTriangle } from 'lucide-react';

interface ProductDetailPageProps {
  listing: GamingListing;
  onBack: () => void;
  onInitiatePurchase: (listing: GamingListing) => void;
  userBalance: number;
}

export default function ProductDetailPage({ listing, onBack, onInitiatePurchase, userBalance }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'seller' | 'chat'>('info');

  // Chat simulator states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: listing.seller.username,
      message: `Hi there! Thanks for viewing my ${listing.game} listing. This account is fully registered with mine own backup email. I can assist you with instant linkage. Any questions?`,
      timestamp: 'Just now'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isModerating, setIsModerating] = useState(false);
  const [aiWarning, setAiWarning] = useState<string | null>(null);

  // Listing Risk Analysis
  const [riskAnalysis, setRiskAnalysis] = useState<{ scamProbability: number; safeScore: number; riskReason: string; flaggedKeywords: string[] }>({
    scamProbability: listing.riskScore,
    safeScore: 100 - listing.riskScore,
    riskReason: listing.riskReason || 'Listing parameters indicate pristine legitimacy.',
    flaggedKeywords: []
  });

  const [analyzingListing, setAnalyzingListing] = useState(false);

  // Pull active live analysis from backend on mounting
  useEffect(() => {
    const fetchDetailedRiskAnalysis = async () => {
      setAnalyzingListing(true);
      try {
        const response = await fetch('/api/ai/analyze-listing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: listing.title,
            game: listing.game,
            description: listing.description,
            price: listing.price,
            category: listing.category
          })
        });
        if (response.ok) {
          const result = await response.json();
          setRiskAnalysis(result);
        }
      } catch (err) {
        // Fallback already pre-set
      } finally {
        setAnalyzingListing(false);
      }
    };
    fetchDetailedRiskAnalysis();
  }, [listing]);

  // Handle chat inputs with real-time AI filtration
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'corbinburrow3358', // acting user
      message: userInput,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    const originalInput = userInput;
    setUserInput('');
    setIsModerating(true);
    setAiWarning(null);

    try {
      const response = await fetch('/api/ai/moderate-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: originalInput })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.isSuspicious) {
          setAiWarning(result.autoWarning);
          // Insert a warning in chat log
          setChatMessages(prev => [...prev, {
            id: `sys-agent-warn-${Date.now()}`,
            sender: '🚨 AI GUARD SHIELD',
            message: result.autoWarning || 'ALERT: Suspicious bypass transaction attempt detected.',
            timestamp: 'Just now',
            isAi: true
          }]);
        } else {
          // Normal simulated seller reply
          setTimeout(() => {
            setChatMessages(prev => [...prev, {
              id: `msg-reply-${Date.now()}`,
              sender: listing.seller.username,
              message: `That sounds great! If you tap the 'Secure Buy via Escrow' button, Gametrade will immediately lock the funds and open our verified credential handoff ledger. I am online and ready to deliver.`,
              timestamp: 'Just now'
            }]);
          }, 1200);
        }
      }
    } catch (err) {
      // Offline fallback simple warn
      if (/discord|telegram|whastapp|phone|direct pay|skip escrow/i.test(originalInput)) {
        const warnText = "AI SECURITY WARNING: Exchanging off-site contacts or planning direct transfers outside of GameTrade's micro-escrow leads immediately to permanent banning. Keep communications secure!";
        setAiWarning(warnText);
        setChatMessages(prev => [...prev, {
          id: `sys-agent-warn-fallback`,
          sender: '🚨 AI GUARD SHIELD',
          message: warnText,
          timestamp: 'Just now',
          isAi: true
        }]);
      }
    } finally {
      setIsModerating(false);
    }
  };

  const imagesList = listing.screenshots.length > 0
    ? listing.screenshots
    : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Back navigation option */}
      <button
        id="btn-back-marketplace"
        onClick={onBack}
        className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-mono tracking-wider transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO CATALOG</span>
      </button>

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gallery and Info area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
            <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
              {listing.screenshots && listing.screenshots.length > 0 ? (
                <>
                  <img
                    src={imagesList[selectedImage]}
                    alt={listing.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 animate-fade-in"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-white tracking-widest uppercase z-10">
                    {listing.game}
                  </div>
                </>
              ) : (
                <div className="space-y-4 max-w-md z-10 font-mono">
                  <div className="w-16 h-16 bg-purple-650/30 border border-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/10">
                    <ShieldCheck className="w-8 h-8 text-purple-400 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-black tracking-wider text-sm uppercase">ESCROW-VERIFIED IN-APP TRANSFER</p>
                    <p className="text-xs text-slate-400 font-sans font-light leading-relaxed">
                      This listing is tagged with direct, system-moderated in-app credential handover. Handover credentials are protected inside GameTrade\'s virtual micro-escrow and do not use physical attachments.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase rounded-lg px-2.5 py-1">Instant Access Link</span>
                    <span className="text-[9px] bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold uppercase rounded-lg px-2.5 py-1">Photo Omitted</span>
                  </div>
                </div>
              )}

              {/* Verified Badge Overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-950/90 border border-green-500/30 px-3.5 py-1.5 rounded-xl text-xs text-green-400 font-mono z-10">
                <ShieldCheck className="w-4 h-4 text-green-400 animate-pulse" />
                <span>ESCROW REPUTATION DOUBLE SHIELD ARMED</span>
              </div>
            </div>

            {/* Thumbnail selection array */}
            {imagesList.length > 1 && (
              <div className="p-4 bg-slate-950/80 border-t border-white/5 flex gap-3 overflow-x-auto">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    id={`btn-thumb-${idx}`}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all ${
                      idx === selectedImage ? 'border-purple-500 scale-102 shadow-lg' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail representation" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sub Navigation Details Tabbing */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex gap-6 border-b border-white/5 pb-4 mb-4">
              {['info', 'seller', 'chat'].map((tab) => (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  onClick={() => setActiveTab(tab as any)}
                  className={`text-xs font-mono font-black uppercase tracking-wider cursor-pointer pb-2 relative transition-all ${
                    activeTab === tab ? 'text-purple-400' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <span>{tab} Details</span>
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Description Text */}
                <div className="space-y-2">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wide font-mono text-purple-400">Account Description</h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light font-sans">{listing.description}</p>
                </div>

                {/* Extended Specs Grids */}
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wide font-mono text-purple-400">Verified System Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(listing.stats).map(([key, value]) => (
                      <div key={key} className="p-3 bg-slate-950/70 border border-white/5 rounded-xl font-mono">
                        <p className="text-[10px] text-slate-500 uppercase">{key}</p>
                        <p className="text-sm text-white font-bold truncate mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Tags */}
                {listing.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs font-mono text-purple-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={listing.seller.avatarUrl} alt={listing.seller.username} className="w-16 h-16 rounded-full border border-white/10 shadow-sm" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-white font-black text-lg flex items-center gap-1.5">
                        {listing.seller.username}
                        {listing.seller.isVerified && <span className="text-xs bg-purple-650 px-2 py-0.5 rounded text-white font-normal uppercase tracking-widest font-mono">KYC Verified</span>}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">Member Since: {listing.seller.memberSince}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-slate-500 text-[10px] uppercase">Success Rate</p>
                      <p className="text-green-400 font-bold text-sm mt-0.5">{listing.seller.successRate}%</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-slate-500 text-[10px] uppercase">Total Completed Trades</p>
                      <p className="text-purple-400 font-bold text-sm mt-0.5">{listing.seller.totalTrades} Trades</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-center text-center space-y-2">
                  <div className="flex justify-center gap-1.5 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-base font-mono">{listing.seller.rating.toFixed(1)} / 5.0</h5>
                    <p className="text-xs text-slate-400">Average review rank based on {listing.seller.reviewsCount} customer reviews.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 border-b border-white/5 pb-2">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>SECURE INTRA-CHAT (AI GUARD VETTED IN REAL-TIME)</span>
                </div>

                {/* Chat Stream Screen */}
                <div className="h-64 overflow-y-auto bg-slate-950/80 rounded-2xl border border-white/10 p-4 space-y-3 flex flex-col">
                  {chatMessages.map((msg) => {
                    const isSystem = msg.sender === '🚨 AI GUARD SHIELD';
                    const isMe = msg.sender === 'corbinburrow3358';
                    return (
                      <div
                        key={msg.id}
                        className={`max-w-[85%] p-3 rounded-2xl text-xs flex flex-col space-y-1 ${
                          isSystem
                            ? 'bg-red-950/40 text-red-300 border border-red-500/30 self-center max-w-[95%] text-center font-mono my-2 py-4'
                            : isMe
                            ? 'bg-purple-600 text-white self-end rounded-tr-none'
                            : 'bg-slate-900 text-slate-300 self-start rounded-tl-none border border-white/5'
                        }`}
                      >
                        <p className="font-bold text-[10px] text-purple-300 uppercase tracking-widest">{msg.sender}</p>
                        <p className="leading-relaxed font-sans">{msg.message}</p>
                        <span className="text-[9px] text-slate-500 self-end font-mono">{msg.timestamp}</span>
                      </div>
                    );
                  })}
                  {isModerating && (
                    <div className="self-end bg-purple-900/30 text-purple-400 text-xs px-3 py-1.5 rounded-full font-mono animate-pulse">
                      AI Guard verifying trade integrity...
                    </div>
                  )}
                </div>

                {/* Input block */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask standard specs or linkage questions (e.g., 'Is email linked?')..."
                    className="flex-grow bg-slate-950 rounded-xl px-4 py-3 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 font-mono"
                  />
                  <button
                    type="submit"
                    id="btn-chat-send"
                    className="cursor-pointer bg-purple-600 hover:bg-purple-500 border border-purple-400/20 rounded-xl px-5 text-white flex items-center justify-center transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Direct Deal Danger Trigger Box */}
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-[11px] text-slate-400 font-sans leading-relaxed flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-purple-300">Interactable Tutorial:</strong> Try typing <code className="text-purple-300 font-bold bg-slate-900 px-1 py-0.5 rounded font-mono">"discord deal"</code> or <code className="text-purple-300 font-bold bg-slate-900 px-1 py-0.5 rounded font-mono">"pay me direct via bkash"</code> to see the AI Guard auto-vetting and flagging suspicious out-of-channel trade vectors instantly!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Purchase card controls and dynamic risk analysis */}
        <div className="lg:col-span-4 space-y-6">
          {/* Purchase block */}
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center space-y-5 relative">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-purple-400 font-bold uppercase">Automated Escrow Safe</span>
              <h2 className="text-3xl font-black text-green-400 font-mono">৳ {listing.price.toLocaleString()}</h2>
              <p className="text-xs text-slate-500">Includes 100% full delivery dispute guarantee</p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-left font-mono text-purple-300 flex justify-between">
              <span>Delivery Guarantee:</span>
              <span className="font-bold text-white">{listing.deliveryTime}</span>
            </div>

            <div className="space-y-2">
              <button
                id="btn-buy-secured"
                onClick={() => onInitiatePurchase(listing)}
                className="cursor-pointer w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow-lg hover:shadow-purple-705/20 text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <ShoppingCart className="w-4.5 h-4.5 text-purple-200" />
                <span>Secure Buy via Escrow</span>
              </button>

              <div className="text-[11px] text-slate-500 font-light flex justify-center gap-1.5 items-center">
                <span>Your balance: ৳ {userBalance.toLocaleString()}</span>
                <span>•</span>
                <span className="text-purple-300">{userBalance >= listing.price ? 'Funds available' : 'Insufficent budget'}</span>
              </div>
            </div>

            {/* Micro warning message if user balance is low */}
            {userBalance < listing.price && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-400 text-left font-light leading-relaxed">
                Note: You lack sufficient budget. Go to the **Wallet Section** in your dashboard to add funds securely via Stripe or local Mobile Banking first.
              </div>
            )}
          </div>

          {/* AI Security assessment dashboard widget card */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                <h4 className="font-bold text-white text-xs font-mono tracking-wide uppercase">AI Shield Scan</h4>
              </div>
              <div className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-purple-400 font-mono uppercase font-bold border border-white/10">
                Live
              </div>
            </div>

            {analyzingListing ? (
              <div className="space-y-3 py-2 animate-pulse">
                <div className="h-2 bg-slate-800 rounded w-1/2" />
                <div className="h-6 bg-slate-900 rounded" />
                <div className="h-2 bg-slate-800 rounded w-1/3" />
              </div>
            ) : (
              <div className="space-y-4 text-left">
                {/* Risk dial layout */}
                <div className="flex items-center gap-4 py-2">
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-full border border-white/10">
                    <span className="text-sm font-black font-mono text-white">{riskAnalysis.safeScore}%</span>
                    <span className="absolute -bottom-1 font-bold text-[8px] font-mono text-purple-400 uppercase tracking-widest leading-none">Safe</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-green-400 font-bold uppercase block">LOW RISK CLASSIFIED</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      The automated neural model checked account stats, trade volume logs, and flagged zero fraud indices.
                    </p>
                  </div>
                </div>

                {/* Audit details */}
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400 leading-relaxed font-light space-y-2">
                  <p className="text-purple-400 font-bold uppercase text-[9px] tracking-wider">Automated Audit Summary:</p>
                  <p className="text-slate-300 text-xs">{riskAnalysis.riskReason}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="flex items-center gap-1 text-green-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    <span>KYC VERIFIED</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    <span>LEGACY SELLER</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
