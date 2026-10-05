import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'frontend', 'db.json');

const newTours = [
  {
    id: "tashkent-city-heritage",
    title: "Toshkent: Qadimiy Ipak Yo'li va Zamonaviy Poytaxt Durdonalari",
    title_uz: "Toshkent: Qadimiy Ipak Yo'li va Zamonaviy Poytaxt Durdonalari",
    title_en: "Tashkent: Ancient Silk Road & Modern Capital Highlights",
    title_it: "Tashkent: Antica Via della Seta e Perle della Capitale Moderna",
    region: "toshkent",
    region_uz: "Toshkent shahri",
    region_en: "Tashkent City",
    region_it: "Città di Tashkent",
    category: "cultural",
    category_uz: "Madaniy meros",
    category_en: "Cultural Heritage",
    category_it: "Patrimonio Culturale",
    agency: "Afrasia Travel Silk Road",
    duration: "1 kun (8 soat)",
    duration_uz: "1 kun (8 soat)",
    duration_en: "1 Day (8 hours)",
    duration_it: "1 Giorno (8 ore)",
    daysCount: 1,
    price: "€65",
    priceNum: 65,
    rating: 4.95,
    reviewsCount: 142,
    groupSize: "Maks. 10 kishi",
    groupSize_uz: "Maks. 10 kishi",
    groupSize_en: "Max 10 people",
    groupSize_it: "Max 10 persone",
    badge: "Best Seller",
    languagesAvailable: ["Italiano", "English", "O'zbekcha"],
    image: "/uploads/places/hazrati_imom_cover.webp",
    gallery: [
      "/uploads/places/hazrati_imom_cover.webp",
      "/uploads/places/chorsu_bozori_cover.webp",
      "/uploads/places/amir_temur_xiyoboni_cover.webp",
      "/uploads/places/toshkent_teleminorasi_cover.webp"
    ],
    highlights_uz: [
      "VII asrga oid asl Usmon Qur'onini o'z ko'zingiz bilan ko'rish",
      "Chorsu bozorining moviy gumbazi ostida xushbo'y ziravorlar va quruq mevalarni tatib ko'rish",
      "Toshkent metrosining eng go'zal marmar bekatlari bo'ylab ekskursiya",
      "Besh Qozon osh markazida afsonaviy Toshkent to'y oshini tanovul qilish",
      "Amaliy san'at muzeyida ganch va suzani ustalari sirlarini o'rganish"
    ],
    highlights_en: [
      "Witness the authentic 7th-century Holy Uthman Quran parchment",
      "Taste spices and organic dry fruits under Chorsu's colossal turquoise dome",
      "Tour the Soviet underground palatial metro stations with ornate chandeliers",
      "Relish authentic wedding plov at the famous Besh Qozon culinary center",
      "Admire hand-carved alabaster ganch plasterwork at the Museum of Applied Arts"
    ],
    highlights_it: [
      "Ammira l'autentico Corano di Uthman del VII secolo su pergamena di daino",
      "Degusta spezie e frutta secca sotto l'imponente cupola turchese di Chorsu",
      "Esplora le monumentali e sfarzose stazioni della metropolitana di Tashkent",
      "Gusta il leggendario Plov nuziale al centro gastronomico Besh Qozon",
      "Scopri l'arte dell'intaglio in gesso e i ricami Suzani al Museo delle Arti Applicate"
    ],
    description_uz: "Ushbu to'liq bir kunlik madaniy sayohat sizni Toshkentning 2200 yillik qadimiy Ipak yo'li tarixi va bugungi zamonaviy yashil megapolis hayoti bilan tanishtiradi. Professional gid hamrohligida Hastimom majmuasi, Chorsu sharq bozori, Ko'kaldosh madrasasi va betakror shahar markazini kashf etasiz.",
    description_en: "This comprehensive one-day guided tour bridges Tashkent's 2,200-year Silk Road antiquity with its cosmopolitan modern reality. Led by a certified multilingual guide, discover the sacred Hastimom ensemble, vibrant Chorsu market, ornate metro stations, and verdant central boulevards.",
    description_it: "Un itinerario guidato di una giornata intera che unisce la storia millenaria della Via della Seta con l'eleganza contemporanea di Tashkent. Con una guida professionale certificata, visiterete il complesso di Hastimom, il bazar Chorsu, la celebre metropolitana e i viali monumentali.",
    itinerary_uz: `09:00 - 11:00 | Hazrati Imom majmuasi va Usmon Qur'oni kutubxonasi ziyorati
11:00 - 12:30 | Chorsu bozori va Ko'kaldosh madrasasi bo'ylab sayohat
12:30 - 14:00 | Besh Qozon markazida an'anaviy to'y oshi va ko'k choy tushligi
14:00 - 15:30 | Toshkent metrosi (Alisher Navoiy va Kosmonavtlar bekatlari) va Amaliy san'at muzeyi
15:30 - 17:00 | Amir Temur xiyoboni, Temuriylar tarixi muzeyi va Toshkent teleminorasi panoramasi`,
    itinerary_en: `09:00 - 11:00 | Hazrat Imam ensemble & Holy Uthman Quran library
11:00 - 12:30 | Walking through Chorsu Bazaar & Kukeldash Madrasah
12:30 - 14:00 | Traditional Plov lunch at the Besh Qozon Gastronomy Center
14:00 - 15:30 | Tashkent Metro tour (Alisher Navoi & Cosmonauts stations) & Applied Arts Museum
15:30 - 17:00 | Amir Timur Square, Timurid Museum & TV Tower scenic viewpoint`,
    itinerary_it: `09:00 - 11:00 | Visita del complesso di Hazrati Imam e della biblioteca del Corano di Uthman
11:00 - 12:30 | Passeggiata nel Bazar Chorsu e alla Madrasa Kukeldash
12:30 - 14:00 | Pranzo tradizionale con Plov e tè verde al centro Besh Qozon
14:00 - 15:30 | Tour della metropolitana di Tashkent e del Museo delle Arti Applicate
15:30 - 17:00 | Piazza Amir Timur, Museo Timuride e panorama dalla Torre TV`,
    included_uz: [
      "Professional gid xizmati (italyan, ingliz yoki o'zbek tilida)",
      "Konditsionerli qulay Mercedes Sprinter / mikroavtobus transferi",
      "Dasturdagi barcha muzeylar va tarixiy obidalar kirish chiptalari",
      "Besh Qozon osh markazida milliy tushlik taomi va salatlar",
      "Kun bo'yi mineral suv va muzey audio-quloqchinlari"
    ],
    included_en: [
      "Licensed professional guide (Italian, English, or Uzbek speaking)",
      "Modern air-conditioned transportation throughout the day",
      "All entrance tickets to museums and historical landmarks",
      "Traditional plov lunch with Uzbek salads and green tea",
      "Complimentary bottled mineral water throughout the day"
    ],
    included_it: [
      "Guida professionista certificata (in italiano, inglese o uzbeko)",
      "Trasporto privato con aria condizionata per l'intera giornata",
      "Tutti i biglietti di ingresso a musei e complessi storici",
      "Pranzo tradizionale uzbeko con Plov, insalate fresche e tè",
      "Acqua minerale in bottiglia inclusa per tutto il tragitto"
    ],
    notIncluded_uz: [
      "Spirtli ichimliklar",
      "Shaxsiy xaridlar va esdalik sovg'alari",
      "Gid va haydovchiga ixtiyoriy choypoy (tip)"
    ],
    notIncluded_en: [
      "Alcoholic beverages",
      "Personal souvenirs and shopping expenses",
      "Gratuities for guide and driver (optional)"
    ],
    notIncluded_it: [
      "Bevande alcoliche",
      "Spese personali e souvenir",
      "Mance per la guida e l'autista (facoltative)"
    ],
    includedIcons: ["guide", "transport", "tickets", "lunch", "water"]
  },
  {
    id: "chimgan-charvak-adventure",
    title: "Chorvoq va Chimyon: Tyanshan Tog'lari va Amirsoy Sarguzashti",
    title_uz: "Chorvoq va Chimyon: Tyanshan Tog'lari va Amirsoy Sarguzashti",
    title_en: "Charvak & Chimgan: Tian Shan Alpine Mountains & Amirsoy Resort",
    title_it: "Charvak e Chimgan: Alpi del Tian Shan e Resort Amirsoy",
    region: "toshkent",
    region_uz: "Toshkent viloyati",
    region_en: "Tashkent Region",
    region_it: "Regione di Tashkent",
    category: "adventure",
    category_uz: "Tog' va Sarguzasht",
    category_en: "Mountain & Adventure",
    category_it: "Montagna e Avventura",
    agency: "Afrasia Mountain Expeditions",
    duration: "2 kun / 1 kecha",
    duration_uz: "2 kun / 1 kecha",
    duration_en: "2 Days / 1 Night",
    duration_it: "2 Giorni / 1 Notte",
    daysCount: 2,
    price: "€160",
    priceNum: 160,
    rating: 4.98,
    reviewsCount: 98,
    groupSize: "Maks. 8 kishi",
    groupSize_uz: "Maks. 8 kishi",
    groupSize_en: "Max 8 people",
    groupSize_it: "Max 8 persone",
    badge: "Top Rated",
    languagesAvailable: ["Italiano", "English", "O'zbekcha"],
    image: "/uploads/places/chimyon_chorvoq_cover.webp",
    gallery: [
      "/uploads/places/chimyon_chorvoq_cover.webp",
      "/uploads/places/chimyon_chorvoq_gallery_1.webp",
      "/uploads/places/chimyon_chorvoq_gallery_2.webp",
      "/uploads/places/chimyon_chorvoq_gallery_3.webp"
    ],
    highlights_uz: [
      "UNESCO tabiiy merosi Ugom-Chotqol milliy bog'ining so'lim manzaralari",
      "Chorvoq suv omborining firuza suvlarida katerda sayr va plyaj dam olishi",
      "Amirsoy zamonaviy gondolali kanat yo'lida 2290 metr balandlikka ko'tarilish",
      "Katta Chimyon etaklarida yengil alp trekking va toza archa havosi",
      "Tog' chaletida yulduzlar ostida romantik tunash va tandir kabob kechki ovqati"
    ],
    highlights_en: [
      "Spectacular scenery in Ugam-Chatkal National Park (UNESCO World Heritage)",
      "Cruise the turquoise alpine waters of Charvak Reservoir by speedboat",
      "Ride the state-of-the-art POMA gondola lift up to 2,290m at Amirsoy Resort",
      "Scenic alpine day hike amidst aromatic juniper groves at Greater Chimgan",
      "Overnight stay in an authentic mountain chalet with stargazing and campfire"
    ],
    highlights_it: [
      "Panorami spettacolari del Parco Nazionale Ugam-Chatkal (Patrimonio UNESCO)",
      "Crociera in motoscafo sulle acque turchesi del lago alpino di Charvak",
      "Risalita in cabinovia panoramica fino a 2.290 metri nel moderno comprensorio Amirsoy",
      "Trekking leggero tra foreste di ginepro ai piedi del possente Monte Chimgan",
      "Soggiorno notturno in chalet alpino con cena barbecue e osservazione delle stelle"
    ],
    description_uz: "G'arbiy Tyanshan tog' tizmasining qalbida 2 kunlik betakror sarguzasht! Shahar shovqinidan uzoqda, Chorvoqning moviy suvlari, Katta Chimyon cho'qqilari va xalqaro Amirsoy kurorti tabiat shaydolariga unutilmas xotiralar hadya etadi.",
    description_en: "An unforgettable two-day mountain adventure into the Western Tian Shan range. Leave the urban rush behind for Charvak's azure waters, alpine hikes beneath Greater Chimgan, and world-class gondola views at Amirsoy.",
    description_it: "Una memorabile fuga montana di due giorni nel massiccio del Tian Shan Occidentale. Ammirate le acque turchesi di Charvak, le vette innevate del Chimgan e i panorami mozzafiato degli impianti di risalita di Amirsoy.",
    itinerary_uz: `1-KUN: Toshkentdan Chorvoqqa yo'l (8:30) -> Xo'jakent petrogliflari -> Chorvoq suv omborida kater va suzish -> Beldersoy darasi bo'ylab sayr -> Amirsoy kurorti chaletiga joylashish va tog' tandir go'shti kechki ovqati
2-KUN: Alp nonushtasi -> Amirsoy gondolasi bilan 2290m cho'qqiga chiqish va fotosessiya -> Katta Chimyon etaklarida sharshara sayri -> Xo'jakent choyxonasida tushlik -> Toshkentga qaytish (18:30)`,
    itinerary_en: `DAY 1: Departure from Tashkent (08:30) -> Ancient petroglyphs -> Charvak lake boat cruise -> Beldersay gorge -> Check-in at alpine chalet & evening campfire dinner
DAY 2: Mountain breakfast -> Amirsoy gondola summit ride (2,290m) -> Alpine walk to mountain cascades -> Lunch at Khojikent garden restaurant -> Return to Tashkent (18:30)`,
    itinerary_it: `GIORNO 1: Partenza da Tashkent (08:30) -> Petroglifi antichi -> Giro in barca sul lago Charvak -> Gola di Beldersay -> Check-in in chalet alpino e cena tipica montanara
GIORNO 2: Colazione montana -> Risalita in vetta con cabinovia Amirsoy (2.290m) -> Escursione alle cascate del Chimgan -> Pranzo a Khojikent -> Rientro a Tashkent (18:30)`,
    included_uz: [
      "1 kecha tog' mehmonxonasi / chaletda yashash (nonushta bilan)",
      "Barcha transferlar (Toshkent - Chimyon - Chorvoq - Toshkent)",
      "Amirsoy zamonaviy kanat yo'liga 2 tomonlama bilet",
      "Tajribali tog' gidi va xavfsizlik instruktori",
      "Dastur bo'yicha barcha nonushta, tushlik va kechki ovqatlar"
    ],
    included_en: [
      "1 Night accommodation in a mountain resort/chalet with breakfast",
      "Full private round-trip transportation from Tashkent in 4WD / Van",
      "Round-trip ticket for the Amirsoy scenic gondola cable car",
      "Licensed mountain trekking guide & safety escort",
      "All meals specified in the itinerary (breakfast, 2 lunches, dinner)"
    ],
    included_it: [
      "1 Notte in resort/chalet alpino con ricca colazione",
      "Trasporto privato andata e ritorno da Tashkent in veicolo confortevole",
      "Biglietto andata e ritorno per la cabinovia panoramica Amirsoy",
      "Guida escursionistica e assistenza per tutta la durata del tour",
      "Tutti i pasti previsti (colazione, 2 pranzi, cena barbecue)"
    ],
    notIncluded_uz: [
      "Paraplanda uchish va suv motosikli (ixtiyoriy qo'shimcha)",
      "Shaxsiy sug'urta va xaridlar"
    ],
    notIncluded_en: [
      "Paragliding tandem flight & jet ski rental (optional add-ons)",
      "Personal medical/travel insurance"
    ],
    notIncluded_it: [
      "Volo in parapendio e noleggio moto d'acqua (opzionali a pagamento)",
      "Assicurazione viaggio personale"
    ],
    includedIcons: ["hotel", "transport", "cablecar", "guide", "meals"]
  },
  {
    id: "tashkent-gastronomy-secrets",
    title: "Toshkent Gastronomiyasi: Chorsudan Besh Qozongacha Pazandachilik Sayri",
    title_uz: "Toshkent Gastronomiyasi: Chorsudan Besh Qozongacha Pazandachilik Sayri",
    title_en: "Tashkent Foodie Tour: Secret Recipes from Chorsu to Besh Qozon",
    title_it: "Tour Gastronomico di Tashkent: Ricette Segrete da Chorsu a Besh Qozon",
    region: "toshkent",
    region_uz: "Toshkent shahri",
    region_en: "Tashkent City",
    region_it: "Città di Tashkent",
    category: "gastronomic",
    category_uz: "Gastronomik",
    category_en: "Food & Culinary",
    category_it: "Gastronomico",
    agency: "Afrasia Culinary Arts",
    duration: "1 kun (6 soat)",
    duration_uz: "1 kun (6 soat)",
    duration_en: "1 Day (6 hours)",
    duration_it: "1 Giorno (6 ore)",
    daysCount: 1,
    price: "€55",
    priceNum: 55,
    rating: 4.92,
    reviewsCount: 115,
    groupSize: "Maks. 12 kishi",
    groupSize_uz: "Maks. 12 kishi",
    groupSize_en: "Max 12 people",
    groupSize_it: "Max 12 persone",
    badge: "Popular",
    languagesAvailable: ["Italiano", "English", "O'zbekcha"],
    image: "/uploads/places/chorsu_bozori_cover.webp",
    gallery: [
      "/uploads/places/chorsu_bozori_cover.webp",
      "/uploads/places/chorsu_bozori_gallery_1.webp",
      "/uploads/places/chorsu_bozori_gallery_2.webp",
      "/uploads/places/chorsu_bozori_gallery_3.webp"
    ],
    highlights_uz: [
      "Chorsu nonvoyxonasida issiq tandir non yopish jarayonida qatnashish",
      "O'zbek ziravorlari (zira, kashnich, zarchava) tanlash bo'yicha mahorat darsi",
      "Toshkentning eng mashhur Besh Qozon markazida devzira to'y oshi sirlari",
      "Yozgi milliy ichimliklar (chalob, ayron, anor sharbati) va shirinliklar degustatsiyasi",
      "Qadimiy choyxonada choy quyish etiketi va novvot choyi marosimi"
    ],
    highlights_en: [
      "Hands-on baking of crusty lepyoshka bread inside a traditional clay tandoor",
      "Masterclass in selecting Central Asian Silk Road spices at Chorsu Market",
      "Live cooking secrets of devzira wedding plov at the giant Besh Qozon cauldrons",
      "Tasting of organic pomegranate juice, dried mountain melons, and halvah",
      "Traditional tea ceremony with mountain green tea and crystalline novvot sugar"
    ],
    highlights_it: [
      "Esperienza diretta di cottura del tipico pane naan nel forno d'argilla tandir",
      "Masterclass sulla selezione delle spezie della Via della Seta al mercato Chorsu",
      "I segreti del Plov nuziale cucinato nei giganteschi calderoni di Besh Qozon",
      "Degustazione di succo di melograno fresco, melone essiccato e halva artigianale",
      "Autentica cerimonia del tè uzbeko servito nei piattini tradizionali con zucchero novvot"
    ],
    description_uz: "O'zbekistonning boy gastronomiya xazinasiga sho'ng'ing! Ushbu tur davomida siz nafaqat eng sara milliy taomlarni tatib ko'rasiz, balki ularning ko'p asrlik tayyorlanish sirlarini bevosita oshpaz ustalardan o'rganasiz.",
    description_en: "An epicurean odyssey into Uzbekistan's celebrated culinary traditions! Savor mouth-watering specialties, engage with generational bakers, and learn culinary craft straight from the masters.",
    description_it: "Un viaggio culinario indimenticabile nei sapori autentici dell'Uzbekistan. Scoprite i segreti dei maestri fornai, assaggiate specialità leggendarie e imparate la cultura del banchetto uzbeko.",
    itinerary_uz: `10:00 - 11:30 | Chorsu bozorida ziravorlar va quruq mevalar tastingi
11:30 - 12:30 | An'anaviy tandir nonvoyxonasida master-klass
12:30 - 14:30 | Besh Qozon markazida devzira to'y oshi va qazi degustatsiyasi
14:30 - 16:00 | Choyxona madaniyati: ko'k choy, qandolat va milliy shirinliklar marosimi`,
    itinerary_en: `10:00 - 11:30 | Spice tasting & dried fruit safari at Chorsu Bazaar
11:30 - 12:30 | Traditional tandoor bread making masterclass
12:30 - 14:30 | Giant cauldron plov tasting & feast at Besh Qozon
14:30 - 16:00 | Chaykhana tea etiquette, mountain herbal infusions & oriental sweets`,
    itinerary_it: `10:00 - 11:30 | Degustazione di spezie e frutta secca al Bazar Chorsu
11:30 - 12:30 | Masterclass pratica di panificazione nel forno tradizionale tandir
12:30 - 14:30 | Degustazione e banchetto del Plov cucinato nei grandi calderoni a Besh Qozon
14:30 - 16:00 | Cerimonia del tè in chaykhana tradizionale con dolci e cristalli di zucchero`,
    included_uz: [
      "Barcha taomlar va degustatsiyalar (non, somsa, osh, shirinliklar)",
      "Professional gastronomik gid hamrohligi",
      "Tandir non yopish master-klassi",
      "Shaharlararo qulay mikroavtobus transporti",
      "Esdalik sovg'asi: o'zbek ziravorlari to'plami"
    ],
    included_en: [
      "All food tastings, lunch feast, and dessert sampling",
      "Dedicated culinary guide and interpreter",
      "Hands-on bread baking masterclass with local baker",
      "Air-conditioned city transportation",
      "Complimentary gourmet Silk Road spice gift pack"
    ],
    included_it: [
      "Tutte le degustazioni gastronomiche, pranzo e dolci inclusi",
      "Guida gastronomica specializzata",
      "Masterclass pratica di preparazione del pane uzbeko",
      "Trasporto privato per gli spostamenti in città",
      "Cofanetto regalo di spezie pregiate della Via della Seta"
    ],
    notIncluded_uz: ["Spirtli ichimliklar", "Shaxsiy xaridlar"],
    notIncluded_en: ["Alcoholic beverages", "Personal shopping expenses"],
    notIncluded_it: ["Bevande alcoliche", "Spese personali extra"],
    includedIcons: ["food", "guide", "cooking", "transport", "gift"]
  },
  {
    id: "silk-road-grand-classic",
    title: "Buyuk Ipak Yo'li: Toshkent — Samarqand — Buxoro Klassik Sayri",
    title_uz: "Buyuk Ipak Yo'li: Toshkent — Samarqand — Buxoro Klassik Sayri",
    title_en: "The Grand Silk Road: Tashkent — Samarkand — Bukhara Classic Odyssey",
    title_it: "La Grande Via della Seta: Tashkent — Samarcanda — Bukhara Odissea Classica",
    region: "all",
    region_uz: "Butun O'zbekiston",
    region_en: "All Uzbekistan",
    region_it: "Tutto l'Uzbekistan",
    category: "cultural",
    category_uz: "Klassik Madaniy Tur",
    category_en: "Grand Cultural Tour",
    category_it: "Grande Tour Culturale",
    agency: "Afrasia Grand Tours",
    duration: "7 kun / 6 kecha",
    duration_uz: "7 kun / 6 kecha",
    duration_en: "7 Days / 6 Nights",
    duration_it: "7 Giorni / 6 Notti",
    daysCount: 7,
    price: "€690",
    priceNum: 690,
    rating: 4.99,
    reviewsCount: 230,
    groupSize: "Maks. 14 kishi",
    groupSize_uz: "Maks. 14 kishi",
    groupSize_en: "Max 14 people",
    groupSize_it: "Max 14 persone",
    badge: "Bucket List",
    languagesAvailable: ["Italiano", "English", "O'zbekcha"],
    image: "/uploads/places/hazrati_imom_gallery_1.webp",
    gallery: [
      "/uploads/places/hazrati_imom_gallery_1.webp",
      "/uploads/places/hazrati_imom_cover.webp",
      "/uploads/places/kokaldosh_madrasasi_cover.webp",
      "/uploads/places/amir_temur_xiyoboni_cover.webp"
    ],
    highlights_uz: [
      "Afrosiyob tezyurar poyezdida Ipak yo'li shaharlari bo'ylab qulay sayohat",
      "Samarqand Registon maydoni va Go'ri Amir maqbarasining moviy mo''jizasi",
      "Buxoro Labi Hovuz va 47 metrli Minorai Kalon qadimiy sehri",
      "Toshkentning zamonaviy va qadimiy obidalari to'liq dasturi",
      "Sharqona 4 yulduzli mehmonxonalar va milliy taomlar degustatsiyasi"
    ],
    highlights_en: [
      "Smooth high-speed travel aboard the modern Afrosiyob Bullet Train",
      "The turquoise majesty of Samarkand's Registan and Gur-e-Amir Mausoleum",
      "Bukhara's UNESCO medieval heart: Lyabi-Khauz and the 47-meter Kalyan Minaret",
      "Comprehensive exploration of Tashkent's ancient relics and modernist marvels",
      "Charming 4-star boutique Silk Road hotels and authentic multi-course dinners"
    ],
    highlights_it: [
      "Viaggio confortevole a bordo del treno ad alta velocità Afrosiyob",
      "La magnificenza turchese di Piazza Registan e del Mausoleo Gur-e-Amir a Samarcanda",
      "Il centro medievale di Bukhara con Lyabi-Khauz e il monumentale Minareto Kalyan",
      "Visita completa dei tesori storici e moderni della capitale Tashkent",
      "Soggiorno in raffinati hotel boutique 4 stelle e cene tradizionali uzbeke"
    ],
    description_uz: "O'zbekistonning eng mashhur uchta qadimiy poytaxti — Toshkent, Samarqand va Buxoroni qamrab olgan afsonaviy 7 kunlik klassik sayohat. Tarix, arxitektura va mehmondo'stlikning eng sara durdonalari bir marshrutda!",
    description_en: "The definitive 7-day Silk Road discovery covering Uzbekistan's golden triumvirate: Tashkent, Samarkand, and Bukhara. Unrivaled architecture, legendary hospitality, and unforgettable memories.",
    description_it: "L'itinerario classico per eccellenza lungo la Via della Seta alla scoperta della triade d'oro: Tashkent, Samarcanda e Bukhara. Architetture favolose, ospitalità leggendaria e memorie indelebili.",
    itinerary_uz: `1-KUN: Toshkentga yetib kelish, kutib olish, Hastimom va Chorsu sayohati
2-KUN: Toshkent muzeylari, metro va Yangi O'zbekiston bog'i
3-KUN: Samarqandga Afrosiyob poyezdida jo'nash, Registon maydoni va Go'ri Amir
4-KUN: Shohi Zinda moviy xiyoboni, Bibixonim masjidi va Siyob bozori
5-KUN: Buxoroga yo'l, Ark qal'asi, Minorai Kalon va Poyi Kalon ansambli
6-KUN: Labi Hovuz, Somoniylar maqbarasi va Chor Minor
7-KUN: Toshkentga tezyurar poyezdda qaytish va xalqaro aeroportga kuzatish`,
    itinerary_en: `DAY 1: Arrival in Tashkent, airport greeting, Hastimom & Chorsu exploration
DAY 2: Tashkent museums, metro tour & New Uzbekistan Park
DAY 3: High-speed Afrosiyob train to Samarkand, Registan & Gur-e-Amir
DAY 4: Shah-i-Zinda necropolis, Bibi-Khanym mosque & Siab bazaar
DAY 5: Journey to Bukhara, the Ark Citadel, Kalyan Minaret & Po-i-Kalyan
DAY 6: Lyabi-Khauz pond ensemble, Samanid Mausoleum & Chor Minor
DAY 7: Return to Tashkent by bullet train, farewell dinner & flight home`,
    itinerary_it: `GIORNO 1: Arrivo a Tashkent, accoglienza, complesso Hastimom e bazar Chorsu
GIORNO 2: Musei di Tashkent, stazioni della metro e Parco Nuovo Uzbekistan
GIORNO 3: Treno ad alta velocità Afrosiyob per Samarcanda, Piazza Registan e Gur-e-Amir
GIORNO 4: Necropoli Shah-i-Zinda, moschea di Bibi-Khanym e bazar Siab
GIORNO 5: Trasferimento a Bukhara, Fortezza Ark, Minareto Kalyan e Po-i-Kalyan
GIORNO 6: Complesso di Lyabi-Khauz, Mausoleo dei Samanidi e Chor Minor
GIORNO 7: Rientro a Tashkent in treno veloce, cena di saluto e trasferimento all'aeroporto`,
    included_uz: [
      "6 kecha 4 yulduzli qulay mehmonxonalarda joylashish (nonushta bilan)",
      "Afrosiyob tezyurar poyezdiga barcha chiptalar (Toshkent-Samarqand-Buxoro-Toshkent)",
      "Butun tur davomida xususiy mikroavtobus transporti va aeroport transferlari",
      "Professional gid hamrohligi (italyan, ingliz yoki o'zbek tilida)",
      "Barcha shaharlardagi obidalarga kirish chiptalari va dasturiy tushliklar"
    ],
    included_en: [
      "6 Nights in premium 4-star boutique hotels with daily breakfast",
      "All high-speed Afrosiyob train tickets (Tashkent-Samarkand-Bukhara-Tashkent)",
      "Private VIP transportation and airport transfers throughout the trip",
      "Full-time licensed professional guide (Italian, English, or Uzbek)",
      "All entrance admissions and scheduled culinary luncheons"
    ],
    included_it: [
      "6 Notti in hotel boutique 4 stelle selezionati con prima colazione",
      "Tutti i biglietti per il treno ad alta velocità Afrosiyob in prima/seconda classe",
      "Trasporto privato con autista dedicato e tutti i trasferimenti aeroportuali",
      "Guida professionista certificata parlante italiano per l'intero soggiorno",
      "Biglietti di ingresso a tutti i monumenti storici e pranzi tipici previsti"
    ],
    notIncluded_uz: ["Xalqaro aviaparvoz chiptalari", "Shaxsiy sug'urta va kechki ovqatlar"],
    notIncluded_en: ["International flights", "Personal travel insurance and dinners"],
    notIncluded_it: ["Voli aerei internazionali", "Assicurazione medica e cene libere"],
    includedIcons: ["hotel", "train", "transport", "guide", "tickets", "meals"]
  }
];

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Prepend or merge new tours
const existingTourIds = new Set(newTours.map(t => t.id));
const remainingTours = (db.tours || []).filter(t => !existingTourIds.has(t.id));

db.tours = [...newTours, ...remainingTours];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

// Also update initialDbData.js
const newFileContent = `// Auto-synchronized initial DB data with complete Tashkent destinations and tours\nexport const initialDb = ` + JSON.stringify(db, null, 2) + `;\n`;
fs.writeFileSync(path.join(rootDir, 'frontend', 'src', 'data', 'initialDbData.js'), newFileContent, 'utf8');

console.log(`✅ Successfully enriched db.json and initialDbData.js with ${newTours.length} detailed tours!`);
