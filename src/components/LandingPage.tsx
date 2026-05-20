import { motion } from 'motion/react';
import { Shield, Coins, Users, Award, HelpCircle, ArrowRight, CheckCircle2, Star, Gamepad2, AlertTriangle, Play } from 'lucide-react';
import { PLATFORM_STATS } from '../data';
import { GameType } from '../types';

interface LandingPageProps {
  onNavigate: (page: string, extra?: any) => void;
}

const POPULAR_GAMES_LIST = [
  { name: 'PUBG Mobile', listings: '2,453 Listings', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=pubg', color: 'from-amber-600 to-amber-900' },
  { name: 'Free Fire', listings: '3,125 Listings', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=freefire', color: 'from-orange-600 to-red-900' },
  { name: 'Mobile Legends', listings: '1,782 Listings', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=mlbb', color: 'from-blue-600 to-indigo-900' },
  { name: 'Valorant', listings: '932   Listings', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=valorant', color: 'from-rose-600 to-purple-950' },
  { name: 'Call of Duty', listings: '812   Listings', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=cod', color: 'from-yellow-700 to-slate-900' },
  { name: 'FC Mobile', listings: '645   Listings', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=fcmobile', color: 'from-green-600 to-emerald-950' },
  { name: 'Roblox', listings: '512   Listings', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=roblox', color: 'from-gray-600 to-zinc-900' },
  { name: 'Genshin Impact', listings: '298   Listings', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=genshin', color: 'from-sky-500 to-teal-900' }
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto px-4 md:px-8">
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-slate-900/40 border border-white/5 px-3 py-1.5 rounded-full text-xs text-purple-400 font-mono tracking-wide"
            >
              <Shield className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
              <span>AI ESCROW ARMED — SAFE SELLER VERIFIED</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white"
            >
              Trade. <span className="underline decoration-purple-500 decoration-3 underline-offset-4 font-extrabold">Trust.</span> Win.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-400 text-lg max-w-xl font-light"
            >
              The safest AI-powered marketplace for top-up currencies, game accounts, rare items, boosting, and competitive tournaments. Backed by automated smart scam scanning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                id="btn-hero-browse"
                onClick={() => onNavigate('marketplace')}
                className="cursor-pointer px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg shadow-purple-500/20 flex items-center gap-3 transition-all"
              >
                <span>Browse Market</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </button>

              <button
                id="btn-hero-escrow"
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="cursor-pointer px-5 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                <Play className="w-4 h-4 text-purple-400 fill-current" />
                <span>How Escrow Works</span>
              </button>
            </motion.div>

            {/* Platform Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5"
            >
              <div className="space-y-1">
                <span className="text-2xl font-bold text-white font-mono">{PLATFORM_STATS.activeUsers}</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Active Users</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold text-white font-mono">{PLATFORM_STATS.successfulTrades}</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Trades Finished</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold text-green-400 font-mono">{PLATFORM_STATS.positiveReviews}</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Positive Rating</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold text-purple-400 font-mono">24/7 AI</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Trade Guard</p>
              </div>
            </motion.div>
          </div>

          {/* AI Banner Visual Card */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 space-y-6 relative overflow-hidden transition-all hover:border-purple-500/50 hover:bg-white/[0.08]"
            >
              {/* Corner cyan accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl font-sans" />

              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-white/10">
                    <Shield className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white tracking-wide text-sm">AI Protection</h3>
                    <p className="text-[10px] text-purple-400 font-mono">SECURE AGENT V2.8</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full text-[11px] text-green-400 border border-green-500/20">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                  <span className="font-mono uppercase font-bold text-[10px]">Active</span>
                </div>
              </div>

              <div className="space-y-4 font-mono text-sm max-w-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300">AI Scam Pattern Recognition</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300">Automatic Risk Assessment Heuristics</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300">Instant Double-Spend & Fraud Locks</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300">Intelligent Dispute Arbitration System</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-400 font-light">
                <span className="font-bold text-purple-400">Safe Trade Rule:</span> All trade payments remain locked in automated secure escrow until the delivery is fully completed and confirmed by you.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 text-left">
        <div className="flex justify-between items-baseline">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Popular Games</h2>
            <p className="text-slate-400 text-sm">Explore premium high-demand game products</p>
          </div>
          <button
            id="btn-games-view-all"
            onClick={() => onNavigate('marketplace')}
            className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {POPULAR_GAMES_LIST.map((game, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('marketplace', { filterGame: game.name })}
              className="group cursor-pointer p-4 bg-white/5 hover:bg-white/[0.08] rounded-xl border border-white/10 hover:border-purple-500/50 transition-all text-center space-y-3 shrink-0"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${game.color} p-2.5 flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                <img src={game.logoUrl} alt={game.name} className="w-full h-full object-contain filter invert" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs truncate group-hover:text-purple-300 transition-colors">{game.name}</h4>
                <p className="text-[10px] text-purple-400/80 font-mono mt-0.5">{game.listings}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safe Escrow flow */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 md:px-8 py-8 rounded-3xl bg-slate-900/10 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-purple-400 font-mono uppercase tracking-widest font-bold text-xs">Security Protocol</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">How Secure Escrow Protects You</h2>
          <p className="text-slate-400 text-sm font-light">We eliminate the risk of online transactions through automated micro-escrow smart steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          <div className="md:col-span-1 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-purple-500/25 hover:bg-white/[0.08] transition-all text-left">
            <div className="w-10 h-10 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-lg flex items-center justify-center font-bold font-mono">
              1
            </div>
            <h3 className="font-bold text-white text-base">Buyer Deposits</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">Buyer chooses account & deposits price funds. Standard mobile services like bKash/Nagad or card support accepted.</p>
          </div>

          <div className="md:col-span-1 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-purple-500/25 hover:bg-white/[0.08] transition-all text-left">
            <div className="w-10 h-10 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-lg flex items-center justify-center font-bold font-mono">
              2
            </div>
            <h3 className="font-bold text-white text-base">Money Locked</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">Platform verifies incoming payment and moves funds into the securely locked GameTrade vault.</p>
          </div>

          <div className="md:col-span-1 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-purple-500/25 hover:bg-white/[0.08] transition-all text-left">
            <div className="w-10 h-10 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-lg flex items-center justify-center font-bold font-mono">
              3
            </div>
            <h3 className="font-bold text-white text-base">Seller Delivers</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">Seller is instantly notified & delivers game credentials (linking pins, user passwords) via safe intra-chat.</p>
          </div>

          <div className="md:col-span-1 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-purple-500/25 hover:bg-white/[0.08] transition-all text-left">
            <div className="w-10 h-10 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-lg flex items-center justify-center font-bold font-mono">
              4
            </div>
            <h3 className="font-bold text-white text-base">Buyer Confirms</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">Buyer audits account character level/inventory, changes linkage handles, and clicks Release confirmation.</p>
          </div>

          <div className="md:col-span-1 p-5 rounded-2xl bg-white/5 border border-emerald-500/25 space-y-4 hover:border-emerald-500/50 hover:bg-white/[0.08] transition-all text-left">
            <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg flex items-center justify-center font-bold font-mono">
              ✓
            </div>
            <h3 className="font-bold text-white text-base">Instant Release</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">Funds are immediately released to the seller’s virtual bank or bKash wallet. Safe, certified completion!</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            id="btn-learn-escrow-action"
            onClick={() => onNavigate('marketplace')}
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-500/20"
          >
            <span>Launch Secure Escrow Trade Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Loved by Gamers worldwide</h2>
          <p className="text-slate-400 text-sm">Top rated ratings for high-value Valorant and PUBG accounts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/25 hover:bg-white/[0.08] space-y-4 text-left transition-all">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-slate-300 font-light italic">"Traded my stacked PUBG Mobile conqueror account safely. The escrow held my funds securely for 10 minutes while we transferred email links. Awesome 24/7 scanning!"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-white/10 flex items-center justify-center font-bold text-sm text-purple-400">
                ST
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Sajid_Tr_99</h4>
                <p className="text-[10px] text-purple-400 font-mono">Verified Elite Trader</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/25 hover:bg-white/[0.08] space-y-4 text-left transition-all">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-slate-300 font-light italic">"I was skeptical about buying 10,000 UC top-up. Tried GameTrade and got the automated voucher pin instantly inside the chat area. Will use this for CoD points too!"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-white/10 flex items-center justify-center font-bold text-sm text-blue-300">
                RL
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Rayhan_Lead</h4>
                <p className="text-[10px] text-purple-400 font-mono">Platinum Buyer</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/25 hover:bg-white/[0.08] space-y-4 text-left transition-all">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-slate-300 font-light italic">"AI safety logs are top tier. I typed a suspicious link inside the seller talk, and the system notified me immediately not to go off platform. Zero chargeback risks."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600/20 border border-white/10 flex items-center justify-center font-bold text-sm text-green-400">
                KK
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">KaziKiler_FF</h4>
                <p className="text-[10px] text-purple-400 font-mono">Garena Pro Seller</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        <div className="text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-purple-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Need advice on transfers, payouts, or verification?</p>
        </div>

        <div className="space-y-4 text-left">
          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <h4 className="font-bold text-white text-sm mb-2">How long does my wallet payout take?</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">Once the buyer submits 'Confirm Delivery' in their purchases widget, the money moves immediately from our secure vault into your verified dashboard wallet balance. Withdrawal takes seconds.</p>
          </div>
          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <h4 className="font-bold text-white text-sm mb-2">What happens if a seller takes the credentials back?</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">Every account is fully verified, and their linked identity documents are securely filed under 256-bit hash. Standard security rules mandate full delivery insurance, refunding the buyer immediately if there is a retrieval claim.</p>
          </div>
          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <h4 className="font-bold text-white text-sm mb-2">How does AI Scam and Risk Scopes operate?</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">Our advanced neural moderation agent scans game statistics, seller legacy ratings, and chat content for keyword flags. It alerts both trade participants before any deposit locked is completed.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 md:px-8 pt-10 pb-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
            </div>
            <span className="font-bold text-white text-base tracking-tighter">GAMETRADE <span className="text-purple-500 underline decoration-2 underline-offset-4">AI</span></span>
          </div>

          <div className="flex gap-4 text-xs text-slate-500 font-mono">
            <span>Stripe Secured</span>
            <span>•</span>
            <span>bKash Instant</span>
            <span>•</span>
            <span>Nagad Protected</span>
            <span>•</span>
            <span>AI Verified</span>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-slate-600 font-light font-mono">
          © 2026 GAMETRADE AI. All cyber rights reserved.
        </div>
      </footer>
    </div>
  );
}
