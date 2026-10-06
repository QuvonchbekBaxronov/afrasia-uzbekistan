import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, Filter, Calendar, MapPin, Users, Star, 
  Clock, ShieldCheck, Check, Sparkles, ChevronRight,
  Compass, Mountain, Utensils, Landmark, ArrowUpDown, X
} from 'lucide-react';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';
import { getStoredData } from '../utils/dbStorage';

export default function Tours({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [tours, setTours] = useState(() => getStoredData('tours', []));
  const [loading, setLoading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(() => {
    const b = getStoredData('pageBanners', {});
    return b.tours || "/images/samarqand.jpg";
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [maxPrice, setMaxPrice] = useState(800);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-asc', 'price-desc', 'rating'

  useEffect(() => {
    const savedTours = getStoredData('tours', []);
    if (savedTours && savedTours.length > 0) {
      setTours(savedTours);
    }

    axios.get(`${API_BASE}/tours`)
      .then(res => {
        if (res.data && res.data.length > 0) setTours(res.data);
      })
      .catch(err => console.error("Tours load fallback:", err));

    axios.get(`${API_BASE}/pageBanners`)
      .then(res => {
        if (res.data && res.data.tours) {
          setBannerUrl(res.data.tours);
        }
      })
      .catch(err => console.error("Failed to load tours banner:", err));
  }, []);

  // Filtered & sorted tours
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const title = (tour[`title_${lang}`] || tour.title || '').toLowerCase();
      const desc = (tour[`description_${lang}`] || tour.description || '').toLowerCase();
      const regionText = (tour.region || tour[`region_${lang}`] || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      // Keyword Search
      if (q && !title.includes(q) && !desc.includes(q) && !regionText.includes(q)) {
        return false;
      }

      // Region Filter
      if (selectedRegion !== 'all') {
        if (selectedRegion === 'toshkent') {
          if (!regionText.includes('toshkent') && !regionText.includes('tashkent')) return false;
        } else if (!regionText.includes(selectedRegion.toLowerCase())) {
          return false;
        }
      }

      // Category Filter
      if (selectedCategory !== 'all') {
        if (tour.category !== selectedCategory) return false;
      }

      // Duration Filter
      if (selectedDuration !== 'all') {
        const days = tour.daysCount || (tour.duration?.includes('1') ? 1 : 2);
        if (selectedDuration === '1day' && days !== 1) return false;
        if (selectedDuration === '2-3days' && (days < 2 || days > 3)) return false;
        if (selectedDuration === '4+days' && days < 4) return false;
      }

      // Price Filter
      const price = tour.priceNum || parseInt(tour.price?.replace(/[^0-9]/g, '') || '100', 10);
      if (price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.priceNum || parseInt(a.price?.replace(/[^0-9]/g, '') || '0', 10);
      const priceB = b.priceNum || parseInt(b.price?.replace(/[^0-9]/g, '') || '0', 10);
      const ratingA = a.rating || 4.8;
      const ratingB = b.rating || 4.8;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return ratingB - ratingA;
      return 0; // featured default
    });
  }, [tours, lang, searchQuery, selectedRegion, selectedCategory, selectedDuration, maxPrice, sortBy]);

  const categories = [
    { id: 'all', name_uz: "Barcha turlar", name_en: "All Tours", name_it: "Tutti i Viaggi", icon: Compass },
    { id: 'cultural', name_uz: "Madaniy meros", name_en: "Cultural Heritage", name_it: "Cultura e Storia", icon: Landmark },
    { id: 'adventure', name_uz: "Tog' va Sarguzasht", name_en: "Mountain & Adventure", name_it: "Montagna e Natura", icon: Mountain },
    { id: 'gastronomic', name_uz: "Gastronomik", name_en: "Food & Culinary", name_it: "Gastronomia", icon: Utensils }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      
      {/* 1. Hero Header Banner */}
      <div className="relative h-[380px] md:h-[420px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <img 
          src={bannerUrl} 
          alt="Uzbekistan Tours" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-70 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-black/30 z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'it' ? 'Esperienze di Viaggio Esclusive' : lang === 'en' ? 'Exclusive Travel Experiences' : 'Eksklyuziv Sayohat Tajribalari'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white font-extrabold tracking-tight drop-shadow-lg">
            {lang === 'it' ? 'Prenota i Migliori Viaggi in Uzbekistan' : lang === 'en' ? 'Discover & Book Authentic Uzbekistan Tours' : "O'zbekiston Bo'ylab Eng Saralangan Sayohatlar"}
          </h1>
          
          <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
            {lang === 'it' 
              ? "Dalle vette alpine del Tian Shan a Tashkent fino alle maestose moschee turchesi di Samarcanda e Bukhara."
              : lang === 'en'
              ? "From the alpine peaks of Tian Shan in Tashkent to the timeless turquoise cupolas of Samarkand and Bukhara."
              : "Toshkentning moviy gumbazlari va Tyanshan tog'laridan to Registon maydonigacha bo'lgan unutilmas marshrutlar."}
          </p>
        </div>
      </div>

      {/* 2. Interactive Search & Filter Bar (Floating Bar) */}
      <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 md:p-6 space-y-4">
          
          {/* Top Search & Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'it' ? 'Cerca luogo o attività...' : lang === 'en' ? 'Search place or tour...' : 'Qidirish (shahar, obida)...'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Region Select */}
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">{lang === 'it' ? 'Tutte le destinazioni' : lang === 'en' ? 'All Destinations' : 'Barcha hududlar'}</option>
                <option value="toshkent">📍 Toshkent (Shahar & Viloyat)</option>
                <option value="samarqand">📍 Samarqand</option>
                <option value="buxoro">📍 Buxoro</option>
                <option value="xiva">📍 Xiva</option>
              </select>
            </div>

            {/* Duration Select */}
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <select 
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">{lang === 'it' ? 'Tutte le durate' : lang === 'en' ? 'Any Duration' : 'Har qanday davomiylik'}</option>
                <option value="1day">{lang === 'it' ? '1 Giorno (Giornata intera)' : lang === 'en' ? '1 Day (Full day)' : '1 kunlik tur'}</option>
                <option value="2-3days">{lang === 'it' ? '2-3 Giorni (Weekend/Breve)' : lang === 'en' ? '2-3 Days (Short trip)' : '2-3 kunlik'}</option>
                <option value="4+days">{lang === 'it' ? '4+ Giorni (Itinerario completo)' : lang === 'en' ? '4+ Days (Grand tour)' : '4+ kunlik katta tur'}</option>
              </select>
            </div>

            {/* Sort By Select */}
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option value="featured">{lang === 'it' ? 'In primo piano' : lang === 'en' ? 'Featured & Best' : 'Tavsiya etilgan'}</option>
                <option value="rating">{lang === 'it' ? 'Più votati (Rating)' : lang === 'en' ? 'Highest Rated' : 'Eng yuqori reyting'}</option>
                <option value="price-asc">{lang === 'it' ? 'Prezzo: crescente' : lang === 'en' ? 'Price: Low to High' : 'Narx: arzonroqdan'}</option>
                <option value="price-desc">{lang === 'it' ? 'Prezzo: decrescente' : lang === 'en' ? 'Price: High to Low' : 'Narx: qimmatroqdan'}</option>
              </select>
            </div>

          </div>

          {/* Category Tabs & Budget Slider */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{cat[`name_${lang}`] || cat.name_en}</span>
                  </button>
                );
              })}
            </div>

            {/* Price Slider Filter */}
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="font-medium whitespace-nowrap">
                {lang === 'it' ? 'Budget max:' : lang === 'en' ? 'Max budget:' : 'Maksimal narx:'} <strong className="text-slate-900">€{maxPrice}</strong>
              </span>
              <input 
                type="range" 
                min="50" 
                max="800" 
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 sm:w-32 accent-emerald-600 cursor-pointer"
              />
            </div>

          </div>

        </div>
      </div>

      {/* 3. Tour Results List & Cards */}
      <div className="container mx-auto px-4 max-w-7xl pt-12">
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              {lang === 'it' ? 'Tutti i Tour Disponibili' : lang === 'en' ? 'Available Tour Experiences' : 'Mavjud Sayohat Turlari'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredTours.length} {lang === 'it' ? 'itinerari trovati con disponibilità garantita' : lang === 'en' ? 'experiences found with live booking' : "ta tasdiqlangan sayohat topildi"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">{lang === 'it' ? 'Cancellazione gratuita fino a 24h prima' : lang === 'en' ? 'Free cancellation up to 24h before' : '24 soat oldin bepul bekor qilish'}</span>
            <span className="sm:hidden">{lang === 'it' ? 'Cancellazione gratuita' : lang === 'en' ? 'Free cancel' : 'Bepul bekor qilish'}</span>
          </div>
        </div>

        {/* Grid of Tour Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => {
            const tourTitle = tour[`title_${lang}`] || tour.title;
            const tourDuration = tour[`duration_${lang}`] || tour.duration;
            const tourPrice = tour[`price_${lang}`] || tour.price;
            const tourDesc = tour[`description_${lang}`] || tour.description;
            const tourRegion = tour[`region_${lang}`] || tour.region_uz || 'O\'zbekiston';
            const tourGroup = tour[`groupSize_${lang}`] || tour.groupSize || 'Maks. 10 kishi';
            const rating = tour.rating || 4.95;
            const reviews = tour.reviewsCount || 120;
            const badge = tour.badge || 'Popular';

            return (
              <div 
                key={tour.id} 
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tourTitle} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    onError={(e) => { e.target.src = '/images/samarqand.jpg'; }}
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm border border-white/10">
                      {badge}
                    </span>
                    {tour.category === 'adventure' && (
                      <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        🏔 {lang === 'it' ? 'Montagna' : lang === 'en' ? 'Mountain' : 'Tog\''}
                      </span>
                    )}
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{tourDuration}</span>
                  </div>

                  {/* Rating Tag */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-extrabold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{rating}</span>
                    <span className="text-slate-400 font-normal">({reviews})</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div>
                    {/* Location & Agency */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1.5">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <MapPin className="w-3 h-3" />
                        {tourRegion}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Users className="w-3 h-3" />
                        {tourGroup}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {tourTitle}
                    </h3>

                    {/* Description Excerpt */}
                    <p className="text-slate-500 text-xs line-clamp-2 mt-2 leading-relaxed font-light">
                      {tourDesc}
                    </p>
                  </div>

                  {/* Inclusions Micro-badges */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    <span className="bg-slate-50 text-slate-600 border border-slate-200/80 text-[10px] font-semibold px-2 py-0.5 rounded">
                      ✓ {lang === 'it' ? 'Guida Esperta' : lang === 'en' ? 'Expert Guide' : 'Gid'}
                    </span>
                    <span className="bg-slate-50 text-slate-600 border border-slate-200/80 text-[10px] font-semibold px-2 py-0.5 rounded">
                      ✓ {lang === 'it' ? 'Trasporto' : lang === 'en' ? 'Transport' : 'Transport'}
                    </span>
                    <span className="bg-slate-50 text-slate-600 border border-slate-200/80 text-[10px] font-semibold px-2 py-0.5 rounded">
                      ✓ {lang === 'it' ? 'Biglietti' : lang === 'en' ? 'All Tickets' : 'Biletlar'}
                    </span>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        {lang === 'it' ? 'A partire da' : lang === 'en' ? 'From' : 'Kishi boshiga'}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold font-serif text-slate-900">{tourPrice}</span>
                        <span className="text-[11px] text-slate-500 font-normal">/ {lang === 'it' ? 'persona' : lang === 'en' ? 'person' : 'kishi'}</span>
                      </div>
                    </div>

                    <Link 
                      to={`/tours/${tour.id}`} 
                      className="bg-slate-900 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm group-hover:bg-slate-800"
                    >
                      <span>{lang === 'it' ? 'Vedi Dettagli' : lang === 'en' ? 'View Details' : 'Batafsil'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTours.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl p-8 max-w-lg mx-auto">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {lang === 'it' ? 'Nessun tour trovato con questi filtri' : lang === 'en' ? 'No tours found with these filters' : 'Tanlangan parametrlar bo\'yicha sayohat topilmadi'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'it' ? 'Prova a modificare i filtri o la ricerca.' : lang === 'en' ? 'Try adjusting your search criteria or price slider.' : 'Filtrlarni tozalab qayta qidirib ko\'ring.'}
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
                setSelectedCategory('all');
                setSelectedDuration('all');
                setMaxPrice(800);
              }}
              className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-slate-800 transition-colors"
            >
              {lang === 'it' ? 'Azzera Filtri' : lang === 'en' ? 'Reset Filters' : 'Filtrlarni tiklash'}
            </button>
          </div>
        )}

      </div>

    </div>
  );
}