import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { t } from '../utils/translations';

export default function Cuisine({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [cuisine, setCuisine] = useState([]);
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80");

  useEffect(() => {
    axios.get('http://localhost:3001/cuisine')
      .then(res => setCuisine(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:3001/pageBanners')
      .then(res => {
        if (res.data && res.data.cuisine) setBannerUrl(res.data.cuisine);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Hero Banner */}
      <div className="relative h-[340px] md:h-[380px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>
        <img 
          src={bannerUrl} 
          alt="O'zbek milliy taomlari" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-75 opacity-80" 
        />
        <div className="relative z-20 text-center px-4 max-w-4xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-white font-extrabold tracking-tight drop-shadow-md mb-2">
            {t('gastronomy', currentLang.code)}
          </h1>
          <p className="text-slate-200 text-sm md:text-base font-serif italic drop-shadow">
            {lang === 'it' ? "Il ricco patrimonio culinario dell'Uzbekistan" : lang === 'en' ? "The rich culinary heritage of Uzbekistan" : "O'zbekistonning boy pazandachilik merosi"}
          </p>
        </div>
      </div>

      {/* Grid of Compact Recipe Cards */}
      <div className="container mx-auto px-6 max-w-7xl pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cuisine.map((dish) => {
            const dishName = dish["name_" + lang] || dish.name;
            const dishCalories = dish["calories_" + lang] || dish.calories;
            const dishOrigin = dish["origin_" + lang] || dish.origin;
            const dishDesc = dish["desc_" + lang] || dish.desc;
            return (
              <Link 
                key={dish.id} 
                to={`/cuisine/${dish.id}`} 
                className="group block bg-white hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Image */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 relative">
                  <img 
                    src={dish.image} 
                    alt={dishName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.target.style.display = 'none'; }} 
                  />
                </div>
                
                {/* Card Content */}
                <div className="px-1">
                  <h2 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {dishName}
                  </h2>
                  
                  <div className="flex gap-2 text-[10px] text-gray-400 font-semibold mt-1">
                    <span>{dishCalories}</span>
                    <span>•</span>
                    <span className="line-clamp-1">{dishOrigin ? dishOrigin.split('.')[0] : ''}</span>
                  </div>

                  <p className="text-gray-500 text-[11px] leading-relaxed font-light mt-2 line-clamp-3">
                    {dishDesc}
                  </p>

                  <span className="inline-block text-[11px] font-bold text-primary mt-3 group-hover:underline">
                    {t('readMore', currentLang.code)} &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}