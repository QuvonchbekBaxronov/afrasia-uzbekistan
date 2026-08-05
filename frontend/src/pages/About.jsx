import { useState, useEffect } from 'react';
import { t } from '../utils/translations';
import axios from 'axios';

import { API_BASE } from '../config/api';

export default function About({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1600&q=80");
  const [aboutData, setAboutData] = useState({
    aboutHeroTitle_it: "Informazioni sull'Uzbekistan",
    aboutHeroTitle_en: "About Uzbekistan",
    aboutHeroTitle_uz: "O'zbekiston haqida",
    aboutHeroSubtitle_it: "Una terra leggendaria al crocevia della Via della Seta",
    aboutHeroSubtitle_en: "A legendary land at the crossroads of the Silk Road",
    aboutHeroSubtitle_uz: "Buyuk Ipak yo'li chorrahasida joylashgan afsonaviy yurt",
    col1Title_it: "Informazioni Generali",
    col1Title_en: "General Information",
    col1Title_uz: "Umumiy ma'lumot",
    col1Desc_it: "L'Uzbekistan è uno stato antico con una ricca storia situato nel cuore dell'Asia Centrale.",
    col1Desc_en: "Uzbekistan is an ancient state with a rich history located in the heart of Central Asia.",
    col1Desc_uz: "O'zbekiston — Markaziy Osiyoning yuragida joylashgan qadimiy va boy tarixga ega davlat.",
    col2Title_it: "Geografia e Clima",
    col2Title_en: "Geography & Climate",
    col2Title_uz: "Geografiya va iqlim",
    col2Desc_it: "L'Uzbekistan si trova tra i fiumi Amu Darya e Syr Darya, caratterizzato da deserti, valli e maestose montagne.",
    col2Desc_en: "Uzbekistan is located between the Amu Darya and Syr Darya rivers, featuring deserts, valleys, and majestic mountains.",
    col2Desc_uz: "O'zbekiston Markaziy Osiyoning markaziy qismida, Amudaryo va Sirdaryo oralig'ida joylashgan.",
    historyOriginsTitle_it: "Origini e Storia Antica",
    historyOriginsTitle_en: "Origins & Ancient History",
    historyOriginsTitle_uz: "Tarix va Kelib Chiqishi",
    historyOrigins_it: "L'Uzbekistan è una culla della civiltà situata al centro della Via della Seta.",
    historyOrigins_en: "Uzbekistan is a cradle of civilization situated at the heart of the Silk Road.",
    historyOrigins_uz: "O'zbekiston — Buyuk Ipak yo'li markazida joylashgan qadimiy sivilizatsiyalar beshigi.",
    historyOriginsImage: "https://images.unsplash.com/photo-1588392382834-a891154bca4d?auto=format&fit=crop&w=600&q=80",
    religionFaithTitle_it: "Religione e Storia Spirituale",
    religionFaithTitle_en: "Religion & Spiritual Heritage",
    religionFaithTitle_uz: "Din va E'tiqod Tarixi",
    religionFaith_it: "Attraverso i secoli, la regione ha visto la convivenza di Zoroastrismo, Buddismo e Islam.",
    religionFaith_en: "Over centuries, the land hosted Zoroastrianism, Buddhism, and Islam.",
    religionFaith_uz: "Asrlar davomida bu zamin Zardushtiylik, Buddaviylik va Islom dinlari tutashgan muqaddas hudud bo'lgan.",
    religionFaithImage: "https://uzbekistan.travel/storage/app/uploads/public/67b/6aa/42a/thumb_4635_740_0_0_0_auto.jpg",
    lifestyleCultureTitle_it: "Stile di Vita e Tradizioni",
    lifestyleCultureTitle_en: "Lifestyle & Traditions",
    lifestyleCultureTitle_uz: "Odamlar va Turmush Tarzi",
    lifestyleCulture_it: "Il popolo uzbeko è famoso per la sua leggendaria ospitalità e tradizioni artigianali.",
    lifestyleCulture_en: "The Uzbek people are celebrated for sincere hospitality and ancient artisan traditions.",
    lifestyleCulture_uz: "O'zbek xalqi o'zining samimiy mehmondo'stligi, choyxona an'analari va hunarmandchiligi bilan mashhur.",
    lifestyleCultureImage: "https://uzbekistan.travel/storage/app/uploads/public/67b/6a9/0a4/thumb_4631_740_0_0_0_auto.png",
    facts: [
      { subtitle: "Rasmiy nomi", title: "O'zbekiston Respublikasi" },
      { subtitle: "Poytaxti", title: "Toshkent" },
      { subtitle: "Maydoni", title: "448 978 km²" },
      { subtitle: "Aholisi", title: "36 million+ (2024)" },
      { subtitle: "Rasmiy tili", title: "O'zbek tili" },
      { subtitle: "Valyutasi", title: "O'zbek so'mi (UZS)" },
      { subtitle: "Vaqt mintaqasi", title: "UTC +5" },
      { subtitle: "Mustaqillik kuni", title: "1991-yil 1-sentabr" }
    ],
    historyTimeline: []
  });

  useEffect(() => {
    axios.get(`${API_BASE}/pageBanners`)
      .then(res => {
        if (res.data && res.data.about) setBannerUrl(res.data.about);
      })
      .catch(err => console.error(err));

    axios.get(`${API_BASE}/homeFacts`)
      .then(res => {
        if (res.data) {
          setAboutData(prev => ({
            ...prev,
            ...res.data
          }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const displayFacts = aboutData.facts && aboutData.facts.length > 0 ? aboutData.facts : [
    { subtitle_uz: "Rasmiy nomi", title_uz: "O'zbekiston Respublikasi", subtitle_en: "Official Name", title_en: "Republic of Uzbekistan", subtitle_it: "Nome Ufficiale", title_it: "Repubblica dell'Uzbekistan" },
    { subtitle_uz: "Poytaxti", title_uz: "Toshkent", subtitle_en: "Capital", title_en: "Tashkent", subtitle_it: "Capitale", title_it: "Tashkent" },
    { subtitle_uz: "Maydoni", title_uz: "448 978 km²", subtitle_en: "Area", title_en: "448,978 km²", subtitle_it: "Area", title_it: "448.978 km²" },
    { subtitle_uz: "Aholisi", title_uz: "36 million+ (2024)", subtitle_en: "Population", title_en: "36 million+ (2024)", subtitle_it: "Popolazione", title_it: "Oltre 36 milioni (2024)" },
    { subtitle_uz: "Rasmiy tili", title_uz: "O'zbek tili", subtitle_en: "Official Language", title_en: "Uzbek", subtitle_it: "Lingua Ufficiale", title_it: "Uzbeko" },
    { subtitle_uz: "Valyutasi", title_uz: "O'zbek so'mi (UZS)", subtitle_en: "Currency", title_en: "Uzbek som (UZS)", subtitle_it: "Valuta", title_it: "Som uzbeko (UZS)" },
    { subtitle_uz: "Vaqt mintaqasi", title_uz: "UTC +5", subtitle_en: "Time Zone", title_en: "UTC +5", subtitle_it: "Fuso Orario", title_it: "UTC +5" },
    { subtitle_uz: "Mustaqillik kuni", title_uz: "1991-yil 1-sentabr", subtitle_en: "Independence Day", title_en: "September 1, 1991", subtitle_it: "Giorno dell'Indipendenza", title_it: "1 Settembre 1991" }
  ];

  const mapRegions = [
    { id: 'toshkent', name_uz: "Toshkent shahri", name_en: "Tashkent City", name_it: "Tashkent Città" },
    { id: 'toshkent-vil', name_uz: "Toshkent viloyati", name_en: "Tashkent Region", name_it: "Regione di Tashkent" },
    { id: 'samarqand', name_uz: "Samarqand", name_en: "Samarkand", name_it: "Samarcanda" },
    { id: 'buxoro', name_uz: "Buxoro", name_en: "Bukhara", name_it: "Bukhara" },
    { id: 'xiva', name_uz: "Xorazm", name_en: "Khorezm", name_it: "Khorezm" },
    { id: 'andijon', name_uz: "Andijon", name_en: "Andijan", name_it: "Andijan" },
    { id: 'namangan', name_uz: "Namangan", name_en: "Namangan", name_it: "Namangan" },
    { id: 'navoiy', name_uz: "Navoiy", name_en: "Navoiy", name_it: "Navoiy" },
    { id: 'shahrisabz', name_uz: "Qashqadaryo", name_en: "Kashkadarya", name_it: "Kashkadarya" },
    { id: 'termiz', name_uz: "Surxondaryo", name_en: "Surkhandarya", name_it: "Surkhandarya" },
    { id: 'zomin', name_uz: "Jizzax", name_en: "Jizzakh", name_it: "Jizzakh" },
    { id: 'guliston', name_uz: "Sirdaryo", name_en: "Syrdarya", name_it: "Syrdarya" },
    { id: 'qoraqalpogiston', name_uz: "Qoraqalpog'iston", name_en: "Karakalpakstan", name_it: "Karakalpakstan" }
  ];

  const timelineItems = aboutData.historyTimeline && aboutData.historyTimeline.length > 0
    ? aboutData.historyTimeline
    : [
        { 
          id: 1,
          period_it: "IV sec. a.C.", period_en: "4th Century BC", period_uz: "Mil. avv. IV asr",
          title_it: "Alessandro Magno e Maracanda", title_en: "Alexander the Great & Maracanda", title_uz: "Buyuk Iskandar va Marakanda",
          text_it: "Durante le campagne di Alessandro Magno, Samarcanda (Maracanda) era famosa per le sue fortezze e il commercio.",
          text_en: "During Alexander the Great's campaigns, Samarkand (Maracanda) stood as a world-famous fortress along the Silk Road.",
          text_uz: "Buyuk Iskandar yurishi davrida Samarqand (Marakanda) dunyoga mashhur savdo va madaniyat markazi bo'lgan.",
          image: "https://images.unsplash.com/photo-1588392382834-a891154bca4d?auto=format&fit=crop&w=600&q=80"
        },
        { 
          id: 2,
          period_it: "VII - VIII sec.", period_en: "7th - 8th Century", period_uz: "VII - VIII asrlar",
          title_it: "Cultura Islamica e Scienza", title_en: "Islamic Culture & Science", title_uz: "Islom madaniyati va fan",
          text_it: "L'arrivo dell'Islam avviò uno straordinario sviluppo scientifico e architettonico.",
          text_en: "The arrival of Islamic culture marked a golden era in mathematics, astronomy, and architecture.",
          text_uz: "Islom madaniyati kirib kelishi bilan matematika, astronomiya va me'morchilik rivojlandi.",
          image: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=600&q=80"
        },
        { 
          id: 3,
          period_it: "IX - XII sec.", period_en: "9th - 12th Century", period_uz: "IX - XII asrlar",
          title_it: "L'Era dei Grandi Scienziati", title_en: "Era of Great Scholars", title_uz: "Buyuk allomalar davri",
          text_it: "Al-Khwarizmi, Al-Biruni e Ibn Sina gettarono le basi della scienza moderna.",
          text_en: "Al-Khwarizmi, Al-Biruni, and Ibn Sina laid the foundation of modern mathematics and medicine.",
          text_uz: "Al-Xorazmiy, Abu Rayhon Beruniy, Ibn Sino kabi buyuk allomalar ijod etgan oltin davr.",
          image: "https://uzbekistan.travel/storage/app/uploads/public/697/0b7/d28/thumb_5102_740_0_0_0_auto.png"
        },
        { 
          id: 4,
          period_it: "XIV - XV sec.", period_en: "14th - 15th Century", period_uz: "XIV - XV asrlar",
          title_it: "Rinascimento Timuride", title_en: "Timurid Renaissance", title_uz: "Temuriylar renessansi",
          text_it: "Sotto Amir Timur e Ulugh Beg, Samarcanda divenne la capitale della cultura globale.",
          text_en: "Under Amir Timur and Ulugh Beg, Samarkand blossomed into a global capital of science and grand architecture.",
          text_uz: "Amir Temur va Mirzo Ulug'bek davrida Samarqand jahon poytaxtiga va ilm markaziga aylandi.",
          image: "https://uzbekistan.travel/storage/app/uploads/public/67b/6aa/42a/thumb_4635_740_0_0_0_auto.jpg"
        },
        { 
          id: 5,
          period_it: "1991", period_en: "1991", period_uz: "1991-yil",
          title_it: "Indipendenza Nazionale", title_en: "National Independence", title_uz: "Milliy mustaqillik",
          text_it: "L'Uzbekistan ottiene l'indipendenza e valorizza il suo ricco patrimonio storico.",
          text_en: "The Republic of Uzbekistan declared independence, preserving its rich history for the world.",
          text_uz: "O'zbekiston Respublikasi mustaqillikka erishib, boy madaniyatini tikladi.",
          image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80"
        }
      ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Banner */}
      <div className="relative h-[340px] md:h-[380px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>
        <img 
          src={bannerUrl} 
          alt="O'zbekiston haqida" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-75 opacity-80" 
        />
        <div className="relative z-20 text-center px-4 max-w-4xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif text-white font-extrabold tracking-tight drop-shadow-md mb-2">
            {aboutData["aboutHeroTitle_" + lang] || t('aboutHeroTitle', lang)}
          </h1>
          <p className="text-slate-200 text-sm md:text-base font-serif italic drop-shadow">
            {aboutData["aboutHeroSubtitle_" + lang] || t('aboutHeroSubtitle', lang)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16 max-w-6xl">
        
        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {displayFacts.map((fact, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-150 text-center hover:shadow-md transition-shadow">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                {fact["subtitle_" + lang] || fact.subtitle || fact.label}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {fact["title_" + lang] || fact.title || fact.value}
              </span>
            </div>
          ))}
        </div>

        {/* General & Geography Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {aboutData["col1Title_" + lang] || aboutData.col1Title || (lang === 'it' ? 'Informazioni Generali' : lang === 'en' ? 'General Information' : "Umumiy ma'lumot")}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {aboutData["col1Desc_" + lang] || aboutData.col1Desc || "O'zbekiston — Markaziy Osiyoning yuragida joylashgan qadimiy va boy tarixga ega davlat."}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {aboutData["col2Title_" + lang] || aboutData.col2Title || (lang === 'it' ? 'Geografia e Clima' : lang === 'en' ? 'Geography & Climate' : "Geografiya va iqlim")}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {aboutData["col2Desc_" + lang] || aboutData.col2Desc || "O'zbekiston Markaziy Osiyoning markaziy qismida, Amudaryo va Sirdaryo oralig'ida joylashgan."}
            </p>
          </div>
        </div>

        {/* Minimalist History, Religion & Lifestyle 3-Card Grid */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            {lang === 'it' ? 'Storia, Religione e Stile di Vita' : lang === 'en' ? 'History, Religion & Lifestyle' : "Tarix, din va turmush tarzi"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Origins */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={aboutData.historyOriginsImage || "https://images.unsplash.com/photo-1588392382834-a891154bca4d?auto=format&fit=crop&w=600&q=80"} 
                  alt="Origins" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold text-lg drop-shadow">
                  {aboutData["historyOriginsTitle_" + lang] || (lang === 'it' ? 'Origini e Storia Antica' : lang === 'en' ? 'Origins & Ancient History' : "Tarix va Kelib Chiqishi")}
                </h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                  {aboutData["historyOrigins_" + lang] || "O'zbekiston — Buyuk Ipak yo'li markazida joylashgan qadimiy sivilizatsiyalar beshigi."}
                </p>
              </div>
            </div>

            {/* Card 2: Religion */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={aboutData.religionFaithImage || "https://uzbekistan.travel/storage/app/uploads/public/67b/6aa/42a/thumb_4635_740_0_0_0_auto.jpg"} 
                  alt="Religion" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold text-lg drop-shadow">
                  {aboutData["religionFaithTitle_" + lang] || (lang === 'it' ? 'Religione e Storia Spirituale' : lang === 'en' ? 'Religion & Spiritual Heritage' : "Din va E'tiqod Tarixi")}
                </h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                  {aboutData["religionFaith_" + lang] || "Asrlar davomida bu zamin Zardushtiylik, Buddaviylik va Islom dinlari tutashgan muqaddas hudud bo'lgan."}
                </p>
              </div>
            </div>

            {/* Card 3: Lifestyle */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={aboutData.lifestyleCultureImage || "https://uzbekistan.travel/storage/app/uploads/public/67b/6a9/0a4/thumb_4631_740_0_0_0_auto.png"} 
                  alt="Lifestyle" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold text-lg drop-shadow">
                  {aboutData["lifestyleCultureTitle_" + lang] || (lang === 'it' ? 'Stile di Vita e Tradizioni' : lang === 'en' ? 'Lifestyle & Traditions' : "Odamlar va Turmush Tarzi")}
                </h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                  {aboutData["lifestyleCulture_" + lang] || "O'zbek xalqi o'zining samimiy mehmondo'stligi, choyxona an'analari va hunarmandchiligi bilan mashhur."}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Map Section */}
        <div className="bg-gradient-to-br from-[#0c594d] to-[#083831] rounded-2xl p-8 md:p-12 text-white mb-20 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">{t('interactiveMapTitle', currentLang.code)}</h2>
            <p className="text-teal-100 text-sm mb-6">{t('exploreViloyat', currentLang.code)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {mapRegions.map((region, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 text-xs font-semibold text-center border border-white/15 hover:bg-white/25 transition-colors cursor-pointer">
                  {region[`name_${lang}`]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
            {lang === 'it' ? 'Cronologia Storica' : lang === 'en' ? 'Historical Timeline' : 'Tarixiy xronologiya'}
          </h2>
          <p className="text-slate-500 text-xs text-center mb-10">
            {lang === 'it' ? 'I momenti salienti che hanno plasmato l\'Uzbekistan' : lang === 'en' ? 'Key milestones shaping Uzbekistan through the ages' : "O'zbekiston tarixini shakllantirgan muhim davrlar"}
          </p>
          
          <div className="space-y-8 max-w-4xl mx-auto">
            {timelineItems.map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-150 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item[`title_${lang}`] || item.title || item.period_uz} 
                    className="w-full md:w-44 h-32 object-cover rounded-xl shrink-0" 
                  />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#0c594d] text-white font-extrabold text-xs px-3 py-1 rounded-lg tracking-wider uppercase">
                      {item[`period_${lang}`] || item.period_uz || item.year}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {item[`title_${lang}`] || item.title_uz || item.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item[`text_${lang}`] || item.text_uz || item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
