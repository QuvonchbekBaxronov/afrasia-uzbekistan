import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Volume2, Search, RotateCw, Check, Copy, BookOpen, Clock, PlayCircle
} from 'lucide-react';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';
import { getStoredData } from '../utils/dbStorage';

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

export default function Language({ currentLang }) {
  const lang = currentLang?.code || 'it';

  // Phrasebook States
  const [phrases, setPhrases] = useState(() => {
    const p = getStoredData('phrases', null);
    if (p && Array.isArray(p) && p.length > 0) return p;
    return essentialTouristPhrases;
  });

  const [bannerUrl, setBannerUrl] = useState(() => {
    const b = getStoredData('pageBanners', {});
    return b.language || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80";
  });

  // Main Tabs State: 'phrases', 'lessons', 'history'
  const [activeMainTab, setActiveMainTab] = useState('phrases');

  // Learn Uzbek States
  const [uzbekLessons, setUzbekLessons] = useState([]);
  const [uzbekQuizzes, setUzbekQuizzes] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  
  const [activeLesson, setActiveLesson] = useState(null); // When user clicks a lesson
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Fetch phrases
    axios.get(`${API_BASE}/phrases`)
      .then(res => {
        if (res.data && res.data.length > 0) setPhrases(res.data);
      })
      .catch(() => {});

    // Fetch Banners
    axios.get(`${API_BASE}/pageBanners`)
      .then(res => {
        if (res.data && res.data.language) setBannerUrl(res.data.language);
      })
      .catch(() => {});

    // Fetch Learn Uzbek Data
    axios.get(`${API_BASE}/uzbekLessons`).then(res => setUzbekLessons(res.data)).catch(() => {});
    axios.get(`${API_BASE}/uzbekQuizzes`).then(res => setUzbekQuizzes(res.data)).catch(() => {});
    axios.get(`${API_BASE}/testHistory`).then(res => setTestHistory(res.data)).catch(() => {});
  }, []);

  const currentPhrases = (phrases && phrases.length > 0) ? phrases : essentialTouristPhrases;

  // Speak Uzbek text function
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

  // --- Quiz Functions ---
  const handleOptionChange = (questionId, option) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const submitQuiz = () => {
    if (!activeLesson) return;
    
    const lessonQuestions = uzbekQuizzes.filter(q => String(q.lessonId) === String(activeLesson.id));
    let score = 0;
    
    lessonQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    const result = {
      lessonName: activeLesson.title || `Lesson ${activeLesson.id}`,
      score: score,
      total: lessonQuestions.length,
      date: new Date().toISOString()
    };

    // Save to server
    axios.post(`${API_BASE}/testHistory`, result)
      .then(res => {
        setTestHistory(prev => [...prev, res.data]);
        setQuizResult(result);
      })
      .catch(err => console.error("Error saving test result", err));
  };

  const resetQuiz = () => {
    setActiveLesson(null);
    setQuizAnswers({});
    setQuizResult(null);
  };

  // Categories logic for Phrasebook
  const categories = [
    { key: 'all', label: t('categoryAll', lang) },
    { key: 'salomlashish', label: lang === 'it' ? 'Saluti' : lang === 'en' ? 'Greetings' : 'Salomlashish' },
    { key: 'kundalik', label: lang === 'it' ? 'Parole Quotidiane' : lang === 'en' ? 'Daily Words' : "Kundalik so'zlar" },
    { key: 'bozor', label: lang === 'it' ? 'Mercato e Prezzi' : lang === 'en' ? 'Market & Prices' : 'Bozor va Narxlar' },
    { key: 'sayohat', label: lang === 'it' ? 'Taxi e Viaggi' : lang === 'en' ? 'Taxi & Travel' : 'Taksi va Sayohat' },
    { key: 'ovqat', label: lang === 'it' ? 'Ristorante e Cibo' : lang === 'en' ? 'Restaurant & Dining' : 'Restoran va Ovqatlanish' },
    { key: 'yordam', label: lang === 'it' ? 'Emergenza' : lang === 'en' ? 'Emergency' : 'Favqulodda Yordam' },
    { key: 'raqamlar', label: lang === 'it' ? 'Numeri e Soldi' : lang === 'en' ? 'Numbers & Money' : 'Raqamlar va Pul' }
  ];

  const isCategoryMatch = (pCat, tKey) => {
    if (tKey === 'all') return true;
    if (!pCat) return true;
    const p = pCat.toLowerCase();
    const tKeyLow = tKey.toLowerCase();
    
    if (p === tKeyLow) return true;
    if (tKeyLow === 'bozor' && (p.includes('bozor') || p.includes('narx') || p.includes('mercato') || p.includes('price'))) return true;
    if (tKeyLow === 'sayohat' && (p.includes('sayohat') || p.includes('taksi') || p.includes('viagg') || p.includes('travel') || p.includes('taxi'))) return true;
    if (tKeyLow === 'ovqat' && (p.includes('ovqat') || p.includes('restoran') || p.includes('cibo') || p.includes('din') || p.includes('food'))) return true;
    if (tKeyLow === 'salomlashish' && (p.includes('salom') || p.includes('salut') || p.includes('greet'))) return true;
    if (tKeyLow === 'yordam' && (p.includes('yordam') || p.includes('zudlik') || p.includes('favqulodda') || p.includes('emerg') || p.includes('aiuto'))) return true;
    if (tKeyLow === 'raqamlar' && (p.includes('raqam') || p.includes('pul') || p.includes('num') || p.includes('mon'))) return true;
    if (tKeyLow === 'kundalik' && (p.includes('kunda') || p.includes('quotid') || p.includes('daily'))) return true;
    return true;
  };

  const filteredPhrases = (currentPhrases || []).filter(p => {
    if (!p || !p.uz) return false;
    const matchCategory = isCategoryMatch(p.category, activeCategory);
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      (p.uz && p.uz.toLowerCase().includes(q)) || 
      (p.en && p.en.toLowerCase().includes(q)) || 
      (p.it && p.it.toLowerCase().includes(q));

    return matchCategory && matchQuery;
  });

  const safePhrasesList = (filteredPhrases.length > 0 ? filteredPhrases : currentPhrases);
  const currentFlashcard = safePhrasesList[flashcardIndex % Math.max(1, safePhrasesList.length)] || essentialTouristPhrases[0];

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 pb-20 font-sans">
      
      {/* COMPACT HERO BANNER */}
      <div className="relative h-[300px] md:h-[350px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-black/40 z-10"></div>
        <img 
          src={bannerUrl} 
          alt="Language Banner" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90 scale-105" 
        />
        <div className="relative z-20 text-center px-4 max-w-4xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-white font-extrabold tracking-tight drop-shadow-md">
            {t('language', currentLang.code)}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto font-medium">
            {lang === 'it' ? "Impara le frasi di base per esplorare l'Uzbekistan in tutta facilità" : lang === 'en' ? "Learn basic phrases to explore Uzbekistan with ease" : "O'zbekistonda muloqot qilish uchun asosiy iboralar va darslar"}
          </p>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="container mx-auto px-4 lg:px-8 py-6 max-w-6xl">
        
        {/* MAIN NAVIGATION TABS */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-1 shadow-sm border border-slate-200 inline-flex overflow-x-auto max-w-full">
            <button 
              onClick={() => {setActiveMainTab('phrases'); setActiveLesson(null);}}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeMainTab === 'phrases' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {t('phrasesTitle', lang).split(' ')[0] || "Phrasebook"}
            </button>
            <button 
              onClick={() => {setActiveMainTab('lessons'); setActiveLesson(null);}}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeMainTab === 'lessons' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {t('lessonsAndTests', lang)}
            </button>
            <button 
              onClick={() => {setActiveMainTab('history'); setActiveLesson(null);}}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeMainTab === 'history' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {t('testHistoryTab', lang)}
            </button>
          </div>
        </div>

        {/* =======================
            TAB 1: PHRASEBOOK
            ======================= */}
        {activeMainTab === 'phrases' && (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'it' ? "Cerca: 'Quanto costa?'..." : lang === 'en' ? "Search..." : "Qidiring..."} 
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium text-xs transition-all"
                  />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center">
                  <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                    <span>{lang === 'it' ? 'Elenco' : lang === 'en' ? 'List' : 'Ro\'yxat'}</span>
                  </button>
                  <button onClick={() => { setViewMode('flashcard'); setIsFlipped(false); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'flashcard' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                    <span>Flashcards</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none border-t border-slate-100">
                {categories.map((cat) => (
                  <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${activeCategory === cat.key ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPhrases.map((phrase) => {
                  const isPlaying = playingId === phrase.id;
                  const isCopied = copiedId === phrase.id;
                  return (
                    <div key={phrase.id} className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-2 group">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {phrase.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => copyToClipboard(phrase.uz, phrase.id)} className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => speakUzbekText(phrase.uz, phrase.id, phrase.audioUrl)} className={`p-1.5 rounded-md transition-all ${isPlaying ? 'bg-emerald-600 text-white animate-pulse' : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white'}`}>
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">{phrase.uz}</h3>
                        {phrase.pronunciation && (
                          <span className="inline-block text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">[{phrase.pronunciation}]</span>
                        )}
                      </div>
                      <div className="pt-2 border-t border-slate-100 space-y-0.5 text-xs">
                        <p className="font-medium text-slate-700"><span className="font-extrabold text-slate-400 text-[10px] mr-1">EN:</span>{phrase.en}</p>
                        {phrase.it && <p className="font-medium text-slate-500 text-[11px]"><span className="font-extrabold text-slate-400 text-[10px] mr-1">IT:</span>{phrase.it}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'flashcard' && currentFlashcard && (
              <div className="max-w-md mx-auto space-y-4">
                <div className="relative w-full h-64 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                  <div className={`w-full h-full duration-300 rounded-2xl shadow-lg p-6 border border-slate-200 flex flex-col justify-between transition-all ${isFlipped ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${isFlipped ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {isFlipped ? 'Translation' : 'Uzbek'}
                      </span>
                      <button onClick={(e) => {e.stopPropagation(); speakUzbekText(currentFlashcard.uz, currentFlashcard.id);}} className={`p-2.5 rounded-full transition-all ${isFlipped ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center space-y-2">
                      {!isFlipped ? (
                        <>
                          <h2 className="text-2xl font-serif font-extrabold text-slate-900">{currentFlashcard.uz}</h2>
                          {currentFlashcard.pronunciation && <p className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">[{currentFlashcard.pronunciation}]</p>}
                        </>
                      ) : (
                        <>
                          <h2 className="text-xl font-serif font-bold text-emerald-300">{currentFlashcard.en}</h2>
                          {currentFlashcard.it && <p className="text-xs text-slate-300 italic">IT: {currentFlashcard.it}</p>}
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-semibold opacity-60 flex items-center justify-center gap-1"><RotateCw className="w-3 h-3" /> Click to flip</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button onClick={() => {setFlashcardIndex(prev => (prev - 1 + safePhrasesList.length) % safePhrasesList.length); setIsFlipped(false);}} className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs">← Previous</button>
                  <button onClick={() => {setFlashcardIndex(prev => (prev + 1) % safePhrasesList.length); setIsFlipped(false);}} className="flex-1 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-xs">Next →</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* =======================
            TAB 2: LESSONS & QUIZZES
            ======================= */}
        {activeMainTab === 'lessons' && (
          <div className="space-y-6">
            {!activeLesson ? (
              // Lessons List View
              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('lessonsAndTests', lang)}</h2>
                {uzbekLessons.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-slate-500">{t('noLessons', lang)}</h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uzbekLessons.map(lesson => (
                      <div key={lesson.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                          <BookOpen className="w-5 h-5 text-emerald-700" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">{lesson.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-4 line-clamp-2">{lesson.description}</p>
                        <button 
                          onClick={() => setActiveLesson(lesson)}
                          className="w-full py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-600 hover:text-white transition-colors flex justify-center items-center gap-2"
                        >
                          <PlayCircle className="w-4 h-4" /> {t('startTest', lang)}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Active Lesson & Quiz View
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <button onClick={resetQuiz} className="text-sm text-emerald-600 font-bold mb-6 hover:underline flex items-center gap-1">
                  ← Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeLesson.title}</h2>
                <p className="text-slate-600 mb-8 pb-6 border-b border-slate-100">{activeLesson.description}</p>

                {quizResult ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-black text-emerald-700">{quizResult.score}/{quizResult.total}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Quiz Completed!</h3>
                    <p className="text-slate-500 mb-6">Your results have been saved to the Test History.</p>
                    <button onClick={resetQuiz} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                      Back to Lessons
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {uzbekQuizzes.filter(q => String(q.lessonId) === String(activeLesson.id)).length === 0 ? (
                      <p className="text-slate-500 text-center py-6">No questions found for this lesson.</p>
                    ) : (
                      uzbekQuizzes
                        .filter(q => String(q.lessonId) === String(activeLesson.id))
                        .map((q, index) => (
                        <div key={q.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                          <p className="font-bold text-slate-900 mb-4">{index + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options && q.options.map((opt, i) => (
                              <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${quizAnswers[q.id] === opt ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                <input 
                                  type="radio" 
                                  name={`question-${q.id}`} 
                                  value={opt}
                                  checked={quizAnswers[q.id] === opt}
                                  onChange={() => handleOptionChange(q.id, opt)}
                                  className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                                />
                                <span className="text-sm font-medium text-slate-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                    
                    {uzbekQuizzes.filter(q => String(q.lessonId) === String(activeLesson.id)).length > 0 && (
                      <div className="flex justify-end pt-4">
                        <button 
                          onClick={submitQuiz}
                          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-md"
                        >
                          {t('submitTest', lang)}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =======================
            TAB 3: TEST HISTORY
            ======================= */}
        {activeMainTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('testHistoryTab', lang)}</h2>
            
            {testHistory.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-500">{t('noHistory', lang)}</h3>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                        <th className="p-4">Lesson</th>
                        <th className="p-4">{t('date', lang)}</th>
                        <th className="p-4 text-right">{t('score', lang)}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                      {[...testHistory].reverse().map((result, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4 text-slate-900 flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <Check className="w-4 h-4" />
                            </div>
                            {result.lessonName}
                          </td>
                          <td className="p-4 text-slate-500">
                            {new Date(result.date).toLocaleDateString()} {new Date(result.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </td>
                          <td className="p-4 text-right">
                            <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded-full font-bold text-xs">
                              {result.score} / {result.total}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
