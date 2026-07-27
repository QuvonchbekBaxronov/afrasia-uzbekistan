import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';
import { getStoredData } from '../utils/dbStorage';

// Extract YouTube video ID from various URL formats
const getYoutubeId = (url) => {
  if (!url) return null;
  const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  return null;
};

export default function Art({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [instruments, setInstruments] = useState(() => getStoredData('instruments', []));
  const [bannerUrl, setBannerUrl] = useState(() => {
    const b = getStoredData('pageBanners', {});
    return b.art || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80";
  });
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const savedInstruments = getStoredData('instruments', []);
    if (savedInstruments && savedInstruments.length > 0) {
      setInstruments(savedInstruments);
    }

    axios.get(`${API_BASE}/instruments`)
      .then(res => {
        if (res.data && res.data.length > 0) setInstruments(res.data);
      })
      .catch(err => console.error("Instruments load fallback:", err));

    axios.get(`${API_BASE}/pageBanners`)
      .then(res => {
        if (res.data && res.data.art) setBannerUrl(res.data.art);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Banner */}
      <div className="relative h-[340px] md:h-[380px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>
        <img 
          src={bannerUrl} 
          alt="San'at va hunarmandchilik" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-75 opacity-80" 
        />
        <div className="relative z-20 text-center px-4 max-w-4xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-white font-extrabold tracking-tight drop-shadow-md mb-2">
            {t('artCrafts', currentLang.code)}
          </h1>
          <p className="text-slate-200 text-sm md:text-base font-serif italic drop-shadow">
            {lang === 'it' ? "Strumenti musicali tradizionali dell'Uzbekistan, arte applicata e patrimonio culturale" : lang === 'en' ? "Traditional musical instruments of Uzbekistan, applied art and cultural heritage" : "O'zbekiston milliy cholg'u asboblari, amaliy san'at va madaniy me'ros"}
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="container mx-auto px-4 lg:px-8 py-16 max-w-6xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
            {lang === 'it' ? 'Strumenti Musicali Tradizionali' : lang === 'en' ? 'Traditional Musical Instruments' : "Milliy cholg'u asboblari"}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {lang === 'it' ? "Il popolo uzbeko ha creato una cultura musicale unica nel corso di millenni. I nostri strumenti nazionali non sono solo fonti di suoni melodici, ma testimoni viventi della storia. Scopri gli strumenti più famosi qui sotto." : lang === 'en' ? "The Uzbek people have created a unique musical culture over thousands of years. Our national instruments are not only sources of melodic sounds, but living witnesses of history. Learn about the most famous instruments below." : "O'zbek xalqi minglab yillar davomida noyob musiqa madaniyatini yaratgan. Milliy cholg'u asboblarimiz nafaqat ohangdor tovushlar manbayi, balki xalqimiz tarixining tirik guvohidir. Quyida eng mashhur cholg'u asboblarimiz bilan tanishing."}
          </p>
        </div>

        {/* Instruments Grid */}
        <div className="space-y-20">
          {instruments.map((instrument, idx) => {
            const ytId = getYoutubeId(instrument.youtubeUrl);
            const embedSrc = ytId
              ? `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&autoplay=1`
              : null;
            const watchUrl = ytId
              ? `https://www.youtube.com/watch?v=${ytId}`
              : instrument.youtubeUrl;

            const instName = instrument["name_" + lang] || instrument.name;
            const instCategory = instrument["category_" + lang] || instrument.category;
            const instDescription = instrument["description_" + lang] || instrument.description;

            return (
              <div 
                key={instrument.id} 
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}
              >
                {/* Video / Image Side */}
                <div className="lg:w-1/2 w-full">
                  {activeVideo === instrument.id && embedSrc ? (
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                      <iframe
                        src={embedSrc}
                        title={instName}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div 
                      className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative cursor-pointer group bg-gray-100"
                      onClick={() => embedSrc && setActiveVideo(instrument.id)}
                    >
                      <img 
                        src={instrument.image} 
                        alt={instName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      {embedSrc && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7 text-red-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Text Side */}
                <div className="lg:w-1/2 w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-primary/20">
                      {instCategory}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 font-serif mb-4">{instName}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{instDescription}</p>
                  
                  {instrument.youtubeUrl && activeVideo !== instrument.id && (
                    <div className="mt-6 flex flex-wrap gap-3 items-center">
                      {embedSrc && (
                        <button 
                          onClick={() => setActiveVideo(instrument.id)}
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors shadow-md"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          {lang === 'it' ? 'Ascolta' : lang === 'en' ? 'Play Performance' : 'Ijro etish'}
                        </button>
                      )}
                      <a 
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {lang === 'it' ? 'Apri su YouTube' : lang === 'en' ? 'Open in YouTube' : 'YouTube\'da ochish'}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {instruments.length === 0 && (
          <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
            <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {lang === 'it' ? 'Nessun dato disponibile' : lang === 'en' ? 'No data available' : 'Hozircha ma\'lumotlar mavjud emas'}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
