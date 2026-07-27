import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';
import { getStoredData } from '../utils/dbStorage';

export default function Regions({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [regions, setRegions] = useState(() => getStoredData('regions', []));
  const [bannerUrl, setBannerUrl] = useState(() => {
    const b = getStoredData('pageBanners', {});
    return b.regions || "https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1600&q=80";
  });

  useEffect(() => {
    const savedRegions = getStoredData('regions', []);
    if (savedRegions && savedRegions.length > 0) {
      setRegions(savedRegions);
    }

    axios.get(`${API_BASE}/regions`)
      .then(res => {
        if (res.data && res.data.length > 0) setRegions(res.data);
      })
      .catch(err => console.error("Regions load fallback:", err));

    axios.get(`${API_BASE}/pageBanners`)
      .then(res => {
        if (res.data && res.data.regions) {
          setBannerUrl(res.data.regions);
        }
      })
      .catch(err => console.error("Failed to load regions banner:", err));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Hero Header Banner */}
      <div className="relative h-[340px] md:h-[380px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <img 
          src={bannerUrl} 
          alt="O'zbekiston Viloyatlari" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-75 opacity-70" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-white font-extrabold tracking-tight drop-shadow-md">
            {t('regions', currentLang.code).toUpperCase()}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto font-serif italic">
            {lang === 'it' ? "Informazioni turistiche complete su ogni regione dell'Uzbekistan" : lang === 'en' ? "Complete tourist information about each region of Uzbekistan" : "Mamlakatimizning har bir viloyati va mintaqasi haqida to'liq turistik ma'lumotlar"}
          </p>
        </div>
      </div>

      {/* Grid of destinations */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-800">
              {lang === 'it' ? 'Tutte le Regioni e Province' : lang === 'en' ? 'All Regions & Provinces' : 'Barcha Viloyat va Mintaqalar'} ({regions.length})
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              {lang === 'it' ? 'Seleziona la regione che vuoi visitare' : lang === 'en' ? 'Select the region you wish to explore' : "Sayohat qilmoqchi bo'lgan viloyatingizni tanlang"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions.map((reg) => {
            const name = lang === 'it' ? (reg.name_it || reg.name) : lang === 'en' ? (reg.name_en || reg.name) : (reg.name_uz || reg.name);
            const slogan = lang === 'it' ? (reg.slogan_it || reg.slogan || reg.knownFor) : lang === 'en' ? (reg.slogan_en || reg.slogan || reg.knownFor) : (reg.slogan_uz || reg.slogan || reg.knownFor);
            const center = lang === 'it' ? (reg.center_it || reg.center) : lang === 'en' ? (reg.center_en || reg.center) : (reg.center_uz || reg.center);

            return (
              <Link 
                key={reg.id} 
                to={`/regions/${reg.id}`} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={reg.image || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=800&q=80'} 
                    alt={name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="bg-emerald-600/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md mb-2 inline-block">
                      {center ? `${lang === 'it' ? 'Centro' : lang === 'en' ? 'Center' : 'Markaz'}: ${center}` : 'Uzbekistan'}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white leading-snug drop-shadow-sm">
                      {name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-slate-600 text-xs line-clamp-2 italic font-serif">
                    "{slogan}"
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:text-teal-900">
                    <span>{lang === 'it' ? 'Esplora la Regione' : lang === 'en' ? 'Explore Region' : 'Viloyatni kashf qiling'} &rarr;</span>
                    {reg.famousPlaces && (
                      <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[11px]">
                        {reg.famousPlaces.length} {lang === 'it' ? 'luoghi' : lang === 'en' ? 'places' : 'joylar'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
