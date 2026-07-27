import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Volume2, Search, RotateCw, Sparkles, BookOpen, 
  Play, Compass, ShieldAlert, Utensils, Tag, CreditCard,
  PhoneCall, Coffee, Car, MapPin, Check, Copy
} from 'lucide-react';
import { t } from '../utils/translations';

import { API_BASE } from '../config/api';

export default function Language({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [phrases, setPhrases] = useState([]);
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80");
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'flashcard'
  
  // Audio Playback state
  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // REAL PRACTICAL TOURIST PHRASES (Curated for Tourists in Uzbekistan)
  const essentialTouristPhrases = [
    // 1. BOZOR VA NARX-NAVO (Bargaining & Shopping)
    { id: 101, uz: "Narxi qancha?", en: "How much does it cost?", it: "Quanto costa?", category: "Bozor va Narx", pronunciation: "Nahr-KHI kahn-CHAH?", context: "Bozorda / Do'konda" },
    { id: 102, uz: "Arzonroq qilib bering", en: "Can you make it cheaper?", it: "Mi fa un prezzo più basso?", category: "Bozor va Narx", pronunciation: "Ahr-zohn-ROHK kee-LEENG", context: "Bozorda savdolashganda" },
    { id: 103, uz: "Chegirma bormi?", en: "Is there a discount?", it: "C'è uno sconto?", category: "Bozor va Narx", pronunciation: "Cheh-geer-MAH bohr-MEE?", context: "Xaridda" },
    { id: 104, uz: "Karta bilan to'lasa bo'ladimi?", en: "Can I pay by card?", it: "Posso pagare con carta?", category: "Bozor va Narx", pronunciation: "Kahr-TAH bee-LAHN toh-lah-SAH boh-lah-dee-MEE?", context: "To'lovda" },
    { id: 105, uz: "Naqd pul bera olamanmi?", en: "Can I pay with cash?", it: "Posso pagare in contanti?", category: "Bozor va Narx", pronunciation: "Nahkd POOL beh-RAH oh-lah-mahn-MEE?", context: "To'lovda" },
    { id: 106, uz: "Bu nima?", en: "What is this?", it: "Che cos'è questo?", category: "Bozor va Narx", pronunciation: "Boo NEE-mah?", context: "Bozorda / Esdalik sovg'alarida" },

    // 2. TAKSI VA SAYOHAT (Taxi & Getting Around)
    { id: 201, uz: "Taksi kerak", en: "I need a taxi", it: "Ho bisogno di un taxi", category: "Taksi va Sayohat", pronunciation: "Tahk-SEE keh-RAHK", context: "Ko'chada / Aeroportda" },
    { id: 202, uz: "Aeroportga qancha beray?", en: "How much to the airport?", it: "Quanto costa per l'aeroporto?", category: "Taksi va Sayohat", pronunciation: "Ah-eh-roh-POHRT-gah kahn-CHAH beh-RYE?", context: "Taksida" },
    { id: 203, uz: "Meni shu manzilga olib boring", en: "Take me to this address", it: "Mi porti a questo indirizzo", category: "Taksi va Sayohat", pronunciation: "Meh-NEE shoo mahn-zeel-GAH oh-LEEB boh-REENG", context: "Taksida" },
    { id: 204, uz: "Shu yerda to'xtating", en: "Stop right here please", it: "Fermi qui per favore", category: "Taksi va Sayohat", pronunciation: "Shoo YEHR-dah tohk-TAH-teeng", context: "Taksida" },
    { id: 205, uz: "Vokzal qaerda?", en: "Where is the train station?", it: "Dov'è la stazione dei treni?", category: "Taksi va Sayohat", pronunciation: "Vohk-ZAHL kah-EHR-dah?", context: "Yo'l so'raganda" },
    { id: 206, uz: "Mehmonxona qaerda?", en: "Where is the hotel?", it: "Dov'è l'albergo?", category: "Taksi va Sayohat", pronunciation: "Meh-mohn-KHOH-nah kah-EHR-dah?", context: "Yo'lda" },
    { id: 207, uz: "Qancha vaqt ketadi?", en: "How long does it take?", it: "Quanto tempo ci vuole?", category: "Taksi va Sayohat", pronunciation: "Kahn-CHAH vahkt keh-TAH-dee?", context: "Yo'lda" },

    // 3. RESTORAN VA OVQATLANISH (Dining & Food)
    { id: 301, uz: "Menyu bering, iltimos", en: "Can I have the menu, please?", it: "Il menu, per favore", category: "Restoran va Ovqat", pronunciation: "Mehn-YOO beh-REENG eel-tee-MOHS", context: "Restoranda" },
    { id: 302, uz: "Osh bering", en: "Please give me Plov (Uzbek pilaf)", it: "Un Plov per favore", category: "Restoran va Ovqat", pronunciation: "Ohsh beh-REENG", context: "Oshxonada" },
    { id: 303, uz: "Ko'k choy bering", en: "Green tea please", it: "Tè verde per favore", category: "Restoran va Ovqat", pronunciation: "Kohk choy beh-REENG", context: "Choyxonada" },
    { id: 304, uz: "Muzli suv bering", en: "I'd like cold water", it: "Acqua fredda per favore", category: "Restoran va Ovqat", pronunciation: "Mooz-LEE soov beh-REENG", context: "Restoranda" },
    { id: 305, uz: "Juda mazali!", en: "It is very delicious!", it: "È buonissimo!", category: "Restoran va Ovqat", pronunciation: "JOO-dah mah-zah-LEE!", context: "Taomdan keyin" },
    { id: 306, uz: "Hisobni keltiring", en: "Can I have the bill please?", it: "Il conto, per favore", category: "Restoran va Ovqat", pronunciation: "Hee-SOHB-nee kehl-tee-REENG", context: "To'lovda" },
    { id: 307, uz: "Xojatxona qaerda?", en: "Where is the restroom?", it: "Dov'è il bagno?", category: "Restoran va Ovqat", pronunciation: "Khoh-jaht-KHOH-nah kah-EHR-dah?", context: "Jamoat joyida" },
    { id: 308, uz: "Wi-Fi paroli nima?", en: "What is the Wi-Fi password?", it: "Qual è la password del Wi-Fi?", category: "Restoran va Ovqat", pronunciation: "Vee-Fee pah-roh-LEE nee-MAH?", context: "Kafeda" },

    // 4. SALOMLASHISH VA ODOB (Greetings & Manners)
    { id: 401, uz: "Assalomu alaykum", en: "Hello / Peace be upon you", it: "Ciao / Salve", category: "Salomlashish", pronunciation: "Ahs-sah-LAH-moo ah-LAY-koom", context: "Ko'rishganda" },
    { id: 402, uz: "Va alaykum assalom", en: "Hello (reply to greeting)", it: "E a te la pace (risposta)", category: "Salomlashish", pronunciation: "Vah ah-LAY-koom ahs-sah-LAHM", context: "Javob berishda" },
    { id: 403, uz: "Rahmat!", en: "Thank you!", it: "Grazie!", category: "Salomlashish", pronunciation: "Rahk-MAHT!", context: "Rahmat aytganda" },
    { id: 404, uz: "Katta rahmat!", en: "Thank you very much!", it: "Grazie mille!", category: "Salomlashish", pronunciation: "Kaht-TAH rahk-MAHT!", context: "Minnatdorchilikda" },
    { id: 405, uz: "Kechirasiz", en: "Excuse me / Sorry", it: "Mi scusi", category: "Salomlashish", pronunciation: "Keh-chee-RAH-seez", context: "Uzr so'raganda" },
    { id: 406, uz: "Marhamat", en: "You're welcome / Please", it: "Prego / Benvenuto", category: "Salomlashish", pronunciation: "Mahr-hah-MAHT", context: "Taklif etganda" },
    { id: 407, uz: "Xayr, salomat bo'ling", en: "Goodbye, stay well", it: "Arrivederci", category: "Salomlashish", pronunciation: "KHY-er sah-loh-MAHT boh-leeng", context: "Xayrlashganda" },
    { id: 408, uz: "Ismingiz nima?", en: "What is your name?", it: "Come ti chiami?", category: "Salomlashish", pronunciation: "Ees-meen-geez nee-MAH?", context: "Tanishganda" },
    { id: 409, uz: "Mening ismim...", en: "My name is...", it: "Mi chiamo...", category: "Salomlashish", pronunciation: "Meh-neeng ees-MEEM...", context: "Tanishganda" },

    // 5. YORDAM VA FAVQULODDA (Emergency & Help)
    { id: 501, uz: "Yordam bering!", en: "Help me please!", it: "Aiuto per favore!", category: "Yordam va Zudlik", pronunciation: "Yohr-DAHM beh-REENG!", context: "Favqulodda" },
    { id: 502, uz: "Menga tez yordam kerak", en: "I need an ambulance", it: "Ho bisogno di un'ambulanza", category: "Yordam va Zudlik", pronunciation: "Mehn-GAH tehz yohr-DAHM keh-RAHK", context: "Shoshilinch" },
    { id: 503, uz: "Men adashib qoldim", en: "I am lost", it: "Mi sono perso", category: "Yordam va Zudlik", pronunciation: "Mehn ah-dah-SHEEB kohl-DEEM", context: "Yo'l yo'qotganda" },
    { id: 504, uz: "Politsiya / Militsiya", en: "Police", it: "Polizia", category: "Yordam va Zudlik", pronunciation: "Poh-lee-TSEE-yah", context: "Favqulodda" },
    { id: 505, uz: "Dorixona qaerda?", en: "Where is the pharmacy?", it: "Dov'è la farmacia?", category: "Yordam va Zudlik", pronunciation: "Doh-ree-KHOH-nah kah-EHR-dah?", context: "Dorixonaga" },

    // 6. RAQAMLAR VA SANOQ (Numbers & Counting)
    { id: 601, uz: "Bir, Ikki, Uch", en: "One, Two, Three (1, 2, 3)", it: "Uno, Due, Tre (1, 2, 3)", category: "Raqamlar", pronunciation: "Beer, Eek-kee, Ooch", context: "Sanoqda" },
    { id: 602, uz: "To'rt, Besh, Olti", en: "Four, Five, Six (4, 5, 6)", it: "Quattro, Cinque, Sei (4, 5, 6)", category: "Raqamlar", pronunciation: "Tohrt, Behsh, Ohl-tee", context: "Sanoqda" },
    { id: 603, uz: "O'n ming so'm", en: "10,000 UZS", it: "10.000 UZS", category: "Raqamlar", pronunciation: "Ohn meeng sohm", context: "Pulda" },
    { id: 604, uz: "Yuz ming so'm", en: "100,000 UZS", it: "100.000 UZS", category: "Raqamlar", pronunciation: "Yooz meeng sohm", context: "Pulda" }
  ];

  useEffect(() => {
    const savedPhrases = getStoredData('phrases', null);
    if (savedPhrases && savedPhrases.length > 0) {
      setPhrases(savedPhrases);
    } else {
      axios.get(`${API_BASE}/phrases`)
        .then(res => {
          if (res.data && res.data.length > 0) setPhrases(res.data);
          else setPhrases(essentialTouristPhrases);
        })
        .catch(() => setPhrases(essentialTouristPhrases));
    }

    const savedBanners = getStoredData('pageBanners', null);
    if (savedBanners && savedBanners.language) {
      setBannerUrl(savedBanners.language);
    } else {
      axios.get(`${API_BASE}/pageBanners`)
        .then(res => {
          if (res.data && res.data.language) setBannerUrl(res.data.language);
        })
        .catch(err => console.error(err));
    }
  }, []);

  const currentPhrases = phrases.length > 0 ? phrases : essentialTouristPhrases;

  // Speak Uzbek text function (Native Speech Synthesis for iOS/Android/Desktop)
  const speakUzbekText = (text, id, customAudioUrl = null) => {
    setPlayingId(id);

    if (customAudioUrl) {
      const audio = new Audio(customAudioUrl);
      audio.play()
        .then(() => {
          audio.onended = () => setPlayingId(null);
          audio.onerror = () => fallbackSpeech(text, id);
        })
        .catch(() => fallbackSpeech(text, id));
      return;
    }

    fallbackSpeech(text, id);
  };

  const fallbackSpeech = (text, id) => {
    if (!('speechSynthesis' in window)) {
      setPlayingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'uz-UZ';
    utterance.rate = 0.85;
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { key: 'all', label: lang === 'it' ? 'Tutti' : lang === 'en' ? 'All' : 'Barchasi' },
    { key: 'salomlashish', label: lang === 'it' ? 'Saluti' : lang === 'en' ? 'Greetings' : 'Salomlashish' },
    { key: 'kundalik', label: lang === 'it' ? 'Parole Quotidiane' : lang === 'en' ? 'Daily Words' : "Kundalik so'zlar" },
    { key: 'bozor', label: lang === 'it' ? 'Mercato e Prezzi' : lang === 'en' ? 'Market & Prices' : 'Bozor va Narxlar' },
    { key: 'sayohat', label: lang === 'it' ? 'Taxi e Viaggi' : lang === 'en' ? 'Taxi & Travel' : 'Taksi va Sayohat' },
    { key: 'ovqat', label: lang === 'it' ? 'Ristorante e Cibo' : lang === 'en' ? 'Restaurant & Dining' : 'Restoran va Ovqatlanish' },
    { key: 'yordam', label: lang === 'it' ? 'Emergenza' : lang === 'en' ? 'Emergency' : 'Favqulodda Yordam' },
    { key: 'raqamlar', label: lang === 'it' ? 'Numeri e Soldi' : lang === 'en' ? 'Numbers & Money' : 'Raqamlar va Pul' }
  ];

  // Smart Category Matcher
  const isCategoryMatch = (pCat, tKey) => {
    if (tKey === 'all') return true;
    if (!pCat) return true;
    const p = pCat.toLowerCase();
    const t = tKey.toLowerCase();
    
    if (p === t) return true;
    if (t === 'bozor' && (p.includes('bozor') || p.includes('narx') || p.includes('mercato') || p.includes('price'))) return true;
    if (t === 'sayohat' && (p.includes('sayohat') || p.includes('taksi') || p.includes('viagg') || p.includes('travel') || p.includes('taxi'))) return true;
    if (t === 'ovqat' && (p.includes('ovqat') || p.includes('restoran') || p.includes('cibo') || p.includes('din') || p.includes('food'))) return true;
    if (t === 'salomlashish' && (p.includes('salom') || p.includes('salut') || p.includes('greet'))) return true;
    if (t === 'yordam' && (p.includes('yordam') || p.includes('zudlik') || p.includes('favqulodda') || p.includes('emerg') || p.includes('aiuto'))) return true;
    if (t === 'raqamlar' && (p.includes('raqam') || p.includes('pul') || p.includes('num') || p.includes('mon'))) return true;
    if (t === 'kundalik' && (p.includes('kunda') || p.includes('quotid') || p.includes('daily'))) return true;

    return true;
  };

  // Search & Category Filtering
  const filteredPhrases = currentPhrases.filter(p => {
    const matchCategory = isCategoryMatch(p.category, activeCategory);
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      p.uz.toLowerCase().includes(q) || 
      p.en.toLowerCase().includes(q) || 
      (p.it && p.it.toLowerCase().includes(q)) || 
      (p.pronunciation && p.pronunciation.toLowerCase().includes(q)) ||
      (p.context && p.context.toLowerCase().includes(q));

    return matchCategory && matchQuery;
  });

  const getContextTranslation = (ctx) => {
    if (!ctx) return '';
    if (lang === 'it') {
      if (ctx === "Bozorda / Do'konda") return "Al mercato / In negozio";
      if (ctx === "Bozorda savdolashganda") return "Contrattando al mercato";
      if (ctx === "Xaridda") return "Durante gli acquisti";
      if (ctx === "To'lovda") return "Al momento del pagamento";
      if (ctx === "Bozorda / Esdalik sovg'alarida") return "Al mercato / Souvenir";
      if (ctx === "Ko'chada / Aeroportda") return "In strada / All'aeroporto";
      if (ctx === "Taksida") return "In taxi";
      if (ctx === "Yo'l so'raganda") return "Chiedendo indicazioni";
      if (ctx === "Yo'lda") return "Durante il tragitto";
      if (ctx === "Restoranda") return "Al ristorante";
      if (ctx === "Oshxonada") return "Alla taverna";
      if (ctx === "Choyxonada") return "Alla casa del tè";
      if (ctx === "Jamoat joyida") return "In un luogo pubblico";
      if (ctx === "Kafeda") return "Al bar/caffè";
      if (ctx === "Ko'rishganda") return "Incontrandosi";
      if (ctx === "Javob berishda") return "Rispondendo";
      if (ctx === "Rahmat aytganda") return "Ringraziando";
      if (ctx === "Minnatdorchilikda") return "Esprimendo gratitudine";
      if (ctx === "Uzr so'raganda") return "Scusandosi";
      if (ctx === "Taklif etganda") return "Invitando/Offrendo";
      if (ctx === "Xayrlashganda") return "Congedandosi";
      if (ctx === "Tanishganda") return "Presentandosi";
      if (ctx === "Favqulodda") return "In caso di emergenza";
      if (ctx === "Shoshilinch") return "Urgente";
      if (ctx === "Yo'l yo'qotganda") return "Se ci si è persi";
      if (ctx === "Dorixonaga") return "Alla farmacia";
      if (ctx === "Sanoqda") return "Contando";
      if (ctx === "Pulda") return "Con i soldi";
    } else if (lang === 'en') {
      if (ctx === "Bozorda / Do'konda") return "At the market / In shop";
      if (ctx === "Bozorda savdolashganda") return "Bargaining at market";
      if (ctx === "Xaridda") return "Shopping";
      if (ctx === "To'lovda") return "Paying";
      if (ctx === "Bozorda / Esdalik sovg'alarida") return "At market / Souvenirs";
      if (ctx === "Ko'chada / Aeroportda") return "On street / Airport";
      if (ctx === "Taksida") return "In taxi";
      if (ctx === "Yo'l so'raganda") return "Asking for directions";
      if (ctx === "Yo'lda") return "On the road";
      if (ctx === "Restoranda") return "At restaurant";
      if (ctx === "Oshxonada") return "At eatery";
      if (ctx === "Choyxonada") return "At tea house";
      if (ctx === "Jamoat joyida") return "In public place";
      if (ctx === "Kafeda") return "At cafe";
      if (ctx === "Ko'rishganda") return "Meeting someone";
      if (ctx === "Javob berishda") return "Responding";
      if (ctx === "Rahmat aytganda") return "Thanking";
      if (ctx === "Minnatdorchilikda") return "Expressing gratitude";
      if (ctx === "Uzr so'raganda") return "Apologizing";
      if (ctx === "Taklif etganda") return "Offering/Inviting";
      if (ctx === "Xayrlashganda") return "Saying goodbye";
      if (ctx === "Tanishganda") return "Meeting/Introducing";
      if (ctx === "Favqulodda") return "Emergency";
      if (ctx === "Shoshilinch") return "Urgent";
      if (ctx === "Yo'l yo'qotganda") return "Lost";
      if (ctx === "Dorixonaga") return "At pharmacy";
      if (ctx === "Sanoqda") return "Counting";
      if (ctx === "Pulda") return "With money";
    }
    return ctx;
  };

  const getPhraseCategoryTranslation = (pCat) => {
    if (!pCat) return '';
    const catLow = pCat.toLowerCase();
    if (lang === 'it') {
      if (catLow.includes('bozor') || catLow.includes('narx')) return 'Mercato e Prezzi';
      if (catLow.includes('sayohat') || catLow.includes('taksi')) return 'Taxi e Viaggi';
      if (catLow.includes('ovqat') || catLow.includes('restoran')) return 'Ristorante e Cibo';
      if (catLow.includes('salom')) return 'Saluti';
      if (catLow.includes('yordam') || catLow.includes('zudlik') || catLow.includes('favqulodda')) return 'Emergenza';
      if (catLow.includes('raqam') || catLow.includes('pul')) return 'Numeri e Soldi';
      if (catLow.includes('kunda')) return 'Parole Quotidiane';
    } else if (lang === 'en') {
      if (catLow.includes('bozor') || catLow.includes('narx')) return 'Market & Prices';
      if (catLow.includes('sayohat') || catLow.includes('taksi')) return 'Taxi & Travel';
      if (catLow.includes('ovqat') || catLow.includes('restoran')) return 'Restaurant & Dining';
      if (catLow.includes('salom')) return 'Greetings';
      if (catLow.includes('yordam') || catLow.includes('zudlik') || catLow.includes('favqulodda')) return 'Emergency';
      if (catLow.includes('raqam') || catLow.includes('pul')) return 'Numbers & Money';
      if (catLow.includes('kunda')) return 'Daily Words';
    }
    return pCat;
  };

  // Active Flashcard item
  const currentFlashcard = filteredPhrases[flashcardIndex % Math.max(1, filteredPhrases.length)] || currentPhrases[0];

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 pb-20 font-sans">
      
      {/* COMPACT HERO BANNER */}
      <div className="relative h-[340px] md:h-[380px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-black/40 z-10"></div>
        <img 
          src={bannerUrl} 
          alt="Sayyohlar so'zlashgichi" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90 scale-105" 
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-white font-extrabold tracking-tight drop-shadow-md">
            {t('language', currentLang.code)}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto font-medium">
            {lang === 'it' ? "Le frasi più necessarie in Uzbekistan per taxi, mercato, ristorante e strada" : lang === 'en' ? "The most useful phrases in Uzbekistan for taxi, market, restaurant and street" : "O'zbekistonda taksida, bozorda, restoranda va ko'chada eng kerakli iboralar"}
          </p>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="container mx-auto px-4 lg:px-8 py-6 max-w-6xl">
        
        {/* COMPACT CONTROL HUB */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 space-y-3">
          
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'it' ? "Cerca: 'Quanto costa?', 'Taxi', 'Grazie', 'Menu'..." : lang === 'en' ? "Search: 'How much?', 'Taxi', 'Thank you', 'Menu'..." : "Qidiring: 'Narxi qancha?', 'Taksi', 'Rahmat', 'Menu'..."} 
                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium text-xs transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{lang === 'it' ? 'Elenco' : lang === 'en' ? 'List' : 'Ro\'yxat'}</span>
              </button>

              <button 
                onClick={() => { setViewMode('flashcard'); setIsFlipped(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'flashcard' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{lang === 'it' ? 'Esercizio Flashcard' : lang === 'en' ? 'Flashcard Practice' : 'Flesh-Karta Mashqi'}</span>
              </button>
            </div>

          </div>

          {/* Category Chips Scrollbar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none border-t border-slate-100">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* MODE 1: GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-bold">
                {lang === 'it' ? `Totale ${filteredPhrases.length} frasi utili` : lang === 'en' ? `Total ${filteredPhrases.length} useful phrases` : `Jami ${filteredPhrases.length} ta turistlar uchun kerakli ibora`}
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">
                {lang === 'it' ? '🔊 Clicca per ascoltare l\'audio' : lang === 'en' ? '🔊 Click to listen to audio' : '🔊 Audio tugmasini bosib eshiting'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPhrases.map((phrase) => {
                const isPlaying = playingId === phrase.id;
                const isCopied = copiedId === phrase.id;
                return (
                  <div
                    key={phrase.id}
                    className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {getContextTranslation(phrase.context) || getPhraseCategoryTranslation(phrase.category)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(phrase.uz, phrase.id)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title={lang === 'it' ? 'Copia' : lang === 'en' ? 'Copy' : 'Nusxalash'}
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => speakUzbekText(phrase.uz, phrase.id, phrase.audioUrl)}
                          className={`p-1.5 rounded-md transition-all ${isPlaying ? 'bg-emerald-600 text-white animate-pulse' : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white'}`}
                          title={lang === 'it' ? 'Ascolta la pronuncia' : lang === 'en' ? 'Listen to pronunciation' : 'O\'zbekcha talaffuzni eshitish'}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {phrase.uz}
                      </h3>
                      {phrase.pronunciation && (
                        <span className="inline-block text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
                          [{phrase.pronunciation}]
                        </span>
                      )}
                    </div>
                    <div className="pt-2 border-t border-slate-100 space-y-0.5 text-xs">
                      <p className="font-medium text-slate-700">
                        <span className="font-extrabold text-slate-400 text-[10px] mr-1">EN:</span>
                        {phrase.en}
                      </p>
                      {phrase.it && (
                        <p className="font-medium text-slate-500 text-[11px]">
                          <span className="font-extrabold text-slate-400 text-[10px] mr-1">IT:</span>
                          {phrase.it}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPhrases.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">
                  {lang === 'it' ? 'Nessuna frase trovata' : lang === 'en' ? 'No phrases found' : 'Ibora topilmadi'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'it' ? 'Prova a cercare un\'altra parola chiave' : lang === 'en' ? 'Try searching with another keyword' : 'Boshqa kalit so\'z yozib qidiring'}
                </p>
              </div>
            )}

          </div>
        )}

        {/* MODE 2: FLASHCARD VIEW */}
        {viewMode === 'flashcard' && filteredPhrases.length > 0 && (
          <div className="max-w-md mx-auto space-y-4">
            
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>{lang === 'it' ? 'Carta' : lang === 'en' ? 'Card' : 'Kartochka'} { (flashcardIndex % filteredPhrases.length) + 1 } / { filteredPhrases.length }</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">{getPhraseCategoryTranslation(currentFlashcard.category)}</span>
            </div>

            {/* 3D FLIP CARD */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full h-64 cursor-pointer group"
            >
              <div className={`w-full h-full duration-300 rounded-2xl shadow-lg p-6 border border-slate-200 flex flex-col justify-between transition-all ${isFlipped ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                
                {/* Card Top */}
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md ${isFlipped ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {isFlipped 
                      ? (lang === 'it' ? 'Traduzione (Italiano/English)' : lang === 'en' ? 'Translation (English)' : 'Tarjimasi (English)') 
                      : (lang === 'it' ? 'Uzbeco (Uzbek)' : lang === 'en' ? 'Uzbek (Uzbek)' : 'O\'zbekcha (Uzbek)')
                    }
                  </span>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      speakUzbekText(currentFlashcard.uz, currentFlashcard.id, currentFlashcard.audioUrl);
                    }}
                    className={`p-2.5 rounded-full transition-all ${isFlipped ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Center Content */}
                <div className="text-center space-y-2">
                  {!isFlipped ? (
                    <>
                      <h2 className="text-2xl font-serif font-extrabold text-slate-900">
                        {currentFlashcard.uz}
                      </h2>
                      {currentFlashcard.pronunciation && (
                        <p className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
                          [{currentFlashcard.pronunciation}]
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-serif font-bold text-emerald-300">
                        {currentFlashcard.en}
                      </h2>
                      {currentFlashcard.it && (
                        <p className="text-xs text-slate-300 italic">
                          IT: {currentFlashcard.it}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Card Bottom Hint */}
                <div className="text-center">
                  <span className="text-[10px] font-semibold opacity-60 flex items-center justify-center gap-1">
                    <RotateCw className="w-3 h-3" /> {isFlipped ? (lang === 'it' ? 'Torna alla visualizzazione in uzbeco' : lang === 'en' ? 'Back to Uzbek view' : 'O\'zbekcha ko\'rinishga qaytish') : (lang === 'it' ? 'Clicca sulla carta per vedere la traduzione' : lang === 'en' ? 'Click card to see translation' : 'Tarjimasini ko\'rish uchun kartani bosing')}
                  </span>
                </div>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-between gap-2">
              <button 
                onClick={() => {
                  setFlashcardIndex(prev => (prev - 1 + filteredPhrases.length) % filteredPhrases.length);
                  setIsFlipped(false);
                }}
                className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 flex items-center justify-center gap-1 shadow-sm hover:bg-slate-50"
              >
                <span>{lang === 'it' ? '← Precedente' : lang === 'en' ? '← Previous' : '← Oldingisi'}</span>
              </button>

              <button 
                onClick={() => speakUzbekText(currentFlashcard.uz, currentFlashcard.id, currentFlashcard.audioUrl)}
                className="py-2.5 px-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
              >
                <Volume2 className="w-4 h-4" /> {lang === 'it' ? 'Ascolta' : lang === 'en' ? 'Listen' : 'Eshitish'}
              </button>

              <button 
                onClick={() => {
                  setFlashcardIndex(prev => (prev + 1) % filteredPhrases.length);
                  setIsFlipped(false);
                }}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-md"
              >
                <span>{lang === 'it' ? 'Successivo →' : lang === 'en' ? 'Next →' : 'Keyingisi →'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
