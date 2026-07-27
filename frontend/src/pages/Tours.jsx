import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';

export default function Tours({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState("/uz_banner.png");

  useEffect(() => {
    axios.get(`${API_BASE}/tours`)
      .then(res => {
        setTours(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    axios.get(`${API_BASE}/pageBanners`)
      .then(res => {
        if (res.data && res.data.tours) {
          setBannerUrl(res.data.tours);
        }
      })
      .catch(err => console.error("Failed to load tours banner:", err));
  }, []);

  if (loading) return <div className="text-center py-40 text-xs font-semibold font-sans text-gray-400">{lang === 'it' ? 'Caricamento in corso...' : lang === 'en' ? 'Loading...' : 'Yuklanmoqda...'}</div>;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      
      {/* 1. Full Width Hero Banner */}
      <div className="relative h-[340px] md:h-[380px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <img 
          src={bannerUrl} 
          alt="Uzbekistan Tourism Banner" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-75 opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-white font-extrabold tracking-tight drop-shadow-md">
            {t('tours', currentLang.code).toUpperCase()}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto font-serif italic">
            {lang === 'it' ? "Gli itinerari turistici più leggendari e avventure indimenticabili in Uzbekistan" : lang === 'en' ? "The most legendary tourist routes and unforgettable adventures in Uzbekistan" : "O'zbekistonning barcha viloyatlari bo'ylab eng afsonaviy turizm marshrutlari hamda unutilmas sarguzashtlar"}
          </p>
        </div>
      </div>

      {/* Grid of Compact Tour Cards */}
      <div className="container mx-auto px-6 max-w-7xl pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => {
            const tourTitle = tour["title_" + lang] || tour.title;
            const tourDuration = tour["duration_" + lang] || tour.duration;
            const tourPrice = tour["price_" + lang] || tour.price;
            const tourDescription = tour["description_" + lang] || tour.description;
            return (
              <Link 
                key={tour.id} 
                to={`/tours/${tour.id}`} 
                className="group block bg-white hover:-translate-y-1 transition-all duration-300"
              >
                {/* Tour Image */}
                <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 relative" style={{ aspectRatio: '16/10' }}>
                  <img 
                    src={tour.image} 
                    alt={tourTitle} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.target.style.display = 'none'; }} 
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded">
                    {tourDuration}
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="px-1">
                  <h2 className="text-base font-bold font-sans text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {tourTitle}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold mt-1 mb-2">
                    <span>{lang === 'it' ? 'Offerto da' : lang === 'en' ? 'Offered by' : 'Taqdim etuvchi'}: {tour.agency}</span>
                  </div>

                  <p className="text-gray-500 text-[11px] leading-relaxed font-light line-clamp-3 mb-4">
                    {tourDescription}
                  </p>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-3">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wider block">{lang === 'it' ? 'A partire da' : lang === 'en' ? 'Starting from' : "Boshlang'ich narx"}</span>
                      <span className="text-sm font-bold text-gray-900">{tourPrice}</span>
                    </div>
                    <span className="text-[11px] font-bold text-primary group-hover:underline">
                      {t('details', currentLang.code)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {tours.length === 0 && (
          <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
            <h3 className="text-xs text-gray-400 font-bold font-sans uppercase tracking-wider">
              {lang === 'it' ? 'Nessun viaggio disponibile' : lang === 'en' ? 'No tours available' : 'Hozircha sayohatlar mavjud emas'}
            </h3>
          </div>
        )}
      </div>

    </div>
  );
}