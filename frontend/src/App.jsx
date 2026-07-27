import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Regions from './pages/Regions';
import RegionDetail from './pages/RegionDetail';
import Cuisine from './pages/Cuisine';
import CuisineDetail from './pages/CuisineDetail';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Art from './pages/Art';
import Language from './pages/Language';
import GoUzbekistan from './pages/GoUzbekistan';
import PlaceDetail from './pages/PlaceDetail';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccessibility } from './context/AccessibilityContext';
import { t } from './utils/translations';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  
  // Global Search Modal States
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDbData, setSearchDbData] = useState(null);

  useEffect(() => {
    if (searchModalOpen && !searchDbData) {
      axios.get('http://localhost:3001/db')
        .then(res => setSearchDbData(res.data))
        .catch(err => console.error("Failed to load search db data:", err));
    }
  }, [searchModalOpen, searchDbData]);
  
  const { pathname } = useLocation();
  const isHeroPage = pathname === '/';

  // Dark hero photo pages (Regions, Tours, Cuisine, Art, About, GoUzbekistan, Language)
  const isDarkHeroPage = 
    pathname.startsWith('/regions') ||
    pathname.startsWith('/tours') ||
    pathname.startsWith('/cuisine') ||
    pathname.startsWith('/art') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/go-uzbekistan') ||
    pathname.startsWith('/language');

  // Header modes:
  // 1. isWhiteTextHeader: Dark hero pages at scroll 0 (white text over dark photo)
  // 2. isHomeHeaderAtTop: Home page at scroll 0 (transparent header seamless with watercolor bg, dark green & slate text)
  const isWhiteTextHeader = !isHeroPage && isDarkHeroPage && !isScrolled;
  const isHomeHeaderAtTop = isHeroPage && !isScrolled;
  const isHeaderTransparent = isWhiteTextHeader;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const {
    fontSize,
    siteColor,
    showImages,
    speechEnabled,
    setSiteColor,
    setShowImages,
    setSpeechEnabled,
    increaseFontSize,
    decreaseFontSize,
    resetSettings
  } = useAccessibility();

  const languages = [
    { code: 'it', name: 'ITA', flag: 'https://flagcdn.com/w40/it.png' },
    { code: 'en', name: 'ENG', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'uz', name: 'UZB', flag: 'https://flagcdn.com/w40/uz.png' }
  ];

  const [currentLang, setCurrentLang] = useState(() => {
    const saved = sessionStorage.getItem('lang');
    if (saved) {
      const found = languages.find(l => l.code === saved);
      if (found) return found;
    }
    return languages[0]; // Italian (ITA) default on site entry
  });

  useEffect(() => {
    sessionStorage.setItem('lang', currentLang.code);
    localStorage.setItem('lang', currentLang.code);
  }, [currentLang]);

  const regionsDropdownList = [
    { name: "Toshkent viloyati", name_it: "Regione di Tashkent", name_en: "Tashkent Region", name_uz: "Toshkent viloyati", link: "/regions/toshkent" },
    { name: "Samarqand viloyati", name_it: "Regione di Samarcanda", name_en: "Samarkand Region", name_uz: "Samarqand viloyati", link: "/regions/samarqand" },
    { name: "Buxoro viloyati", name_it: "Regione di Bukhara", name_en: "Bukhara Region", name_uz: "Buxoro viloyati", link: "/regions/buxoro" },
    { name: "Xorazm (Xiva)", name_it: "Khorezm (Khiva)", name_en: "Khorezm (Khiva)", name_uz: "Xorazm (Xiva)", link: "/regions/xiva" },
    { name: "Qoraqalpog'iston Resp.", name_it: "Rep. del Karakalpakstan", name_en: "Rep. of Karakalpakstan", name_uz: "Qoraqalpog'iston Resp.", link: "/regions/qoraqalpogiston" },
    { name: "Qashqadaryo (Shahrisabz)", name_it: "Kashkadarya (Shahrisabz)", name_en: "Kashkadarya (Shahrisabz)", name_uz: "Qashqadaryo (Shahrisabz)", link: "/regions/shahrisabz" },
    { name: "Surxondaryo (Termiz)", name_it: "Surkhandarya (Termez)", name_en: "Surkhandarya (Termez)", name_uz: "Surxondaryo (Termiz)", link: "/regions/termiz" },
    { name: "Jizzax (Zomin)", name_it: "Jizzakh (Zaamin)", name_en: "Jizzakh (Zaamin)", name_uz: "Jizzax (Zomin)", link: "/regions/zomin" },
    { name: "Sirdaryo (Guliston)", name_it: "Syrdarya (Gulistan)", name_en: "Syrdarya (Gulistan)", name_uz: "Sirdaryo (Guliston)", link: "/regions/guliston" },
    { name: "Namangan viloyati", name_it: "Regione di Namangan", name_en: "Namangan Region", name_uz: "Namangan viloyati", link: "/regions/namangan" },
    { name: "Andijon viloyati", name_it: "Regione di Andijan", name_en: "Andijan Region", name_uz: "Andijon viloyati", link: "/regions/andijon" },
    { name: "Farg'ona viloyati", name_it: "Regione di Fergana", name_en: "Fergana Region", name_uz: "Farg'ona viloyati", link: "/regions/fargona" },
    { name: "Navoiy viloyati", name_it: "Regione di Navoiy", name_en: "Navoiy Region", name_uz: "Navoiy viloyati", link: "/regions/navoiy" }
  ];

  // Global Search logic across 4 categories in sequence
  const getSearchResults = () => {
    if (!searchQuery.trim() || !searchDbData) return { regions: [], places: [], cuisine: [], instruments: [] };
    const q = searchQuery.toLowerCase().trim();

    // 1. Viloyat Nomi (Regions)
    const regions = (searchDbData.regions || []).filter(r => {
      const name = (r[`name_${currentLang.code}`] || r.name_uz || r.name_it || r.name || '').toLowerCase();
      return name.includes(q);
    });

    // 2. Diqqatga Sazovor Joylar & Go Uzbekistan Obidalari
    const rawPlaces = [
      ...(searchDbData.famousPlaces || []),
      ...(searchDbData.attractions || []),
      ...(searchDbData.regions || []).flatMap(r => 
        (r.famousPlaces || []).map(p => ({ ...p, regionId: p.regionId || r.id, regionName: r.name_uz || r.name }))
      )
    ];

    const seenPlaceKeys = new Set();
    const uniquePlaces = [];

    rawPlaces.forEach(p => {
      const pName = (p[`title_${currentLang.code}`] || p.title || p[`name_${currentLang.code}`] || p.name_uz || p.name_it || p.name || '').trim();
      if (!pName) return;
      const key = pName.toLowerCase();
      if (!seenPlaceKeys.has(key)) {
        seenPlaceKeys.add(key);
        uniquePlaces.push({ ...p, displayName: pName });
      }
    });

    const places = uniquePlaces.filter(p => {
      const name = (p.displayName || '').toLowerCase();
      const loc = (p[`location_${currentLang.code}`] || p.location_uz || p.location_it || p.location || p.regionName || p.region_uz || '').toLowerCase();
      const desc = (p[`description_${currentLang.code}`] || p.description_uz || p.description_it || p.description || '').toLowerCase();
      return name.includes(q) || loc.includes(q) || desc.includes(q);
    });

    // 3. Ovqatlar (Cuisine)
    const cuisine = (searchDbData.cuisine || []).filter(c => {
      const name = (c[`name_${currentLang.code}`] || c.name_uz || c.name_it || c.name || '').toLowerCase();
      const cat = (c.category || '').toLowerCase();
      return name.includes(q) || cat.includes(q);
    });

    // 4. Cholg'u Asboblari (Instruments)
    const instruments = (searchDbData.instruments || []).filter(inst => {
      const name = (inst.name || '').toLowerCase();
      const desc = (inst[`description_${currentLang.code}`] || inst.description_uz || inst.description_it || inst.description || '').toLowerCase();
      return name.includes(q) || desc.includes(q);
    });

    return { regions, places, cuisine, instruments };
  };

  const searchResults = getSearchResults();
  const totalResultsCount = searchResults.regions.length + searchResults.places.length + searchResults.cuisine.length + searchResults.instruments.length;

  return (
    <div className={`flex flex-col min-h-screen font-sans ${siteColor !== 'normal' ? 'accessibility-mode' : ''}`}>
      <ScrollToTop />

      {/* Main Sticky Navbar with Accessibility Flyout */}
      <header 
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          isWhiteTextHeader
            ? 'bg-transparent border-b border-white/10'
            : isHomeHeaderAtTop
              ? 'bg-transparent border-b border-transparent'
              : 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-10 py-3 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/afrasia_logo.png?v=3" 
            alt="Afrasia Logo" 
            className="h-10 md:h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <span className={`font-sans font-extrabold text-2xl md:text-3xl tracking-wider transition-colors ${
            isWhiteTextHeader ? 'text-white drop-shadow-md' : 'text-[#0c594d]'
          }`}>
            Afrasia
          </span>
        </Link>

        <nav className={`hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-7 ${
          isWhiteTextHeader ? 'text-white drop-shadow-sm' : 'text-slate-800'
        }`}>
          
          <Link to="/" className="font-bold hover:text-teal-600 transition-colors text-[11px] xl:text-xs uppercase tracking-wider whitespace-nowrap">
            {t('home', currentLang.code)}
          </Link>

          <div className="group relative py-3">
            <Link to="/regions" className="font-bold cursor-pointer hover:text-teal-600 transition-colors text-[11px] xl:text-xs uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
              {t('regions', currentLang.code)}
            </Link>
            <div className="mega-menu absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl rounded-2xl py-4 z-50 border border-slate-200">
              <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
                {regionsDropdownList.map((reg, idx) => (
                  <Link 
                    key={idx} 
                    to={reg.link} 
                    className="px-6 py-1.5 text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors font-medium text-xs block"
                  >
                    {currentLang.code === 'it' ? reg.name_it : currentLang.code === 'en' ? reg.name_en : reg.name_uz}
                  </Link>
                ))}
                <div className="border-t border-slate-100 my-2 mx-6"></div>
                <Link 
                  to="/regions" 
                  className="px-6 py-1 text-teal-700 hover:underline transition-colors font-bold text-xs uppercase tracking-wider block"
                >
                  {t('allRegions', currentLang.code)}
                </Link>
              </div>
            </div>
          </div>

          <Link to="/tours" className="font-bold hover:text-teal-600 transition-colors text-[11px] xl:text-xs uppercase tracking-wider whitespace-nowrap">
            {t('tours', currentLang.code)}
          </Link>

          <Link to="/art" className="font-bold hover:text-teal-600 transition-colors text-[11px] xl:text-xs uppercase tracking-wider whitespace-nowrap">
            {t('art', currentLang.code)}
          </Link>

          <Link to="/cuisine" className="font-bold hover:text-teal-600 transition-colors text-[11px] xl:text-xs uppercase tracking-wider whitespace-nowrap">
            {t('cuisine', currentLang.code)}
          </Link>

          <Link to="/language" className="font-bold hover:text-teal-600 transition-colors text-[11px] xl:text-xs uppercase tracking-wider whitespace-nowrap">
            {t('language', currentLang.code)}
          </Link>
        </nav>

        {/* DESKTOP RIGHT SIDE ICONS: Search, Accessibility, Language */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          
          {/* GO UZBEKISTAN button - always visible on desktop */}
          <Link 
            to="/go-uzbekistan" 
            className={`flex bg-[#0c594d] hover:bg-[#09473d] text-white font-bold text-[10px] xl:text-xs uppercase tracking-widest px-3 xl:px-5 py-2 xl:py-2.5 rounded-full transition-all shadow-md hover:shadow-lg shadow-teal-900/20 whitespace-nowrap items-center`}
          >
            <span className="hidden xl:inline">{t('goUzbekistan', currentLang.code)}</span>
            <span className="xl:hidden">GO UZ</span>
          </Link>
          
          <button 
            onClick={() => setSearchModalOpen(true)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isWhiteTextHeader ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`} 
            title={t('search', currentLang.code)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button 
            onClick={() => setAccessOpen(!accessOpen)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              accessOpen 
                ? 'bg-[#0c594d] text-white shadow-md ring-2 ring-teal-400' 
                : isWhiteTextHeader
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
            title={t('accessibility', currentLang.code)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <div className="relative">
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                isWhiteTextHeader
                  ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }`}
            >
              <img 
                src={currentLang.flag} 
                alt={currentLang.name} 
                className="w-5 h-3.5 object-cover rounded-sm border border-slate-200/50" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = currentLang.code === 'it' 
                    ? 'https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg'
                    : currentLang.code === 'en'
                      ? 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg'
                      : 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg';
                }}
              />
              <span className="font-bold text-xs">{currentLang.name}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-[#0c594d] shadow-2xl rounded-xl py-1 text-white z-50 border border-teal-600/40 overflow-hidden backdrop-blur-md">
                {languages.map((lItem, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentLang(lItem);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 hover:bg-[#09473d] transition-colors flex items-center gap-2 font-bold text-xs ${
                      currentLang.code === lItem.code ? 'bg-[#09473d] text-teal-200' : 'text-white'
                    }`}
                  >
                    <img 
                      src={lItem.flag} 
                      alt={lItem.name} 
                      className="w-4 h-3 object-cover rounded-sm border border-white/20 shrink-0" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = lItem.code === 'it' 
                          ? 'https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg'
                          : lItem.code === 'en'
                            ? 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg'
                            : 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg';
                      }}
                    />
                    <span>{lItem.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      {/* MOBILE HEADER BUTTONS & HAMBURGER TRIGGER */}
      <div className="lg:hidden flex items-center gap-2">
        <button 
          onClick={() => setSearchModalOpen(true)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isWhiteTextHeader ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
          }`} 
          title={t('search', currentLang.code)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <button 
          onClick={() => setAccessOpen(!accessOpen)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            accessOpen 
              ? 'bg-[#0c594d] text-white shadow-md' 
              : isWhiteTextHeader
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-800'
          }`}
          title={t('accessibility', currentLang.code)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isWhiteTextHeader ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
          }`}
        >
          {mobileMenuOpen ? (
            <span className="text-base font-bold">✕</span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      </div>

      {/* iPHONE/iOS GLASS MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[60px] inset-x-0 bg-[#0c594d]/95 backdrop-blur-2xl text-white border-b border-teal-400/30 p-5 space-y-4 shadow-2xl z-50 animate-fadeIn">
          
          {/* Main 2-Column Grid Navigation Links */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-2xl flex items-center gap-2 transition-all border border-white/10"
            >
              <span>🏠</span>
              <span>{t('home', currentLang.code)}</span>
            </Link>

            <Link 
              to="/regions" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-2xl flex items-center gap-2 transition-all border border-white/10"
            >
              <span>🏙️</span>
              <span>{t('regions', currentLang.code)}</span>
            </Link>

            <Link 
              to="/tours" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-2xl flex items-center gap-2 transition-all border border-white/10"
            >
              <span>🗺️</span>
              <span>{t('tours', currentLang.code)}</span>
            </Link>

            <Link 
              to="/cuisine" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-2xl flex items-center gap-2 transition-all border border-white/10"
            >
              <span>🍲</span>
              <span>{t('cuisine', currentLang.code)}</span>
            </Link>

            <Link 
              to="/art" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-2xl flex items-center gap-2 transition-all border border-white/10"
            >
              <span>🪕</span>
              <span>{t('art', currentLang.code)}</span>
            </Link>

            <Link 
              to="/language" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-2xl flex items-center gap-2 transition-all border border-white/10"
            >
              <span>💬</span>
              <span>{t('language', currentLang.code)}</span>
            </Link>

            <Link 
              to="/go-uzbekistan" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-emerald-400 text-slate-950 font-black rounded-2xl flex items-center gap-2 transition-all shadow-md col-span-2 justify-center"
            >
              <span>🌟</span>
              <span>{t('goUzbekistan', currentLang.code)}</span>
            </Link>

            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center gap-2 transition-all border border-white/10 col-span-2 text-center text-[11px]"
            >
              <span>ℹ️</span>
              <span>{t('aboutHeroTitle', currentLang.code)}</span>
            </Link>
          </div>

          {/* Compact Language Selector Chips */}
          <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-200">
              🌐 {t('language', currentLang.code)}:
            </span>
            <div className="flex gap-1.5">
              {languages.map((lItem, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentLang(lItem);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                    currentLang.code === lItem.code
                      ? 'bg-white text-emerald-900 border-white shadow-md'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <img src={lItem.flag} alt={lItem.name} className="w-3.5 h-2.5 object-cover rounded-sm" />
                  <span>{lItem.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Accessibility Panel Dropdown (High Contrast Solid Overlay) */}
      {accessOpen && (
        <div 
          className="py-5 px-4 md:px-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-t border-teal-500/40 border-b border-black/40 animate-fade-in-up z-50 relative"
          style={{ backgroundColor: '#082e27', color: '#ffffff' }}
        >
          <div className="container mx-auto max-w-7xl">
            
            {/* Grid Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-start text-xs">
              
              {/* 1. Font Size */}
              <div>
                <h4 className="font-bold mb-2.5 uppercase tracking-wider text-teal-200">
                  {currentLang.code === 'it' ? 'Dimensione Font' : currentLang.code === 'en' ? 'Font Size' : "Shrift O'lchami"}
                </h4>
                <div className="flex gap-2">
                  <button 
                    onClick={decreaseFontSize} 
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl font-extrabold text-sm transition-colors text-white"
                    title={currentLang.code === 'it' ? 'Riduci Font' : currentLang.code === 'en' ? 'Decrease Font' : 'Kichiklashtirish'}
                  >
                    A-
                  </button>
                  <button 
                    onClick={increaseFontSize} 
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl font-extrabold text-sm transition-colors text-white"
                    title={currentLang.code === 'it' ? 'Ingrandisci Font' : currentLang.code === 'en' ? 'Increase Font' : 'Kattalashtirish'}
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* 2. Color Mode */}
              <div>
                <h4 className="font-bold mb-2.5 uppercase tracking-wider text-teal-200">
                  {currentLang.code === 'it' ? 'Modalità Colore' : currentLang.code === 'en' ? 'Color Mode' : 'Rang Rejimi'}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={() => setSiteColor('normal')} 
                    className={`w-9 h-9 rounded-xl border font-black text-xs flex items-center justify-center transition-all ${siteColor === 'normal' ? 'ring-2 ring-teal-300 border-white bg-white text-slate-900 shadow-md' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'}`} 
                    title={currentLang.code === 'it' ? 'Normale' : currentLang.code === 'en' ? 'Normal' : 'Odatiy'}
                  >
                    C
                  </button>
                  <button 
                    onClick={() => setSiteColor('bw')} 
                    className={`w-9 h-9 rounded-xl border font-black text-xs flex items-center justify-center transition-all ${siteColor === 'bw' ? 'ring-2 ring-teal-300 border-black bg-white text-black shadow-md' : 'border-white/20 bg-white text-black'}`} 
                    title={currentLang.code === 'it' ? 'Bianco e Nero' : currentLang.code === 'en' ? 'Black & White' : 'Oq-Qora'}
                  >
                    C
                  </button>
                  <button 
                    onClick={() => setSiteColor('wb')} 
                    className={`w-9 h-9 rounded-xl border font-black text-xs flex items-center justify-center transition-all ${siteColor === 'wb' ? 'ring-2 ring-teal-300 border-white bg-black text-white shadow-md' : 'border-white/20 bg-black text-white'}`} 
                    title={currentLang.code === 'it' ? 'Nero e Bianco' : currentLang.code === 'en' ? 'White & Black' : 'Qora-Oq'}
                  >
                    C
                  </button>
                  <button 
                    onClick={() => setSiteColor('sepia')} 
                    className={`w-9 h-9 rounded-xl border font-black text-xs flex items-center justify-center transition-all ${siteColor === 'sepia' ? 'ring-2 ring-teal-300 border-[#5b4636] bg-[#f4ecd8] text-[#5b4636] shadow-md' : 'border-white/20 bg-[#f4ecd8] text-[#5b4636]'}`} 
                    title={currentLang.code === 'it' ? 'Sepia' : currentLang.code === 'en' ? 'Sepia' : 'Sepiya'}
                  >
                    C
                  </button>
                </div>
              </div>

              {/* 3. Images & Speech */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold mb-1.5 uppercase tracking-wider text-teal-200">
                    {currentLang.code === 'it' ? 'Immagini' : currentLang.code === 'en' ? 'Show Images' : "Rasmlar"}
                  </h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowImages(true)} 
                      className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition-colors ${showImages ? 'bg-teal-400 text-slate-950 shadow-sm' : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'}`}
                    >
                      {currentLang.code === 'it' ? 'Attivo' : currentLang.code === 'en' ? 'On' : 'Yoqilgan'}
                    </button>
                    <button 
                      onClick={() => setShowImages(false)} 
                      className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition-colors ${!showImages ? 'bg-rose-500 text-white shadow-sm' : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'}`}
                    >
                      {currentLang.code === 'it' ? 'Disattivo' : currentLang.code === 'en' ? 'Off' : "O'chirilgan"}
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-1.5 uppercase tracking-wider text-teal-200">
                    {currentLang.code === 'it' ? 'Lettura Vocale' : currentLang.code === 'en' ? 'Speech Reader' : 'Ovozli O\'qish'}
                  </h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSpeechEnabled(true)} 
                      className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition-colors ${speechEnabled ? 'bg-teal-400 text-slate-950 shadow-sm' : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'}`}
                    >
                      {currentLang.code === 'it' ? 'Attivo' : currentLang.code === 'en' ? 'On' : 'Yoqilgan'}
                    </button>
                    <button 
                      onClick={() => setSpeechEnabled(false)} 
                      className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition-colors ${!speechEnabled ? 'bg-rose-500 text-white shadow-sm' : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'}`}
                    >
                      {currentLang.code === 'it' ? 'Disattivo' : currentLang.code === 'en' ? 'Off' : "O'chirilgan"}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Reset & Normal Version */}
              <div className="flex flex-col gap-2.5 justify-end h-full pt-1 sm:pt-0">
                <button 
                  onClick={resetSettings} 
                  className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors text-center border border-white/20"
                >
                  {currentLang.code === 'it' ? 'Ripristina Impostazioni' : currentLang.code === 'en' ? 'Reset Settings' : 'Sozlamalarni Tiklash'}
                </button>
                <button 
                  onClick={() => {
                    resetSettings();
                    setAccessOpen(false);
                  }} 
                  className="bg-teal-400 hover:bg-teal-300 text-slate-950 py-2 px-4 rounded-xl font-extrabold uppercase tracking-wider text-xs transition-colors text-center shadow-lg"
                >
                  {currentLang.code === 'it' ? 'Versione Normale' : currentLang.code === 'en' ? 'Normal Version' : 'Odatiy Versiyaga Qaytish'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </header>

      {!isHeroPage && !pathname.includes('/tours') && !pathname.includes('/regions') && !pathname.includes('/cuisine') && !pathname.includes('/about') && !pathname.includes('/art') && !pathname.includes('/language') && !pathname.includes('/go-uzbekistan') && !pathname.includes('/place') && (
        <div className="bg-[#fcfcfc] border-b border-gray-100 mt-[70px] py-4">
          <div className="container mx-auto px-4 lg:px-8 flex items-center gap-2 text-xs md:text-sm text-gray-500 font-semibold font-sans">
            <Link to="/" className="hover:text-primary transition-colors">{t('home', currentLang.code)}</Link>
            <span>/</span>
            {pathname.includes('regions') && (
              <>
                <Link to="/regions" className="hover:text-primary transition-colors">{t('regions', currentLang.code)}</Link>
                {pathname.split('/').length > 2 && (
                  <>
                    <span>/</span>
                    <span className="text-dark font-bold capitalize">{pathname.split('/').pop().replace('-', ' ')}</span>
                  </>
                )}
              </>
            )}
            {pathname.includes('cuisine') && (
              <span className="text-dark font-bold">
                {t('cuisine', currentLang.code)}
              </span>
            )}
            {pathname.includes('tours') && (
              <>
                <Link to="/tours" className="hover:text-primary transition-colors">{t('tours', currentLang.code)}</Link>
                {pathname.split('/').length > 2 && (
                  <>
                    <span>/</span>
                    <span className="text-dark font-bold">{t('details', currentLang.code)}</span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Page Content Routes */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home currentLang={currentLang} />} />
          <Route path="/regions" element={<Regions currentLang={currentLang} />} />
          <Route path="/regions/:id" element={<RegionDetail currentLang={currentLang} />} />
          <Route path="/cuisine" element={<Cuisine currentLang={currentLang} />} />
          <Route path="/cuisine/:id" element={<CuisineDetail currentLang={currentLang} />} />
          <Route path="/tours" element={<Tours currentLang={currentLang} />} />
          <Route path="/tours/:id" element={<TourDetail currentLang={currentLang} />} />
          <Route path="/about" element={<About currentLang={currentLang} />} />
          <Route path="/art" element={<Art currentLang={currentLang} />} />
          <Route path="/language" element={<Language currentLang={currentLang} />} />
          <Route path="/go-uzbekistan" element={<GoUzbekistan currentLang={currentLang} />} />
          <Route path="/place/:regionId/:placeName" element={<PlaceDetail currentLang={currentLang} />} />
          <Route path="/admin" element={<AdminPanel currentLang={currentLang} />} />
        </Routes>
      </div>

      {/* Compact & Clean Footer with Uzbek Pattern Backdrop */}
      <footer className="relative bg-[#05221d] text-white py-8 overflow-hidden font-sans border-t border-teal-900/60 shadow-lg">
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" 
          style={{ 
            backgroundImage: "url('/uzbek_pattern.png')", 
            backgroundRepeat: "repeat",
            backgroundSize: "auto 135px"
          }}
        ></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img 
                src="/afrasia_logo.png?v=3" 
                alt="Afrasia Logo" 
                className="h-10 md:h-12 w-auto object-contain drop-shadow-lg"
              />
              <span className="font-sans font-extrabold text-2xl md:text-3xl text-white tracking-wider">
                Afrasia
              </span>
            </Link>

            {/* Compact Horizontal Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm font-bold text-slate-100">
              <Link to="/regions" className="hover:text-amber-300 transition-colors">{t('regions', currentLang.code)}</Link>
              <Link to="/tours" className="hover:text-amber-300 transition-colors">{t('tours', currentLang.code)}</Link>
              <Link to="/cuisine" className="hover:text-amber-300 transition-colors">{t('cuisine', currentLang.code)}</Link>
              <Link to="/art" className="hover:text-amber-300 transition-colors">{t('art', currentLang.code)}</Link>
              <Link to="/language" className="hover:text-amber-300 transition-colors">{t('language', currentLang.code)}</Link>
              <Link to="/go-uzbekistan" className="hover:text-amber-300 transition-colors">{t('goUzbekistan', currentLang.code)}</Link>
              <Link to="/about" className="hover:text-amber-300 transition-colors">{t('aboutHeroTitle', currentLang.code)}</Link>
            </div>

            {/* Concise Contact Info & Discrete Admin Panel Link */}
            <div className="text-xs text-slate-200 text-center md:text-right space-y-1 shrink-0">
              <div>Email: <span className="font-bold text-white">baxronovquvonchbek11@gmail.com</span></div>
              <div>Telefon: <span className="font-bold text-white">+998 94 433 88 48</span></div>
              <div className="pt-1">
                <Link 
                  to="/admin" 
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-300/60 hover:text-amber-300 transition-colors opacity-50 hover:opacity-100 font-medium"
                  title="Admin Paneli"
                >
                  <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>{t('adminPanel', currentLang.code)}</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </footer>

      {/* MINIMAL & CLEAN GLOBAL SEARCH MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
            
            {/* Simple Clean Search Bar Header */}
            <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                autoFocus
                placeholder={
                  currentLang.code === 'it' 
                    ? "Cerca nel sito..." 
                    : currentLang.code === 'en'
                      ? "Search here..."
                      : "Qidirish uchun so'z yozing..."
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="text-slate-400 hover:text-slate-700 text-xs p-1 shrink-0"
                >
                  ✕
                </button>
              )}
              <button 
                onClick={() => setSearchModalOpen(false)} 
                className="text-slate-600 hover:text-slate-900 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shrink-0"
              >
                {currentLang.code === 'it' ? 'Chiudi' : currentLang.code === 'en' ? 'Close' : 'Yopish'}
              </button>
            </div>

            {/* Results Area */}
            <div className="p-4 overflow-y-auto space-y-5 flex-1">
              
              {!searchQuery.trim() ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  {currentLang.code === 'it' 
                    ? 'Digita per cercare regioni, attrazioni, piatti o strumenti.' 
                    : currentLang.code === 'en' 
                      ? 'Type to search regions, places, cuisine, or instruments.'
                      : 'Viloyat, diqqatga sazovor joy, taom yoki cholg\'u asbobi nomini kiriting.'}
                </div>
              ) : totalResultsCount === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs font-medium">
                  {currentLang.code === 'it' ? 'Nessun risultato trovato.' : currentLang.code === 'en' ? 'No results found.' : 'Hech narsa topilmadi.'}
                </div>
              ) : (
                <div className="space-y-5">
                  
                  {/* 1. VILOYATLAR */}
                  {searchResults.regions.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                        Viloyatlar ({searchResults.regions.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.regions.map(r => {
                          const rName = r[`name_${currentLang.code}`] || r.name_uz || r.name_it || r.name;
                          return (
                            <Link 
                              key={r.id} 
                              to={`/region/${r.id}`} 
                              onClick={() => setSearchModalOpen(false)}
                              className="flex items-center gap-3 p-2 hover:bg-slate-100/80 rounded-xl transition-colors"
                            >
                              <img src={r.image || '/uz_banner.png'} alt={rName} className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-xs text-slate-800 block truncate">{rName}</span>
                                <span className="text-[10px] text-slate-500">Viloyat</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. DIQQATGA SAZOVOR JOYLAR */}
                  {searchResults.places.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                        Diqqatga Sazovor Joylar ({searchResults.places.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.places.map((p, pIdx) => {
                          const pName = p.displayName || p[`title_${currentLang.code}`] || p.title || p[`name_${currentLang.code}`] || p.name_uz || p.name_it || p.name;
                          const pLoc = p[`location_${currentLang.code}`] || p.location_uz || p.location_it || p.location || p.regionName || p.region_uz || 'O\'zbekiston';
                          const placeLink = p.regionId ? `/place/${p.regionId}/${encodeURIComponent(pName)}` : `/place/${p.id || pIdx}`;

                          return (
                            <Link 
                              key={p.id || pIdx} 
                              to={placeLink} 
                              onClick={() => setSearchModalOpen(false)}
                              className="flex items-center gap-3 p-2 hover:bg-slate-100/80 rounded-xl transition-colors"
                            >
                              <img src={p.image || '/uz_banner.png'} alt={pName} className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-xs text-slate-800 block truncate">{pName}</span>
                                <span className="text-[10px] text-slate-500 truncate block">📍 {pLoc}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. OVQATLAR */}
                  {searchResults.cuisine.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                        Milliy Taomlar ({searchResults.cuisine.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.cuisine.map(c => {
                          const cName = c[`name_${currentLang.code}`] || c.name_uz || c.name_it || c.name;
                          return (
                            <Link 
                              key={c.id} 
                              to="/cuisine" 
                              onClick={() => setSearchModalOpen(false)}
                              className="flex items-center gap-3 p-2 hover:bg-slate-100/80 rounded-xl transition-colors"
                            >
                              <img src={c.image || '/uz_banner.png'} alt={cName} className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-xs text-slate-800 block truncate">{cName}</span>
                                <span className="text-[10px] text-slate-500">Milliy Taom</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4. CHOLG'U ASBOBLARI */}
                  {searchResults.instruments.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                        Cholg'u Asboblari ({searchResults.instruments.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.instruments.map(inst => (
                          <Link 
                            key={inst.id} 
                            to="/art" 
                            onClick={() => setSearchModalOpen(false)}
                            className="flex items-center gap-3 p-2 hover:bg-slate-100/80 rounded-xl transition-colors"
                          >
                            <img src={inst.image || '/uz_banner.png'} alt={inst.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-xs text-slate-800 block truncate">{inst.name}</span>
                              <span className="text-[10px] text-slate-500">Cholg'u Asbobi</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}