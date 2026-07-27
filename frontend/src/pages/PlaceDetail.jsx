import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';

export default function PlaceDetail({ currentLang }) {
  const { regionId, placeName } = useParams();
  const navigate = useNavigate();
  const lang = currentLang?.code || 'it';

  const [region, setRegion] = useState(null);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected main image for gallery preview
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Comments / Reviews state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    author: '',
    country: lang === 'it' ? 'Italia' : lang === 'en' ? 'United Kingdom' : 'O\'zbekiston',
    rating: 5,
    text: ''
  });
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Favorite state
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fav_places') || '[]');
    } catch {
      return [];
    }
  });

  const decodedPlaceName = decodeURIComponent(placeName || '');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/regions`)
      .then(res => {
        const regions = res.data || [];
        let foundRegion = null;
        let foundPlace = null;

        for (const reg of regions) {
          if (reg.id === regionId || reg.name.toLowerCase() === regionId.toLowerCase()) {
            foundRegion = reg;
            if (reg.famousPlaces && Array.isArray(reg.famousPlaces)) {
              foundPlace = reg.famousPlaces.find(p => 
                p.name.toLowerCase() === decodedPlaceName.toLowerCase() ||
                p.name.toLowerCase().includes(decodedPlaceName.toLowerCase()) ||
                decodedPlaceName.toLowerCase().includes(p.name.toLowerCase())
              );
            }
            break;
          }
        }

        if (!foundPlace) {
          for (const reg of regions) {
            if (reg.famousPlaces && Array.isArray(reg.famousPlaces)) {
              const p = reg.famousPlaces.find(item => 
                item.name.toLowerCase() === decodedPlaceName.toLowerCase()
              );
              if (p) {
                foundPlace = p;
                foundRegion = reg;
                break;
              }
            }
          }
        }

        setRegion(foundRegion);
        setPlace(foundPlace);
        if (foundPlace) {
          setSelectedPhoto(foundPlace.image);
        }
        setLoading(false);

        // Load comments from localStorage
        if (foundPlace) {
          const storageKey = `comments_${foundPlace.name.replace(/\s+/g, '_')}`;
          try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
            if (saved.length > 0) {
              setComments(saved);
            } else {
              const defaultComments = [
                {
                  id: 1,
                  author: "Marco Rossi",
                  country: "Italy 🇮🇹",
                  rating: 5,
                  date: "2026-06-15",
                  text: "Bellissimo posto! La storia e l'architettura sono straordinarie."
                },
                {
                  id: 2,
                  author: "Sarah Jenkins",
                  country: "United Kingdom 🇬🇧",
                  rating: 5,
                  date: "2026-07-02",
                  text: "An absolute masterpiece of Uzbekistan architecture. Highly recommended!"
                },
                {
                  id: 3,
                  author: "Jasur Bekmirov",
                  country: "O'zbekiston 🇺🇿",
                  rating: 5,
                  date: "2026-07-10",
                  text: "Juda ajoyib va muqaddas maskan! Oilamiz bilan tashrif buyurdik."
                }
              ];
              setComments(defaultComments);
              localStorage.setItem(storageKey, JSON.stringify(defaultComments));
            }
          } catch {
            setComments([]);
          }
        }
      })
      .catch(err => {
        console.error("Failed to load place details:", err);
        setLoading(false);
      });
  }, [regionId, decodedPlaceName]);

  // Add a new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.text.trim()) {
      alert(lang === 'it' ? 'Inserisci il tuo nome e commento!' : lang === 'en' ? 'Please enter your name and comment!' : 'Iltimos, ismingiz va fikringizni kiriting!');
      return;
    }

    const created = {
      id: Date.now(),
      author: newComment.author.trim(),
      country: newComment.country || (lang === 'it' ? 'Italia 🇮🇹' : lang === 'en' ? 'United Kingdom 🇬🇧' : "O'zbekiston 🇺🇿"),
      rating: Number(newComment.rating),
      date: new Date().toISOString().split('T')[0],
      text: newComment.text.trim()
    };

    const updatedComments = [created, ...comments];
    setComments(updatedComments);

    if (place) {
      const storageKey = `comments_${place.name.replace(/\s+/g, '_')}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedComments));
    }

    setNewComment({ author: '', country: lang === 'it' ? 'Italia' : lang === 'en' ? 'United Kingdom' : 'O\'zbekiston', rating: 5, text: '' });
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center font-serif text-xl text-slate-800">{lang === 'it' ? 'Caricamento in corso...' : lang === 'en' ? 'Loading...' : 'Ma\'lumotlar yuklanmoqda...'}</div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-20">
        <h2 className="text-2xl font-bold font-serif text-slate-900 mb-2">
          {lang === 'it' ? 'Luogo non trovato' : lang === 'en' ? 'Place not found' : 'Maskan topilmadi'}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {lang === 'it' ? 'Il luogo cercato non è stato trovato nel database.' : lang === 'en' ? 'The place you searched for was not found in the database.' : 'Siz qidirgan diqqatga sazovor joy bazadan topilmadi.'}
        </p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs"
        >
          {lang === 'it' ? '← Torna indietro' : lang === 'en' ? '← Go back' : '← Orqaga qaytish'}
        </button>
      </div>
    );
  }

  const averageRating = comments.length > 0
    ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1)
    : "5.0";

  const allPhotos = [place.image, ...(place.gallery || [])].filter(Boolean);

  const placeTitle = place["name_" + lang] || place.name;
  const placeHistory = place["history_" + lang] || place.history;
  const placeLocation = place["location_" + lang] || place.location;
  const regionName = region ? (region["name_" + lang] || region.name) : '';

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Minimalist Top Header & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-4 pt-20 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Breadcrumb links */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-3">
            <Link to="/" className="hover:text-slate-900 transition-colors">{t('home', currentLang.code)}</Link>
            <span>/</span>
            <Link to="/go-uzbekistan" className="hover:text-slate-900 transition-colors">Go Uzbekistan</Link>
            <span>/</span>
            {region && (
              <>
                <Link to={`/regions/${region.id}`} className="hover:text-slate-900 transition-colors">{regionName}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-slate-900 font-bold">{placeTitle}</span>
          </div>

          {/* Minimalist Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {region && (
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-md border border-slate-200">
                    📍 {regionName}
                  </span>
                )}
                {place.category && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-md border border-emerald-200">
                    {place.category}
                  </span>
                )}
                <span className="bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-md border border-amber-200">
                  ⭐ {averageRating} ({comments.length} {lang === 'it' ? 'recensioni' : lang === 'en' ? 'reviews' : 'izoh'})
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif text-slate-900 font-bold tracking-tight">
                {placeTitle}
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {lang === 'it' ? 'Indirizzo' : lang === 'en' ? 'Address' : 'Manzil'}: {placeLocation || regionName}
              </p>
            </div>

            <div className="flex gap-2 self-start md:self-auto">
              {place.mapUrl && (
                <a 
                  href={place.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                >
                  {lang === 'it' ? 'Vedi sulla mappa ↗' : lang === 'en' ? 'View on map ↗' : 'Xaritada ko\'rish ↗'}
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Left Column */}
          <div className="md:col-span-7 xl:col-span-8 space-y-6">
            
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="h-80 sm:h-[460px] w-full relative bg-slate-900 rounded-lg overflow-hidden">
                <img 
                  src={selectedPhoto || place.image || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1200&q=80'} 
                  alt={placeTitle} 
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Photo Gallery */}
              {allPhotos.length > 1 && (
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {lang === 'it' ? 'Galleria Fotografica' : lang === 'en' ? 'Photo Gallery' : 'Foto Galereya'}:
                  </span>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {allPhotos.map((photo, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => setSelectedPhoto(photo)}
                        className={`relative rounded-xl overflow-hidden shrink-0 w-24 h-16 border-2 transition-all ${
                          selectedPhoto === photo ? 'border-emerald-600 shadow-md scale-105' : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt={`Thumbnail ${pIdx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DESCRIPTION CARD */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">{t('details', currentLang.code)}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{lang === 'it' ? 'Informazioni ufficiali sul luogo' : lang === 'en' ? 'Official information about the place' : 'Maskan haqidagi rasmiy ma\'lumotlar'}</p>
              </div>

              <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {placeHistory}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="md:col-span-5 xl:col-span-4 space-y-6">
            
            {/* Quick Specs Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
                {lang === 'it' ? 'Informazioni Principali' : lang === 'en' ? 'Key Information' : 'Asosiy Ma\'lumotlar'}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">{lang === 'it' ? 'Orari:' : lang === 'en' ? 'Working Hours:' : 'Ish vaqti:'}</span>
                  <span className="font-bold text-slate-900">{place.workHours || (lang === 'it' ? 'Aperto ogni giorno' : lang === 'en' ? 'Open daily' : 'Har kuni ochiq')}</span>
                </div>

                <div className="flex justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">{lang === 'it' ? 'Biglietto:' : lang === 'en' ? 'Ticket Price:' : 'Bilet narxi:'}</span>
                  <span className="font-bold text-slate-900">{place.ticketPrice || (lang === 'it' ? 'Nessuna info' : lang === 'en' ? 'No information' : 'Ma\'lumot yo\'q')}</span>
                </div>

                <div className="flex justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">{lang === 'it' ? 'Tipo di luogo:' : lang === 'en' ? 'Place Type:' : 'Joy turi:'}</span>
                  <span className="font-bold text-slate-900">{place.category || 'Diqqatga sazovor'}</span>
                </div>
              </div>

              {place.mapUrl && (
                <a 
                  href={place.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{lang === 'it' ? 'Navigazione Google Maps' : lang === 'en' ? 'Google Maps Navigation' : 'Google Maps navigatsiyasi'}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              )}
            </div>

            {/* Region Card */}
            {region && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">{lang === 'it' ? 'Regione Associata' : lang === 'en' ? 'Associated Region' : 'Tegishli Viloyat'}</h4>
                <Link 
                  to={`/regions/${region.id}`}
                  className="block group rounded-xl overflow-hidden border border-slate-200 relative h-32"
                >
                  <img src={region.image} alt={regionName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-950/65 p-3 flex flex-col justify-end">
                    <span className="text-white font-bold font-serif text-base group-hover:text-emerald-300 transition-colors">{regionName}</span>
                    <span className="text-[11px] text-slate-300">{lang === 'it' ? 'Apri portale turistico regionale →' : lang === 'en' ? 'Open regional tourism portal →' : 'Viloyat turizm portalini ochish →'}</span>
                  </div>
                </Link>
              </div>
            )}

            {/* SAYYOHLAR IZOHLARI WIDGET */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">{lang === 'it' ? 'Recensioni dei Turisti' : lang === 'en' ? 'Tourist Reviews' : 'Sayyohlar Izohlari'} ({comments.length})</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{lang === 'it' ? 'Opinioni dei turisti su questo luogo' : lang === 'en' ? 'Tourist opinions about the place' : 'Maskan haqidagi turistlar mulohazasi'}</p>
                </div>
                <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  ⭐ {averageRating}
                </div>
              </div>

              {/* Form inside sidebar */}
              <form onSubmit={handleAddComment} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[11px] text-slate-800 uppercase">{lang === 'it' ? 'Lascia una recensione' : lang === 'en' ? 'Leave a review' : 'Izoh qoldirish'}</h4>

                {commentSubmitted && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] p-2 rounded font-bold">
                    {lang === 'it' ? 'Recensione salvata!' : lang === 'en' ? 'Review saved!' : 'Izohingiz saqlandi!'}
                  </div>
                )}

                <div>
                  <input 
                    type="text" 
                    placeholder={lang === 'it' ? 'Il tuo nome (es: Marco)' : lang === 'en' ? 'Your name (e.g. Sarah)' : 'Ismingiz (masalan: Sardor Bek)'}
                    value={newComment.author}
                    onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder={lang === 'it' ? 'Tuo Paese' : lang === 'en' ? 'Your Country' : 'Davlatingiz'}
                    value={newComment.country}
                    onChange={(e) => setNewComment({ ...newComment, country: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-slate-800"
                  />

                  <select 
                    value={newComment.rating}
                    onChange={(e) => setNewComment({ ...newComment, rating: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2 py-2 text-xs bg-white focus:outline-none focus:border-slate-800"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                    <option value={3}>⭐⭐⭐ (3)</option>
                    <option value={2}>⭐⭐ (2)</option>
                    <option value={1}>⭐ (1)</option>
                  </select>
                </div>

                <textarea 
                  rows={2}
                  placeholder={lang === 'it' ? 'Il tuo commento...' : lang === 'en' ? 'Your comment...' : 'Qisqa fikringiz...'}
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-slate-800"
                  required
                />

                <button 
                  type="submit" 
                  className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg text-xs hover:bg-slate-800 transition-all shadow-sm"
                >
                  {lang === 'it' ? 'Invia' : lang === 'en' ? 'Submit' : 'Yuborish'}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {comments.map((item) => (
                  <div key={item.id} className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/90 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{item.author}</span>
                        <span className="text-[10px] text-slate-500">({item.country})</span>
                      </div>
                      <span className="text-amber-500 font-bold text-[10px]">
                        {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-normal text-xs">
                      {item.text}
                    </p>

                    <div className="text-[10px] text-slate-400">
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
