import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'frontend', 'db.json');

const tashkentPlaces = [
  {
    id: "hazrati-imom",
    name: "Hazrati Imom (Hastimom) majmuasi",
    name_uz: "Hazrati Imom (Hastimom) majmuasi",
    name_en: "Hazrat Imam (Hastimom) Complex",
    name_it: "Complesso di Hazrati Imam (Hastimom)",
    category: "Ziyoratgoh",
    category_uz: "Ziyoratgoh",
    category_en: "Religious & Cultural Complex",
    category_it: "Complesso Religioso e Culturale",
    shortDesc_uz: "Toshkentning eng qadimiy ma'naviy markazi, VII asrga oid mashhur Usmon Qur'oni saqlanadigan muqaddas maskan.",
    shortDesc_en: "The historical spiritual heart of Tashkent, home to the sacred 7th-century Uthman Quran (Mushaf of Othman).",
    shortDesc_it: "Il cuore spirituale storico di Tashkent, custode del sacro Corano di Uthman del VII secolo.",
    history_uz: `Hazrati Imom (xalq tilida Hastimom) majmuasi — Toshkent shahrining eng yirik diniy va me'moriy yodgorliklaridan biri bo'lib, XVI–XX asrlar oralig'ida shakllangan. Ushbu majmua mashhur islom olimi, Toshkentning birinchi imomi Abu Bakr Muhammad ibn Ali Ismoil al-Qaffol ash-Shoshiy sharafiga bunyod etilgan.

Majmua tarkibiga bir necha nodir tarixiy binolar kiradi:
1. Mo'yi Muborak madrasasi (XVI asr) — hozirda bu yerda dunyodagi eng qadimiy to'liq saqlangan qo'lyozmalardan biri, xalifa Usmon davriga (644–656 yillar) oid kiyik terisiga yozilgan "Usmon Qur'oni" (Mushafi Usmoniy) saqlanmoqda.
2. Baroqxon madrasasi (1531–1532 yillar) — Shayboniylar sulolasi davrida Nurobod hokimi Navro'z Ahmadxon (Baroqxon) tomonidan barpo etilgan ajoyib koshinli peshtoqqa ega bino.
3. Qaffol Shoshiy maqbarasi (1541–1542 yillar) — buyuk olim qabri ustiga g'ishtdan gumbazli qilib bunyod etilgan me'moriy inshoot.
4. Hazrati Imom jome masjidi — 2007-yilda milliy me'morchilik an'analari asosida, o'ymakor sandal yog'ochi ustunlari va ikkita 53 metrli muazzam minorasi bilan qayta qad rostlagan.

Majmua maydoni keng va obod bo'lib, xalqaro sayyohlar uchun O'zbekistonning boy islomiy merosi bilan yaqindan tanishishning asosiy maskani hisoblanadi.`,
    history_en: `The Hazrat Imam (Hastimom) Complex is the premier religious and historical center of Tashkent, developed between the 16th and 20th centuries. It honors Abu Bakr Muhammad ibn Ali Ismail al-Qaffal ash-Shashi, an eminent 10th-century scholar and the first imam of Tashkent.

The complex encompasses several world-renowned heritage monuments:
1. Muyi Mubarak Madrasah (16th century) — houses the legendary 7th-century holy Uthman Quran (Samarkand Kufic Quran), inscribed on deerskin parchment and recognized by UNESCO Memory of the World.
2. Barak-Khan Madrasah (1531–1532) — built under Shaybanid ruler Navruz Ahmad Khan, featuring magnificent glazed tilework and traditional student cells.
3. Mausoleum of Qaffal Shashi (1541–1542) — a stepped domed mausoleum built from burnt brick.
4. Hazrat Imam Friday Mosque — erected in 2007 in authentic Islamic architectural style, featuring intricately hand-carved sandalwood columns and two 53-meter minarets.

It stands as an essential pilgrimage site on the ancient Silk Road, drawing visitors seeking spiritual history and Timurid-influenced craftsmanship.`,
    history_it: `Il Complesso di Hazrati Imam (noto localmente come Hastimom) è il centro religioso e storico più importante di Tashkent, sviluppatosi tra il XVI e il XX secolo in onore del celebre studioso islamico Abu Bakr Muhammad al-Qaffal ash-Shashi.

Il complesso comprende monumenti di inestimabile valore:
1. Madrasa Muyi Mubarak (XVI sec.) — custodisce il leggendario Corano di Uthman del VII secolo, scritto su pergamena di daino e inserito nel Registro della Memoria del Mondo UNESCO.
2. Madrasa di Barak-Khan (1531–1532) — capolavoro dell'epoca shaybanide con un sontuoso portale decorato a mosaico turchese.
3. Mausoleo di Qaffal Shashi (1541–1542) — mausoleo a cupola con iscrizioni calligrafiche storiche.
4. Moschea Congregazionale di Hazrati Imam — ricostruita nel 2007 secondo i canoni dell'architettura tradizionale uzbeka, con raffinate colonne in legno di sandalo scolpito e due minareti alti 53 metri.

Rappresenta una tappa imperdibile lungo la Via della Seta per ammirare la profonda eredità culturale dell'Asia Centrale.`,
    location: "Toshkent shahri, Olmazor tumani, Qorasaroy ko'chasi",
    location_uz: "Toshkent shahri, Olmazor tumani, Qorasaroy ko'chasi",
    location_en: "Qarasaray Street, Olmazor District, Tashkent",
    location_it: "Via Qarasaray, Distretto di Olmazor, Tashkent",
    coordinates: { lat: 41.3375, lng: 69.2415 },
    latitude: 41.3375,
    longitude: 69.2415,
    mapUrl: "https://maps.google.com/?q=41.3375,69.2415",
    workHours: "Har kuni: 09:00 – 18:00",
    workHours_uz: "Har kuni: 09:00 – 18:00",
    workHours_en: "Daily: 09:00 AM – 06:00 PM",
    workHours_it: "Ogni giorno: 09:00 – 18:00",
    ticketPrice: "Hudud bepul, Muzey: 25,000 UZS (~2 €)",
    ticketPrice_uz: "Hudud bepul, Mo'yi Muborak muzeyi: 25,000 UZS (~2 €)",
    ticketPrice_en: "Courtyard Free, Quran Museum: 25,000 UZS (~$2 USD)",
    ticketPrice_it: "Cortile Gratuito, Museo del Corano: 25.000 UZS (~2 €)",
    bestSeason_uz: "Bahor (mart-may) va Kuz (sentyabr-noyabr)",
    bestSeason_en: "Spring (March-May) & Autumn (September-November)",
    bestSeason_it: "Primavera (marzo-maggio) e Autunno (settembre-novembre)",
    tags: ["UNESCO", "Qur'on", "Ipak Yo'li", "Tarixiy Obida", "Ziyorat"],
    image: "/uploads/places/hazrati_imom_cover.webp",
    gallery: [
      "/uploads/places/hazrati_imom_gallery_1.webp",
      "/uploads/places/hazrati_imom_gallery_2.webp",
      "/uploads/places/hazrati_imom_gallery_3.webp"
    ]
  },
  {
    id: "chorsu-bozori",
    name: "Chorsu bozori",
    name_uz: "Chorsu bozori",
    name_en: "Chorsu Bazaar",
    name_it: "Bazar Chorsu",
    category: "Tarixiy obida",
    category_uz: "Tarixiy obida",
    category_en: "Historical Market & Culture",
    category_it: "Mercato Storico e Cultura",
    shortDesc_uz: "Markaziy Osiyodagi eng qadimiy va gavjum bozor, mashhur feruza gumbaz ostidagi sharqona savdo dunyosi.",
    shortDesc_en: "Central Asia's most iconic covered bazaar, topped by a monumental turquoise dome echoing Silk Road commerce.",
    shortDesc_it: "Il più celebre bazar coperto dell'Asia Centrale, sormontato da una gigantesca cupola turchese.",
    history_uz: `Chorsu bozori (forscha "Chorsu" — to'rt yo'l chorrahasi ma'nosini bildiradi) — Toshkent shahrining eng qadimiy va rang-barang savdo markazidir. U Buyuk Ipak yo'lining asosiy savdo yo'llari kesishgan qadimiy Eski shahar markazida asrlar davomida faoliyat yuritib kelmoqda.

Bozorning me'moriy ramzi — 1980-yilda zamonaviy sharqona uslubda barpo etilgan, diametri deyarli 100 metr bo'lgan moviy rangdagi ulkan betakror gumbazdir. Gumbaz ostida 2 qavatli savdo pavilyoni joylashgan bo'lib, bu yerda O'zbekistonning eng sara quruq mevalari (mayiz, o'rik qoqi, bodom, yong'oq), xushbo'y ziravorlar, milliy pishloqlar (qurt) va holvalar sotiladi.

Bozor atrofida milliy nonvoyxonalar bo'lib, issiq tandir nonlari, somsa va an'anaviy go'sht qatorlari joylashgan. Shuningdek, bozorning sharqiy qismida yog'och o'ymakorligi, do'ppido'zlik, milliy liboslar va suvenir rastalari faoliyat yuritadi. Bu yer shunchaki bozor emas, balki jonli o'zbek mehmondo'stligi va madaniyatining haqiqiy poydevoridir.`,
    history_en: `Chorsu Bazaar (Persian for "four crossroads") is Tashkent's oldest trading hub, pulsing at the historical crossroads of the Silk Road in the Old City (Eski Shahar) for over a millennium.

The bazaar's defining architectural marvel is its monumental turquoise-tiled cupola, nearly 100 meters wide, completed in 1980 in contemporary Oriental modernist design. Under the grand two-tiered dome, merchants display mountains of sun-dried fruits, nuts, fragrant Central Asian spices, fermented kurt cheese, and mountain honey.

Surrounding open-air pavilions feature traditional bakers slapping fresh lepyoshka bread into blazing tandoor ovens, smoking skewers of Shashlik, and artisanal stalls showcasing hand-embroidered suzani, carved wooden boxes, and ceramics. Visiting Chorsu is a sensory immersion into living Uzbek trading traditions.`,
    history_it: `Il Bazar Chorsu (dal persiano "quattro corsi d'acqua/crocevia") è il mercato più antico e vibrante di Tashkent, situato nel cuore della Città Vecchia (Eski Shahar).

Il simbolo iconico del mercato è la monumentale cupola turchese a volta geodetica con diametro di quasi 100 metri, eretta nel 1980. Sotto questa maestosa volta a due livelli si trovano spezie aromatiche, montagne di frutta secca (albicocche, mandorle, uva passa), dolci tradizionali e formaggi nomadi salati (qurt).

All'esterno, i vicoli sono animati da fornai che sfornano il pane tradizionale naan caldo nei forni tandir, spiedini di shashlik e maestri artigiani che intagliano legno e ricamano sete. Un viaggio sensoriale irrinunciabile nella vera vita quotidiana uzbeka.`,
    location: "Toshkent shahri, Shayxontohur tumani, Navoiy ko'chasi (Metro: Chorsu)",
    location_uz: "Toshkent shahri, Shayxontohur tumani, Navoiy ko'chasi (Metro: Chorsu)",
    location_en: "Navoi Street, Shaykhontohur District, Tashkent (Metro: Chorsu)",
    location_it: "Via Navoi, Distretto di Shaykhontohur, Tashkent (Metro: Chorsu)",
    coordinates: { lat: 41.3271, lng: 69.2355 },
    latitude: 41.3271,
    longitude: 69.2355,
    mapUrl: "https://maps.google.com/?q=41.3271,69.2355",
    workHours: "Har kuni: 06:00 – 19:00 (Dushanba texnik kun)",
    workHours_uz: "Har kuni: 06:00 – 19:00 (Dushanba texnik kun)",
    workHours_en: "Daily: 06:00 AM – 07:00 PM (Monday partial sanitation)",
    workHours_it: "Ogni giorno: 06:00 – 19:00 (Lunedì parziale pulizia)",
    ticketPrice: "Bepul kirish",
    ticketPrice_uz: "Bepul kirish",
    ticketPrice_en: "Free admission",
    ticketPrice_it: "Ingresso gratuito",
    bestSeason_uz: "Butun yil davomida (erta tong eng qulay payt)",
    bestSeason_en: "All year round (early morning is best)",
    bestSeason_it: "Tutto l'anno (mattina presto consigliata)",
    tags: ["Bozor", "Ipak Yo'li", "Gastronomiya", "Suvenirlar", "Eski Shahar"],
    image: "/uploads/places/chorsu_bozori_cover.webp",
    gallery: [
      "/uploads/places/chorsu_bozori_gallery_1.webp",
      "/uploads/places/chorsu_bozori_gallery_2.webp",
      "/uploads/places/chorsu_bozori_gallery_3.webp"
    ]
  },
  {
    id: "toshkent-teleminorasi",
    name: "Toshkent teleminorasi",
    name_uz: "Toshkent teleminorasi",
    name_en: "Tashkent TV Tower",
    name_it: "Torre della Televisione di Tashkent",
    category: "Zamonaviy maskan",
    category_uz: "Zamonaviy maskan",
    category_en: "Modern Landmark & Skyline",
    category_it: "Attrazione Moderna e Panorama",
    shortDesc_uz: "Markaziy Osiyodagi eng baland me'moriy inshoot (375 m), aylanuvchi restoran va shahar panoramasini taqdim etadi.",
    shortDesc_en: "The tallest tower in Central Asia (375m), offering 360° panoramic observation decks and a revolving restaurant.",
    shortDesc_it: "La torre più alta dell'Asia Centrale (375m), con terrazza panoramica a 360° e ristorante rotante.",
    history_uz: `Toshkent teleminorasi — balandligi 375 metr bo'lib, Markaziy Osiyodagi eng baland bino va dunyodagi eng noyob teleminoralar qatoriga kiradi (Jahon buyuk minoralari federatsiyasi a'zosi). U 1978–1985 yillarda zilzilabardosh (9 ballgacha) po'lat karkas asosida barpo etilgan.

Minora me'morchiligi o'ziga xos muhandislik yutug'i hisoblanadi: uning asosi tripod (uch oyoqli) ko'rinishida bo'lib, sharqona milliy naqshlar bilan uyg'unlashtirilgan. 100–110 metr balandlikda mehmonlar uchun 2 ta asosiy zona mavjud:
1. Yopiq kuzatuv maydonchasi — bu yerdan Toshkent shahrining yam-yashil daraxtzorlari, xiyobonlari va uzoqdagi Chotqol tog' tizmalari kaftdek ko'rinadi.
2. "Koinot" aylanuvchi restorani — moviy va qizil zallarga ega bo'lib, pol o'qi atrofida asta-sekin aylanib, taomlanish jarayonida butun shahar manzarasini tomosha qilish imkonini beradi.

Minora etagida poytaxtning eng mashhur "Osh markazi" (Besh Qozon) va Toshkent Botanika bog'i joylashgan bo'lib, bu yer sayyohlar uchun ajoyib dam olish kun tartibini tashkil qiladi.`,
    history_en: `The Tashkent Television Tower rises to an astounding 375 meters (1,230 ft), reigning as the tallest tower in Central Asia and the 12th tallest in the world upon its completion in 1985. Engineered to withstand Richter 9.0 earthquakes, it is a member of the World Federation of Great Towers.

The tower features a distinctive three-legged openwork lattice tripod inspired by traditional Central Asian ornamentation. At an elevation of 100 meters, high-speed Swiss elevators whisk visitors to:
1. The Circular Observation Deck — offering sweeping 360-degree vistas over modern skyscrapers, leafy boulevards, and snowcapped Tian Shan peaks on clear days.
2. The Revolving Restaurant "Koinot" (Cosmos) — featuring two revolving dining levels serving national delicacies as the city lights drift past below.

Located next to the Tashkent Memorial Park, Aqua Park, and the famous Besh Qozon Plov Center, it is a prime contemporary landmark.`,
    history_it: `La Torre della Televisione di Tashkent, con i suoi 375 metri di altezza, è l'edificio più alto dell'Asia Centrale e membro della Federazione Mondiale delle Grandi Torri. Costruita tra il 1978 e il 1985 con una struttura antisismica in acciaio capace di resistere a terremoti di magnitudo 9.

La sua architettura unica poggia su un imponente tripode reticolare decorato con motivi stilizzati orientali. A 100 metri di quota, ascensori ultrarapidi conducono a:
1. La Terrazza Panoramica Coperta — con una vista a 360 gradi su Tashkent e sui contrafforti montuosi del Tian Shan.
2. Il Ristorante Girevole "Koinot" — due sale girevoli che completano una rotazione panoramica durante il pasto.

Situata vicino al rinomato Centro del Plov (Besh Qozon) e al Parco Botanico, è una meta irrinunciabile per fotografi e viaggiatori.`,
    location: "Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi 109",
    location_uz: "Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi 109",
    location_en: "109 Amir Timur Street, Yunusabad District, Tashkent",
    location_it: "Via Amir Timur 109, Distretto di Yunusabad, Tashkent",
    coordinates: { lat: 41.3458, lng: 69.2847 },
    latitude: 41.3458,
    longitude: 69.2847,
    mapUrl: "https://maps.google.com/?q=41.3458,69.2847",
    workHours: "Seshanba - Yakshanba: 10:00 – 20:00 (Dushanba dam olish)",
    workHours_uz: "Seshanba - Yakshanba: 10:00 – 20:00 (Dushanba dam olish)",
    workHours_en: "Tuesday - Sunday: 10:00 AM – 08:00 PM (Closed Monday)",
    workHours_it: "Martedì - Domenica: 10:00 – 20:00 (Lunedì chiuso)",
    ticketPrice: "Kattalar: 40,000 UZS, Chet elliklar: 50,000 UZS (~4 €)",
    ticketPrice_uz: "Kattalar: 40,000 UZS, Chet elliklar: 50,000 UZS (~4 €)",
    ticketPrice_en: "Adults: 40,000 UZS, Foreign Tourists: 50,000 UZS (~$4 USD)",
    ticketPrice_it: "Adulti: 40.000 UZS, Turisti stranieri: 50.000 UZS (~4 €)",
    bestSeason_uz: "Quyosh botishi vaqti (butun yil)",
    bestSeason_en: "Sunset hours (year-round)",
    bestSeason_it: "Ora del tramonto (tutto l'anno)",
    tags: ["Teleminora", "Panoramik Ko'rinish", "Arxitektura", "Restoran"],
    image: "/uploads/places/toshkent_teleminorasi_cover.webp",
    gallery: [
      "/uploads/places/toshkent_teleminorasi_gallery_1.webp",
      "/uploads/places/toshkent_teleminorasi_gallery_2.webp",
      "/uploads/places/toshkent_teleminorasi_gallery_3.webp"
    ]
  },
  {
    id: "kokaldosh-madrasasi",
    name: "Ko'kaldosh madrasasi",
    name_uz: "Ko'kaldosh madrasasi",
    name_en: "Kukeldash Madrasah",
    name_it: "Madrasa Kukeldash",
    category: "Tarixiy obida",
    category_uz: "Tarixiy obida",
    category_en: "Historical Madrasah & Architecture",
    category_it: "Madrasa Storica e Architettura",
    shortDesc_uz: "XVI asr Shayboniylar davri me'morchilik durdonasi, Chorsu maydonida qad rostlagan qadimiy ilm maskani.",
    shortDesc_en: "A magnificent 16th-century Islamic college towering proudly beside Chorsu square.",
    shortDesc_it: "Uno splendido collegio islamico del XVI secolo che domina piazza Chorsu.",
    history_uz: `Ko'kaldosh madrasasi — Toshkent shahrining Chorsu maydonida joylashgan eng yirik va mashhur tarixiy madrasalardan biridir. U taxminan 1568–1569 yillarda Shayboniy hukmdorlar Dervishxon va Navro'z Ahmadxon davrida nufuzli vazir Qulbobo Ko'kaldosh ("Ko'kaldosh" — xonning emikdosh birodari unvoni) tomonidan bunyod etilgan.

Bino pishiq g'ishtdan ikki qavatli qilib qurilgan bo'lib, uning ulkan peshtoqi (balandligi qariyb 20 metr) an'anaviy koshin va sirkor naqshlar bilan bezatilgan. Ichki hovlisida talabalar istiqomat qilgan va ta'lim olgan 38 ta hujra, darsxona va masjid joylashgan. Asrlar davomida bu bino nafaqat islomiy ta'lim dargohi, balki karvonsaroy va qal'a vazifasini ham o'tagan.

Bugungi kunda Ko'kaldosh madrasasi faoliyat yurituvchi diniy ta'lim muassasasi hisoblanadi. Ichki hovlisida mahalliy yog'och ustalari va xattotlar ijod qiladi. U Chorsu bozori va Juma masjidi bilan birgalikda Toshkent qadimiy qiyofasining ajralmas ansamblini tashkil etadi.`,
    history_en: `Kukeldash Madrasah is one of Tashkent's most monumental historical landmarks, established around 1568–1569 during the Shaybanid dynasty by Kulbaba Kukeldash, high vizier to rulers Dervish Khan and Navruz Ahmad Khan ("Kukeldash" meaning foster brother of the Khan).

Constructed of fired yellow brick, the madrasah showcases a grand portal soaring 20 meters, decorated with majolica floral tiles and blue geometric patterns. Within its tranquil rectangular courtyard lie 38 vaulted student rooms (hujras), a darskhona lecture hall, and a prayer mosque. Over its tumultuous 450-year history, the edifice served as a scholarly college, caravan stopover, and fortress.

Today, carefully restored, Kukeldash operates as a practicing theological seminary while opening its courtyard to tourists. Master calligraphers and woodturners demonstrate Silk Road craftsmanship in the lower cloisters, right next to the Chorsu bazaar.`,
    history_it: `La Madrasa Kukeldash è uno dei più imponenti complessi storici di Tashkent, eretta intorno al 1568–1569 durante la dinastia Shaybanide da Kulbaba Kukeldash, primo ministro e fratello di latte del sovrano.

Costruita in laterizio dorato, la madrasa si apre con un monumentale iwan (portale) alto 20 metri ornato di maioliche turchesi e motivi geometrici geometrici. All'interno si articola un sereno cortile circondato da 38 cellette per gli studenti (hujra), aule didattiche e una sala di preghiera. Nel corso dei secoli la struttura è stata anche caravanserraglio e fortezza.

Oggi accoglie visitatori e ospita botteghe di maestri incisori su legno e calligrafi uzbeki, formando un binomio imperdibile con l'adiacente mercato Chorsu.`,
    location: "Toshkent shahri, Chorsu maydoni, Beruniy ko'chasi",
    location_uz: "Toshkent shahri, Chorsu maydoni, Beruniy ko'chasi",
    location_en: "Beruni Street, Chorsu Square, Tashkent",
    location_it: "Via Beruni, Piazza Chorsu, Tashkent",
    coordinates: { lat: 41.3228, lng: 69.2361 },
    latitude: 41.3228,
    longitude: 69.2361,
    mapUrl: "https://maps.google.com/?q=41.3228,69.2361",
    workHours: "Har kuni: 09:00 – 18:00",
    workHours_uz: "Har kuni: 09:00 – 18:00",
    workHours_en: "Daily: 09:00 AM – 06:00 PM",
    workHours_it: "Ogni giorno: 09:00 – 18:00",
    ticketPrice: "15,000 UZS (~1.2 €)",
    ticketPrice_uz: "15,000 UZS (~1.2 €)",
    ticketPrice_en: "15,000 UZS (~$1.2 USD)",
    ticketPrice_it: "15.000 UZS (~1.2 €)",
    bestSeason_uz: "Bahor va kuz oylari",
    bestSeason_en: "Spring and Autumn",
    bestSeason_it: "Primavera e Autunno",
    tags: ["Shayboniylar", "Madrasa", "XVI asr", "Me'morchilik", "Chorsu"],
    image: "/uploads/places/kokaldosh_madrasasi_cover.webp",
    gallery: [
      "/uploads/places/kokaldosh_madrasasi_gallery_1.webp",
      "/uploads/places/kokaldosh_madrasasi_gallery_2.webp",
      "/uploads/places/kokaldosh_madrasasi_gallery_3.webp"
    ]
  },
  {
    id: "amir-temur-xiyoboni",
    name: "Amir Temur xiyoboni va muzeyi",
    name_uz: "Amir Temur xiyoboni va Temuriylar tarixi davlat muzeyi",
    name_en: "Amir Timur Square & State Museum of Timurids History",
    name_it: "Piazza Amir Timur e Museo della Storia dei Timuridi",
    category: "Muzey",
    category_uz: "Muzey va Madaniy Maydon",
    category_en: "Museum & Monumental Square",
    category_it: "Museo e Piazza Monumentale",
    shortDesc_uz: "Poytaxtning markaziy yuragi: Sohibqiron haykali, moviy gumbazli Temuriylar muzeyi va mashhur O'zbekiston mehmonxonasi.",
    shortDesc_en: "The central core of Tashkent featuring the bronze equestrian statue of Tamerlane and the brilliant blue-domed Timurid Museum.",
    shortDesc_it: "Il centro nevralgico di Tashkent con la statua equestre di Tamerlano e il favoloso Museo Timuride a cupola blu.",
    history_uz: `Amir Temur xiyoboni — Toshkent shahrining bosh me'moriy markazi bo'lib, unga 1870-yilda asos solingan. Xiyobon markazida buyuk sarkarda va davlat arbobi, sohibqiron Amir Temurning ot ustidagi salobatli bronza haykali qad rostlagan. Haykal poydevorida uning mashhur shiori: "Kuch — adolatdadir" to'rt tilda bitilgan.

Xiyobon atrofida shahar ramziga aylangan bir necha muhim binolar joylashgan:
1. Temuriylar tarixi davlat muzeyi — 1996-yilda Amir Temurning 660 yilligi sharafiga barpo etilgan. Bino dumaloq shaklda, moviy koshinli nafis gumbaz va 3 qavatli hashamatli zallarga ega. Muzeyda Temuriylar davriga oid 5000 dan ziyod noyob eksponat, qurol-yarog'lar, tangalar va miniatyuralar namoyish etiladi.
2. "O'zbekiston" mehmonxonasi — sovet modernizmi uslubidagi betakror betonkash naqshli fasadi bilan mashhur afsonaviy bino.
3. Toshkent kurantlari — 1947-yilda o'rnatilgan mashhur soat minorasi.

Xiyobon bahor va yozda rang-barang favvoralari, qadimiy chinorlari va yorqin gullari bilan poytaxt aholisi hamda mehmonlarining eng sevimli sayr maskanidir.`,
    history_en: `Amir Timur Square is the grand focal hub of Tashkent, established in 1870. Radiating radial boulevards branch outward from its centerpiece: a heroic bronze equestrian statue of the 14th-century conqueror and Silk Road empire-builder Amir Timur (Tamerlane), engraved with his motto: "Power is in Justice".

Flanking the landscaped gardens are several key architectural landmarks:
1. State Museum of the History of the Timurids — opened in 1996 for Timur's 660th anniversary. Shaped like a circular ribbed palace crowned by an azure dome and a colossal chandelier, the museum displays over 5,000 precious artifacts, weaponry, illuminated manuscripts, and coins from the Timurid Renaissance.
2. Hotel Uzbekistan — a Soviet modernist icon boasting a distinctive sun-screening geometric concrete brise-soleil facade.
3. Tashkent Chimes (Kuranty) — twin clock towers dating from 1947 and 2009.

Shaded by century-old plane trees and flanked by illuminated fountains, it serves as the vibrant meeting point of cosmopolitan Tashkent.`,
    history_it: `La Piazza di Amir Timur è il fulcro monumentale e urbanistico di Tashkent, progettata nel 1870. Al centro troneggia la fiera statua equestre in bronzo del conquistatore Amir Timur (Tamerlano), con il celebre motto scolpito: "La Forza è nella Giustizia".

Intorno alla piazza alberata sorgono monumenti di grande rilievo:
1. Museo Statale della Storia dei Timuridi — inaugurato nel 1996, un capolavoro rotondo a tre piani sormontato da una brillante cupola turchese. Ospita oltre 5.000 reperti dell'epoca del Rinascimento Timuride, tra cui armi, mappamondi storici, monete e manoscritti miniati.
2. Hotel Uzbekistan — celebre capolavoro del modernismo sovietico con la caratteristica facciata a frangisole in cemento arabescato.
3. I Campanili di Tashkent (Kuranty) — iconiche torri dell'orologio cittadine.

Un'area verde lussureggiante perfetta per passeggiate e scatti fotografici iconici.`,
    location: "Toshkent shahri, Amir Temur xiyoboni (Metro: Amir Temur xiyoboni)",
    location_uz: "Toshkent shahri, Amir Temur xiyoboni (Metro: Amir Temur xiyoboni)",
    location_en: "Amir Timur Square, Tashkent (Metro: Amir Timur Xiyoboni)",
    location_it: "Piazza Amir Timur, Tashkent (Metro: Amir Timur Xiyoboni)",
    coordinates: { lat: 41.3111, lng: 69.2797 },
    latitude: 41.3111,
    longitude: 69.2797,
    mapUrl: "https://maps.google.com/?q=41.3111,69.2797",
    workHours: "Xiyobon: 24/7 ochiq; Muzey: 10:00 – 17:00 (Dushanba yopiq)",
    workHours_uz: "Xiyobon: 24/7 ochiq; Muzey: 10:00 – 17:00 (Dushanba yopiq)",
    workHours_en: "Square: 24/7; Museum: 10:00 AM – 05:00 PM (Closed Monday)",
    workHours_it: "Piazza: 24/7; Museo: 10:00 – 17:00 (Lunedì chiuso)",
    ticketPrice: "Xiyobon bepul, Muzey: 25,000 UZS (~2 €)",
    ticketPrice_uz: "Xiyobon bepul, Muzey: 25,000 UZS (~2 €)",
    ticketPrice_en: "Square Free, Museum: 25,000 UZS (~$2 USD)",
    ticketPrice_it: "Piazza Gratuita, Museo: 25.000 UZS (~2 €)",
    bestSeason_uz: "Kechki payt va bahor-kuz mavsumi",
    bestSeason_en: "Evenings and Spring-Autumn",
    bestSeason_it: "Ore serali e primavera-autunno",
    tags: ["Temuriylar", "Muzey", "Markaziy Xiyobon", "Amir Temur", "Fotolokatisiya"],
    image: "/uploads/places/amir_temur_xiyoboni_cover.webp",
    gallery: [
      "/uploads/places/amir_temur_xiyoboni_gallery_1.webp",
      "/uploads/places/amir_temur_xiyoboni_gallery_2.webp",
      "/uploads/places/amir_temur_xiyoboni_gallery_3.webp"
    ]
  },
  {
    id: "amaliy-sanat-muzeyi",
    name: "O‘zbekiston Amaliy san’at muzeyi",
    name_uz: "O‘zbekiston Amaliy san’at muzeyi",
    name_en: "State Museum of Applied Arts of Uzbekistan",
    name_it: "Museo Statale delle Arti Applicate dell'Uzbekistan",
    category: "Muzey",
    category_uz: "Muzey",
    category_en: "Art & Applied Crafts Museum",
    category_it: "Museo di Arti Applicate e Artigianato",
    shortDesc_uz: "XIX asr oxiridagi ertaknamo sharqona saroy, o'zbek ganchkorligi, suzani va zardo'zlik durdonalari xazinasi.",
    shortDesc_en: "A fairytale 19th-century oriental mansion filled with Uzbekistan's finest ceramics, wood carvings, and suzani textiles.",
    shortDesc_it: "Un palazzo orientale fiabesco di fine Ottocento che custodisce le massime eccellenze dell'artigianato uzbeko.",
    history_uz: `O‘zbekiston Amaliy san’at muzeyi — Toshkentning eng jozibador va nafis madaniy maskanlaridan biridir. Muzey binosining o'zi XIX asr oxirida chor Rossiyasi diplomati Aleksandr Polovtsov uchun sharqona uslubda qurilgan hashamatli qasr hisoblanadi.

Ushbu saroyni bezash uchun Samarqand, Buxoro, Toshkent, Xiva va Qo'qonning eng mohir xalq ustalari — ganchkor usta Toshpo'lat Arslonqulov, naqqosh usta Yoqubjon Raufov va yog'och o'ymakorlari jalb etilgan. Bino devorlari va shiftlaridagi nozik ganch o'ymakorligi, sirkor koshinlar va bo'yalgan naqshlar o'zbek bezak san'atining eng yuksak cho'qqisidir.

1937-yildan buyon muzey sifatida faoliyat yuritib kelayotgan mazkur xazinada 7 000 dan ortiq nodir eksponatlar saqlanadi:
- Buxoro va Samarqandning afsonaviy zardo'z to'nlari va zardo'zlik buyumlari;
- Ipak iplar bilan qo'lda tikilgan qadimiy suzanilar;
- Rishton va G'ijduvon kulolchilik maktablarining ko'k-feruza sopol idishlari;
- Qimmatbaho toshlar qadalgan milliy zargarlik buyumlari, pichoqlar va musiqa asboblari.

Muzey sayyohlarga o'zbek xalq amaliy san'atining butun rang-barangligini bitta qasrda his qilish imkonini beradi.`,
    history_en: `The State Museum of Applied Arts of Uzbekistan is housed in one of the capital's most enchanting mansions, commissioned in the late 19th century by diplomat Alexander Polovtsov.

Built in opulent traditional Islamic and Central Asian architectural styles, the mansion itself is an exhibit. Master craftspeople from Samarkand, Bukhara, Khiva, and Tashkent were summoned to embellish the residence with intricate hand-carved ganch (alabaster plasterwork), lacquered timber ceilings, and vibrant fresco wall panels.

Established as a museum in 1937, its collection boasts over 7,000 priceless handmade artifacts:
- Bukhara gold-embroidered robes (zardozi) and silk velvet caftans;
- Antique handmade Suzani tapestries depicting solar and pomegranate symbols;
- Famed turquoise ceramics from Rishtan and earthy glazed terracotta from Gijduvan;
- Chiseled brass teapots, filigree silver jewelry, musical instruments, and miniature paintings.

A jewel of ornamental mastery that provides an intimate look into centuries-old artisanal guilds.`,
    history_it: `Il Museo Statale delle Arti Applicate dell'Uzbekistan è ospitato in un palazzo sontuoso di fine Ottocento, originariamente commissionato dal diplomatico Alexander Polovtsov.

L'edificio è un'opera d'arte vivente: i più insigni maestri di Samarcanda, Bukhara, Khiva e Tashkent furono chiamati a decorare le sale con straordinari intagli in gesso alabastrino (ganch), soffitti in legno intagliato e dipinto a mano e stucchi moreschi policromi.

Convertito in museo nel 1937, ospita oltre 7.000 capolavori:
- I celebri Suzani in seta finemente ricamati a mano con motivi simbolici;
- Capi cerimoniali e abiti impreziositi dal ricamo in filo d'oro di Bukhara (zardoz);
- Ceramiche smaltate di Rishtan e Gijduvan;
- Raffinati gioielli in argento filigranato, pugnali cesellati e strumenti musicali tradizionali.

Una gemma imperdibile per gli amanti del design, dell'artigianato e della storia tessile.`,
    location: "Toshkent shahri, Yakkasaroy tumani, Rakatboshi ko'chasi 15",
    location_uz: "Toshkent shahri, Yakkasaroy tumani, Rakatboshi ko'chasi 15",
    location_en: "15 Rakatboshi Street, Yakkasaray District, Tashkent",
    location_it: "Via Rakatboshi 15, Distretto di Yakkasaray, Tashkent",
    coordinates: { lat: 41.2989, lng: 69.2575 },
    latitude: 41.2989,
    longitude: 69.2575,
    mapUrl: "https://maps.google.com/?q=41.2989,69.2575",
    workHours: "Har kuni: 09:00 – 18:00 (Tanaffussiz)",
    workHours_uz: "Har kuni: 09:00 – 18:00 (Tanaffussiz)",
    workHours_en: "Daily: 09:00 AM – 06:00 PM",
    workHours_it: "Ogni giorno: 09:00 – 18:00",
    ticketPrice: "25,000 UZS (~2 €)",
    ticketPrice_uz: "25,000 UZS (~2 €)",
    ticketPrice_en: "25,000 UZS (~$2 USD)",
    ticketPrice_it: "25.000 UZS (~2 €)",
    bestSeason_uz: "Butun yil davomida",
    bestSeason_en: "All year round",
    bestSeason_it: "Tutto l'anno",
    tags: ["Muzey", "Suzani", "Ganchkorlik", "Hunarmandchilik", "Zardo'zlik"],
    image: "/uploads/places/amaliy_sanat_muzeyi_cover.webp",
    gallery: [
      "/uploads/places/amaliy_sanat_muzeyi_gallery_1.webp",
      "/uploads/places/amaliy_sanat_muzeyi_gallery_2.webp",
      "/uploads/places/amaliy_sanat_muzeyi_gallery_3.webp"
    ]
  },
  {
    id: "magic-city",
    name: "Magic City madaniy-ko'ngilochar bog'i",
    name_uz: "Magic City madaniy-ko'ngilochar bog'i",
    name_en: "Magic City Family Entertainment Park",
    name_it: "Parco Culturale e Ricreativo Magic City",
    category: "Zamonaviy maskan",
    category_uz: "Zamonaviy maskan",
    category_en: "Modern Leisure & Entertainment",
    category_it: "Parco Moderno e Intrattenimento",
    shortDesc_uz: "Markaziy Osiyodagi eng yirik oilaviy ko'ngilochar park, dunyo poytaxtlari me'morchiligi va katta Okeanarium.",
    shortDesc_en: "Central Asia's largest family theme park, featuring world city architectural replicas and an underground oceanarium.",
    shortDesc_it: "Il più grande parco tematico dell'Asia Centrale con ricostruzioni di città mondiali e un grandioso acquario.",
    history_uz: `Magic City — 2021-yilda Toshkent markazida ochilgan, 21 gektar maydonni egallagan zamonaviy madaniy-ko'ngilochar xiyobondir. Bog' O'zbekistonning eng zamonaviy turizm yutuqlaridan biri bo'lib, xalqaro andozalar asosida barpo etilgan.

Bog'ning o'ziga xosligi uning tematik me'morchiligidadir: uning ko'chalari Parij, Rim, London, Berlin, Barselona va Samarqand me'moriy uslubidagi fasadlar bilan bezatilgan. Park markazida ulkan ertaklar qasri va har oqshom musiqali favvoralar va lazer shousi bo'lib o'tadigan sun'iy ko'l joylashgan.

Asosiy diqqatga sazovor joylari:
1. Magic Aquarium — Markaziy Osiyodagi eng katta okeanarium. Unda uzunligi 20 metrdan ortiq shisha tunnel, 100 dan ortiq dengiz jonzotlari va akulalar suzib yuradi.
2. Zamonaviy kinoteatr va bouling markazi;
3. Dunyo va o'zbek milliy oshxonasi restoranlari;
4. Bolalar uchun attraksionlar va suvenir do'konlari.

Bu yer kechki payt yorug'lik chiroqlari yog'dusi bilan sayyohlar va oilalar uchun poytaxtning eng sevimli hordiq maskanlaridan biriga aylanadi.`,
    history_en: `Magic City is a state-of-the-art 21-hectare family entertainment park inaugurated in 2021 in downtown Tashkent, representing Uzbekistan's booming leisure sector.

The park's signature appeal lies in its stylized architectural streetscapes replicating world-famous cityscapes—including Paris, Rome, London, Berlin, Barcelona, and historical Samarkand. At its center stands a fairytale Bavarian-style castle and a large artificial lake featuring evening musical fountain and laser light shows.

Key highlights include:
1. Magic Aquarium — Central Asia's premier public oceanarium featuring a 20-meter walk-through acrylic tunnel home to hundreds of marine species, coral reefs, and sharks.
2. Laser-lit amphitheater and family rollercoasters;
3. Upscale dining pavilions serving both authentic Uzbek and world cuisine;
4. Pedestrian boulevards ideal for family strolls and evening photography.`,
    history_it: `Magic City è uno scenografico parco di intrattenimento di 21 ettari aperto nel 2021 a Tashkent, che unisce attrazioni per famiglie e architettura internazionale.

Il parco è concepito come un viaggio tra le capitali del mondo: le vie pedonali riproducono con eleganza le facciate di Roma, Parigi, Londra, Berlino e Samarcanda. Al centro svetta un castello fiabesco affacciato su un lago con spettacolari fontane danzanti serali.

Punti di forza:
1. Magic Aquarium — il più grande oceanario dell'Asia Centrale con un tunnel subacqueo lungo 20 metri e squali tropicali;
2. Ristoranti gourmet che offrono piatti tradizionali uzbeki e cucina europea;
3. Cinema multisala, attrazioni per bambini e boutique;
4. Atmosfera vivace illuminata da centinaia di installazioni luminose serali.`,
    location: "Toshkent shahri, Chilonzor tumani, Bobur ko'chasi 174",
    location_uz: "Toshkent shahri, Chilonzor tumani, Bobur ko'chasi 174",
    location_en: "174 Babur Street, Chilanzar District, Tashkent",
    location_it: "Via Babur 174, Distretto di Chilanzar, Tashkent",
    coordinates: { lat: 41.3039, lng: 69.2458 },
    latitude: 41.3039,
    longitude: 69.2458,
    mapUrl: "https://maps.google.com/?q=41.3039,69.2458",
    workHours: "Har kuni: 10:00 – 23:00",
    workHours_uz: "Har kuni: 10:00 – 23:00",
    workHours_en: "Daily: 10:00 AM – 11:00 PM",
    workHours_it: "Ogni giorno: 10:00 – 23:00",
    ticketPrice: "Parkka kirish bepul, Akvarium: 100,000 UZS (~8 €)",
    ticketPrice_uz: "Parkka kirish bepul, Okeanarium: 100,000 UZS (~8 €)",
    ticketPrice_en: "Park Entry Free, Oceanarium: 100,000 UZS (~$8 USD)",
    ticketPrice_it: "Ingresso al Parco gratuito, Acquario: 100.000 UZS (~8 €)",
    bestSeason_uz: "Kechki payt va dam olish kunlari",
    bestSeason_en: "Evening hours and weekends",
    bestSeason_it: "Ore serali e fine settimana",
    tags: ["Okeanarium", "Oila", "Zamonaviy", "Favvoralar", "Ko'ngilochar"],
    image: "/uploads/places/magic_city_cover.webp",
    gallery: [
      "/uploads/places/magic_city_gallery_1.webp",
      "/uploads/places/magic_city_gallery_2.webp",
      "/uploads/places/magic_city_gallery_3.webp"
    ]
  },
  {
    id: "chimyon-chorvoq",
    name: "Katta Chimyon va Chorvoq suv ombori",
    name_uz: "Katta Chimyon va Chorvoq suv ombori (Toshkent viloyati)",
    name_en: "Greater Chimgan & Charvak Reservoir (Tashkent Region)",
    name_it: "Monte Chimgan e Bacino di Charvak (Regione di Tashkent)",
    category: "Tabiat",
    category_uz: "Tabiat va Tog' Kurorti",
    category_en: "Nature & Mountain Resort",
    category_it: "Natura e Stazione Montana",
    shortDesc_uz: "Tyanshan tog'larining moviy marvaridi: yozda suv sporti va sohil hordig'i, qishda zamonaviy Amirsoy chang'i kurorti.",
    shortDesc_en: "The turquoise jewel of the Tian Shan mountains: alpine hiking, watersports at Charvak, and world-class skiing at Amirsoy.",
    shortDesc_it: "Il gioiello turchese delle montagne del Tian Shan: sport acquatici al lago Charvak e sci invernale ad Amirsoy.",
    history_uz: `Katta Chimyon tog'lari va Chorvoq suv ombori — Toshkent shahridan 80–90 km shimoli-sharqda, Ugom-Chotqol milliy bog'i (G'arbiy Tyanshan) hududida joylashgan O'zbekistonning bosh tog' va ekoturizm maskanidir. Bu hudud UNESCO Butunjahon tabiiy merosi ro'yxatiga kiritilgan.

Chorvoq suv ombori 1970-yilda Chirchiq daryosi havzasida barpo etilgan bo'lib, uning tiniq feruza suvlari dengiz sathidan 900 metr balandlikda tog'lar bilan o'ralgan. Yoz mavsumida bu yerda suv motosikllari, katerlar, paragliding (paraplanda uchish) va plyaj dam olish zonalari qiziydi.

Katta Chimyon cho'qqisi (3309 metr) alpinistlar va sayyohlar uchun mashhur manzil bo'lib, toza tog' havosi va archazorlari bilan mashhur. So'nggi yillarda bu hududda zamonaviy xalqaro standartdagi kurortlar qad rostladi:
1. Amirsoy tog' kurorti — dunyoning yetakchi POMA kompaniyasi tomonidan qurilgan zamonaviy gondolali kanat yo'llari, chang'i trassalari va alp chaletlari;
2. Chimyon kanat yo'li va Beldersoy soylari;
3. Chorvoq bo'yidagi qadimiy petrogliflar (Xo'jakent qoyatosh rasmlari).

Ushbu maskan butun yil davomida faol sayyohlar va tabiat shaydolari uchun Toshkent viloyatining eng go'zal burchagidir.`,
    history_en: `Greater Chimgan and the Charvak Reservoir, nestled within the Ugam-Chatkal National Park (Western Tian Shan, a UNESCO World Natural Heritage site), constitute Uzbekistan's premier mountain resort destination just 85 km from Tashkent.

Formed in 1970 along the Chirchik River, the Charvak Reservoir is renowned for its crystalline turquoise waters ringed by sheer mountain peaks at 900m altitude. During summer months, it transforms into an alpine beach paradise offering jet skiing, sailing, paragliding from panoramic ridges, and lakeside chalets.

Towering above is Greater Chimgan Peak (3,309 m / 10,856 ft), famed for trekking, alpine meadows, and fresh juniper scents. The region has gained global renown with state-of-the-art developments:
1. Amirsoy Mountain Resort — equipped with high-speed gondola lifts by POMA, world-class ski slopes, luxury alpine chalets, and four-season restaurants;
2. Beldersay Gorge and chairlifts;
3. Ancient petroglyphs at Khojikent depicting ancient Silk Road wildlife.

It delivers a breathtaking mountain escape in every season.`,
    history_it: `Il Monte Chimgan e il Bacino di Charvak, situati nel Parco Nazionale Ugam-Chatkal (Tian Shan Occidentale, Patrimonio Mondiale Naturale UNESCO), rappresentano la principale destinazione montana ed eco-turistica dell'Uzbekistan, a 85 km da Tashkent.

Creato nel 1970 alla confluenza del fiume Chirchik, il lago di Charvak incanta con le sue acque color turchese brillante incastonate tra montagne maestose a 900 metri di quota. In estate è il centro ideale per sport nautici, parapendio panoramico e relax sul lago.

Sullo sfondo domina il Monte Chimgan (3.309 metri), amato da escursionisti e amanti del trekking alpino. La zona vanta infrastrutture di livello internazionale:
1. Amirsoy Mountain Resort — moderno comprensorio sciistico con telecabine POMA, piste da sci da discesa e chalet alpini aperti tutto l'anno;
2. Gola di Beldersay e seggiovie panoramiche;
3. Grotte preistoriche e petroglifi di Khojikent.

Una meta montana spettacolare sia d'estate che durante l'inverno innevato.`,
    location: "Toshkent viloyati, Bo'stonliq tumani (Toshkentdan 85 km)",
    location_uz: "Toshkent viloyati, Bo'stonliq tumani (Toshkentdan 85 km)",
    location_en: "Bostanlyk District, Tashkent Region (85 km from Tashkent)",
    location_it: "Distretto di Bostanlyk, Regione di Tashkent (85 km da Tashkent)",
    coordinates: { lat: 41.6212, lng: 70.0275 },
    latitude: 41.6212,
    longitude: 70.0275,
    mapUrl: "https://maps.google.com/?q=41.6212,70.0275",
    workHours: "24/7 (Kurort va kanat yo'llari: 09:00 – 17:30)",
    workHours_uz: "24/7 (Kurort va kanat yo'llari: 09:00 – 17:30)",
    workHours_en: "24/7 (Cable cars & resorts: 09:00 AM – 05:30 PM)",
    workHours_it: "24/7 (Impianti di risalita: 09:00 – 17:30)",
    ticketPrice: "Hudud erkin, Amirsoy kanat yo'li: 120,000 UZS (~9 €)",
    ticketPrice_uz: "Hudud erkin, Amirsoy kanat yo'li: 120,000 UZS (~9 €)",
    ticketPrice_en: "Area Free, Amirsoy Gondola: 120,000 UZS (~$9.5 USD)",
    ticketPrice_it: "Area libera, Cabinovia Amirsoy: 120.000 UZS (~9 €)",
    bestSeason_uz: "Yozda suv hordig'i (iyun-avgust), Qishda chang'i (dekabr-mart)",
    bestSeason_en: "Summer lake (June-August), Winter skiing (December-March)",
    bestSeason_it: "Estate per il lago (giugno-agosto), Inverno per lo sci (dicembre-marzo)",
    tags: ["Tyanshan", "Chorvoq", "Amirsoy", "Chang'i", "Tog'", "Ekoturizm"],
    image: "/uploads/places/chimyon_chorvoq_cover.webp",
    gallery: [
      "/uploads/places/chimyon_chorvoq_gallery_1.webp",
      "/uploads/places/chimyon_chorvoq_gallery_2.webp",
      "/uploads/places/chimyon_chorvoq_gallery_3.webp"
    ]
  },
  {
    id: "yangi-ozbekiston-bogi",
    name: "Yangi O‘zbekiston bog‘i",
    name_uz: "Yangi O‘zbekiston bog‘i",
    name_en: "New Uzbekistan Park",
    name_it: "Parco Nuovo Uzbekistan",
    category: "Zamonaviy maskan",
    category_uz: "Zamonaviy Park va Yodgorlik",
    category_en: "Modern Landscape Park",
    category_it: "Parco Paesaggistico Moderno",
    shortDesc_uz: "O'zbekistonning 104 gektarlik eng yirik zamonaviy bog'i, 60 metrli Mustaqillik monumenti va Humo qushi stela ansambli.",
    shortDesc_en: "The nation's grandest modern park covering 104 hectares, anchored by the 60-meter Independence Monument.",
    shortDesc_it: "Il più grande parco moderno del paese su 104 ettari, dominato dal Monumento all'Indipendenza alto 60 metri.",
    history_uz: `Yangi O‘zbekiston bog‘i — O'zbekiston Respublikasi davlat mustaqilligining 30 yilligi munosabati bilan 2021-yil 31-avgust kuni tantanali ravishda ochilgan, Toshkent sharqiy darvozasida joylashgan eng yirik zamonaviy landshaft bog'idir. Bog'ning umumiy maydoni 104 gektarni tashkil etadi.

Yuqoridan qaraganda bog' daraxtning beshta shoxchasi shaklida loyihalashtirilgan bo'lib, bu Harakatlar strategiyasining beshta ustuvor yo'nalishini ramziy ifodalaydi. Bog' markazida 60 metr balandlikdagi muazzam "Mustaqillik monumenti" qad rostlagan. Monument poydevorida O'zbekistonning 3000 yillik boy tarixi — qadimgi sivilizatsiyalar, Sohibqiron Amir Temur va allomalar davridan tortib bugungi kungacha bo'lgan voqealar aks ettirilgan barelyeflar ishlangan. Uning cho'qqisida esa tinchlik va erkinlik timsoli bo'lgan afsonaviy Humo qushi porlab turadi.

Bog' hududida:
- 5 000 o'rinli ochiq amfiteatr;
- Musiqali raqs favvoralari va sun'iy ko'l;
- 235 turdagi 10 mingdan ziyod manzarali daraxt va gullar;
- Velosiped, elektrosamokat yo'laklari va oilaviy kafelar joylashgan.

Bu yer yangi O'zbekistonning me'moriy qudrati va yashil shahar konsepsiyasini ko'rsatuvchi muhim maydondir.`,
    history_en: `New Uzbekistan Park was inaugurated on August 31, 2021, to commemorate the 30th anniversary of Uzbekistan's independence. Spanning 104 hectares along the eastern gateway to Tashkent, it is the country's most expansive contemporary landscaped park.

Seen from above, the park is shaped like the five spreading branches of an oak tree, symbolizing national reform pillars. At its epicenter towers the 60-meter-tall Independence Monument (Stela), crowned by the mythical Simurgh/Humo bird in flight. Surrounding the monument is a massive bronze sculptural bas-relief tracing 3,000 years of Uzbek history—from ancient Sogdia and the Silk Road through the Timurid Renaissance to the modern day.

The park features:
- A 5,000-seat outdoor amphitheater for state concerts and festivals;
- An artificial lake with kinetic singing fountains;
- Over 10,000 ornamental trees and botanical gardens;
- Dedicated bicycle trails, running paths, and electric shuttle transport.

It serves as the definitive symbol of modern Uzbekistan's architectural vision.`,
    history_it: `Il Parco Nuovo Uzbekistan è stato inaugurato il 31 agosto 2021 per celebrare il 30° anniversario dell'indipendenza nazionale. Con i suoi 104 ettari, è il parco contemporaneo più vasto del paese.

Visto dall'alto, il layout del parco evoca i cinque rami di un maestoso albero. Al centro si erge il Monumento all'Indipendenza, una stele monumentale alta 60 metri sormontata dal leggendario uccello Humo, simbolo di pace e rinascita. Alla base si sviluppa un grande fregio scultoreo in bronzo che narra 3.000 anni di civiltà dell'Asia Centrale.

Attrazioni principali:
1. Anfiteatro monumentale da 5.000 posti per spettacoli;
2. Lago artificiale con fontane danzanti musicali;
3. Piste ciclabili alberate e noleggio veicoli ecologici;
4. Oltre 10.000 alberi rari e giardini fioriti.

Un'opera urbanistica contemporanea che affascina visitatori internazionali e residenti.`,
    location: "Toshkent shahri, Mirzo Ulug‘bek tumani, Yangi O‘zbekiston shoh ko'chasi",
    location_uz: "Toshkent shahri, Mirzo Ulug‘bek tumani, Yangi O‘zbekiston shoh ko'chasi",
    location_en: "Yangi O'zbekiston Avenue, Mirzo Ulugbek District, Tashkent",
    location_it: "Corso Yangi O'zbekiston, Distretto di Mirzo Ulugbek, Tashkent",
    coordinates: { lat: 41.3411, lng: 69.4125 },
    latitude: 41.3411,
    longitude: 69.4125,
    mapUrl: "https://maps.google.com/?q=41.3411,69.4125",
    workHours: "Har kuni: 06:00 – 23:00",
    workHours_uz: "Har kuni: 06:00 – 23:00",
    workHours_en: "Daily: 06:00 AM – 11:00 PM",
    workHours_it: "Ogni giorno: 06:00 – 23:00",
    ticketPrice: "Bepul kirish",
    ticketPrice_uz: "Bepul kirish",
    ticketPrice_en: "Free admission",
    ticketPrice_it: "Ingresso gratuito",
    bestSeason_uz: "Kechki salqinda va bahor-kuz",
    bestSeason_en: "Evenings and Spring-Autumn",
    bestSeason_it: "Ore serali e primavera-autunno",
    tags: ["Yangi O'zbekiston", "Monument", "Park", "Amfiteatr", "Zamonaviy"],
    image: "/uploads/places/yangi_ozbekiston_bogi_cover.webp",
    gallery: [
      "/uploads/places/yangi_ozbekiston_bogi_gallery_1.webp",
      "/uploads/places/yangi_ozbekiston_bogi_gallery_2.webp",
      "/uploads/places/yangi_ozbekiston_bogi_gallery_3.webp"
    ]
  },
  {
    id: "zangiota-majmuasi",
    name: "Zangiota me'moriy majmuasi",
    name_uz: "Zangiota me'moriy majmuasi (Toshkent viloyati)",
    name_en: "Zangiata Complex (Tashkent Region)",
    name_it: "Complesso Architettonico di Zangiata (Regione di Tashkent)",
    category: "Ziyoratgoh",
    category_uz: "Ziyoratgoh va Tarixiy Obida",
    category_en: "Sacred Pilgrimage Site & Heritage",
    category_it: "Santuario Storico e Pellegrinaggio",
    shortDesc_uz: "Amir Temur davrida barpo etilgan muqaddas ziyoratgoh, so'fiy avliyo Zangiota va Anbar bibi maqbaralari.",
    shortDesc_en: "A revered 14th-century Sufi pilgrimage complex initiated by Amir Timur, dedicated to the sage Zangiata and Anbar Bibi.",
    shortDesc_it: "Un venerato santuario sufi del XIV secolo voluto da Tamerlano, dedicato al mistico Zangiata e alla consorte Anbar Bibi.",
    history_uz: `Zangiota me'moriy majmuasi — Toshkent viloyatining Zangiota tumanida (poytaxtdan 15 km masofada) joylashgan, XIV–XX asrlarda shakllangan ulkan muqaddas ziyoratgoh va tarixiy obidadir. U buyuk so'fiy alloma, Ahmad Yassaviyning shogirdi Oyxo'ja ibn Tojxo'ja (xalq orasida "Zangiota" — qoramtir yuzli ota) nomi bilan atalgan.

Tarixiy manbalarga ko'ra, majmua qurilishini XIV asr oxirida Sohibqiron Amir Temur boshlagan, keyinchalik uning nabirasi Mirzo Ulug'bek davrida davom ettirilgan. Rivoyatlarga ko'ra, Amir Temur Yassaviy maqbarasini qurayotganda kutilmagan to'siqlarga uchragan va tushida avval Zangiota qabrini obod qilish ishorasi berilgan.

Majmua tarkibi:
1. Zangiota maqbarasi — moviy gumbazli, ichida o'yilgan oq marmar toshbitigi bor tarixiy sag'ana;
2. Anbar bibi maqbarasi — Zangiotaning oqila rafiqasi (Sulaymon Boqirg'oniyning bevasi bo'lgan);
3. XVIII–XIX asrlarda qo'shilgan jome masjidi, madrasa va 1914–1915 yillarda usta Xo'ja Muhammad tomonidan qurilgan nafis minora;
4. Tarixiy hovuz va soyabonli bog'.

Zangiota ziyoratgohi asrlar davomida o'zbek xalqining eng muqaddas ziyorat maskanlaridan biri bo'lib, bu yerda ma'naviy xotirjamlik va an'anaviy me'morchilik uyg'unligini his qilish mumkin.`,
    history_en: `The Zangiata Complex is one of Central Asia's most revered Sufi pilgrimage destinations, located in the Tashkent Region just 15 km southwest of the capital. It honors the 13th-century Sufi master Ay-Khoja ibn Taj-Khoja, universally beloved as Zangiata ("Dark Father", a spiritual disciple of Khoja Ahmad Yasawi).

Construction began in the late 14th century by decree of conqueror Amir Timur (Tamerlane) and was expanded in the 15th century by his astronomer grandson Mirzo Ulugh Beg. Legend recalls that while Timur attempted to erect the mausoleum of Yasawi in Turkestan, walls collapsed repeatedly until he first built a shrine for Yasawi's devoted pupil Zangiata.

Key monuments within the complex:
1. Mausoleum of Zangiata — crowned with a turquoise ribbed dome housing a marvelously sculpted white marble sarcophagus;
2. Mausoleum of Anbar Bibi — dedicated to Zangiata's wise wife, a legendary figure in regional folklore;
3. Historic Madrasah, minaret built in 1914 by master craftsman Khoja Muhammad, and colonnaded Friday mosque;
4. A shaded central ablution pond (hauz) surrounded by centuries-old willows.`,
    history_it: `Il Complesso di Zangiata è uno dei luoghi di pellegrinaggio sufi più venerati dell'Asia Centrale, situato a circa 15 km a sud-ovest di Tashkent. È dedicato a Sheikh Ay-Khoja ibn Taj-Khoja (noto come Zangiata), eminente discepolo del grande maestro Khoja Ahmad Yasawi.

La costruzione fu ordinata nel XIV secolo dal condottiero Amir Timur (Tamerlano) e arricchita nel XV secolo dal nipote Mirzo Ulugh Beg. Secondo la tradizione popolare, la costruzione del santuario di Yasawi a Turkestan poté compiersi solo dopo che Tamerlano ebbe eretto il mausoleo per il suo allievo Zangiata.

Elementi del complesso:
1. Mausoleo di Zangiata — con splendida cupola azzurra e un cenotafio in marmo bianco finemente scolpito;
2. Mausoleo di Anbar Bibi — consorte del santo e figura spirituale femminile di grande devozione;
3. Madrasa storica, minareto del 1914 e moschea con soffitti lignei a intarsio;
4. Laghetto sacro (hauz) ombreggiato da alberi secolari.`,
    location: "Toshkent viloyati, Zangiota tumani, Zangiota qishlog'i",
    location_uz: "Toshkent viloyati, Zangiota tumani, Zangiota qishlog'i",
    location_en: "Zangiata Village, Zangiata District, Tashkent Region",
    location_it: "Villaggio di Zangiata, Distretto di Zangiata, Regione di Tashkent",
    coordinates: { lat: 41.2067, lng: 69.1558 },
    latitude: 41.2067,
    longitude: 69.1558,
    mapUrl: "https://maps.google.com/?q=41.2067,69.1558",
    workHours: "Har kuni: 08:00 – 20:00",
    workHours_uz: "Har kuni: 08:00 – 20:00",
    workHours_en: "Daily: 08:00 AM – 08:00 PM",
    workHours_it: "Ogni giorno: 08:00 – 20:00",
    ticketPrice: "Bepul ziyorat",
    ticketPrice_uz: "Bepul ziyorat",
    ticketPrice_en: "Free admission",
    ticketPrice_it: "Ingresso gratuito",
    bestSeason_uz: "Butun yil davomida",
    bestSeason_en: "All year round",
    bestSeason_it: "Tutto l'anno",
    tags: ["Zangiota", "Ziyorat", "Temuriylar", "Sufiylik", "Toshkent Viloyati"],
    image: "/uploads/places/zangiota_majmuasi_cover.webp",
    gallery: [
      "/uploads/places/zangiota_majmuasi_gallery_1.webp",
      "/uploads/places/zangiota_majmuasi_gallery_2.webp",
      "/uploads/places/zangiota_majmuasi_gallery_3.webp"
    ]
  }
];

// Read db.json, update toshkent region famousPlaces and metadata
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let toshkentRegion = db.regions.find(r => r.id === 'toshkent');
if (!toshkentRegion) {
  toshkentRegion = { id: 'toshkent' };
  db.regions.push(toshkentRegion);
}

// Enhance Toshkent region metadata in 3 languages
toshkentRegion.name = "Toshkent shahri va viloyati";
toshkentRegion.name_uz = "Toshkent shahri va viloyati";
toshkentRegion.name_en = "Tashkent City & Region";
toshkentRegion.name_it = "Città e Regione di Tashkent";

toshkentRegion.slogan = "Qadimiy Sharq javohiri va zamonaviy O'zbekistonning poytaxti";
toshkentRegion.slogan_uz = "Qadimiy Sharq javohiri va zamonaviy O'zbekistonning gavjum poytaxti";
toshkentRegion.slogan_en = "The jewel of the ancient Silk Road and vibrant modern capital of Uzbekistan";
toshkentRegion.slogan_it = "Il gioiello dell'antica Via della Seta e vibrante capitale moderna dell'Uzbekistan";

toshkentRegion.famousPlaces = tashkentPlaces;

// Write updated db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`✅ Successfully updated Toshkent with ${tashkentPlaces.length} premium destinations in db.json!`);
