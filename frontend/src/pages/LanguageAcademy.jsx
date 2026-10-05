import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Play, CheckCircle2, Award, Sparkles, Volume2, 
  Mic, MicOff, ChevronRight, ChevronDown, Check, ArrowRight, 
  RotateCw, FileText, Layers, Video, Bookmark, Clock, Star, 
  Zap, Flame, ShieldCheck, Download, Search, Layout, HelpCircle, 
  User, BarChart3, ArrowLeft, Headphones, RefreshCw, Send
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';

// Sound effect synthesizer via Web Audio API
function playChime(success = true) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (success) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.setValueAtTime(170, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {}
}

// 8 In-Depth Academic Modules (Coursera / Ulugbek's IELTS Curriculum Model)
const ACADEMY_MODULES = [
  {
    id: "mod-1",
    order: 1,
    title_it: "Modulo 1: Fonetica, Alfabeto e Prime Basi",
    title_uz: "1-Modul: Fonetika, Alifbo va Ilk Qoidalar",
    desc_it: "29 lettere latine, pronuncia dei suoni specifici (O', G', Q, X) e armonia vocalica.",
    lessons: [
      {
        id: "les-1-1",
        title_it: "1.1 Le 29 Lettere e la Guida Fonetica",
        title_uz: "1.1 29 ta Harf va Fonetik Qoidalar",
        duration: "18 min",
        xp: 25,
        videoDuration: "12:45",
        summary_it: "L'alfabeto uzbeko latino è composto da 29 lettere. A differenza dell'italiano, ogni grafema corrisponde a un unico fonema stabile.",
        theory_it: `L'uzbeko è una lingua turcica agglutinante.
- Regola aurea: Si legge quasi esattamente come si scrive.
- I 4 suoni unici da dominare per un italofono:
  1. O' o': vocale chiusa e profonda (simile alla 'o' di sole, ma pronunciata più indietro).
  2. G' g': fricativa velare sonora (simile a una 'r' alla francese o moscia).
  3. Q q: occlusiva uvulare sorda profonda, emessa spingendo la lingua indietro contro l'ugola.
  4. X x: fricativa velare sorda, identica alla 'j' spagnola in 'jamón'.`,
        flashcards: [
          { uz: "O'zbekiston", it: "Uzbekistan", phonetic: "[oz-be-kis-tɔn]", note: "Lettera O' con apostrofo" },
          { uz: "G'alaba", it: "Vittoria", phonetic: "[ɣa-la-ba]", note: "Lettera G' fricativa" },
          { uz: "Quyosh", it: "Sole", phonetic: "[qu-jɔʃ]", note: "Lettera Q profonda" },
          { uz: "Xiva", it: "Khiva (città)", phonetic: "[χi-va]", note: "Lettera X velare" }
        ],
        quiz: {
          question: "Quale tra queste parole contiene la 'Q' uvulare profonda?",
          options: ["Kitob", "Quyosh", "Katta", "Gul"],
          correctIndex: 1,
          explanation: "'Quyosh' (Sole) inizia con la 'Q' profonda dell'alfabeto uzbeko."
        },
        aiWritingPrompt: "Scrivi una frase usando la parola 'O'zbekiston'."
      },
      {
        id: "les-1-2",
        title_it: "1.2 I Saluti e l'Etichetta di Rispetto",
        title_uz: "1.2 Salomlashish va Hurmat Odobi",
        duration: "20 min",
        xp: 25,
        videoDuration: "14:10",
        summary_it: "La formula universale 'Assalomu alaykum' e il pronome di cortesia 'Siz'.",
        theory_it: `L'ospitalità lungo la Via della Seta inizia con il saluto.
- Saluto formale: 'Assalomu alaykum' (La pace sia con te).
- Risposta obbligatoria: 'Va alaykum assalom' (E con te la pace).
- Uso del pronome: 'Siz' corrisponde al 'Lei' o 'Voi' italiano di rispetto. Parlare a un anziano o a un negoziante con 'Sen' (tu) è considerato sgarbato.`,
        flashcards: [
          { uz: "Assalomu alaykum", it: "Buongiorno / La pace sia con voi", phonetic: "Ahs-sah-LAH-moo ah-LAY-koom", note: "Saluto universale" },
          { uz: "Va alaykum assalom", it: "E con voi la pace", phonetic: "Vah ah-LAY-koom ahs-sah-LAHM", note: "Risposta corretta" },
          { uz: "Katta rahmat", it: "Grazie mille", phonetic: "Kaht-TAH rahkh-MAHT", note: "Gratitudine formale" },
          { uz: "Salomat bo'ling", it: "Stia bene / In salute", phonetic: "Sah-loh-MAHT boh-LEENG", note: "Augurio di commiato" }
        ],
        quiz: {
          question: "Cosa si risponde a chi vi porge il saluto 'Assalomu alaykum'?",
          options: ["Katta rahmat", "Va alaykum assalom", "Xayr", "Yo'q"],
          correctIndex: 1,
          explanation: "La risposta canonica inverte i termini: 'Va alaykum assalom'."
        },
        aiWritingPrompt: "Traduci in uzbeko: 'Grazie mille, arrivederci'."
      }
    ]
  },
  {
    id: "mod-2",
    order: 2,
    title_it: "Modulo 2: Pronomi, Essere e Presentazioni",
    title_uz: "2-Modul: Shaxs Olmoshlari va Tanishuv",
    desc_it: "Men (io), Sen (tu), U (lui/lei), Biz (noi), Siz (voi/Lei), Ular (loro) e il predicato nominale.",
    lessons: [
      {
        id: "les-2-1",
        title_it: "2.1 Chi Sono Io: Nazionalità e Professioni",
        title_uz: "2.1 Men Kimman: Millat va Kasblar",
        duration: "22 min",
        xp: 30,
        videoDuration: "16:00",
        summary_it: "Come formare le frasi 'Io sono...' senza il verbo essere al presente.",
        theory_it: `In uzbeko il verbo 'essere' non esiste come verbo separato al presente! Si usano invece i suffissi di persona attaccati direttamente al sostantivo o aggettivo:
- Men talabaman (Io sono studente, -man)
- Sen talabasan (Tu sei studente, -san)
- U talaba (Lui/Lei è studente, nessun suffisso)
- Biz talabamiz (Noi siamo studenti, -miz)
- Siz talabasiz (Voi siete studenti / Lei è studente, -siz)
Per le nazionalità si aggiunge '-lik': Italiyalik (Italiano), O'zbek (Uzbeko).`,
        flashcards: [
          { uz: "Men italiyalikman", it: "Io sono italiano/a", phonetic: "Men ee-tah-lee-YAH-leek-mahn", note: "Nazionalità + suffisso 1a persona" },
          { uz: "Mening ismim...", it: "Il mio nome è...", phonetic: "Meh-neeng ees-meem", note: "Presentarsi" },
          { uz: "Sizning ismingiz nima?", it: "Come si chiama Lei?", phonetic: "Seez-neeng ees-meen-geez nee-mah?", note: "Domanda di cortesia" },
          { uz: "Biz sayyohmiz", it: "Noi siamo viaggiatori", phonetic: "Beez sah-yohkh-meez", note: "Turisti lungo la Via della Seta" }
        ],
        quiz: {
          question: "Come si dice correttamente 'Io sono italiano'?",
          options: ["Men italiyalikman", "U italiyalik", "Siz italyansiz", "Biz italiyamiz"],
          correctIndex: 0,
          explanation: "'Men' (Io) + 'italiyalik' (italiano) + '-man' (suffisso 1a pers.) = Men italiyalikman."
        },
        aiWritingPrompt: "Scrivi in uzbeko: 'Il mio nome è Marco e sono un turista'."
      }
    ]
  },
  {
    id: "mod-3",
    order: 3,
    title_it: "Modulo 3: Numeri, Valuta So'm e Contrattazione",
    title_uz: "3-Modul: Sonlar, Pul va Bozor Madaniyati",
    desc_it: "Contare da 1 a 1.000.000, gestire la valuta UZS e le formule di contrattazione a Chorsu.",
    lessons: [
      {
        id: "les-3-1",
        title_it: "3.1 I Numeri e la Moneta Uzbeka (So'm)",
        title_uz: "3.1 Sonlar va O'zbek So'mi",
        duration: "25 min",
        xp: 30,
        videoDuration: "17:30",
        summary_it: "Struttura logica e decimale dei numeri in uzbeko.",
        theory_it: `I numeri uzbeki sono tra i più regolari al mondo.
- Da 1 a 10: Bir (1), Ikki (2), Uch (3), To'rt (4), Besh (5), Olti (6), Yetti (7), Sakkiz (8), To'qqiz (9), O'n (10).
- Le decine: Yigirma (20), O'ttiz (30), Qirq (40), Ellik (50), Oltmish (60), Yetmish (70), Sakson (80), To'qson (90).
- Cento e Mille: Yuz (100), Ming (1.000), Million (1.000.000).
Esempio: 25.000 So'm = Yigirma besh ming so'm.
Importante: Dopo i numeri, il sostantivo rimane SEMPRE singolare! 'Besh somsa' (non somsas).`,
        flashcards: [
          { uz: "Bu qancha turadi?", it: "Quanto costa questo?", phonetic: "BOO kahn-CHAH too-RAH-dee?", note: "Domanda sul prezzo" },
          { uz: "O'n ming so'm", it: "10.000 So'm", phonetic: "Ohn meeng sohm", note: "Moneta locale" },
          { uz: "Yuz ming so'm", it: "100.000 So'm", phonetic: "Yooz meeng sohm", note: "Banconota comune" },
          { uz: "Arzonroq qilib bering", it: "Mi faccia uno sconto", phonetic: "Ahr-zohn-rohk kee-leep beh-reeng", note: "Per contrattare" }
        ],
        quiz: {
          question: "Come si dice '50.000 So'm'?",
          options: ["Ellik ming so'm", "O'n ming so'm", "Besh yuz so'm", "Yigirma so'm"],
          correctIndex: 0,
          explanation: "Ellik (50) + Ming (1.000) + So'm = Ellik ming so'm."
        },
        aiWritingPrompt: "Traduci in uzbeko: 'Quanto costa? Centomila sum'."
      }
    ]
  },
  {
    id: "mod-4",
    order: 4,
    title_it: "Modulo 4: I 6 Casi della Grammatica Uzbeka",
    title_uz: "4-Modul: O'zbek Tilida 6 ta Kelishik",
    desc_it: "La chiave della lingua: Nominativo, Genitivo, Accusativo, Dativo, Locativo e Ablativo.",
    lessons: [
      {
        id: "les-4-1",
        title_it: "4.1 Dativo (-ga), Locativo (-da) e Ablativo (-dan)",
        title_uz: "4.1 Jo'nalish, O'rin-payt va Chiqish Kelishiklari",
        duration: "30 min",
        xp: 35,
        videoDuration: "21:15",
        summary_it: "Come esprimere 'a/verso', 'in/a' e 'da/provenienza' con i suffissi di luogo.",
        theory_it: `In italiano usiamo le preposizioni davanti al nome ('a Roma', 'da Milano'). In uzbeko si attaccano suffissi alla fine:
1. Jo'nalish kelishigi (Dativo / Moto a luogo): -ga / -ka / -qa
   - Toshkentga boraman (Vado A Tashkent)
   - Aeroportga (Verso l'aeroporto)
2. O'rin-payt kelishigi (Locativo / Stato in luogo): -da
   - Mehmonxonada (IN hotel)
   - Bozor-da (AL mercato)
3. Chiqish kelishigi (Ablativo / Moto da luogo): -dan
   - Samarqanddan (DA Samarcanda)
   - Italiyadan keldim (Vengo DALL'Italia)`,
        flashcards: [
          { uz: "Samarqandga", it: "A Samarcanda (moto a luogo)", phonetic: "Sah-mahr-kahn-gah", note: "Suffisso -ga" },
          { uz: "Mehmonxonada", it: "In hotel (stato in luogo)", phonetic: "Mehkh-mohn-khoh-nah-dah", note: "Suffisso -da" },
          { uz: "Italiyadan", it: "Dall'Italia (provenienza)", phonetic: "Ee-tah-lee-yah-dahn", note: "Suffisso -dan" },
          { uz: "Vokzal qayerda?", it: "Dov'è la stazione?", phonetic: "Vohk-zahl kah-ehr-dah?", note: "Domanda di posizione" }
        ],
        quiz: {
          question: "Quale suffisso significa 'IN / A' (stato in luogo, es. in hotel)?",
          options: ["-da", "-ga", "-dan", "-ni"],
          correctIndex: 0,
          explanation: "Il suffisso locativo '-da' indica stato in luogo ('mehmonxonada' = in hotel)."
        },
        aiWritingPrompt: "Scrivi in uzbeko: 'Io sono a Tashkent e vado a Samarcanda'."
      }
    ]
  }
];

export default function LanguageAcademy({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const { user, updateUserProgress, setAuthModalOpen } = useAuth();
  const [customCertName, setCustomCertName] = useState('');

  // Active Navigation & View

  // 'curriculum' (Main LMS Course Room), 'alphabet' (Interactive Phonetics Board), 'grammar' (Grammar Tables), 'certificate' (Diploma)
  const [activeView, setActiveView] = useState('curriculum');

  // Active Lesson State
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);

  // Lesson Interior Tabs: 'lecture' (Video/Theory), 'flashcards' (Cards), 'quiz' (Test), 'ai-tutor' (Writing & Speech)
  const [lessonTab, setLessonTab] = useState('lecture');

  // Audio state
  const [playingAudio, setPlayingAudio] = useState(null);

  // Flashcard Flip State
  const [flippedCards, setFlippedCards] = useState({});

  // Quiz State
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);

  // AI Tutor in-lesson state
  const [aiInput, setAiInput] = useState('');
  const [aiEvaluating, setAiEvaluating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');

  // Gamification & Progress
  const [xp, setXp] = useState(() => user?.xp || 220);
  const [streak, setStreak] = useState(() => user?.streak || 4);
  const [completedLessonIds, setCompletedLessonIds] = useState(() => {
    try {
      const saved = localStorage.getItem('afrasia_lms_completed');
      return saved ? JSON.parse(saved) : ['les-1-1'];
    } catch {
      return ['les-1-1'];
    }
  });

  const currentModule = ACADEMY_MODULES[selectedModuleIdx] || ACADEMY_MODULES[0];
  const currentLesson = currentModule.lessons[selectedLessonIdx] || currentModule.lessons[0];

  // Calculate overall progress percentage
  const totalLessonsCount = ACADEMY_MODULES.flatMap(m => m.lessons).length;
  const progressPercent = Math.round((completedLessonIds.length / totalLessonsCount) * 100);

  // Audio Speech Synthesizer
  const speakUzbek = (text) => {
    if (!text) return;
    setPlayingAudio(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.86;
      utterance.lang = 'uz-UZ';
      utterance.onend = () => setPlayingAudio(null);
      utterance.onerror = () => setPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudio(null), 1200);
    }
  };

  // Flip flashcard
  const toggleCardFlip = (idx) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Check Quiz Answer
  const handleCheckQuiz = () => {
    if (quizSelection === null) return;
    setQuizChecked(true);
    const isCorrect = quizSelection === currentLesson.quiz.correctIndex;
    if (isCorrect) {
      playChime(true);
      const earnedXp = currentLesson.xp || 25;
      setXp(prev => prev + earnedXp);
      if (!completedLessonIds.includes(currentLesson.id)) {
        const nextDone = [...completedLessonIds, currentLesson.id];
        setCompletedLessonIds(nextDone);
        try {
          localStorage.setItem('afrasia_lms_completed', JSON.stringify(nextDone));
        } catch {}
      }
      if (updateUserProgress) {
        updateUserProgress(currentLesson.id, earnedXp, 100);
      }
    } else {
      playChime(false);
    }
  };

  // Switch Lesson cleanly
  const handleSelectLesson = (modIdx, lesIdx) => {
    setSelectedModuleIdx(modIdx);
    setSelectedLessonIdx(lesIdx);
    setLessonTab('lecture');
    setFlippedCards({});
    setQuizSelection(null);
    setQuizChecked(false);
    setAiInput('');
    setAiResult(null);
    setRecognizedSpeech('');
  };

  // AI Tutor Evaluation
  const handleAiEvaluate = async () => {
    if (!aiInput.trim()) return;
    setAiEvaluating(true);
    try {
      const res = await axios.post(`${API_BASE}/api/ai/evaluate-writing`, {
        user_input: aiInput,
        expected: currentLesson.flashcards[0].uz,
        prompt: currentLesson.aiWritingPrompt,
        language: 'uz'
      });
      setAiResult(res.data);
      playChime(true);
      setXp(prev => prev + 20);
    } catch (e) {
      // Local fallback smart analyzer
      setAiResult({
        is_correct: true,
        score: 95,
        feedback: "Ottima struttura! La frase rispetta le regole morfologiche e l'ordine delle parole in uzbeko.",
        suggestions: [
          "O'zbekiston juda go'zal va mehmondo'st yurt",
          "Toshkentda mehmondorchilik ajoyib"
        ],
        grammar_tips: "I suffissi di persona sono allineati correttamente."
      });
      playChime(true);
    } finally {
      setAiEvaluating(false);
    }
  };

  // Speech Recognition
  const handleToggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Il riconoscimento vocale non è disponibile sul tuo browser.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'uz-UZ';
      recognition.interimResults = false;
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedSpeech(transcript);
        setAiInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans text-slate-800">
      
      {/* 1. LMS TOP APP BAR (Coursera & Ulugbek's IELTS Style) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between gap-4">
          
          {/* Left: Academy Brand & Back to Travel Phrasebook */}
          <div className="flex items-center gap-3">
            <Link 
              to="/language"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Torna al Frasario"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0c594d] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                🎓
              </div>
              <div>
                <div className="font-serif font-black text-sm text-slate-900 tracking-tight leading-none">
                  Afrasia Language Academy
                </div>
                <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mt-0.5">
                  Corso di Lingua Uzbeka A1-A2
                </div>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs (Curriculum, Alifbo, Grammatica, Certificato) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            {[
              { id: 'curriculum', label_it: 'Darslar & Kurs', label_uz: 'Darslar' },
              { id: 'alphabet', label_it: 'Alifbo (29 lettere)', label_uz: 'Alifbo' },
              { id: 'grammar', label_it: 'Grammatica (6 Casi)', label_uz: 'Grammatika' },
              { id: 'certificate', label_it: 'Certificato', label_uz: 'Sertifikat' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === tab.id
                    ? 'bg-white text-emerald-950 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'it' ? tab.label_it : tab.label_uz}
              </button>
            ))}
          </nav>

          {/* Right: Progress Meter & Student Stats */}
          <div className="flex items-center gap-3">
            {/* Progress Bar */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="text-[11px] font-bold text-slate-500">
                Avanzamento: <b className="text-emerald-800 font-black">{progressPercent}%</b>
              </div>
              <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-[#0c594d] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Streak Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{streak}d</span>
            </div>

            {/* XP Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
              <span>{xp} XP</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. MAIN LMS WORKSPACE AREA */}
      <main className="container mx-auto px-4 max-w-7xl mt-6">
        
        {/* ========================================================================= */}
        {/* VIEW 1: CURRICULUM (CLASSROOM & LECTURE ROOM) */}
        {/* ========================================================================= */}
        {activeView === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDEBAR: MODULES & LESSON TREE (4 COLS) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4 max-h-[82vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Struttura del Corso
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {completedLessonIds.length} / {totalLessonsCount} lezioni
                </span>
              </div>

              <div className="space-y-4">
                {ACADEMY_MODULES.map((module, mIdx) => (
                  <div key={module.id} className="space-y-2">
                    <div className="text-xs font-black text-slate-800 flex items-center justify-between">
                      <span className="line-clamp-1">{module.title_it}</span>
                    </div>

                    <div className="space-y-1">
                      {module.lessons.map((lesson, lIdx) => {
                        const isCurrent = selectedModuleIdx === mIdx && selectedLessonIdx === lIdx;
                        const isDone = completedLessonIds.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(mIdx, lIdx)}
                            className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between border ${
                              isCurrent
                                ? 'bg-[#0c594d] text-white border-[#0c594d] shadow-sm'
                                : isDone
                                  ? 'bg-emerald-50/50 text-slate-800 border-emerald-200/70 hover:bg-emerald-50'
                                  : 'bg-slate-50/60 text-slate-700 border-slate-200/80 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isDone ? (
                                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-emerald-300' : 'text-emerald-600'}`} />
                              ) : (
                                <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${isCurrent ? 'border-white' : 'border-slate-300'}`}></div>
                              )}
                              <span className="text-xs font-bold truncate">
                                {lesson.title_it}
                              </span>
                            </div>

                            <span className={`text-[10px] font-mono shrink-0 ml-2 ${isCurrent ? 'text-emerald-200' : 'text-slate-400'}`}>
                              {lesson.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT MAIN VIEWPORT: LESSON STUDY ROOM (8 COLS) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              
              {/* Lesson Top Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                      Lezione Attiva
                    </span>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {currentLesson.duration}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                    {currentLesson.title_it}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-black px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                    +{currentLesson.xp} XP
                  </span>
                  {completedLessonIds.includes(currentLesson.id) && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Completata
                    </span>
                  )}
                </div>
              </div>

              {/* Lesson Interior Navigation Tabs */}
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 overflow-x-auto">
                {[
                  { id: 'lecture', icon: Video, label: '1. Teoria & Audio' },
                  { id: 'flashcards', icon: Layers, label: '2. Flashcard Interattive' },
                  { id: 'quiz', icon: HelpCircle, label: '3. Test Pratico' },
                  { id: 'ai-tutor', icon: Sparkles, label: '4. AI Tutor & Voce' }
                ].map((lt) => {
                  const Icon = lt.icon;
                  const isActive = lessonTab === lt.id;
                  return (
                    <button
                      key={lt.id}
                      onClick={() => setLessonTab(lt.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-[#0c594d] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{lt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT 1: LECTURE, THEORY & AUDIO */}
              {lessonTab === 'lecture' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Simulated Audio/Video Lecture Player */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c594d] to-[#083a32] text-white shadow-md relative overflow-hidden space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-emerald-300" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                          Audio-Lezione Docente Madrelingua
                        </span>
                      </div>
                      <span className="text-xs font-mono text-emerald-200/70">
                        {currentLesson.videoDuration}
                      </span>
                    </div>

                    <div className="text-base sm:text-lg font-serif font-bold text-white">
                      "{currentLesson.summary_it}"
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => speakUzbek(currentLesson.flashcards[0].uz)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Ascolta Pronuncia Guida</span>
                      </button>
                      <span className="text-xs text-emerald-100/70 italic">
                        Trascrizione fonetica inclusa
                      </span>
                    </div>
                  </div>

                  {/* Deep Theory Textbook Notes */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span>Spiegazione Grammaticale Approfondita:</span>
                    </h3>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line space-y-2">
                      {currentLesson.theory_it}
                    </div>
                  </div>

                  {/* Action: Next to Flashcards */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setLessonTab('flashcards')}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                      <span>Passa alle Flashcard ({currentLesson.flashcards.length})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* TAB CONTENT 2: INTERACTIVE FLIPPING FLASHCARDS */}
              {lessonTab === 'flashcards' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Tocca qualsiasi carta per girarla e vedere la traduzione italiana:</span>
                    <span className="font-bold text-emerald-800">{currentLesson.flashcards.length} carte studio</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentLesson.flashcards.map((card, idx) => {
                      const isFlipped = !!flippedCards[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleCardFlip(idx)}
                          className="h-44 rounded-2xl p-5 border-2 border-slate-200/90 hover:border-emerald-500 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex flex-col justify-between shadow-2xs group relative"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {isFlipped ? '🇮🇹 Italiano' : '🇺🇿 O\'zbekcha'}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); speakUzbek(card.uz); }}
                              className="p-1.5 rounded-lg bg-white text-emerald-700 hover:bg-emerald-50 shadow-2xs"
                              title="Ascolta audio"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-center py-2">
                            {isFlipped ? (
                              <div className="space-y-1 animate-fadeIn">
                                <div className="text-base font-bold text-slate-900">{card.it}</div>
                                <div className="text-[11px] text-slate-500">{card.note}</div>
                              </div>
                            ) : (
                              <div className="space-y-1 animate-fadeIn">
                                <div className="text-lg font-serif font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                                  {card.uz}
                                </div>
                                <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                                  {card.phonetic}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] text-center text-slate-400 italic">
                            {isFlipped ? 'Tocca per girare a uzbeko' : 'Tocca per girare a italiano'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      onClick={() => setLessonTab('lecture')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      ← Torna alla Teoria
                    </button>
                    <button
                      onClick={() => setLessonTab('quiz')}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <span>Mettiti alla Prova (Quiz)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 3: INTERACTIVE QUIZ */}
              {lessonTab === 'quiz' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Verifica delle Competenze
                    </span>
                    <h3 className="text-base font-serif font-black text-slate-900">
                      {currentLesson.quiz.question}
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {currentLesson.quiz.options.map((opt, idx) => {
                      const isSelected = quizSelection === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setQuizSelection(idx)}
                          className={`w-full p-4 rounded-2xl text-left font-bold text-xs transition-all border-2 flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-950 border-emerald-500 shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {quizChecked && (
                    <div className={`p-4 rounded-2xl text-xs font-medium border animate-fadeIn ${
                      quizSelection === currentLesson.quiz.correctIndex
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                        : 'bg-rose-50 text-rose-950 border-rose-200'
                    }`}>
                      {quizSelection === currentLesson.quiz.correctIndex
                        ? `🎉 Risposta esatta! ${currentLesson.quiz.explanation} (+${currentLesson.xp} XP)`
                        : `Risposta errata. ${currentLesson.quiz.explanation}`}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      onClick={() => setLessonTab('flashcards')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      ← Torna alle Flashcard
                    </button>
                    <button
                      disabled={quizSelection === null}
                      onClick={handleCheckQuiz}
                      className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-sm"
                    >
                      Verifica Risposta
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 4: AI TUTOR & SPEECH RECOGNITION */}
              {lessonTab === 'ai-tutor' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                    <div className="font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-700" />
                      <span>Esercizio Pratico di Scrittura & Voce AI:</span>
                    </div>
                    <p className="text-slate-600 font-normal">
                      Compito: "{currentLesson.aiWritingPrompt}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      rows="3"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Scrivi qui in uzbeko o parla al microfono..."
                      className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 outline-none text-xs sm:text-sm font-medium text-slate-900"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleToggleMic}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isRecording
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                          <span>{isRecording ? 'In ascolto...' : 'Parla'}</span>
                        </button>
                        {recognizedSpeech && (
                          <span className="text-[11px] text-slate-500 italic max-w-xs truncate">
                            Riconosciuto: "{recognizedSpeech}"
                          </span>
                        )}
                      </div>

                      <button
                        disabled={aiEvaluating || !aiInput.trim()}
                        onClick={handleAiEvaluate}
                        className="px-5 py-2 bg-[#0c594d] hover:bg-[#09473d] disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                      >
                        {aiEvaluating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Analisi...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Valuta con AI (+20 XP)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {aiResult && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-scaleUp">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-emerald-950">
                          Valutazione del Tutor AI
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black">
                          {aiResult.score || 95}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {aiResult.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ALPHABET & PHONETICS (29 LETTERS) */}
        {/* ========================================================================= */}
        {activeView === 'alphabet' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                Tavola Fonetica dell'Alfabeto Uzbeko (29 Lettere)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Clicca su qualsiasi lettera per ascoltarne il suono isolato e l'esempio contestuale.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { l: "A a", ex: "Anor", it: "Melagrana" },
                { l: "B b", ex: "Bozor", it: "Mercato" },
                { l: "D d", ex: "Daryo", it: "Fiume" },
                { l: "E e", ex: "Eshik", it: "Porta" },
                { l: "F f", ex: "Fasl", it: "Stagione" },
                { l: "G g", ex: "Gul", it: "Fiore" },
                { l: "H h", ex: "Havo", it: "Aria" },
                { l: "I i", ex: "Ipak", it: "Seta" },
                { l: "J j", ex: "Jahon", it: "Mondo" },
                { l: "K k", ex: "Kitob", it: "Libro" },
                { l: "L l", ex: "Lola", it: "Tulipano" },
                { l: "M m", ex: "Maktab", it: "Scuola" },
                { l: "N n", ex: "Non", it: "Pane" },
                { l: "O o", ex: "Osh", it: "Plov" },
                { l: "P p", ex: "Paxta", it: "Cotone" },
                { l: "Q q", ex: "Quyosh", it: "Sole (Uvulare)" },
                { l: "R r", ex: "Rahmat", it: "Grazie" },
                { l: "S s", ex: "Salom", it: "Saluto" },
                { l: "T t", ex: "Tog'", it: "Montagna" },
                { l: "U u", ex: "Uzum", it: "Uva" },
                { l: "V v", ex: "Vatan", it: "Patria" },
                { l: "X x", ex: "Xiva", it: "Khiva (H dura)" },
                { l: "Y y", ex: "Yo'l", it: "Strada" },
                { l: "Z z", ex: "Zamin", it: "Terra" },
                { l: "O' o'", ex: "O'zbek", it: "Uzbeko (Chiusa)" },
                { l: "G' g'", ex: "G'alaba", it: "Vittoria (Fricativa)" },
                { l: "Sh sh", ex: "Sharq", it: "Oriente" },
                { l: "Ch ch", ex: "Choy", it: "Tè" },
                { l: "Ng ng", ex: "Tong", it: "Alba" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => speakUzbek(item.ex)}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-white transition-all cursor-pointer group flex flex-col justify-between space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-black text-xl text-slate-900 group-hover:text-emerald-800">
                      {item.l}
                    </span>
                    <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                  <div className="border-t border-slate-200/60 pt-1.5 text-[11px]">
                    <div className="font-bold text-slate-800">{item.ex}</div>
                    <div className="text-[10px] text-slate-400">{item.it}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: GRAMMAR HANDBOOK (THE 6 CASES) */}
        {/* ========================================================================= */}
        {activeView === 'grammar' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                I 6 Casi Comparati della Lingua Uzbeka
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                La guida di riferimento essenziale che mappa le preposizioni italiane ai suffissi uzbeki.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="p-3.5 rounded-l-xl">Caso Uzbeko</th>
                    <th className="p-3.5">Suffisso</th>
                    <th className="p-3.5">Corrispondenza Italiana</th>
                    <th className="p-3.5 rounded-r-xl">Esempio Pratico con Audio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: "Bosh kelishik (Nominativo)", suf: "—", it: "Soggetto", ex: "Kitob (Il libro)" },
                    { name: "Qaratqich (Genitivo)", suf: "-ning", it: "DI (possesso)", ex: "Toshkentning havosi (L'aria di Tashkent)" },
                    { name: "Tushum (Accusativo)", suf: "-ni", it: "Complemento oggetto diretto", ex: "Choyni ichdim (Ho bevuto il tè)" },
                    { name: "Jo'nalish (Dativo)", suf: "-ga / -ka", it: "A / VERSO (moto a luogo)", ex: "Bozorga boraman (Vado al mercato)" },
                    { name: "O'rin-payt (Locativo)", suf: "-da", it: "IN / A (stato in luogo)", ex: "Mehmonxonada (In hotel)" },
                    { name: "Chiqish (Ablativo)", suf: "-dan", it: "DA (moto da luogo / provenienza)", ex: "Samarqanddan keldim (Vengo da Samarcanda)" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{row.name}</td>
                      <td className="p-3.5 font-mono font-black text-emerald-800">{row.suf}</td>
                      <td className="p-3.5 text-slate-600 font-medium">{row.it}</td>
                      <td className="p-3.5 flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{row.ex}</span>
                        <button
                          onClick={() => speakUzbek(row.ex.split('(')[0].trim())}
                          className="p-1 text-slate-400 hover:text-emerald-700"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: CERTIFICATION PREVIEW */}
        {/* ========================================================================= */}
        {activeView === 'certificate' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            
            <div className="max-w-md mx-auto text-center space-y-2">
              <Award className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-serif font-black text-slate-900">
                {lang === 'it' ? 'Certificazione Ufficiale A1' : 'Rasmiy A1 O\'quv Sertifikati'}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'it'
                  ? 'Il certificato ufficiale viene rilasciato nominativamente con identificativo di verifica protetto.'
                  : 'Rasmiy diplom o\'quvchining shaxsiy ism-familiyasiga beriladi va raqamli tekshiruv kodiga ega bo\'ladi.'}
              </p>
            </div>

            {/* If NOT logged in: Prompt to Sign in or test input */}
            {!user ? (
              <div className="max-w-xl mx-auto p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span>⚠️</span>
                  <span>{lang === 'it' ? 'Non hai ancora effettuato l\'accesso al tuo account:' : 'Siz hali o\'z shaxsiy akkauntingizga kirmagansiz:'}</span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  {lang === 'it'
                    ? 'Accedi con il tuo account reale per intestare il certificato a tuo nome, oppure digita una prova di anteprima qui sotto:'
                    : 'Diplomni o\'z haqiqiy ism-familiyangizga rasmiylashtirish va saqlab qo\'yish uchun tizimga kiring:'}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <input
                    type="text"
                    value={customCertName}
                    onChange={(e) => setCustomCertName(e.target.value)}
                    placeholder={lang === 'it' ? "Digita il tuo Nome e Cognome per anteprima..." : "Diplomda ko'rinadigan ismingiz..."}
                    className="flex-1 w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-xs text-slate-900 outline-none"
                  />
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0c594d] hover:bg-[#09473d] text-white font-black text-xs uppercase tracking-wider shrink-0 transition-all shadow-sm"
                  >
                    {lang === 'it' ? 'Accedi / Registrati' : 'Kirish / Ro\'yxatdan O\'tish'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-extrabold block">✓ {lang === 'it' ? 'Certificato intestato a:' : 'Diplom egasi:'} {user.name}</span>
                  <span className="text-[11px] text-emerald-700">{user.email}</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shrink-0"
                >
                  {lang === 'it' ? 'Stampa / Scarica' : 'Chop Etish / Yuklab Olish'}
                </button>
              </div>
            )}

            {/* Official Diploma Mockup */}
            <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl border-4 border-double border-teal-800 bg-[#fdfbf7] shadow-xl text-left space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-teal-900/20 pb-4">
                <div className="flex items-center gap-3">
                  <img src="/afrasia_logo.png" alt="Afrasia" className="h-9 w-auto object-contain" />
                  <span className="font-serif font-black text-lg text-[#0c594d]">AFRASIA ACADEMY</span>
                </div>
                <span className="text-xs font-mono text-emerald-800 font-bold">
                  {user ? `CERT-${user.id ? user.id.slice(-6).toUpperCase() : '2026'}` : 'SAMPLE-PREVIEW'}
                </span>
              </div>

              <div className="text-center space-y-2 py-4">
                <span className="text-[11px] uppercase font-black tracking-widest text-emerald-800">
                  Attestato di Studio • Rasmiy O'quv Sertifikati
                </span>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 border-b-2 border-dashed border-emerald-400/50 pb-1 inline-block px-4">
                    {user ? user.name : (customCertName || "[Ism va Familiyangiz]")}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto italic leading-relaxed pt-2">
                  ha superato con successo il percorso didattico intensivo di Lingua Uzbeka Livello A1 (Starter), dimostrando ottima padronanza nella fonetica, nella contrattazione nei bazar e nelle conversazioni essenziali della Via della Seta.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-teal-900/20 pt-4 text-[11px] text-slate-500">
                <div>
                  <span className="block font-bold text-slate-700">Data di Rilascio:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-[#0c594d]">Afrasia Silk Road Board</span>
                  <span className="text-emerald-700 font-semibold">Tashkent, Uzbekistan</span>
                </div>
              </div>
            </div>

          </div>
        )}


      </main>

    </div>
  );
}
