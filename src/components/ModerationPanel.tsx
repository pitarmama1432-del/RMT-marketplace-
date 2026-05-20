import { useState } from 'react';
import { Terminal, ShieldX, ShieldAlert, Sparkles, RefreshCw, Eye, EyeOff, CheckCircle2, Info } from 'lucide-react';

export default function ModerationPanel() {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'risk_rules' | 'screenshots'>('monitoring');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Live monitor feed simulator
  const [flaggedMessages, setFlaggedMessages] = useState([
    { id: '1', orderId: 'ORD-1093', sender: 'FF_Buyer_9', msgText: "hey can you send the login code to my whatsapp +88017281...? I will bKash you raw cash.", riskScore: 88, gameName: 'Free Fire', keywords: ['whatsapp', 'bKash raw'] },
    { id: '2', orderId: 'ORD-8452', sender: 'EpicTr_00', msgText: "Let us skip the escrow hold, I will send password directly if you pay half now.", riskScore: 92, gameName: 'PUBG Mobile', keywords: ['skip escrow', 'pay half'] },
    { id: '3', orderId: 'ORD-2101', sender: 'Valo_Kid_00', msgText: "no problem, add me on discord name valo#2091 and we trade there.", riskScore: 78, gameName: 'Valorant', keywords: ['discord'] }
  ]);

  // Handle dispute resolution button click
  const markMessageSafe = (id: string) => {
    setFlaggedMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 text-left animate-fade-in font-mono">
      {/* Action notices overlay */}
      {statusMessage && (
        <div className="bg-purple-950 border border-purple-500/30 p-4 rounded-xl flex items-start gap-3 text-xs text-purple-200">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Cyber Grid Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 relative">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-[10px] bg-white/5 border border-white/10 font-bold px-2 py-0.5 rounded text-purple-300">SHIELD AUTOMATION SYSTEM</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-widest uppercase">AI Moderation Panel</h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed font-sans">
            Autonomous fraud intervention console examining transactional chat streams, screenshot metadata hashes, and scam trajectory vectors.
          </p>
        </div>

        <div className="flex gap-2">
          {['monitoring', 'risk_rules', 'screenshots'].map((sub) => (
            <button
              key={sub}
              id={`mod-sub-${sub}`}
              onClick={() => setActiveTab(sub as any)}
              className={`p-2 px-4 rounded-xl text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                activeTab === sub
                  ? 'bg-purple-600 border-purple-450/30 text-white'
                  : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'
              }`}
            >
              {sub.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'monitoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Log Feed */}
          <div className="lg:col-span-8 bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 text-purple-400">
                <Terminal className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Live Flagged Stream Logs</span>
              </h3>
              <span className="text-[10px] text-green-400 font-bold animate-ping">●</span>
            </div>

            {flaggedMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Great job! All trading chat stream channels are evaluated as safe.
              </div>
            ) : (
              <div className="space-y-4">
                {flaggedMessages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-slate-950/60 rounded-xl border border-white/10 hover:border-purple-550/20 space-y-3">
                    <div className="flex justify-between items-baseline font-mono text-xs">
                      <div>
                        <span className="font-bold text-white uppercase">{msg.sender}</span>
                        <span className="text-[10px] text-slate-500 ml-2">({msg.gameName})</span>
                      </div>
                      <span className="font-bold text-red-400 font-mono text-[10px] bg-red-955/20 border border-red-500/20 px-2 py-0.5 rounded">
                        {msg.riskScore}% SCAM RISK
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed italic pr-2 font-mono bg-slate-950 p-2.5 rounded border border-white/5">
                      "{msg.msgText}"
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                      <span className="text-[9px] text-slate-500 font-bold">KEYWORDS:</span>
                      {msg.keywords.map((word, idx) => (
                        <span key={idx} className="bg-red-950/40 border border-red-500/20 text-[9px] px-1.5 py-0.5 text-red-300 rounded font-mono uppercase">
                          {word}
                        </span>
                      ))}

                      <div className="ml-auto inline-flex gap-2">
                        <button
                          id={`btn-approve-msg-${msg.id}`}
                          onClick={() => markMessageSafe(msg.id)}
                          className="cursor-pointer font-sans bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1 rounded"
                        >
                          Mark Safe
                        </button>
                        <button
                          id={`btn-ban-msg-${msg.id}`}
                          onClick={() => {
                            setStatusMessage(`User ${msg.sender} suspended securely!`);
                            setTimeout(() => setStatusMessage(null), 5000);
                            markMessageSafe(msg.id);
                          }}
                          className="cursor-pointer font-sans bg-red-600/90 text-white hover:bg-red-500 text-[10px] font-bold px-3 py-1 rounded"
                        >
                          Suspend User
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Heuristic stats graph representation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-white font-extrabold text-xs uppercase tracking-wide text-purple-400">Moderator Metrics</h3>

              {/* Suspicious volume charts inside canvas mockup */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-sans">
                    <span>Active Scam Deflection</span>
                    <span className="text-green-400 font-bold">99.9% Protection</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 w-full" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-sans">
                    <span>Suspicious Keyword Interceptions</span>
                    <span className="text-purple-400 font-bold font-mono">482 Interventions</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-3/4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-sans">
                    <span>Identity Document Audit backlog</span>
                    <span className="text-green-400 font-bold">0 Clean</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-12" />
                  </div>
                </div>
              </div>

              {/* Warning reminder */}
              <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-xl text-[11px] text-red-300 leading-relaxed text-left flex gap-2 font-sans">
                <ShieldAlert className="w-5 h-5 text-red-450 text-red-400 shrink-0" />
                <span>
                  <strong>Escrow Security protocol reminder:</strong> Moving users off platform for communication will automatically lock their balances in Escrow hold until identity document audit completes.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risk_rules' && (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left space-y-4 font-mono">
          <h3 className="text-white font-extrabold text-xs uppercase tracking-wide text-purple-400">Active Rule Heuristic Classifiers</h3>
          <p className="text-xs text-slate-500 font-sans">Autonomous parameters determining real-time safety scores (%) based on typed contexts:</p>

          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500">
                <th className="py-2.5 text-left font-bold">RULE CLASSIFIER</th>
                <th className="py-2.5 text-center font-bold">RISK CONSTANT</th>
                <th className="py-2.5 text-right font-bold">ACTION STRATEGY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-350">
              <tr>
                <td className="py-3">Includes social link swaps ("telegram", "whatsapp")</td>
                <td className="py-3 text-center text-red-400 font-bold">Risk +85%</td>
                <td className="py-3 text-right text-purple-300">Auto Guard Banner Flag</td>
              </tr>
              <tr>
                <td className="py-3">Promises of utility modifications ("aimbot", "hacker", "cheat")</td>
                <td className="py-3 text-center text-red-400 font-bold">Risk +95%</td>
                <td className="py-3 text-right text-red-400 font-bold">Automated Account Suspension</td>
              </tr>
              <tr>
                <td className="py-3">Demanding bypass verification codes before locking funds</td>
                <td className="py-3 text-center text-red-400 font-bold">Risk +82%</td>
                <td className="py-3 text-right text-purple-300">Lock Transacting Session</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'screenshots' && (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left space-y-4">
          <h3 className="text-white font-extrabold text-xs uppercase tracking-wide text-purple-400">Fake Screenshot Hash Diagnostics</h3>
          <p className="text-xs text-slate-450 text-slate-450 text-slate-400 font-sans font-light">Comparing product upload hashes against community database duplicates to catch stolen or recirculated imagery:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-1000 bg-slate-950 border border-green-500/20 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between font-mono font-bold">
                <span className="text-green-400 font-bold">MLBB-901-Verification.png</span>
                <span className="text-green-400">UNIQUE HASH</span>
              </div>
              <p className="text-slate-500 text-[10px]">HASH: 8e2fa510db90117ff...</p>
            </div>
            <div className="p-4 bg-slate-1000 bg-slate-950 border border-white/5 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between font-mono font-bold">
                <span className="text-white">PUBG-Conq-Aesthetic-12.png</span>
                <span className="text-green-400">UNIQUE HASH</span>
              </div>
              <p className="text-slate-500 text-[10px]">HASH: cb592a884f1a21e67...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
