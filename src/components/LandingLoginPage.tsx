import React, { useState, useEffect, useRef } from 'react';
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

  
  const [mousePos, setMousePos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  
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

  
  const caseStudyArticles = [
    {
      id: 'debt-recovery',
      title: 'How Kirinyaga Agrovets Recovered 98% of Smallholder Debt Without Confrontation',
      subtitle: 'Credit Recovery & Cash Flow Protection',
      category: 'Customer Debt Recovery',
      date: 'Updated 2026',
      readTime: '4 min read',
      author: 'Samuel Maina & AgroFlow Field Operations',
      image: '/media/farmer.jpg',
      statBadge: 'KES 240,000 Recovered',
      summary:
        'Why traditional paper notebooks leak up to 25% of working capital in Kirinyaga County, and how automated Africa’s Talking M-Pesa reminders with itemized receipts transform smallholder repayment rates.',
      content: [
        'Every agrovet owner in Mount Kenya knows the pain of harvest-time credit disputes: a farmer denies picking up 3 bags of Yara Mila Chapa Meli fertilizer, the page in the counter "daftari ya deni" is soiled or torn, and the store owner absorbs the loss.',
        'AgroFlow introduces dual-verification credit logs. When a smallholder takes inputs on book, their National ID, crop type, and authorized credit ceiling are validated on the POS counter in seconds. An automatic SMS is dispatched to their Safaricom phone confirming the exact line items and KES balance.',
        'At crop maturity or coffee/tea/rice payout, AgroFlow triggers polite, automated Africa’s Talking SMS reminders containing your agrovet’s M-Pesa Till or Paybill number and exact invoice reference. In a trial across 42 Kirinyaga and Mwea agrovets, debt recovery jumped from 68% to 98.2% within 90 days with zero heated arguments at the counter.',
      ],
      takeaways: [
        'Never rely on physical paper books that get misplaced, stained, or disputed.',
        'Give farmers formal SMS transaction confirmations right at the counter.',
        'Enable 1-tap M-Pesa Paybill repayments directly into your business till.',
      ],
      metrics: [
        { label: 'Debt Recovery Rate', value: '68% → 98.2%' },
        { label: 'Disputed Entries', value: '0 recorded' },
        { label: 'Avg Days to Settle', value: 'Cut by 19 days' },
      ],
    },
    {
      id: 'pcpb-compliance',
      title: 'Passing PCPB & KEPHIS Inspections: Why Paper Stock Ledgers Fail Spot Audits',
      subtitle: 'Regulatory Compliance & Stock Loss Prevention',
      category: 'Inventory & Expiry Control',
      date: 'Updated 2026',
      readTime: '5 min read',
      author: 'Virginia Wangari • Agrochemical Compliance Desk',
      image: '/media/seedfarm.jpg',
      statBadge: '100% Audit Pass Rate',
      summary:
        'Spot inspections by the Pest Control Products Board (PCPB) and KEPHIS can lead to immediate stock confiscation and heavy fines. Here is how FEFO batch tracking safeguards your licenses and inventory.',
      content: [
        'Agricultural inspectors frequently conduct random spot checks across Kenyan market centers. They look for two critical violations: expired active chemical ingredients on retail shelves, and uncertified seed lots without valid KEPHIS germination tags.',
        'AgroFlow’s automated First-Expiry-First-Out (FEFO) dispensing engine monitors every bottle of fungicide, herbicide, and dewormer from inward goods receipt (GRN) to counter sale.',
        'When chemicals reach 30 days before expiration, high-priority dashboard banners alert the shop manager to apply seasonal clearance discounts or return batches to Twiga, Bayer, or Syngenta distributors before dead capital is written off.',
      ],
      takeaways: [
        'Log supplier delivery batch codes, expiry dates, and PCPB registration numbers at GRN intake.',
        'Enforce FEFO so older inventory is sold first, stopping dead stock at the back of shelves.',
        'Generate 1-click statutory audit logs ready for PCPB and KEPHIS field inspectors.',
      ],
      metrics: [
        { label: 'PCPB Audit Compliance', value: '100% Pass Rate' },
        { label: 'Expired Stock Loss', value: 'Reduced by 94%' },
        { label: 'Recall Resolution', value: 'Instant Batch Lookup' },
      ],
    },
    {
      id: 'shift-reconciliation',
      title: 'Ending the 6:00 PM Cash Drawer Discrepancy: Dual-Control Shift Balancing',
      subtitle: 'Cashier Accountability & Store Security',
      category: 'Shift Register & Fraud Prevention',
      date: 'Updated 2026',
      readTime: '4 min read',
      author: 'David Karani & Store Audit Team',
      image: '/media/cabbage.jpg',
      statBadge: '0 KES Discrepancy',
      summary:
        'Cash shortages at the end of the day drain hundreds of thousands of shillings annually. Learn how denomination banknote counting and Manager PIN locks bring total drawer accountability.',
      content: [
        'A common leak in agrovet retail is the daily "small shortage"—KES 800 here, KES 1,500 there—attributed to giving change or unrecorded walk-ins. Over 12 months, this represents over KES 350,000 in unrecoverable net profit.',
        'AgroFlow’s Shift Register requires cashiers to perform a physical denomination banknote tally (counting KES 1,000, 500, 200, 100, 50 notes down to coins) before closing their terminal.',
        'The system calculates exact variance against digital sales journals, separated by Cash, M-Pesa STK push, and Credit book. Any discrepancy requires a Manager PIN authorization to close, providing complete oversight and eliminating staff pilferage.',
      ],
      takeaways: [
        'Never close a drawer without counting specific banknote denominations.',
        'Separate M-Pesa phone STK receipts from physical cash to avoid mixed balances.',
        'Require Manager PIN verification on all drawer variances and refund voids.',
      ],
      metrics: [
        { label: 'Drawer Discrepancy', value: '0 KES Unexplained' },
        { label: 'Daily Balancing Time', value: 'Under 5 minutes' },
        { label: 'Net Margin Retained', value: '+4.8% annually' },
      ],
    },
  ];

  
  const [selectedArticle, setSelectedArticle] = useState<(typeof caseStudyArticles)[0] | null>(null);

  
  const heroSlides = [
    {
      titlePart1: 'Take Absolute Control of Your Agrovet: ',
      titleHighlight: 'Zero Missing Debt,',
      titlePart2: ' Zero Drawer Shortages',
      subtitle:
        'AgroFlow is Kenya\'s offline-first store operating system engineered specifically for agrovets, seed stockists, and cooperative input hubs. Ring counter sales in under 3 seconds, recover 98% of smallholder credit with automated Africa\'s Talking M-Pesa reminders, and protect your margins with automated PCPB batch compliance.',
      image: '/media/farmer.jpg',
      imageAlt: 'Agrovet Manager in Kirinyaga',
    },
    {
      titlePart1: 'Streamline Animal Health & Milk Deductions: ',
      titleHighlight: '100% Co-op Accuracy,',
      titlePart2: ' Zero Ledger Disputes',
      subtitle:
        'Dispensary tracking for veterinary dewormers, clinical acaricides, and dairy meal with automated tripartite cooperative check-off guarantees. Stop uncollected credit and settle accounts seamlessly against seasonal smallholder deliveries.',
      image: '/media/cows.jpg',
      imageAlt: 'Dairy and Livestock Input Centre',
    },
    {
      titlePart1: 'Eliminate Chemical Spoilage: ',
      titleHighlight: '30-Day Automated FEFO Alerts,',
      titlePart2: ' Zero Expired Losses',
      subtitle:
        'Track supplier lot codes, PCPB numbers, and germination certificates. Sell older batches first to stop dead inventory write-offs and pass statutory KEPHIS store inspections with flying colors.',
      image: '/media/fruit.jpg',
      imageAlt: 'Certified Seedlings & Agrochemical Store',
    },
  ];

  const [heroSlide, setHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  
  useEffect(() => {
    if (isHeroPaused || activeTab !== 'home') return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHeroPaused, activeTab]);

  const prevHeroSlide = () => {
    setHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextHeroSlide = () => {
    setHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  
  const [reviewSlide, setReviewSlide] = useState(0);

  const prevReviewSlide = () => {
    setReviewSlide((prev) => (prev === 0 ? fieldReviews.length - 1 : prev - 1));
  };

  const nextReviewSlide = () => {
    setReviewSlide((prev) => (prev + 1) % fieldReviews.length);
  };

  
  const [counts, setCounts] = useState({
    terminals: 0,
    sms: 0,
    farmers: 0,
    pcpb: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab !== 'home') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();
          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const ease = 1 - Math.pow(1 - progress, 3);
            setCounts({
              terminals: Math.floor(ease * 350),
              sms: Math.floor(ease * 142865),
              farmers: Math.floor(ease * 48500),
              pcpb: Math.floor(ease * 100),
            });
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCounts({
                terminals: 350,
                sms: 142865,
                farmers: 48500,
                pcpb: 100,
              });
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    return () => observer.disconnect();
  }, [hasAnimated, activeTab]);

  
  const [selectedSystemModule, setSelectedSystemModule] = useState<
    'pos' | 'credit' | 'inventory' | 'shift' | 'farmers' | 'suppliers'
  >('pos');

  
  const [selectedRole, setSelectedRole] = useState<'cashier' | 'manager'>('cashier');
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  
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

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-between text-[#131b2e] font-inter selection:bg-[#11bf36]/20 selection:text-[#003b1b] relative overflow-x-hidden">
      <div
        className="cursor-glow"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      <div className="bg-[#002410] text-gray-300 text-[11px] py-2 px-6 border-b border-[#14532d] hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+254790509684" className="flex items-center gap-1.5 text-gray-200 hover:text-[#11bf36] transition-colors">
              <span className="material-symbols-outlined text-xs text-[#11bf36]">call</span>
              <span className="font-semibold">+254 790 509 684 / +254 724 559 286</span>
            </a>
            <span className="text-[#14532d]">•</span>
            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="material-symbols-outlined text-xs text-[#11bf36]">location_on</span>
              <span>Kerugoya Central Hub &amp; Nairobi, Kenya</span>
            </div>
            <span className="text-[#14532d]">•</span>
            <a href="mailto:support@agroflow.co.ke" className="flex items-center gap-1.5 text-gray-200 hover:text-[#11bf36] transition-colors">
              <span className="material-symbols-outlined text-xs text-[#11bf36]">mail</span>
              <span>support@agroflow.co.ke</span>
            </a>
          </div>
        </div>
      </div>

      <header className="bg-[#003b1b] text-white border-b border-[#14532d] px-6 py-3.5 shadow-lg sticky top-0 z-30 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1X9wFvkPwR2rD-0K7RfG9t5qZ6pueh0C-3t9cT_cBLxyVLB8zYvPOEj74ThuFFBhNzqKYSI--qvIwvubjHuCGbO_Ff2zBPZr4eo-ZohcRjmLH1RzKEgloqef7kc5bNLEBmdk9ZY2F_ILINM8h1jfuz_1mLi90KDf1sp2hMQrgHpKiLLwSjX7p7vbn-9ty5OUpbjAnn9tNRU319WM1-60_sndWDOC1TtuMwQFVZz2p5k4oxssS4PXQ466kom"
                alt="AgroFlow Logo"
                className="w-10 h-10 object-contain bg-white rounded-xl p-1 shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#11bf36] rounded-full"></span>
            </div>
            <div>
              <div className="font-playfair font-bold text-2xl tracking-tight text-white flex items-center gap-2">
                <span>AgroFlow</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#11bf36] shadow-xs"></span>
              </div>
              <div className="text-[10px] text-gray-300 font-medium tracking-wide">
                new generation culture in agribusiness
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 bg-[#002410]/80 border border-[#14532d] p-1.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#11bf36] text-white shadow-md font-bold scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[#11bf36] text-white shadow-md font-bold scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-[#11bf36] text-white shadow-md font-bold scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              About System
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-[#11bf36] text-white shadow-md font-bold scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              System Guide
            </button>

            <button
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#11bf36] text-white font-bold shadow-lg scale-[1.02]'
                  : 'bg-[#11bf36]/90 hover:bg-[#11bf36] text-white font-bold'
              }`}
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in">
            <div
              className="w-full relative min-h-[600px] sm:min-h-[680px] lg:min-h-[740px] flex items-center justify-center overflow-hidden bg-[#00170a]"
              onMouseEnter={() => setIsHeroPaused(true)}
              onMouseLeave={() => setIsHeroPaused(false)}
            >
              <img
                key={heroSlide}
                src={heroSlides[heroSlide].image}
                alt={heroSlides[heroSlide].imageAlt}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 animate-fade-in filter brightness-[0.82] contrast-[1.05]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

              <button
                type="button"
                onClick={prevHeroSlide}
                aria-label="Previous Hero Slide"
                className="absolute left-4 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#11bf36] hover:bg-[#0ea82f] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/20"
              >
                <span className="material-symbols-outlined text-2xl sm:text-3xl">chevron_left</span>
              </button>

              <button
                type="button"
                onClick={nextHeroSlide}
                aria-label="Next Hero Slide"
                className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#11bf36] hover:bg-[#0ea82f] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/20"
              >
                <span className="material-symbols-outlined text-2xl sm:text-3xl">chevron_right</span>
              </button>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setHeroSlide(idx)}
                    aria-label={`Go to hero slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      heroSlide === idx ? 'w-10 bg-[#11bf36] shadow-lg' : 'w-2.5 bg-white/40 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>

              <div className="max-w-4xl mx-auto px-16 sm:px-24 py-20 text-center relative z-10 text-white space-y-6">
                <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight transition-opacity duration-300">
                  {heroSlides[heroSlide].titlePart1}
                  <span className="text-[#11bf36] drop-shadow-md">{heroSlides[heroSlide].titleHighlight}</span>
                  {heroSlides[heroSlide].titlePart2}
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-md">
                  {heroSlides[heroSlide].subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => setActiveTab('login')}
                    className="bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="material-symbols-outlined text-base">point_of_sale</span>
                    <span>Sign In to POS Counter</span>
                  </button>
                  <a
                    href="tel:+254790509684"
                    className="border border-white/40 hover:border-[#11bf36] bg-black/40 hover:bg-black/60 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 backdrop-blur-md transform hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-sm text-[#11bf36]">support_agent</span>
                    <span>Book In-Store Setup</span>
                  </a>
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="bg-black/60 hover:bg-black/80 border border-[#11bf36]/50 text-emerald-200 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 backdrop-blur-md transform hover:-translate-y-0.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#11bf36] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs">play_arrow</span>
                    </div>
                    <span>Operating Tour</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
              <section id="cl-promoservice-section" className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-[#131b2e] relative inline-block pb-3">
                    Six Pillars of Agrovet Profit Protection
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#11bf36]"></span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto">
                    Purpose-built dispensary modules engineered to stop revenue leakage in high-volume agrochemical, fertilizer, seed, and veterinary shops in Kenya.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden">
                    <div>
                      <figure className="relative h-48 overflow-hidden bg-gray-100">
                        <img src="/media/cabbage.jpg" alt="Counter POS & Inputs" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </figure>
                      <div className="p-5 relative">
                        <div className="w-12 h-12 bg-[#11bf36] text-white flex items-center justify-center -mt-11 mb-3 shadow-md rounded-xl">
                          <span className="material-symbols-outlined text-xl">point_of_sale</span>
                        </div>
                        <h3 className="font-playfair font-bold text-lg text-[#131b2e] group-hover:text-[#11bf36] transition-colors mb-1.5 cursor-pointer" onClick={() => setActiveTab('system')}>
                          High-Speed Counter POS (F2)
                        </h3>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          Eliminate customer queue walkouts during peak planting. 3-second barcode scanning, split tender (Cash, M-Pesa, Credit), and instant thermal receipt printing.
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button onClick={() => setActiveTab('system')} className="text-xs font-bold text-[#11bf36] hover:underline flex items-center gap-1 cursor-pointer">
                        Explore POS Features <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden">
                    <div>
                      <figure className="relative h-48 overflow-hidden bg-gray-100">
                        <img src="/media/farmer.jpg" alt="Smallholder Credit Book" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </figure>
                      <div className="p-5 relative">
                        <div className="w-12 h-12 bg-[#11bf36] text-white flex items-center justify-center -mt-11 mb-3 shadow-md rounded-xl">
                          <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                        </div>
                        <h3 className="font-playfair font-bold text-lg text-[#131b2e] group-hover:text-[#11bf36] transition-colors mb-1.5 cursor-pointer" onClick={() => setActiveTab('system')}>
                          Smallholder Debt Book &amp; M-Pesa Recovery
                        </h3>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          Replace easily lost paper notebooks with digital ledgers, National ID KYC, authorized credit limits, and automated Africa&apos;s Talking SMS payment links.
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button onClick={() => setActiveTab('system')} className="text-xs font-bold text-[#11bf36] hover:underline flex items-center gap-1 cursor-pointer">
                        Explore Credit Ledger <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden">
                    <div>
                      <figure className="relative h-48 overflow-hidden bg-gray-100">
                        <img src="/media/cows.jpg" alt="Livestock Farming" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </figure>
                      <div className="p-5 relative">
                        <div className="w-12 h-12 bg-[#11bf36] text-white flex items-center justify-center -mt-11 mb-3 shadow-md rounded-xl">
                          <span className="material-symbols-outlined text-xl">pets</span>
                        </div>
                        <h3 className="font-playfair font-bold text-lg text-[#131b2e] group-hover:text-[#11bf36] transition-colors mb-1.5 cursor-pointer" onClick={() => setActiveTab('system')}>
                          Veterinary &amp; Dairy Co-op Check-Off
                        </h3>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          Track clinical dewormers, acaricides, and dairy meal with tripartite cooperative milk and tea delivery check-off credit guarantees.
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button onClick={() => setActiveTab('system')} className="text-xs font-bold text-[#11bf36] hover:underline flex items-center gap-1 cursor-pointer">
                        Explore Co-op Hub <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden">
                    <div>
                      <figure className="relative h-48 overflow-hidden bg-gray-100">
                        <img src="/media/fruit.jpg" alt="Certified Seed Lots" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </figure>
                      <div className="p-5 relative">
                        <div className="w-12 h-12 bg-[#11bf36] text-white flex items-center justify-center -mt-11 mb-3 shadow-md rounded-xl">
                          <span className="material-symbols-outlined text-xl">nature</span>
                        </div>
                        <h3 className="font-playfair font-bold text-lg text-[#131b2e] group-hover:text-[#11bf36] transition-colors mb-1.5 cursor-pointer" onClick={() => setActiveTab('system')}>
                          Certified Seeds &amp; KEPHIS Lots
                        </h3>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          KEPHIS lot certification tracking for hybrid maize, seed potatoes, and vegetable seeds to ensure authentic seed provenance and pass inspector checks.
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button onClick={() => setActiveTab('system')} className="text-xs font-bold text-[#11bf36] hover:underline flex items-center gap-1 cursor-pointer">
                        Explore Seed Tracking <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden">
                    <div>
                      <figure className="relative h-48 overflow-hidden bg-[#faf8ff] flex items-center justify-center p-4">
                        <img src="/media/seedfarm.jpg" alt="Diseases & Crop Protection" className="max-h-36 object-contain group-hover:scale-105 transition-transform duration-500" />
                      </figure>
                      <div className="p-5 relative">
                        <div className="w-12 h-12 bg-[#11bf36] text-white flex items-center justify-center -mt-11 mb-3 shadow-md rounded-xl">
                          <span className="material-symbols-outlined text-xl">biotech</span>
                        </div>
                        <h3 className="font-playfair font-bold text-lg text-[#131b2e] group-hover:text-[#11bf36] transition-colors mb-1.5 cursor-pointer" onClick={() => setActiveTab('system')}>
                          30-Day FEFO Chemical Expiry Shield
                        </h3>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          Automated First-Expiry-First-Out dispensing alerts you 30 days before chemicals expire, eliminating costly dead pesticide stock on shelves.
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button onClick={() => setActiveTab('system')} className="text-xs font-bold text-[#11bf36] hover:underline flex items-center gap-1 cursor-pointer">
                        Explore Expiry Monitor <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden">
                    <div>
                      <figure className="relative h-48 overflow-hidden bg-[#002410] flex items-center justify-center p-4">
                        <img src="/media/yielder.png" alt="Farming Operations" className="max-h-24 object-contain group-hover:scale-105 transition-transform duration-500" />
                      </figure>
                      <div className="p-5 relative">
                        <div className="w-12 h-12 bg-[#11bf36] text-white flex items-center justify-center -mt-11 mb-3 shadow-md rounded-xl">
                          <span className="material-symbols-outlined text-xl">receipt_long</span>
                        </div>
                        <h3 className="font-playfair font-bold text-lg text-[#131b2e] group-hover:text-[#11bf36] transition-colors mb-1.5 cursor-pointer" onClick={() => setActiveTab('guide')}>
                          Banknote Tally &amp; Safe Shift Close
                        </h3>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          Physical denomination counting (KES 1,000 down to coins) matched against digital sales journals to ensure zero drawer discrepancy with Manager PIN.
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button onClick={() => setActiveTab('guide')} className="text-xs font-bold text-[#11bf36] hover:underline flex items-center gap-1 cursor-pointer">
                        Explore Shift Audit <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section id="cl_aboutus" className="bg-[#002410] text-white p-8 md:p-12 rounded-3xl border border-[#14532d] shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <h3 className="font-playfair font-bold text-2xl md:text-3xl text-white">
                      Why Your Agrovet Needs an Operating System
                    </h3>
                    <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
                      AgroFlow is the dedicated Point-of-Sale and financial operating system engineered exclusively for commercial agrovets and cooperative input depots in Kenya. Built to withstand rural Safaricom and power downtime with 100% offline SQLite continuity, AgroFlow replaces unreliable paper notebooks and manual tills with automated M-Pesa credit recovery, FEFO inventory alerts, and tamper-proof shift reconciliation.
                    </p>
                    <div className="address-info text-xs space-y-1.5 text-gray-300 pt-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">Email Us:</strong>
                        <a href="mailto:support@agroflow.co.ke" className="underline hover:text-[#11bf36] transition-colors">support@agroflow.co.ke</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white">Direct Hotline:</strong>
                        <a href="tel:+254790509684" className="underline hover:text-[#11bf36] transition-colors">+254 790 509 684 / +254 724 559 286</a>
                      </div>
                    </div>
                    <div className="numbers-profile flex items-center gap-3 pt-2">
                      <img src="/media/farmer.jpg" alt="Achievements" className="w-12 h-12 rounded-xl object-cover border-2 border-[#11bf36]" />
                      <div className="profile-info">
                        <h4 className="font-playfair font-bold text-sm text-white mb-0">Mount Kenya Agrovet Deployment</h4>
                        <span className="text-[11px] text-gray-400">Kerugoya • Wang&apos;uru • Kutus • Karatina • Kangari</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                      <div className="flex flex-col items-center space-y-2 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs">
                        <div className="relative w-28 h-28">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="35" stroke="#14532d" strokeWidth="6" fill="none" />
                            <circle cx="40" cy="40" r="35" stroke="#11bf36" strokeWidth="6" strokeDasharray="220" strokeDashoffset={220 * (1 - 0.982)} strokeLinecap="round" fill="none" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <span className="font-playfair font-bold text-xl text-[#11bf36]">98.2%</span>
                            <span className="text-[9px] uppercase font-bold leading-tight max-w-[60px] text-gray-300">Credit Recovery</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white">M-Pesa SMS Reminders</span>
                      </div>

                      <div className="flex flex-col items-center space-y-2 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs">
                        <div className="relative w-28 h-28">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="35" stroke="#14532d" strokeWidth="6" fill="none" />
                            <circle cx="40" cy="40" r="35" stroke="#11bf36" strokeWidth="6" strokeDasharray="220" strokeDashoffset={220 * (1 - 1.0)} strokeLinecap="round" fill="none" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <span className="font-playfair font-bold text-xl text-[#11bf36]">100%</span>
                            <span className="text-[9px] uppercase font-bold leading-tight max-w-[60px] text-gray-300">Compliance</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white">Audit Pass Rate</span>
                      </div>

                      <div className="flex flex-col items-center space-y-2 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs">
                        <div className="relative w-28 h-28">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="35" stroke="#14532d" strokeWidth="6" fill="none" />
                            <circle cx="40" cy="40" r="35" stroke="#11bf36" strokeWidth="6" strokeDasharray="220" strokeDashoffset={0} strokeLinecap="round" fill="none" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <span className="font-playfair font-bold text-xl text-[#11bf36]">0 KES</span>
                            <span className="text-[9px] uppercase font-bold leading-tight max-w-[60px] text-gray-300">Shift Shortage</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white">Denomination Audit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div
              id="cl_ctavideo"
              className="relative bg-cover bg-center py-20 px-6 text-center text-white"
              style={{ backgroundImage: "url('/media/cabbage.jpg')", backgroundAttachment: "fixed" }}
            >
              <div className="absolute inset-0 bg-[#002410]/80 backdrop-blur-xs" />
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="w-16 h-16 rounded-full bg-[#11bf36] text-white flex items-center justify-center box-shadow-ripples hover:scale-110 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-2xl">play_arrow</span>
                  </button>
                </div>
                <h2 className="font-playfair text-2xl sm:text-4xl font-bold">Watch In-Store Operational Tour</h2>
                <div className="text-xs sm:text-sm text-emerald-200">
                  <p>See how Kirinyaga cashiers use keyboard shortcuts (F2) to ring sales, split cash/M-Pesa tender, and balance drawers with zero discrepancy.</p>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
              <section id="cl-service-section" className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-[#131b2e] relative inline-block pb-3">
                    Three Core Operational Engines
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#11bf36]"></span>
                  </h2>
                  <div className="text-xs sm:text-sm text-gray-500 max-w-3xl mx-auto">
                    Engineered specifically to resolve the three largest profit leaks in Kenyan agrovets: peak-season queue congestion, uncollected credit notebooks, and expired agrochemicals.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <figure className="relative h-52 overflow-hidden bg-gray-100">
                        <img src="/media/cabbage.jpg" alt="High-Speed Counter POS" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </figure>
                      <div className="p-5 space-y-2">
                        <h3 className="font-playfair font-bold text-lg text-[#131b2e] group-hover:text-[#11bf36] transition-colors">
                          High-Speed Counter POS &amp; Offline Continuity
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          100% offline-first local database. Even during rural power cuts or Safaricom downtime, cashiers keep scanning barcodes and completing transactions without freezing.
                        </p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setActiveTab('system')}
                        className="bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Explore POS Engine</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <figure className="relative h-52 overflow-hidden bg-gray-100">
                        <img src="/media/farmer.jpg" alt="Smallholder Credit Book" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </figure>
                      <div className="p-5 space-y-2">
                        <h3 className="font-playfair font-bold text-lg text-[#131b2e] group-hover:text-[#11bf36] transition-colors">
                          Smallholder Credit &amp; M-Pesa Debt Recovery
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Say goodbye to torn debt notebooks. Record farmer credit with National ID KYC, set ceilings, and automatically dispatch Africa&apos;s Talking payment reminders with your M-Pesa Till number.
                        </p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setActiveTab('system')}
                        className="bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Explore Credit Engine</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <figure className="relative h-52 overflow-hidden bg-gray-100">
                        <img src="/media/seedfarm.jpg" alt="Agrochemical Expiry & PCPB Compliance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </figure>
                      <div className="p-5 space-y-2">
                        <h3 className="font-playfair font-bold text-lg text-[#131b2e] group-hover:text-[#11bf36] transition-colors">
                          FEFO Batch &amp; Chemical Expiry Shield
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Track supplier lot numbers, expiry dates, and PCPB registration codes. Automated 30-day early warnings alert you before fungicides or seeds expire, preventing dead capital write-offs.
                        </p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setActiveTab('system')}
                        className="bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Explore Inventory Engine</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div
              id="cl_cta"
              className="relative bg-cover bg-center py-16 px-6 text-center text-white"
              style={{ backgroundImage: "url('/media/cows.jpg')", backgroundAttachment: "fixed" }}
            >
              <div className="absolute inset-0 bg-[#002410]/85" />
              <div className="relative z-10 max-w-xl mx-auto space-y-3">
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold">Ready to Secure Your Agrovet&apos;s Daily Revenue?</h2>
                <div className="text-xs sm:text-sm text-emerald-300">
                  <p>Join progressive agro-dealers across Kirinyaga, Murang&apos;a, Embu, and Meru who have eliminated drawer shortages and missing credit.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('login')}
                    className="bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <span>Sign In to POS Counter</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                  <a
                    href="tel:+254790509684"
                    className="border border-white hover:bg-white/10 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Book In-Store Setup</span>
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">call</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
              <section id="cl_blog" className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-[#131b2e] relative inline-block pb-3">
                    Agrovet Case Studies &amp; Operational Guides
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#11bf36]"></span>
                  </h2>
                  <div className="text-xs sm:text-sm text-gray-500 max-w-3xl mx-auto">
                    Learn how commercial agrovets across Mount Kenya eliminate torn debt notebooks, pass PCPB regulatory audits, and achieve 100% daily drawer accuracy.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {caseStudyArticles.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5 space-y-2">
                          <h3 className="font-playfair font-bold text-base text-[#131b2e] group-hover:text-[#11bf36] transition-colors leading-snug">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                          <span>{article.readTime}</span>
                          <span className="font-bold text-[#11bf36] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read Case Study <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section id="cl_testimonial" className="bg-[#f3faf4] border border-[#11bf36]/20 rounded-3xl p-8 md:p-12 shadow-sm">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#11bf36] animate-pulse"></span>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#14532d]">
                          Field Verification • In-Store Audits
                        </span>
                      </div>
                      <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-[#131b2e] leading-tight">
                        Read the latest reviews
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        Hear directly from agrovet owners, store managers, and cooperative input officers across Kirinyaga and Mount Kenya who transformed their cash flow, queue speed, and debt recovery with AgroFlow.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={prevReviewSlide}
                        aria-label="Previous review"
                        className="w-12 h-12 rounded-full bg-[#11bf36] hover:bg-[#0ea82f] text-white flex items-center justify-center transition-all shadow-md transform hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-2xl">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        onClick={nextReviewSlide}
                        aria-label="Next review"
                        className="w-12 h-12 rounded-full bg-[#11bf36] hover:bg-[#0ea82f] text-white flex items-center justify-center transition-all shadow-md transform hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-2xl">chevron_right</span>
                      </button>
                      <span className="text-xs font-semibold text-gray-500 pl-2">
                        {reviewSlide + 1} of {fieldReviews.length}
                      </span>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab('about')}
                        className="text-xs font-bold text-[#14532d] hover:text-[#11bf36] hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-[#11bf36]/30 shadow-xs"
                      >
                        <span>Read System Philosophy</span>
                        <span className="material-symbols-outlined text-xs text-[#11bf36]">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div
                      key={reviewSlide}
                      className="bg-white border-2 border-[#11bf36]/20 rounded-3xl p-7 sm:p-9 shadow-lg relative transition-all duration-300 animate-fade-in flex flex-col justify-between min-h-[300px]"
                    >
                      <div className="absolute top-6 right-6 text-[#11bf36]/15 pointer-events-none">
                        <span className="material-symbols-outlined text-6xl">format_quote</span>
                      </div>

                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs sm:text-sm font-bold text-[#11bf36] bg-[#eaf8ed] px-3.5 py-1.5 rounded-full border border-[#11bf36]/30 font-mono">
                            {fieldReviews[reviewSlide].stat}
                          </span>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            {fieldReviews[reviewSlide].category}
                          </span>
                        </div>

                        <p className="font-playfair italic text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed pt-1">
                          &ldquo;{fieldReviews[reviewSlide].quote}&rdquo;
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-4 relative z-10">
                        <img
                          src={fieldReviews[reviewSlide].photo}
                          alt={fieldReviews[reviewSlide].manager}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#11bf36] shrink-0 shadow-md"
                        />
                        <div>
                          <div className="font-playfair font-bold text-base text-[#131b2e] leading-tight">
                            {fieldReviews[reviewSlide].store}
                          </div>
                          <div className="text-xs text-gray-600 font-medium pt-0.5">
                            {fieldReviews[reviewSlide].manager}
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1 pt-0.5">
                            <span className="material-symbols-outlined text-[13px] text-[#11bf36]">location_on</span>
                            <span>{fieldReviews[reviewSlide].location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2">
                      {fieldReviews.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setReviewSlide(idx)}
                          aria-label={`Go to review ${idx + 1}`}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            reviewSlide === idx ? 'w-8 bg-[#11bf36]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section id="cl_team" className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-[#131b2e] relative inline-block pb-3">
                    Our Operational Leadership
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#11bf36]"></span>
                  </h2>
                  <div className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto">
                    At AgroFlow, we combine agricultural agronomy with high-throughput transaction engineering to protect retail agrovets across Kenya.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition-all text-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#003b1b] text-[#11bf36] flex items-center justify-center mx-auto shadow-md border-2 border-[#11bf36]/30">
                      <span className="material-symbols-outlined text-3xl">terminal</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-playfair font-bold text-base text-[#131b2e]">John Kiruthi</h4>
                      <span className="text-xs font-bold text-[#11bf36] block">Co-Founder &amp; Systems Architect</span>
                      <p className="text-xs text-gray-600 leading-relaxed pt-1">
                        Over a decade designing high-throughput offline-first transaction engines, SQLite sync pipelines, and M-Pesa automated reconciliation for retail chains.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition-all text-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#003b1b] text-[#11bf36] flex items-center justify-center mx-auto shadow-md border-2 border-[#11bf36]/30">
                      <span className="material-symbols-outlined text-3xl">storefront</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-playfair font-bold text-base text-[#131b2e]">Millicent Wangui</h4>
                      <span className="text-xs font-bold text-[#11bf36] block">Head of Agrovet Operations</span>
                      <p className="text-xs text-gray-600 leading-relaxed pt-1">
                        Experienced agrovet manager specializing in input inventory turnover, cooperative check-off agreements, and smallholder debt collection workflows.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition-all text-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#003b1b] text-[#11bf36] flex items-center justify-center mx-auto shadow-md border-2 border-[#11bf36]/30">
                      <span className="material-symbols-outlined text-3xl">verified</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-playfair font-bold text-base text-[#131b2e]">Virginia Wangari</h4>
                      <span className="text-xs font-bold text-[#11bf36] block">PCPB &amp; Regulatory Liaison</span>
                      <p className="text-xs text-gray-600 leading-relaxed pt-1">
                        Agronomist ensuring FEFO chemical dispensing protocols, active ingredient labeling safety, and statutory KEPHIS certified seed batch compliance.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div id="cl_counter" ref={counterRef} className="relative bg-[#002410] py-16 px-6 text-white text-center">
              <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <div className="space-y-1">
                  <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-white">Our Operational Footprint</h2>
                  <div className="text-xs sm:text-sm text-[#87c695]">Securing working capital and daily counter checkout across Kenya</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2 backdrop-blur-xs transform hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-[#11bf36] text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-xl">point_of_sale</span>
                    </div>
                    <div className="font-playfair text-3xl sm:text-4xl font-bold text-[#b1f2be] font-mono tracking-tight">
                      {counts.terminals}+
                    </div>
                    <h6 className="text-xs font-bold uppercase tracking-wider text-gray-300">Active Counter Terminals</h6>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2 backdrop-blur-xs transform hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-[#11bf36] text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-xl">database</span>
                    </div>
                    <div className="font-playfair text-3xl sm:text-4xl font-bold text-[#b1f2be] font-mono tracking-tight">
                      {counts.sms.toLocaleString()}
                    </div>
                    <h6 className="text-xs font-bold uppercase tracking-wider text-gray-300">SMS Debt Reminders Sent</h6>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2 backdrop-blur-xs transform hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-[#11bf36] text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-xl">groups</span>
                    </div>
                    <div className="font-playfair text-3xl sm:text-4xl font-bold text-[#b1f2be] font-mono tracking-tight">
                      {counts.farmers.toLocaleString()}+
                    </div>
                    <h6 className="text-xs font-bold uppercase tracking-wider text-gray-300">Registered Smallholders</h6>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2 backdrop-blur-xs transform hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-[#11bf36] text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <span className="material-symbols-outlined text-xl">verified</span>
                    </div>
                    <div className="font-playfair text-3xl sm:text-4xl font-bold text-[#b1f2be] font-mono tracking-tight">
                      {counts.pcpb}%
                    </div>
                    <h6 className="text-xs font-bold uppercase tracking-wider text-gray-300">PCPB Batch Audited</h6>
                  </div>
                </div>
              </div>
            </div>

            <section id="cl_clients" className="space-y-6 w-full py-4">
              <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-2">
                <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-[#131b2e] relative inline-block pb-3">
                  Ecosystem Integrations &amp; Industry Standards
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#11bf36]"></span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 max-w-3xl mx-auto">
                  Engineered to communicate seamlessly with Kenya&apos;s leading mobile payment switches, telco SMS gateways, statutory agricultural boards, and verified input manufacturers.
                </p>
              </div>

              <div className="relative overflow-hidden w-full py-4">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#faf8ff] to-transparent z-10"></div>
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#faf8ff] to-transparent z-10"></div>

                <div className="flex animate-marquee gap-6 whitespace-nowrap will-change-transform py-2">
                  {[
                    { name: 'Farmers254', fullName: 'Kenya Agribusiness Directory', img: '/media/farmers254_logo.png' },
                    { name: 'KLPA Kenya', fullName: 'Kenya Livestock Producers Association', img: '/media/klpa_logo.png' },
                    { name: 'Oxfarm Organic', fullName: 'Certified Seedlings & Input Distribution', img: '/media/oxfarm_logo.png' },
                    { name: 'FarmExpose', fullName: 'Agribusiness Trade & Commercial Media', img: '/media/farmexpose_logo.png' },
                    { name: 'Planta Fruit', fullName: 'Commercial Fruit Nursery Network', img: '/media/plantafruit_logo.png' },
                    { name: 'Yielder Tech', fullName: 'Field Agronomy & Advisory Services', img: '/media/yielder.png' },
                    { name: 'KEPHIS & PCPB', fullName: 'Statutory Seed & Chemical Records', img: '/media/seedfarm.jpg' },
                    { name: 'SQLite POS Engine', fullName: 'Zero-Downtime Offline Counter Cache', img: '/media/cabbage.jpg' },
                    
                    { name: 'Farmers254', fullName: 'Kenya Agribusiness Directory', img: '/media/farmers254_logo.png' },
                    { name: 'KLPA Kenya', fullName: 'Kenya Livestock Producers Association', img: '/media/klpa_logo.png' },
                    { name: 'Oxfarm Organic', fullName: 'Certified Seedlings & Input Distribution', img: '/media/oxfarm_logo.png' },
                    { name: 'FarmExpose', fullName: 'Agribusiness Trade & Commercial Media', img: '/media/farmexpose_logo.png' },
                    { name: 'Planta Fruit', fullName: 'Commercial Fruit Nursery Network', img: '/media/plantafruit_logo.png' },
                    { name: 'Yielder Tech', fullName: 'Field Agronomy & Advisory Services', img: '/media/yielder.png' },
                    { name: 'KEPHIS & PCPB', fullName: 'Statutory Seed & Chemical Records', img: '/media/seedfarm.jpg' },
                    { name: 'SQLite POS Engine', fullName: 'Zero-Downtime Offline Counter Cache', img: '/media/cabbage.jpg' },
                  ].map((partner, pIdx) => (
                    <div
                      key={pIdx}
                      className="inline-flex items-center gap-3.5 bg-white border border-gray-200/90 hover:border-[#11bf36] px-5 py-3.5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-default shrink-0 group"
                    >
                      <img
                        src={partner.img}
                        alt={partner.name}
                        className="w-10 h-10 rounded-xl object-contain bg-gray-50 p-1 border border-gray-100 shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-[#131b2e] group-hover:text-[#11bf36] transition-colors">{partner.name}</div>
                        <div className="text-[10px] text-gray-500 font-medium">{partner.fullName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <section id="free-hand-text-section" className="bg-[#f3faf6] border border-emerald-200 rounded-2xl p-6 md:p-8 text-xs sm:text-sm text-emerald-950 leading-relaxed shadow-xs">
                <p>
                  <strong>AgroFlow</strong> is Kenya&apos;s purpose-built store operating system that enables commercial agro-dealers, seed stockists, and cooperative input hubs to automate inventory, track customer debt, and enforce statutory chemical dispensation. Built to eliminate the high failure rate caused by uncollected credit and shelf-life chemical spoilage, AgroFlow ensures rural agribusinesses remain resilient, audit-compliant, and profitable season after season.
                </p>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto my-10 p-6 sm:p-8 bg-white rounded-2xl border border-[#dae2fd] shadow-lg space-y-6 animate-fade-in">
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
                    <p className="text-[11px] text-gray-200 leading-snug mt-0.5">Empowering 350+ commercial agrovet counters dispensing certified inputs to over 48,500 smallholders.</p>
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

        {activeTab === 'system' && (
          <div className="max-w-5xl mx-auto my-10 px-4 sm:px-6 space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 border border-[#dae2fd] shadow-lg space-y-6">
              <div className="border-b pb-4 space-y-1">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#131b2e]">System Architecture &amp; Modules</h2>
                <p className="text-xs text-gray-500">Click any of the 6 operational pillars to inspect its data flow and capabilities</p>
              </div>

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
                      <span className="material-symbols-outlined text-base text-[#11bf36]">{mod.icon}</span>
                      {mod.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{mod.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 text-xs animate-fade-in">
                <div className="font-playfair font-bold text-base text-[#003b1b] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#11bf36]">info</span>
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

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-playfair font-bold text-xl text-[#131b2e]">End-to-End Value Chain Flow</h3>
                    <p className="text-xs text-gray-500">From supplier dock to smallholder harvest settlement</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#003b1b] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="material-symbols-outlined text-sm text-[#11bf36]">security</span>
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

        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto my-10 p-6 sm:p-8 bg-white rounded-2xl border border-[#dae2fd] shadow-lg space-y-6 animate-fade-in">
            <div className="border-b pb-4 space-y-1">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#131b2e]">AgroFlow System User Manual &amp; Guide</h2>
              <p className="text-xs text-gray-500">Step-by-step operational workflows for Agrovet Personnel</p>
            </div>

            <div className="space-y-6 text-xs text-gray-700">
              <div className="p-4 bg-[#eaedff] border border-[#dae2fd] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair font-bold text-[#003b1b] text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#11bf36]">keyboard</span>
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
                      <span className="material-symbols-outlined text-base text-[#11bf36]">point_of_sale</span>
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
                      <span className="material-symbols-outlined text-base text-[#11bf36]">admin_panel_settings</span>
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

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <h3 className="font-playfair font-bold text-base text-[#131b2e]">Hardware &amp; Counter Peripherals Integration</h3>
                  <p className="text-[11px] text-gray-500">Plug-and-play setup for standard agrovet counter equipment</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#11bf36] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-sm text-[#11bf36]">barcode_scanner</span>
                    </div>
                    <div className="font-playfair font-bold text-xs text-[#003b1b]">USB / Bluetooth Barcode Scanners</div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Works natively with standard HID keyboard-emulation scanners. Direct autofocus for instant cart additions.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#11bf36] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-sm text-[#11bf36]">print</span>
                    </div>
                    <div className="font-playfair font-bold text-xs text-[#003b1b]">58mm / 80mm Thermal Printers</div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Standard ESC/POS and browser printing supported for receipt generation with tax PIN, store till, and batch info.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#11bf36] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-sm text-[#11bf36]">scale</span>
                    </div>
                    <div className="font-playfair font-bold text-xs text-[#003b1b]">Weighing Scales &amp; Bulk Fertilizer</div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Fractional unit entry for repackaged DAP/CAN fertilizers, animal mineral salts, and bulk seed scoops.
                    </p>
                  </div>
                </div>
              </div>

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

        {activeTab === 'login' && (
          <div className="max-w-md mx-auto my-12 px-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#dae2fd] shadow-xl space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-[#003b1b] text-[#11bf36] border border-[#11bf36]/30 rounded-xl mx-auto flex items-center justify-center font-bold text-2xl shadow-md">
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
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11bf36] focus:border-[#11bf36] focus:bg-white transition-all font-medium"
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
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11bf36] focus:border-[#11bf36] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">Quick Sign-in Credentials:</div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setPreset('john.mwangi', 'admin123')}
                    className="p-2 bg-[#eaf8ed] text-[#003b1b] rounded-lg border border-[#11bf36]/40 hover:bg-[#d2f5db] font-bold transition-all text-center cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="font-playfair font-bold text-xs text-[#003b1b]">Manager</div>
                    <div className="text-[9px] text-[#11bf36] font-semibold font-mono">john.mwangi</div>
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
                className="w-full py-3.5 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">login</span>
                    <span>Sign In to Terminal</span>
                  </>
                )}
              </button>
            </form>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#002410] text-[#87c695] text-xs border-t border-[#14532d] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#11bf36]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="border-b border-[#14532d]/80 bg-[#001c0d]/70">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#11bf36]/20 border border-[#11bf36]/40 flex items-center justify-center text-[#11bf36] shrink-0">
                <span className="material-symbols-outlined text-xl">storefront</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm sm:text-base font-playfair">
                  Ready to Deploy AgroFlow in Your Agrovet or Co-operative Branch?
                </h3>
                <p className="text-[#87c695]/80 text-xs">
                  Zero setup downtime. Our Kirinyaga field technicians configure your barcode scanner, thermal printer, and SQLite database on-site.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="tel:+254790509684"
                className="px-4 py-2.5 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>Call +254 790 509 684</span>
              </a>
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">terminal</span>
                <span>Sign In to POS</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1X9wFvkPwR2rD-0K7RfG9t5qZ6pueh0C-3t9cT_cBLxyVLB8zYvPOEj74ThuFFBhNzqKYSI--qvIwvubjHuCGbO_Ff2zBPZr4eo-ZohcRjmLH1RzKEgloqef7kc5bNLEBmdk9ZY2F_ILINM8h1jfuz_1mLi90KDf1sp2hMQrgHpKiLLwSjX7p7vbn-9ty5OUpbjAnn9tNRU319WM1-60_sndWDOC1TtuMwQFVZz2p5k4oxssS4PXQ466kom"
                  alt="AgroFlow Logo"
                  className="w-9 h-9 object-contain bg-white rounded-xl p-1 shadow-sm"
                />
                <span className="text-lg font-bold text-white font-playfair tracking-tight">AgroFlow OS</span>
              </div>

              <p className="text-xs text-[#87c695]/90 leading-relaxed">
                AgroFlow is Kenya&apos;s specialized agribusiness store operating system. Purpose-engineered for commercial agrovets, agrochemical stockists, and cooperative input desks to eliminate drawer shortages, uncollected farmer credit, and chemical expiry spoilage.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-playfair font-bold text-sm text-white uppercase tracking-wider border-b border-[#14532d] pb-2">
                Operational Modules
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('core-engines')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-white transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">point_of_sale</span>
                    <span>3-Second Counter POS (F2 Hotkey)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('core-engines')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-white transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">account_balance_wallet</span>
                    <span>Smallholder Credit Ledger &amp; SMS</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('core-engines')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-white transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">shield_with_heart</span>
                    <span>30-Day FEFO Chemical Expiry Shield</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('operational-pillars')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-white transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">payments</span>
                    <span>Cash Drawer &amp; Banknote Tally</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('operational-pillars')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-white transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">biotech</span>
                    <span>Prescriptions &amp; Co-op Check-Off</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('operational-pillars')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-white transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">inventory_2</span>
                    <span>GRN Supplier Cost &amp; Margin Audit</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-playfair font-bold text-sm text-white uppercase tracking-wider border-b border-[#14532d] pb-2">
                Governance &amp; Compliance
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="/legal" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">gavel</span>
                    <span>Legal Compliance Hub</span>
                  </a>
                </li>
                <li>
                  <a href="/regulatory" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">policy</span>
                    <span>PCPB Cap 346 &amp; KEPHIS Seed Act</span>
                  </a>
                </li>
                <li>
                  <a href="/credit-policy" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">credit_score</span>
                    <span>Fair Credit &amp; Debt Recovery Policy</span>
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">lock</span>
                    <span>Farmer Data Protection (KDPA 2019)</span>
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">description</span>
                    <span>Agrovet Terms of Service</span>
                  </a>
                </li>
                <li>
                  <a href="/payments-policy" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">smartphone</span>
                    <span>M-Pesa Daraja STK Security Policy</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-playfair font-bold text-sm text-white uppercase tracking-wider border-b border-[#14532d] pb-2">
                Support &amp; Deployment
              </h4>
              <div className="space-y-3 text-xs text-[#87c695]/90">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">support_agent</span>
                    <span>Direct Technical Support:</span>
                  </div>
                  <div className="pl-4 text-[11px] text-gray-300 space-y-0.5 mt-1">
                    <div>Hotline: <a href="tel:+254790509684" className="text-white font-bold hover:underline">+254 790 509 684</a></div>
                    <div>Email: <a href="mailto:ops@agroflow.co.ke" className="text-white hover:underline">ops@agroflow.co.ke</a></div>
                    <div className="text-[10px] text-emerald-400">Support Hours: Mon – Sat: 6:30 AM – 7:30 PM EAT</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">build</span>
                    <span>On-Site Counter Installation:</span>
                  </div>
                  <div className="pl-4 text-[11px] text-gray-300 mt-1 leading-relaxed">
                    Hardware, thermal receipt printer, barcode scanner, and offline SQLite terminal configuration available on-site for agribusinesses across Kenya.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#00170a] border-t border-[#14532d] py-5 text-[11px] text-[#87c695]/80">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#11bf36] animate-pulse"></span>
              <span>
                AgroFlow Agribusiness Operating System © 2026. Built with pride for Agrovet Operators in Kirinyaga &amp; across Kenya.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition-colors flex items-center gap-1 font-semibold"
              >
                <span>Top</span>
                <span className="material-symbols-outlined text-xs text-[#11bf36]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

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

      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-3xl w-full my-8 text-[#131b2e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#002410] text-white p-6 border-b border-[#14532d] flex items-start justify-between gap-4 sticky top-0 z-10">
              <div className="space-y-1.5">
                <div className="text-xs text-[#11bf36] font-semibold">
                  <span>{selectedArticle.readTime}</span>
                </div>
                <h3 className="font-playfair font-bold text-lg sm:text-xl text-white leading-tight">
                  {selectedArticle.title}
                </h3>
                <div className="text-xs text-gray-300">
                  <span>By {selectedArticle.author}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 overflow-y-auto text-xs sm:text-sm text-gray-700 leading-relaxed">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <div className="font-bold text-[#003b1b] text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#11bf36]">lightbulb</span>
                  <span>Operational Takeaway</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  {selectedArticle.summary}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {selectedArticle.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-0.5">
                    <div className="font-playfair font-bold text-base sm:text-lg text-[#003b1b]">{m.value}</div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-playfair font-bold text-base text-[#131b2e]">In-Depth Field Analysis</h4>
                {selectedArticle.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                    {p}
                  </p>
                ))}
              </div>

              <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                <h4 className="font-playfair font-bold text-sm text-[#003b1b] uppercase tracking-wide">
                  Key Recommendations for Store Owners
                </h4>
                <ul className="space-y-2">
                  {selectedArticle.takeaways.map((item, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2.5 text-xs text-gray-700">
                      <span className="material-symbols-outlined text-[#11bf36] text-base shrink-0">check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                  AgroFlow Agribusiness Advisory Service • Kenyan Agrovet Network
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+254790509684"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-xs text-[#11bf36]">call</span>
                    <span>Speak with Specialist</span>
                  </a>
                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      setActiveTab('login');
                    }}
                    className="px-5 py-2 bg-[#11bf36] hover:bg-[#0ea82f] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Open Counter POS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to Top"
        className="fixed bottom-6 right-6 z-40 bg-[#003b1b] text-[#11bf36] hover:bg-[#14532d] hover:text-white p-3 rounded-2xl shadow-xl border border-[#11bf36]/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-lg text-[#11bf36]">arrow_upward</span>
      </button>
    </div>
  );
};
