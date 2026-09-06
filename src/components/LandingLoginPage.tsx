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

  // Hero Banner Slider (inspired by dynamic agricultural portals)
  const bannerSlides = [
    {
      title: 'Connecting Agrovets to Kenya\'s Modern Agricultural Value Chain',
      subtitle: 'Award-winning digital infrastructure powering over 1,400 agribusiness dispensaries and agro-dealers across Kirinyaga and Mount Kenya.',
      badge: 'Kirinyaga Agribusiness Operating System',
      image: 'https://farmerstrend.com/wp-content/uploads/2022/07/SLIDER-1.jpg',
      tagline: 'FEFO Batch Control • Instant M-Pesa STK • Digital Credit Ledgers',
      ctaPrimary: 'Sign In to POS Counter',
      ctaSecondary: 'Explore System Modules',
    },
    {
      title: 'Precision Crop Protection & High-Yield Farm Advisory',
      subtitle: 'Ensure 100% PCPB-compliant agrochemical dispensation, active ingredient tank mixing ratios, and certified seed lot tracking.',
      badge: 'PCPB & KEPHIS Certified Dispensary',
      image: 'https://farmerstrend.com/wp-content/uploads/2022/07/20-july_tomato-nervous-system.webp',
      tagline: 'Zero Expired Inventory • Barcode Verification • Safe Dispensary',
      ctaPrimary: 'Launch Cashier Terminal',
      ctaSecondary: 'View Operational Guide',
    },
    {
      title: 'Dairy, Livestock & Agro-Vet Health Management',
      subtitle: 'Complete clinical dispensation records, veterinary drug tracking, and tripartite cooperative milk check-off credit guarantees.',
      badge: 'Livestock & Veterinary Records',
      image: 'https://farmerstrend.com/wp-content/uploads/2022/07/Cow-Wallpaper-31-1280x800-1.jpg',
      tagline: 'Cooperative Check-Off • Vet Advisory • Instant Ledger Balancing',
      ctaPrimary: 'Sign In to Terminal',
      ctaSecondary: 'Read Success Stories',
    },
  ];
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);

  // Video Modal State for In-Store Demo
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Interactive States for Static Pages
  // 1. Home tab state: Feature Carousel
  const featureList: ('pos' | 'credit' | 'expiry' | 'shift')[] = ['pos', 'credit', 'expiry', 'shift'];
  const [homeFeature, setHomeFeature] = useState<'pos' | 'credit' | 'expiry' | 'shift'>('pos');
  const [creditSliderVal, setCreditSliderVal] = useState(350000);
  const [isFeaturePaused, setIsFeaturePaused] = useState(false);

  // 2. Testimonials Carousel state (Enhanced with real Kenyan agricultural reviewers)
  const testimonials = [
    {
      store: 'Kirinyaga Agrovet Central',
      location: 'Kerugoya Town, Kirinyaga',
      manager: 'Samuel Maina • Managing Director',
      photo: 'https://farmerstrend.com/wp-content/uploads/2022/07/WINNERS.jpg',
      quote: 'Before AgroFlow, paper credit notebooks always had missing pages and disputes at the end of harvest. Now with automated M-Pesa tracking and SMS debt reminders, our debt collection jumped by 80%.',
      stat: 'KES 240,000 Recovered',
      category: 'Commercial Agrovet',
    },
    {
      store: 'Mwea Farm Supplies & Depot',
      location: 'Wang’uru / Mwea Rice Belt',
      manager: 'Beatrice Njeri • Shop Supervisor',
      photo: 'https://farmerstrend.com/wp-content/uploads/2022/07/SLIDER-1.jpg',
      quote: 'During peak fertilizer distribution, lines used to stretch out the door. The F2 counter hotkey and barcode scanner cut ticket checkout time to under 3 seconds per farmer.',
      stat: '4x Faster Counter Checkout',
      category: 'Rice & Cereals Depot',
    },
    {
      store: 'Mount Kenya Agro-Chemicals',
      location: 'Kutus Junction, Kirinyaga',
      manager: 'David Karani • Lead Cashier',
      photo: 'https://farmerstrend.com/wp-content/uploads/2022/07/youths-in-agriculture-farmers-trend-kenya.jpg',
      quote: 'The shift close banknote counter makes drawer balancing effortless. We haven’t had a single unexplained cash shortage since the Manager PIN lock was implemented.',
      stat: '0 KES Shift Discrepancy',
      category: 'Input Dispensary',
    },
    {
      store: 'Pokea Dairy Cooperative Input Centre',
      location: 'Kangari / Murang’a North Hub',
      manager: 'Timothy Sila • Veterinary Officer',
      photo: 'https://farmerstrend.com/wp-content/uploads/2022/07/Cow-Wallpaper-31-1280x800-1-150x150.jpg',
      quote: 'Managing veterinary medicines and dairy meal credit against farmer milk deliveries used to take three clerks two full days. With AgroFlow check-off ledgers, balancing takes under ten minutes.',
      stat: '98% Ledger Accuracy',
      category: 'Co-op Dairy Hub',
    },
    {
      store: 'Highland Horti-Care Agrovets',
      location: 'Karatina Central Market',
      manager: 'Waweru Mwangi • Onion & Tomato Specialist',
      photo: 'https://farmerstrend.com/wp-content/uploads/2022/07/On-150x150.jpg',
      quote: 'The FEFO batch alerts saved our store over KES 180,000 in fungicides that would have expired on the top shelf. The system warned us 30 days before maturity so we prioritized those lots first.',
      stat: 'Zero Chemical Spoilage',
      category: 'Horticulture Input',
    },
  ];
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);

  // 3. System tab state
  const [selectedSystemModule, setSelectedSystemModule] = useState<
    'pos' | 'credit' | 'inventory' | 'shift' | 'farmers' | 'suppliers'
  >('pos');

  // 4. Guide tab state
  const [selectedRole, setSelectedRole] = useState<'cashier' | 'manager'>('cashier');
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auto-advance Hero Banner Slider every 6.5 seconds
  useEffect(() => {
    if (activeTab !== 'home' || isBannerPaused) return;
    const timer = setInterval(() => {
      setActiveBannerSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeTab, isBannerPaused, bannerSlides.length]);

  // Auto-advance Home Feature Carousel every 6 seconds
  useEffect(() => {
    if (activeTab !== 'home' || isFeaturePaused) return;
    const timer = setInterval(() => {
      setHomeFeature((prev) => {
        const nextIdx = (featureList.indexOf(prev) + 1) % featureList.length;
        return featureList[nextIdx];
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [activeTab, isFeaturePaused]);

  // Auto-advance Testimonials Carousel every 7 seconds
  useEffect(() => {
    if (activeTab !== 'home' || isTestimonialPaused) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeTab, isTestimonialPaused, testimonials.length]);

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

  const handleNextFeature = () => {
    const nextIdx = (featureList.indexOf(homeFeature) + 1) % featureList.length;
    setHomeFeature(featureList[nextIdx]);
  };

  const handlePrevFeature = () => {
    const prevIdx = (featureList.indexOf(homeFeature) - 1 + featureList.length) % featureList.length;
    setHomeFeature(featureList[prevIdx]);
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
          <div className="space-y-12 py-2 animate-fade-in">
            {/* Dynamic Banner Carousel (inspired by high-impact Kenyan agri portals) */}
            <div
              className="relative overflow-hidden rounded-3xl shadow-xl border border-[#dae2fd] text-white min-h-[420px] md:min-h-[460px] flex flex-col justify-end transition-all duration-500"
              onMouseEnter={() => setIsBannerPaused(true)}
              onMouseLeave={() => setIsBannerPaused(false)}
            >
              {/* Background Image Layer with Zoom & Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out transform scale-105"
                style={{ backgroundImage: `url(${bannerSlides[activeBannerSlide].image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00210d] via-[#003b1b]/80 to-black/30" />

              {/* Top Banner Category Badge & Slide Count */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-[#003b1b]/90 border border-emerald-400/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#b1f2be] shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{bannerSlides[activeBannerSlide].badge}</span>
                </div>

                {/* Banner Slide Progress Indicators & Navigation */}
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <button
                    onClick={() => setActiveBannerSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
                    aria-label="Previous Slide"
                    className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <div className="flex items-center gap-1.5 px-1">
                    {bannerSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveBannerSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          activeBannerSlide === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveBannerSlide((prev) => (prev + 1) % bannerSlides.length)}
                    aria-label="Next Slide"
                    className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Banner Center Content */}
              <div className="relative z-10 p-6 md:p-12 max-w-3xl space-y-4 animate-fade-in" key={activeBannerSlide}>
                <div className="text-xs uppercase font-bold tracking-wider text-[#87c695] flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>{bannerSlides[activeBannerSlide].tagline}</span>
                </div>

                <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-md">
                  {bannerSlides[activeBannerSlide].title}
                </h1>

                <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl drop-shadow-sm font-normal">
                  {bannerSlides[activeBannerSlide].subtitle}
                </p>

                {/* Banner Buttons & Video Modal Trigger */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('login')}
                    className="px-6 py-3.5 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="material-symbols-outlined text-base">login</span>
                    <span>{bannerSlides[activeBannerSlide].ctaPrimary}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('system')}
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <span>{bannerSlides[activeBannerSlide].ctaSecondary}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>

                  {/* Pulsing Video Demonstration Trigger */}
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="px-4 py-3 bg-black/40 hover:bg-black/60 border border-emerald-400/40 text-[#b1f2be] font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer ml-auto"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#11bf36] text-white flex items-center justify-center box-shadow-ripples">
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                    </div>
                    <span className="hidden sm:inline">Watch Operating Tour</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top Hero Section with Playfair Typography & Rotating Headline */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12 pt-4">
              {/* Left Column: Hero Intro */}
              <div className="flex-1 space-y-6">
                <h2 className="hero-headline text-[#131b2e]">
                  Enterprise Operating System for <span className="text-[#003b1b] underline decoration-[#87c695] underline-offset-4 decoration-2">Agribusiness</span>{' '}
                  <span
                    className="block text-2xl md:text-3xl font-medium mt-3 italic text-[#003b1b] transition-all duration-300"
                    style={{
                      opacity: rotatingFade ? 1 : 0,
                      transform: rotatingFade ? 'translateY(0)' : 'translateY(8px)',
                    }}
                  >
                    Bringing {currentRotating.highlight} {currentRotating.suffix}
                  </span>
                </h2>

                <p className="text-base text-gray-600 max-w-xl leading-relaxed">
                  Replace paper notebooks, calculators, and fragmented spreadsheets. AgroFlow powers your counter sales, smallholder credit ledgers, batch tracking, and farmer accounts in real time.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('login')}
                    className="px-6 py-3.5 bg-[#003b1b] text-[#b1f2be] hover:bg-[#14532d] font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="material-symbols-outlined text-base">point_of_sale</span>
                    <span>Launch Cashier Terminal</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('guide')}
                    className="px-5 py-3.5 bg-white text-[#003b1b] border border-[#dae2fd] hover:bg-gray-50 font-bold text-xs rounded-xl shadow-xs transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    View User Manual &amp; Guide
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Feature Carousel Explorer */}
              <div
                className="w-full max-w-lg space-y-4"
                onMouseEnter={() => setIsFeaturePaused(true)}
                onMouseLeave={() => setIsFeaturePaused(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Interactive Feature Carousel
                  </div>
                  {/* Carousel Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevFeature}
                      aria-label="Previous Feature"
                      className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                      onClick={handleNextFeature}
                      aria-label="Next Feature"
                      className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* 4 Interactive Feature Selector Cards with Playfair Typography */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setHomeFeature('pos')}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2 transform ${
                      homeFeature === 'pos'
                        ? 'bg-white border-[#003b1b] shadow-md ring-2 ring-[#003b1b]/10 -translate-y-1'
                        : 'bg-white border-[#dae2fd] hover:border-gray-300 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-lg">point_of_sale</span>
                    </div>
                    <h3 className="font-playfair font-bold text-base text-[#131b2e]">Fast POS Counter</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">Instant counter sales with keyboard shortcuts (F2) & split tender.</p>
                  </div>

                  <div
                    onClick={() => setHomeFeature('credit')}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2 transform ${
                      homeFeature === 'credit'
                        ? 'bg-white border-[#003b1b] shadow-md ring-2 ring-[#003b1b]/10 -translate-y-1'
                        : 'bg-white border-[#dae2fd] hover:border-gray-300 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                    </div>
                    <h3 className="font-playfair font-bold text-base text-[#131b2e]">Smallholder Credit Book</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">Track farmer debts, credit limits, and automated SMS alerts.</p>
                  </div>

                  <div
                    onClick={() => setHomeFeature('expiry')}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2 transform ${
                      homeFeature === 'expiry'
                        ? 'bg-white border-[#003b1b] shadow-md ring-2 ring-[#003b1b]/10 -translate-y-1'
                        : 'bg-white border-[#dae2fd] hover:border-gray-300 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-lg">inventory_2</span>
                    </div>
                    <h3 className="font-playfair font-bold text-base text-[#131b2e]">Batch & Expiry Monitor</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">Track batch numbers, shelf-life risk alerts, and FEFO compliance.</p>
                  </div>

                  <div
                    onClick={() => setHomeFeature('shift')}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2 transform ${
                      homeFeature === 'shift'
                        ? 'bg-white border-[#003b1b] shadow-md ring-2 ring-[#003b1b]/10 -translate-y-1'
                        : 'bg-white border-[#dae2fd] hover:border-gray-300 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#003b1b] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-lg">receipt_long</span>
                    </div>
                    <h3 className="font-playfair font-bold text-base text-[#131b2e]">Shift Close & Z-Report</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">Physical drawer cash tally, manager PIN verification, and audit logs.</p>
                  </div>
                </div>

                {/* Animated Dynamic Preview Box */}
                <div className="bg-white border border-[#dae2fd] rounded-2xl p-5 shadow-sm space-y-3 transition-all duration-300 animate-fade-in">
                  {homeFeature === 'pos' && (
                    <div className="space-y-3 text-xs animate-fade-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="font-playfair font-bold text-sm text-[#003b1b] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live POS Checkout Demonstration
                        </span>
                        <span className="font-mono text-gray-400">Shortcut: F2</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl space-y-2 font-mono text-[11px]">
                        <div className="flex justify-between">
                          <span>2x DAP Fertilizer 50kg</span>
                          <span className="font-bold">KES 13,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1x Twiga Copper Fungicide 1kg</span>
                          <span className="font-bold">KES 1,200</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-1 text-[#003b1b] font-bold">
                          <span>Total Ticket (M-Pesa / Cash / Credit)</span>
                          <span>KES 14,200</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-[11px] leading-relaxed">
                        Reduces cashier checkout time to under 3 seconds per customer during morning farmer market hours.
                      </p>
                    </div>
                  )}

                  {homeFeature === 'credit' && (
                    <div className="space-y-3 text-xs animate-fade-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="font-playfair font-bold text-sm text-[#003b1b] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Interactive Credit Recovery Calculator
                        </span>
                        <span className="font-bold text-emerald-800 font-mono">KES {creditSliderVal.toLocaleString()}</span>
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">
                          Slide to adjust monthly farmer credit issued:
                        </label>
                        <input
                          type="range"
                          min={50000}
                          max={1000000}
                          step={25000}
                          value={creditSliderVal}
                          onChange={(e) => setCreditSliderVal(Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#003b1b]"
                        />
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-[11px]">
                        <div className="flex justify-between text-emerald-950 font-medium">
                          <span>Projected Default without Reminders (12%):</span>
                          <span className="font-bold text-red-600">KES {Math.round(creditSliderVal * 0.12).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[#003b1b] font-bold">
                          <span>Recovered via Automated SMS Reminders (85%):</span>
                          <span>+KES {Math.round(creditSliderVal * 0.12 * 0.85).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {homeFeature === 'expiry' && (
                    <div className="space-y-3 text-xs animate-fade-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="font-playfair font-bold text-sm text-[#003b1b] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          Live Expiry Monitor Simulation
                        </span>
                        <span className="text-amber-700 font-bold">FEFO Order</span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-[11px]">
                          <div>
                            <div className="font-bold text-amber-950">Twiga Copper 50 WP (Batch TC-901)</div>
                            <div className="text-amber-800">Expires in 18 days • 24 units remaining</div>
                          </div>
                          <span className="text-amber-900 font-bold">Prioritize</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-[11px]">
                          <div>
                            <div className="font-bold text-emerald-950">YaraMila Power (Batch YM-442)</div>
                            <div className="text-emerald-800">Expires in 290 days • 180 units</div>
                          </div>
                          <span className="text-emerald-900 font-bold">Optimal</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {homeFeature === 'shift' && (
                    <div className="space-y-3 text-xs animate-fade-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="font-playfair font-bold text-sm text-[#003b1b] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Shift Close Reconciliation
                        </span>
                        <span className="text-gray-400 font-mono">Manager PIN Locked</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 font-mono text-[11px]">
                        <div className="flex justify-between">
                          <span>Physical Cash Drawer Count:</span>
                          <span className="font-bold">KES 32,850</span>
                        </div>
                        <div className="flex justify-between">
                          <span>System Terminal Sales Ledger:</span>
                          <span className="font-bold">KES 32,850</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-1 text-emerald-800 font-bold">
                          <span>Discrepancy / Variance:</span>
                          <span>KES 0 (Balanced)</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-[11px]">
                        Dual-authorization prevents end-of-day register shortages before locking drawer.
                      </p>
                    </div>
                  )}

                  {/* Carousel Progress Indicators */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {featureList.map((f, i) => (
                      <button
                        key={f}
                        onClick={() => setHomeFeature(f)}
                        aria-label={`Go to feature ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          homeFeature === f ? 'w-6 bg-[#003b1b]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

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

            {/* Testimonials & Agrovet Reviews Carousel (Enhanced with photo & agrovet verification) */}
            <div
              className="bg-white rounded-3xl border border-[#dae2fd] p-6 md:p-8 shadow-sm space-y-6 transition-all duration-300"
              onMouseEnter={() => setIsTestimonialPaused(true)}
              onMouseLeave={() => setIsTestimonialPaused(false)}
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Agrovet Operator Reviews &amp; Experiences</span>
                  </div>
                  <div className="font-playfair font-bold text-xl text-[#131b2e]">
                    Trusted by Over 1,400 Agribusinesses &amp; Farms in Kenya
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevTestimonial}
                    aria-label="Previous story"
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  <button
                    onClick={handleNextTestimonial}
                    aria-label="Next story"
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Active Testimonial Slide with Photo, Quote & Verified Badge */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 animate-fade-in" key={testimonialIndex}>
                <div className="relative shrink-0">
                  <img
                    src={testimonials[testimonialIndex].photo}
                    alt={testimonials[testimonialIndex].manager}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
                  />
                  <span className="absolute -bottom-2 -right-2 bg-[#003b1b] text-[#b1f2be] p-1 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-sm">verified</span>
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  <blockquote className="font-playfair italic text-base md:text-lg text-gray-800 leading-relaxed">
                    &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
                  </blockquote>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                    <div>
                      <div className="font-playfair font-bold text-base text-[#003b1b] flex items-center gap-2">
                        <span>{testimonials[testimonialIndex].store}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-sans font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                          {testimonials[testimonialIndex].category}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {testimonials[testimonialIndex].manager} • {testimonials[testimonialIndex].location}
                      </div>
                    </div>
                    <div className="font-bold text-xs text-[#003b1b] bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto shadow-2xs">
                      {testimonials[testimonialIndex].stat}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial Indicator Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      testimonialIndex === i ? 'w-8 bg-[#003b1b]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

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

            {/* Trusted Institutional Partners & Cooperative Ticker */}
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

              {/* Scrolling Partners Marquee */}
              <div className="overflow-hidden py-3">
                <div className="animate-logo-scroll flex items-center gap-10 opacity-90 hover:opacity-100 transition-opacity">
                  {[
                    { name: 'Kenya Livestock Producers Association', img: 'https://farmerstrend.com/wp-content/uploads/2022/07/KLPA.jpg' },
                    { name: 'Safaricom M-Pesa Enterprise', img: 'https://farmerstrend.com/wp-content/uploads/2022/07/LOGO-HH.jpg' },
                    { name: 'Plant a Fruit Agri-Kenya', img: 'https://farmerstrend.com/wp-content/uploads/2022/07/plant-a-fruit.jpg' },
                    { name: 'Youth in Agribusiness Initiative', img: 'https://farmerstrend.com/wp-content/uploads/2022/07/SLIDER-1.jpg' },
                    { name: 'Kenya Livestock Producers Association', img: 'https://farmerstrend.com/wp-content/uploads/2022/07/KLPA.jpg' },
                    { name: 'Safaricom M-Pesa Enterprise', img: 'https://farmerstrend.com/wp-content/uploads/2022/07/LOGO-HH.jpg' },
                    { name: 'Plant a Fruit Agri-Kenya', img: 'https://farmerstrend.com/wp-content/uploads/2022/07/plant-a-fruit.jpg' },
                    { name: 'Youth in Agribusiness Initiative', img: 'https://farmerstrend.com/wp-content/uploads/2022/07/SLIDER-1.jpg' },
                  ].map((partner, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl shrink-0 backdrop-blur-xs">
                      <img
                        src={partner.img}
                        alt={partner.name}
                        className="w-8 h-8 rounded-lg object-cover bg-white p-0.5"
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
                src="https://farmerstrend.com/wp-content/uploads/2022/07/youths-in-agriculture-farmers-trend-kenya.jpg"
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
