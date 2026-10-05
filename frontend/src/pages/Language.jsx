import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Volume2, Sparkles, Copy, Check, ArrowRightLeft,
  Mic, MicOff, GraduationCap, Compass, ArrowRight,
  RotateCcw, Send, Globe, ChevronRight
} from 'lucide-react';

// Practical Travel Phrasebook categorized for travelers in Uzbekistan
const TRAVEL_PHRASEBOOK = [
  // 1. Saluti & Cortesia
  {
    category: "greetings",
    uz: "Assalomu alaykum",
    it: "Buongiorno / Salve (La pace sia con voi)",
    phonetic: "Ahs-sah-LAH-moo ah-LAY-koom",
    tip: "Il saluto principale e più rispettoso in tutto l'Uzbekistan."
  },
  {
    category: "greetings",
    uz: "Va alaykum assalom",
    it: "E a voi la pace (risposta canonica)",
    phonetic: "Vah ah-LAY-koom ahs-sah-LAHM",
    tip: "Si risponde sempre così al saluto iniziale."
  },
  {
    category: "greetings",
    uz: "Katta rahmat",
    it: "Grazie mille / Molte grazie",
    phonetic: "Kaht-TAH rahkh-MAHT",
    tip: "'Katta' = grande, 'Rahmat' = grazie."
  },
  {
    category: "greetings",
    uz: "Kechirasiz",
    it: "Mi scusi / Scusa",
    phonetic: "Keh-chee-RAH-seez",
    tip: "Per attirare l'attenzione o chiedere scusa con gentilezza."
  },
  {
    category: "greetings",
    uz: "Xayr, salomat bo'ling",
    it: "Arrivederci, buona salute",
    phonetic: "Khye-ER, sah-loh-MAHT boh-LEENG",
    tip: "Commiato cortese e caloroso."
  },

  // 2. Mercato & Contrattare (Chorsu)
  {
    category: "market",
    uz: "Bu qancha turadi?",
    it: "Quanto costa questo?",
    phonetic: "BOO kahn-CHAH too-RAH-dee?",
    tip: "La frase regina per fare shopping nei bazar."
  },
  {
    category: "market",
    uz: "Arzonroq qilib bering, iltimos",
    it: "Mi fa un po' di sconto, per favore?",
    phonetic: "Ahr-zohn-ROHK kee-LEEP beh-REENG, eel-tee-MOHS",
    tip: "Formula perfetta ed educata per iniziare a contrattare."
  },
  {
    category: "market",
    uz: "Mehmonga chegirma bormi?",
    it: "C'è uno sconto speciale per gli ospiti?",
    phonetic: "Meh-mohn-GAH cheh-geer-MAH bohr-MEE?",
    tip: "Gli uzbeki adorano gli ospiti ('Mehmon')."
  },
  {
    category: "market",
    uz: "Karta bilan to'lasa bo'ladimi?",
    it: "Posso pagare con la carta?",
    phonetic: "Kahr-TAH bee-LAHN toh-LAH-sah boh-lah-dee-MEE?",
    tip: "Per chiedere se accettano pagamenti POS."
  },
  {
    category: "market",
    uz: "Bitta o'rab bering",
    it: "Me ne incarti uno, per favore",
    phonetic: "Beet-TAH oh-RAHB beh-REENG",
    tip: "Da dire quando l'accordo sul prezzo è raggiunto."
  },

  // 3. Chaykhana & Ristorante
  {
    category: "dining",
    uz: "Bir choynak ko'k choy bering",
    it: "Una teiera di tè verde, per favore",
    phonetic: "BEER choy-NAHK kohk choy beh-REENG",
    tip: "Il tè verde ('Ko'k choy') si beve durante ogni pasto."
  },
  {
    category: "dining",
    uz: "Ikkita to'y oshi bering",
    it: "Due porzioni di plov festivo, per favore",
    phonetic: "Eek-kee-TAH toy oh-SHEE beh-REENG",
    tip: "Il plov ('Osh') è il piatto simbolo dell'ospitalità."
  },
  {
    category: "dining",
    uz: "Juda mazali bo'libdi!",
    it: "È davvero squisito / Buonissimo!",
    phonetic: "JOO-dah mah-zah-LEE boh-LEEP-dee!",
    tip: "Complimento amatissimo da cuochi e camerieri."
  },
  {
    category: "dining",
    uz: "Hisobni keltiring, iltimos",
    it: "Il conto, per favore",
    phonetic: "Hee-SOHB-nee kehl-tee-REENG, eel-tee-MOHS",
    tip: "Per richiedere il conto a fine pasto."
  },

  // 4. Taxi & Trasporti
  {
    category: "transport",
    uz: "Aeroportga qancha olasiz?",
    it: "Quanto costa per l'aeroporto?",
    phonetic: "Ah-eh-roh-POHRT-gah kahn-CHAH oh-LAH-seez?",
    tip: "Concorda sempre il prezzo prima della partenza."
  },
  {
    category: "transport",
    uz: "Shu yerda to'xtating, iltimos",
    it: "Fermi qui per favore",
    phonetic: "Shoo YEHR-dah tohk-TAH-teeng, eel-tee-MOHS",
    tip: "Da dire al conducente all'arrivo a destinazione."
  },
  {
    category: "transport",
    uz: "To'g'riga yuring, keyin o'ngga",
    it: "Vada dritto, poi a destra",
    phonetic: "TOH-gree-gah yoo-REENG, keh-YEEN ohng-GAH",
    tip: "O'ngga = destra, Chapga = sinistra."
  },
  {
    category: "transport",
    uz: "Vokzal qayerda?",
    it: "Dov'è la stazione ferroviaria?",
    phonetic: "Vohk-ZAHL kah-EHR-dah?",
    tip: "Da cui partono i treni veloci Afrosiyob."
  },

  // 5. Emergenze & Assistenza
  {
    category: "emergency",
    uz: "Menga yordam bering",
    it: "Mi aiuti, per favore",
    phonetic: "Mehn-GAH yohr-DAHM beh-REENG",
    tip: "Frase essenziale per chiedere soccorso o indicazioni."
  },
  {
    category: "emergency",
    uz: "Dorixona qayerda?",
    it: "Dov'è una farmacia?",
    phonetic: "Doh-ree-KHOH-nah kah-EHR-dah?",
    tip: "Le farmacie sono frequenti e contrassegnate in verde."
  },
  {
    category: "emergency",
    uz: "Xojatxona qayerda?",
    it: "Dov'è la toilette?",
    phonetic: "Khoh-jaht-KHOH-nah kah-EHR-dah?",
    tip: "Domanda indispensabile durante visite ed escursioni."
  }
];

// Rich Dictionary for instantaneous, high-precision Italian <-> Uzbek translation
const DICTIONARY_IT_UZ = {
  // Saluti & Cortesia
  "ciao": "Salom",
  "salve": "Assalomu alaykum",
  "buongiorno": "Assalomu alaykum (Xayrli tong)",
  "buonasera": "Xayrli kech",
  "buonanotte": "Xayrli tun",
  "grazie": "Rahmat",
  "grazie mille": "Katta rahmat",
  "molte grazie": "Katta rahmat",
  "prego": "Arzimaydi (Marhamat)",
  "scusa": "Kechirasiz",
  "mi scusi": "Kechirasiz",
  "per favore": "Iltimos",
  "arrivederci": "Xayr, salomat bo'ling",
  "a presto": "Ko'rishguncha",
  "come stai": "Qalaysiz? (Yaxshimisiz?)",
  "come sta": "Yaxshimisiz?",
  "sto bene": "Yaxshiman, rahmat",
  "piacere": "Tanishganimdan xursandman",
  "come ti chiami": "Ismingiz nima?",
  "mi chiamo": "Mening ismim",
  "sono italiano": "Men italiyalikman",
  "parli inglese": "Inglizcha gapirasizmi?",
  "non capisco": "Tushunmadim",
  "capisco": "Tushundim",

  // Mercato & Negozi
  "quanto costa": "Bu qancha turadi?",
  "quanto costa questo": "Bu qancha turadi?",
  "prezzo": "Narx",
  "troppo caro": "Juda qimmat",
  "sconto": "Chegirma",
  "mi fa uno sconto": "Arzonroq qilib bering, iltimos",
  "posso pagare con la carta": "Karta bilan to'lasa bo'ladimi?",
  "carta di credito": "Bank kartasi",
  "contanti": "Naqd pul",
  "lo compro": "Sotib olaman",
  "lo prendo": "Olaman",
  "bazar": "Bozor",
  "mercato": "Bozor",
  "pane": "Non",
  "souvenir": "Esdalik sovg'asi",

  // Cibo & Ristorante
  "ristorante": "Restoran (Oshxona)",
  "tè": "Choy",
  "tè verde": "Ko'k choy",
  "tè nero": "Qora choy",
  "acqua": "Suv",
  "acqua naturale": "Gazsiz suv",
  "plov": "Osh (Palov)",
  "carne": "Go'sht",
  "pane caldo": "Issiq non",
  "il conto": "Hisob",
  "il conto per favore": "Hisobni keltiring, iltimos",
  "buon appetito": "Yoqimli ishtaha",
  "è buonissimo": "Juda mazali bo'libdi!",
  "squisito": "Juda mazali",
  "menu": "Menyu",

  // Taxi & Direzioni
  "taxi": "Taksi",
  "aeroporto": "Aeroport",
  "stazione": "Vokzal (Temir yo'l vokzali)",
  "hotel": "Mehmonxona",
  "dov'è": "Qayerda?",
  "dov'è il bagno": "Xojatxona qayerda?",
  "dov'è l'hotel": "Mehmonxona qayerda?",
  "dov'è la stazione": "Vokzal qayerda?",
  "fermi qui": "Shu yerda to'xtating, iltimos",
  "si fermi qui": "Shu yerda to'xtating, iltimos",
  "destra": "O'ngga",
  "sinistra": "Chapga",
  "dritto": "To'g'riga",
  "aiuto": "Yordam bering",
  "farmacia": "Dorixona",
  "ospedale": "Shifoxona",
  "polizia": "Militsiya (Ichki ishlar)"
};

// Reverse dictionary Uzbek -> Italian
const DICTIONARY_UZ_IT = {};
Object.entries(DICTIONARY_IT_UZ).forEach(([it, uz]) => {
  const cleanUz = uz.split('(')[0].trim().toLowerCase();
  DICTIONARY_UZ_IT[cleanUz] = it.charAt(0).toUpperCase() + it.slice(1);
});

export default function Language({ currentLang }) {
  const lang = currentLang?.code || 'it';

  // Translator State
  const [sourceLang, setSourceLang] = useState('it'); // 'it' or 'uz'
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Phrasebook filter
  const [activeCategory, setActiveCategory] = useState('all');

  // Translation Engine
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }

    const timer = setTimeout(() => {
      performTranslation(inputText.trim(), sourceLang);
    }, 250);

    return () => clearTimeout(timer);
  }, [inputText, sourceLang]);

  const performTranslation = (text, direction) => {
    setIsTranslating(true);
    const cleaned = text.toLowerCase().trim().replace(/[.,?!]/g, '');

    if (direction === 'it') {
      // 1. Direct match
      if (DICTIONARY_IT_UZ[cleaned]) {
        setTranslatedText(DICTIONARY_IT_UZ[cleaned]);
        setIsTranslating(false);
        return;
      }

      // 2. Substring matching
      for (const [itKey, uzVal] of Object.entries(DICTIONARY_IT_UZ)) {
        if (cleaned.includes(itKey)) {
          setTranslatedText(uzVal);
          setIsTranslating(false);
          return;
        }
      }

      // 3. Word-by-word fallback
      const words = cleaned.split(' ');
      const translatedWords = words.map(w => DICTIONARY_IT_UZ[w] || w);
      setTranslatedText(translatedWords.join(' '));
    } else {
      // Uzbek to Italian
      if (DICTIONARY_UZ_IT[cleaned]) {
        setTranslatedText(DICTIONARY_UZ_IT[cleaned]);
        setIsTranslating(false);
        return;
      }

      for (const [uzKey, itVal] of Object.entries(DICTIONARY_UZ_IT)) {
        if (cleaned.includes(uzKey)) {
          setTranslatedText(itVal);
          setIsTranslating(false);
          return;
        }
      }

      const words = cleaned.split(' ');
      const translatedWords = words.map(w => DICTIONARY_UZ_IT[w] || w);
      setTranslatedText(translatedWords.join(' '));
    }
    setIsTranslating(false);
  };

  // Toggle Translation Direction
  const handleSwapDirection = () => {
    const nextDirection = sourceLang === 'it' ? 'uz' : 'it';
    setSourceLang(nextDirection);
    const oldInput = inputText;
    setInputText(translatedText);
    setTranslatedText(oldInput);
  };

  // Web Speech API Voice Recognition (Speech-to-Text)
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Il tuo browser non supporta il riconoscimento vocale. Puoi digitare il testo nella casella.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = sourceLang === 'it' ? 'it-IT' : 'uz-UZ';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Text-to-Speech Synthesizer
  const speakText = (text, langCode) => {
    if (!text) return;
    setSpeakingText(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.lang = langCode === 'it' ? 'it-IT' : 'uz-UZ';
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSpeakingText(null), 1200);
    }
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 1500);
  };

  // Phrasebook filter
  const filteredPhrases = activeCategory === 'all' 
    ? TRAVEL_PHRASEBOOK 
    : TRAVEL_PHRASEBOOK.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#fcfdfa] min-h-screen pb-24 font-sans text-slate-800">
      
      {/* 1. MINIMALIST HERO HEADER */}
      <div className="bg-[#0c594d] text-white pt-24 pb-14 px-4 border-b border-teal-900/60 shadow-sm relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>{lang === 'it' ? 'In Viaggio in Uzbekistan' : 'Sayohat So\'zlashgichi'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
              {lang === 'it' ? 'Italiano ⇄ Uzbeko: Voce & Traduzione' : 'Italyancha ⇄ O\'zbekcha: Jonli Ovoz & Tarjimon'}
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl font-normal leading-relaxed">
              {lang === 'it'
                ? 'Parla al microfono o digita in italiano per ottenere la traduzione uzbeka istantanea con audio sonoro per bazar, taxi e ristoranti.'
                : 'Italyancha gapiring yoki yozing — tizim uni avtomatik o\'zbekchaga o\'girib, tiniq ovoz bilan o\'qib beradi.'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 -mt-6 relative z-20 space-y-12">
        
        {/* 2. REAL-TIME VOICE & TEXT TRANSLATOR CARD */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xl space-y-4">
          
          {/* Header Controls: Language Swap */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                sourceLang === 'it' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
              }`}>
                {sourceLang === 'it' ? '🇮🇹 Italiano' : '🇺🇿 O\'zbekcha'}
              </span>

              <button
                onClick={handleSwapDirection}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-transform active:rotate-180"
                title="Inverti lingue"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                sourceLang === 'uz' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
              }`}>
                {sourceLang === 'it' ? '🇺🇿 O\'zbekcha' : '🇮🇹 Italiano'}
              </span>
            </div>

            {/* Quick Clear */}
            {inputText && (
              <button
                onClick={() => { setInputText(''); setTranslatedText(''); }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'it' ? 'Cancella' : 'Tozalash'}</span>
              </button>
            )}
          </div>

          {/* Translation Dual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Input Box (Speak or Type) */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between space-y-3 focus-within:border-emerald-500 transition-colors">
              <textarea
                rows="4"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={sourceLang === 'it' 
                  ? "Parla al microfono o scrivi in italiano (es. Quanto costa?, Buongiorno, Fermi qui)..." 
                  : "Mikrofonga gapiring yoki yozing (masalan, Bu qancha turadi?, Assalomu alaykum)..."}
                className="w-full bg-transparent outline-none resize-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-400">
                  {inputText.length} caratteri
                </span>

                <div className="flex items-center gap-2">
                  {/* Microphone Voice Button */}
                  <button
                    onClick={handleToggleVoice}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                    title={isListening ? "In ascolto..." : "Premi e parla"}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? (lang === 'it' ? 'Ascolto...' : 'Tinglanmoqda...') : (lang === 'it' ? 'Parla' : 'Ovoz')}</span>
                  </button>

                  {/* Speak Source Text */}
                  {inputText && (
                    <button
                      onClick={() => speakText(inputText, sourceLang)}
                      className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                      title="Ascolta testo inserito"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Output Box (Translation Result & Speech Audio) */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 flex flex-col justify-between space-y-3">
              <div className="min-h-[96px] text-sm font-serif font-bold text-slate-900 leading-relaxed">
                {translatedText ? (
                  <span className="animate-fadeIn">{translatedText}</span>
                ) : (
                  <span className="text-slate-400 text-xs italic font-sans font-normal">
                    {sourceLang === 'it'
                      ? 'La traduzione uzbeka apparirà qui in tempo reale...'
                      : 'La traduzione italiana apparirà qui in tempo reale...'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Traduzione Istantanea
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Audio Speech Output */}
                  <button
                    disabled={!translatedText}
                    onClick={() => speakText(translatedText, sourceLang === 'it' ? 'uz' : 'it')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border disabled:opacity-30 ${
                      speakingText === translatedText 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Ascolta la pronuncia"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{lang === 'it' ? 'Ascolta' : 'Eshiting'}</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    disabled={!translatedText}
                    onClick={() => handleCopy(translatedText)}
                    className="p-1.5 rounded-xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 disabled:opacity-30"
                    title="Copia traduzione"
                  >
                    {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Travel Phrase Chips */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold text-[11px]">
              {lang === 'it' ? 'Frasi rapide:' : 'Tezkor iboralar:'}
            </span>
            {[
              "Buongiorno",
              "Quanto costa questo?",
              "Mi fa uno sconto?",
              "Un tè verde per favore",
              "Dov'è la stazione?",
              "Fermi qui per favore",
              "Grazie mille"
            ].map((quick, idx) => (
              <button
                key={idx}
                onClick={() => { setSourceLang('it'); setInputText(quick); }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
              >
                {quick}
              </button>
            ))}
          </div>

        </div>

        {/* 3. PRACTICAL CATEGORIZED TRAVEL PHRASEBOOK */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                {lang === 'it' ? 'Frasario da Viaggio' : 'Sayyoh So\'zlashgichi'}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-1">
                {lang === 'it' ? 'Le Espressioni Essenziali per il Tuo Soggiorno' : 'Sayohatdagi Eng Kerakli Iboralar va Ovoz'}
              </h2>
            </div>

            {/* Minimal Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label_it: 'Tutti', label_uz: 'Barchasi' },
                { id: 'greetings', label_it: 'Saluti', label_uz: 'Salomlar' },
                { id: 'market', label_it: 'Mercato', label_uz: 'Bozorda' },
                { id: 'dining', label_it: 'Cibo & Chayxona', label_uz: 'Oshxona' },
                { id: 'transport', label_it: 'Taxi & Treno', label_uz: 'Transport' },
                { id: 'emergency', label_it: 'Emergenza', label_uz: 'Yordam' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === c.id
                      ? 'bg-[#0c594d] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lang === 'it' ? c.label_it : c.label_uz}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Minimalist Phrase Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPhrases.map((phrase, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-base font-serif font-black text-slate-900 leading-snug">
                      {phrase.uz}
                    </span>
                    <button
                      onClick={() => speakText(phrase.uz, 'uz')}
                      className={`p-2 rounded-xl transition-all shrink-0 ${
                        speakingText === phrase.uz
                          ? 'bg-emerald-600 text-white scale-110 shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                      title="Ascolta la pronuncia uzbeka"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs font-semibold text-slate-600">
                    {phrase.it}
                  </div>

                  <div className="text-[11px] text-emerald-900 font-mono bg-emerald-50/50 px-2 py-1 rounded-md border border-emerald-100/70 inline-block">
                    🗣️ {phrase.phonetic}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="line-clamp-1 italic max-w-[85%]">{phrase.tip}</span>
                  <button
                    onClick={() => handleCopy(phrase.uz)}
                    className="p-1 hover:text-slate-800 transition-colors"
                    title="Copia frase"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
