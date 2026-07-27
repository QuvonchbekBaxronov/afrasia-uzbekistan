import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { uzbMapPaths } from '../data/uzb_map_paths';
import axios from 'axios';

export default function MapOfUzbekistan() {
  const navigate = useNavigate();
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapping from region ID to Open-Meteo response index
  const regionIndexMap = {
    toshkent: 0,
    toshkent_city: 0,
    namangan: 1,
    fargona: 2,
    andijon: 3,
    guliston: 4,
    jizzax: 5,
    navoiy: 6,
    samarqand: 7,
    qarshi: 8,
    termiz: 9,
    buxoro: 10,
    xiva: 11,
    nukus: 12
  };

  // Weather code helper
  const getWeatherInfo = (code) => {
    if (code === 0) return { icon: '☀️', text: 'Quyoshli' };
    if ([1, 2, 3].includes(code)) return { icon: '⛅', text: 'Qisman bulutli' };
    if ([45, 48].includes(code)) return { icon: '🌫️', text: 'Tuman' };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { icon: '🌧️', text: 'Yomg\'irli' };
    if ([71, 73, 75, 85, 86].includes(code)) return { icon: '❄️', text: 'Qor' };
    if ([95, 96, 99].includes(code)) return { icon: '⛈️', text: 'Momaqaldiroq' };
    return { icon: '☀️', text: 'Ochiq havo' };
  };

  // Fetch weather data for all regions on component mount
  useEffect(() => {
    const lat = '41.31,41.00,40.38,40.78,40.49,40.12,40.08,39.65,38.86,37.22,39.77,41.38,42.46';
    const lon = '69.28,71.67,71.78,72.35,68.78,67.84,65.37,66.96,65.80,67.28,64.42,60.36,59.60';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

    setLoading(true);
    axios.get(url)
      .then(res => {
        // Response is an array if multi-location or a single object if single
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setWeatherData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Weather API error, loading mock fallback data", err);
        // Fallback simulated data if API fails or offline
        const mockData = Array.from({ length: 13 }, (_, i) => ({
          current_weather: { temperature: 30 + (i % 5), windspeed: 4 + (i % 3), weathercode: i % 3 },
          daily: {
            time: Array.from({ length: 5 }, (_, d) => {
              const date = new Date();
              date.setDate(date.getDate() + d);
              return date.toISOString().split('T')[0];
            }),
            temperature_2m_max: [32, 33, 31, 34, 32],
            temperature_2m_min: [20, 21, 19, 22, 20],
            weathercode: [0, 1, 2, 1, 0]
          }
        }));
        setWeatherData(mockData);
        setLoading(false);
      });
  }, []);

  // Helper to extract weather for a specific region ID
  const getRegionWeather = (id) => {
    if (!weatherData) return null;
    const idx = regionIndexMap[id] ?? 0;
    const data = weatherData[idx];
    if (!data) return null;

    const current = data.current_weather;
    const info = getWeatherInfo(current.weathercode);

    // Format 5-day forecast
    const forecast = [];
    if (data.daily && data.daily.time) {
      for (let i = 0; i < 5; i++) {
        const dateStr = data.daily.time[i];
        const dateObj = new Date(dateStr);
        const dayName = dateObj.toLocaleDateString('uz-UZ', { weekday: 'short' });
        
        forecast.push({
          day: dayName,
          max: Math.round(data.daily.temperature_2m_max[i]),
          min: Math.round(data.daily.temperature_2m_min[i]),
          info: getWeatherInfo(data.daily.weathercode[i])
        });
      }
    }

    return {
      temp: Math.round(current.temperature),
      wind: Math.round(current.windspeed),
      condition: info.text,
      icon: info.icon,
      clouds: current.weathercode > 0 ? 60 : 10, // Simulated cloud % from code
      forecast
    };
  };

  const activeRegionId = hoveredRegion?.id || selectedRegion?.id || 'toshkent_city';
  const activeRegionName = hoveredRegion?.name || selectedRegion?.name || 'Toshkent shahri';
  const weather = getRegionWeather(activeRegionId);

  // Water bodies (Aral Sea, Aydarkul)
  const waterBodies = [
    { id: 'aral_sea', name: 'Orol dengizi', d: 'M 130 180 Q 150 160 170 185 Q 160 210 135 205 Z' },
    { id: 'aydarkul', name: 'Aydarko\'l', d: 'M 620 285 Q 650 275 680 290 Q 660 305 630 300 Z' }
  ];

  // Winding rivers
  const rivers = [
    { id: 'amudaryo', d: 'M 590 530 Q 560 480 500 450 T 400 420 T 300 370 T 220 330 T 160 215' },
    { id: 'sirdaryo_river', d: 'M 930 260 Q 880 250 820 270 T 730 240 T 710 180' }
  ];

  // Mountain coordinate sets for detailed shaded relief peaks
  const mountains = [
    { x: 800, y: 170, scale: 1.2 }, { x: 825, y: 150, scale: 1.4 }, { x: 850, y: 160, scale: 1.1 },
    { x: 710, y: 330, scale: 1.2 }, { x: 730, y: 350, scale: 1.3 },
    { x: 620, y: 440, scale: 1.3 }, { x: 640, y: 460, scale: 1.4 },
    { x: 600, y: 500, scale: 1.1 }, { x: 615, y: 520, scale: 1.2 }
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-2">O'zbekiston Interaktiv Xaritasi</h1>
          <p className="text-gray-500 text-sm md:text-base font-semibold">Geografik relyef va real vaqt rejimidagi ob-havo ma'lumotlari paneli</p>
        </div>

        {/* Dynamic region info bar */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-6 py-3 min-w-[280px] h-[68px] flex items-center justify-center transition-all duration-300 shadow-sm">
          {activeRegionName ? (
            <div className="text-center">
              <span className="text-xs text-primary font-bold uppercase tracking-wider block">Tanlangan hudud</span>
              <span className="text-lg font-serif font-bold text-dark">{activeRegionName}</span>
            </div>
          ) : (
            <span className="text-gray-400 font-semibold text-sm">Viloyat ustiga bosing yoki tanlang</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Detailed Interactive SVG Map with Reliefs */}
        <div className="lg:col-span-2 bg-[#FAFAFA] border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="relative w-full aspect-[16/9] bg-[#F1F8E9]/40 rounded-xl border border-gray-50/50 shadow-inner overflow-hidden flex items-center justify-center p-2">
            
            <svg 
              viewBox="0 0 1000 550" 
              className="w-full h-full drop-shadow-xl"
              style={{ maxHeight: '500px' }}
            >
              <defs>
                {/* Water Gradient */}
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00b4db" />
                  <stop offset="100%" stopColor="#0083b0" />
                </linearGradient>
                
                {/* Land Shadows */}
                <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.1" />
                </filter>
              </defs>

              {/* 1. Base Regions */}
              <g className="map-regions" filter="url(#shadow)">
                {uzbMapPaths.map((reg) => (
                  <path
                    key={reg.id}
                    d={reg.d}
                    fill={hoveredRegion?.id === reg.id || selectedRegion?.id === reg.id ? '#DD2C00' : reg.color}
                    stroke={hoveredRegion?.id === reg.id || selectedRegion?.id === reg.id ? '#FFFFFF' : '#FFFFFF'}
                    strokeWidth={hoveredRegion?.id === reg.id || selectedRegion?.id === reg.id ? 2.5 : 1}
                    className="transition-all duration-300 cursor-pointer hover:opacity-95"
                    onMouseEnter={() => setHoveredRegion(reg)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => navigate(reg.link)}
                  />
                ))}
              </g>

              {/* 2. Cloud Shadow Overlay representing cloudy weather */}
              <g className="map-clouds-shadow pointer-events-none">
                {uzbMapPaths.map((reg) => {
                  const rWeather = getRegionWeather(reg.id);
                  if (rWeather && rWeather.clouds > 50) {
                    return (
                      <path
                        key={`cloud-sh-${reg.id}`}
                        d={reg.d}
                        fill="#37474F"
                        opacity="0.18"
                        className="transition-all duration-300"
                      />
                    );
                  }
                  return null;
                })}
              </g>

              {/* 3. Water Bodies (Lakes & Seas) */}
              <g className="map-water pointer-events-none">
                {waterBodies.map((lake) => (
                  <path
                    key={lake.id}
                    d={lake.d}
                    fill="url(#waterGrad)"
                    stroke="#0083b0"
                    strokeWidth="0.5"
                  />
                ))}
              </g>

              {/* 4. Rivers */}
              <g className="map-rivers pointer-events-none">
                {rivers.map((river) => (
                  <path
                    key={river.id}
                    d={river.d}
                    fill="none"
                    stroke="#00B4DB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="4 2"
                    opacity="0.8"
                  />
                ))}
              </g>

              {/* 5. Mountain Reliefs */}
              <g className="map-mountains pointer-events-none opacity-60">
                {mountains.map((mtn, idx) => (
                  <g key={`mtn-${idx}`} transform={`translate(${mtn.x}, ${mtn.y}) scale(${mtn.scale})`}>
                    <polygon points="0,0 -8,12 0,12" fill="#795548" />
                    <polygon points="0,0 0,12 8,12" fill="#A1887F" />
                    <polygon points="0,0 -3,4 3,4" fill="#FFFFFF" opacity="0.9" />
                  </g>
                ))}
              </g>

              {/* 6. Dynamic Cloud weather indicators on map */}
              <g className="weather-symbols pointer-events-none opacity-70">
                {uzbMapPaths.map((reg) => {
                  const rWeather = getRegionWeather(reg.id);
                  if (rWeather && rWeather.clouds > 50) {
                    return (
                      <text
                        key={`sym-${reg.id}`}
                        x={reg.labelX}
                        y={reg.labelY - 14}
                        textAnchor="middle"
                        className="text-xs"
                      >
                        {rWeather.icon}
                      </text>
                    );
                  }
                  return null;
                })}
              </g>

              {/* 7. Direct Clean Region Typography (Reference Image Style) */}
              <g className="map-labels pointer-events-none select-none">
                {uzbMapPaths.map((reg) => {
                  const isSelected = selectedRegion?.id === reg.id;
                  const isHovered = hoveredRegion?.id === reg.id;
                  const displayName = reg.displayName || reg.name;

                  return (
                    <g 
                      key={`lbl-${reg.id}`} 
                      transform={`translate(${reg.labelX}, ${reg.labelY})`}
                      className="transition-all duration-300"
                    >
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isSelected || isHovered ? "#DD2C00" : "#2d1c34"}
                        stroke="#ffffff"
                        strokeWidth="0.4"
                        className="text-[9.5px] font-sans font-black tracking-wider uppercase"
                        style={{
                          paintOrder: 'stroke fill',
                          textShadow: '0px 1px 2px rgba(255,255,255,0.9)'
                        }}
                      >
                        {displayName}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500 font-semibold border-t border-gray-100 pt-4">
            <span>* Viloyat ustiga bitta bosganda ob-havo yuklanadi, ikki marta tez bosganda (double-click) batafsil sahifaga kiradi.</span>
            <span className="text-primary font-bold">Real-time Ob-havo Xaritasi v3.5</span>
          </div>
        </div>

        {/* Right Side: Sidebar Widgets */}
        <div className="flex flex-col gap-6">
          {/* Real-time Weather Dashboard Widget */}
          <div className="bg-gradient-to-br from-dark to-gray-800 text-white rounded-2xl p-6 shadow-lg border border-gray-700/50">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <span className="text-gray-400 text-xs">Ob-havo yuklanmoqda...</span>
              </div>
            ) : weather ? (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-primary font-bold text-xs uppercase tracking-wider block mb-1">Jonli Ob-havo</span>
                    <h3 className="text-xl font-bold font-serif">
                      {activeRegionName}
                    </h3>
                  </div>
                  <span className="text-3xl">{weather.icon}</span>
                </div>

                {/* Current Weather Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <span className="text-gray-400 text-xs block mb-1">Harorat</span>
                    <span className="text-2xl font-bold">{weather.temp}°C</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <span className="text-gray-400 text-xs block mb-1">Shamol</span>
                    <span className="text-xl font-bold">{weather.wind} m/s</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 col-span-2 flex justify-between items-center">
                    <div>
                      <span className="text-gray-400 text-xs block">Holat</span>
                      <span className="font-bold text-sm">{weather.condition}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 text-xs block">Namlik</span>
                      <span className="font-bold text-sm">{weather.clouds}% (bulutlik)</span>
                    </div>
                  </div>
                </div>

                {/* 5-day daily forecast (small, compact representation) */}
                <div className="border-t border-white/10 pt-4 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">5 kunlik ob-havo</h4>
                  <div className="flex justify-between gap-1">
                    {weather.forecast.map((dayData, idx) => (
                      <div key={idx} className="flex flex-col items-center bg-white/5 rounded p-1.5 flex-grow text-center">
                        <span className="text-[10px] text-gray-400 capitalize">{dayData.day}</span>
                        <span className="text-sm my-1">{dayData.info.icon}</span>
                        <span className="text-[10px] font-bold">{dayData.max}°</span>
                        <span className="text-[9px] text-gray-500">{dayData.min}°</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link 
                  to={`/regions/${activeRegionId.replace('_city', '')}`}
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl text-center text-sm block uppercase tracking-wider transition-all"
                >
                  Batafsil ma'lumot
                </Link>
              </div>
            ) : (
              <div className="text-center py-10">Ob-havo ma'lumotlarini yuklashda xatolik yuz berdi.</div>
            )}
          </div>

          {/* Widget 1: Traveler guide */}
          <div className="group relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-dark flex flex-col justify-end p-6 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=500&q=80" 
              alt="Traveler Guide" 
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="relative z-20 text-white">
              <span className="text-primary font-bold text-xs uppercase tracking-wider block mb-1">Qo'llanma</span>
              <h3 className="text-xl font-bold font-serif">Sayyohlar uchun foydali</h3>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
