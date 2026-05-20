import { useState } from 'react';
import { EscrowStep } from '../types';
import { ShieldAlert, ShieldCheck, HelpCircle, Check, Loader2, ArrowRight } from 'lucide-react';

interface EscrowFlowProps {
  currentStep: EscrowStep;
  price: number;
  id: string;
  title: string;
  buyerName: string;
  sellerName: string;
  onStepChange?: (nextStep: EscrowStep) => void;
}

export default function EscrowFlow({
  currentStep,
  price,
  id,
  title,
  buyerName,
  sellerName,
  onStepChange
}: EscrowFlowProps) {
  const [starRating, setStarRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [ratingPosted, setRatingPosted] = useState<boolean>(false);

  const stepsList: Array<{ id: EscrowStep; title: string; desc: string; detail: string }> = [
    {
      id: 'BuyerPaid',
      title: 'Buyer Deposits Payment',
      desc: 'Buyer initiates transaction. Funds are transmitted via Stripe or mobile cash wallets.',
      detail: `Buyer (${buyerName}) sent ৳ ${price.toLocaleString()}. Verification in seconds.`
    },
    {
      id: 'Locked',
      title: 'Vault Locks Escrow Holds',
      desc: 'Payment represents in-flight trade value. Platform locks funds securely, shielding the trade.',
      detail: `৳ ${price.toLocaleString()} is safely kept in the automated micro-hold custody vault. Safe to hand over account details now.`
    },
    {
      id: 'Delivered',
      title: 'Seller Handovers Password',
      desc: 'Seller delivers game logins and authentication emails in the secure intra-market chat room.',
      detail: `${sellerName} uploaded verification pins and modified backup recovery options.`
    },
    {
      id: 'Confirmed',
      title: 'Buyer Audits Linkage',
      desc: 'Buyer inspects character level, links personal social log handles, and confirms order completed.',
      detail: `Buyer changing secure profile linkages.`
    },
    {
      id: 'Released',
      title: 'Funds Discharged to Seller',
      desc: 'Escrow release executes immediately. Balance deposits securely in seller merchant wallet.',
      detail: `৳ ${price.toLocaleString()} is fully released. Order successfully finalized!`
    }
  ];

  // Utility to determine step color classes
  const getStepStatus = (stepId: EscrowStep) => {
    const currentIndex = stepsList.findIndex((s) => s.id === currentStep);
    const stepIndex = stepsList.findIndex((s) => s.id === stepId);

    if (stepIndex < currentIndex) return 'COMPLETED';
    if (stepIndex === currentIndex) return 'ACTIVE';
    return 'UPCOMING';
  };

  return (
    <div className="space-y-6 pb-12 text-left animate-fade-in font-sans">
      {/* 5-Star Trader Review Prompt */}
      {currentStep === 'Released' && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/10 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400 font-extrabold text-xl shrink-0">
                ★
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Leave a Trader Review</h3>
                <p className="text-xs text-slate-400">This order is finalized! Give {sellerName} a rating to secure community trust scores.</p>
              </div>
            </div>
            
            {/* Display static Star selector */}
            <div className="flex items-center gap-1 bg-slate-950/50 px-3 py-1.5 rounded-xl border border-white/5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  id={`review-star-${star}`}
                  onClick={() => setStarRating(star)}
                  className="text-lg transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                >
                  <span className={star <= starRating ? "text-amber-400" : "text-slate-600"}>★</span>
                </button>
              ))}
              <span className="text-xs text-slate-400 font-mono font-bold ml-1.5">{starRating}.0 / 5.0</span>
            </div>
          </div>

          {ratingPosted ? (
            <div className="p-3.5 bg-green-950/20 border border-green-500/20 rounded-xl text-xs text-green-300 font-mono animate-fadeIn">
              ✓ THANK YOU: Your {starRating}-star trader feedback has been successfully registered on verified servers!
            </div>
          ) : (
            <div className="space-y-3 font-mono">
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How did the handover go? (e.g., Quick response times, accounts are fully linked and secured!)"
                className="w-full bg-slate-950/90 rounded-xl p-3.5 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none placeholder-slate-600 leading-relaxed font-sans"
                rows={2}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  id="btn-submit-review"
                  onClick={() => {
                    if (!reviewComment.trim()) {
                      alert("Please type a quick comment before submitting your review.");
                      return;
                    }
                    setRatingPosted(true);
                  }}
                  className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white font-extrabold font-sans py-2 px-5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-950/10"
                >
                  Submit verified review
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Animated timeline list */}
        <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-2xl border border-purple-900/15 space-y-6">
          <div className="flex justify-between items-baseline pb-3 border-b border-purple-900/20">
            <h3 className="text-white font-extrabold text-xs uppercase tracking-widest font-mono text-purple-400">
              Escrow Flow Tracker UI
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">ORDER ID: {id}</span>
          </div>

          <p className="text-gray-400 text-xs font-light leading-relaxed">
            The beautiful progression below charts your active transaction. Always verify the status reads{' '}
            <strong className="text-purple-300">"Locked in Escrow"</strong> before sharing account password codes!
          </p>

          <div className="relative pl-8 space-y-8">
            {/* Direct vertical line guide */}
            <div className="absolute left-3 top-2.5 bottom-2.5 w-0.5 bg-slate-900" />

            {stepsList.map((st) => {
              const status = getStepStatus(st.id);
              return (
                <div key={st.id} className="relative space-y-1">
                  {/* Bullet indicators */}
                  <div
                    className={`absolute -left-[29px] top-1 w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-mono font-bold transition-all ${
                      status === 'COMPLETED'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-md shadow-purple-900/35'
                        : status === 'ACTIVE'
                        ? 'bg-slate-950 border-purple-500 text-purple-300 scale-105 neon-active'
                        : 'bg-slate-950 border-slate-900 text-slate-650 text-slate-500'
                    }`}
                  >
                    {status === 'COMPLETED' ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <span>•</span>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline">
                    <h4
                      className={`text-sm font-extrabold tracking-tight ${
                        status === 'ACTIVE'
                          ? 'text-purple-300'
                          : status === 'COMPLETED'
                          ? 'text-gray-300'
                          : 'text-slate-600'
                      }`}
                    >
                      {st.title}
                    </h4>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase rounded px-2 py-0.5 leading-none ${
                        status === 'COMPLETED'
                          ? 'bg-purple-950/40 text-purple-400 border border-purple-900/10'
                          : status === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/10'
                          : 'bg-slate-1000 bg-slate-950 text-slate-500'
                      }`}
                    >
                      {status === 'COMPLETED' ? 'Completed' : status === 'ACTIVE' ? 'Active Hold' : 'Upcoming'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-550 text-slate-400 leading-relaxed font-light">{st.desc}</p>

                  {status === 'ACTIVE' && (
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-purple-500/10 text-xs text-purple-300 font-mono mt-2 leading-relaxed flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
                      <span>{st.detail}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative advice sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-purple-900/15 space-y-4">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wide font-mono text-purple-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Guard Shield Advisory</span>
            </h4>

            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>
                <strong>Trading Protection Scope:</strong> All funds are currently isolated from both parties, locked under full protocol rules.
              </p>
              <p>
                As soon as the Buyer accepts the credential handoff and links their social profiles, click{' '}
                <strong className="text-green-400">"Finalize: Release"</strong> to release payments.
              </p>
            </div>

            {/* Interactive simulator controls */}
            {onStepChange && (
              <div className="p-4 bg-slate-950 border border-purple-900/20 rounded-xl space-y-3">
                <p className="text-[10px] text-purple-400 font-mono font-bold uppercase tracking-wider block">
                  DEVELOPER SIMULATOR CONTROLS
                </p>
                <p className="text-[10px] text-gray-500">Fast cycle through states to test payouts:</p>

                <div className="flex flex-col gap-2">
                  <button
                    id="btn-trigger-paid"
                    onClick={() => onStepChange('BuyerPaid')}
                    className="cursor-pointer text-left p-2 hover:bg-slate-900 rounded font-mono text-xs text-gray-300 border border-purple-950 flex justify-between"
                  >
                    <span>1. Set: BuyerPaid</span>
                    <span>{currentStep === 'BuyerPaid' ? '✓' : ''}</span>
                  </button>
                  <button
                    id="btn-trigger-lock"
                    onClick={() => onStepChange('Locked')}
                    className="cursor-pointer text-left p-2 hover:bg-slate-900 rounded font-mono text-xs text-gray-300 border border-purple-950 flex justify-between"
                  >
                    <span>2. Set: Locked HOLD</span>
                    <span>{currentStep === 'Locked' ? '✓' : ''}</span>
                  </button>
                  <button
                    id="btn-trigger-deliver"
                    onClick={() => onStepChange('Delivered')}
                    className="cursor-pointer text-left p-2 hover:bg-slate-900 rounded font-mono text-xs text-gray-300 border border-purple-950 flex justify-between"
                  >
                    <span>3. Set: Password Delivered</span>
                    <span>{currentStep === 'Delivered' ? '✓' : ''}</span>
                  </button>
                  <button
                    id="btn-trigger-confirm"
                    onClick={() => onStepChange('Confirmed')}
                    className="cursor-pointer text-left p-2 hover:bg-slate-900 rounded font-mono text-xs text-gray-300 border border-purple-950 flex justify-between"
                  >
                    <span>4. Set: Confirmed Linkage</span>
                    <span>{currentStep === 'Confirmed' ? '✓' : ''}</span>
                  </button>
                  <button
                    id="btn-trigger-release"
                    onClick={() => onStepChange('Released')}
                    className="cursor-pointer text-left p-2 hover:bg-slate-905 rounded font-mono text-xs text-green-400 border border-green-950 flex justify-between"
                  >
                    <span>5. Set: Final Payments Released</span>
                    <span>{currentStep === 'Released' ? '✓' : ''}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
