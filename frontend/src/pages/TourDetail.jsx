import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, Clock, Users, Star, MapPin, Check, X, 
  ShieldCheck, Share2, Heart, MessageCircle, Mail, Phone,
  ChevronDown, ChevronUp, Sparkles, AlertCircle, Award, Compass
} from 'lucide-react';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';
import { getStoredData } from '../utils/dbStorage';

export default function TourDetail({ currentLang }) {
  const { id } = useParams();
  const lang = currentLang?.code || 'it';
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(null);
  const [openDays, setOpenDays] = useState({ 0: true }); // Open Day 1 by default

  // Booking Widget State
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(tomorrowStr);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [extraGuide, setExtraGuide] = useState(false);
  const [extraVipTransport, setExtraVipTransport] = useState(false);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  useEffect(() => {
    setLoading(true);
    const savedTours = getStoredData('tours', []);
    const found = savedTours.find(t => t.id === id);

    if (found) {
      setTour(found);
      setActivePhoto(found.image);
      setLoading(false);
    } else {
      axios.get(`${API_BASE}/tours/${id}`)
        .then(res => {
          if (res.data) {
            setTour(res.data);
            setActivePhoto(res.data.image);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Tour fetch error:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="font-serif text-lg text-slate-700 animate-pulse">
          {lang === 'it' ? 'Caricamento del viaggio...' : lang === 'en' ? 'Loading tour itinerary...' : 'Sayohat ma\'lumotlari yuklanmoqda...'}
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <h2 className="text-2xl font-bold font-serif text-slate-800 mb-2">
          {lang === 'it' ? 'Viaggio non trovato' : lang === 'en' ? 'Tour not found' : 'Sayohat topilmadi'}
        </h2>
        <Link to="/tours" className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs mt-4">
          ← {lang === 'it' ? 'Torna a tutti i viaggi' : lang === 'en' ? 'Back to tours' : 'Barcha turlarga qaytish'}
        </Link>
      </div>
    );
  }

  const tourTitle = tour[`title_${lang}`] || tour.title;
  const tourDuration = tour[`duration_${lang}`] || tour.duration;
  const tourPrice = tour[`price_${lang}`] || tour.price;
  const basePriceNum = tour.priceNum || parseInt(tourPrice.replace(/[^0-9]/g, '') || '65', 10);
  const tourDesc = tour[`description_${lang}`] || tour.description;
  const tourRegion = tour[`region_${lang}`] || tour.region_uz || 'O\'zbekiston';
  const tourGroup = tour[`groupSize_${lang}`] || tour.groupSize || 'Maks. 10 kishi';
  const rating = tour.rating || 4.96;
  const reviewsCount = tour.reviewsCount || 140;

  // Calculate live booking price
  const baseTotal = (adults * basePriceNum) + (children * basePriceNum * 0.5);
  const addOnsTotal = (extraGuide ? 30 : 0) + (extraVipTransport ? 40 : 0);
  const finalTotalPrice = Math.round(baseTotal + addOnsTotal);

  // Gallery
  const photos = [tour.image, ...(tour.gallery || [])].filter(Boolean);

  // Itinerary items
  const itineraryText = tour[`itinerary_${lang}`] || tour.itinerary || '';
  const itineraryDays = itineraryText.split('\n').filter(Boolean).map((line, idx) => {
    const parts = line.split('|');
    if (parts.length >= 2) {
      return {
        title: parts[0]?.trim(),
        content: parts[1]?.trim()
      };
    }
    return {
      title: `${lang === 'it' ? 'Tappa' : lang === 'en' ? 'Stop' : 'Bosqich'} ${idx + 1}`,
      content: line.trim()
    };
  });

  // Included & Excluded
  const includedList = tour[`included_${lang}`] || (Array.isArray(tour.included) ? tour.included : (tour.included ? tour.included.split('\n') : []));
  const notIncludedList = tour[`notIncluded_${lang}`] || (Array.isArray(tour.notIncluded) ? tour.notIncluded : (tour.notIncluded ? tour.notIncluded.split('\n') : []));

  // Highlights
  const highlights = tour[`highlights_${lang}`] || [
    lang === 'it' ? 'Guida esperta locale con approfondimenti storici' : lang === 'en' ? 'Expert local guide with deep historical narrative' : 'Tarixiy obidalar bo\'yicha professional gid hamrohligi',
    lang === 'it' ? 'Degustazione autentica della cucina tradizionale uzbeka' : lang === 'en' ? 'Authentic culinary tastings of UNESCO plov & tandoor bread' : 'Milliy taomlar va osh markazlarida degustatsiya',
    lang === 'it' ? 'Trasporto privato garantito con aria condizionata' : lang === 'en' ? 'Comfortable air-conditioned private vehicle transport' : 'Konditsionerli qulay transfer xizmati'
  ];

  const handleStartBooking = () => {
    setBookingReference(`AFR-${Math.floor(100000 + Math.random() * 900000)}`);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert(lang === 'it' ? 'Per favore compila nome e numero di telefono!' : lang === 'en' ? 'Please fill your name and phone number!' : 'Iltimos, ismingiz va telefon raqamingizni kiriting!');
      return;
    }
    setBookingConfirmed(true);
  };

  const bookingSummaryMsg = encodeURIComponent(
    `Assalomu alaykum! Men Afrasia platformasi orqali tur bron qilmoqchiman:\n` +
    `• Tur: ${tourTitle}\n` +
    `• Sana: ${bookingDate}\n` +
    `• Sayohatchilar: ${adults} kattalar, ${children} bolalar\n` +
    `• Jami narx: €${finalTotalPrice}\n` +
    `• Bron kodi: ${bookingReference}\n` +
    `• Ismim: ${customerName}\n` +
    `• Tel: ${customerPhone}`
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      
      {/* 1. Breadcrumbs Header */}
      <div className="bg-white border-b border-slate-200 py-3.5 pt-20 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Link to="/" className="hover:text-slate-900 transition-colors">{t('home', currentLang.code)}</Link>
            <span>/</span>
            <Link to="/tours" className="hover:text-slate-900 transition-colors">{t('tours', currentLang.code)}</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs">{tourTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-md text-[11px] font-bold">
              ✓ {lang === 'it' ? 'Conferma Immediata' : lang === 'en' ? 'Instant Confirmation' : 'Tezkor tasdiqlash'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Title Section */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                  📍 {tourRegion}
                </span>
                <div className="flex items-center gap-1 text-slate-800 font-bold text-xs bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{rating}</span>
                  <span className="text-slate-400 font-normal">({reviewsCount} {lang === 'it' ? 'recensioni verificate' : lang === 'en' ? 'verified reviews' : 'sharh'})</span>
                </div>
                <span className="text-xs text-slate-500">
                  {lang === 'it' ? 'Offerto da' : lang === 'en' ? 'Offered by' : 'Taqdim etuvchi'}: <strong>{tour.agency || 'Afrasia Silk Road'}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                {tourTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: tourTitle, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(lang === 'it' ? 'Link copiato negli appunti!' : lang === 'en' ? 'Link copied to clipboard!' : 'Havola nusxalandi!');
                  }
                }}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Photo Gallery Layout (Airbnb / GetYourGuide Style Grid) */}
      <div className="container mx-auto px-4 max-w-7xl py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden bg-slate-900 max-h-[460px]">
          
          {/* Main Large Photo */}
          <div className="md:col-span-2 md:row-span-2 relative h-72 md:h-[460px]">
            <img 
              src={activePhoto || tour.image} 
              alt={tourTitle} 
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-all"
            />
          </div>

          {/* Side Thumbs */}
          {photos.slice(1, 5).map((pic, pIdx) => (
            <div 
              key={pIdx} 
              onClick={() => setActivePhoto(pic)}
              className="hidden md:block relative h-[225px] cursor-pointer overflow-hidden group"
            >
              <img 
                src={pic} 
                alt={`Photo ${pIdx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-95"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </div>
          ))}

        </div>
      </div>

      {/* 4. Body Content & Sticky Booking Box */}
      <div className="container mx-auto px-4 max-w-7xl py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Tour Itinerary & Details) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Specs Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {lang === 'it' ? 'Durata' : lang === 'en' ? 'Duration' : 'Davomiyligi'}
                </span>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{tourDuration}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {lang === 'it' ? 'Gruppo' : lang === 'en' ? 'Group Size' : 'Guruh hajmi'}
                </span>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{tourGroup}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {lang === 'it' ? 'Lingue' : lang === 'en' ? 'Languages' : 'Tillar'}
                </span>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>IT, EN, UZ</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {lang === 'it' ? 'Cancellazione' : lang === 'en' ? 'Cancellation' : 'Bekor qilish'}
                </span>
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'it' ? 'Gratuita 24h' : lang === 'en' ? 'Free 24h' : '24h bepul'}</span>
                </div>
              </div>
            </div>

            {/* Highlights Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{lang === 'it' ? 'Punti Salienti dell\'Esperienza' : lang === 'en' ? 'Tour Highlights' : 'Sayohatning Asosiy Afzalliklari'}</span>
              </h2>

              <ul className="grid grid-cols-1 gap-2.5">
                {highlights.map((hl, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Itinerary Accordion / Timeline */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  {lang === 'it' ? 'Itinerario Dettagliato Tappa per Tappa' : lang === 'en' ? 'Detailed Step-by-Step Itinerary' : 'Batafsil Marshrut Dasturi'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'it' ? 'Orari e tappe programmate per garantire la massima comodità' : lang === 'en' ? 'Curated pace allowing comfortable discovery and photo stops' : 'Qulay vaqt taqsimoti va fotosessiyalar bilan rejalashtirilgan'}
                </p>
              </div>

              <div className="space-y-3">
                {itineraryDays.map((item, dIdx) => {
                  const isOpen = openDays[dIdx] ?? false;
                  return (
                    <div key={dIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenDays(prev => ({ ...prev, [dIdx]: !prev[dIdx] }))}
                        className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {dIdx + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-900">{item.title}</span>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white border-t border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {item.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inclusions and Exclusions Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-bold text-slate-900">
                {lang === 'it' ? 'Cosa è Incluso nel Prezzo' : lang === 'en' ? 'What\'s Included & Excluded' : 'Nimalar Kiritilgan va Kiritilmagan'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Included */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 pb-2 border-b border-emerald-100">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'it' ? 'Incluso nel pacchetto' : lang === 'en' ? 'Included' : 'Kiritilgan xizmatlar'}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {includedList.map((inc, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excluded */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5 pb-2 border-b border-rose-100">
                    <X className="w-4 h-4 text-rose-600" />
                    <span>{lang === 'it' ? 'Non incluso' : lang === 'en' ? 'Not Included' : 'Kiritilmagan'}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-500">
                    {notIncludedList.map((exc, eIdx) => (
                      <li key={eIdx} className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (GetYourGuide / Booking Sticky Widget) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl space-y-5">
              
              {/* Header Price */}
              <div className="border-b border-slate-100 pb-4 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    {lang === 'it' ? 'Prezzo per persona' : lang === 'en' ? 'Price per person' : 'Kishi boshiga narx'}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold font-serif text-slate-900">{tourPrice}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {lang === 'it' ? 'Miglior Prezzo Garantito' : lang === 'en' ? 'Best Price' : 'Eng maqbul narx'}
                  </span>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-4 text-xs">
                
                {/* 1. Date Picker */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {lang === 'it' ? 'Seleziona la data del viaggio:' : lang === 'en' ? 'Select Tour Date:' : 'Sayohat sanasi:'}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="date"
                      value={bookingDate}
                      min={tomorrowStr}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                {/* 2. Number of Guests (Adults & Children) */}
                <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">{lang === 'it' ? 'Adulti' : lang === 'en' ? 'Adults' : 'Kattalar'}</span>
                      <span className="text-[10px] text-slate-400">{lang === 'it' ? '12+ anni' : lang === 'en' ? 'Age 12+' : '12+ yosh'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                      >-</button>
                      <span className="w-6 text-center font-bold text-sm">{adults}</span>
                      <button 
                        onClick={() => setAdults(adults + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                      >+</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="font-bold text-slate-800 block">{lang === 'it' ? 'Bambini' : lang === 'en' ? 'Children' : 'Bolalar'}</span>
                      <span className="text-[10px] text-slate-400">{lang === 'it' ? '4-11 anni (50% sconto)' : lang === 'en' ? 'Age 4-11 (50% off)' : '4-11 yosh (50% chegirma)'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                      >-</button>
                      <span className="w-6 text-center font-bold text-sm">{children}</span>
                      <button 
                        onClick={() => setChildren(children + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* 3. Optional Upgrades */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {lang === 'it' ? 'Servizi aggiuntivi opzionali:' : lang === 'en' ? 'Optional Extras:' : 'Qo\'shimcha qulayliklar:'}
                  </span>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={extraGuide}
                        onChange={(e) => setExtraGuide(e.target.checked)}
                        className="rounded accent-emerald-600"
                      />
                      <span className="text-[11px] text-slate-700">
                        {lang === 'it' ? 'Guida esclusiva privata' : lang === 'en' ? 'Private Dedicated Guide' : 'Alohida shaxsiy gid'}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">+€30</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={extraVipTransport}
                        onChange={(e) => setExtraVipTransport(e.target.checked)}
                        className="rounded accent-emerald-600"
                      />
                      <span className="text-[11px] text-slate-700">
                        {lang === 'it' ? 'VIP Van Mercedes Transfer' : lang === 'en' ? 'VIP Mercedes Van Transfer' : 'VIP Mercedes mikroavtobus'}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">+€40</span>
                  </label>
                </div>

                {/* 4. Total Calculation */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-sm">
                    {lang === 'it' ? 'Totale Stimato:' : lang === 'en' ? 'Total Amount:' : 'Jami narx:'}
                  </span>
                  <span className="text-2xl font-extrabold font-serif text-emerald-800">
                    €{finalTotalPrice}
                  </span>
                </div>

                {/* 5. Booking Action Button */}
                <button
                  onClick={handleStartBooking}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{lang === 'it' ? 'Prenota Ora Questo Viaggio' : lang === 'en' ? 'Book This Tour Now' : 'Sayohatni Bron Qilish'}</span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  {lang === 'it' ? 'Nessun addebito immediato sulla carta. Conferma tramite agenzia.' : lang === 'en' ? 'No immediate card charges. Verified by local travel concierge.' : 'Oldindan to\'lovsiz bron qilish. Menejer tezda aloqaga chiqadi.'}
                </p>

              </div>

            </div>

            {/* Direct WhatsApp / Phone Contact Card */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                {lang === 'it' ? 'Assistenza Turistica 24/7' : lang === 'en' ? '24/7 Travel Concierge' : '24/7 Tezkor Aloqa'}
              </span>
              <p className="text-xs text-slate-300 font-light">
                {lang === 'it' ? 'Hai richieste personalizzate o date speciali? Parla direttamente con il nostro team a Tashkent.' : lang === 'en' ? 'Need a custom itinerary or private group discount? Speak directly with our Tashkent specialists.' : 'Shaxsiy marshrut yoki maxsus guruh bo\'yicha savollaringiz bormi?'}
              </p>
              <a 
                href={`https://wa.me/998901234567?text=${encodeURIComponent(`Salom! "${tourTitle}" bo'yicha ma'lumot olmoqchiman.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (+998 90 123 45 67)</span>
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* 5. Interactive Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in-up">
            
            <button 
              onClick={() => { setBookingModalOpen(false); setBookingConfirmed(false); }}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                    {lang === 'it' ? 'Modulo di Prenotazione' : lang === 'en' ? 'Instant Reservation' : 'Tezkor Bron'}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-slate-900">{tourTitle}</h3>
                  <p className="text-xs text-slate-500">
                    {bookingDate} • {adults} {lang === 'it' ? 'adulti' : lang === 'en' ? 'adults' : 'katta'} • €{finalTotalPrice}
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{lang === 'it' ? 'Nome e Cognome:' : lang === 'en' ? 'Full Name:' : 'Ism va Familiya:'}</label>
                    <input 
                      type="text" 
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Marco Rossi"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{lang === 'it' ? 'Email:' : lang === 'en' ? 'Email Address:' : 'Elektron pochta:'}</label>
                    <input 
                      type="email" 
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. marco@example.com"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{lang === 'it' ? 'Telefono / WhatsApp:' : lang === 'en' ? 'Phone / WhatsApp:' : 'Telefon / WhatsApp:'}</label>
                    <input 
                      type="tel" 
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+39 345 123 4567"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-colors mt-2"
                >
                  {lang === 'it' ? 'Conferma e Ricevi Voucher' : lang === 'en' ? 'Confirm & Receive Voucher' : 'Tasdiqlash va Buyurtma berish'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    {lang === 'it' ? 'Prenotazione Ricevuta con Successo!' : lang === 'en' ? 'Booking Confirmed Successfully!' : 'Buyurtmangiz qabul qilindi!'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'it' ? 'Codice di Riferimento:' : lang === 'en' ? 'Booking Reference Code:' : 'Buyurtma kodi:'} <strong className="text-slate-900 font-mono">{bookingReference}</strong>
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-1.5 text-slate-700">
                  <p><strong>{lang === 'it' ? 'Viaggio' : lang === 'en' ? 'Tour' : 'Tur'}:</strong> {tourTitle}</p>
                  <p><strong>{lang === 'it' ? 'Data' : lang === 'en' ? 'Date' : 'Sana'}:</strong> {bookingDate}</p>
                  <p><strong>{lang === 'it' ? 'Partecipanti' : lang === 'en' ? 'Guests' : 'Mehmonlar'}:</strong> {adults} {lang === 'it' ? 'adulti' : lang === 'en' ? 'adults' : 'katta'}{children > 0 ? `, ${children} bolalar` : ''}</p>
                  <p><strong>{lang === 'it' ? 'Totale' : lang === 'en' ? 'Total' : 'Jami'}:</strong> €{finalTotalPrice}</p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={`https://wa.me/998901234567?text=${bookingSummaryMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{lang === 'it' ? 'Invia Voucher su WhatsApp' : lang === 'en' ? 'Send Voucher on WhatsApp' : 'WhatsApp orqali yuborish'}</span>
                  </a>

                  <button
                    onClick={() => { setBookingModalOpen(false); setBookingConfirmed(false); }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold py-1"
                  >
                    {lang === 'it' ? 'Chiudi' : lang === 'en' ? 'Close' : 'Yopish'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}