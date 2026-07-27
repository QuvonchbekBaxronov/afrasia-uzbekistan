import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';

export default function RegionDetail({ currentLang }) {
  const { id } = useParams();
  const lang = currentLang?.code || 'it';
  const [region, setRegion] = useState(null);
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'geography', 'places'

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fav_places') || '[]');
    } catch {
      return [];
    }
  });

  const aboutRef = useRef(null);
  const geoRef = useRef(null);
  const placesRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE}/regions/${id}`)
      .then(res => setRegion(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!region) return <div className="text-center py-40 text-xl font-serif text-slate-800">{lang === 'it' ? 'Caricamento in corso...' : lang === 'en' ? 'Loading...' : 'Yuklanmoqda...'}</div>;

  const scrollToSection = (ref, tabName) => {
    setActiveTab(tabName);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const detectCategory = (place) => {
    if (place.category && place.category.trim()) return place.category;
    const text = ((place.name || '') + ' ' + (place.history || '') + ' ' + (place.location || '')).toLowerCase();
    if (text.includes('muzey') || text.includes('savitskiy') || text.includes('museum')) return 'Muzey';
    if (text.includes('ziyorat') || text.includes('maqbara') || text.includes('masjid') || text.includes('bobo') || text.includes('sulton')) return 'Ziyoratgoh';
    if (text.includes('bog\'') || text.includes('park') || text.includes('maydon') || text.includes('yangi o\'zbekiston')) return 'Zamonaviy maskan';
    if (text.includes('tog\'') || text.includes('daryo') || text.includes('ko\'l') || text.includes('tabiat') || text.includes('orol')) return 'Tabiat';
    return 'Tarixiy obida';
  };

  const categories = ['Barchasi', 'Tarixiy obida', 'Zamonaviy maskan', 'Muzey', 'Ziyoratgoh', 'Tabiat'];

  const getCategoryTranslation = (cat) => {
    if (lang === 'it') {
      if (cat === 'Barchasi') return 'Tutti';
      if (cat === 'Tarixiy obida') return 'Monumento Storico';
      if (cat === 'Zamonaviy maskan') return 'Luogo Moderno';
      if (cat === 'Muzey') return 'Museo';
      if (cat === 'Ziyoratgoh') return 'Santuario';
      if (cat === 'Tabiat') return 'Natura';
    } else if (lang === 'en') {
      if (cat === 'Barchasi') return 'All';
      if (cat === 'Tarixiy obida') return 'Historical Monument';
      if (cat === 'Zamonaviy maskan') return 'Modern Place';
      if (cat === 'Muzey') return 'Museum';
      if (cat === 'Ziyoratgoh') return 'Shrine/Sanctuary';
      if (cat === 'Tabiat') return 'Nature';
    }
    return cat;
  };

  const filteredPlaces = (region.famousPlaces || []).map(p => ({ ...p, category: detectCategory(p) })).filter(place => {
    const placeName = place["name_" + lang] || place.name;
    const placeHistory = place["history_" + lang] || place.history;
    const placeLocation = place["location_" + lang] || place.location;
    
    const matchesSearch = placeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          placeHistory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          placeLocation?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Barchasi' || 
                       place.category.toLowerCase() === selectedCategory.toLowerCase() ||
                       place.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const regionName = region["name_" + lang] || region.name;
  const regionSlogan = region["slogan_" + lang] || region.slogan;
  const regionAbout = region["about_" + lang] || region.about;
  const regionGeography = region["geography_" + lang] || region.geography;
  const regionCenter = region["center_" + lang] || region.center;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      
      {/* 1. Hero Header Banner */}
      <div className="relative h-[48vh] min-h-[360px] w-full bg-slate-950 flex items-end justify-center overflow-hidden pb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/30 z-10"></div>
        <img 
          src={region.image} 
          alt={regionName} 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90 scale-105" 
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-white text-xs font-bold uppercase tracking-widest">{t('regions', currentLang.code)}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white font-bold mb-3 drop-shadow-md tracking-tight">
            {regionName}
          </h1>
          
          {regionSlogan ? (
            <p className="text-emerald-300 text-lg md:text-xl font-serif italic drop-shadow">{regionSlogan}</p>
          ) : (
            <p className="text-slate-300 text-base md:text-lg font-light drop-shadow">
              {lang === 'it' ? "Crocevia di storia e ricca cultura" : lang === 'en' ? "Crossroads of history and rich culture" : "Tarixiy obidalar va boy madaniyat chorrahasi"}
            </p>
          )}

          {/* Quick Stats Bar in Hero */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-6 pt-6 border-t border-white/15 text-xs text-white/90 font-medium">
            <div>{t('capitalLabel', currentLang.code)}: <b className="text-white">{regionCenter || regionName}</b></div>
            <div>•</div>
            <div>{t('populationLabel', currentLang.code)}: <b className="text-white">{region.population || '3,000,000+'}</b></div>
            <div>•</div>
            <div>
              {lang === 'it' ? 'Luoghi' : lang === 'en' ? 'Places' : 'Obidalar'}: <b className="text-white">{(region.famousPlaces || []).length}</b>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Layout (70% Content / 30% Rich Sidebar) */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Left Column (Main Content - 8 Cols) */}
          <div className="md:col-span-7 xl:col-span-8 space-y-8 md:space-y-10">
            
            {/* Tab 1: Viloyat Haqida */}
            <section ref={aboutRef} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 scroll-mt-28">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  {lang === 'it' ? 'Informazioni' : lang === 'en' ? 'About Region' : 'Viloyat haqida'}
                </h2>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                  {lang === 'it' ? 'Informazioni Generali' : lang === 'en' ? 'General Info' : "Umumiy ma'lumot"}
                </span>
              </div>

              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-8">
                {regionAbout}
              </p>

              {/* Highlights 4-Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {lang === 'it' ? "Patrimonio Storico" : lang === 'en' ? "Historical Heritage" : "Tarixiy Meros"}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {lang === 'it' ? "Crocevia della Via della Seta" : lang === 'en' ? "Crossroads of the Silk Road" : "Buyuk Ipak Yo'li Chorrahasi"}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'it' ? "Ha servito per secoli come centro culturale e commerciale." : lang === 'en' ? "Served as a cultural and trade center for centuries." : "Asrlar davomida madaniy va savdo markazi bo'lib xizmat qilgan."}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {lang === 'it' ? "Architettura" : lang === 'en' ? "Architecture" : "Me'morchilik"}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {lang === 'it' ? "Monumenti Rari" : lang === 'en' ? "Rare Monuments" : "Nodir Obidalar"}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'it' ? "Cupole blu e complessi monumentali antichi." : lang === 'en' ? "Blue domes and ancient monument complexes." : "Moviy gumbazlar va qadimiy obidalar majmuasi."}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {lang === 'it' ? "Gastronomia" : lang === 'en' ? "Gastronomy" : "Gastronomiya"}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {lang === 'it' ? "Cucina Nazionale" : lang === 'en' ? "National Cuisine" : "Milliy Oshxona"}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'it' ? "Ricette uniche e ricche tradizioni di servizio." : lang === 'en' ? "Unique recipes and rich serving traditions." : "O'ziga xos retseptlar va servirovka an'analari."}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {lang === 'it' ? "Artigianato" : lang === 'en' ? "Crafts" : "Hunarmandchilik"}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {lang === 'it' ? "Arti Applicate" : lang === 'en' ? "Applied Arts" : "Amaliy San'at"}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'it' ? "Ceramiche, ricami in oro e intaglio del legno." : lang === 'en' ? "Pottery, gold embroidery and wood carving." : "Kulolchilik, zardo'zlik va yog'och o'ymakorligi."}
                  </p>
                </div>
              </div>

              {/* Balanced Media Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-md h-64 sm:h-72 border border-slate-200 relative group">
                  <img 
                    src={region.image} 
                    alt={regionName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10">
                    {regionName}
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between border border-slate-800">
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-2">
                      {lang === 'it' ? "Raccomandazione" : lang === 'en' ? "Tourism Tips" : "Turizm Sayohat Tavsiyasi"}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-white mb-2">{t('bestTime', currentLang.code)}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {region.bestTimeToVisit || (lang === 'it' ? 'Primavera (Marzo - Maggio) e Autunno (Settembre - Novembre) offrono le condizioni migliori.' : lang === 'en' ? 'Spring (March - May) and Autumn (September - November) offer the most comfortable weather.' : 'Bahor va Kuz oylarida havo sharoiti eng qulay bo\'ladi.')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tab 2: Geografiya va Iqlim */}
            <section ref={geoRef} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 scroll-mt-28">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  {lang === 'it' ? 'Geografia e Clima' : lang === 'en' ? 'Geography and Climate' : 'Geografiyasi va Iqlimi'}
                </h2>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                  {lang === 'it' ? 'Natura e Posizione' : lang === 'en' ? 'Nature & Location' : 'Tabiat & Joylashuv'}
                </span>
              </div>

              <p className="text-slate-700 text-base leading-relaxed mb-6">
                {regionGeography || (lang === 'it' ? "Geografia, natura e clima unici di questa regione offrono incredibili opportunità per i visitatori." : lang === 'en' ? "Unique geography, nature, and climate of this region offer incredible opportunities for visitors." : "Mintaqaning tabiati va iqlimi o'ziga xos bo'lib, sayyohlar uchun keng imkoniyatlar yaratadi.")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {lang === 'it' ? "Condizioni Climatiche" : lang === 'en' ? "Climate Conditions" : "Iqlim Sharoiti"}
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {region.climate || (lang === 'it' ? "Continentale secco. Estate calda, inverno temperato." : lang === 'en' ? "Continental. Warm summer, temperate winter." : "Mo'tadil kontinental. Yoz issiq va quruq.")}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {lang === 'it' ? "Natura Regionale" : lang === 'en' ? "Regional Nature" : "Hududiy tabiati"}
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {lang === 'it' ? "Montagne, valli e oasi fluviali" : lang === 'en' ? "Mountains, plains and river valleys" : "Tog'lar, tekisliklar va daryo bo'ylari ziyoratgohlari"}
                  </span>
                </div>
              </div>
            </section>

            {/* Tab 3: Diqqatga Sazovor Joylar (Places) */}
            <section ref={placesRef} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 scroll-mt-28">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                    {lang === 'it' ? 'Attrazioni Turistiche' : lang === 'en' ? 'Sightseeing Attractions' : 'Diqqatga Sazovor Joylar'}
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    {lang === 'it' ? `Elenco dei luoghi storici e moderni più famosi di ${regionName}` : lang === 'en' ? `List of the most famous and historical places in ${regionName}` : `${regionName}ning eng mashhur va diqqatga sazovor maskanlari ro'yxati`}
                  </p>
                </div>
                
                {/* Search Bar inside Places */}
                <div className="relative w-full md:w-64">
                  <input 
                    type="text"
                    placeholder={lang === 'it' ? 'Cerca luogo...' : lang === 'en' ? 'Search place...' : 'Joyni qidirish...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-slate-800 transition-colors bg-slate-50"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              {region.famousPlaces && region.famousPlaces.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {getCategoryTranslation(cat)}
                    </button>
                  ))}
                </div>
              )}
              
              {filteredPlaces.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredPlaces.map((place, idx) => {
                    const placeName = place["name_" + lang] || place.name;
                    const placeHistory = place["history_" + lang] || place.history;
                    const placeLocation = place["location_" + lang] || place.location;
                    return (
                      <div 
                        key={idx} 
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image & Badges */}
                          <div className="h-52 overflow-hidden relative">
                            <img 
                              src={place.image || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=800&q=80'} 
                              alt={placeName} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {place.category && (
                              <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                {getCategoryTranslation(place.category)}
                              </span>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold uppercase tracking-wider mb-2">
                              <span>{lang === 'it' ? 'Indirizzo' : lang === 'en' ? 'Address' : 'Manzil'}: {placeLocation || regionName}</span>
                            </div>
                            
                            <h4 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-tight">
                              {placeName}
                            </h4>
                            
                            <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                              {placeHistory}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-5 pb-5 pt-0 flex gap-2">
                          <Link 
                            to={`/place/${region.id}/${encodeURIComponent(place.name)}`} 
                            className="flex-1 bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-slate-800 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm text-center"
                          >
                            <span>{t('readMore', currentLang.code)}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                          </Link>
                          
                          {place.mapUrl && (
                            <a 
                              href={place.mapUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center border border-slate-200"
                            >
                              {lang === 'it' ? 'Mappa' : lang === 'en' ? 'Map' : 'Xarita'}
                            </a>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-300">
                  <p className="text-slate-500 italic mb-2 text-sm">
                    {lang === 'it' ? 'Nessun luogo corrispondente trovato.' : lang === 'en' ? 'No matching places found.' : 'Hozircha mos keladigan diqqatga sazovor joy topilmadi.'}
                  </p>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-slate-900 text-xs font-bold hover:underline"
                    >
                      {lang === 'it' ? 'Pulisci Ricerca' : lang === 'en' ? 'Clear Search' : 'Qidiruvni tozalash'}
                    </button>
                  )}
                </div>
              )}
            </section>

          </div>

          {/* Right Column / Rich Tourism Sidebar */}
          <div className="md:col-span-5 xl:col-span-4 space-y-6">
            
            {/* Widget 1: Mundarija */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm sticky top-24">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">
                {lang === 'it' ? 'Indice della Pagina' : lang === 'en' ? 'Page Contents' : 'Sahifa Mundarijasi'}
              </h3>
              
              <ul className="space-y-2 mb-6">
                <li>
                  <button 
                    onClick={() => scrollToSection(aboutRef, 'about')}
                    className={`w-full text-left font-bold text-sm py-2.5 px-3 rounded-xl transition-all ${
                      activeTab === 'about' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lang === 'it' ? 'Informazioni' : lang === 'en' ? 'About Region' : 'Viloyat haqida'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection(geoRef, 'geography')}
                    className={`w-full text-left font-bold text-sm py-2.5 px-3 rounded-xl transition-all ${
                      activeTab === 'geography' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lang === 'it' ? 'Geografia e Clima' : lang === 'en' ? 'Geography and Climate' : 'Geografiyasi va Iqlimi'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection(placesRef, 'places')}
                    className={`w-full text-left font-bold text-sm py-2.5 px-3 rounded-xl transition-all ${
                      activeTab === 'places' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lang === 'it' ? 'Attrazioni' : lang === 'en' ? 'Attractions' : 'Diqqatga sazovor joylar'} ({(region.famousPlaces || []).length})
                  </button>
                </li>
              </ul>

              {/* Widget 2: Key Stats & Info */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">
                  {lang === 'it' ? 'Indicatori Principali' : lang === 'en' ? 'Key Stats' : 'Asosiy Ko\'rsatkichlar'}
                </h4>
                
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{t('populationLabel', currentLang.code)}:</span>
                  <span className="text-xs font-bold text-slate-900">{region.population || '3,000,000+'}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{t('capitalLabel', currentLang.code)}:</span>
                  <span className="text-xs font-bold text-slate-900">{regionCenter || regionName}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{lang === 'it' ? 'Fuso Orario' : lang === 'en' ? 'Time Zone' : 'Vaqt mintaqasi'}:</span>
                  <span className="text-xs font-bold text-slate-900">UTC+5 (UZT)</span>
                </div>
              </div>

              {/* Widget 3: Transport & How to Get There */}
              <div className="pt-5 border-t border-slate-100 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">
                  {lang === 'it' ? 'Trasporti e Collegamenti' : lang === 'en' ? 'Transport and Access' : 'Transport va Qatnov'}
                </h4>
                
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">
                    {lang === 'it' ? "Treni ad alta velocità e voli" : lang === 'en' ? "High-speed trains and flights" : "Xalqaro Aeroport & Poyezd"}
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {lang === 'it' ? "Ci sono collegamenti ferroviari ad alta velocità e voli diretti da Tashkent." : lang === 'en' ? "There are high-speed rail connections and direct flights from Tashkent." : "Toshkent, Samarqand va Buxoro yo'nalishlarida poyezd hamda parvozlar mavjud."}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}