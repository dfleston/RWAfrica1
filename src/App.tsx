/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building, 
  Briefcase, 
  Scale, 
  User, 
  ArrowRight, 
  Check, 
  Download, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Mail, 
  AlertCircle, 
  ShieldCheck, 
  DollarSign, 
  Percent, 
  FileCheck, 
  MapPin, 
  Send,
  Loader2,
  Lock,
  Compass,
  BriefcaseBusiness,
  Award,
  BookOpen
} from 'lucide-react';
import { PROPERTIES, TIMELINE_STEPS, GEOPOLITICAL_THESIS, DISCOVERY_IMMERSIONS } from './data';
import { BrandType, Property, ApplicationState, ChatMessage } from './types';

export default function App() {
  // Brand Mode: Terroir (Olive/Forest), Gurumbé (Champagne), Savannah (Sienna/Sand)
  const [activeBrand, setActiveBrand] = useState<BrandType>('TERROIR');
  
  // Navigation
  const [activePage, setActivePage] = useState<'THESIS' | 'PORTFOLIO' | 'TECHNICAL' | 'WAITLIST'>('THESIS');
  
  // Property detail Drawer view
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // ROI property calculator inputs
  const [allocationAmount, setAllocationAmount] = useState<number>(100000); // Default €100,000

  // Active render index for image sliders
  const [currentRenderIdx, setCurrentRenderIdx] = useState<number>(0);

  // Application / Waitlist state
  const [application, setApplication] = useState<ApplicationState | null>(() => {
    const saved = localStorage.getItem('terroir_application');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  // Application form inputs
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTier, setFormTier] = useState('Starter');
  const [formJurisdiction, setFormJurisdiction] = useState('EU');
  const [formNotes, setFormNotes] = useState('');
  const [formAgree, setFormAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Advisor Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Welcome to the investor portal from our Nairobi desk. I am your specialized technical advisor. Ask me anything about our Kenyan geopolitical thesis, construction phases, tax structures inside special economic zones, or the refundable €900 Discovery reservation deposit.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to chat bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  // Persist application state
  const saveApplication = (app: ApplicationState | null) => {
    setApplication(app);
    if (app) {
      localStorage.setItem('terroir_application', JSON.stringify(app));
    } else {
      localStorage.removeItem('terroir_application');
    }
  };

  // Submit main application
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formAgree) {
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      const newApp: ApplicationState = {
        fullName: formName,
        email: formEmail,
        targetTier: formTier,
        jurisdiction: formJurisdiction,
        notes: formNotes,
        status: 'SUBMITTED',
        dateSubmitted: new Date().toLocaleDateString(),
        escrowDepositPaid: false
      };
      saveApplication(newApp);
      setIsSubmitting(false);
      setActivePage('WAITLIST');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // Simulate standard escrow payment
  const handleEscrowPayment = () => {
    if (!application) return;
    
    // Simulate updating application state to next phase
    const progressApp: ApplicationState = {
      ...application,
      escrowDepositPaid: true,
      status: 'RESERVATION_ESCROW'
    };
    saveApplication(progressApp);
  };

  // Fast forward steps for showcasing flow
  const handleSimulateApproval = () => {
    if (!application) return;
    const approvedApp: ApplicationState = {
      ...application,
      status: 'APPROVED'
    };
    saveApplication(approvedApp);
  };

  const handleSimulateActive = () => {
    if (!application) return;
    const activeApp: ApplicationState = {
      ...application,
      status: 'ACTIVE'
    };
    saveApplication(activeApp);
  };

  // Reset demo application
  const handleResetApplication = () => {
    if (window.confirm("Reset application data?")) {
      saveApplication(null);
      setFormName('');
      setFormEmail('');
      setFormAgree(false);
      setActivePage('THESIS');
    }
  };

  // Handle chat submission
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Build conversation history to send to server proxy
      const contextHistory = [...chatMessages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: contextHistory,
          brand: activeBrand === 'TERROIR' ? 'Terroir Capital' : activeBrand === 'GURUMBE' ? 'Gurumbé Capital' : 'Savannah Trust'
        })
      });

      if (!res.ok) {
        throw new Error("Failed to contact agent server.");
      }

      const data = await res.json();
      
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'model',
        content: data.reply || "Greetings. I received your packet but I am having trouble summarizing the parameters. Standard compliance answers indicate high-yield opportunities here.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'model',
        content: "Nairobi Desk Connection Warning: Our localized server is simulating responses offline. Our default targets remain 8-12% yield on prime urban assets with dynamic 10% corporate taxation within the Tatu Special Economic Zone.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Download simulation with formatted text visualization
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const handleDownloadDoc = (docName: string) => {
    setDownloadingDoc(docName);
    setTimeout(() => {
      setDownloadingDoc(null);
      // Actual file download emulation
      const content = `
========================================
${activeBrand === 'TERROIR' ? 'TERROIR CAPITAL' : activeBrand === 'GURUMBE' ? 'GURUMBÉ CAPITAL' : 'SAVANNAH TRUST'}
OFFICIAL DOSSIER & INFORMATION MEMORANDUM
========================================
Document: ${docName}
Security level: Strictly Confidential - Institutional Investors Only
Date Generated: ${new Date().toLocaleDateString()}

PROPOSAL OVERVIEW:
This memorandum offers private placement participation options inside high-yield properties located in Nairobi and Tatu City, Kenya.

JURISDICTIONAL DETAILS:
- Cayman/Luxembourg Feeder: Luxembourg SCSp (regulated by CSSF, fully MiCA Compliant).
- SPV Developer: Tatu City Developer SPV Ltd, structured as a certified SEZ (Special Economic Zone) entity.
- Target asset: Grade-A Real estate with tokenized proof-of-underlying ownership.

INVESTMENT PARAMETERS:
- Average target yield: 8-12% p.a. distributed quarterly.
- Average Target IRR: 14-19% p.a.
- Minimum Qualification: Starting at €25,000 to €150,000 depending on the asset class tier.

CONTACT CHANNELS:
Inquiries regarding regulatory audits or capital reservations should be addressed directly to:
legal@terroircapital.ch | compliance@gurumbecapital.com | desk@savannahtrust.int

========================================
End of Brief Doc Preview - Saved securely inside your download container.
      `;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docName.replace(/\s+/g, '_')}_Prospectus.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 1500);
  };

  // Theme Styling Maps
  const brandThemes = {
    TERROIR: {
      bg: 'bg-[#FAF8F2]',
      textPrimary: 'text-[#1C3E20]', // Deep forest green
      textSecondary: 'text-[#5C574F]',
      accent: 'bg-[#1C3E20]',
      accentHover: 'hover:bg-[#2B5E31]',
      borderGold: 'border-[#8E7E60]',
      textGold: 'text-[#8E7E60]',
      bgCard: 'bg-[#F2EDE2]',
      buttonGold: 'bg-[#8E7E60] hover:bg-[#796A51]',
      bannerGradient: 'from-[#EBE3D3] to-[#DFD6C2]',
      formBorder: 'border-[#CBBFA6]',
      buttonPrimary: 'bg-[#1C3E20] hover:bg-[#2D5A32] text-white',
      titleFont: 'font-serif',
      footerBg: 'bg-[#F2EDE2] border-t border-[#DFD6C2]',
      brandingLabel: 'TERROIR'
    },
    GURUMBE: {
      bg: 'bg-[#FDFCFA]', // pure minimalist champagne
      textPrimary: 'text-[#3E382F]',
      textSecondary: 'text-[#696156]',
      accent: 'bg-[#BCA362]',
      accentHover: 'hover:bg-[#CDAF6E]',
      borderGold: 'border-[#BCA362]',
      textGold: 'text-[#BCA362]',
      bgCard: 'bg-[#F6F4EB]',
      buttonGold: 'bg-[#BCA362] hover:bg-[#A89052]',
      bannerGradient: 'from-[#F3EFE0] to-[#E9DFCA]',
      formBorder: 'border-[#D1C6AE]',
      buttonPrimary: 'bg-[#BCA362] hover:bg-[#AB9151] text-white',
      titleFont: 'font-serif',
      footerBg: 'bg-[#F6F4EB] border-t border-[#E9DFCA]',
      brandingLabel: 'GURUMBÉ CAPITAL'
    },
    SAVANNAH: {
      bg: 'bg-[#FAF6EF]', // Sand, bronze
      textPrimary: 'text-[#4A2D16]', // rich copper/bronze
      textSecondary: 'text-[#705A4A]',
      accent: 'bg-[#C18E31]',
      accentHover: 'hover:bg-[#D59E3F]',
      borderGold: 'border-[#C18E31]',
      textGold: 'text-[#C18E31]',
      bgCard: 'bg-[#F2E8D7]',
      buttonGold: 'bg-[#C18E31] hover:bg-[#A87A27]',
      bannerGradient: 'from-[#EADDC2] to-[#DECBA5]',
      formBorder: 'border-[#D9C4A1]',
      buttonPrimary: 'bg-[#C18E31] hover:bg-[#AA7C26] text-white',
      titleFont: 'font-serif',
      footerBg: 'bg-[#F2E8D7] border-t border-[#DECBA5]',
      brandingLabel: 'SAVANNAH TRUST'
    }
  };

  const activeTheme = brandThemes[activeBrand];

  return (
    <div className={`min-h-screen ${activeTheme.bg} transition-colors duration-500 font-sans text-sm ${activeTheme.textSecondary} flex flex-col relative pb-16`}>
      
      {/* BRAND & ACCENT FLOATING PRESETS SWITCHER */}
      <div className="bg-neutral-900 text-neutral-400 py-1.5 px-4 text-xs flex justify-between items-center z-40 sticky top-0 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-[10px] tracking-wider text-neutral-300">Nairobi Desk &bull; LIVE CONNECTIVITY</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-neutral-300">Select Interface Version:</span>
          <div className="bg-neutral-800 p-0.5 rounded flex gap-1 border border-neutral-700">
            <button 
              id="brand-toggle-terroir"
              onClick={() => setActiveBrand('TERROIR')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeBrand === 'TERROIR' ? 'bg-[#1C3E20] text-white shadow-sm' : 'hover:text-neutral-200'
              }`}
            >
              Terroir
            </button>
            <button 
              id="brand-toggle-gurumbe"
              onClick={() => setActiveBrand('GURUMBE')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeBrand === 'GURUMBE' ? 'bg-[#BCA362] text-white shadow-sm' : 'hover:text-neutral-200'
              }`}
            >
              Gurumbé
            </button>
            <button 
              id="brand-toggle-savannah"
              onClick={() => setActiveBrand('SAVANNAH')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeBrand === 'SAVANNAH' ? 'bg-[#C18E31] text-white shadow-sm' : 'hover:text-neutral-200'
              }`}
            >
              Savannah
            </button>
          </div>
        </div>
      </div>

      {/* COMPACT TOP NAVIGATION BAR */}
      <header className="border-b border-stone-200 py-6 px-6 md:px-12 bg-opacity-70 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            id="brand-logo"
            onClick={() => setActivePage('THESIS')} 
            className="flex flex-col cursor-pointer"
          >
            <span className={`text-xl md:text-2xl font-serif tracking-[0.2em] font-medium ${activeTheme.textPrimary} uppercase transition-all duration-300`}>
              {activeTheme.brandingLabel}
            </span>
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-stone-400 mt-0.5">Capital &amp; Infrastructure</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest font-medium uppercase text-stone-500">
            <button 
              id="nav-thesis"
              onClick={() => { setActivePage('THESIS'); window.scrollTo({top:0, behavior:'smooth'}); }} 
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                activePage === 'THESIS' ? 'text-black font-semibold' : ''
              }`}
            >
              Thesis
              {activePage === 'THESIS' && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${activeTheme.accent}`}></span>}
            </button>
            <button 
              id="nav-portfolio"
              onClick={() => { setActivePage('PORTFOLIO'); window.scrollTo({top:0, behavior:'smooth'}); }} 
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                activePage === 'PORTFOLIO' ? 'text-black font-semibold' : ''
              }`}
            >
              Portfolio
              {activePage === 'PORTFOLIO' && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${activeTheme.accent}`}></span>}
            </button>
            <button 
              id="nav-technical"
              onClick={() => { setActivePage('TECHNICAL'); window.scrollTo({top:0, behavior:'smooth'}); }} 
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                activePage === 'TECHNICAL' ? 'text-black font-semibold' : ''
              }`}
            >
              Technical
              {activePage === 'TECHNICAL' && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${activeTheme.accent}`}></span>}
            </button>
            <button 
              id="nav-waitlist"
              onClick={() => { setActivePage('WAITLIST'); window.scrollTo({top:0, behavior:'smooth'}); }} 
              className={`hover:text-stone-900 transition-colors py-1 relative flex items-center gap-1.5 ${
                activePage === 'WAITLIST' ? 'text-black font-semibold' : ''
              }`}
            >
              {application ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  Waitlist Tracker
                </>
              ) : (
                "Waitlist"
              )}
              {activePage === 'WAITLIST' && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${activeTheme.accent}`}></span>}
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              id="cta-apply-main"
              onClick={() => {
                if (application) {
                  setActivePage('WAITLIST');
                } else {
                  setActivePage('THESIS');
                  setTimeout(() => {
                    const formEl = document.getElementById('application-form-panel');
                    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }} 
              className={`px-4 py-2 border ${activeTheme.borderGold} ${activeTheme.textGold} tracking-widest text-[11px] font-bold uppercase hover:bg-stone-900 hover:text-white transition-all`}
            >
              {application ? 'Tracker' : 'APPLY'}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE PAGE NAV BAR */}
      <div className="md:hidden flex justify-around border-b border-stone-200 bg-stone-50 py-3 text-xs uppercase tracking-wider font-semibold">
        <button id="mobile-nav-thesis" onClick={() => setActivePage('THESIS')} className={activePage === 'THESIS' ? activeTheme.textPrimary : 'text-stone-400'}>Thesis</button>
        <button id="mobile-nav-portfolio" onClick={() => setActivePage('PORTFOLIO')} className={activePage === 'PORTFOLIO' ? activeTheme.textPrimary : 'text-stone-400'}>Portfolio</button>
        <button id="mobile-nav-technical" onClick={() => setActivePage('TECHNICAL')} className={activePage === 'TECHNICAL' ? activeTheme.textPrimary : 'text-stone-400'}>Technical</button>
        <button id="mobile-nav-waitlist" onClick={() => setActivePage('WAITLIST')} className={activePage === 'WAITLIST' ? activeTheme.textPrimary : 'text-stone-400'}>{application ? 'Track' : 'Waitlist'}</button>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-8">

        {/* PAGE 1: THESIS VIEW */}
        {activePage === 'THESIS' && (
          <div className="space-y-16 animate-fade-in">
            {/* HERO SEGMENT WITH RENDER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
              <div className="lg:col-span-7 space-y-6">
                <span className={`text-[10px] tracking-[0.4em] font-bold uppercase ${activeTheme.textGold}`}>Discovery Program Portal</span>
                <h1 className={`text-4xl md:text-6xl ${activeTheme.titleFont} font-medium tracking-tight text-stone-900 leading-tight`}>
                  Discovery Program Application
                </h1>
                <p className="text-stone-600 leading-relaxed text-base max-w-xl">
                  Gain exclusive access to high-yield African real estate opportunities and institutional growth partnerships. Our curated, professional program offers ground-truth visibility and direct, asset-backed equity allocation.
                </p>

                {/* Fair-Play Guarantee Header Shield */}
                <div className={`p-5 rounded-lg border ${activeTheme.borderGold} bg-gradient-to-br ${activeTheme.bannerGradient} bg-opacity-35 space-y-2 flex items-start gap-4 shadow-sm`}>
                  <ShieldCheck className={`w-10 h-10 ${activeTheme.textGold} shrink-0 mt-1`} />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wide">Fair-Play Guarantee</h4>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      Your fully refundable <strong className="text-stone-950">€900 reservation deposit</strong> ensures serious intent. Absolutely no obligations—just secure, unredacted, first-person compliance and site inspections.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3D BUILDING MODEL INTERACTIVE PANEL */}
              <div className="lg:col-span-5 relative">
                <div className="border border-stone-200 bg-stone-100 rounded-lg p-3 shadow-xl overflow-hidden relative group">
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded text-[10px] tracking-widest font-mono text-stone-900 border border-stone-200 z-10 font-bold">
                    LOCATOR PROTOCOL: Nairobi, Kenya
                  </div>
                  <img 
                    src="/src/assets/images/kilimani_tower_1781550304150.jpg" 
                    alt="Nairobi Premium Block Model" 
                    className="w-full h-[320px] object-cover rounded shadow-inner"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 p-4 rounded border border-stone-100 space-y-1">
                    <p className={`font-serif text-base text-stone-900 font-semibold`}>Kilimani Expat Towers</p>
                    <div className="flex justify-between items-center text-xs">
                      <span>Target Yield: <strong className="text-stone-900">8-12% p.a.</strong></span>
                      <button 
                        id="hero-view-kilimani"
                        onClick={() => {
                          const p = PROPERTIES.find(x => x.id === 'kilimani-towers') || PROPERTIES[0];
                          setSelectedProperty(p);
                          setCurrentRenderIdx(0);
                        }}
                        className={`text-[11px] font-bold ${activeTheme.textGold} hover:underline flex items-center gap-1`}
                      >
                        Explore Specs <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: INVEST PROTOCOL */}
            <div className="border-t border-stone-200 pt-16 space-y-8">
              <div className="max-w-3xl space-y-3">
                <h2 className={`text-2xl md:text-3xl ${activeTheme.titleFont} text-stone-900`}>
                  The Discovery &amp; Invest Protocol
                </h2>
                <p className="text-base font-serif text-[#8A7955] italic">
                  Invest in Africa's Growth. See the Foundation First.
                </p>
                <p className="text-stone-600">
                  Don't just trust the prospectus—walk the soil. Join our exclusive 4-day, fully hosted investor site discovery summit in Nairobi to audit structural designs and regional infrastructure pipelines.
                </p>
              </div>

              {/* Protocol timeline Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {TIMELINE_STEPS.map((step) => (
                  <div key={step.id} className="bg-white border border-stone-200 rounded-lg p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                      <span className="font-mono text-stone-300 text-2xl font-bold">{step.id}</span>
                      <span className="font-mono text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded tracking-widest font-semibold">{step.phase}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-stone-900 text-sm tracking-tight">{step.title}</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTRODUCING PROMOTIONAL TIERS SEGMENT */}
            <div className="border-t border-stone-200 pt-16 space-y-8">
              <div className="space-y-3">
                <h2 className={`text-2xl md:text-3xl ${activeTheme.titleFont} text-stone-900`}>Promotional Tiers</h2>
                <p className="text-stone-500 max-w-xl">Structured allocation opportunities providing progressively deeper developer due-diligence access and lower structural fee brackets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* TIER 1 */}
                <div className="border border-stone-200 bg-white rounded-lg p-6 flex flex-col justify-between relative shadow-sm hover:border-stone-400 transition-all">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-stone-400 text-[10px] font-mono tracking-widest font-semibold">
                      <span>TIER 01</span>
                      <span className="bg-stone-50 p-1.5 rounded border border-stone-100">Starter</span>
                    </div>
                    <h3 className={`text-xl ${activeTheme.titleFont} font-bold text-stone-900`}>Starter</h3>
                    <p className="font-mono text-xs text-[#8E7E60] font-bold">€10,000 MIN</p>
                    <ul className="space-y-2 border-t border-stone-100 pt-4 text-xs">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Standard site-tour protocol</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Local administrative hosting</li>
                    </ul>
                  </div>
                </div>

                {/* TIER 2 */}
                <div className="border border-stone-200 bg-white rounded-lg p-6 flex flex-col justify-between relative shadow-sm hover:border-stone-400 transition-all">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-stone-400 text-[10px] font-mono tracking-widest font-semibold">
                      <span>TIER 02</span>
                      <span className="bg-stone-50 p-1.5 rounded border border-stone-100">Explorer</span>
                    </div>
                    <h3 className={`text-xl ${activeTheme.titleFont} font-bold text-stone-900`}>Explorer</h3>
                    <p className="font-mono text-xs text-[#8E7E60] font-bold">€25,000 MIN</p>
                    <ul className="space-y-2 border-t border-stone-100 pt-4 text-xs">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Extended property protocol</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 3-on-1 technical briefing</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Compliance certificate assist</li>
                    </ul>
                  </div>
                </div>

                {/* TIER 3 - REPLICATES THE EXACT SCREEN CARD SPEC */}
                <div className={`border-2 ${activeTheme.borderGold} bg-gradient-to-br ${activeTheme.bannerGradient} rounded-lg p-6 flex flex-col justify-between relative shadow-md overflow-hidden`}>
                  <div className="absolute -right-6 -top-6 bg-amber-500 text-white text-[9px] py-6 px-7 rotate-45 tracking-widest uppercase font-bold text-center">
                    VIP
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-stone-700 text-[10px] font-mono tracking-widest font-bold">
                      <span>TIER 03</span>
                      <span className="bg-white bg-opacity-70 px-2 py-0.5 rounded border border-stone-200">VIP Choice</span>
                    </div>
                    <h3 className={`text-xl ${activeTheme.titleFont} font-bold text-stone-900`}>VIP Series</h3>
                    <p className="font-mono text-xs text-stone-950 font-bold">€50,000 MIN</p>
                    <ul className="space-y-2 border-t border-stone-200 pt-4 text-xs text-stone-800">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 font-bold" /> Private chauffeur transport</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 font-bold" /> Executive Dinner with Founders</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 font-bold" /> Sovereign placement priority</li>
                    </ul>
                  </div>
                </div>

                {/* TIER 4 */}
                <div className="border border-stone-200 bg-white rounded-lg p-6 flex flex-col justify-between relative shadow-sm hover:border-stone-400 transition-all">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-stone-400 text-[10px] font-mono tracking-widest font-semibold">
                      <span>TIER 04</span>
                      <span className="bg-stone-50 p-1.5 rounded border border-stone-100">Sovereign</span>
                    </div>
                    <h3 className={`text-xl ${activeTheme.titleFont} font-bold text-stone-900`}>Sovereign</h3>
                    <p className="font-mono text-xs text-[#8E7E60] font-bold">€120,000+ MIN</p>
                    <ul className="space-y-2 border-t border-stone-100 pt-4 text-xs">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Custom bespoke itineraries</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Full legal structurisation help</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Board-level direct SPV reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* BEYOND THE PROPERTIES VISUAL IMAGERY ACCENTS */}
            <div className="border-t border-stone-200 pt-16 space-y-8">
              <div className="space-y-3">
                <h2 className={`text-2xl md:text-3xl ${activeTheme.titleFont} text-stone-900`}>Beyond the Properties</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* CULTURAL IMMERSION 1 */}
                <div className="space-y-3 group cursor-pointer">
                  <div className="overflow-hidden rounded-lg h-56 border border-stone-200 bg-stone-100 relative">
                    <img 
                      src="/src/assets/images/nairobi_culture_1781550346038.jpg" 
                      alt="Nairobi Culture" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-base font-serif font-semibold">
                      Nairobi Culture &amp; Skyline
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Exquisite fine-dining summits, rooftop investor mixers, and high-level regional political networking opportunities.
                  </p>
                </div>

                {/* CULTURAL IMMERSION 2 */}
                <div className="space-y-3 group cursor-pointer">
                  <div className="overflow-hidden rounded-lg h-56 border border-stone-200 bg-stone-100 relative">
                    <img 
                      src="/src/assets/images/coastal_retreat_1781550365408.jpg" 
                      alt="Coastal Experience" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-base font-serif font-semibold">
                      Coastal Diani Retreat
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Unwind in customized beachfront villas and marine reserves, discovering architectural potential along the coastal corridor.
                  </p>
                </div>

                {/* CULTURAL IMMERSION 3 */}
                <div className="space-y-3 group cursor-pointer">
                  <div className="overflow-hidden rounded-lg h-56 border border-stone-200 bg-stone-100 relative">
                    <img 
                      src="/src/assets/images/westlands_hub_1781550330467.jpg" 
                      alt="Kenyan Wildlife Nature" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-base font-serif font-semibold">
                      Nature &amp; Wildlife Safari
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Authentic private aviation safaris directly to private reserves, checking out decentralized off-grid infrastructure.
                  </p>
                </div>
              </div>
            </div>

            {/* BEGIN APPLICATION FORM */}
            <div id="application-form-panel" className="border-t border-stone-200 pt-16 flex justify-center pb-8">
              <div className="max-w-xl w-full bg-white border border-stone-200 rounded-xl p-8 shadow-lg space-y-6">
                <div className="text-center space-y-2">
                  <h3 className={`text-2xl ${activeTheme.titleFont} font-semibold text-stone-900`}>Begin Your Application</h3>
                  <p className="text-xs text-stone-500">Provide official identity and desired allocation tier. Our global legal team will call you within 48 hours.</p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-widest block">Full Name / Entity</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe or Apex Group Ltd"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className={`w-full p-3 bg-stone-50 rounded border ${activeTheme.formBorder} text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-widest block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="jane@apexholdings.lu"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className={`w-full p-3 bg-stone-50 rounded border ${activeTheme.formBorder} text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-widest block">Investment Tier</label>
                      <select 
                        value={formTier}
                        onChange={(e) => setFormTier(e.target.value)}
                        className={`w-full p-3 bg-stone-50 rounded border ${activeTheme.formBorder} text-sm focus:bg-white focus:outline-none transition-all`}
                      >
                        <option value="Starter">Starter (€10k - €25k)</option>
                        <option value="Explorer">Explorer (€25k - €50k)</option>
                        <option value="VIP">VIP Series (€50k+)</option>
                        <option value="Sovereign">Sovereign (€120k+)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-widest block">Jurisdiction</label>
                      <select 
                        value={formJurisdiction}
                        onChange={(e) => setFormJurisdiction(e.target.value)}
                        className={`w-full p-3 bg-stone-50 rounded border ${activeTheme.formBorder} text-sm focus:bg-white focus:outline-none transition-all`}
                      >
                        <option value="EU">European Union (MiCA)</option>
                        <option value="US">United States (Reg D)</option>
                        <option value="CH">Switzerland (FINMA)</option>
                        <option value="UK">United Kingdom (FCA)</option>
                        <option value="OTHER">International / Offshore</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-widest block">Brief Note / Objective (Optional)</label>
                    <textarea 
                      placeholder="Specify focus (e.g. logistics warehousing or long-term structural tax efficiency)"
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      rows={3}
                      className={`w-full p-3 bg-stone-50 rounded border ${activeTheme.formBorder} text-sm focus:bg-white focus:outline-none transition-all`}
                    ></textarea>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2">
                    <input 
                      type="checkbox" 
                      id="checkbox-privacy"
                      required
                      checked={formAgree}
                      onChange={(e) => setFormAgree(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                    />
                    <label htmlFor="checkbox-privacy" className="text-xs text-stone-500 leading-normal">
                      I agree to the <span className="underline cursor-pointer text-stone-800">Terms of Placement</span> and acknowledge the regulatory disclosures within our secure Swiss-custodial framework.
                    </label>
                  </div>

                  <button 
                    type="submit"
                    id="submit-form-button"
                    disabled={isSubmitting}
                    className={`w-full text-xs font-bold uppercase tracking-widest p-4 rounded-lg mt-3 flex justify-center items-center gap-2 ${activeTheme.buttonPrimary} shadow-sm transition-all`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing Dossier...
                      </>
                    ) : (
                      'SUBMIT APPLICATION'
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}


        {/* PAGE 2: PORTFOLIO SCREEN */}
        {activePage === 'PORTFOLIO' && (
          <div className="space-y-12 animate-fade-in">
            <div className="space-y-4 max-w-2xl">
              <h1 className={`text-4xl md:text-5xl ${activeTheme.titleFont} font-medium text-stone-900 tracking-tight`}>
                Curated African Growth
              </h1>
              <p className="text-stone-600 leading-relaxed text-sm">
                Our portfolio provides direct, institutional-grade access to high-yield opportunities across Africa's premier real estate &amp; logistics hubs. We target title-level ownership with top-tier European legal protection.
              </p>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {PROPERTIES.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-stone-300 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-64 bg-stone-100 overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white bg-opacity-95 text-[10px] tracking-widest font-mono text-stone-900 px-3 py-1 border border-stone-200 rounded font-semibold">
                      {property.location}
                    </div>
                    {property.status && (
                      <div className="absolute top-4 right-4 bg-[#8E7E60] text-white text-[9px] tracking-widest uppercase font-mono px-2.5 py-1 rounded font-bold">
                        {property.status}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className={`text-[10px] tracking-widest font-bold uppercase ${activeTheme.textGold}`}>
                        {property.tagline}
                      </span>
                      <h3 className={`text-xl font-bold text-stone-900 ${activeTheme.titleFont}`}>
                        {property.name}
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                        {property.description}
                      </p>
                    </div>

                    <div className="border-t border-stone-100 pt-4 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-mono">Minimum Invest</span>
                        <strong className="text-stone-900 text-sm">{property.investFrom}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-mono">Target Yield</span>
                        <strong className="text-stone-900 text-sm">{property.yieldTarget} p.a.</strong>
                      </div>
                    </div>

                    <button 
                      id={`view-details-${property.id}`}
                      onClick={() => {
                        setSelectedProperty(property);
                        setCurrentRenderIdx(0);
                      }}
                      className={`w-full py-3 text-xs tracking-widest font-bold uppercase border ${activeTheme.borderGold} ${activeTheme.textGold} rounded hover:bg-stone-900 hover:text-white transition-all`}
                    >
                      View Real-time Specs
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Portfolio ROI Simulation Module */}
            <div className="border border-stone-200 rounded-xl bg-white p-8 max-w-4xl mx-auto space-y-6 shadow-md mt-16">
              <div className="text-center space-y-2">
                <h3 className={`text-2xl ${activeTheme.titleFont} text-stone-900 font-semibold`}>Interactive Portfolio Allocator</h3>
                <p className="text-xs text-stone-500">Configure your target capital allocation to forecast annual distributions, structural returns, and exit payouts over a 5-year cycle.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-stone-50 p-6 rounded-lg">
                <div className="md:col-span-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-widest">Acreage Allocation capital</label>
                    <span className={`font-mono text-base font-bold ${activeTheme.textGold}`}>€{allocationAmount.toLocaleString()}</span>
                  </div>
                  
                  {/* Custom elegant slider input */}
                  <input 
                    type="range" 
                    min={25000} 
                    max={1000000} 
                    step={25000}
                    value={allocationAmount} 
                    onChange={(e) => setAllocationAmount(Number(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#8E7E60]"
                  />
                  
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>€25K MIN</span>
                    <span>€500K MID</span>
                    <span>€1M MAX</span>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-widest block">Proposed Portfolio Mix</label>
                    <div className="flex text-[10px] uppercase font-mono tracking-wider font-semibold rounded overflow-hidden">
                      <div className="bg-[#1C3E20] text-white p-2 text-center" style={{ width: '40%' }}>40% Towers</div>
                      <div className="bg-[#BCA362] text-white p-2 text-center" style={{ width: '30%' }}>30% Logis</div>
                      <div className="bg-[#C18E31] text-white p-2 text-center" style={{ width: '30%' }}>30% Hub</div>
                    </div>
                  </div>
                </div>

                {/* Return predictions outputs */}
                <div className="md:col-span-6 border-l border-stone-200 pl-0 md:pl-8 space-y-4">
                  <span className="text-[10px] tracking-wider font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold inline-block">Estimated Yield Returns</span>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-stone-100 shadow-sm">
                      <span className="text-stone-400 text-[9px] uppercase font-mono tracking-wider block">Est. Annual Cashflow</span>
                      <strong className={`text-stone-900 border-b-2 ${activeTheme.borderGold} text-lg`}>
                        €{Math.round(allocationAmount * 0.106).toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">&bull; ~10.6% Net Yield</span>
                    </div>

                    <div className="bg-white p-3 rounded border border-stone-100 shadow-xs">
                      <span className="text-stone-400 text-[9px] uppercase font-mono tracking-wider block">5-Year Equity Exit Return</span>
                      <strong className="text-stone-950 text-lg">
                        €{Math.round(allocationAmount * 1.74).toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-[#8E7E60] block mt-1 font-semibold">&bull; ~15.2% Avg IRR</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500 leading-normal bg-stone-100 p-3 rounded">
                    Forecast based on Tatu City special corporate tax offsets (10%) and contractual rental progression locks. Apply for verified ledger projections.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}


        {/* PAGE 3: TECHNICAL & DOSSIER */}
        {activePage === 'TECHNICAL' && (
          <div className="space-y-12 animate-fade-in">
            <div className="space-y-4 max-w-2xl">
              <h1 className={`text-4xl md:text-5xl ${activeTheme.titleFont} font-medium text-stone-900 tracking-tight`}>
                Legal &amp; Regulatory
              </h1>
              <p className="text-stone-600 leading-relaxed text-sm">
                Transparent institutional architecture and compliant frameworks. Direct underlying property security backed by Luxembourg capital protections and MiCA compliance.
              </p>
            </div>

            {/* Diagram layout */}
            <div className="border border-stone-200 bg-white rounded-xl p-8 shadow-sm space-y-8">
              <h3 className={`text-xl font-bold text-stone-900 text-center ${activeTheme.titleFont}`}>1. Corporate Structure</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Node 1 */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center mx-auto text-stone-700 font-bold">A</div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-stone-900">Investor Wallet</h4>
                  <p className="text-[11px] text-stone-500">Self-Custodial / Institutional Entity Entity</p>
                </div>

                {/* Arrow */}
                <div className="text-center text-stone-300 md:rotate-0 rotate-90 py-2">➔</div>

                {/* Node 2 */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 text-center space-y-2 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-150 border border-amber-300 text-[9px] tracking-wider font-mono text-amber-800 px-2 py-0.5 rounded font-bold uppercase">
                    MiCA Compliant
                  </div>
                  <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center mx-auto text-stone-700 font-bold">B</div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-stone-900">EU FEEDER VEHICLE</h4>
                  <p className="text-[11px] text-stone-500">Luxembourg SCSp Structure</p>
                </div>

                {/* Arrow */}
                <div className="text-center text-stone-300 md:rotate-0 rotate-90 py-2">➔</div>

                {/* Node 3 */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center mx-auto text-stone-700 font-bold">C</div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-stone-900">TATU CITY SPV</h4>
                  <p className="text-[11px] text-stone-500">Certified SEZ Title Holder</p>
                </div>
              </div>
            </div>

            {/* Advantages and Table Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              
              {/* Bullet list of advantages */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className={`text-xl font-bold text-stone-900 ${activeTheme.titleFont}`}>2. Jurisdictional Advantages</h3>
                
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-800 shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-950 text-sm">Tatu City Special Economic Zone (SEZ)</h4>
                      <p className="text-xs text-stone-500 leading-relaxed mt-0.5">Conferred specific regulatory and currency advantages under registered Kenyan legislation, including duty-free imports and unrestricted capital repatriation.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-800 shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-950 text-sm">EU Feeder (MiCA Compliant)</h4>
                      <p className="text-xs text-stone-500 leading-relaxed mt-0.5">Under CSSF Luxembourg supervision, ensuring transparent investor rights, zero transfer friction, and standard consumer legal protections.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-800 shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-950 text-sm">Corporate Tax Efficiency</h4>
                      <p className="text-xs text-stone-500 leading-relaxed mt-0.5">Optimized structuring allows a flat 10% developer corporate tax bracket instead of standard rural/urban 30%, which flows back directly into cash dividends.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Complete dossier action */}
              <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-stone-950 text-sm uppercase tracking-wider">Complete Legal Dossier</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Access unredacted land registry extracts, corporate articles, tokenization feasibility audits, tax registration forms, and our full Luxembourg feeder prospectus instantly.
                </p>

                <button 
                  id="dl-memo-dossier"
                  onClick={() => handleDownloadDoc("Full Regulatory Memorandum SCSp")}
                  disabled={!!downloadingDoc}
                  className={`w-full text-xs font-bold uppercase tracking-widest p-4 rounded-lg flex items-center justify-center gap-2 ${activeTheme.buttonPrimary}`}
                >
                  {downloadingDoc === "Full Regulatory Memorandum SCSp" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Ledger PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      DOWNLOAD FULL LEGAL MEMO
                    </>
                  )}
                </button>

                <div className="border-t border-stone-100 pt-4 text-xs space-y-2">
                  <p className="font-bold uppercase tracking-widest text-[#8E7E60]">Compliance Contact:</p>
                  <p className="text-stone-900">legal@terroircapital.ch | GENEVA, CHE</p>
                  <p className="text-[11px] text-stone-400">Route de Meyrin 49, Geneva, Switzerland</p>
                </div>
              </div>
            </div>

            {/* Asset Classification Table */}
            <div className="border border-stone-100 bg-white rounded-xl shadow-xs overflow-hidden pt-4">
              <h3 className={`text-xl font-bold text-stone-950 px-6 py-4 ${activeTheme.titleFont}`}>3. Asset Classification Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-y border-stone-200 uppercase tracking-wider text-[10px] font-bold text-stone-600">
                      <th className="p-4 pl-6">Property / Vehicle</th>
                      <th className="p-4">Legal Definition</th>
                      <th className="p-4">Regulatory Status</th>
                      <th className="p-4 pr-6">Auditor Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    <tr className="hover:bg-stone-50">
                      <td className="p-4 pl-6 font-bold">Token Type</td>
                      <td className="p-4">Real World Asset (RWA) Backed Security Token</td>
                      <td className="p-4 font-mono text-[11px]">Reg D (US) &bull; MiCA Compliant (EU)</td>
                      <td className="p-4 pr-6 text-[#1C3E20] font-semibold">CSSF Supervised</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="p-4 pl-6 font-bold">Luxembourg SCSp Feeder</td>
                      <td className="p-4">Alternative Investment Fund Feeder Vehicle</td>
                      <td className="p-4 font-mono text-[11px]">Fully Regulated</td>
                      <td className="p-4 pr-6 text-[#1C3E20] font-semibold">Deloitte Luxembourg Audit</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="p-4 pl-6 font-bold">Nairobi SPV Property Holder</td>
                      <td className="p-4">Special Purpose Vehicle Private Limited Asset Entity</td>
                      <td className="p-4 font-mono text-[11px]">Kenyan land development registration</td>
                      <td className="p-4 pr-6 text-[#1C3E20] font-semibold">PwC Nairobi Audit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}


        {/* PAGE 4: DETAILED WAITLIST & STATUS TRACKER FOR APPLICATION FLOW */}
        {activePage === 'WAITLIST' && (
          <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
            
            {/* NO APPLICATION SCREEN */}
            {!application && (
              <div className="bg-white border border-stone-200 rounded-xl p-12 text-center space-y-6 max-w-xl mx-auto shadow-md">
                <AlertCircle className={`w-16 h-16 ${activeTheme.textGold} mx-auto animate-pulse`} />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-stone-900">No Active Application Checked</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    You have not registered for our Nairobi Discovery Program waitlist yet. Submit the registration form on the main dashboard to establish your private legal file.
                  </p>
                </div>
                <button 
                  id="track-nav-home-apply"
                  onClick={() => {
                    setActivePage('THESIS');
                    setTimeout(() => {
                      const formEl = document.getElementById('application-form-panel');
                      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className={`px-6 py-3 tracking-widest text-xs uppercase font-bold text-white ${activeTheme.accent} rounded-lg`}
                >
                  REGISTER WITH US NOW
                </button>
              </div>
            )}

            {/* FILE REGISTERED: DISPLAY TRACKER DIRECTLY */}
            {application && (
              <div className="space-y-10">
                {/* Header Profile card */}
                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] tracking-widest text-[#8E7E60] font-bold uppercase">INVESTOR FILE DOSSIER</span>
                    <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                      {application.fullName}
                    </h2>
                    <p className="text-xs text-stone-500">
                      Registered: {application.dateSubmitted} &bull; Email: {application.email} &bull; Jurisdiction: <strong className="text-stone-800">{application.jurisdiction}</strong>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      id="reset-demo-dossier"
                      onClick={handleResetApplication}
                      className="px-3 py-1.5 border border-stone-300 text-stone-600 rounded hover:border-red-650 hover:text-red-500 text-xs transition-colors"
                    >
                      Delete File
                    </button>
                    {application.status === 'SUBMITTED' && (
                      <>
                        <button 
                          id="sim-approve"
                          onClick={handleSimulateApproval}
                          className="px-3 py-1.5 bg-stone-100 text-stone-800 border border-stone-300 text-xs rounded hover:bg-stone-200"
                        >
                          Simulate Verify Legal
                        </button>
                      </>
                    )}
                    {application.status === 'RESERVATION_ESCROW' && (
                      <button 
                        id="sim-approve"
                        onClick={handleSimulateApproval}
                        className="px-3 py-1.5 bg-stone-100 text-stone-800 border border-stone-300 text-xs rounded hover:bg-stone-200"
                      >
                        Simulate Approval
                      </button>
                    )}
                    {application.status === 'APPROVED' && (
                      <button 
                        id="sim-active"
                        onClick={handleSimulateActive}
                        className="px-3 py-1.5 bg-stone-100 text-stone-800 border border-stone-300 text-xs rounded hover:bg-stone-200"
                      >
                        Activate Credentials
                      </button>
                    )}
                  </div>
                </div>

                {/* THE PROTOCOL TIMELINE PROGRESS indicator */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  
                  {/* Step 1 Profile */}
                  <div className={`p-5 rounded-lg border ${
                    application.status !== 'SUBMITTED' ? 'border-emerald-300 bg-emerald-50 bg-opacity-30' : 'border-[#8E7E60] bg-white shadow-md'
                  }`}>
                    <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                      <span className="font-bold text-stone-400">01</span>
                      <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-emerald-800">INITIATED</span>
                    </div>
                    <div className="pt-3 space-y-1">
                      <h4 className="font-bold text-stone-900 text-xs uppercase">Dossier Registered</h4>
                      <p className="text-[11px] text-stone-500">Legal submission of placement preferences complete.</p>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-2">
                        <Check className="w-3.5 h-3.5" /> Checked &amp; Verified
                      </div>
                    </div>
                  </div>

                  {/* Step 2 Profile */}
                  <div className={`p-5 rounded-lg border ${
                    application.escrowDepositPaid 
                      ? 'border-emerald-300 bg-emerald-50 bg-opacity-30' 
                      : 'border-yellow-300 bg-yellow-50 bg-opacity-35 shadow-md'
                  }`}>
                    <div className="flex justify-between items-center pb-2 border-b border-yellow-101">
                      <span className="font-bold text-stone-400">02</span>
                      <span className={`text-[9px] uppercase font-mono tracking-widest font-bold ${application.escrowDepositPaid ? 'text-emerald-800' : 'text-amber-800'}`}>
                        {application.escrowDepositPaid ? 'DEPOSITED' : 'ACTION DUE'}
                      </span>
                    </div>
                    <div className="pt-3 space-y-1">
                      <h4 className="font-bold text-stone-900 text-xs uppercase">Escrow Deposit</h4>
                      <p className="text-[11px] text-stone-500">Fully refundable €900 deposit to secure your invitation.</p>
                      
                      {application.escrowDepositPaid ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-2">
                          <Check className="w-3.5 h-3.5" /> Escrow secured
                        </div>
                      ) : (
                        <div className="pt-2">
                          <button 
                            id="pay-refundable-deposit"
                            onClick={handleEscrowPayment} 
                            className="w-full py-1.5 bg-stone-900 hover:bg-stone-950 text-white rounded text-[10px] uppercase font-mono tracking-widest shadow-sm transition-all"
                          >
                            Pay Secure Escrow €900
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3 Profile */}
                  <div className={`p-5 rounded-lg border ${
                    ['APPROVED', 'ACTIVE'].includes(application.status) 
                      ? 'border-emerald-300 bg-emerald-50 bg-opacity-30' 
                      : 'border-stone-200 bg-white'
                  }`}>
                    <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                      <span className="font-bold text-stone-300">03</span>
                      <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-stone-400">LOGISTICS</span>
                    </div>
                    <div className="pt-3 space-y-1">
                      <h4 className="font-bold text-stone-850 text-xs uppercase">Flight &amp; Hosting</h4>
                      <p className="text-[11px] text-stone-400">We schedule your VIP transport &amp; luxury suite lodging.</p>
                      {['APPROVED', 'ACTIVE'].includes(application.status) ? (
                        <span className="text-[10px] text-emerald-700 font-bold block pt-2">✓ Configured</span>
                      ) : (
                        <span className="text-[10px] text-stone-400 block pt-2 italic">Awaiting Escrow/KYC</span>
                      )}
                    </div>
                  </div>

                  {/* Step 4 Profile */}
                  <div className={`p-5 rounded-lg border ${
                    application.status === 'ACTIVE' 
                      ? 'border-emerald-300 bg-emerald-50 bg-opacity-30' 
                      : 'border-stone-200 bg-white'
                  }`}>
                    <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                      <span className="font-bold text-stone-300">04</span>
                      <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-stone-400">ACTIVE ACTIVE</span>
                    </div>
                    <div className="pt-3 space-y-1">
                      <h4 className="font-bold text-stone-850 text-xs uppercase">Program Site-Tour</h4>
                      <p className="text-[11px] text-stone-400">4-day physical inspection and legal-briefing in Nairobi.</p>
                      {application.status === 'ACTIVE' ? (
                        <span className="text-[10px] text-emerald-700 font-bold block pt-2">✓ Ground-truth active</span>
                      ) : (
                        <span className="text-[10px] text-stone-400 block pt-2 italic">Awaiting Approval</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* ESCROW PAYMENT AND REGISTRATION CONTEXT DISCLOSURE BOX */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                  
                  {/* Left Column interactive panel */}
                  <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold text-stone-950 text-sm uppercase tracking-wider block">Security &amp; Refund Guarantee</h3>
                    
                    <p className="text-xs text-stone-600 leading-relaxed">
                      All deposit flows are routed through our registered escrow provider, <strong className="text-stone-900">Citadel Escrow Switzerland AG</strong>. If our regional technical committee determines standard pre-qualification metrics are not satisfied, or if you withdraw your registration dossier at any time before travel logistics booking, your deposit is instantly refunded to your original legal wallet or bank coordinates.
                    </p>

                    <div className="bg-stone-50 p-4 rounded border border-stone-100 flex items-start gap-4">
                      <FileCheck className="w-8 h-8 text-stone-400 shrink-0" />
                      <div className="space-y-1">
                        <span className="text-[10px] tracking-wider uppercase font-mono text-stone-400 block">Dossier File Ledger Id</span>
                        <code className="text-xs text-stone-900 font-mono font-semibold">T-LUX-2026-NBO-0039A</code>
                        <p className="text-[10px] text-stone-400">Hash verified on-chain and registered under Swiss regulatory protocol FAOP.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        id="dl-receipt-pdf"
                        onClick={() => handleDownloadDoc("Dossier Payment Receipt Security Lock")}
                        className="px-4 py-2 bg-stone-100 text-stone-900 text-xs font-semibold rounded hover:bg-stone-200 border border-stone-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Escrow Escrow Receipt
                      </button>
                      <button 
                        id="dl-prospectus-f"
                        onClick={() => handleDownloadDoc("Direct Placement SPV Prospectus")}
                        className="px-4 py-2 bg-stone-100 text-stone-900 text-xs font-semibold rounded hover:bg-stone-200 border border-stone-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Investor Prospectus Memo
                      </button>
                    </div>
                  </div>

                  {/* Right Column Custom dossier summary stats */}
                  <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                    <h4 className="font-bold text-stone-950 text-xs uppercase tracking-widest border-b border-stone-100 pb-2">Status Timeline Timeline</h4>
                    
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-400">File State:</span>
                        <strong className="text-stone-900">{application.status}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Target Tier:</span>
                        <strong className="text-stone-900">{application.targetTier} Tier</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Deposit Flow:</span>
                        <span className={`font-semibold ${application.escrowDepositPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {application.escrowDepositPaid ? 'SECURED' : 'AWAITING ACTIONS'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Review Committee:</span>
                        <strong className="text-stone-900">PricewaterhouseCoopers S.A.</strong>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER REPLICATING DESIGNS */}
      <footer className={`${activeTheme.footerBg} py-8 px-6 md:px-12 mt-20 relative transition-all duration-500`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-xs">
          <div>
            <h4 className={`text-stone-900 font-serif font-bold uppercase tracking-wider`}>{activeTheme.brandingLabel}</h4>
            <p className="text-[10px] text-stone-400 mt-1">
              &copy; 2026 {activeTheme.brandingLabel} Capital. All rights reserved.
            </p>
          </div>

          <div className="flex justify-center gap-6 uppercase tracking-wider text-stone-500 font-semibold text-[11px]">
            <span className="hover:text-stone-900 cursor-pointer">Legal Registry</span>
            <span className="hover:text-stone-900 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-stone-900 cursor-pointer">Swiss compliance</span>
          </div>

          <div className="text-left md:text-right text-[11px] text-stone-400 font-mono space-y-1">
            <p className="font-semibold text-stone-800">Office coordinates:</p>
            <p>Nairobi (Capital District) &bull; London (Mayfair) &bull; Geneva (Meyrin)</p>
          </div>
        </div>
      </footer>


      {/* PROPERTY DETAILS SLIDE-OVER DRAWER MODAL (MATCHES KILIMANI PREMIUM TOWERS SCREEN) */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-4xl bg-[#FAF8F5] h-full overflow-y-auto flex flex-col justify-between shadow-2xl relative">
            
            {/* Drawer Header Navbar */}
            <div className="bg-white border-b border-stone-200 py-4 px-6 flex justify-between items-center sticky top-0 z-20">
              <span className="font-serif tracking-[0.15em] font-bold text-stone-900 uppercase">
                {activeTheme.brandingLabel} &bull; Property Prospector
              </span>
              <button 
                id="close-property-drawer"
                onClick={() => setSelectedProperty(null)}
                className="p-1.5 hover:bg-stone-100 rounded-full text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Principal Drawer Content */}
            <div className="p-6 md:p-8 space-y-8 flex-1">
              
              {/* Heading */}
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.4em] font-bold text-[#8E7E60] uppercase block">
                  {selectedProperty.location} &bull; {selectedProperty.status}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-medium text-stone-900 tracking-tight leading-tight">
                  {selectedProperty.name}
                </h2>
                <p className="text-sm italic font-serif text-[#8E7E60]">{selectedProperty.tagline}</p>
              </div>

              {/* Display & Spec Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Building render view */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="border border-stone-200 bg-stone-100 rounded-lg overflow-hidden h-80 relative shadow-sm">
                    <img 
                      src={selectedProperty.renders[currentRenderIdx] || selectedProperty.image} 
                      alt="Property Render Portfolio View" 
                      className="w-full h-full object-cover transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Carousel Selection dots */}
                  <div className="flex gap-2.5 items-center justify-center">
                    {selectedProperty.renders.map((render, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentRenderIdx(idx)}
                        className={`w-2.5 h-2.5 rounded-full border transition-all ${
                          currentRenderIdx === idx ? 'bg-[#8E7E60] border-[#8E7E60] scale-110' : 'bg-transparent border-stone-400'
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Spec details card (mirroring screen) */}
                <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-5">
                  <div className="border-b border-stone-100 pb-3 space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono">Target Yield:</span>
                    <strong className="text-stone-900 text-2xl font-serif block tracking-tight">
                      {selectedProperty.yieldTarget}
                    </strong>
                  </div>

                  <div className="border-b border-stone-100 pb-3 space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono">Minimum Investment:</span>
                    <strong className="text-stone-900 text-2xl font-serif block tracking-tight">
                      {selectedProperty.investFrom}
                    </strong>
                  </div>

                  <div className="pb-2 space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono">Project Status:</span>
                    <strong className="text-[#8E7E60] text-xl font-serif block tracking-tight">
                      {selectedProperty.status}
                    </strong>
                  </div>

                  {/* Sidebar quick actions */}
                  <div className="space-y-2 pt-3 border-t border-stone-100">
                    <button 
                      id="drawer-dl-im"
                      onClick={() => handleDownloadDoc(`Information Memorandum ${selectedProperty.name}`)}
                      className="w-full text-xs font-bold uppercase tracking-widest p-3 bg-[#8E7E60] hover:bg-[#786950] text-white rounded transition-colors"
                    >
                      Download Memo Brief
                    </button>
                    <button 
                      id="drawer-chat-advisor"
                      onClick={() => {
                        setChatOpen(true);
                        // Push custom prompt context
                        setChatMessages(prev => [...prev, {
                          id: Math.random().toString(),
                          role: 'user',
                          content: `Let's discuss investment specs for the property: ${selectedProperty.name}`,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }, {
                          id: Math.random().toString(),
                          role: 'model',
                          content: `Certainly. The ${selectedProperty.name} in ${selectedProperty.location} targets an institutional yield of ${selectedProperty.yieldTarget} p.a. How can I assist you with corporate entity structuring or local tax frameworks for this specific asset?`,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]);
                      }}
                      className="w-full text-xs font-bold uppercase tracking-widest p-3 border border-stone-300 hover:bg-stone-50 text-stone-800 rounded transition-colors"
                    >
                      Speak to an Advisor
                    </button>
                  </div>
                </div>

              </div>

              {/* Detailed Description */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-stone-200 pt-6">
                <div className="lg:col-span-8 space-y-4">
                  <h4 className="font-bold text-stone-950 text-sm uppercase tracking-wider block">The Opportunity</h4>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {selectedProperty.opportunityText}
                  </p>
                </div>

                {/* Financial overview card */}
                <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
                  <span className="text-[10px] tracking-wider uppercase font-mono font-bold text-stone-400">Financial Modeling</span>
                  
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Projected IRR:</span>
                      <strong className="text-stone-900">{selectedProperty.targetIRR}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Exit Strategy:</span>
                      <strong className="text-stone-900 text-right">{selectedProperty.exitStrategy}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Asset Price:</span>
                      <strong className="text-stone-900">Price from {selectedProperty.priceFrom}</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Panel footer info disclaimer */}
            <div className="bg-stone-100 border-t border-stone-200 p-4 text-[10px] text-stone-400 text-center uppercase tracking-widest">
              CONFIDENTIAL DOCUMENT &bull; REPLICATION LICENSED TO CHIEF REGISTERED USERS ONLY
            </div>

          </div>
        </div>
      )}


      {/* AI INVESTMENT ADVISOR FLOATING CHAT BOX */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-80 md:w-96 bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[480px]">
            {/* Chat header */}
            <div className="bg-[#1C3E20] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-white">Chief Investment Advisor</h4>
                  <p className="text-[9px] text-emerald-100 font-mono">Nairobi Desk Connected</p>
                </div>
              </div>
              <button 
                id="close-chat"
                onClick={() => setChatOpen(false)}
                className="p-1 hover:bg-stone-800 rounded text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50">
              {chatMessages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-[#1C3E20] text-white rounded-br-none' 
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-xs'
                  }`}>
                    <p>{m.content}</p>
                    <span className={`text-[8px] block mt-1 text-right ${
                      m.role === 'user' ? 'text-stone-300' : 'text-stone-400'
                    }`}>{m.timestamp}</span>
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-lg rounded-bl-none p-3 shadow-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="border-t border-stone-200 p-2.5 flex gap-2 bg-white">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about Tatu City taxes, €900 deposit..."
                className="flex-1 p-2 bg-stone-50 rounded border border-stone-200 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button 
                type="submit"
                id="send-chat-button"
                className="p-2 bg-[#1C3E20] text-white rounded hover:bg-[#2B5E31] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Toggle chat bubble button */}
        <button 
          id="btn-toggle-advisor-chat"
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-[#1C3E20] hover:bg-[#2B5E31] text-white p-4 rounded-full shadow-2xl flex items-center gap-2 tracking-widest text-xs font-bold uppercase transition-transform scale-100 hover:scale-105"
        >
          <MessageSquare className="w-5 h-5" />
          <span>ASK Chief Advisor</span>
        </button>
      </div>

    </div>
  );
}
