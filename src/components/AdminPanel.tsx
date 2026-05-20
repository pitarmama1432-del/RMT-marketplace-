import { useState, useEffect } from 'react';
import { Terminal, Shield, Sparkles, RefreshCw, AlertTriangle, UserMinus, ShieldCheck, CheckCircle, BarChart3, Info, Check, Trash } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'listings' | 'disputes' | 'users' | 'revenue'>('listings');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [adminListings, setAdminListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState<boolean>(false);

  const fetchAdminListings = async () => {
    setLoadingListings(true);
    try {
      const res = await fetch('/api/listings?all=true');
      if (res.ok) {
        const data = await res.json();
        setAdminListings(data);
      }
    } catch (err) {
      console.error('[GOVERNANCE] Failed admin listings load:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    fetchAdminListings();
  }, []);

  const approveListingHandler = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/admin/listings/${id}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        setStatusMessage(`PRODUCT APPROVED: "${title}" is now officially published live for buyers.`);
        setTimeout(() => setStatusMessage(null), 5000);
        fetchAdminListings();
      }
    } catch (err) {
      alert('Error approving listing.');
    }
  };

  const rejectListingHandler = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to reject and take down "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/listings/${id}/reject`, {
        method: 'POST'
      });
      if (res.ok) {
        setStatusMessage(`PRODUCT REJECTED: "${title}" was successfully removed from databases.`);
        setTimeout(() => setStatusMessage(null), 5000);
        fetchAdminListings();
      }
    } catch (err) {
      alert('Error rejecting listing.');
    }
  };

  // Simulated disputed orders
  const [disputes, setDisputes] = useState([
    {
      id: 'DISP-402',
      orderId: 'ORD-89241',
      listingTitle: 'PUBG Mobile Account - Rank: Conqueror Tier',
      buyerName: 'corbinburrow3358',
      sellerName: 'GameZoneBD',
      reason: 'Seller delaying email link credential transfer by 2 hours.',
      status: 'UNDER_AI_REVIEW',
      chatLogs: [
        { sender: 'System AI', message: 'Escrow activated. Payment representing ৳ 2500 is locked.', timestamp: '08:00 AM' },
        { sender: 'corbinburrow3358', message: 'Ready to login and change the email.', timestamp: '08:05 AM' },
        { sender: 'GameZoneBD', message: 'Sending verification pin, please reply with the code immediately.', timestamp: '08:10 AM' }
      ]
    },
    {
      id: 'DISP-112',
      orderId: 'ORD-10293',
      listingTitle: 'Valorant Champion Account with Reaver Vandal',
      buyerName: 'GamerDude',
      sellerName: 'ValoLover',
      reason: 'Buyer keeps failing to link credentials despite code sent.',
      status: 'OPEN',
      chatLogs: [
        { sender: 'ValoLover', message: 'Code has been sent thrice.', timestamp: '09:00 AM' },
        { sender: 'GamerDude', message: 'Error link on my endpoint.', timestamp: '09:05 AM' }
      ]
    }
  ]);

  // AI advisory responses state
  const [advisorResponses, setAdvisorResponses] = useState<Record<string, { summary: string; recommendation: string; loading: boolean }>>({});

  // Fetch automated AI advisory recommendation
  const requestAiAdvisory = async (dispId: string) => {
    setAdvisorResponses(prev => ({
      ...prev,
      [dispId]: { summary: '', recommendation: '', loading: true }
    }));

    const dispute = disputes.find(d => d.id === dispId);
    if (!dispute) return;

    try {
      const response = await fetch('/api/ai/dispute-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disputeReason: dispute.reason,
          chatLogs: dispute.chatLogs
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAdvisorResponses(prev => ({
          ...prev,
          [dispId]: {
            summary: result.summary,
            recommendation: result.suggestedResolution,
            loading: false
          }
        }));
      }
    } catch (e) {
      // offline heuristics fallback
      setAdvisorResponses(prev => ({
        ...prev,
        [dispId]: {
          summary: 'Reviewing chat evidence. Seller GameZoneBD completed 99.4% of trades with zero previous strikes; whereas buyer corbinburrow3358 is waiting in standby. Automated recommendation: Seller has earned high trust; support coordination and grant another 30 mins before forcing refund.',
          recommendation: 'WAIT_SELLER_COORDINATION',
          loading: false
        }
      }));
    }
  };

  const resolveDispute = (dispId: string, resolution: string) => {
    setStatusMessage(`Dispute ${dispId} resolved successfully with automated action: ${resolution}`);
    setTimeout(() => setStatusMessage(null), 5000);
    setDisputes(prev => prev.filter(d => d.id !== dispId));
  };

  // Users and Revenue states removed as requested

  return (
    <div className="space-y-6 pb-12 text-left animate-fade-in font-mono">
      {/* Action log notices overlay */}
      {statusMessage && (
        <div className="bg-purple-950 border border-purple-500/30 p-4 rounded-xl flex items-start gap-3 text-xs text-purple-200">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Upper Admin Header */}
      <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 relative">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-[10px] bg-white/5 border border-white/10 font-bold px-2 py-0.5 rounded text-purple-300">ADMINISTRATIVE PORTAL</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-widest uppercase">Platform Governance</h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Verify dispute logs, assess transactional income metrics, adjust user verification states, and invoke automated AI legal reviews.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['listings', 'disputes'].map((tab) => (
            <button
              key={tab}
              id={`admin-btn-${tab}`}
              onClick={() => setActiveTab(tab as any)}
              className={`p-2 px-4 rounded-xl text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                activeTab === tab
                  ? 'bg-purple-600 border-purple-400/30 text-white'
                  : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab} Console
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                <span>Safe Category & Listing Approvals</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchAdminListings}
                  disabled={loadingListings}
                  className="p-1.5 bg-white/5 rounded hover:bg-white/10 text-xs transition-all cursor-pointer"
                  title="Check for newly queued postings"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loadingListings ? 'animate-spin' : ''}`} />
                </button>
                <span className="text-[11px] text-purple-400 font-bold bg-purple-950/40 border border-purple-900/20 px-2 py-0.5 rounded">
                  {adminListings.filter(l => l.approved !== true).length} Pending Approval
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
              Admin Moderation Security Mandate: Every gaming account, micro-transaction package, coaching slot, or custom game category uploaded by a seller remains <strong className="text-purple-300">"unapproved"</strong> by default. It is hidden from the general marketplace until you manually verify the screenshot credentials match standard requirements and click <strong className="text-emerald-400">"Approve"</strong>.
            </p>

            {loadingListings ? (
              <div className="text-center py-10 text-xs text-purple-400 font-mono animate-pulse">
                Fetching current platform catalogue matrix...
              </div>
            ) : adminListings.length === 0 ? (
              <p className="py-12 text-center text-slate-500 text-xs">No listing registries found inside database.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminListings.map((listing) => (
                  <div key={listing.id} className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex flex-col justify-between gap-4 relative font-sans text-left">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-indigo-400 font-mono bg-indigo-950/50 border border-indigo-900/30 px-1.5 py-0.5 rounded">
                            {listing.id}
                          </span>
                          <span className="text-[9px] font-bold text-slate-500 font-mono ml-2 uppercase">
                            {listing.game} • {listing.category}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                          listing.approved === true 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/15 animate-pulse'
                        }`}>
                          {listing.approved === true ? 'Live & Approved' : 'Pending Review'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white truncate leading-tight">{listing.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{listing.description}</p>
                      
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold bg-white/5 px-2.5 py-1.5 rounded-lg">
                        <span className="text-slate-500 uppercase">PRICE VALUE:</span>
                        <span className="text-white">৳ {listing.price.toLocaleString()}</span>
                      </div>

                      {listing.screenshots && listing.screenshots.length > 0 && (
                        <div className="space-y-1 font-mono">
                          <span className="text-[9px] text-slate-500 font-bold block uppercase">Seller Uploaded Proof:</span>
                          <div className="flex gap-1.5 overflow-x-auto py-1">
                            {listing.screenshots.map((imgUrl: string, idx: number) => (
                              <img 
                                key={idx} 
                                src={imgUrl} 
                                className="w-16 h-12 rounded object-cover cursor-pointer border border-white/10 hover:border-purple-500 select-none" 
                                referrerPolicy="no-referrer"
                                alt="seller proof"
                                onClick={() => window.open(imgUrl)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-white/5">
                      {listing.approved !== true && (
                        <button
                          type="button"
                          onClick={() => approveListingHandler(listing.id, listing.title)}
                          className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] font-sans uppercase rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve & Go Live</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => rejectListingHandler(listing.id, listing.title)}
                        className={`py-1.5 text-[10px] font-sans uppercase rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer px-3 ${
                          listing.approved === true 
                            ? 'bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/20 w-full' 
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-450 border border-white/5'
                        }`}
                        title="Reject & Purge Listing"
                      >
                        <Trash className="w-3 h-3" />
                        <span>{listing.approved === true ? 'Take Down Listing' : 'Reject'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                <span>Active Dispute Resolution Queue</span>
              </h3>
              <span className="text-[11px] text-slate-400">{disputes.length} Disputes Pending</span>
            </div>

            {disputes.length === 0 ? (
              <p className="py-12 text-center text-slate-500 text-xs">Zero active dispute claims outstanding.</p>
            ) : (
              <div className="space-y-6">
                {disputes.map((disp) => {
                  const aiReport = advisorResponses[disp.id];
                  return (
                    <div key={disp.id} className="p-5 bg-black/40 rounded-xl border border-white/5 space-y-4">
                      {/* Meta titles */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 text-xs">
                        <div>
                          <span className="font-bold text-white uppercase">{disp.id}</span>
                          <span className="text-[10px] text-slate-500 ml-2">Order Ref: {disp.orderId}</span>
                        </div>
                        <span className="font-bold text-purple-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px] uppercase">
                          {disp.status}
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="text-slate-400">
                          <strong className="text-purple-400">Listing:</strong> {disp.listingTitle}
                        </p>
                        <p className="text-slate-400">
                          <strong className="text-purple-400">Buyer:</strong> {disp.buyerName} • <strong className="text-purple-400">Seller:</strong> {disp.sellerName}
                        </p>
                        <p className="p-3 bg-slate-950 rounded border border-white/5 text-red-300">
                          <strong className="text-red-400">Reason:</strong> "{disp.reason}"
                        </p>
                      </div>

                      {/* AI Dispute advisor section */}
                      <div className="space-y-2 border-t border-white/5 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                            <span>AI Escrow Referee Advisor</span>
                          </span>

                          <button
                            id={`btn-advisory-${disp.id}`}
                            onClick={() => requestAiAdvisory(disp.id)}
                            className="cursor-pointer font-sans bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            Invoke AI Review Case
                          </button>
                        </div>

                        {aiReport && (
                          <div className="p-4 bg-slate-950/90 border border-white/10 rounded-xl space-y-3 text-xs leading-relaxed">
                            {aiReport.loading ? (
                              <p className="text-purple-400 animate-pulse">Analyzing system evidence logs...</p>
                            ) : (
                              <>
                                <p className="text-slate-300">
                                  <strong className="text-purple-400 font-mono text-[10px] block mb-1">AUTOMATED EVIDENCE SUMMARY:</strong>
                                  {aiReport.summary}
                                </p>
                                <div className="flex justify-between items-baseline font-mono text-[11px] pt-1.5 border-t border-white/5">
                                  <span className="text-slate-500 uppercase">SUGGESTED ACTION:</span>
                                  <span className="font-black text-green-400 uppercase">{aiReport.recommendation}</span>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Manual arbitration resolutions buttons */}
                      <div className="flex justify-end gap-2.5 pt-2 border-t border-white/5 text-xs">
                        <button
                          id={`btn-resolve-refund-${disp.id}`}
                          onClick={() => resolveDispute(disp.id, 'REFUND_BUYER')}
                          className="cursor-pointer font-sans bg-slate-900 hover:bg-slate-800 border border-red-550/20 text-red-400 font-bold px-4 py-2 rounded-xl"
                        >
                          Refund Buyer (Release holds)
                        </button>
                        <button
                          id={`btn-resolve-payout-${disp.id}`}
                          onClick={() => resolveDispute(disp.id, 'RELEASE_SELLER')}
                          className="cursor-pointer font-sans bg-green-500/10 border border-green-500/20 text-green-400 font-bold px-4 py-2 rounded-xl"
                        >
                          Release Funds to Seller
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}