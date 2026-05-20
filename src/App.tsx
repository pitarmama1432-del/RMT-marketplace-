import { useState, useEffect } from 'react';
import { GamingListing, Order, EscrowStep } from './types';
import { INITIAL_LISTINGS } from './data';
import LandingPage from './components/LandingPage';
import MarketplacePage from './components/MarketplacePage';
import ProductDetailPage from './components/ProductDetailPage';
import UserDashboard from './components/UserDashboard';
import SellerDashboard from './components/SellerDashboard';
import ModerationPanel from './components/ModerationPanel';
import EscrowFlow from './components/EscrowFlow';
import AdminPanel from './components/AdminPanel';
import TournamentHub from './components/TournamentHub';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Shield, Sparkles, ShoppingCart, User, Gamepad2, AlertTriangle, Menu, X, Bell, Wallet, Trophy } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = window.location;

  const [selectedListing, setSelectedListing] = useState<GamingListing | null>(null);
  const [filterGamePreset, setFilterGamePreset] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom User Sign Up and Authorization view toggles
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authErrorAlert, setAuthErrorAlert] = useState<string | null>(null);

  // Administrative separation passcode barrier
  const [adminAuthorized, setAdminAuthorized] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminErrorAlert, setAdminErrorAlert] = useState<string | null>(null);

  // User authentication session state
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; isLoggedIn: boolean; role: string }>({
    username: '',
    email: '',
    isLoggedIn: false,
    role: 'buyer'
  });

  // States synchronized dynamically with the Express backend APIs
  const [userBalance, setUserBalance] = useState(0);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [activeSelectedOrder, setActiveSelectedOrder] = useState<Order | null>(null);

  // Load initial orders state
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          // Map backend format to local types
          const formatted = data.map((o: any) => ({
            id: o.id,
            listing: INITIAL_LISTINGS.find(l => l.id === o.listingId) || INITIAL_LISTINGS[0],
            buyerName: o.buyerName,
            sellerName: o.sellerName,
            price: o.price,
            status: o.status,
            escrowStep: o.escrowStep as EscrowStep,
            createdAt: o.createdAt
          }));
          setActiveOrders(formatted);
        }
      } catch (e) {
        // Safe offline default
      }
    };
    
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser({
            username: data.username,
            email: data.email,
            isLoggedIn: data.isLoggedIn,
            role: data.role || 'buyer'
          });
          if (data.isLoggedIn) {
            setUserBalance(data.balance);
          }
        }
      } catch (e) {
        // Fallback default
      }
    };

    fetchOrders();
    fetchSession();
  }, []);

  const handleLoginAction = async (username: string, email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser({
          username: data.username,
          email: data.email,
          isLoggedIn: true,
          role: data.role || 'buyer'
        });
        setUserBalance(data.balance);
        navigate('/');
      }
    } catch (e) {
      setCurrentUser({ username, email, isLoggedIn: true, role: 'buyer' });
      setUserBalance(4500);
      navigate('/');
    }
  };

  const handleSignUpAction = async (username: string, email: string) => {
    setAuthErrorAlert(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser({
          username: data.username,
          email: data.email,
          isLoggedIn: true,
          role: data.role || 'buyer'
        });
        setUserBalance(data.balance);
        navigate('/');
      } else {
        const errObj = await res.json();
        setAuthErrorAlert(errObj.error || "Sign Up validation database exception.");
      }
    } catch (e) {
      setCurrentUser({ username, email, isLoggedIn: true, role: 'buyer' });
      setUserBalance(4500);
      navigate('/');
    }
  };

  const handleLogoutAction = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setCurrentUser({ username: '', email: '', isLoggedIn: false, role: 'buyer' });
        setUserBalance(0);
        navigate('/');
      }
    } catch (e) {
      setCurrentUser({ username: '', email: '', isLoggedIn: false, role: 'buyer' });
      setUserBalance(0);
      navigate('/');
    }
  };

  // Update wallet balances across views
  const handleRefreshBalance = (newBalance: number) => {
    setUserBalance(newBalance);
  };

  // Create a listing in real time
  const handlePushNewListing = async (newListingData: any) => {
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListingData)
      });
      if (res.ok) {
        // Force list refresh on marketplace
      }
    } catch (e) {
      // client error fallback
    }
  };

  // Buy item action which calls Stripe/bKash backend process endpoints
  const handleInitiatePurchase = async (listing: GamingListing) => {
    if (userBalance < listing.price) {
      alert('🔒 SECURITY EXCEPTION: Insufficient digital balance. Please load funds first inside the dashboard.');
      return;
    }

    try {
      const res = await fetch('/api/orders/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id })
      });
      if (res.ok) {
        const result = await res.json();
        setUserBalance(result.wallet.balance);

        const formattedNewOrder: Order = {
          id: result.order.id,
          listing: listing,
          buyerName: result.order.buyerName,
          sellerName: result.order.sellerName,
          price: result.order.price,
          status: result.order.status,
          escrowStep: result.order.escrowStep,
          createdAt: result.order.createdAt
        };

        setActiveOrders(prev => [formattedNewOrder, ...prev]);
        setActiveSelectedOrder(formattedNewOrder);
        alert(`🛒 ORDER ENROLLED SECURELY: BDT ৳${listing.price} has been locked in micro-escrow holds.`);
        navigate('/escrow-flow');
      }
    } catch (err) {
      // Client-side fail-safe mockup anyway
      const failSafeOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
        listing: listing,
        buyerName: 'corbinburrow3358',
        sellerName: listing.seller.username,
        price: listing.price,
        status: 'PENDING_DELIVERY',
        escrowStep: 'BuyerPaid',
        createdAt: new Date().toISOString()
      };
      setUserBalance(prev => prev - listing.price);
      setActiveOrders(prev => [failSafeOrder, ...prev]);
      setActiveSelectedOrder(failSafeOrder);
      navigate('/escrow-flow');
    }
  };

  // Advance Escrow tracking steps
  const handleAdvanceStep = async (orderId: string, nextStep: EscrowStep) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/escrow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: nextStep })
      });

      if (res.ok) {
        const result = await res.json();
        setUserBalance(result.wallet.balance);

        // Map updated orders
        setActiveOrders(prev => prev.map(o => {
          if (o.id === orderId) {
            const updated = { ...o, escrowStep: nextStep };
            if (activeSelectedOrder?.id === orderId) {
              setActiveSelectedOrder(updated);
            }
            return updated;
          }
          return o;
        }));

        if (nextStep === 'Released') {
          alert(`💸 PROGRESS COMPLETED: Funds successfully released to ${activeSelectedOrder?.sellerName}.`);
        }
      }
    } catch (err) {
      // offline fallback mapping
      setActiveOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          const updated = { ...o, escrowStep: nextStep };
          if (activeSelectedOrder?.id === orderId) {
            setActiveSelectedOrder(updated);
          }
          return updated;
        }
        return o;
      }));
    }
  };

  // Global Navigation Coordinator
  const handleGlobalNavigate = (page: string, extra?: any) => {
    setMobileMenuOpen(false);
    if (page === 'marketplace') {
      if (extra && extra.filterGame) {
        setFilterGamePreset(extra.filterGame);
      } else {
        setFilterGamePreset('');
      }
      setSelectedListing(null);
      navigate('/marketplace');
    } else if (page === 'landing') {
      navigate('/');
    } else {
      navigate('/' + page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0c18] to-[#05060f] text-slate-200 font-sans relative cyber-grid">
      {/* Absolute Header */}
      <header className="sticky top-0 z-50 bg-slate-900/40 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => handleGlobalNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer selection:bg-purple-900 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)] transform group-hover:scale-105 transition-all">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="text-left leading-none">
              <span className="font-bold text-white text-lg tracking-tighter group-hover:text-purple-400 transition-colors">GAMETRADE <span className="text-purple-500 underline decoration-2 underline-offset-4 font-mono font-bold">SECURE</span></span>
            </div>
          </div>

          {/* Desktop Nav menus */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button
              id="nav-link-market"
              onClick={() => handleGlobalNavigate('marketplace')}
              className={`hover:text-white transition-colors cursor-pointer ${location.pathname === '/marketplace' ? 'text-white border-b-2 border-purple-500 pb-1' : ''}`}
            >
              Marketplace
            </button>
            <button
              id="nav-link-tournaments"
              onClick={() => handleGlobalNavigate('tournaments')}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${location.pathname === '/tournaments' ? 'text-white border-b-2 border-purple-500 pb-1' : ''}`}
            >
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <span>Tournaments</span>
            </button>
            {currentUser.isLoggedIn && (currentUser.role === 'seller' || currentUser.role === 'admin') && (
              <button
                id="nav-link-sell"
                onClick={() => handleGlobalNavigate('seller-dashboard')}
                className={`hover:text-white transition-colors cursor-pointer ${location.pathname === '/seller-dashboard' ? 'text-white border-b-2 border-purple-500 pb-1' : ''}`}
              >
                Services
              </button>
            )}
            <button
              id="nav-link-shield"
              onClick={() => handleGlobalNavigate('ai-moderation')}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${location.pathname === '/ai-moderation' ? 'text-white border-b-2 border-purple-500 pb-1' : ''}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Shield Feed
            </button>
          </nav>

          {/* Profile overview bar */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {currentUser.isLoggedIn ? (
              <div className="flex items-center gap-5 animate-fadeIn">
                {/* Wallet Quick Balance Info */}
                <div
                  onClick={() => handleGlobalNavigate('user-dashboard')}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10 hover:border-purple-500/40 transition-all font-mono"
                >
                  <span className="text-xs text-slate-500 uppercase tracking-widest">Wallet</span>
                  <span className="font-bold text-white">৳{userBalance.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    onClick={() => handleGlobalNavigate('user-dashboard')}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-purple-500/50 p-0.5 transform group-hover:scale-105 transition-all">
                      <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-xs text-white font-black font-mono uppercase">
                        {currentUser.username.substring(0, 2)}
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-white font-mono tracking-wider font-extrabold max-w-[120px] truncate leading-none mb-0.5">{currentUser.username}</p>
                      <span className="text-[9px] text-purple-400 font-mono tracking-wide font-extrabold">VERIFIED PLAYER</span>
                    </div>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      id="btn-admin-shield-gate"
                      onClick={() => handleGlobalNavigate('admin-panel')}
                      className="cursor-pointer p-2 bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20 text-purple-400 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1"
                      title="Platform Admin Center"
                    >
                      <Shield className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    id="btn-logout-header"
                    onClick={handleLogoutAction}
                    className="cursor-pointer ml-1 px-3 py-1.5 bg-red-950/20 hover:bg-red-900/40 border border-red-900/40 hover:border-red-500/60 text-red-450 text-red-400 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="btn-login-trigger"
                onClick={() => handleGlobalNavigate('login')}
                className="cursor-pointer px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg border border-purple-400/20 shadow-purple-950/25 transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburg menu button */}
          <div className="lg:hidden flex items-center gap-3">
            <div
              onClick={() => handleGlobalNavigate('user-dashboard')}
              className="bg-slate-950/80 border border-purple-900/10 px-2.5 py-1.5 rounded-lg text-green-400 font-mono font-bold text-xs"
            >
              ৳ {userBalance.toLocaleString()}
            </div>
            <button
              id="mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 px-2 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown list drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-950 p-4 space-y-3 bg-[#0a0c18] font-mono text-center text-xs flex flex-col uppercase tracking-wider font-bold">
            <button
              id="mob-link-market"
              className="py-2.5 hover:text-purple-300 cursor-pointer"
              onClick={() => handleGlobalNavigate('marketplace')}
            >
              Market Catalog
            </button>
            <button
              id="mob-link-tournaments"
              className="py-2.5 text-purple-300 cursor-pointer"
              onClick={() => handleGlobalNavigate('tournaments')}
            >
              🏆 Tournaments
            </button>
            {currentUser.isLoggedIn && (currentUser.role === 'seller' || currentUser.role === 'admin') && (
              <button
                id="mob-link-seller"
                className="py-2.5 hover:text-purple-300 cursor-pointer"
                onClick={() => handleGlobalNavigate('seller-dashboard')}
              >
                Seller Hub
              </button>
            )}
            <button
              id="mob-link-shield"
              className="py-2.5 hover:text-purple-300 cursor-pointer"
              onClick={() => handleGlobalNavigate('ai-moderation')}
            >
              AI Moderation
            </button>
            {currentUser.role === 'admin' && (
              <button
                id="mob-link-admin"
                className="py-2.5 hover:text-purple-300 cursor-pointer"
                onClick={() => handleGlobalNavigate('admin-panel')}
              >
                Admin Referee
              </button>
            )}
            <button
              id="mob-link-user"
              className="py-2.5 text-purple-400 cursor-pointer animate-pulse"
              onClick={() => handleGlobalNavigate('user-dashboard')}
            >
              User Dashboard Center
            </button>
            {currentUser.isLoggedIn ? (
              <button
                id="mob-link-logout"
                className="py-2.5 text-red-400 cursor-pointer"
                onClick={handleLogoutAction}
              >
                Log Out ({currentUser.username})
              </button>
            ) : (
              <button
                id="mob-link-login"
                className="py-2.5 text-purple-300 cursor-pointer"
                onClick={() => handleGlobalNavigate('login')}
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative">
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={handleGlobalNavigate} />} />
          
          <Route path="/marketplace" element={
            <MarketplacePage
              onViewListing={(item) => {
                setSelectedListing(item);
                navigate('/product-detail');
              }}
              initialGameFilter={filterGamePreset}
              onNavigateToSell={() => handleGlobalNavigate('seller-dashboard')}
            />
          } />

          <Route path="/product-detail" element={
            selectedListing ? (
              <ProductDetailPage
                listing={selectedListing}
                onBack={() => handleGlobalNavigate('marketplace')}
                onInitiatePurchase={handleInitiatePurchase}
                userBalance={userBalance}
              />
            ) : <Navigate to="/marketplace" />
          } />

          <Route path="/user-dashboard" element={
            !currentUser.isLoggedIn ? (
              <div className="py-24 text-center space-y-4 font-mono">
                <AlertTriangle className="w-12 h-12 text-purple-400 mx-auto opacity-80" />
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Authentication Required</h4>
                <p className="text-slate-500 text-xs text-balance max-w-sm mx-auto">Please log in to view and interact with your personal workspace.</p>
              </div>
            ) : (
              <UserDashboard
                userBalance={userBalance}
                onRefreshBalance={handleRefreshBalance}
                activeOrders={activeOrders}
                onAdvanceOrderEscrow={handleAdvanceStep}
                onNavigateToEscrowDetail={(order) => {
                  setActiveSelectedOrder(order);
                  navigate('/escrow-flow');
                }}
              />
            )
          } />

          <Route path="/seller-dashboard" element={
            !currentUser.isLoggedIn ? (
              <div className="py-24 text-center space-y-4 font-mono">
                <AlertTriangle className="w-12 h-12 text-purple-400 mx-auto opacity-80" />
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Unauthorized Access</h4>
                <p className="text-slate-500 text-xs">Authentication is required to access the Seller Hub.</p>
              </div>
            ) : currentUser.role !== 'seller' && currentUser.role !== 'admin' ? (
              <div className="py-24 text-center space-y-4 font-mono">
                <Shield className="w-12 h-12 text-red-500 mx-auto opacity-80" />
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Access Restricted</h4>
                <p className="text-slate-500 text-xs text-balance max-w-sm mx-auto">Your account does not possess the required Seller credentials configuration.</p>
              </div>
            ) : (
              <SellerDashboard
                currentUser={currentUser.username}
                onAddListing={handlePushNewListing}
                onNavigateToCatalog={() => handleGlobalNavigate('marketplace')}
              />
            )
          } />

          <Route path="/ai-moderation" element={
            <ModerationPanel />
          } />

          <Route path="/escrow-flow" element={
            activeSelectedOrder ? (
              <EscrowFlow
                id={activeSelectedOrder.id}
                title={activeSelectedOrder.listing.title}
                price={activeSelectedOrder.price}
                buyerName={activeSelectedOrder.buyerName}
                sellerName={activeSelectedOrder.sellerName}
                currentStep={activeSelectedOrder.escrowStep}
                onStepChange={(stepVal) => handleAdvanceStep(activeSelectedOrder.id, stepVal)}
              />
            ) : (
              <div className="py-20 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-purple-400 mx-auto animate-bounce" />
                <h4 className="text-white font-bold text-sm">No Active Escrow Tracked</h4>
                <p className="text-gray-550 text-xs text-slate-500 max-w-sm mx-auto">Please proceed to buy a game listing first to launch the automated process timeline securely.</p>
                <button
                  id="btn-escrow-fallback"
                  onClick={() => handleGlobalNavigate('marketplace')}
                  className="cursor-pointer px-4.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-bold text-white uppercase tracking-wider"
                >
                  Browse Listings
                </button>
              </div>
            )
          } />

          <Route path="/admin-panel" element={
            currentUser.role !== 'admin' ? (
              <div className="py-24 text-center space-y-4 font-mono">
                <Shield className="w-12 h-12 text-red-500 mx-auto opacity-80" />
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Administrative Clearance Required</h4>
                <p className="text-slate-500 text-xs text-balance max-w-sm mx-auto">This terminal vector restricts unauthorized user sessions. Admin credentials required.</p>
              </div>
            ) : (
              <div className="max-w-md mx-auto py-12 animate-fadeIn text-left font-mono">
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-purple-950/20 border border-purple-500/20 px-4 py-2.5 rounded-xl text-xs text-purple-300 font-mono">
                    <span>🔒 Administrative Mode Active</span>
                    <button
                      onClick={() => navigate('/')}
                      className="cursor-pointer underline text-[10px] hover:text-white"
                    >
                      Exit Portal
                    </button>
                  </div>
                  <AdminPanel />
                </div>
              </div>
            )
          } />

          <Route path="/tournaments" element={
            <TournamentHub
              userBalance={userBalance}
              onRefreshBalance={handleRefreshBalance}
              isLoggedIn={currentUser.isLoggedIn}
              onNavigateToLogin={() => handleGlobalNavigate('login')}
            />
          } />

          <Route path="/login" element={
            <div className="max-w-md mx-auto py-12 animate-fadeIn text-left">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none text-left" />
                
                {/* Login / Signup Selector Tabs */}
                <div className="flex border-b border-white/10 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('login');
                      setAuthErrorAlert(null);
                    }}
                    className={`flex-1 pb-2 text-xs font-mono font-black uppercase text-center transition-all cursor-pointer ${
                      authTab === 'login' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Sign In Gateway
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signup');
                      setAuthErrorAlert(null);
                    }}
                    className={`flex-1 pb-2 text-xs font-mono font-black uppercase text-center transition-all cursor-pointer ${
                      authTab === 'signup' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {authErrorAlert && (
                  <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-300 text-xs rounded-xl text-center">
                    ⚠️ {authErrorAlert}
                  </div>
                )}

              {authTab === 'login' ? (
                <div className="space-y-5">
                  <div className="text-center space-y-1">
                    <h2 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">Trader Authorization</h2>
                    <p className="text-xs text-slate-400">Sign in with default fast credentials or standard persona.</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      id="btn-quick-login-corbin"
                      onClick={() => handleLoginAction('corbinburrow3358', 'corbinburrow3358@gmail.com')}
                      className="cursor-pointer w-full p-4 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs uppercase font-mono">
                          CB
                        </div>
                        <div className="text-left leading-tight">
                          <p className="text-xs font-bold text-white font-mono">corbinburrow3358</p>
                          <p className="text-[10px] text-slate-500">Fast default trader persona</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-purple-400 font-mono font-bold uppercase py-1 px-2.5 border border-purple-500/20 rounded bg-purple-950/20">Sign In</span>
                    </button>

                    <button
                      type="button"
                      id="btn-quick-login-guest"
                      onClick={() => handleLoginAction('GuestProMax', 'guest@gametrade.ai')}
                      className="cursor-pointer w-full p-4 bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs uppercase font-mono">
                          GP
                        </div>
                        <div className="text-left leading-tight">
                          <p className="text-xs font-bold text-white font-mono">GuestProMax</p>
                          <p className="text-[10px] text-slate-500">Quick play demo account</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase bg-white/5 border border-white/10 py-1 px-2 leading-none rounded">Fast Play</span>
                    </button>
                    
                    {/* Custom Credentials Form */}
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!authUsername.trim()) {
                        setAuthErrorAlert("Please enter is valid Username.");
                        return;
                      }
                      handleLoginAction(authUsername.trim(), authEmail.trim() || `${authUsername.trim()}@gametrade.com`);
                    }} className="space-y-3.5 pt-4 border-t border-white/5">
                      <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">Or Sign In with Custom Account</p>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 font-bold uppercase block text-left">Trader Username</label>
                        <input
                          type="text"
                          required
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                          placeholder="e.g. cyber_warrior99"
                          className="w-full bg-slate-900 rounded-xl px-3 py-2.5 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 font-bold uppercase block text-left">Passkey / Password</label>
                        <input
                          type="password"
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-900 rounded-xl px-3 py-2.5 text-xs text-white border border-white/10 focus:border-purple-400 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="cursor-pointer w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                      >
                        Authenticate Credentials
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!authUsername.trim() || !authEmail.trim()) {
                    setAuthErrorAlert("Please key in valid credentials configuration parameters.");
                    return;
                  }
                  handleSignUpAction(authUsername.trim(), authEmail.trim());
                }} className="space-y-4 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Choose Trader Username</label>
                    <input
                      type="text"
                      required
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      placeholder="e.g. cyber_warrior99"
                      className="w-full bg-slate-900 rounded-xl px-3.5 py-2.5 text-white border border-white/10 focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Secure Email Address</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. trade@domain.com"
                      className="w-full bg-slate-900 rounded-xl px-3.5 py-2.5 text-white border border-white/10 focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Set Private Security Passkey</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 rounded-xl px-3.5 py-2.5 text-white border border-white/10 focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer w-full py-3 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    Confirm & Register Profile
                  </button>
                </form>
              )}

              <div className="font-mono text-[9px] text-slate-500 tracking-wider text-center border-t border-white/5 pt-4 uppercase">
                ⚙️ ESCROW ARMED SECURITY PROTOCOL ACTIVE
              </div>
            </div>
          </div>
          } />
        </Routes>
      </main>

      {/* Cyberpunk Sticky Responsive Mobile Bottom Navigation Menu */}
      <div className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-[#0a0c18]/90 border border-purple-500/25 rounded-2xl p-2 flex justify-around items-center text-[9px] font-mono font-bold uppercase select-none shadow-xl backdrop-blur-md">
        <button
          id="mobile-bottom-nav-home"
          onClick={() => handleGlobalNavigate('landing')}
          className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${location.pathname === '/' ? 'text-purple-300' : 'text-slate-500'}`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          id="mobile-bottom-nav-market"
          onClick={() => handleGlobalNavigate('marketplace')}
          className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${location.pathname === '/marketplace' ? 'text-purple-300' : 'text-slate-500'}`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Catalog</span>
        </button>
        <button
          id="mobile-bottom-nav-tourn"
          onClick={() => handleGlobalNavigate('tournaments')}
          className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${location.pathname === '/tournaments' ? 'text-purple-300' : 'text-slate-500'}`}
        >
          <Trophy className="w-4 h-4" />
          <span>Matches</span>
        </button>
        <button
          id="mobile-bottom-nav-sell"
          onClick={() => handleGlobalNavigate('seller-dashboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${location.pathname === '/seller-dashboard' ? 'text-purple-300' : 'text-slate-500'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Sell</span>
        </button>
        <button
          id="mobile-bottom-nav-shield"
          onClick={() => handleGlobalNavigate('ai-moderation')}
          className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${location.pathname === '/ai-moderation' ? 'text-purple-300' : 'text-slate-500'}`}
        >
          <Shield className="w-4 h-4" />
          <span>Shield</span>
        </button>
        <button
          id="mobile-bottom-nav-user"
          onClick={() => handleGlobalNavigate('user-dashboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${location.pathname === '/user-dashboard' ? 'text-purple-300' : 'text-slate-500'}`}
        >
          <User className="w-4 h-4" />
          <span>User</span>
        </button>
      </div>
    </div>
  );
}
