import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Utensils, Music, Sparkles, Clock, Flame, MapPin, 
  Play, Volume2, X, ChevronRight, Info, Heart, Award
} from 'lucide-react';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';
import { getStoredData } from '../utils/dbStorage';

// Curated authentic culinary database
const nationalDishes = [
  {
    id: "toshkent-plov",
    name_uz: "Toshkent To'y Oshi (Palov)",
    name_en: "Tashkent Wedding Plov",
    name_it: "Plov Tradizionale Nuziale di Tashkent",
    region_uz: "Toshkent shahri & Samarqand",
    region_en: "Tashkent City & Samarkand",
    region_it: "Città di Tashkent e Samarcanda",
    category: "main",
    cookTime: "2.5 soat",
    calories: "550 kcal / por",
    image: "/uploads/places/chorsu_bozori_cover.webp",
    history_uz: "Palov — o'zbek xalqining faxri bo'lib, UNESCO Insoniyatning nomoddiy madaniy merosi ro'yxatiga kiritilgan. Toshkent to'y oshi sarig' va qizil sabzi, mayiz, no'xat, qazi va bedana tuxumlari bilan nihoyatda mayin damlanadi.",
    history_en: "Inscribed on UNESCO's Intangible Cultural Heritage list, Plov is the crown jewel of Uzbek gastronomy. The Tashkent wedding plov is celebrated for its golden rice, chickpeas, raisins, tender beef/lamb, and spiced horse-meat sausage (qazi).",
    history_it: "Patrimonio Culturale Immateriale UNESCO, il Plov è il re incontrastato della tavola uzbeka. La versione nuziale di Tashkent si distingue per il riso ambrato devzira, ceci, uvetta dolce, carne tenerissima di manzo o agnello e fette di qazi.",
    secret_uz: "Oshning siri: zirvakni uzoq vaqt past olovda qaynatish va guruchni damlashdan oldin qozon devoridan gumbaz qilib ko'tarishda.",
    secret_it: "Il segreto dello chef: cuocere lentamente il 'zirvak' (soffritto di carne, carote e spezie) a fiamma dolce prima di aggiungere il riso a cupola per una cottura a vapore perfetta.",
    ingredients_uz: ["Alanga / Devzira guruchi", "Qo'y va mol go'shti", "Sariq sabzi", "No'xat va mayiz", "Zira, kashnich, murch", "Qazi va bedana tuxumi"],
    ingredients_it: ["Riso pregiato a chicco lungo", "Carne di agnello e manzo", "Carote gialle uzbekhe", "Ceci e uvetta sultanina", "Cumino selvatico zira", "Salume tradizionale qazi"]
  },
  {
    id: "jizzax-somsa",
    name_uz: "Tandir Somsa (Varaqi va Jizzax somsa)",
    name_en: "Tandoor Somsa (Flaky meat pastry)",
    name_it: "Somsa al Forno Tandoor",
    category: "pastry",
    cookTime: "45 daqiqa",
    calories: "380 kcal / dona",
    image: "/uploads/places/chorsu_bozori_gallery_2.webp",
    history_uz: "Somsa — maxsus loy tandir devorlariga yopishtirib pishiriladigan qatlama pishiriq. Toshkent va Jizzax somsasi o'zining suvli lahm go'shti, mayda to'g'ralgan dumba yog'i va qarsildoq xamiri bilan mashhur.",
    history_en: "Baked by slapping dough directly against the scalding clay walls of a vertical tandoor oven. Crispy on the outside, bursting with aromatic spiced meat juices and melting lamb fat on the inside.",
    history_it: "Fagottini di pasta sfoglia ripieni di carne e cotti sulle pareti arroventate del forno d'argilla tandoor. Croccanti all'esterno e incredibilmente succosi all'interno.",
    secret_uz: "Xamirni qatlama qilishda eritilgan sariyog' yoki dumba yog'idan foydalaniladi, go'sht esa qiyma qilinmay, pichoqda mayda to'g'raladi.",
    secret_it: "La carne non viene mai macinata ma sminuzzata a mano con il coltello per preservarne tutti i succhi aromatici.",
    ingredients_uz: ["Yupqa qatlama xamir", "Mayda to'g'ralgan lahm go'sht", "Dumba yog'i", "Shirin piyoz", "Zira va qora murch"],
    ingredients_it: ["Pasta sfoglia artigianale", "Carne sminuzzata a coltello", "Cipolla dolce", "Cumino zira e pepe nero"]
  },
  {
    id: "lagmon",
    name_uz: "Qovurma va Cho'zma Lag'mon",
    name_en: "Hand-Pulled Lagman Noodles",
    name_it: "Lagman (Tagliatelle Tirate a Mano)",
    category: "noodles",
    cookTime: "1 soat",
    calories: "490 kcal / por",
    image: "/uploads/places/chorsu_bozori_gallery_1.webp",
    history_uz: "Lag'mon — Ipak yo'lining uyg'ur va o'zbek madaniyatlari kesishgan joyida tug'ilgan mahorat taomi. Oshpazlar xamirni qo'lda bir necha metrga cho'zib, ustiga xushbo'y sabzavotli sous (say) qo'shadi.",
    history_en: "A legendary Silk Road noodle dish requiring master artisan hand-pulling techniques. Served either as a rich restorative noodle soup or wok-fried with crisp bell peppers, celery, and tender beef.",
    history_it: "Un sontuoso piatto di tagliatelle tirate a mano secondo antiche tecniche della Via della Seta, condite con un saporito sugo di carne, peperoni dolci, pomodori e spezie aromatiche.",
    secret_uz: "Xamirni bir necha bor tuzli suvda cho'zib pishitish va sayga sarimsoq va kashnichni oxirida qo'shish.",
    secret_it: "L'impasto viene riposato nell'olio e tirato energicamente a mano fino a ottenere fili elastici perfetti.",
    ingredients_uz: ["Qo'lda cho'zilgan xamir", "Mol go'shti", "Bulg'or qalampiri", "Pomidor va sarimsoq", "Selderey va ko'katlar"],
    ingredients_it: ["Tagliatelle fresche fatte a mano", "Carne di manzo", "Peperoni e pomodori", "Sedano e aglio fresco"]
  },
  {
    id: "toshkent-norin",
    name_uz: "Toshkent Norini (Qazili)",
    name_en: "Tashkent Naryn with Qazi",
    name_it: "Naryn di Tashkent con Salume Qazi",
    category: "main",
    cookTime: "3 soat",
    calories: "420 kcal / por",
    image: "/uploads/places/hazrati_imom_gallery_1.webp",
    history_uz: "Norin — qadimiy Toshkent to'ylari va bayramlarining shoh taomi. Qaynatib olingan juda yupqa xamir va qazi-go'sht mayda somoncha qilib to'g'raladi va issiq sho'rva bilan tortiladi.",
    history_en: "A signature Tashkent ceremonial dish. Ultra-thin boiled dough sheets are painstakingly sliced into delicate ribbons and tossed with cured horsemeat sausage (qazi) and rich broth.",
    history_it: "Una delle massime specialità tradizionali della capitale Tashkent: pasta finissima tagliata a julienne e condita con straccetti di carne speziata e salume qazi, servita con brodo caldo.",
    secret_uz: "Pishgan xamir barglari yog'lanib, yaxshilab quritiladi va ipdek ingichka qilib to'g'raladi.",
    secret_it: "La pasta sfoglia bollita viene asciugata e poi tagliata sottilissima a mano prima di essere unita al qazi.",
    ingredients_uz: ["Yupqa pishirilgan xamir", "Ot go'shti va qazi", "Mol go'shti", "Piyoz va zira", "Qaynoq suyak sho'rvasi"],
    ingredients_it: ["Pasta finissima a nastro", "Carne affettata", "Salume tradizionale qazi", "Brodo ristretto aromatico"]
  }
];

// Curated authentic Uzbek musical instruments database
const nationalInstruments = [
  {
    id: "dutor",
    name_uz: "Dutor",
    name_en: "Dutar (Two-stringed Lute)",
    name_it: "Dutar (Liuto a Due Corde)",
    category_uz: "Torli chertma cholg'u",
    category_en: "Plucked string instrument",
    category_it: "Strumento a corde pizzicate",
    timber_uz: "Mayin, ipakdek lirik va qalbga yaqin tovush",
    timber_it: "Suono vellutato, intimo, meditativo e melodioso",
    timber_en: "Velvety, intimate, lyrical resonance",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
    youtubeId: "5qap5aO4i9A",
    description_uz: "Dutor — o'zbek mumtoz musiqa madaniyatining ruhi. Uning noksimon kosasi quritilgan tut daraxtining 10–12 ta yupqa qovurg'asidan teriladi. Ipak torlari faqat qo'l barmoqlari bilan chertiladi va Shashmaqom kuylarini ijro etishda asosiy cholg'u hisoblanadi.",
    description_en: "The Dutar is the spiritual heart of Uzbek classical music. Its pear-shaped body is crafted from aged mulberry wood slats, strung with two natural silk strings played with bare fingers.",
    description_it: "Il Dutar è l'anima della musica classica uzbeka. La cassa a forma di pera è realizzata con doghe stagionate di legno di gelso. Le sue due corde di seta pura vengono pizzicate esclusivamente con le dita.",
    genres_uz: "Shashmaqom, Xalq dostonlari, Lirik kuylar",
    genres_it: "Shashmaqom classico, Canti popolari epici, Melodie intime"
  },
  {
    id: "doira",
    name_uz: "Doira (Doyra)",
    name_en: "Doyra (Frame Drum)",
    name_it: "Doira (Tamburello a Cornice)",
    category_uz: "Zarbli (urma) cholg'u",
    category_en: "Percussion frame drum",
    category_it: "Strumento a percussione a cornice",
    timber_uz: "Jo'shqin, jarangdor, ritmik va to'lqinlantiruvchi zarb",
    timber_it: "Ritmo travolgente, brillante, percussivo e festoso",
    timber_en: "Vibrant, resounding, rhythmic and energetic",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
    youtubeId: "L_LUpnjgPso",
    description_uz: "Doira — o'zbek to'ylari va tantanalarining yuragi. Tok novdasidan egilgan yog'och chambar ustiga buzoq terisi tortiladi va ichki chetiga 60 dan ortiq jez metall halqachalar qadaladi. Usta doirachilar barmoqlarining har bir zarbi bilan butun xalqni raqsga tushiradi.",
    description_en: "The Doyra provides the heartbeat of Central Asian festivals. A wooden ring frame stretched with calfskin features dozens of metal jingling rings inside that shimmer with every strike.",
    description_it: "La Doira è il battito cardiaco delle feste uzbekhe. Una cornice circolare in legno rivestita di pelle con decine di anelli metallici interni che tintinnano a ogni tocco dei virtuosi.",
    genres_uz: "Bayram usullari, Raqs kuylari, Lazgi, Yallalar",
    genres_it: "Ritmi di danza, Danza Lazgi di Khiva, Canti di nozze"
  },
  {
    id: "rubob",
    name_uz: "Qashqar Rubobi",
    name_en: "Kashgar Rubab",
    name_it: "Rubab di Kashgar (Liuto ad Arco)",
    category_uz: "Torli chertma cholg'u",
    category_en: "Plucked string instrument with horns",
    category_it: "Liuto con corni risonatori",
    timber_uz: "O'tkir, jarangdor, dinamik va quvnoq ohang",
    timber_it: "Timbro argentino, penetrante, gioioso e virtuoso",
    timber_en: "Crisp, bright, dynamic and energetic",
    image: "https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&w=800&q=80",
    youtubeId: "jNQXAC9IVRw",
    description_uz: "Qashqar rubobi o'zining quloqqa yoqimli jarangdorligi va korpusining ikki tomonidagi yarim oy shaklidagi 'shoxlari' bilan ajralib turadi. Kosasiga baliq yoki buzoq terisi tortiladi va suyakdan yasalgan mediator (mizrob) bilan chalinadi.",
    description_en: "The Kashgar Rubab is instantly recognized by its signature curved horned projections on the resonator body. It delivers crisp, articulate melodies across folk ensembles.",
    description_it: "Il Rubab si riconosce per le caratteristiche appendici a forma di corno alla base del manico. Il suono brillante viene prodotto tramite un plettro in osso su corde metalliche.",
    genres_uz: "Xalq qo'shiqlari, Ansambl kuylari, Estrada",
    genres_it: "Musica tradizionale d'insieme, Canti popolari della Valle di Fergana"
  },
  {
    id: "tanbur",
    name_uz: "Tanbur",
    name_en: "Tanbur (Classical Long-necked Lute)",
    name_it: "Tanbur (Liuto Mistico a Manico Lungo)",
    category_uz: "Torli mumtoz cholg'u",
    category_en: "Classical modal instrument",
    category_it: "Strumento classico del Maqom",
    timber_uz: "Ilohiy, g'amgin, chuqur va falsafiy",
    timber_it: "Mistico, contemplativo, profondo e solenne",
    timber_en: "Solemn, meditative, deeply spiritual",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
    youtubeId: "kXYiU_JCYtU",
    description_uz: "Tanbur — Shashmaqomning poydevori hisoblangan muqaddas cholg'u. Uzoq dastali tanbur o'ng qo'l ko'rsatkich barmog'iga taqiladigan po'lat noxun (tirnoq) bilan chalinadi. Uning sadosi qalbning eng nozik hislarini uyg'otadi.",
    description_en: "The Tanbur is the sacred master instrument of classical Shashmaqom. Played with a metallic plectrum (nokhuna) worn on the index finger, its sound is profoundly spiritual.",
    description_it: "Il Tanbur è considerato lo strumento sacro e fondamento teorico del Shashmaqom. Suonato con un plettro d'acciaio infilato al dito indice, produce vibrazioni armoniche cariche di misticismo.",
    genres_uz: "Shashmaqom, Mumtoz musiqiy meros",
    genres_it: "Shashmaqom classico, Tradizione spirituale dei maestri"
  },
  {
    id: "nay",
    name_uz: "Nay",
    name_en: "Ney (Cane Bamboo Flute)",
    name_it: "Nay (Flauto Tradizionale di Canna)",
    category_uz: "Puflama cholg'u",
    category_en: "Wind flute instrument",
    category_it: "Strumento a fiato in canna",
    timber_uz: "Sirliligi bilan inson nafasidek iliq va mungli",
    timber_it: "Soffuso, caldo, poetico ed evocativo",
    timber_en: "Haunting, breathy, deeply emotive",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    youtubeId: "2Vv-BfVoq4g",
    description_uz: "Nay — yovvoyi qamish yoki jezdan yasalgan bo'lib, uning sadosi sahrolar shamoli va Ipak yo'lining karvon qo'ng'iroqlarini eslatadi. Har bir mohir naychi o'z nafasi bilan tinglovchini xayoliy sayohatga yetaklaydi.",
    description_en: "The Ney is a reed flute whose breathy overtones evoke the tranquil winds of Silk Road oases and ancient caravan journeys.",
    description_it: "Il Nay è un flauto in canna di palude che produce un suono soffuso e ipnotico, capace di evocare il vento del deserto e le carovane della Via della Seta.",
    genres_uz: "Mumtoz va xalq kuylari, Lirik dostonlar",
    genres_it: "Musica contemplativa classica e melodie popolari"
  }
];

export default function HeritageCulture({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [activeTab, setActiveTab] = useState('cuisine'); // 'cuisine' or 'instruments'
  const [selectedDishModal, setSelectedDishModal] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      
      {/* 1. Luxurious Hero Banner */}
      <div className="relative h-[380px] md:h-[440px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=85" 
          alt="Madaniy Meros va Gastronomiya" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-65 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-black/30 z-10"></div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'it' ? 'Patrimonio Culturale dell\'Uzbekistan' : lang === 'en' ? 'Cultural Heritage & Gastronomy' : 'Madaniy Meros va Gastronomiya'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white font-extrabold tracking-tight drop-shadow-lg">
            {lang === 'it' ? 'Sapori e Armonie della Via della Seta' : lang === 'en' ? 'Flavors & Harmonies of the Silk Road' : 'Ipak Yo\'li Taomlari va Milliy Kuylari'}
          </h1>
          
          <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
            {lang === 'it' 
              ? "Un viaggio esclusivo tra le leggendarie ricette culinarie uzbekhe e gli incantevoli strumenti musicali tradizionali del Shashmaqom."
              : "An immersive journey into Uzbekistan's celebrated UNESCO culinary heritage and the soulful melodies of classical Silk Road instruments."}
          </p>
        </div>
      </div>

      {/* 2. Top Navigation Tabs (Cuisine vs Instruments) */}
      <div className="container mx-auto px-4 max-w-5xl -mt-7 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 flex items-center justify-center gap-2 max-w-md mx-auto">
          
          <button
            onClick={() => setActiveTab('cuisine')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'cuisine' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>{lang === 'it' ? 'Gastronomia Tradizionale' : lang === 'en' ? 'National Gastronomy' : 'Milliy Gastronomiya'}</span>
          </button>

          <button
            onClick={() => setActiveTab('instruments')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'instruments' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Music className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'it' ? 'Strumenti Musicali' : lang === 'en' ? 'Musical Instruments' : 'Cholg\'u Asboblari'}</span>
          </button>

        </div>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="container mx-auto px-4 max-w-7xl pt-14">
        
        {/* TAB 1: GASTRONOMY / NATIONAL DISHES */}
        {activeTab === 'cuisine' && (
          <div className="space-y-10 animate-fade-in-up">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
                {lang === 'it' ? 'I Capolavori del Gusto' : lang === 'en' ? 'Masterpieces of Taste' : 'O\'zbek Pazandachilik San\'ati'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
                {lang === 'it' ? 'I Piatti Celebri dell\'Uzbekistan' : lang === 'en' ? 'Celebrated Dishes of Uzbekistan' : 'O\'zbekistonning Mashhur Taomlari'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-light">
                {lang === 'it' 
                  ? "Ogni piatto racchiude secoli di tradizione, spezie aromatiche e l'ospitalità autentica della terra uzbeka."
                  : "Every dish holds centuries of Silk Road tradition, aromatic spices, and warm hospitable rituals."}
              </p>
            </div>

            {/* Grid of Dishes (Luxury Bento-Grid Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {nationalDishes.map((dish) => (
                <div 
                  key={dish.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group"
                >
                  {/* Photo */}
                  <div className="sm:w-5/12 relative h-56 sm:h-auto overflow-hidden bg-slate-900">
                    <img 
                      src={dish.image} 
                      alt={dish[`name_${lang}`] || dish.name_uz}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      📍 {dish[`region_${lang}`] || dish.region_uz}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="sm:w-7/12 p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold mb-1">
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {dish.cookTime}
                        </span>
                        <span>•</span>
                        <span>{dish.calories}</span>
                      </div>

                      <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-amber-700 transition-colors">
                        {dish[`name_${lang}`] || dish.name_uz}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed font-light">
                        {dish[`history_${lang}`] || dish.history_uz}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500">
                        <strong>{lang === 'it' ? 'Segreto dello Chef:' : lang === 'en' ? 'Chef\'s secret:' : 'Tayyorlash siri:'}</strong>
                        <p className="text-[10px] text-slate-400 line-clamp-1 italic mt-0.5">
                          {dish[`secret_${lang}`] || dish.secret_uz}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedDishModal(dish)}
                        className="bg-slate-900 hover:bg-amber-600 text-white font-bold p-2.5 rounded-xl transition-colors shadow-sm shrink-0 ml-2"
                        title="Vedi ricetta e ingredienti"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: MUSICAL INSTRUMENTS */}
        {activeTab === 'instruments' && (
          <div className="space-y-10 animate-fade-in-up">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                {lang === 'it' ? 'Musica Classica e Popolare' : lang === 'en' ? 'Classical & Folk Music' : 'O\'zbek Mumtoz Musiqasi'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
                {lang === 'it' ? 'Gli Strumenti Musicali Tradizionali' : lang === 'en' ? 'Traditional Musical Instruments' : 'Milliy Cholg\'u Asboblari'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-light">
                {lang === 'it' 
                  ? "Il legno di gelso, la seta pura e il ritmo della doira danno vita al sacro patrimonio del Shashmaqom."
                  : "Mulberry wood, pure silk strings, and pulsating frame drums express the soul of Uzbekistan's musical heritage."}
              </p>
            </div>

            {/* Grid of Instruments */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nationalInstruments.map((inst) => (
                <div 
                  key={inst.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                      <img 
                        src={inst.image} 
                        alt={inst[`name_${lang}`] || inst.name_uz}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                      />
                      <div className="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-md text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-md">
                        {inst[`category_${lang}`] || inst.category_uz}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="font-serif font-bold text-2xl text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {inst[`name_${lang}`] || inst.name_uz}
                      </h3>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                        <div>
                          <strong className="text-slate-800">{lang === 'it' ? 'Timbro:' : lang === 'en' ? 'Tone & Timbre:' : 'Tembri:'} </strong>
                          <span>{inst[`timber_${lang}`] || inst.timber_uz}</span>
                        </div>
                        <div>
                          <strong className="text-slate-800">{lang === 'it' ? 'Generi:' : lang === 'en' ? 'Genres:' : 'Janrlari:'} </strong>
                          <span>{inst[`genres_${lang}`] || inst.genres_uz}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-3">
                        {inst[`description_${lang}`] || inst.description_uz}
                      </p>
                    </div>
                  </div>

                  {/* Play Video Button */}
                  <div className="px-6 pb-6 pt-0">
                    <button
                      onClick={() => setActiveVideoModal(inst)}
                      className="w-full bg-slate-900 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{lang === 'it' ? 'Ascolta e Guarda il Video' : lang === 'en' ? 'Watch Performance & Listen' : 'Kuyni Tinglash va Ko\'rish'}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* 4. DISH RECIPE MODAL */}
      {selectedDishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in-up max-h-[90vh] overflow-y-auto space-y-5">
            <button 
              onClick={() => setSelectedDishModal(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                📍 {selectedDishModal[`region_${lang}`] || selectedDishModal.region_uz}
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {selectedDishModal[`name_${lang}`] || selectedDishModal.name_uz}
              </h3>
            </div>

            <div className="h-48 w-full rounded-2xl overflow-hidden bg-slate-900">
              <img src={selectedDishModal.image} alt="Dish" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">{lang === 'it' ? 'Storia e Origine' : lang === 'en' ? 'History & Heritage' : 'Kelib chiqish tarixi'}:</h4>
              <p>{selectedDishModal[`history_${lang}`] || selectedDishModal.history_uz}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">{lang === 'it' ? 'Ingredienti Principali' : lang === 'en' ? 'Key Ingredients' : 'Asosiy Masalliqlar'}:</h4>
              <ul className="grid grid-cols-2 gap-1.5 text-slate-700">
                {(selectedDishModal[`ingredients_${lang}`] || selectedDishModal.ingredients_uz).map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200/80 text-xs text-amber-950">
              <strong className="block font-bold mb-0.5">{lang === 'it' ? 'Segreto di Preparazione dello Chef:' : lang === 'en' ? 'Chef\'s Preparation Secret:' : 'Oshpazning maxfiy siri:'}</strong>
              <p>{selectedDishModal[`secret_${lang}`] || selectedDishModal.secret_uz}</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. INSTRUMENT VIDEO / AUDIO MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative animate-fade-in-up space-y-4">
            <button 
              onClick={() => setActiveVideoModal(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                🎵 {activeVideoModal[`category_${lang}`] || activeVideoModal.category_uz}
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {activeVideoModal[`name_${lang}`] || activeVideoModal.name_uz}
              </h3>
            </div>

            {/* Embedded YouTube / Video Player */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video w-full shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoModal.youtubeId}?autoplay=1`}
                title={activeVideoModal.name_uz}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeVideoModal[`description_${lang}`] || activeVideoModal.description_uz}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
