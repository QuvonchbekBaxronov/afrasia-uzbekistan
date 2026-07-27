import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function GoUzbekistan() {
  const [allPlaces, setAllPlaces] = useState([]);
  const [regionsList, setRegionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1600&q=80");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Barchasi');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');

  // Modal State for Place Detail
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fav_places') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    axios.get('http://localhost:3001/pageBanners')
      .then(res => {
        if (res.data && (res.data.goUzbekistan || res.data.regions)) {
          setBannerUrl(res.data.goUzbekistan || res.data.regions);
        }
      })
      .catch(err => console.error("Failed to load banner:", err));

    axios.get('http://localhost:3001/regions')
      .then(res => {
        const regions = res.data || [];
        setRegionsList(regions);

        // Aggregate all famous places across all regions
        const combined = [];
        regions.forEach(reg => {
          if (reg.famousPlaces && Array.isArray(reg.famousPlaces)) {
            reg.famousPlaces.forEach(place => {
              combined.push({
                ...place,
                regionId: reg.id,
                regionName: reg.name
              });
            });
          }
        });
        setAllPlaces(combined);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load regions:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedPlace]);

  const toggleFavorite = (place) => {
    let updated;
    const exists = favorites.some(f => f.name === place.name);
    if (exists) {
      updated = favorites.filter(f => f.name !== place.name);
    } else {
      updated = [...favorites, place];
    }
    setFavorites(updated);
    localStorage.setItem('fav_places', JSON.stringify(updated));
  };

  const isFavorite = (place) => favorites.some(f => f.name === place.name);

  // Web Speech synthesis audio guide
  const toggleTTS = (text) => {
    if (!('speechSynthesis' in window)) {
      alert("Kechirasiz, brauzeringiz matnni ovozga aylantirishni qo'llab-quvvatlamaydi.");
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
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

  const filteredPlaces = allPlaces.map(p => ({ ...p, category: detectCategory(p) })).filter(place => {
    const matchesSearch = place.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.history?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.regionName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'Barchasi' || place.regionId === selectedRegion || place.regionName === selectedRegion;
    const matchesCategory = selectedCategory === 'Barchasi' || 
                            place.category.toLowerCase() === selectedCategory.toLowerCase() ||
                            place.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesRegion && matchesCategory;
  });

  if (loading) {
    return <div className="text-center py-40 text-xl font-serif text-slate-800">Yuklanmoqda...</div>;
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      
      {/* Standardized Hero Banner */}
      <div className="relative h-[340px] md:h-[380px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40 z-10"></div>
        <img 
          src={bannerUrl} 
          alt="Go Uzbekistan" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-75 scale-105" 
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md mb-2">
            Diqqatga Sazovor Joylar va Obidalar
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            O'zbekistonning barcha viloyat va shaharlaridagi eng mashhur me'moriy obidalar, muzeylar, ziyoratgohlar va tabiiy maskanlar to'plami.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-10 md:py-12">
        
        {/* Search & Global Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 mb-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Barcha Diqqatga Sazovor Maskanlar ({filteredPlaces.length})</h2>
              <p className="text-xs text-slate-500 mt-1">Har bir joy haqida batafsil ma'lumot, rasmlar va manzillar</p>
            </div>

            {/* Global Search Input */}
            <div className="relative w-full md:w-80">
              <input 
                type="text"
                placeholder="Joy yoki shahar nomini qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-slate-800 transition-colors"
              />
            </div>
          </div>

          {/* Region Filter Tabs */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Viloyat bo'yicha saralash:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegion('Barchasi')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRegion === 'Barchasi' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Barcha Viloyatlar
              </button>
              {regionsList.map(reg => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedRegion === reg.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {reg.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kategoriya bo'yicha:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {filteredPlaces.map((place, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Showcase */}
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={place.image || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=800&q=80'} 
                      alt={place.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <Link 
                        to={`/regions/${place.regionId}`} 
                        className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/10 hover:bg-slate-900"
                      >
                        📍 {place.regionName}
                      </Link>
                      {place.category && (
                        <span className="bg-emerald-700/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/20">
                          {place.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2">
                      <span>Manzil: {place.location || place.regionName}</span>
                      {place.workHours && <span>• Ish vaqti: {place.workHours}</span>}
                    </div>

                    <Link to={`/place/${place.regionId}/${encodeURIComponent(place.name)}`}>
                      <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-tight">
                        {place.name}
                      </h3>
                    </Link>

                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {place.history}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 pb-5 pt-0 flex gap-2">
                  <Link 
                    to={`/place/${place.regionId}/${encodeURIComponent(place.name)}`} 
                    className="flex-1 bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-slate-800 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm text-center"
                  >
                    <span>Batafsil sahifa & Izohlar</span>
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
                      Xarita
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Hech qanday diqqatga sazovor joy topilmadi</h3>
            <p className="text-xs text-slate-500 mb-4">Qidiruv so'zini yoki saralash filtrlarini o'zgartirib ko'ring.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedRegion('Barchasi'); setSelectedCategory('Barchasi'); }}
              className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800"
            >
              Barcha joylarni ko'rsatish
            </button>
          </div>
        )}

      </div>

      {/* BATAFSIL MODAL (PLACE DETAILS) */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200">
            
            {/* Modal Close Button */}
            <button 
              onClick={() => { setSelectedPlace(null); if (speaking) toggleTTS(''); }}
              className="absolute top-4 right-4 z-30 bg-slate-900/80 hover:bg-slate-950 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all shadow-lg"
            >
              ✕
            </button>

            {/* Modal Header Banner Image */}
            <div className="relative h-72 sm:h-96 w-full">
              <img 
                src={selectedPlace.image || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1200&q=80'} 
                alt={selectedPlace.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex gap-2 mb-2">
                  <Link 
                    to={`/regions/${selectedPlace.regionId}`} 
                    className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 hover:bg-slate-800"
                  >
                    📍 {selectedPlace.regionName}
                  </Link>
                  {selectedPlace.category && (
                    <span className="bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                      {selectedPlace.category}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-1 leading-tight">{selectedPlace.name}</h2>
                <p className="text-slate-200 text-xs sm:text-sm">
                  Manzil: {selectedPlace.location || selectedPlace.regionName}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="block text-xs font-bold text-slate-400 uppercase">Ish vaqti</span>
                  <span className="text-sm font-bold text-slate-900">{selectedPlace.workHours || 'Har kuni ochiq'}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="block text-xs font-bold text-slate-400 uppercase">Kirish bilet narxi</span>
                  <span className="text-sm font-bold text-slate-900">{selectedPlace.ticketPrice || 'Ma\'lumot yo\'q'}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="block text-xs font-bold text-slate-400 uppercase">Joy turi</span>
                  <span className="text-sm font-bold text-slate-900">{selectedPlace.category || 'Diqqatga sazovor'}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap gap-3 p-4 bg-slate-900/5 rounded-2xl border border-slate-900/10 items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleTTS(selectedPlace.name + '. ' + (selectedPlace.history || ''))}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      speaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{speaking ? 'Gidni to\'xtatish' : 'Ovozli Gid (Tinglash)'}</span>
                  </button>

                </div>

                {selectedPlace.mapUrl && (
                  <a 
                    href={selectedPlace.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Google Maps'da ko'rish
                  </a>
                )}
              </div>

              {/* Detailed Description */}
              <div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Tarixi va Batafsil Ma'lumot</h3>
                <p className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {selectedPlace.history}
                </p>
              </div>

              {/* Map Embed preview if mapUrl exists */}
              {selectedPlace.mapUrl && selectedPlace.mapUrl.includes('http') && (
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">Xarita va Joylashuv</h3>
                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-200">
                    <span className="text-sm font-bold text-slate-700">Manzil: {selectedPlace.location || selectedPlace.regionName}</span>
                    <a 
                      href={selectedPlace.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800"
                    >
                      Xaritani ochish ↗
                    </a>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
