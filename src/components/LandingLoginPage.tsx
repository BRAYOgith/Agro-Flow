import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface LandingLoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LandingLoginPage: React.FC<LandingLoginPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'system' | 'guide' | 'login'>('home');
  const [username, setUsername] = useState('john.mwangi');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mouse position for consultancy-style Cursor Glow
  const [mousePos, setMousePos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Noticeable Rotating Hero Accent (consultancy style)
  const rotatingWords = [
    { highlight: 'Speed', suffix: 'to Counter Checkout.' },
    { highlight: 'Certainty', suffix: 'to Smallholder Credit.' },
    { highlight: 'Zero Loss', suffix: 'to Expired Inputs.' },
    { highlight: 'Precision', suffix: 'to Shift Balancing.' },
  ];
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [rotatingFade, setRotatingFade] = useState(true);

  useEffect(() => {
    if (activeTab !== 'home') return;
    const interval = setInterval(() => {
      setRotatingFade(false);
      setTimeout(() => {
        setRotatingIndex((prev) => (prev + 1) % rotatingWords.length);
        setRotatingFade(true);
      }, 300);
    }, 3800);
    return () => clearInterval(interval);
  }, [activeTab, rotatingWords.length]);

  // Video Modal State for In-Store Demo
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Field Review Dispatch Data (authentic Kenyan agrovets in Kirinyaga & Mount Kenya)
  const fieldReviews = [
    {
      store: 'Kirinyaga Agrovet Central',
      location: 'Kerugoya Town, Kirinyaga',
      manager: 'Samuel Maina • Managing Director',
      photo: '/media/farmer.jpg',
      quote: 'Before AgroFlow, paper credit notebooks always had missing pages and disputes at harvest time. Now with automated M-Pesa debt reminders, our recovery jumped to 98%.',
      stat: 'KES 240,000 Recovered',
      category: 'Commercial Agrovet',
    },
    {
      store: 'Mwea Farm Supplies & Depot',
      location: 'Wang’uru / Mwea Rice Belt',
      manager: 'Beatrice Njeri • Shop Supervisor',
      photo: '/media/cabbage.jpg',
      quote: 'During peak fertilizer distribution, queues reached the street. The F2 counter hotkey and barcode scanner cut checkout time to under 3 seconds per farmer.',
      stat: '4x Faster Counter POS',
      category: 'Rice & Cereals Depot',
    },
    {
      store: 'Mount Kenya Agro-Chemicals',
      location: 'Kutus Junction, Kirinyaga',
      manager: 'David Karani • Lead Cashier',
      photo: '/media/fruit.jpg',
      quote: 'The shift close banknote denomination counter makes drawer balancing effortless. We haven’t had a single unexplained cash shortage since the Manager PIN lock.',
      stat: '0 KES Shift Discrepancy',
      category: 'Input Dispensary',
    },
    {
      store: 'Pokea Dairy Cooperative Input Centre',
      location: 'Kangari / Murang’a North Hub',
      manager: 'Timothy Sila • Veterinary Officer',
      photo: '/media/cows.jpg',
      quote: 'Managing veterinary medicines and dairy meal credit against farmer milk deliveries used to take days. With AgroFlow check-off ledgers, balancing takes 10 minutes.',
      stat: '98% Ledger Accuracy',
      category: 'Co-op Dairy Hub',
    },
  ];

  // 3. System tab state
  const [selectedSystemModule, setSelectedSystemModule] = useState<
    'pos' | 'credit' | 'inventory' | 'shift' | 'farmers' | 'suppliers'
  >('pos');

  // 4. Guide tab state
  const [selectedRole, setSelectedRole] = useState<'cashier' | 'manager'>('cashier');
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Listen to keyboard shortcuts when on Guide tab
  useEffect(() => {
    if (activeTab !== 'guide') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['F1', 'F2', 'F3', 'F4'].includes(e.key)) {
        e.preventDefault();
        setPressedKey(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(username, password);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
  };

  const currentRotating = rotatingWords[rotatingIndex];

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-between text-[#131b2e] font-inter selection:bg-[#87c695] selection:text-[#003b1b] relative overflow-x-hidden">
      {/* Consultancy-style Cursor Glow Ambient Light */}
      <div
        className="cursor-glow"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* Noticeable Operational Top Marquee Ticker */}
      <div className="bg-[#002410] text-[#87c695] text-[11px] py-2 border-b border-[#14532d] overflow-hidden font-medium tracking-wide">
        <div className="animate-marquee">
          <div className="flex items-center gap-8 pr-8">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-Time M-Pesa STK Push Terminal Online
            </span>
            <span>•</span>
            <span>100% Offline SQLite Database Continuity</span>
            <span>•</span>
            <span>Automated Africa’s Talking SMS Credit Repayment Dispatches</span>
            <span>•</span>
            <span>Manager PIN Protected Drawer Safe &amp; Z-Report Balancing</span>
            <span>•</span>
            <span>Kirinyaga County Agribusiness Operating System Edition</span>
          </div>
          <div className="flex items-center gap-8 pr-8">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-Time M-Pesa STK Push Terminal Online
            </span>
            <span>•</span>
            <span>100% Offline SQLite Database Continuity</span>
            <span>•</span>
            <span>Automated Africa’s Talking SMS Credit Repayment Dispatches</span>
            <span>•</span>
            <span>Manager PIN Protected Drawer Safe &amp; Z-Report Balancing</span>
            <span>•</span>
            <span>Kirinyaga County Agribusiness Operating System Edition</span>
          </div>
        </div>
      </div>

      {/* Top Quick Contact & Help Bar */}
      <div className="bg-[#003417] text-[#87c695] text-[11px] py-1.5 px-6 border-b border-[#14532d]/60 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+254790509684" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xs text-[#87c695]">call</span>
              <span>+254 790 509 684 / +254 724 559 286</span>
            </a>
            <span className="text-[#14532d]">•</span>
            <div className="flex items-center gap-1.5 text-[#87c695]/90">
              <span className="material-symbols-outlined text-xs">location_on</span>
              <span>Kerugoya Central Hub &amp; Nairobi, Kenya</span>
            </div>
            <span className="text-[#14532d]">•</span>
            <a href="mailto:support@agroflow.co.ke" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xs">mail</span>
              <span>support@agroflow.co.ke</span>
            </a>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="bg-[#14532d]/80 text-[#b1f2be] px-2 py-0.5 rounded-full font-mono">
              ODPC / KDPA 2019 COMPLIANT
            </span>
            <span className="bg-[#14532d]/80 text-[#b1f2be] px-2 py-0.5 rounded-full font-mono">
              PCPB(CR) VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Top Public Navigation Navbar */}
      <header className="bg-[#003b1b] text-white border-b border-[#14532d] px-6 py-3.5 shadow-lg sticky top-0 z-30 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1X9wFvkPwR2rD-0K7RfG9t5qZ6pueh0C-3t9cT_cBLxyVLB8zYvPOEj74ThuFFBhNzqKYSI--qvIwvubjHuCGbO_Ff2zBPZr4eo-ZohcRjmLH1RzKEgloqef7kc5bNLEBmdk9ZY2F_ILINM8h1jfuz_1mLi90KDf1sp2hMQrgHpKiLLwSjX7p7vbn-9ty5OUpbjAnn9tNRU319WM1-60_sndWDOC1TtuMwQFVZz2p5k4oxssS4PXQ466kom"
              alt="AgroFlow Logo"
              className="w-9 h-9 object-contain bg-white rounded-xl p-1 shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <div className="font-playfair font-bold text-xl tracking-tight text-white flex items-center gap-2">
                <span>AgroFlow</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </div>
          </div>

          {/* Public Page Tabs */}
          <nav className="flex items-center gap-1 bg-[#14532d]/60 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-white text-[#003b1b] shadow-sm font-bold scale-[1.02]'
                  : 'text-[#87c695] hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-white text-[#003b1b] shadow-sm font-bold scale-[1.02]'
                  : 'text-[#87c695] hover:text-white hover:bg-white/5'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-white text-[#003b1b] shadow-sm font-bold scale-[1.02]'
                  : 'text-[#87c695] hover:text-white hover:bg-white/5'
              }`}
            >
              About System
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-white text-[#003b1b] shadow-sm font-bold scale-[1.02]'
                  : 'text-[#87c695] hover:text-white hover:bg-white/5'
              }`}
            >
              System Guide
            </button>

            <button
              onClick={() => setActiveTab('login')}
              className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#b1f2be] text-[#00210d] font-bold shadow-md scale-[1.02]'
                  : 'bg-[#1b6b3b] text-white hover:bg-[#238549]'
              }`}
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area Based on Active Tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
        {/* 1. HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-16 py-2 animate-fade-in">
            {/* Section 1: FarmersTrend-Inspired Static Hero Showcase (Using local farmer.jpg and cabbage.jpg) */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002410] via-[#003b1b] to-[#00170a] text-white border border-[#14532d] shadow-2xl">
              <div className="grid lg:grid-cols-12 gap-8 items-center p-8 md:p-12 lg:p-16 relative z-10">
                {/* Left Hero Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-[#14532d]/80 border border-[#87c695]/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#b1f2be] shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>National &amp; County Agribusiness Operating System</span>
                  </div>

                  <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white tracking-tight">
                    New Generation Culture in <span className="text-[#87c695] underline decoration-emerald-400 underline-offset-8">Agribusiness</span> &amp; Input Operations
                  </h1>

                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl font-normal">
                    Empowering agro-dealers, smallholder farmers, and agricultural input distributors across Kirinyaga and Kenya with 100% offline-resilient POS, automated M-Pesa debt reminders, and PCPB-verified batch traceability.
                  </p>

                  {/* Operational Feature Bullets */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-[#b1f2be]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                      <span>3-Second POS Barcode Checkout (F2)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                      <span>Automated Africa&apos;s Talking SMS Alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                      <span>100% PCPB &amp; KEPHIS Batch Audits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                      <span>Zero Loss Offline SQLite Continuity</span>
                    </div>
                  </div>

                  {/* Action Buttons & Video Trigger */}
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <button
                      onClick={() => setActiveTab('login')}
                      className="px-6 py-3.5 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span className="material-symbols-outlined text-base">login</span>
                      <span>Sign In to Terminal</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('system')}
                      className="px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <span>Explore System Pillars</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>

                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="px-4 py-3 bg-black/40 hover:bg-black/60 border border-emerald-400/40 text-[#b1f2be] font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#11bf36] text-white flex items-center justify-center box-shadow-ripples">
                        <span className="material-symbols-outlined text-xs">play_arrow</span>
                      </div>
                      <span className="hidden sm:inline">Operating Tour</span>
                    </button>
                  </div>
                </div>

                {/* Right Hero Image Card (Farmer holding tablet in Kenyan field) */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400/40 shadow-2xl group">
                    <img
                      src="/media/farmer.jpg"
                      alt="Kenyan Agribusiness Farmer"
                      className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#87c695]">
                        Field Agribusiness Deployment
                      </span>
                      <h3 className="font-playfair font-bold text-lg text-white">
                        Connected Smallholders &amp; Agro-Dealers
                      </h3>
                      <p className="text-xs text-gray-200 mt-1">
                        Eliminating paper debt notebooks across 1,400+ Kenyan retail stores.
                      </p>
                    </div>
                  </div>

                  {/* Floating Stat Badge */}
                  <div className="absolute -bottom-4 -left-4 bg-white text-[#003b1b] p-3.5 rounded-2xl shadow-xl border border-emerald-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#003b1b] font-bold">
                      <span className="material-symbols-outlined text-xl">verified</span>
                    </div>
                    <div>
                      <div className="font-playfair font-bold text-base leading-tight">98% Recovery</div>
                      <div className="text-[10px] text-gray-500">M-Pesa Smallholder Credit</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: 6 Operational Grid Boxes (Inspired by FarmersTrend layout_four feature-list) */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#11bf36] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                    <span>Core Value Chain Categories</span>
                  </div>
                  <h2 className="font-playfair font-bold text-2xl md:text-3xl text-[#131b2e]">
                    Integrated Agrovet Operational Modules
                  </h2>
                </div>
                <p className="text-xs text-gray-500 max-w-md">
                  Everything required to manage a high-volume agrochemical, seed, fertilizer, and veterinary dispensary in Kenya.
                </p>
              </div>

              {/* 6 Category Feature Boxes with Real Media Photos */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Box 1: Crop Input & POS Checkout (cabbage.jpg) */}
                <div className="bg-white rounded-2xl border border-[#dae2fd] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src="/media/cabbage.jpg"
                        alt="High-Yield Vegetables & Crop Protection"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#003b1b]/90 text-[#b1f2be] text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-400/30">
                        Counter POS &amp; Inputs
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">point_of_sale</span>
                      </div>
                      <h3 className="font-playfair font-bold text-base text-[#131b2e]">
                        Fast POS Counter &amp; Agrochemical Sales
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        High-speed barcode scanning with F2 shortcut, split tender (M-Pesa, Cash, Credit), and instant thermal receipt printing.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setActiveTab('system')}
                      className="text-xs font-bold text-[#003b1b] hover:text-[#11bf36] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Explore POS Architecture</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Box 2: Livestock & Dairy Farming (cows.jpg) */}
                <div className="bg-white rounded-2xl border border-[#dae2fd] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src="/media/cows.jpg"
                        alt="Livestock & Dairy Farming in Kenya"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#003b1b]/90 text-[#b1f2be] text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-400/30">
                        Livestock &amp; Dairy
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">pets</span>
                      </div>
                      <h3 className="font-playfair font-bold text-base text-[#131b2e]">
                        Veterinary Medicines &amp; Dairy Feeds
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Track clinical dewormers, acaricides, and dairy meal with tripartite cooperative milk check-off credit guarantees.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setActiveTab('system')}
                      className="text-xs font-bold text-[#003b1b] hover:text-[#11bf36] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Livestock Ledger</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Box 3: Fruit Seedlings & Horticulture (fruit.jpg) */}
                <div className="bg-white rounded-2xl border border-[#dae2fd] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src="/media/fruit.jpg"
                        alt="Fruit Seedlings & Horticultural Orchards"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#003b1b]/90 text-[#b1f2be] text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-400/30">
                        Fruit &amp; Certified Seeds
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">nature</span>
                      </div>
                      <h3 className="font-playfair font-bold text-base text-[#131b2e]">
                        Certified Seedlings &amp; Orchard Nursery
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        KEPHIS lot certification tracking for avocado, macadamia, and passion fruit seedlings with automated planting advisory.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setActiveTab('system')}
                      className="text-xs font-bold text-[#003b1b] hover:text-[#11bf36] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Inspect Seed Module</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Box 4: Smallholder Credit Book (seedfarm.jpg logo / card) */}
                <div className="bg-white rounded-2xl border border-[#dae2fd] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden bg-[#faf8ff] flex items-center justify-center p-6 border-b border-gray-100">
                      <img
                        src="/media/seedfarm.jpg"
                        alt="Seed Farm Agro-Network"
                        className="max-h-36 object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#003b1b]/90 text-[#b1f2be] text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-400/30">
                        Smallholder Credit
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                      </div>
                      <h3 className="font-playfair font-bold text-base text-[#131b2e]">
                        Smallholder Credit &amp; Debt Book
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Replace torn debt notebooks with digital credit ledgers, National ID verification, credit ceilings, and M-Pesa SMS reminders.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setActiveTab('system')}
                      className="text-xs font-bold text-[#003b1b] hover:text-[#11bf36] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Credit Rules</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Box 5: Batch Expiry & FEFO Control (yielder.png logo / card) */}
                <div className="bg-white rounded-2xl border border-[#dae2fd] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden bg-[#f3faf6] flex items-center justify-center p-6 border-b border-gray-100">
                      <img
                        src="/media/yielder.png"
                        alt="Yielder Agribusiness Engine"
                        className="max-h-24 object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#003b1b]/90 text-[#b1f2be] text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-400/30">
                        PCPB FEFO Expiry
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">inventory_2</span>
                      </div>
                      <h3 className="font-playfair font-bold text-base text-[#131b2e]">
                        Inventory, Batches &amp; FEFO Expiry
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Automated first-expiry-first-out dispensing with 30-day early warnings to eliminate chemical shelf-life spoilage.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setActiveTab('system')}
                      className="text-xs font-bold text-[#003b1b] hover:text-[#11bf36] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Explore Expiry Monitor</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Box 6: Shift Register & Drawer Balancing */}
                <div className="bg-white rounded-2xl border border-[#dae2fd] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-900 to-[#002410] flex items-center justify-center p-6 text-white text-center">
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-emerald-400">
                          <span className="material-symbols-outlined text-2xl">lock</span>
                        </div>
                        <div className="font-playfair font-bold text-lg">Manager PIN Protected</div>
                        <div className="text-[11px] text-emerald-200">Immutable Z-Report Snapshots</div>
                      </div>
                      <div className="absolute top-3 left-3 bg-black/40 text-[#b1f2be] text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                        Drawer Audit
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">receipt_long</span>
                      </div>
                      <h3 className="font-playfair font-bold text-base text-[#131b2e]">
                        Shift Register &amp; Daily Safe Close
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Denomination banknote tally matched against digital transaction journals to ensure zero end-of-day drawer discrepancy.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setActiveTab('guide')}
                      className="text-xs font-bold text-[#003b1b] hover:text-[#11bf36] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Read Reconciliation Guide</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
            {/* Clean Animated Metrics Summary Bar with Playfair Typography */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div className="bg-white p-4 rounded-2xl border border-[#dae2fd] transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="font-playfair text-2xl font-bold text-[#003b1b]">99.8%</div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Shift Reconciliation Rate</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#dae2fd] transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="font-playfair text-2xl font-bold text-[#003b1b]">&lt; 3 sec</div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Barcode POS Checkout</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#dae2fd] transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="font-playfair text-2xl font-bold text-[#003b1b]">KES 0</div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Notebook Debt Leakage</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#dae2fd] transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="font-playfair text-2xl font-bold text-[#003b1b]">100%</div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Offline-Ready SQLite</div>
              </div>
            </div>

            {/* Field Operations & Agrovet Operator Dispatches (Static Editorial Grid - Zero Carousel) */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200 pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#11bf36] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">rate_review</span>
                    <span>Field Operator Dispatches &amp; Case Studies</span>
                  </div>
                  <h3 className="font-playfair font-bold text-2xl md:text-3xl text-[#131b2e]">
                    Trusted by 1,400+ Agrovets in Kirinyaga &amp; Mount Kenya
                  </h3>
                </div>
                <div className="text-xs text-gray-500 max-w-sm">
                  Real operational experiences from managers, agronomists, and counter cashiers using AgroFlow daily.
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                {fieldReviews.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#dae2fd] p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="relative h-36 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={item.photo}
                          alt={item.store}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-[#003b1b]/90 text-[#b1f2be] text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-400/30">
                          {item.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <span className="material-symbols-outlined text-sm text-amber-500">star</span>
                        <span className="material-symbols-outlined text-sm text-amber-500">star</span>
                        <span className="material-symbols-outlined text-sm text-amber-500">star</span>
                        <span className="material-symbols-outlined text-sm text-amber-500">star</span>
                        <span className="material-symbols-outlined text-sm text-amber-500">star</span>
                        <span className="text-[10px] text-gray-400 ml-1 font-semibold">5.0 Verified</span>
                      </div>

                      <blockquote className="font-playfair italic text-xs text-gray-700 leading-relaxed">
                        &ldquo;{item.quote}&rdquo;
                      </blockquote>
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-1.5">
                      <div className="font-bold text-xs text-[#003b1b]">{item.store}</div>
                      <div className="text-[11px] text-gray-500 leading-tight">
                        {item.manager}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {item.location}
                      </div>
                      <div className="mt-2 inline-block font-bold text-[11px] text-[#003b1b] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {item.stat}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Circular Impact Gauges & Agricultural Performance Stats */}
            <div className="bg-white rounded-3xl p-8 border border-[#dae2fd] shadow-sm space-y-6">
              <div className="max-w-xl space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Operational Impact &amp; Adoption
                </div>
                <h3 className="font-playfair font-bold text-2xl text-[#131b2e]">
                  Measured Results Across Smallholder Agro-Networks
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                {/* Gauge 1: 98% Credit Recovery */}
                <div className="flex flex-col items-center text-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-3">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#11bf36"
                        strokeWidth="8"
                        strokeDasharray={264}
                        strokeDashoffset={264 * (1 - 0.98)}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-playfair font-bold text-2xl text-[#003b1b]">98%</span>
                      <span className="text-[9px] uppercase font-bold text-gray-500">Recovery</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-sm text-[#003b1b]">Farmer Credit Settlement</h4>
                    <p className="text-xs text-gray-500 mt-1">Automated M-Pesa SMS reminders eliminate unsecured bad debt.</p>
                  </div>
                </div>

                {/* Gauge 2: 100% FEFO Batch Traceability */}
                <div className="flex flex-col items-center text-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-3">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#11bf36"
                        strokeWidth="8"
                        strokeDasharray={264}
                        strokeDashoffset={264 * (1 - 1.0)}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-playfair font-bold text-2xl text-[#003b1b]">100%</span>
                      <span className="text-[9px] uppercase font-bold text-gray-500">Traceable</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-sm text-[#003b1b]">PCPB &amp; KEPHIS Compliance</h4>
                    <p className="text-xs text-gray-500 mt-1">Every chemical batch, expiration date, and lot registration is audited.</p>
                  </div>
                </div>

                {/* Gauge 3: 0.2% Drawer Shortage */}
                <div className="flex flex-col items-center text-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-3">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#11bf36"
                        strokeWidth="8"
                        strokeDasharray={264}
                        strokeDashoffset={264 * (1 - 0.998)}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-playfair font-bold text-2xl text-[#003b1b]">99.8%</span>
                      <span className="text-[9px] uppercase font-bold text-gray-500">Balanced</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-sm text-[#003b1b]">Shift Drawer Balancing</h4>
                    <p className="text-xs text-gray-500 mt-1">Denomination counting matched against digital sales ledger daily.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trusted Institutional Partners & Agricultural Ecosystem (Using Local Uploaded Partner Logos) */}
            <div className="bg-[#002811] text-white rounded-3xl p-6 md:p-8 shadow-md border border-[#14532d] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#14532d] pb-3">
                <div>
                  <div className="text-[10px] text-[#87c695] uppercase font-bold tracking-widest">
                    National &amp; County Agricultural Ecosystem
                  </div>
                  <h4 className="font-playfair font-bold text-lg text-white">
                    Integrated with Trusted Value Chain Partners
                  </h4>
                </div>
                <div className="text-xs text-[#87c695] font-mono">
                  Safaricom Daraja • Africa&apos;s Talking • PCPB • KEPHIS
                </div>
              </div>

              {/* Scrolling Partners Marquee with Real Media Logos */}
              <div className="overflow-hidden py-3">
                <div className="animate-logo-scroll flex items-center gap-10 opacity-90 hover:opacity-100 transition-opacity">
                  {[
                    { name: 'Kenya Livestock Producers Association (KLPA)', img: '/media/klpa_logo.png' },
                    { name: 'Oxfarm Organic Ltd', img: '/media/oxfarm_logo.png' },
                    { name: 'Farmers +254 Network', img: '/media/farmers254_logo.png' },
                    { name: 'Farm Expose Agritourism Kenya', img: '/media/farmexpose_logo.png' },
                    { name: 'Plant a Fruit Org', img: '/media/plantafruit_logo.png' },
                    { name: 'Seed Farm Kenya', img: '/media/seedfarm.jpg' },
                    { name: 'Yielder Agribusiness', img: '/media/yielder.png' },
                    { name: 'Kenya Livestock Producers Association (KLPA)', img: '/media/klpa_logo.png' },
                    { name: 'Oxfarm Organic Ltd', img: '/media/oxfarm_logo.png' },
                    { name: 'Farmers +254 Network', img: '/media/farmers254_logo.png' },
                    { name: 'Farm Expose Agritourism Kenya', img: '/media/farmexpose_logo.png' },
                    { name: 'Plant a Fruit Org', img: '/media/plantafruit_logo.png' },
                  ].map((partner, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl shrink-0 backdrop-blur-xs">
                      <img
                        src={partner.img}
                        alt={partner.name}
                        className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                      />
                      <span className="text-xs font-semibold text-gray-200">{partner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ABOUT US TAB */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 border border-[#dae2fd] shadow-lg space-y-6 animate-fade-in">
            <div className="border-b pb-4 space-y-1">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#131b2e]">About AgroFlow</h2>
              <p className="text-xs text-gray-500">Modernizing Agribusiness &amp; Agrovets in Kirinyaga County, Kenya</p>
            </div>

            <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>AgroFlow</strong> is an enterprise agribusiness operating system designed specifically for small and medium-sized agrovet retailers in Kirinyaga County and across Kenya.
              </p>
              
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 transition-all duration-300 hover:shadow-xs">
                <h3 className="font-playfair font-bold text-[#003b1b] text-base">Our Mission</h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Agrovets are the financial and operational backbone of smallholder agriculture. Historically, agrovet owners and shop cashiers relied on physical debt notebooks, paper receipts, manual calculators, and WhatsApp messages to run multi-million KES operations. AgroFlow replaces these prone-to-loss manual systems with an automated, secure digital platform.
                </p>
              </div>

              {/* Comparison Matrix: Paper Notebooks vs AgroFlow */}
              <div className="space-y-3 pt-2">
                <h3 className="font-playfair font-bold text-[#131b2e] text-xl">Traditional Paper Ledgers vs. AgroFlow OS</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                      <tr>
                        <th className="p-3">Operational Area</th>
                        <th className="p-3 text-red-700">Traditional Paper System</th>
                        <th className="p-3 text-[#003b1b] bg-emerald-50/50">AgroFlow Operating System</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-semibold text-gray-800">Smallholder Debt Tracking</td>
                        <td className="p-3 text-red-600">Physical paper book easily lost, stained, or disputed</td>
                        <td className="p-3 text-emerald-900 font-medium bg-emerald-50/30">SQLite digital ledger, credit limits, automated SMS reminders</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-semibold text-gray-800">Product Expiry Control</td>
                        <td className="p-3 text-red-600">Manual bottle checks, high chemical expiration losses</td>
                        <td className="p-3 text-emerald-900 font-medium bg-emerald-50/30">FEFO batch tracking with 30-day early warning alerts</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-semibold text-gray-800">End-of-Shift Reconciliation</td>
                        <td className="p-3 text-red-600">Manual counting with frequent unexplained drawer shortages</td>
                        <td className="p-3 text-emerald-900 font-medium bg-emerald-50/30">Banknote denomination tally matched to sales with Manager PIN</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-semibold text-gray-800">Farmer Accounts &amp; Customer KYC</td>
                        <td className="p-3 text-red-600">Verbal notes forgotten at counter checkout</td>
                        <td className="p-3 text-emerald-900 font-medium bg-emerald-50/30">One-click push from farmer prescription records straight into POS cart</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Visual Agricultural Heritage & Field Impact Showcase */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                  <img
                    src="/media/cabbage.jpg"
                    alt="Smallholder Farmers in Kenya"
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#87c695]">Grassroots Impact</span>
                    <h4 className="font-playfair font-bold text-base">Smallholder Food Security &amp; Crop Yields</h4>
                    <p className="text-[11px] text-gray-200 leading-snug mt-0.5">Directly supporting 1,400+ agrovets that dispense inputs to over 28,000 farmers.</p>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                  <img
                    src="/media/cows.jpg"
                    alt="Agricultural Agrovets in Kenya"
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#87c695]">Enterprise Technology</span>
                    <h4 className="font-playfair font-bold text-base">Kirinyaga Agri-Operating Infrastructure</h4>
                    <p className="text-[11px] text-gray-200 leading-snug mt-0.5">Eliminating drawer shortages and expired inventory with automated SQLite ledgers.</p>
                  </div>
                </div>
              </div>

              {/* Our Leadership & Input Operations Team */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <h3 className="font-playfair font-bold text-[#131b2e] text-xl">Operational Leadership Team</h3>
                  <p className="text-xs text-gray-500">Combining deep agricultural expertise with enterprise software engineering in Kenya</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'John Kiruthi',
                      role: 'Lead Systems Architect & Co-Founder',
                      spec: 'Agri-Tech & Distributed Systems',
                      bio: 'Over a decade designing high-throughput transaction pipelines and offline-first databases for retail networks.',
                      img: '/media/farmer.jpg',
                    },
                    {
                      name: 'Millicent Wangui',
                      role: 'Head of Agrovet Operations',
                      spec: 'Input Distribution & Credit Recovery',
                      bio: 'Experienced manager in fertility enhancement, farm chemicals, and smallholder cooperative check-off agreements.',
                      img: '/media/fruit.jpg',
                    },
                    {
                      name: 'Virginia Wangari',
                      role: 'PCPB & Agrochemical Compliance Officer',
                      spec: 'Regulatory & Safe Dispensary',
                      bio: 'Agronomist ensuring FEFO dispensing, active ingredient safety, and KEPHIS certified seed batch traceability.',
                      img: '/media/seedfarm.jpg',
                    },
                  ].map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white"
                    >
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-16 h-16 rounded-xl object-cover border border-emerald-300 shadow-xs"
                      />
                      <div>
                        <h4 className="font-playfair font-bold text-sm text-[#003b1b]">{member.name}</h4>
                        <div className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wide">{member.role}</div>
                        <div className="text-[10px] text-gray-400">{member.spec}</div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <h3 className="font-playfair font-bold text-[#131b2e] text-xl mb-2">Core Operational Principles</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs">
                    <div className="font-playfair font-bold text-[#003b1b] text-base">1. Localized First</div>
                    <p className="text-xs text-gray-600 leading-relaxed">Built for Kenyan agrovet operations: M-Pesa channels, KES currency, and local crop cycles.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs">
                    <div className="font-playfair font-bold text-[#003b1b] text-base">2. Offline Resilience</div>
                    <p className="text-xs text-gray-600 leading-relaxed">Local SQLite database ensures counters stay operational during rural connectivity dips.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs">
                    <div className="font-playfair font-bold text-[#003b1b] text-base">3. Strict Audit Integrity</div>
                    <p className="text-xs text-gray-600 leading-relaxed">Manager PIN authorizations for credit overrides, shift locks, and stock write-offs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ABOUT SYSTEM TAB */}
        {activeTab === 'system' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 border border-[#dae2fd] shadow-lg space-y-6">
              <div className="border-b pb-4 space-y-1">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#131b2e]">System Architecture &amp; Modules</h2>
                <p className="text-xs text-gray-500">Click any of the 6 operational pillars to inspect its data flow and capabilities</p>
              </div>

              {/* Interactive Module Grid */}
              <div className="grid md:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    id: 'pos',
                    title: '1. POS Counter & Checkout',
                    icon: 'point_of_sale',
                    desc: 'High-speed counter checkout with keyboard shortcut F2 and split payment.',
                  },
                  {
                    id: 'credit',
                    title: '2. Smallholder Credit Book',
                    icon: 'account_balance_wallet',
                    desc: 'Farmer debt ledger, cooperative numbers, credit caps, and SMS alerts.',
                  },
                  {
                    id: 'inventory',
                    title: '3. Inventory & Expiry Monitor',
                    icon: 'inventory_2',
                    desc: 'Batch tracking, active ingredients, PCPB numbers, and FEFO alerts.',
                  },
                  {
                    id: 'shift',
                    title: '4. Shift Register & Z-Report',
                    icon: 'receipt_long',
                    desc: 'Currency denomination tally, drawer audit, and Manager PIN locking.',
                  },
                  {
                    id: 'farmers',
                    title: '5. Farmers & Customer Directory',
                    icon: 'agriculture',
                    desc: 'Smallholder profiles, credit limits, and 1-click input allocation to POS.',
                  },
                  {
                    id: 'suppliers',
                    title: '6. Suppliers & Inward GRN',
                    icon: 'local_shipping',
                    desc: 'Delivery note verification, shortfall flagging, and stock committing.',
                  },
                ].map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => setSelectedSystemModule(mod.id as any)}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer space-y-2 transform ${
                      selectedSystemModule === mod.id
                        ? 'bg-emerald-50/70 border-[#003b1b] shadow-sm ring-2 ring-[#003b1b]/10 -translate-y-0.5'
                        : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-playfair font-bold text-sm text-[#003b1b] flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">{mod.icon}</span>
                      {mod.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{mod.desc}</p>
                  </div>
                ))}
              </div>

              {/* Module Deep-Dive Inspection Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 text-xs animate-fade-in">
                <div className="font-playfair font-bold text-base text-[#003b1b] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">info</span>
                  {selectedSystemModule === 'pos' && 'Module Deep-Dive: Fast POS Counter & Split Payments'}
                  {selectedSystemModule === 'credit' && 'Module Deep-Dive: Smallholder Credit & Debt Book'}
                  {selectedSystemModule === 'inventory' && 'Module Deep-Dive: Inventory, Batches & Expiry Monitor'}
                  {selectedSystemModule === 'shift' && 'Module Deep-Dive: Shift Register Daily Close & Z-Report'}
                  {selectedSystemModule === 'farmers' && 'Module Deep-Dive: Farmer Accounts & Field Records'}
                  {selectedSystemModule === 'suppliers' && 'Module Deep-Dive: Suppliers, Purchase Orders & GRN Verification'}
                </div>

                <div className="grid sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1 transition-all duration-200 hover:shadow-xs">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Input Data</div>
                    <div className="text-gray-800 font-medium leading-relaxed">
                      {selectedSystemModule === 'pos' && 'Barcode / SKU scan, Farmer ID, Tender Split (Cash/M-Pesa/Credit)'}
                      {selectedSystemModule === 'credit' && 'Farmer KYC, cooperative ID, maximum credit ceiling, repayment reference'}
                      {selectedSystemModule === 'inventory' && 'Supplier batch number, PCPB registration code, expiration date, pack size'}
                      {selectedSystemModule === 'shift' && 'Banknote counts (KES 1000 down to KES 20), float baseline, Manager PIN'}
                      {selectedSystemModule === 'farmers' && 'Farmer location block, National ID, crops grown, cooperative affiliation'}
                      {selectedSystemModule === 'suppliers' && 'Supplier delivery note, purchase order number, physical received count'}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1 transition-all duration-200 hover:shadow-xs">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Processing Logic</div>
                    <div className="text-gray-800 font-medium leading-relaxed">
                      {selectedSystemModule === 'pos' && 'Instant cart tally, stock deduction check, credit balance cap validation'}
                      {selectedSystemModule === 'credit' && 'Aging analysis (current, 30d, 60d, overdue), Africa’s Talking SMS dispatcher'}
                      {selectedSystemModule === 'inventory' && 'FEFO ranking algorithm, 30-day shelf-life countdown, minimum reorder trigger'}
                      {selectedSystemModule === 'shift' && 'Discrepancy math against digital journal, audit log recording, register lock'}
                      {selectedSystemModule === 'farmers' && 'Crop parcel profile matching, recommended inputs compilation into POS format'}
                      {selectedSystemModule === 'suppliers' && 'Discrepancy shortfall calculation, Accounts Payable ledger adjustment'}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1 transition-all duration-200 hover:shadow-xs">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Output / Result</div>
                    <div className="text-gray-800 font-medium leading-relaxed">
                      {selectedSystemModule === 'pos' && 'Printed receipt, SMS sale confirmation, real-time inventory decrement'}
                      {selectedSystemModule === 'credit' && 'Farmer debt statement, SMS receipt upon repayment, collection recovery'}
                      {selectedSystemModule === 'inventory' && 'Stock valuation report, expiry risk dashboard flags, reorder alerts'}
                      {selectedSystemModule === 'shift' && 'Immutable Z-Report snapshot, cashier clearance certificate, audit trail'}
                      {selectedSystemModule === 'farmers' && 'Inputs loaded directly into POS cart with 1 click for checkout'}
                      {selectedSystemModule === 'suppliers' && 'Verified stock committed into active store inventory ledger'}
                    </div>
                  </div>
                </div>
              </div>

              {/* End-to-End Agri-Supply Chain Architecture Pipeline */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-playfair font-bold text-xl text-[#131b2e]">End-to-End Value Chain Flow</h3>
                    <p className="text-xs text-gray-500">From supplier dock to smallholder harvest settlement</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#003b1b] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="material-symbols-outlined text-sm">security</span>
                    <span>100% PCPB &amp; KEPHIS Validated</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 relative group hover:bg-white hover:shadow-md transition-all">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="font-playfair font-bold text-sm text-[#003b1b]">Inward Goods Receipt</div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">
                      Supplier deliveries are inspected against PO quantities. Batch numbers, pack sizes, and shelf lives are recorded.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 relative group hover:bg-white hover:shadow-md transition-all">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="font-playfair font-bold text-sm text-[#003b1b]">FEFO Stock Allocator</div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">
                      Older chemical and seed batches are prioritized for dispensing. Expiry flags activate 30 days ahead of cutoff.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 relative group hover:bg-white hover:shadow-md transition-all">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="font-playfair font-bold text-sm text-[#003b1b]">Counter POS &amp; Credit</div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">
                      Sales are tendered via Cash, M-Pesa STK push, or Smallholder Credit with real-time balance enforcement.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 relative group hover:bg-white hover:shadow-md transition-all">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      4
                    </div>
                    <div className="font-playfair font-bold text-sm text-[#003b1b]">Reconciliation &amp; Backup</div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">
                      Daily cash drawer matched with Manager PIN. SQLite records synced to cloud backup for zero transaction loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. SYSTEM GUIDE TAB */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 border border-[#dae2fd] shadow-lg space-y-6 animate-fade-in">
            <div className="border-b pb-4 space-y-1">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#131b2e]">AgroFlow System User Manual &amp; Guide</h2>
              <p className="text-xs text-gray-500">Step-by-step operational workflows for Agrovet Personnel</p>
            </div>

            <div className="space-y-6 text-xs text-gray-700">
              {/* Interactive Keyboard Shortcut Tester */}
              <div className="p-4 bg-[#eaedff] border border-[#dae2fd] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair font-bold text-[#003b1b] text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">keyboard</span>
                    Global Keyboard Shortcut Tester
                  </h3>
                  <span className="text-[11px] text-gray-500">Press keys on your keyboard or click below</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <button
                    onClick={() => setPressedKey('F2')}
                    className={`p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer transform ${
                      pressedKey === 'F2'
                        ? 'bg-[#003b1b] text-white border-[#003b1b] shadow-md ring-2 ring-[#003b1b]/20 scale-[1.03]'
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:scale-[1.01]'
                    }`}
                  >
                    <strong className={pressedKey === 'F2' ? 'text-[#b1f2be]' : 'text-[#003b1b]'}>F2</strong>
                    <div className="text-[10px] mt-0.5">Quick POS Sale</div>
                  </button>

                  <button
                    onClick={() => setPressedKey('F1')}
                    className={`p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer transform ${
                      pressedKey === 'F1'
                        ? 'bg-[#003b1b] text-white border-[#003b1b] shadow-md ring-2 ring-[#003b1b]/20 scale-[1.03]'
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:scale-[1.01]'
                    }`}
                  >
                    <strong className={pressedKey === 'F1' ? 'text-[#b1f2be]' : 'text-[#003b1b]'}>F1</strong>
                    <div className="text-[10px] mt-0.5">Clear Cart</div>
                  </button>

                  <button
                    onClick={() => setPressedKey('F3')}
                    className={`p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer transform ${
                      pressedKey === 'F3'
                        ? 'bg-[#003b1b] text-white border-[#003b1b] shadow-md ring-2 ring-[#003b1b]/20 scale-[1.03]'
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:scale-[1.01]'
                    }`}
                  >
                    <strong className={pressedKey === 'F3' ? 'text-[#b1f2be]' : 'text-[#003b1b]'}>F3</strong>
                    <div className="text-[10px] mt-0.5">Focus Search</div>
                  </button>

                  <button
                    onClick={() => setPressedKey('F4')}
                    className={`p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer transform ${
                      pressedKey === 'F4'
                        ? 'bg-[#003b1b] text-white border-[#003b1b] shadow-md ring-2 ring-[#003b1b]/20 scale-[1.03]'
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:scale-[1.01]'
                    }`}
                  >
                    <strong className={pressedKey === 'F4' ? 'text-[#b1f2be]' : 'text-[#003b1b]'}>F4</strong>
                    <div className="text-[10px] mt-0.5">Open Farmers</div>
                  </button>
                </div>

                {pressedKey && (
                  <div className="p-2.5 bg-white border border-emerald-300 rounded-lg text-emerald-950 font-medium text-[11px] flex items-center justify-between animate-fade-in">
                    <span>
                      Key <strong>[{pressedKey}]</strong> activated: {
                        pressedKey === 'F2' ? 'Launches POS Sale Counter immediately from any screen.' :
                        pressedKey === 'F1' ? 'Clears all items in current ticket cart with 1 keystroke.' :
                        pressedKey === 'F3' ? 'Focuses top search input for barcode scanning or SKU lookup.' :
                        'Navigates straight to Farmers & Customer Directory.'
                      }
                    </span>
                    <button
                      onClick={() => setPressedKey(null)}
                      className="text-gray-400 hover:text-gray-700 text-xs ml-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Role-Based Workflow Tabs (Cashier & Manager) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair font-bold text-base text-[#131b2e]">Role-Based Operational Guide</h3>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {(['cashier', 'manager'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRole(r)}
                        className={`px-3 py-1 rounded-md capitalize font-semibold transition-all duration-200 cursor-pointer ${
                          selectedRole === r
                            ? 'bg-white text-[#003b1b] shadow-xs'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedRole === 'cashier' && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 animate-fade-in">
                    <div className="font-playfair font-bold text-[#003b1b] text-base flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">point_of_sale</span>
                      Cashier Workflow (Shop Attendants)
                    </div>
                    <ul className="space-y-2 text-gray-600 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-[#003b1b]">1.</span>
                        <span>Press <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800">F2</code> to launch the POS counter at start of customer transaction.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-[#003b1b]">2.</span>
                        <span>Scan barcodes or use <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800">F3</code> to search products by brand or active ingredient.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-[#003b1b]">3.</span>
                        <span>Select payment method: Cash, M-Pesa phone prompt, or Farmer Credit book (if approved).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-[#003b1b]">4.</span>
                        <span>At end of shift, navigate to <strong>Shift Close</strong>, count physical drawer cash, and request manager PIN verification.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {selectedRole === 'manager' && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 animate-fade-in">
                    <div className="font-playfair font-bold text-[#003b1b] text-base flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                      Manager Workflow (Owners &amp; Administrators)
                    </div>
                    <ul className="space-y-2 text-gray-600 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-[#003b1b]">1.</span>
                        <span>Verify supplier inward dispatches in <strong>Suppliers &amp; GRN</strong> and commit verified stock into active inventory.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-[#003b1b]">2.</span>
                        <span>Review <strong>Credit Ledger</strong> aging, approve credit limit extensions, and trigger Africa's Talking bulk SMS reminders.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-[#003b1b]">3.</span>
                        <span>Input Manager PIN to authorize shift close reconciliation and lock register daily totals.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-[#003b1b]">4.</span>
                        <span>Access <strong>Platform Cockpit</strong> from sidebar to manage personnel credentials and export SQLite backups.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Hardware & Peripherals Setup Guide */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <h3 className="font-playfair font-bold text-base text-[#131b2e]">Hardware &amp; Counter Peripherals Integration</h3>
                  <p className="text-[11px] text-gray-500">Plug-and-play setup for standard agrovet counter equipment</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-sm">barcode_scanner</span>
                    </div>
                    <div className="font-playfair font-bold text-xs text-[#003b1b]">USB / Bluetooth Barcode Scanners</div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Works natively with standard HID keyboard-emulation scanners. Direct autofocus for instant cart additions.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-sm">print</span>
                    </div>
                    <div className="font-playfair font-bold text-xs text-[#003b1b]">58mm / 80mm Thermal Printers</div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Standard ESC/POS and browser printing supported for receipt generation with tax PIN, store till, and batch info.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-sm">scale</span>
                    </div>
                    <div className="font-playfair font-bold text-xs text-[#003b1b]">Weighing Scales &amp; Bulk Fertilizer</div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Fractional unit entry for repackaged DAP/CAN fertilizers, animal mineral salts, and bulk seed scoops.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expandable Operational FAQ Accordion */}
              <div className="space-y-3 pt-2">
                <h3 className="font-playfair font-bold text-base text-[#131b2e]">Frequently Asked Operational Questions</h3>
                <div className="space-y-2">
                  {[
                    {
                      q: 'What happens if the internet connection drops during a sale?',
                      a: 'AgroFlow runs on a local SQLite database engine. You can continue scanning barcodes, completing cash sales, and checking stock offline. When connectivity resumes, cloud synchronization and SMS dispatches queue automatically.',
                    },
                    {
                      q: 'How are farmer credit limits enforced at POS counter?',
                      a: 'When Credit is selected at checkout, AgroFlow checks the farmer’s outstanding balance against their authorized ceiling. If the total exceeds the limit, cashier cannot proceed without manager authorization.',
                    },
                    {
                      q: 'How does Africa’s Talking SMS reminder dispatch work?',
                      a: 'In the Credit Ledger screen, clicking Send SMS Reminder queues an SMS message containing the farmer’s name, outstanding balance in KES, and agrovet till details directly to their registered Safaricom/Airtel phone number.',
                    },
                  ].map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden transition-colors">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full p-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left font-bold text-gray-800 transition-all cursor-pointer"
                      >
                        <span className="font-playfair text-sm">{faq.q}</span>
                        <span className={`material-symbols-outlined text-base text-gray-400 transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}>
                          expand_more
                        </span>
                      </button>
                      {openFaq === idx && (
                        <div className="p-3 bg-white text-gray-600 leading-relaxed border-t border-gray-200 animate-fade-in text-xs">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. LOGIN TAB */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 md:p-8 border border-[#dae2fd] shadow-xl space-y-6 animate-fade-in">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-[#003b1b] text-[#b1f2be] rounded-xl mx-auto flex items-center justify-center font-bold text-2xl shadow-md">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <h2 className="font-playfair font-bold text-2xl text-[#131b2e] tracking-tight">Personnel Sign In</h2>
              <p className="text-xs text-gray-500">Enter your credentials to access the AgroFlow terminal.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 font-semibold flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Username / Personnel ID</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">person</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="e.g. john.mwangi"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003b1b] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">key</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003b1b] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Quick Credentials Switcher (Manager & Cashier Only) */}
              <div className="pt-2">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">Quick Sign-in Credentials:</div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setPreset('john.mwangi', 'admin123')}
                    className="p-2 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 hover:bg-emerald-100 font-bold transition-all text-center cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="font-playfair font-bold text-xs">Manager</div>
                    <div className="text-[9px] text-emerald-700 font-normal font-mono">john.mwangi</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreset('faith.wanjiru', 'admin123')}
                    className="p-2 bg-blue-50 text-blue-900 rounded-lg border border-blue-200 hover:bg-blue-100 font-bold transition-all text-center cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="font-playfair font-bold text-xs">Cashier</div>
                    <div className="text-[9px] text-blue-700 font-normal font-mono">faith.wanjiru</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#003b1b] text-[#b1f2be] hover:bg-[#14532d] font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">login</span>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#002b13] text-[#87c695] text-xs py-5 border-t border-[#14532d]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AgroFlow Agribusiness Operating System © 2026. Engineered for Agrovets in Kirinyaga &amp; Kenya.</span>
          </div>
          <div className="flex flex-wrap items-center gap-3.5 text-[11px] text-[#87c695]/90">
            <a href="/legal" className="hover:text-white font-semibold transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">gavel</span>
              <span>Legal Hub</span>
            </a>
            <span className="text-[#14532d]">•</span>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span className="text-[#14532d]">•</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy (KDPA)</a>
            <span className="text-[#14532d]">•</span>
            <a href="/credit-policy" className="hover:text-white transition-colors">Fair Credit Policy</a>
            <span className="text-[#14532d]">•</span>
            <a href="/regulatory" className="hover:text-white transition-colors">PCPB &amp; KEPHIS</a>
          </div>
        </div>
      </footer>

      {/* Video Demonstration Modal (Borrowed from Video CTA) */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#002b13] border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="font-playfair font-bold text-lg text-white">AgroFlow In-Store Terminal Demonstration</h3>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Video Player / Walkthrough Mock */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-emerald-900 shadow-inner flex flex-col items-center justify-center text-center p-6 space-y-3">
              <img
                src="/media/farmer.jpg"
                alt="AgroFlow Demo"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#11bf36] text-white flex items-center justify-center mx-auto box-shadow-ripples">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h4 className="font-playfair font-bold text-xl text-white">3-Second Counter POS Checkout &amp; SMS Repayment</h4>
                <p className="text-xs text-[#87c695] max-w-md mx-auto">
                  Watch how Kirinyaga cashiers use keyboard shortcuts (F2) to ring sales, split cash/M-Pesa tender, and balance drawers with zero discrepancy.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsVideoModalOpen(false);
                      setActiveTab('login');
                    }}
                    className="px-5 py-2.5 bg-[#11bf36] text-white font-bold text-xs rounded-xl shadow-lg hover:bg-[#0ea82f] transition-all cursor-pointer"
                  >
                    Launch Live Terminal Now
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#87c695]/80 text-center">
              Demonstration video recorded at Kerugoya Central Agrovet Hub. Audio &amp; terminal simulation active.
            </div>
          </div>
        </div>
      )}

      {/* Floating Back to Top / Quick Terminal Launcher */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to Top"
        className="fixed bottom-6 right-6 z-40 bg-[#003b1b] text-[#b1f2be] hover:bg-[#14532d] hover:text-white p-3 rounded-2xl shadow-xl border border-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-lg">arrow_upward</span>
      </button>
    </div>
  );
};
