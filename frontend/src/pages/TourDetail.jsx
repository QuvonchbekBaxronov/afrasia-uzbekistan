import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { t } from '../utils/translations';

export default function TourDetail({ currentLang }) {
  const { id } = useParams();
  const lang = currentLang?.code || 'it';
  const [tour, setTour] = useState(null);
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDays, setOpenDays] = useState({ 0: true }); // Day 1 open by default

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3001/tours/${id}`)
      .then(res => {
        setTour(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    axios.get('http://localhost:3001/tours')
      .then(res => {
        setAllTours(res.data.filter(t => t.id !== id));
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="text-center py-40 text-xs font-semibold font-sans text-gray-400">{lang === 'it' ? 'Caricamento in corso...' : lang === 'en' ? 'Loading...' : 'Yuklanmoqda...'}</div>;
  if (!tour) return <div className="text-center py-40 text-xs font-semibold font-sans text-gray-400">{lang === 'it' ? 'Viaggio non trovato!' : lang === 'en' ? 'Tour not found!' : 'Sayohat topilmadi!'}</div>;

  const tourTitle = tour["title_" + lang] || tour.title;
  const tourDuration = tour["duration_" + lang] || tour.duration;
  const tourPrice = tour["price_" + lang] || tour.price;
  const tourTravelStyle = tour["travelStyle_" + lang] || tour.travelStyle;
  const tourRoute = tour["route_" + lang] || tour.route;
  const tourDescription = tour["description_" + lang] || tour.description;
  const tourPaymentInfo = tour["paymentInfo_" + lang] || tour.paymentInfo;
  const tourIncluded = tour["included_" + lang] || tour.included;
  const tourNotIncluded = tour["notIncluded_" + lang] || tour.notIncluded;

  const priceTableString = tour["priceTable_" + lang] || tour.priceTable;
  const priceRows = priceTableString ? priceTableString.split('\n').map(line => {
    const parts = line.split(':');
    return {
      label: parts[0]?.trim(),
      value: parts[1]?.trim()
    };
  }).filter(r => r.label && r.value) : [];

  const itineraryString = tour["itinerary_" + lang] || tour.itinerary;
  const days = itineraryString ? itineraryString.split('\n').map((line, idx) => {
    const parts = line.split('|');
    const titlePart = parts[0]?.trim() || `Day ${idx + 1}`;
    const dayMatch = titlePart.match(/^(Day\s*\d+):\s*(.*)$/i);
    const dayLabel = dayMatch ? dayMatch[1].replace(/day/i, '').trim() : `${idx + 1}`;
    const dayTitle = dayMatch ? dayMatch[2] : titlePart;
    return {
      day: dayLabel,
      title: dayTitle,
      content: parts[1]?.trim() || '',
      places: parts[2]?.trim() || ''
    };
  }).filter(d => d.content) : [];

  const toggleDay = (index) => {
    setOpenDays(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const whatsappMessage = lang === 'it'
    ? `Ciao! Vorrei prenotare il viaggio "${tourTitle}". Per favore fornitemi maggiori dettagli.`
    : lang === 'en'
    ? `Hello! I would like to book the tour "${tourTitle}". Please provide more details.`
    : `Salom! "${tourTitle}" sayohati bo'yicha buyurtma bermoqchiman. Iltimos, batafsil ma'lumot bering.`;

  const mailSubject = lang === 'it' ? `Prenotazione del viaggio: ${tourTitle}` : lang === 'en' ? `Tour Booking: ${tourTitle}` : `Sayohat buyurtmasi: ${tourTitle}`;
  const mailBody = lang === 'it'
    ? `Ciao!\n\nVorrei prenotare il viaggio "${tourTitle}".\n\nPer favore, inviatemi maggiori dettagli sui prezzi e sulle condizioni.\n\nCordiali saluti,`
    : lang === 'en'
    ? `Hello!\n\nI would like to book the tour "${tourTitle}".\n\nPlease send more information about prices and conditions.\n\nBest regards,`
    : `Salom!\n\nMen "${tourTitle}" sayohati bo'yicha buyurtma bermoqchiman.\n\nIltimos, narx va shartlar haqida batafsil ma'lumot yuboring.\n\nHurmat bilan,`;

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. Full Width Hero Banner */}
      <div className="w-full relative bg-dark overflow-hidden" style={{ height: '380px' }}>
        <img 
          src={tour.image} 
          alt={tourTitle} 
          className="w-full h-full object-cover opacity-60" 
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Banner Content overlay */}
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="container mx-auto px-6 max-w-7xl w-full text-left">
            
            {/* Breadcrumbs */}
            <div className="text-[10px] uppercase tracking-wider text-gray-300 font-semibold mb-2 flex items-center gap-1 font-sans">
              <Link to="/" className="hover:text-white transition-colors">{t('home', currentLang.code)}</Link>
              <span>/</span>
              <span className="text-gray-300">Uzbekistan</span>
              <span>/</span>
              <Link to="/tours" className="hover:text-white transition-colors">{t('tours', currentLang.code)}</Link>
              <span>/</span>
              <span className="text-white font-bold">{tourTitle}</span>
            </div>

            {/* Tour Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-none uppercase font-sans mb-4">
              {tourTitle}
            </h1>

            {/* Badges */}
            <div className="flex items-center gap-3">
              <span className="bg-[#80C23A] text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded font-sans">
                {tourDuration}
              </span>
              <span className="bg-white/10 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded font-sans">
                {tourTravelStyle || 'Madaniy sayohat'}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Page Grid */}
      <div className="container mx-auto px-6 max-w-7xl pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Short Description */}
            <div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-normal font-sans">
                {tourDescription}
              </p>
            </div>

            {/* Trip Overview */}
            { (tourTravelStyle || tour.countries || tourRoute) && (
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-sm uppercase tracking-widest font-bold font-sans text-gray-900 mb-4">
                  {lang === 'it' ? 'Informazioni sul viaggio' : lang === 'en' ? 'Trip Information' : 'Sayohat haqida ma\'lumot'}
                </h2>
                <table className="w-full text-xs text-left font-sans">
                  <tbody>
                    {tourTravelStyle && (
                      <tr className="border-b border-gray-50">
                        <th className="py-2.5 w-1/4 font-semibold text-gray-500">{lang === 'it' ? 'Tipo di viaggio' : lang === 'en' ? 'Tour Type' : 'Sayohat turi'}</th>
                        <td className="py-2.5 text-gray-900">{tourTravelStyle}</td>
                      </tr>
                    )}
                    {tour.countries && (
                      <tr className="border-b border-gray-50">
                        <th className="py-2.5 w-1/4 font-semibold text-gray-500">{lang === 'it' ? 'Paesi' : lang === 'en' ? 'Countries' : 'Davlatlar'}</th>
                        <td className="py-2.5 text-gray-900">{tour.countries}</td>
                      </tr>
                    )}
                    {tourRoute && (
                      <tr>
                        <th className="py-2.5 w-1/4 font-semibold text-gray-500">{lang === 'it' ? 'Itinerario' : lang === 'en' ? 'Route' : 'Marshrut yo\'nalishi'}</th>
                        <td className="py-2.5 text-gray-900">{tourRoute}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Detailed Route */}
            {days.length > 0 && (
              <div className="border-t border-gray-100 pt-6 font-sans">
                <h2 className="text-sm uppercase tracking-widest font-bold font-sans text-gray-900 mb-6">
                  {lang === 'it' ? 'Itinerario Dettagliato' : lang === 'en' ? 'Detailed Itinerary' : 'Batafsil marshrut'}
                </h2>
                <div className="space-y-4">
                  {days.map((dayObj, index) => {
                    const isOpen = openDays[index];
                    return (
                      <div key={index} className="border-b border-gray-100 pb-4">
                        <button 
                          onClick={() => toggleDay(index)}
                          className="w-full flex items-center justify-between text-left group"
                        >
                          <div className="flex items-center gap-4">
                            {/* Day circle */}
                            <div className="w-10 h-10 rounded-full border border-orange-400 flex flex-col items-center justify-center text-center shrink-0">
                              <span className="text-[11px] font-bold text-orange-500 leading-none">{dayObj.day}</span>
                              <span className="text-[7px] text-orange-400 uppercase tracking-widest leading-none">{lang === 'it' ? 'giorno' : lang === 'en' ? 'day' : 'kun'}</span>
                            </div>
                            <span className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {dayObj.title}
                            </span>
                          </div>
                          {/* Toggle arrow */}
                          <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Expanded details */}
                        {isOpen && (
                          <div className="pl-14 pt-3 space-y-3">
                            <p className="text-gray-600 text-xs leading-relaxed font-light">
                              {dayObj.content}
                            </p>
                            {dayObj.places && (
                              <div className="text-[10px] text-gray-500">
                                <span className="font-semibold text-gray-800">{lang === 'it' ? 'Destinazioni da visitare: ' : lang === 'en' ? 'Destinations to visit: ' : 'Boriladigan joylar: '}</span>
                                {dayObj.places}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Prices & Conditions */}
            {(tourIncluded || tourNotIncluded) && (
              <div className="border-t border-gray-100 pt-6 font-sans">
                <h2 className="text-sm uppercase tracking-widest font-bold font-sans text-gray-900 mb-6">
                  {lang === 'it' ? 'Prezzi e Condizioni' : lang === 'en' ? 'Prices & Conditions' : 'Narxlar va shartlar'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Included */}
                  {tourIncluded && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-bold font-sans text-gray-900 mb-3 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full border border-green-500 flex items-center justify-center text-green-500 font-bold text-[8px]">+</span>
                        {lang === 'it' ? 'Servizi inclusi nel prezzo' : lang === 'en' ? 'Services included in the price' : 'Narxga kiritilgan xizmatlar'}
                      </h3>
                      <ul className="space-y-2 text-gray-600 text-xs">
                        {tourIncluded.split(',').map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-1.5"></span>
                            <span>{item.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Not Included */}
                  {tourNotIncluded && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-bold font-sans text-gray-900 mb-3 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full border border-red-500 flex items-center justify-center text-red-500 font-bold text-[8px]">-</span>
                        {lang === 'it' ? 'Servizi esclusi dal prezzo' : lang === 'en' ? 'Services not included in the price' : 'Narxga kiritilmagan xizmatlar'}
                      </h3>
                      <ul className="space-y-2 text-gray-600 text-xs">
                        {tourNotIncluded.split(',').map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0 mt-1.5"></span>
                            <span>{item.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {tour.gallery && tour.gallery.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-sm uppercase tracking-widest font-bold font-sans text-gray-900 mb-4">{lang === 'it' ? 'Galleria Fotografica' : lang === 'en' ? 'Photo Gallery' : 'Foto galereya'}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {tour.gallery.map((imgUrl, imgIdx) => (
                    <div key={imgIdx} className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100" style={{ aspectRatio: '1/1' }}>
                      <img 
                        src={imgUrl} 
                        alt={`Gallery ${imgIdx + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Sidebar Card) */}
          <div className="lg:col-span-4 font-sans">
            <div className="sticky top-28 border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
              
              {/* Green Header */}
              <div className="bg-[#80C23A] py-3 text-center">
                <h3 className="text-white text-xs uppercase tracking-widest font-bold font-sans">{lang === 'it' ? 'Prezzo del viaggio' : lang === 'en' ? 'Tour Price' : 'Sayohat narxi'}</h3>
              </div>

              {/* Pricing Rows */}
              <div className="px-6 py-4 border-b border-gray-100">
                {priceRows.length > 0 ? (
                  <table className="w-full text-xs text-left font-sans">
                    <tbody>
                      {priceRows.map((row, index) => (
                        <tr key={index} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 font-semibold text-gray-500">{row.label}</td>
                          <td className="py-2.5 text-right font-bold text-gray-900">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-xs font-semibold font-sans text-gray-400">
                    {lang === 'it' ? 'Nessuna tabella dei prezzi mostrata' : lang === 'en' ? 'No price table shown' : 'Narxlar jadvali ko\'rsatilmadi'}
                  </div>
                )}
              </div>

              {/* Booking Terms Info */}
              {tourPaymentInfo && (
                <div className="px-6 py-4 border-b border-gray-100 text-[10px] text-gray-400 leading-relaxed space-y-2 font-sans">
                  <p>{tourPaymentInfo}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-6 space-y-3">
                <a
                  href={`https://wa.me/998944338848?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#E57C17] hover:bg-[#c96910] text-white font-bold py-3.5 px-4 rounded-lg transition-colors text-xs uppercase tracking-widest text-center font-sans"
                >
                  {lang === 'it' ? 'Invia richiesta' : lang === 'en' ? 'Send request' : 'So\'rov yuborish'}
                </a>
                <a
                  href={`mailto:baxronovquvonchbek11@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#80C23A] hover:bg-gray-50 text-[#80C23A] font-bold py-3 px-4 rounded-lg transition-colors text-xs uppercase tracking-widest text-center font-sans"
                >
                  {lang === 'it' ? 'Richiedi preventivo' : lang === 'en' ? 'Ask for price' : 'Narxni so\'rash'}
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* 4. "You May Be Interested In" Section */}
        {allTours.length > 0 && (
          <div className="border-t border-gray-100 mt-16 pt-10 font-sans">
            <h2 className="text-base uppercase tracking-widest font-bold font-sans text-gray-900 mb-8">
              {lang === 'it' ? 'Viaggi che potrebbero interessarti' : lang === 'en' ? 'Tours you may be interested in' : 'Sizga qiziq bo\'lishi mumkin bo\'lgan sayohatlar'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allTours.map((t) => {
                const tTitle = t["title_" + lang] || t.title;
                const tDuration = t["duration_" + lang] || t.duration;
                const tPrice = t["price_" + lang] || t.price;
                return (
                  <Link 
                    key={t.id} 
                    to={`/tours/${t.id}`} 
                    className="group block bg-white hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 relative" style={{ aspectRatio: '16/10' }}>
                      <img 
                        src={t.image} 
                        alt={tTitle} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => { e.target.style.display = 'none'; }} 
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded">
                        {tDuration}
                      </div>
                    </div>
                    
                    <div className="px-1">
                      <h3 className="text-xs font-bold font-sans text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {tTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-[9px] text-gray-400 font-semibold mt-1">
                        <span>{lang === 'it' ? 'Offerto da' : lang === 'en' ? 'Offered by' : 'Taqdim etuvchi'}: {t.agency}</span>
                        <span>•</span>
                        <span className="font-bold text-gray-900">{tPrice}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}