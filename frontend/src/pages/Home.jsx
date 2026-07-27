import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { uzbMapPaths } from '../data/uzb_map_paths';
import axios from 'axios';
import { 
  Users, MapPin, Building2, Award, Clock, Sparkles, ChevronRight, 
  Sun, ArrowRight, Play, Compass, Heart, Globe, Phone, DollarSign, Calendar,
  Shield, Landmark, Mountain, Smile, MessageSquare
} from 'lucide-react';
import { t } from '../utils/translations';

import { API_BASE } from '../config/api';

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

export default function Home({ currentLang }) {
  const navigate = useNavigate();
  const lang = currentLang?.code || 'it';
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [data, setData] = useState({ regions: [], news: [], attractions: [] });
  const [latestPlaces, setLatestPlaces] = useState([]);
  const sliderRef = useRef(null);
  
  const [homeFacts, setHomeFacts] = useState({
    headline: "O'zbekiston Sizni kutmoqda!",
    subtitle: "Boy tarix, betakror tabiat va samimiy mehmondo'stlik diyoriga xush kelibsiz!",
    aboutTitle: "O'zbekiston haqida",
    facts: [
      { id: "1", title: "36+ million", subtitle: "Aholisi", icon: "users" },
      { id: "2", title: "448 978 km²", subtitle: "Maydoni", icon: "mapPin" },
      { id: "3", title: "12 viloyat", subtitle: "1 respublika", icon: "building" },
      { id: "4", title: "Toshkent", subtitle: "Poytaxti", icon: "landmark" },
      { id: "5", title: "O'zbek so'mi", subtitle: "(UZS) valyutasi", icon: "dollar" },
      { id: "6", title: "O'zbek tili", subtitle: "Rasmiy tili", icon: "message" },
      { id: "7", title: "UTC +5", subtitle: "Vaqt mintaqasi", icon: "clock" },
      { id: "8", title: "1-sentyabr", subtitle: "Mustaqillik kuni", icon: "calendar" },
      { id: "9", title: "7 ta UNESCO", subtitle: "obyekti", icon: "award" }
    ]
  });

  const activeRegion = hoveredRegion || selectedRegion || {
    id: 'toshkent',
    name: 'Toshkent shahri',
    subtitle: "O'zbekiston poytaxti",
    population: '2.6M',
    monuments: '1,800+',
    places: '350+',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    labelX: 740,
    labelY: 200,
    link: '/regions/toshkent'
  };

  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/homeFacts`)
      .then(res => {
        if (res.data && res.data.headline) {
          setHomeFacts(res.data);
        }
      })
      .catch(err => console.error("homeFacts load error:", err));

    axios.get(`${API_BASE}/db`)
      .then(res => {
        const regions = res.data.regions || [];
        const attractions = res.data.attractions || [];
        const news = res.data.news || [];
        setData({
          regions: regions,
          news: news,
          attractions: attractions
        });

        if (news.length > 0) {
          setNewsItems(news);
        }

        const extracted = [];
        regions.forEach(r => {
          if (Array.isArray(r.famousPlaces)) {
            r.famousPlaces.forEach(fp => {
              extracted.push({
                ...fp,
                region: r.name,
                title: fp.name,
                image: fp.image,
                link: `/regions/${r.id}`
              });
            });
          }
        });

        if (extracted.length > 0) {
          setLatestPlaces(extracted.slice(0, 6));
        } else if (attractions.length > 0) {
          setLatestPlaces(attractions.slice(0, 6));
        }
      })
      .catch(err => console.error("db load error:", err));
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.max(1, latestPlaces.length));
    }, 4000);
    return () => clearInterval(timer);
  }, [latestPlaces.length]);

  const getRegionImage = (id, fallback) => {
    const found = data.regions.find(r => r.id === id || r.link?.endsWith(id) || r.name?.toLowerCase().includes(id.toLowerCase()));
    if (found && found.image) {
      return found.image;
    }
    return fallback;
  };

  const popularDestinations = [
    {
      title: lang === 'it' ? 'Samarcanda' : lang === 'en' ? 'Samarkand' : 'Samarqand',
      subtitle: lang === 'it' ? 'La perla della Via della Seta' : lang === 'en' ? 'Pearl of the Silk Road' : "Ipak yo'li durri",
      img: getRegionImage('samarqand', 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?auto=format&fit=crop&w=600&q=80'),
      link: '/regions/samarqand',
      badge1: 'UNESCO',
      badge2: lang === 'it' ? 'Storia' : lang === 'en' ? 'History' : 'Tarix'
    },
    {
      title: lang === 'it' ? 'Bukhara' : lang === 'en' ? 'Bukhara' : 'Buxoro',
      subtitle: lang === 'it' ? 'Città sacra medievale' : lang === 'en' ? 'Sacred medieval city' : 'Muqaddas shahar',
      img: getRegionImage('buxoro', 'https://uzbekistan.travel/storage/app/uploads/public/67b/6aa/42a/thumb_4635_740_0_0_0_auto.jpg'),
      link: '/regions/buxoro',
      badge1: 'UNESCO',
      badge2: lang === 'it' ? 'Cultura' : lang === 'en' ? 'Culture' : 'Madaniyat'
    },
    {
      title: lang === 'it' ? 'Khiva' : lang === 'en' ? 'Khiva' : 'Xiva',
      subtitle: lang === 'it' ? 'Città-museo vivente' : lang === 'en' ? 'Living museum city' : 'Muzey-shahar',
      img: getRegionImage('xiva', 'https://uzbekistan.travel/storage/app/uploads/public/688/061/308/thumb_4921_740_0_0_0_auto.jpg'),
      link: '/regions/xiva',
      badge1: 'UNESCO',
      badge2: lang === 'it' ? 'Architettura' : lang === 'en' ? 'Architecture' : 'Arxitektura'
    },
    {
      title: lang === 'it' ? 'Tashkent' : lang === 'en' ? 'Tashkent' : 'Toshkent',
      subtitle: lang === 'it' ? 'Capitale moderna' : lang === 'en' ? 'Modern capital' : 'Zamonaviy poytaxt',
      img: getRegionImage('toshkent', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'),
      link: '/regions/toshkent',
      badge1: lang === 'it' ? 'Città' : lang === 'en' ? 'City' : 'Shahar',
      badge2: lang === 'it' ? 'Modernità' : lang === 'en' ? 'Modern' : 'Zamonaviy'
    },
    {
      title: lang === 'it' ? 'Shahrisabz' : lang === 'en' ? 'Shahrisabz' : 'Shahrisabz',
      subtitle: lang === 'it' ? 'Città di Tamerlano' : lang === 'en' ? 'City of Tamerlane' : 'Temur shahri',
      img: getRegionImage('shahrisabz', 'https://uzbekistan.travel/storage/app/uploads/public/67b/6a7/96a/thumb_4624_740_0_0_0_auto.jpeg'),
      link: '/regions/shahrisabz',
      badge1: 'UNESCO',
      badge2: lang === 'it' ? 'Storia' : lang === 'en' ? 'History' : 'Tarix'
    }
  ];

  const getRegionGradient = (id, isHovered) => {
    const gradMap = {
      qoraqalpogiston: 'url(#gradQor)',
      navoiy: 'url(#gradNav)',
      buxoro: 'url(#gradBux)',
      xiva: 'url(#gradXiv)',
      samarqand: 'url(#gradSam)',
      shahrisabz: 'url(#gradQash)',
      termiz: 'url(#gradSur)',
      zomin: 'url(#gradJiz)',
      toshkent: 'url(#gradTosh)',
      namangan: 'url(#gradNam)',
      andijon: 'url(#gradAnd)',
      fargona: 'url(#gradFar)',
      guliston: 'url(#gradJiz)',
    };
    return gradMap[id] || 'url(#gradNav)';
  };

  const getFactIcon = (icon) => {
    const size = "w-3.5 h-3.5";
    switch(icon) {
      case 'users': return <Users className={size} />;
      case 'mapPin': return <MapPin className={size} />;
      case 'building': return <Building2 className={size} />;
      case 'landmark': return <Landmark className={size} />;
      case 'dollar': return <DollarSign className={size} />;
      case 'message': return <MessageSquare className={size} />;
      case 'clock': return <Clock className={size} />;
      case 'calendar': return <Calendar className={size} />;
      case 'award': return <Award className={size} />;
      default: return <Sparkles className={size} />;
    }
  };

  return (
    <div className="w-full bg-white text-slate-800 relative font-sans pt-20 pb-16 min-h-screen overflow-x-hidden">
      
      {/* Cohesive Full Page Background with Floating Ambient Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/70 via-emerald-50/30 to-slate-50/60 pointer-events-none overflow-hidden">
        {/* Floating Ambient Glowing Light Orbs */}
        <div className="absolute -top-10 right-10 w-[600px] h-[600px] bg-teal-300/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-40 -left-10 w-[500px] h-[500px] bg-emerald-400/15 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-[500px] right-10 w-[550px] h-[550px] bg-teal-200/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-[900px] left-10 w-[450px] h-[450px] bg-amber-200/15 rounded-full blur-3xl animate-pulse"></div>

        {/* Subtle Uzbek Pattern Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{ 
            backgroundImage: "url('/uzbek_pattern.png')", 
            backgroundRepeat: "repeat",
            backgroundSize: "260px auto"
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10 max-w-[1400px]">
        
        {/* TOP ROW: Headline & Buttons (Left) | Weather (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-3">
          
          {/* Top Left: Title & Buttons */}
          <div className="md:col-span-9 space-y-2">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              {homeFacts["headline_" + lang] || homeFacts.headline}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl">
              {homeFacts["subtitle_" + lang] || homeFacts.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Link 
                to="/tours" 
                className="bg-[#0c594d] hover:bg-[#09473d] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-lg shadow-teal-900/20 flex items-center gap-2 transition-all hover:gap-3"
              >
                <span>{t('exploreDestinations', currentLang.code)}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a 
                href="https://youtu.be/7i7miqyB8wY?si=VfjgGgi_kgKtlPTI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold text-xs px-3 py-2 rounded-full hover:bg-slate-200/50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-primary ml-0.5" />
                </div>
                <span>{t('watchVideo', currentLang.code)}</span>
              </a>
            </div>
          </div>

          {/* Top Right: Compact Weather Widget */}
          <div className="md:col-span-3 flex justify-end">
            <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-3 shadow-md shadow-teal-900/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                <Sun className="w-5 h-5 animate-[spin_20s_linear_infinite]" />
              </div>
              <div>
                <span className="text-xl font-serif font-bold text-slate-900 leading-none">33°C</span>
                <span className="block text-[9px] font-extrabold tracking-wider uppercase text-slate-700 mt-0.5">
                  {t('toshkentShahri', currentLang.code)}
                </span>
                <span className="block text-[9px] text-slate-400">{t('weatherSunny', currentLang.code)} • 14 m/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTERPIECE: SVG MAP AREA */}
        <div className="relative w-full aspect-[16/8.5] max-h-[550px] my-2">
          
          <svg 
            viewBox="0 0 1000 550" 
            className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(5,150,105,0.12)]"
          >
            <defs>
              <linearGradient id="gradQor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gradNav" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="gradBux" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="gradXiv" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gradSam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
              <linearGradient id="gradQash" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gradSur" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
              <linearGradient id="gradJiz" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="gradTosh" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <linearGradient id="gradNam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gradAnd" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="gradFar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gradHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gradSelected" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Base Shadow Layer */}
            <g transform="translate(2, 4)" opacity="0.1">
              {uzbMapPaths.map((reg) => (
                <path key={`sh-${reg.id}`} d={reg.d} fill="#1e1022" />
              ))}
            </g>

            {/* Main Vector Region Polygons with Reference Image Colors */}
            <g className="cursor-pointer">
              {uzbMapPaths.map((reg) => {
                const isSelected = activeRegion?.id === reg.id;
                const isHovered = hoveredRegion?.id === reg.id;

                const baseFill = reg.color || '#10b981';
                const fillVal = isSelected ? '#059669' : isHovered ? '#34d399' : baseFill;

                return (
                  <path
                    key={reg.id}
                    d={reg.d}
                    fill={fillVal}
                    stroke="#ffffff"
                    strokeWidth={isSelected || isHovered ? "2" : "1"}
                    className="transition-all duration-300 hover:brightness-110"
                    onMouseEnter={() => setHoveredRegion(reg)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => navigate(reg.link)}
                  />
                );
              })}
            </g>

            {/* Direct Clean Region Typography (Reference Image Style) */}
            <g className="select-none pointer-events-none">
              {uzbMapPaths.map((reg) => {
                const isSelected = activeRegion?.id === reg.id;
                const isHovered = hoveredRegion?.id === reg.id;
                const displayName = reg.displayName || reg.name;

                return (
                  <g 
                    key={`lbl-${reg.id}`} 
                    transform={`translate(${reg.labelX}, ${reg.labelY})`}
                    className="transition-all duration-300"
                  >
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSelected || isHovered ? "#064e3b" : "#2d1c34"}
                      stroke="#ffffff"
                      strokeWidth="0.4"
                      className="text-[9.5px] font-sans font-black tracking-wider uppercase"
                      style={{
                        paintOrder: 'stroke fill',
                        textShadow: '0px 1px 2px rgba(255,255,255,0.9)'
                      }}
                    >
                      {displayName}
                    </text>
                  </g>
                );
              })}
            </g>

          </svg>

        </div>

        {/* BOTTOM ROW: About Card (Left) | Popular Destinations (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mt-2">
          
          {/* Bottom Left: About Card */}
          <div className="md:col-span-4 xl:col-span-3 bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-xl shadow-teal-900/5 border border-slate-100 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">
                {homeFacts["aboutTitle_" + lang] || homeFacts.aboutTitle || "O'zbekiston haqida"}
              </h2>

              {/* 9 Facts Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-slate-800">
                {(homeFacts.facts || []).map((fact, idx) => (
                  <div key={fact.id || idx} className="space-y-0.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 mb-1">
                      {getFactIcon(fact.icon)}
                    </div>
                    <span className="block text-xs font-bold text-slate-900 truncate" title={fact["title_" + lang] || fact.title}>{fact["title_" + lang] || fact.title}</span>
                    <span className="text-[9px] text-slate-500 font-medium block truncate" title={fact["subtitle_" + lang] || fact.subtitle}>{fact["subtitle_" + lang] || fact.subtitle}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link 
              to="/about" 
              className="w-full py-2.5 bg-[#0c594d] hover:bg-[#084239] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>{t('readMore', currentLang.code)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bottom Right: Popular Destinations */}
          <div className="md:col-span-8 xl:col-span-9 flex flex-col justify-between">
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  {t('popularDestinations', currentLang.code)}
                </h2>
              </div>

              <Link 
                to="/regions" 
                className="text-teal-700 font-bold text-xs hover:underline flex items-center gap-1"
              >
                <span>{t('allDestinations', currentLang.code)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5 Destination Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {popularDestinations.map((dest, idx) => (
                <Link 
                  key={idx}
                  to={dest.link} 
                  className="group relative h-44 rounded-2xl overflow-hidden shadow-sm border border-slate-200 block"
                >
                  <img 
                    src={dest.img} 
                    alt={dest.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                  
                  <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500">
                    <Heart className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-0 inset-x-0 p-2.5 z-10 space-y-1">
                    <h3 className="text-xs font-bold text-white font-serif group-hover:text-teal-300 transition-colors leading-tight">
                      {dest.title}
                    </h3>
                    <p className="text-[9px] text-slate-300 opacity-90 line-clamp-1">
                      {dest.subtitle}
                    </p>

                    <div className="flex items-center gap-1 pt-0.5">
                      <span className="bg-white/20 backdrop-blur-md text-[8px] font-bold text-white px-1.5 py-0.5 rounded">
                        {dest.badge1}
                      </span>
                      <span className="bg-white/20 backdrop-blur-md text-[8px] font-bold text-white px-1.5 py-0.5 rounded">
                        {dest.badge2}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Feature Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-4 pt-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-1">
                  <Landmark className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">{t('heritage', currentLang.code)}</span>
                <span className="text-[9px] text-slate-500 block">{t('heritageDesc', currentLang.code)}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-1">
                  <Smile className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">{t('hospitality', currentLang.code)}</span>
                <span className="text-[9px] text-slate-500 block">{t('hospitalityDesc', currentLang.code)}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-1">
                  <Mountain className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">{t('nature', currentLang.code)}</span>
                <span className="text-[9px] text-slate-500 block">{t('natureDesc', currentLang.code)}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-1">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">{t('safeTravel', currentLang.code)}</span>
                <span className="text-[9px] text-slate-500 block">{t('safeTravelDesc', currentLang.code)}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">{t('allSeasons', currentLang.code)}</span>
                <span className="text-[9px] text-slate-500 block">{t('allSeasonsDesc', currentLang.code)}</span>
              </div>
            </div>

          </div>

        </div>

      </div>



      {/* Section 3: Latest Places / Go Uzbekistan Maskanlari */}
      {latestPlaces.length > 0 && (
        <section className="py-8 bg-transparent">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">
                  {t('newPlaces', currentLang.code)}
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  {t('latestPlacesDesc', currentLang.code)}
                </p>
              </div>
              <Link to="/go-uzbekistan" className="text-teal-700 font-bold text-xs hover:underline flex items-center gap-1">
                <span>{t('allPlaces', currentLang.code)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {latestPlaces.map((place, idx) => (
                <Link 
                  key={place._id || place.id || idx}
                  to={place.link || '/go-uzbekistan'}
                  className="group relative rounded-2xl overflow-hidden h-48 shadow-sm border border-slate-200/80 block transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img 
                    src={place.image || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=400&q=80'}
                    alt={place["name_" + lang] || place.name || place["title_" + lang] || place.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <h3 className="text-white font-bold text-xs leading-tight font-serif group-hover:text-teal-300 transition-colors">
                      {place["name_" + lang] || place.name || place["title_" + lang] || place.title}
                    </h3>
                    {place.region && (
                      <p className="text-white/75 text-[9px] mt-0.5 flex items-center gap-1 font-medium">
                        <MapPin className="w-2.5 h-2.5" />
                        {place.region}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
