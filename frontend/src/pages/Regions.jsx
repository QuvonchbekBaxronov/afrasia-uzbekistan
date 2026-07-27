import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { t } from '../utils/translations';

export default function Regions({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [regions, setRegions] = useState([]);
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1600&q=80");

  useEffect(() => {
    axios.get('http://localhost:3001/regions')
      .then(res => setRegions(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:3001/pageBanners')
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
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              {lang === 'it' ? `Tutte le Regioni e Province (${regions.length})` : lang === 'en' ? `All Regions and Provinces (${regions.length})` : `Barcha Viloyat va Mintaqalar (${regions.length})`}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'it' ? "Seleziona la regione che vuoi visitare" : lang === 'en' ? "Select the region you want to visit" : "Sayohat qilmoqchi bo'lgan viloyatingizni tanlang"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {regions.map((region) => {
            const regionName = region["name_" + lang] || region.name;
            const regionSlogan = region["slogan_" + lang] || region.slogan;
            const regionCenter = region["center_" + lang] || region.center;
            return (
              <Link 
                key={region.id} 
                to={`/regions/${region.id}`} 
                className="group relative h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 block border border-slate-200/80 bg-slate-900"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 transition-opacity duration-300"></div>
                <img 
                  src={region.image} 
                  alt={regionName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
                
                <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                  <span className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1.5 block">
                    {lang === 'it' ? "REGIONE" : lang === 'en' ? "REGION" : "Mintaqa"}
                  </span>
                  <h3 className="text-white text-2xl font-bold font-serif mb-1 group-hover:text-emerald-300 transition-colors">
                    {regionName}
                  </h3>
                  <p className="text-slate-300 text-xs font-serif italic mb-4 line-clamp-1">
                    {regionSlogan || "Tarixiy meros va go'zal tabiat maskani"}
                  </p>

                  <div className="flex justify-between items-center text-xs text-slate-400 font-medium border-t border-white/15 pt-3">
                    <span>{t('capitalLabel', currentLang.code)}: <b className="text-white">{regionCenter || regionName}</b></span>
                    <span>{t('populationLabel', currentLang.code)}: <b className="text-white">{region.population || '—'}</b></span>
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
