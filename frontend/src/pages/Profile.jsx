import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Heart, Compass, Trophy, Flame, Sparkles, 
  MapPin, Clock, Calendar, Check, ExternalLink, Trash2,
  ShieldCheck, Mail, ArrowRight, MessageCircle, Star,
  Edit3, Camera, Upload, Phone, FileText, CheckCircle2, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { t } from '../utils/translations';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
];

export default function Profile({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const navigate = useNavigate();
  const { user, savedPlaces, toggleFavorite, bookings, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'bookings'

  // Default display user so profile is 100% accessible to everyone without login barriers
  const displayUser = user || {
    name: "Quvonchbek Baxronov",
    email: "baxronovquvonchbek11@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: "+998 94 433 88 48",
    bio: "Afrasia sayyohi va Ipak Yo'li madaniyati ixlosmandi.",
    streak: 3,
    xp: 120
  };

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: displayUser.name,
    email: displayUser.email,
    phone: displayUser.phone || '',
    bio: displayUser.bio || '',
    avatar: displayUser.avatar || ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editStatus, setEditStatus] = useState(null);
  const fileInputRef = useRef(null);

  const openEditModal = () => {
    setEditForm({
      name: displayUser.name,
      email: displayUser.email,
      phone: displayUser.phone || '',
      bio: displayUser.bio || '',
      avatar: displayUser.avatar || ''
    });
    setEditStatus(null);
    setIsEditModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Rasm hajmi 5MB dan kam bo'lishi kerak / L'immagine deve essere inferiore a 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setEditStatus({ success: false, msg: "Ism kiritilishi shart / Il nome è obbligatorio." });
      return;
    }
    setEditLoading(true);
    setEditStatus(null);
    
    // Save locally and via API
    localStorage.setItem('afrasia_user_profile', JSON.stringify({
      ...displayUser,
      ...editForm
    }));

    if (updateUserProfile) {
      await updateUserProfile(editForm);
    }
    
    setEditLoading(false);
    setEditStatus({ 
      success: true, 
      msg: lang === 'it' ? 'Profilo aggiornato con successo!' : 'Profil ma\'lumotlari muvaffaqiyatli saqlandi!' 
    });
    setTimeout(() => {
      setIsEditModalOpen(false);
      setEditStatus(null);
    }, 1000);
  };

  // Pre-configured places data for saved lookup
  const mockSavedCatalog = [
    { id: "hazrati-imom", title: "Hazrati Imom (Hastimom) majmuasi", image: "/uploads/places/hazrati_imom_cover.webp", category: "Ziyoratgoh", region: "Toshkent shahri", link: "/place/toshkent/Hazrati%20Imom%20(Hastimom)%20majmuasi" },
    { id: "chorsu-bozori", title: "Chorsu bozori", image: "/uploads/places/chorsu_bozori_cover.webp", category: "Tarixiy obida", region: "Toshkent shahri", link: "/place/toshkent/Chorsu%20bozori" },
    { id: "toshkent-teleminorasi", title: "Toshkent teleminorasi", image: "/uploads/places/toshkent_teleminorasi_cover.webp", category: "Zamonaviy maskan", region: "Toshkent shahri", link: "/place/toshkent/Toshkent%20teleminorasi" },
    { id: "chimyon-chorvoq", title: "Katta Chimyon va Chorvoq", image: "/uploads/places/chimyon_chorvoq_cover.webp", category: "Tabiat", region: "Toshkent viloyati", link: "/place/toshkent/Katta%20Chimyon%20va%20Chorvoq%20suv%20ombori" },
    { id: "tashkent-city-heritage", title: "Toshkent: Qadimiy Ipak Yo'li va Poytaxt Durdonalari", image: "/uploads/places/hazrati_imom_cover.webp", category: "Tur", region: "Toshkent", link: "/tours/tashkent-city-heritage" },
    { id: "chimgan-charvak-adventure", title: "Chorvoq va Chimyon: Tyanshan Tog'lari", image: "/uploads/places/chimyon_chorvoq_cover.webp", category: "Tur", region: "Toshkent viloyati", link: "/tours/chimgan-charvak-adventure" }
  ];

  const userSavedItems = mockSavedCatalog.filter(item => (savedPlaces || []).includes(item.id));

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      
      {/* 1. Profile Header Cover */}
      <div className="relative h-60 bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 pt-20">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "url('/uzbek_pattern.png')", backgroundRepeat: "repeat" }}></div>
      </div>

      {/* 2. User Info Card (Floating Avatar) */}
      <div className="container mx-auto px-4 max-w-5xl -mt-20 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative group cursor-pointer" onClick={openEditModal} title="Rasmni o'zgartirish">
                <img 
                  src={displayUser.avatar || PRESET_AVATARS[0]} 
                  alt={displayUser.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-lg group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title="Afrasia Explorer">
                  ✓
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{displayUser.name}</h1>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Sayohatchi Kabineti
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{displayUser.email}</span>
                  </div>
                  {displayUser.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{displayUser.phone}</span>
                    </div>
                  )}
                </div>

                {displayUser.bio ? (
                  <p className="text-xs text-slate-600 italic pt-1 max-w-md line-clamp-2">
                    "{displayUser.bio}"
                  </p>
                ) : (
                  <div className="text-[11px] text-slate-400 font-medium">
                    {lang === 'it' ? 'Membro Afrasia dal 2026' : 'Afrasia a\'zosi (2026)'}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                onClick={openEditModal}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'it' ? 'Modifica Profilo' : lang === 'en' ? 'Edit Profile' : 'Profilni Tahrirlash'}</span>
              </button>
            </div>
          </div>

          {/* Gamification Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/70">
              <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block mb-0.5">
                {lang === 'it' ? 'Streak Giornaliero' : 'Faollik (Streak)'}
              </span>
              <div className="flex items-center justify-center gap-1.5 text-2xl font-bold font-serif text-amber-800">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{displayUser.streak || 3} {lang === 'it' ? 'giorni' : 'kun'}</span>
              </div>
            </div>

            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/70">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block mb-0.5">
                {lang === 'it' ? 'Punti Esperienza' : 'Umumiy Ball (XP)'}
              </span>
              <div className="flex items-center justify-center gap-1 text-2xl font-bold font-serif text-emerald-800">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>{displayUser.xp || 120} XP</span>
              </div>
            </div>

            <div className="bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200/70">
              <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block mb-0.5">
                {lang === 'it' ? 'Luoghi Preferiti' : 'Sevimli Joylar'}
              </span>
              <div className="flex items-center justify-center gap-1.5 text-2xl font-bold font-serif text-rose-800">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <span>{(savedPlaces || []).length}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-0.5">
                {lang === 'it' ? 'Viaggi Prenotati' : 'Sayohat Bronlari'}
              </span>
              <div className="flex items-center justify-center gap-1.5 text-2xl font-bold font-serif text-slate-800">
                <Compass className="w-5 h-5 text-slate-700" />
                <span>{(bookings || []).length}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Navigation Tabs (Clean: Saved Places & Bookings) */}
      <div className="container mx-auto px-4 max-w-5xl mt-8">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'saved' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>{lang === 'it' ? 'Preferiti Salvati' : 'Sevimli Joylar'} ({(savedPlaces || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'bookings' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'it' ? 'I Miei Viaggi' : 'Mening Sayohatlarim'} ({(bookings || []).length})</span>
          </button>

        </div>
      </div>

      {/* 4. Tab Content Area */}
      <div className="container mx-auto px-4 max-w-5xl mt-6">
        
        {/* TAB 1: SAVED PLACES & TOURS */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            {userSavedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {userSavedItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between group">
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.category}
                      </div>
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block mb-1">📍 {item.region}</span>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h3>
                      </div>
                      
                      <Link 
                        to={item.link} 
                        className="block w-full text-center bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-bold py-2 rounded-xl text-xs transition-colors"
                      >
                        {lang === 'it' ? 'Visualizza Scheda' : 'Batafsil Ko\'rish'} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-3">
                <Heart className="w-12 h-12 text-slate-200 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">
                  {lang === 'it' ? 'Nessun luogo o viaggio salvato finora' : 'Hozircha saqlangan joylar yo\'q'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {lang === 'it' 
                    ? 'Esplora i monumenti di Tashkent e i tour, clicca sul cuore per salvarli qui!' 
                    : 'Toshkent obidalari va sayohatlarni ko\'rib chiqing, yoqtirganlaringizni yurakcha orqali saqlang!'}
                </p>
                <Link to="/regions/toshkent" className="inline-block bg-[#0c594d] hover:bg-[#09473d] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors">
                  {lang === 'it' ? 'Esplora Monumenti di Tashkent' : 'Toshkent Obidalarini O\'rganish'}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY TOUR BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {(bookings || []).length > 0 ? (
              <div className="space-y-4">
                {(bookings || []).map((bk, bIdx) => (
                  <div key={bIdx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                          ✓ {bk.status || 'TASDIQLANDI'}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          Bron ID: {bk.bookingReference || `AFR-2026-${bIdx + 1}`}
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-slate-900">
                        {bk.tourTitle || "Sayohat Turi"}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {bk.bookingDate}
                        </span>
                        <span>•</span>
                        <span>{bk.adults || 1} {lang === 'it' ? 'adulti' : 'kishi'}</span>
                        <span>•</span>
                        <strong className="text-slate-900">€{bk.totalPrice}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/998901234567?text=${encodeURIComponent(`Salom! Mening bron kodim: ${bk.bookingReference || ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'it' ? 'Assistenza WhatsApp' : 'WhatsApp Menejer'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-3">
                <Compass className="w-12 h-12 text-slate-200 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">
                  {lang === 'it' ? 'Non hai ancora viaggi prenotati' : 'Sizda hozircha bron qilingan sayohatlar yo\'q'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {lang === 'it' 
                    ? 'Scegli un tour a Tashkent o lungo la Via della Seta e prenotalo con cancellazione gratuita.' 
                    : 'Toshkent va Ipak Yo\'li bo\'ylab ekskursiya yoki sayohatlarni tanlab, bepul bekor qilish kafolati bilan bron qiling.'}
                </p>
                <Link to="/tours" className="inline-block bg-[#0c594d] hover:bg-[#09473d] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors">
                  {lang === 'it' ? 'Vedi Tutti i Viaggi Disponibili' : 'Sayohatlar Ro\'yxatini Ko\'rish'}
                </Link>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 5. EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="space-y-1 mb-6">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                {lang === 'it' ? 'Modifica Profilo' : 'Profilni Tahrirlash'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'it' 
                  ? 'Aggiorna i tuoi dati personali, carica la tua foto o scegli un avatar.' 
                  : 'Shaxsiy ma\'lumotlaringizni yangilang, o\'z rasmingizni yuklang yoki avatarni tanlang.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Avatar Uploader & Selector */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  {lang === 'it' ? 'Foto Profilo' : 'Profil Rasmi'}
                </label>

                <div className="flex items-center gap-4">
                  <img
                    src={editForm.avatar || PRESET_AVATARS[0]}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
                  />
                  <div className="space-y-1.5 flex-1">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{lang === 'it' ? 'Carica dal tuo dispositivo' : 'Qurilmadan rasm yuklash'}</span>
                    </button>
                    <span className="text-[10px] text-slate-400 block">
                      JPG, PNG, WebP (max 5MB)
                    </span>
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-500 block mb-2">
                    {lang === 'it' ? 'Oppure scegli un avatar da viaggio:' : 'Yoki tayyor sayohatchi avatarini tanlang:'}
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((avUrl, aIdx) => (
                      <button
                        key={aIdx}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, avatar: avUrl }))}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          editForm.avatar === avUrl ? 'border-emerald-600 scale-105 shadow-sm ring-2 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={avUrl} alt={`Avatar ${aIdx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === 'it' ? 'Nome e Cognome' : 'To\'liq Ism-Sharifingiz'} *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-slate-900 outline-none transition-all"
                  placeholder="Ism va Familiyangiz"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-slate-900 outline-none transition-all"
                  placeholder="nomingiz@gmail.com"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === 'it' ? 'Numero di Telefono' : 'Telefon Raqami'}
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-slate-900 outline-none transition-all"
                  placeholder="+998 90 123 45 67"
                />
              </div>

              {/* Bio / About */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === 'it' ? 'Informazioni su di te (Bio)' : 'O\'zingiz haqingizda (Bio)'}
                </label>
                <textarea
                  rows={2}
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-slate-900 outline-none transition-all resize-none"
                  placeholder="Sayyohlik qiziqishlaringiz..."
                />
              </div>

              {/* Status feedback message */}
              {editStatus && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  editStatus.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold' : 'bg-rose-50 border border-rose-200 text-rose-900 font-bold'
                }`}>
                  {editStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <span>⚠️</span>}
                  <span>{editStatus.msg}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                >
                  {lang === 'it' ? 'Annulla' : 'Bekor Qilish'}
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#0c594d] hover:bg-[#09473d] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                >
                  {editLoading ? (
                    <span>Saqlanmoqda...</span>
                  ) : (
                    <span>Saqlash</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
