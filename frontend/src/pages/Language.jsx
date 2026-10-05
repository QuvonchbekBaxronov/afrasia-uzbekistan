import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Volume2, Sparkles, Copy, Check, ArrowRightLeft,
  Mic, MicOff, Compass, ArrowRight, RotateCcw, 
  Globe, ChevronRight, Loader2, VolumeX
} from 'lucide-react';

// Multilingual Travel Phrasebook (UZ, IT, EN)
const TRAVEL_PHRASEBOOK = [
  // 1. Saluti & Cortesia / Greetings
  {
    category: "greetings",
    uz: "Assalomu alaykum",
    it: "Buongiorno / Salve (La pace sia con voi)",
    en: "Hello / Peace be upon you",
    phonetic: "Ahs-sah-LAH-moo ah-LAY-koom",
    tip: "Il saluto principale e più rispettoso in tutto l'Uzbekistan."
  },
  {
    category: "greetings",
    uz: "Va alaykum assalom",
    it: "E a voi la pace (risposta canonica)",
    en: "And unto you peace (Standard response)",
    phonetic: "Vah ah-LAY-koom ahs-sah-LAHM",
    tip: "Si risponde sempre così al saluto iniziale."
  },
  {
    category: "greetings",
    uz: "Katta rahmat",
    it: "Grazie mille / Molte grazie",
    en: "Thank you very much",
    phonetic: "Kaht-TAH rahkh-MAHT",
    tip: "'Katta' = grande, 'Rahmat' = grazie."
  },
  {
    category: "greetings",
    uz: "Arzimaydi",
    it: "Prego / Non c'è di che",
    en: "You're welcome / Don't mention it",
    phonetic: "Ahr-zee-MY-dee",
    tip: "Risposta gentile a chi dice grazie."
  },
  {
    category: "greetings",
    uz: "Kechirasiz",
    it: "Mi scusi / Scusa",
    en: "Excuse me / Sorry",
    phonetic: "Keh-chee-RAH-seez",
    tip: "Per attirare l'attenzione o chiedere scusa con gentilezza."
  },
  {
    category: "greetings",
    uz: "Xayr, salomat bo'ling",
    it: "Arrivederci, buona salute",
    en: "Goodbye, stay healthy",
    phonetic: "Khye-ER, sah-loh-MAHT boh-LEENG",
    tip: "Commiato cortese e caloroso."
  },
  {
    category: "greetings",
    uz: "Tanishganimdan xursandman",
    it: "Piacere di conoscerti",
    en: "Nice to meet you",
    phonetic: "Tah-neesh-gah-neem-DAHN khoor-sahnd-MAHN",
    tip: "Ottimo quando ci si presenta a una guida o persona locale."
  },

  // 2. Mercato & Contrattare (Chorsu) / Market & Shopping
  {
    category: "market",
    uz: "Bu qancha turadi?",
    it: "Quanto costa questo?",
    en: "How much does this cost?",
    phonetic: "BOO kahn-CHAH too-RAH-dee?",
    tip: "La frase regina per fare shopping nei bazar."
  },
  {
    category: "market",
    uz: "Arzonroq qilib bering, iltimos",
    it: "Mi fa un po' di sconto, per favore?",
    en: "Could you give me a discount, please?",
    phonetic: "Ahr-zohn-ROHK kee-LEEP beh-REENG, eel-tee-MOHS",
    tip: "Formula perfetta ed educata per iniziare a contrattare."
  },
  {
    category: "market",
    uz: "Mehmonga chegirma bormi?",
    it: "C'è uno sconto speciale per gli ospiti?",
    en: "Is there a discount for guests/tourists?",
    phonetic: "Meh-mohn-GAH cheh-geer-MAH bohr-MEE?",
    tip: "Gli uzbeki adorano gli ospiti ('Mehmon')."
  },
  {
    category: "market",
    uz: "Karta bilan to'lasa bo'ladimi?",
    it: "Posso pagare con la carta?",
    en: "Can I pay by card?",
    phonetic: "Kahr-TAH bee-LAHN toh-LAH-sah boh-lah-dee-MEE?",
    tip: "Per chiedere se accettano pagamenti POS."
  },
  {
    category: "market",
    uz: "Bitta o'rab bering",
    it: "Me ne incarti uno, per favore",
    en: "Please wrap one for me",
    phonetic: "Beet-TAH oh-RAHB beh-REENG",
    tip: "Da dire quando l'accordo sul prezzo è raggiunto."
  },
  {
    category: "market",
    uz: "Juda qimmat",
    it: "È troppo caro",
    en: "It's too expensive",
    phonetic: "JOO-dah keem-MAHT",
    tip: "Da usare con un sorriso amichevole al bazar."
  },

  // 3. Chaykhana & Ristorante / Dining & Food
  {
    category: "dining",
    uz: "Bir choynak ko'k choy bering",
    it: "Una teiera di tè verde, per favore",
    en: "A pot of green tea, please",
    phonetic: "BEER choy-NAHK kohk choy beh-REENG",
    tip: "Il tè verde ('Ko'k choy') si beve durante ogni pasto."
  },
  {
    category: "dining",
    uz: "Ikkita to'y oshi bering",
    it: "Due porzioni di plov festivo, per favore",
    en: "Two portions of wedding plov, please",
    phonetic: "Eek-kee-TAH toy oh-SHEE beh-REENG",
    tip: "Il plov ('Osh') è il piatto simbolo dell'ospitalità."
  },
  {
    category: "dining",
    uz: "Juda mazali bo'libdi!",
    it: "È davvero squisito / Buonissimo!",
    en: "It is very delicious!",
    phonetic: "JOO-dah mah-zah-LEE boh-LEEP-dee!",
    tip: "Complimento amatissimo da cuochi e camerieri."
  },
  {
    category: "dining",
    uz: "Hisobni keltiring, iltimos",
    it: "Il conto, per favore",
    en: "The bill, please",
    phonetic: "Hee-SOHB-nee kehl-tee-REENG, eel-tee-MOHS",
    tip: "Per richiedere il conto a fine pasto."
  },
  {
    category: "dining",
    uz: "Gazsiz suv bormi?",
    it: "Avete acqua naturale?",
    en: "Do you have still water?",
    phonetic: "Gahz-SEEZ SOOV bohr-MEE?",
    tip: "Per specificare acqua non gassata."
  },
  {
    category: "dining",
    uz: "Issiq non bering",
    it: "Portate del pane caldo, per favore",
    en: "Please bring hot bread",
    phonetic: "Ees-SEEK NOHN beh-REENG",
    tip: "Il pane uzbeko appena sfornato è una prelibatezza."
  },

  // 4. Taxi & Trasporti / Transport
  {
    category: "transport",
    uz: "Aeroportga qancha olasiz?",
    it: "Quanto costa per l'aeroporto?",
    en: "How much to the airport?",
    phonetic: "Ah-eh-roh-POHRT-gah kahn-CHAH oh-LAH-seez?",
    tip: "Concorda sempre il prezzo prima della partenza."
  },
  {
    category: "transport",
    uz: "Shu yerda to'xtating, iltimos",
    it: "Fermi qui per favore",
    en: "Please stop here",
    phonetic: "Shoo YEHR-dah tohk-TAH-teeng, eel-tee-MOHS",
    tip: "Da dire al conducente all'arrivo a destinazione."
  },
  {
    category: "transport",
    uz: "To'g'riga yuring, keyin o'ngga",
    it: "Vada dritto, poi a destra",
    en: "Go straight, then turn right",
    phonetic: "TOH-gree-gah yoo-REENG, keh-YEEN ohng-GAH",
    tip: "O'ngga = destra, Chapga = sinistra."
  },
  {
    category: "transport",
    uz: "Vokzal qayerda?",
    it: "Dov'è la stazione ferroviaria?",
    en: "Where is the train station?",
    phonetic: "Vohk-ZAHL kah-EHR-dah?",
    tip: "Da cui partono i treni veloci Afrosiyob."
  },
  {
    category: "transport",
    uz: "Metro bekati qayerda?",
    it: "Dov'è la stazione della metropolitana?",
    en: "Where is the metro station?",
    phonetic: "MEHT-roh beh-kah-TEE kah-EHR-dah?",
    tip: "Le stazioni della metro di Tashkent sono opere d'arte."
  },

  // 5. Emergenze & Assistenza / Emergency & Help
  {
    category: "emergency",
    uz: "Menga yordam bering",
    it: "Mi aiuti, per favore",
    en: "Please help me",
    phonetic: "Mehn-GAH yohr-DAHM beh-REENG",
    tip: "Frase essenziale per chiedere soccorso o indicazioni."
  },
  {
    category: "emergency",
    uz: "Dorixona qayerda?",
    it: "Dov'è una farmacia?",
    en: "Where is a pharmacy?",
    phonetic: "Doh-ree-KHOH-nah kah-EHR-dah?",
    tip: "Le farmacie sono frequenti e contrassegnate in verde."
  },
  {
    category: "emergency",
    uz: "Xojatxona qayerda?",
    it: "Dov'è la toilette?",
    en: "Where is the restroom?",
    phonetic: "Khoh-jaht-KHOH-nah kah-EHR-dah?",
    tip: "Domanda indispensabile durante visite ed escursioni."
  },
  {
    category: "emergency",
    uz: "Shifokor chaqiring",
    it: "Chiamate un medico",
    en: "Call a doctor",
    phonetic: "Shee-foh-KOHR chah-kee-REENG",
    tip: "In caso di malore o necessità sanitaria."
  }
];

// Rich Tri-Lingual Dictionary for instantaneous offline lookup
const DICTIONARY = {
  // Common terms: [uz, it, en]
  "salom": { uz: "Salom", it: "Ciao", en: "Hello" },
  "assalomu alaykum": { uz: "Assalomu alaykum", it: "Buongiorno (Salve)", en: "Hello (Peace be upon you)" },
  "xayrli tong": { uz: "Xayrli tong", it: "Buongiorno", en: "Good morning" },
  "xayrli kech": { uz: "Xayrli kech", it: "Buonasera", en: "Good evening" },
  "xayrli tun": { uz: "Xayrli tun", it: "Buonanotte", en: "Good night" },
  "rahmat": { uz: "Rahmat", it: "Grazie", en: "Thank you" },
  "katta rahmat": { uz: "Katta rahmat", it: "Molte grazie", en: "Thank you very much" },
  "arzimaydi": { uz: "Arzimaydi", it: "Prego", en: "You are welcome" },
  "kechirasiz": { uz: "Kechirasiz", it: "Mi scusi", en: "Excuse me" },
  "ha": { uz: "Ha", it: "Sì", en: "Yes" },
  "yo'q": { uz: "Yo'q", it: "No", en: "No" },
  "iltimos": { uz: "Iltimos", it: "Per favore", en: "Please" },
  "xayr": { uz: "Xayr", it: "Arrivederci", en: "Goodbye" },
  "bozor": { uz: "Bozor", it: "Bazar (Mercato)", en: "Bazaar (Market)" },
  "non": { uz: "Non", it: "Pane", en: "Bread" },
  "choy": { uz: "Choy", it: "Tè", en: "Tea" },
  "ko'k choy": { uz: "Ko'k choy", it: "Tè verde", en: "Green tea" },
  "qora choy": { uz: "Qora choy", it: "Tè nero", en: "Black tea" },
  "suv": { uz: "Suv", it: "Acqua", en: "Water" },
  "osh": { uz: "Osh (Palov)", it: "Plov", en: "Plov (Pilaf)" },
  "go'sht": { uz: "Go'sht", it: "Carne", en: "Meat" },
  "hisob": { uz: "Hisob", it: "Il conto", en: "The bill" },
  "restoran": { uz: "Restoran", it: "Ristorante", en: "Restaurant" },
  "mehmonxona": { uz: "Mehmonxona", it: "Hotel", en: "Hotel" },
  "aeroport": { uz: "Aeroport", it: "Aeroporto", en: "Airport" },
  "vokzal": { uz: "Vokzal", it: "Stazione", en: "Train station" },
  "taksi": { uz: "Taksi", it: "Taxi", en: "Taxi" },
  "qayerda": { uz: "Qayerda?", it: "Dov'è?", en: "Where is it?" },
  "qancha": { uz: "Qancha?", it: "Quanto?", en: "How much?" },
  "narx": { uz: "Narx", it: "Prezzo", en: "Price" },
  "arzon": { uz: "Arzon", it: "Economico", en: "Cheap" },
  "qimmat": { uz: "Qimmat", it: "Caro", en: "Expensive" },
  "yordam": { uz: "Yordam", it: "Aiuto", en: "Help" },
  "dorixona": { uz: "Dorixona", it: "Farmacia", en: "Pharmacy" },
  "shifoxona": { uz: "Shifoxona", it: "Ospedale", en: "Hospital" }
};

const LANGUAGES = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹', voiceLang: 'it-IT' },
  { code: 'en', name: 'English', flag: '🇬🇧', voiceLang: 'en-US' },
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿', voiceLang: 'uz-UZ' }
];

export default function Language({ currentLang }) {
  const siteLang = currentLang?.code || 'it';

  // Translator State
  const [sourceLang, setSourceLang] = useState('it');
  const [targetLang, setTargetLang] = useState('uz');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Phrasebook filter
  const [activeCategory, setActiveCategory] = useState('all');

  // Cache for translations to prevent repeated network calls
  const translationCache = useRef({});

  // Initialize SpeechSynthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Real-time Translation Debounce
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText('');
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    const timer = setTimeout(() => {
      executeTranslation(inputText.trim(), sourceLang, targetLang);
    }, 350);

    return () => clearTimeout(timer);
  }, [inputText, sourceLang, targetLang]);

  // Robust Translation Logic (API + Dictionary)
  const executeTranslation = async (text, from, to) => {
    const cleanLower = text.toLowerCase().trim();
    const cacheKey = `${from}->${to}:${cleanLower}`;

    if (translationCache.current[cacheKey]) {
      setTranslatedText(translationCache.current[cacheKey]);
      setIsTranslating(false);
      return;
    }

    // 1. Direct local dictionary lookup
    for (const item of Object.values(DICTIONARY)) {
      if (item[from] && item[from].toLowerCase() === cleanLower && item[to]) {
        setTranslatedText(item[to]);
        translationCache.current[cacheKey] = item[to];
        setIsTranslating(false);
        return;
      }
    }

    // 2. Query MyMemory Free Translation API
    try {
      const pair = `${from}|${to}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.responseData && data.responseData.translatedText) {
          let resText = data.responseData.translatedText;
          if (!resText.includes('MYMEMORY WARNING')) {
            // Clean up html entities
            resText = resText
              .replace(/&#39;/g, "'")
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&');
            setTranslatedText(resText);
            translationCache.current[cacheKey] = resText;
            setIsTranslating(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn("Translation API call failed, falling back to local engine:", err);
    }

    // 3. Fallback word-by-word dictionary matching
    const words = text.split(/\s+/);
    const translatedWords = words.map(w => {
      const cleanW = w.toLowerCase().replace(/[.,?!]/g, '');
      for (const item of Object.values(DICTIONARY)) {
        if (item[from] && item[from].toLowerCase() === cleanW && item[to]) {
          return item[to];
        }
      }
      return w;
    });

    const fallbackResult = translatedWords.join(' ');
    setTranslatedText(fallbackResult);
    translationCache.current[cacheKey] = fallbackResult;
    setIsTranslating(false);
  };

  // Swap Languages
  const handleSwapDirection = () => {
    const oldSource = sourceLang;
    const oldTarget = targetLang;
    setSourceLang(oldTarget);
    setTargetLang(oldSource);

    const oldInput = inputText;
    setInputText(translatedText);
    setTranslatedText(oldInput);
  };

  // Text-To-Speech with full fallback and Chrome bug fix
  const speakText = (text, langCode) => {
    if (!text || typeof window === 'undefined') return;
    setSpeakingText(text);

    if (!('speechSynthesis' in window)) {
      alert("Il tuo browser non supporta la sintesi vocale.");
      setSpeakingText(null);
      return;
    }

    try {
      // Un-pause and cancel any stuck audio
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      let chosenVoice = null;

      if (langCode === 'it') {
        chosenVoice = voices.find(v => v.lang.startsWith('it')) || null;
        utterance.lang = 'it-IT';
      } else if (langCode === 'en') {
        chosenVoice = voices.find(v => v.lang.startsWith('en')) || null;
        utterance.lang = 'en-US';
      } else if (langCode === 'uz') {
        // Native Uzbek if available, otherwise Turkish (tr-TR) provides authentic phonetics for Uzbek Latin
        chosenVoice = voices.find(v => v.lang.startsWith('uz'))
          || voices.find(v => v.lang.startsWith('tr'))
          || voices.find(v => v.lang.startsWith('ru'))
          || null;
        utterance.lang = chosenVoice ? chosenVoice.lang : 'tr-TR';
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // Keep reference to prevent garbage-collection cut-off in Chrome
      window._activeSpeechUtterance = utterance;

      utterance.onend = () => {
        window._activeSpeechUtterance = null;
        setSpeakingText(null);
      };

      utterance.onerror = () => {
        window._activeSpeechUtterance = null;
        setSpeakingText(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech error:", e);
      setSpeakingText(null);
    }
  };

  // Web Speech API Voice Recognition (Speech-to-Text)
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Il tuo browser non supporta il microfono vocale. Puoi digitare il testo nella casella.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      if (sourceLang === 'it') recognition.lang = 'it-IT';
      else if (sourceLang === 'en') recognition.lang = 'en-US';
      else recognition.lang = 'uz-UZ';

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
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 1500);
  };

  // Quick phrases based on current source language
  const quickPhrases = useMemo(() => {
    if (sourceLang === 'it') {
      return [
        "Buongiorno",
        "Quanto costa questo?",
        "Mi fa uno sconto?",
        "Un tè verde per favore",
        "Dov'è la stazione?",
        "Fermi qui per favore",
        "Grazie mille"
      ];
    } else if (sourceLang === 'en') {
      return [
        "Hello",
        "How much does this cost?",
        "Can you give me a discount?",
        "Green tea, please",
        "Where is the train station?",
        "Stop here, please",
        "Thank you very much"
      ];
    } else {
      return [
        "Assalomu alaykum",
        "Bu qancha turadi?",
        "Arzonroq qilib bering",
        "Ko'k choy bering",
        "Vokzal qayerda?",
        "Shu yerda to'xtating",
        "Katta rahmat"
      ];
    }
  }, [sourceLang]);

  // Phrasebook filter
  const filteredPhrases = activeCategory === 'all' 
    ? TRAVEL_PHRASEBOOK 
    : TRAVEL_PHRASEBOOK.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#fcfdfa] min-h-screen pb-24 font-sans text-slate-800">
      
      {/* 1. HERO HEADER */}
      <div className="bg-[#0c594d] text-white pt-24 pb-14 px-4 border-b border-teal-900/60 shadow-sm relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {siteLang === 'it' ? 'In Viaggio in Uzbekistan' : siteLang === 'en' ? 'Traveler Guide in Uzbekistan' : 'Sayohat So\'zlashgichi'}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
              {siteLang === 'it' 
                ? 'Traduttore Vocale: Italiano, English & Uzbeko' 
                : siteLang === 'en' 
                  ? 'Voice Translator: English, Italian & Uzbek' 
                  : 'Ovozli Tarjimon: O\'zbekcha, Italyancha & Inglizcha'}
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl font-normal leading-relaxed">
              {siteLang === 'it'
                ? 'Parla al microfono o digita il testo in italiano, inglese o uzbeko per ottenere traduzioni istantanee e pronuncia audio chiara.'
                : siteLang === 'en'
                  ? 'Speak into the mic or type in English, Italian, or Uzbek for instant translation and crystal-clear voice pronunciation.'
                  : 'Mikrofonga gapiring yoki yozing — italyancha, inglizcha va o\'zbekcha o\'rtasida onlayn tarjima qiling va ovozli eshiting.'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 -mt-6 relative z-20 space-y-12">
        
        {/* 2. REAL-TIME 3-LANGUAGE TRANSLATOR CARD */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xl space-y-4">
          
          {/* Header Controls: Source Language, Swap, Target Language */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Source Lang Picker */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      if (l.code === targetLang) {
                        setTargetLang(sourceLang);
                      }
                      setSourceLang(l.code);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      sourceLang === l.code
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwapDirection}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800 transition-all active:rotate-180"
                title="Inverti lingue"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              {/* Target Lang Picker */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      if (l.code === sourceLang) {
                        setSourceLang(targetLang);
                      }
                      setTargetLang(l.code);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      targetLang === l.code
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Clear */}
            {inputText && (
              <button
                onClick={() => { setInputText(''); setTranslatedText(''); }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1 shrink-0 self-end sm:self-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{siteLang === 'it' ? 'Cancella' : siteLang === 'en' ? 'Clear' : 'Tozalash'}</span>
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
                placeholder={
                  sourceLang === 'it'
                    ? "Parla al microfono o digita in italiano (es. Quanto costa?, Buongiorno, Dov'è la stazione?)..."
                    : sourceLang === 'en'
                      ? "Speak into the microphone or type in English (e.g. How much is this?, Hello, Where is the hotel?)..."
                      : "Mikrofonga gapiring yoki yozing (masalan, Bu qancha turadi?, Assalomu alaykum, Mehmonxona qayerda?)..."
                }
                className="w-full bg-transparent outline-none resize-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-400">
                  {inputText.length} {siteLang === 'it' ? 'caratteri' : siteLang === 'en' ? 'characters' : 'belgi'}
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
                    <span>{isListening ? (siteLang === 'it' ? 'Ascolto...' : siteLang === 'en' ? 'Listening...' : 'Tinglanmoqda...') : (siteLang === 'it' ? 'Parla' : siteLang === 'en' ? 'Speak' : 'Ovoz')}</span>
                  </button>

                  {/* Speak Source Text */}
                  {inputText && (
                    <button
                      onClick={() => speakText(inputText, sourceLang)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        speakingText === inputText 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
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
                {isTranslating ? (
                  <div className="flex items-center gap-2 text-emerald-700 text-xs py-2 font-sans">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{siteLang === 'it' ? 'Traduzione in corso...' : siteLang === 'en' ? 'Translating...' : 'Tarjima qilinmoqda...'}</span>
                  </div>
                ) : translatedText ? (
                  <span className="animate-fadeIn">{translatedText}</span>
                ) : (
                  <span className="text-slate-400 text-xs italic font-sans font-normal">
                    {siteLang === 'it'
                      ? 'La traduzione apparirà qui in tempo reale...'
                      : siteLang === 'en'
                        ? 'Translation will appear here in real time...'
                        : 'Tarjima bu yerda onlayn paydo bo\'ladi...'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  {siteLang === 'it' ? 'Traduzione Istantanea' : siteLang === 'en' ? 'Instant Translation' : 'Onlayn Tarjima'}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Audio Speech Output */}
                  <button
                    disabled={!translatedText}
                    onClick={() => speakText(translatedText, targetLang)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border disabled:opacity-30 ${
                      speakingText === translatedText 
                        ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse' 
                        : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Ascolta la pronuncia"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{siteLang === 'it' ? 'Ascolta' : siteLang === 'en' ? 'Listen' : 'Eshiting'}</span>
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
              {siteLang === 'it' ? 'Frasi rapide:' : siteLang === 'en' ? 'Quick phrases:' : 'Tezkor iboralar:'}
            </span>
            {quickPhrases.map((quick, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(quick)}
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
                {siteLang === 'it' ? 'Frasario da Viaggio' : siteLang === 'en' ? 'Travel Phrasebook' : 'Sayyoh So\'zlashgichi'}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-1">
                {siteLang === 'it' 
                  ? 'Le Espressioni Essenziali per il Tuo Soggiorno' 
                  : siteLang === 'en' 
                    ? 'Essential Expressions for Your Stay' 
                    : 'Sayohatdagi Eng Kerakli Iboralar va Ovoz'}
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label_it: 'Tutti', label_en: 'All', label_uz: 'Barchasi' },
                { id: 'greetings', label_it: 'Saluti', label_en: 'Greetings', label_uz: 'Salomlar' },
                { id: 'market', label_it: 'Mercato', label_en: 'Market', label_uz: 'Bozorda' },
                { id: 'dining', label_it: 'Cibo & Chayxona', label_en: 'Dining', label_uz: 'Oshxona' },
                { id: 'transport', label_it: 'Taxi & Treno', label_en: 'Transport', label_uz: 'Transport' },
                { id: 'emergency', label_it: 'Emergenza', label_en: 'Emergency', label_uz: 'Yordam' }
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
                  {siteLang === 'it' ? c.label_it : siteLang === 'en' ? c.label_en : c.label_uz}
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

                  {/* Italian translation */}
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="text-[10px] px-1 py-0.2 bg-slate-100 rounded text-slate-500 font-mono">IT</span>
                    <span>{phrase.it}</span>
                  </div>

                  {/* English translation */}
                  <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <span className="text-[10px] px-1 py-0.2 bg-slate-100 rounded text-slate-500 font-mono">EN</span>
                    <span>{phrase.en}</span>
                  </div>

                  {/* Phonetic Pronunciation Guide */}
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
