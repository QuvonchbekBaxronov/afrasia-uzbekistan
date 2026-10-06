import { useState } from 'react';
import { 
  Utensils, Music, Sparkles, Clock, Flame, MapPin, 
  ChevronRight, X, Play, Volume2, Info, Check, Award, ExternalLink
} from 'lucide-react';

// Authentic Uzbek Gastronomy Database (6 balanced items for 3-col grid)
export const nationalDishes = [
  {
    id: "toshkent-plov",
    name_uz: "Toshkent To'y Oshi (Palov / Osh)",
    name_en: "Authentic Uzbek Palov (Plov / Osh)",
    name_it: "Plov Tradizionale Uzbeko (Palov della Via della Seta)",
    region_uz: "Toshkent & Samarqand",
    region_en: "Tashkent & Samarkand",
    region_it: "Tashkent e Samarcanda",
    category: "main",
    cookTime: "1 ora (1 hour)",
    prepTime: "20 min",
    servings_uz: "6 kishilik",
    servings_en: "6 servings",
    servings_it: "6 porzioni",
    calories: "550 kcal / por",
    image: "/uploads/cuisine/uzbek_plov.jpg",
    sourceUrl: "https://arbuz.com/recipes/uzbek-plov/",
    history_uz: "Palov — o'zbek mehmondo'stligining shohi va UNESCO Insoniyatning nomoddiy madaniy merosi ro'yxatiga kiritilgan shohona taom. Zamonaviy bosimli qozon (skorovarka) yoki an'anaviy cho'yan qozonda tayyorlanganda, go'sht ziravorlar bilan birga erib ketgudek mayin bo'lib pishadi.",
    history_en: "Uzbek Palov (a.k.a. Plov, Pilav, Osh) is the crown jewel of Silk Road cuisine and UNESCO Intangible Cultural Heritage. Adapted for both modern pressure cookers and traditional heavy Kazans, it yields tender melt-in-your-mouth meat, golden carrots, and perfectly fluffy aromatic rice.",
    history_it: "Patrimonio Immateriale UNESCO, il Plov è il re incontrastato dell'ospitalità uzbeka. Cotto sia nel tradizionale calderone Kazan che in pentola a pressione, regala una carne incredibilmente tenera, carote dorate e riso profumato cotto a vapore perfetto.",
    story_uz: "Dunyoning qayerida bo'lmang, o'zbek palovining muhtasham iforini unuta olmaysiz. O'zbekistonning har bir viloyatida palovning o'ziga xos retsepti mavjud: Toshkent to'y oshi, Samarqand palovi, Farg'ona qora oshi, Buxoro oshi sofi. Chet elda yoki uyda tayyorlashda bosimli qozon (pressure cooker) usuli go'shtni aqlbovar qilmas darajada mayin qiladi va vaqtni sezilarli tejaydi. Asosiy qoidalar o'zgarmasdir: sara go'sht, sarig' va qizil sabzi, xushbo'y zira va to'g'ri tanlangan uzun donador guruch.",
    story_en: "For those who appreciate authentic Silk Road flavors, this recipe presents an exceptional, time-tested method of making Uzbek Palov (a.k.a. Uzbek Plov, Pilav, Pulav, Osh). The meat becomes extraordinarily tender when simmered with fragrant spices, while saving valuable cooking time. Every region in Uzbekistan has its own treasured version. Whether you customize with chickpeas, garlic, or sweet raisins, the foundational harmony of caramelized onions, sweet julienned carrots, aromatic cumin, and separate rice grains remains legendary.",
    story_it: "In tutto il mondo non esiste piatto che rappresenti l'Uzbekistan come il Palov (o Plov). Ogni regione della Via della Seta custodisce la propria variante storica. Questo metodo garantisce una carne succosa e tenerissima grazie alla cottura iniziale degli aromi e delle spezie, seguita dalla lenta vaporizzazione (damlash) di riso, carote dolci a julienne, ceci e una testa d'aglio intera caramellata.",
    riceGuide_uz: "GURUCH — palovning eng muhim yuragi hisoblanadi. An'anaviy Devzira, Lazer yoki Alanga guruchidan tashqari, xalqaro oshxonalarda 'Saleem Caravan Super Golden Basmati' (uzun donador, xushbo'y, yopishmaydigan), 'Jasmine', hamda kraxmalini 30 daqiqa iliq suvda ivitib chiqarilgan Italiyaning 'Arborio' yoki Turkiyaning 'Baldo' guruchlari juda yaxshi natija beradi. Muhim qoida: qozonga guruch solinganda suv sathi guruchdan kamida 2-2.5 sm (1 dyuym) baland bo'lishi shart.",
    riceGuide_en: "RICE is the foundation of any great Palov. While traditional Uzbek varieties like Devzira, Lazer, and Alanga are world-famous, international alternatives like 'Saleem Caravan Super Golden Basmati' (slender, aromatic, non-glutinous), Middle Eastern Basmati, or Jasmine work wonderfully. Italian 'Arborio' or Turkish 'Baldo' also yield a rich palov when soaked in warm water for at least 30 minutes to release surface starch. Golden rule: ensure liquid level is at least 1 inch above the rice level before steaming.",
    riceGuide_it: "IL RISO è l'anima del Plov. Oltre ai nobili risi uzbeki Devzira e Alanga, si ottengono risultati straordinari con il Basmati dorato a chicco lungo, il riso Jasmine o il pregiato riso italiano 'Arborio' e turco 'Baldo' (precedentemente ammollato per 30 minuti in acqua tiepida per scaricare l'eccesso di amido). Regola fondamentale: il livello del brodo deve coprire il riso di circa 2-2.5 cm prima della fase di vaporizzazione.",
    carrotsGuide_uz: "SABZI: Toshkent to'y oshi retsepti an'anaviy sariq sabzini talab qiladi. Agar sariq sabzi topilmasa, shirin qizil/to'q sariq sabzi ham ajoyib natija beradi (qizil sabzi sariq sabziga qaraganda biroz tezroq pishadi). Sabzini pichoqda bir tekis somoncha qilib to'g'rash palovning donador bo'lishini ta'minlaydi.",
    carrotsGuide_en: "CARROTS: Authentic Tashkent plov traditionally calls for yellow carrots. If yellow carrots are unavailable locally, sweet orange carrots work delightfully (orange carrots cook slightly faster). Slicing them uniformly into matchsticks by hand preserves their shape and releases sweet natural juices into the zirvak.",
    carrotsGuide_it: "CAROTE: La ricetta di Tashkent richiede tradizionalmente carote gialle centroasiatiche. Se non disponibili, le carote dolci arancioni offrono un risultato eccellente (cuociono leggermente più in fretta). Tagliarle a julienne uniforme a mano assicura una cottura perfetta e rilascia naturale dolcezza nel brodo zirvak.",
    cookerGuide_uz: "QOZON VA SKOROVERKA: Skorovarka (bosimli qozon / pressure cooker) go'shtni aqlbovar qilmas darajada mayin va erib ketadigan qiladi hamda vaqtni bir necha barobar tejaydi. An'anaviy og'ir cho'yan qozon (Kazan) esa asriy uslubda asta-sekin qovurish va qizartirish imkonini beradi. Har ikki usulda ham taom ajoyib chiqadi!",
    cookerGuide_en: "PRESSURE COOKER VS. KAZAN: A pressure cooker braises meat to melt-in-your-mouth tenderness while saving immense cooking time, making it a beloved secret for diaspora cooks in the US & Europe. A traditional heavy cast-iron Kazan remains the timeless Silk Road classic. Both methods achieve sensational results!",
    cookerGuide_it: "PENTOLA A PRESSIONE O KAZAN: La pentola a pressione rende qualsiasi carne tenerissima e succulenta risparmiando tempo prezioso, tecnica molto diffusa tra le famiglie all'estero. Il tradizionale calderone Kazan in ghisa pesante resta il classico millenario della Via della Seta. Entrambi i metodi garantiscono un risultato superbo!",
    aromaticsGuide_uz: "NO'XAT VA BUTUN SARIMSOQ: Agar no'xat ishlatmoqchi bo'lsangiz, 0.5 stakan no'xatni 5 soat oldin (yoki tuni bilan) iliq suvga ivitib qo'ying. Sarimsoq esa butun bosh holida yaxshilab yuviladi, tashqi quruq po'stlog'i yengil tozalanadi (bo'laklarga ajratilmaydi) va guruch ustiga botirib dimlanadi.",
    aromaticsGuide_en: "CHICKPEAS & WHOLE GARLIC: If using chickpeas, soak 0.5 cup in lukewarm water for 5 hours (or overnight). For garlic, use a whole intact bulb, wash well, and peel away only dry outer papery layers without breaking the bulb. Nestling the whole bulb deep into the steaming rice infuses an irresistible aroma.",
    aromaticsGuide_it: "CECI E TESTA D'AGLIO INTERA: Per i ceci, metterli in ammollo in acqua tiepida per almeno 5 ore (o tutta la notte). Per l'aglio, usare una testa intera ben lavata, rimuovendo solo le prime pellicole esterne senza rompere gli spicchi. Adagiata al centro del riso, rilascerà un profumo dolce e aromatico straordinario durante la cottura.",
    secret_uz: "Oshpazning sirlari: 1) Go'shtni baland olovda qizartirib qovurish va piyozni tillarang qilish; 2) Sabzini solgach aralashtirmasdan qatlam qilib terish; 3) Guruch solingach suv tortilgach markazga 'Gumbaz' (dome) qilib uyish va ustiga butun zira sepib, olovni eng pastga qo'yib 10-15 daqiqa mahkam dimlash.",
    secret_en: "Master Chef Secrets: 1) Brown the meat deeply on high heat before caramelizing onions; 2) Layer julienned carrots without stirring to preserve clear zirvak broth; 3) Form a central dome of rice once liquid is absorbed, sprinkle whole cumin seeds, and seal tightly on low heat for 10-15 minutes of gentle steaming (damlash).",
    secret_it: "I segreti dello chef: 1) Rosolare la carne ad alta temperatura prima di caramellare le cipolle dorate; 2) Adagiare le carote a strato sopra la carne senza mescolare; 3) Raccogliere il riso a cupola al centro, cospargere di semi di cumino interi e sigillare con il coperchio per 10-15 minuti di cottura a vapore lento (damlash).",
    ingredients_uz: [
      "700g - 1kg sarxil qo'y yoki mol go'shti (2x2 sm bo'laklangan)",
      "2 dona o'rtacha piyoz (yarim halqa qilib to'g'ralgan)",
      "5 dona o'rtacha sabzi (somoncha qilib to'g'ralgan)",
      "3.5 stakan sifatli guruch (Basmati / Devzira / Alanga - ~700g)",
      "1 choy qoshiq tuyilgan zira (ground cumin)",
      "0.5 choy qoshiq butun zira (whole cumin seeds)",
      "1 choy qoshiq maydalangan qora murch",
      "3 choy qoshiq osh tuzi",
      "6.5 stakan qaynoq suv (zirvak uchun)",
      "200 ml o'simlik yoki paxta yog'i",
      "0.5 stakan ivitilgan no'xat (5 soat oldin ivitilgan, ixtiyoriy)",
      "1 dona butun bosh sarimsoq (tozalangan, ixtiyoriy)"
    ],
    ingredients_en: [
      "1.5 - 2 lbs (700g-1kg) fresh Lamb or Beef (cut into 2x2\" cubes)",
      "2 medium onions (sliced into 1/4\" half circles)",
      "5 medium carrots (cut into matchstick julienne)",
      "3.5 cups premium rice (Saleem Basmati / Devzira / Alanga)",
      "1 tsp ground cumin",
      "0.5 tsp whole cumin seeds",
      "1 tsp freshly ground black pepper",
      "3 tsp salt",
      "6.5 cups previously boiled water",
      "200 ml canola or vegetable oil",
      "0.5 cup chickpeas (soaked in lukewarm water for 5 hours, optional)",
      "1 whole garlic bulb (washed & outer layer trimmed, optional)"
    ],
    ingredients_it: [
      "800g - 1kg tenera carne fresca d'agnello o manzo (a cubetti di 3 cm)",
      "2 cipolle medie (tagliate a mezzaluna sottile)",
      "5 carote medie (tagliate a julienne classica)",
      "3.5 tazze di riso pregiato (Basmati / Devzira / Alanga)",
      "1 cucchiaino di cumino macinato (zira)",
      "0.5 cucchiaino di semi interi di cumino",
      "1 cucchiaino di pepe nero macinato fresco",
      "3 cucchiaini di sale da cucina",
      "6.5 tazze di acqua bollente aromatizzata",
      "200 ml di olio vegetale o d'oliva leggero",
      "Mezza tazza di ceci (ammollati per 5 ore, facoltativo)",
      "1 testa d'aglio intera pulita (facoltativo)"
    ],
    steps_uz: [
      "1. Tayyorgarlik: Go'shtni 2x2 sm kubik shaklida to'g'rang. Piyozni yarim halqa, sabzini esa bir xil somoncha shaklida to'g'rang.",
      "2. Go'shtni qovurish: Qozonni o'rtacha baland olovda qizdirib, 200 ml yog' soling va go'shtni har tomoni tillarang qobiq hosil qilguncha qovuring. Tuz, tuyilgan zira va qora murch seping.",
      "3. Piyoz va zirvak: To'g'ralgan piyozni qo'shib, yumshab oltin rangga kirguncha qovuring. Qaynoq suv quyib, qopqog'ini yoping va go'sht juda mayin bo'lguncha 15-20 daqiqa (mol go'shtida 30 daqiqa) pishiring.",
      "4. Sabzi va no'xatni terish: Sabzini go'sht va piyoz ustiga tekis qatlam qilib yoying (aslo aralashtirmang!). Ivitilgan no'xat va butun sarimsoq boshini ustiga qo'ying. 15 daqiqa o'rtacha olovda qaynating.",
      "5. Guruchni solish: Guruchni iliq suvda 2-3 marta ehtiyotkorlik bilan yuving. Suvini to'kib, kapgir bilan sabzi ustiga tekis qilib yoying. Suv sathi guruchdan kamida 2-2.5 sm yuqori bo'lishini ta'minlang (zarur bo'lsa ozgina qaynoq suv qo'shing).",
      "6. Suvni torttirish: Qopqog'ini yopib, o'rtacha baland olovda 8-10 daqiqa qaynating. Guruch suvni bir tekis tortishi uchun 8-daqiqada guruch yuzasini muloyim ag'daring.",
      "7. Gumbaz qilish va damlash: Suv to'liq tortilgach, guruchni markazga gumbaz qilib to'plang, ustiga butun zira seping. Olovni eng pastga tushirib, qopqoqni mahkam yopib 10-15 daqiqa damlang.",
      "8. Dasturxonga tortish: Sarimsoqni oling, go'shtni maydalab to'g'rang. Palovni katta naqshinkor Lagan likopchasiga suzib, ustiga xushbo'y go'sht, sabzi, no'xat va sarimsoqni joylang. Achchiq-chuchuk salati bilan torting!"
    ],
    steps_en: [
      "1. Preparation: Cut fresh meat into 2x2\" cubes. Slice onions into 1/4\" half circles, and cut carrots into uniform matchstick julienne.",
      "2. Browning Meat: Heat pressure cooker or heavy pot on medium-high heat with 200 ml oil. Brown meat evenly on all sides. Season with salt, ground cumin, and freshly ground black pepper.",
      "3. Caramelizing Onions: Add sliced onions and fry together until golden brown and tender. Pour in boiling water, mix gently, seal lid and cook for 15-20 min (30 min for beef) until tender.",
      "4. Layering Carrots & Aromatics: Layer the julienned carrots evenly over the meat and onions (do not stir!). Scatter pre-soaked chickpeas and place the whole garlic bulb in the center. Simmer for 15 minutes.",
      "5. Adding the Rice: Rinse rice thoroughly 2-3 times until water runs clear. Gently distribute rice over carrots with a flat spatula. Ensure boiling liquid sits about 1 inch above the rice surface.",
      "6. Absorbing Broth: Cover with lid and cook on medium-high for about 10 minutes until rice absorbs the broth. After 8 minutes, gently flip the top rice layer to ensure even moisture distribution.",
      "7. Forming the Dome & Steaming (Damlash): Once liquid is absorbed, gather rice into a center dome. Sprinkle whole cumin seeds on top. Reduce heat to low, seal tightly with lid, and steam undisturbed for 10-15 minutes.",
      "8. Serving: Extract garlic and meat chunks to slice thinly. Fluff and mix the fragrant plov, then heap onto a large ceremonial ceramic Lagan plate. Garnish with sliced meat, golden carrots, and whole steamed garlic. Serve with fresh tomato-onion Achichuk salad and green tea!"
    ],
    steps_it: [
      "1. Preparazione: Tagliare la carne fresca in cubetti uniformi di 3 cm. Tagliare le cipolle a mezzaluna sottile e le carote a julienne precisa.",
      "2. Rosolatura della carne: Scaldare la pentola con 200 ml d'olio a fuoco medio-alto e rosolare la carne fino a doratura uniforme. Insaporire con sale, cumino macinato e pepe nero fresco.",
      "3. Soffritto di cipolle e brodo: Aggiungere le cipolle e cuocere finché non diventano dorate e morbide. Versare l'acqua bollente, sigillare e cuocere per 15-20 min (30 min per manzo) fino a perfetta tenerezza.",
      "4. Strato di carote e aromi: Disporre uniformemente le carote sopra la carne senza mescolare. Aggiungere i ceci ammollati e la testa d'aglio intera al centro. Cuocere a fuoco medio per 15 minuti.",
      "5. Aggiunta del riso: Sciacquare delicatamente il riso per 2-3 volte. Stenderlo sopra le carote con una spatola piatta. Il brodo deve superare il riso di circa 2-2.5 cm.",
      "6. Assorbimento del brodo: Coprire e cuocere a fuoco medio-alto per circa 10 minuti finché il liquido non viene assorbito. Girare delicatamente solo lo strato superficiale del riso a 8 minuti.",
      "7. Cupola e vaporizzazione (Damlash): Raccogliere il riso a cupola al centro e cospargere con i semi interi di cumino. Abbassare il fuoco al minimo, chiudere ermeticamente e cuocere a vapore per 10-15 minuti.",
      "8. Servizio in tavola: Prelevare l'aglio e la carne per tagliarla a fette. Mescolare il riso dorato e servirlo sul grande piatto tradizionale Lagan decorato con carote, ceci, carne e l'aglio intero. Accompagnare con insalata fresca di pomodori e cipolle (Achichuk) e tè verde caldo!"
    ]
  },
  {
    id: "tandir-somsa",
    name_uz: "Qarsildoq Varaqi Somsa (Samosa / Sambusa)",
    name_en: "Authentic Uzbek Somsa (Samosa / Sambusa)",
    name_it: "Somsa Tradizionale Uzbeka (Samosa / Sambusa)",
    region_uz: "Jizzax & Toshkent",
    region_en: "Jizzakh & Tashkent",
    region_it: "Jizzakh e Tashkent",
    category: "pastry",
    cookTime: "2 soat (approx. 2 hours)",
    prepTime: "30 min",
    servings_uz: "30 dona somsa",
    servings_en: "30 Somsas",
    servings_it: "30 porzioni",
    calories: "320 kcal / dona",
    image: "/uploads/cuisine/somsa.jpg",
    sourceUrl: "https://arbuz.com/recipes/somsa-samosa-sambusa/",
    history_uz: "Somsa (ba'zi joylarda 'Samosa' yoki 'Sambusa' deb ham ataladi) har bir o'zbek oilasining eng sevimli milliy pishirig'i hisoblanadi. Somsa uchun uyda qatlama xamir qorishning klassik usuli bo'lsa-da, bugungi tezkor zamonda vaqtni tejash uchun sifatli tayyor qatlama xamirdan (puff pastry) foydalanish ham ajoyib yechimdir. Ushbu usul somsa xamirining duxovkada aqlbovar qilmas darajada qarsildoq, ko'p qatlamli va xushbo'y bo'lib chiqishini ta'minlaydi.",
    history_en: "Somsa (also known as 'Samosa' or 'Sambusa' around the world) is a beloved staple of every Uzbek family. While traditional homemade layered pastry is a time-honored art, using high-quality puff pastry dough offers an extraordinary, time-saving technique that yields astonishingly flaky, crispy, and juicy meat-filled pastries. It puffs beautifully in the oven, sealing in the savory spiced lamb and onion juices.",
    history_it: "La Somsa (nota anche come 'Samosa' o 'Sambusa') è il fagottino di sfoglia più amato e celebrato dell'Asia Centrale. Cotta al forno, questa versione unisce la praticità della sfoglia multistrato con il ripieno tradizionale di carne d'agnello tagliata finemente al coltello, cumino selvatico zira e cipolle dolci che rilasciano un sugo irresistibile.",
    story_uz: "O'zbek xonadonlarida tandir va duxovka somsasi mehmondo'stlikning ajralmas qismidir. Duxovkada pishirishda eng muhim narsa — xamirning qavat-qavat bo'lib ko'tarilishi va ichidagi go'sht mayin, sersuv bo'lib pishishidir. Qatlama xamirni doiralarga bo'lib yoyish, o'rtasiga xushbo'y zira sepilgan qiyma solib an'anaviy uchburchak shaklida tugish, yuzasiga tuxum va qora sedana sepib ikki bosqichda pishirish orqali mukammal tillarang qarsildoq somsalarga ega bo'lasiz.",
    story_en: "In Uzbek households, hot fresh somsa paired with steaming green tea represents genuine hospitality. Baking with puff pastry requires a few essential techniques: dividing the dough squares into smaller rolls to avoid large croissant-like puffs, hand-dicing the lamb for maximum natural juiciness, pinching the classic triangle borders tightly, and a two-stage baking temperature (high initial heat for puffing, followed by gentle heat for through-baking).",
    story_it: "Nelle case uzbeke, la somsa fumante servita con tè verde caldo è il simbolo supremo dell'accoglienza. La cottura della sfoglia richiede accortezze precise: dividere i quadrati di pasta per creare fagottini compatti, tagliare la carne al coltello per preservarne i succhi naturali, chiudere i bordi a triangolo ermetico e cuocere a due temperature (alta all'inizio per sfogliare, moderata dopo per dorare).",
    riceGuide_uz: "XAMIR SIRLARI: Tayyor qatlama xamir (puff pastry) pishganda ajoyib tarzda qatlam-qatlam bo'lib ko'tariladi. To'g'ri o'lchamdagi somsa hosil qilish uchun 10 ta kvadrat xamirning har birini rulet qilib o'rab, 3 ta teng bo'lakka bo'lish shart (jami 30 ta doira). Aks holda somsa emas, balki kruassan bo'lib qoladi! Doira diametri 10 sm (4 dyuym) dan oshmasligi lozim.",
    riceGuide_en: "PASTRY SECRETS: Puff pastry flakes and puffs dramatically when baked. For the ideal authentic size, roll each dough square and cut into 3 identical rolls, flattening each into a 4-inch (10 cm) circle. If you bake whole squares undivided, you will end up with giant croissants rather than classic Uzbek Somsas!",
    riceGuide_it: "SEGRETI DELLA SFOGLIA: La pasta sfoglia lievita in strati friabili spettacolari. Regola d'oro: dividere ogni quadrato in 3 piccoli rotoli compatti e stenderli in dischi di 10 cm. Usare i quadrati interi produrrebbe dei cornetti giganti anziché le classiche somsa uzbeke!",
    carrotsGuide_uz: "SERSUV QIYMA: Go'shtni go'shtqiymalagichdan chiqarmasdan, o'tkir pichoq bilan juda mayda kubik qilib to'g'rang. Piyozni ko'proq soling — go'sht va piyoz aralashmasi pishish jarayonida xamir ichida o'z sharbatini ajratib, somsa ichini juda sersuv qiladi.",
    carrotsGuide_en: "SUCCULENT FILLING: Finely hand-dice the fresh lamb or beef with a sharp knife rather than using a meat grinder. The generous onions combined with hand-cut meat release rich broth-like juices inside the pastry as it bakes.",
    carrotsGuide_it: "RIPIENO SUCCULENTO: Tagliare la carne a cubetti minuscoli a mano con un coltello affilato anziché tritarla a macchina. L'abbondanza di cipolla rilascia un sugo aromatico ricco e denso che bagna la pasta dall'interno.",
    cookerGuide_uz: "DUXOVKA HARORATI (IKKI BOSQICH): Duxovkani oldindan 215°C (420°F) ga qizdiring. Dastlabki 20 daqiqada baland haroratda xamir qatlamlari ochilib ko'tariladi. So'ng haroratni 175°C (350°F) ga tushirib yana 15-20 daqiqa pishiring — shunda ichidagi go'sht to'liq yetiladi va yuzi oltin rangda qizaradi.",
    cookerGuide_en: "TWO-STAGE OVEN TEMPERATURE: Preheat oven to 420°F (215°C). Bake for the first 20 minutes on high heat to puff the pastry layers. Then lower heat to 350°F (175°C) for another 15-20 minutes until deeply golden brown and the meat is cooked through. Alternate top and bottom trays if baking two pans simultaneously.",
    cookerGuide_it: "DOPPIA TEMPERATURA DEL FORNO: Preriscaldare a 215°C. Cuocere i primi 20 minuti ad alta temperatura per far sviluppare la sfoglia, poi abbassare a 175°C per altri 15-20 minuti finché non saranno dorate e croccanti e la carne perfettamente cotta. Alternare le teglie a metà cottura se se ne usano due.",
    aromaticsGuide_uz: "TUXUM VA SEDANA: Tuxumga 2 osh qoshiq suv qo'shib yaxshilab aralashtirilsa, somsa yuzasiga surtilganda silliq, yarqiroq oltin qobiq hosil bo'ladi. Ustiga qora sedana (nigella) va oq kunjut urug'larini sepish nafaqat ko'rk, balki o'zgacha sharqona xushbo'ylik baxsh etadi.",
    aromaticsGuide_en: "EGG WASH & SEEDS: Whisking 1 egg with 2 tbsp water creates a smooth, glistening golden crust without burning. Topping with black nigella seeds and white sesame seeds imparts an authentic Silk Road bakery aroma.",
    aromaticsGuide_it: "DORATURA E SEMI: Sbattere 1 uovo con 2 cucchiai d'acqua crea una doratura lucida e uniforme senza bruciare. Cospargere con semi neri di nigella (sedana) e sesamo bianco dona l'inconfondibile profumo dei forni della Via della Seta.",
    secret_uz: "Oshpazning sirlari: 1) Go'shtni pichoqda mayda to'g'rash; 2) Kvadrat xamirni 3 ga bo'lib 10 sm doira qilish; 3) Uchburchak qilib burchaklarini mahkam chimchilab tikish; 4) Ikki bosqichli haroratda (215°C keyin 175°C) pishirish.",
    secret_en: "Master Chef Secrets: 1) Hand-dice meat for juiciness; 2) Divide pastry squares into 3 rolls to avoid croissant puffing; 3) Pinch triangle seams firmly; 4) Bake in two stages (420°F first, then 350°F).",
    secret_it: "I segreti dello chef: 1) Tagliare la carne a cubetti al coltello; 2) Dividere i quadrati di sfoglia in 3 per creare dischi di 10 cm; 3) Sigillare con cura i bordi triangolari; 4) Cottura a due stadi (215°C poi 175°C).",
    ingredients_uz: [
      "1 o'ram sifatli qatlama xamir (puff pastry - 10 kvadratli)",
      "700g (1.5 lb) yangi qo'y yoki lahm mol go'shti (mayda to'g'ralgan)",
      "2 dona yirik piyoz (mayda to'g'ralgan)",
      "2 choy qoshiq osh tuzi",
      "1.5 choy qoshiq xushbo'y zira (cumin)",
      "1 choy qoshiq tuyilgan qora murch",
      "1 dona tuxum + 2 osh qoshiq suv (yuzasiga surtish uchun)",
      "Oq kunjut va qora sedana urug'lari (sepish uchun)",
      "Listni yog'lash uchun ozgina o'simlik yog'i"
    ],
    ingredients_en: [
      "1 pack premium puff pastry dough (10 squares)",
      "1.5 lbs (700g) fresh lamb or tender beef (finely hand-diced)",
      "2 large sweet onions (finely chopped)",
      "2 tsp salt",
      "1.5 tsp ground & whole cumin",
      "1 tsp freshly ground black pepper",
      "1 egg whisked with 2 tbsp water (for egg wash)",
      "White sesame & black nigella seeds (for topping)",
      "Little vegetable oil to grease the baking pans"
    ],
    ingredients_it: [
      "1 confezione di pasta sfoglia (puff pastry, 10 quadrati)",
      "700g carne fresca d'agnello o manzo (a cubetti al coltello)",
      "2 grandi cipolle dolci (tritate finemente)",
      "2 cucchiaini di sale da cucina",
      "1.5 cucchiaini di cumino aromatico (zira)",
      "1 cucchiaino di pepe nero macinato fresco",
      "1 uovo sbattuto con 2 cucchiai d'acqua (per doratura)",
      "Semi di sesamo bianco e nigella nera (sedana)",
      "Olio vegetale per ungere le teglie"
    ],
    steps_uz: [
      "1. Qiymani tayyorlash: O'tkir pichoq bilan qo'y yoki mol go'shtini mayda kubik shaklida to'g'rang (go'shtqiymalagichdan chiqarmang, shunda go'sht sharbati ichida saqlanadi).",
      "2. Piyozni maydalash: Piyozni pichoqda yoki oshxona maydalagichida mayda to'g'rab, go'sht ustiga qo'shing.",
      "3. Ziravorlash va tindirish: Go'sht va piyozga tuz, tuyilgan zira va qora murch qo'shib qo'lda yaxshilab qorishtiring. Xamir tayyor bo'lguncha qiymani muzlatgichga qo'ying.",
      "4. Xamirni bo'laklash va yoyish: Duxovkani 215°C (420°F) ga qizdiring. 10 ta kvadrat xamirning har birini rulet qilib o'rab, 3 ta teng bo'lakka bo'ling (jami 30 ta bo'lak). Har birini 10 sm (4 dyuym) diametrda doira qilib yoying.",
      "5. Qiymani joylash: Yoyilgan xamirlar markaziga 1-1.5 osh qoshiqdan xushbo'y go'shtli qiymani tekis solib chiqing.",
      "6. Uchburchak tugish: Xamirning uch tomonini markazga keltirib, barmog'ingiz bilan chetlarini mahkam chimchilab an'anaviy uchburchak shaklida tiking.",
      "7. Tuxum surtish va sedana: Listlarni yengil moylang. Somsalarni chokini pastga qilib tering. Tuxum va suv aralashmasini yuzasiga surtib, ustiga qora sedana va oq kunjut seping.",
      "8. Ikki bosqichda pishirish: 215°C (420°F) da 20 daqiqa pishiring, so'ng olovni 175°C (350°F) ga tushirib yana 15-20 daqiqa tillarang bo'lguncha pishiring. Issiq ko'k choy bilan torting!"
    ],
    steps_en: [
      "1. Preparing Filling: Using a sharp knife, cut fresh lamb into very small cubes (avoid grinding in a machine to preserve maximum juiciness).",
      "2. Chopping Onions: Finely dice onions by hand or with a chopper and combine thoroughly with the meat.",
      "3. Seasoning & Chilling: Add salt, black pepper, and cumin to the meat mixture. Mix well by hand and place in the refrigerator while preparing dough.",
      "4. Dividing & Rolling Dough: Preheat oven to 420°F (215°C). Roll each of the 10 puff pastry squares into tight rolls and cut each into 3 equal pieces (30 rolls total). Roll each piece into a 4-inch (10 cm) circle.",
      "5. Adding Filling: Spoon generous 1-1.5 tbsp of meat filling into the center of each flattened circle.",
      "6. Shaping Triangles: Bring three edges together over the filling and pinch the seams firmly with your fingers to form the classic triangle.",
      "7. Egg Wash & Sesame: Lightly grease baking sheets. Place Somsas smooth side up. Brush generously with the egg-water mixture and sprinkle with nigella and sesame seeds.",
      "8. Two-Stage Baking: Bake at 420°F (215°C) for 20 minutes to puff, then reduce heat to 350°F (175°C) and bake for another 15-20 minutes until golden brown. Serve hot with green tea!"
    ],
    steps_it: [
      "1. Preparazione del ripieno: Con un coltello affilato, tagliare la carne in cubetti minuscoli (non tritarla per preservare tutti i succhi saporiti).",
      "2. Taglio delle cipolle: Tritare finemente le cipolle dolci a mano o con tritatutto e unirle alla carne.",
      "3. Condimento e riposo: Aggiungere sale, cumino e pepe nero al ripieno e mescolare bene a mano. Riporre in frigo mentre si lavora la pasta.",
      "4. Porzionatura della sfoglia: Preriscaldare il forno a 215°C. Arrotolare ciascuno dei 10 quadrati di sfoglia e tagliarlo in 3 cilindretti uguali (30 pezzi). Stendere ciascun pezzo in un disco di 10 cm di diametro.",
      "5. Farcitura: Disporre 1-1.5 cucchiai abbondanti di ripieno di carne al centro di ciascun disco di pasta.",
      "6. Chiusura a triangolo: Sollevare tre lati della pasta verso il centro e pizzicare energicamente i bordi con le dita per sigillare il classico triangolo.",
      "7. Doratura e semi: Ungere le teglie con poco olio. Disporre le somsa con la chiusura verso il basso. Spennellare con l'uovo sbattuto con acqua e cospargere di semi di sesamo e nigella.",
      "8. Cottura a due stadi: Infornare a 215°C per 20 minuti per far gonfiare la sfoglia, poi abbassare a 175°C e cuocere per altri 15-20 minuti finché non saranno dorate e croccanti. Servire fumanti con tè verde!"
    ]
  },
  {
    id: "lagmon",
    name_uz: "Cho'zma Lag'mon (Qo'lda Cho'zilgan)",
    name_en: "Authentic Hand-Pulled Lagman",
    name_it: "Lagman Tradizionale (Tagliatelle Tirate a Mano)",
    region_uz: "Farg'ona, Toshkent & Andijon",
    region_en: "Fergana, Tashkent & Andijan",
    region_it: "Fergana, Tashkent e Andijan",
    category: "noodles",
    cookTime: "1 soat 20 min",
    prepTime: "30 min",
    servings_uz: "6 kishilik",
    servings_en: "6 servings",
    servings_it: "6 porzioni",
    calories: "490 kcal",
    image: "/uploads/cuisine/lagman.jpg",
    sourceUrl: "https://arbuz.com/recipes/uzbek-lagman/",
    history_uz: "Cho'zma Lag'mon — Buyuk Ipak yo'lining asrlar davomida shakllangan nodir oshpazlik san'atidir. Oshpazlar maxsus qattiq xamirni qo'lda elastik qilib cho'zib, yupqa va cho'ziluvchan uzun makaron hosil qiladi. Ustiga esa qovurilgan lahm go'sht, sarimsoq, selderey va sharqona ziravorlardan iborat sersuv say qaylasi quyiladi.",
    history_en: "Hand-pulled Lagman is a monumental Silk Road culinary treasure. Master chefs stretch and whip elastic wheat dough against the counter into impossibly long, chewy noodles. These are paired with a fragrant, deeply flavorful 'say' sauce made of tender beef, crisp seasonal vegetables, garlic, celery, and aromatic star anise.",
    history_it: "Il Lagman tirato a mano è uno dei capolavori più iconici della Via della Seta. I maestri pastai sbattono e allungano a mano l'impasto elastico fino a creare lunghi nastri di pasta fresca dalla consistenza callosa perfetta, accompagnati dal saporito stufato 'say' di manzo, peperoni, pomodori freschi, sedano e anice stellato.",
    story_uz: "Lag'monning bosh kuchi — uning tirik xamirida va olovda tez qovurilgan yangi sabzavotlarida. Xamirni bir necha bor moylab, spiral qilib tindirish xamirdagi glyuten to'rlarini bo'shashtiradi va qo'lda uzilmasdan cho'zilishini ta'minlaydi. Sabzavotlar esa qozonda qattiq olovda qovurilib, o'z qirsillashini va yorqin rangini saqlab qoladi.",
    story_en: "The magic of Lagman lies in the harmony between bouncy hand-pulled noodles and the high-heat stir-fried 'say'. Coiling oiled dough ribbons allows gluten to relax naturally, allowing effortless hand-stretching without tears. Searing the meat and fresh vegetables at intense heat locks in moisture and crispness.",
    story_it: "La magia del Lagman risiede nell'equilibrio tra la pasta elastica tirata a mano e il sugo saltato ad altissima temperatura. Il riposo della pasta con un velo d'olio rilassa il glutine, permettendo di allungarla senza strapparsi. Carne e verdure rosolate rapidamente preservano freschezza e intensità.",
    riceGuide_uz: "XAMIRNI CHO'ZISH TEXNIKASI: Un, tuz, 1 ta tuxum va iliq suvdan qattiq xamir qoriladi. Mushtlab 30 daqiqa tindirilgach, barmog'dek qalinlikda tasmalar qilinadi va o'simlik moyi surtib spiral qilib idishga taxlanadi. 20 daqiqa tindirilgach, barmoqlarda ohista cho'zilib, stolga urib ingichkalashtiriladi.",
    riceGuide_en: "NOODLE PULLING TECHNIQUE: Knead a stiff dough from flour, salt, egg, and warm water. After 30 minutes rest, shape into finger-thick strips, coat in oil, and coil onto a platter. Resting relaxes the gluten so you can pull and slap them against the table into long uniform noodles effortlessly.",
    riceGuide_it: "TECNICA DI TIRATURA DELLA PASTA: Impastare farina, uovo, acqua e sale fino a ottenere una pasta soda. Dopo 30 minuti di riposo, formare rotolini dello spessore di un dito, ungerli d'olio e avvolgerli a spirale. Dopo 20 minuti, allungarli con le mani sbattendoli sul banco di lavoro.",
    carrotsGuide_uz: "SAY (SOUS) TAYYORLASH: Lahm go'sht mayda somoncha qilib to'g'raladi va qizigan qozonda baland olovda qizartirib qovuriladi. Ketma-ket piyoz, sarimsoq, pomidor, selderey, turp va loviya qo'shiladi. Sabzavotlar ezilib ketmasdan, qirsillab turishi kerak.",
    carrotsGuide_en: "THE 'SAY' SAUCE: Finely strip-cut beef is seared on high heat. Add onions, garlic, fresh tomatoes, celery, sweet peppers, and long beans in quick succession. Vegetables should remain vibrant and lightly crisp.",
    carrotsGuide_it: "IL CONDIMENTO 'SAY': La carne tagliata a striscioline viene rosolata a fuoco vivo. Si uniscono cipolle, aglio, pomodori maturi, sedano, peperoni e fagiolini freschi. Le verdure devono restare sode e croccanti.",
    cookerGuide_uz: "QAYNATISH VA SOVUTISH: Cho'zilgan xamir tuzli qaynoq suvda 2-3 daqiqa pishiriladi. Suvdan oliboq darhol sovuq suvda chayiladi — bu xamirning yopishib qolishini oldini oladi va qovushqoq (al dente) bo'lishini ta'minlaydi.",
    cookerGuide_en: "BOILING & SHOCKING: Boil freshly pulled noodles in salted rolling boiling water for 2-3 minutes. Immediately rinse in cold water and toss with a few drops of oil. This prevents sticking and preserves elasticity.",
    cookerGuide_it: "COTTURA E SHOCK TERMICO: Cuocere la pasta tirata in abbondante acqua bollente salata per 2-3 minuti. Raffreddare subito in acqua fredda per arrestare la cottura e mantenerla elastica e al dente.",
    aromaticsGuide_uz: "ZIRAVORLAR VA LOZAJON: Selderey barglari va badyan (star anise) lag'monga o'sha mashhur xushbo'y iforni beradi. Dasturxonga maydalangan yangi ko'katlar va sarimsoqli achchiq 'Lozajon' qaylasi bilan birga tortiladi.",
    aromaticsGuide_en: "AROMATICS & LAZADJAN: Fresh celery leaves, garlic, and star anise provide the signature Silk Road aroma. Always serve hot with fresh herbs and spicy roasted garlic chili paste (Lazadjan).",
    aromaticsGuide_it: "SPEZIE E SALSA LAZADJAN: Foglie di sedano, aglio fresco e anice stellato conferiscono il celebre aroma. Servire con erbe fresche tritate e la caratteristica salsa piccante all'aglio Lazadjan.",
    secret_uz: "Oshpazning sirlari: 1) Xamirni qattiq qorish va moylab tindirish; 2) Cho'zgandan keyin darhol sovuq suvda chayish; 3) Sabzavotlarni baland olovda qisqa vaqt qovurib, yangiligini saqlash.",
    secret_en: "Master Chef Secrets: 1) Keep dough stiff and rest thoroughly in oil; 2) Shock noodles in cold water right after 3-minute boil; 3) Flash-fry vegetables on intense flame so they remain crisp.",
    secret_it: "I segreti dello chef: 1) Impasto sodo ben riposato nell'olio; 2) Risciacquo in acqua fredda subito dopo la cottura; 3) Rosolatura rapidissima delle verdure a fiamma alta per preservarne la consistenza croccante.",
    ingredients_uz: [
      "500g oliy nav un (xamir uchun)",
      "1 dona tuxum + 1 stakan iliq suv + 1 choy qoshiq tuz",
      "500g lahm mol go'shti (somoncha to'g'ralgan)",
      "2 dona piyoz va 4 tish sarimsoq",
      "2 dona yetilgan pomidor + 1 osh qoshiq tomat pastasi",
      "2 dona qizil va yashil bulg'or qalampiri",
      "2 poya xushbo'y selderey (barglari bilan)",
      "1 dona turp yoki daykon (mayda somoncha)",
      "1 bog' ko'k loviya (jandi)",
      "1 choy qoshiq tuyilgan zira va badyan (yulduzcha anison)",
      "100 ml o'simlik yog'i",
      "Yangi kashnich, shivit va ko'k piyoz"
    ],
    ingredients_en: [
      "500g all-purpose or bread flour (for noodles)",
      "1 egg + 1 cup warm water + 1 tsp salt",
      "500g (1.1 lbs) beef chuck or sirloin (thinly sliced)",
      "2 medium onions & 4 cloves fresh garlic",
      "2 ripe tomatoes + 1 tbsp tomato paste",
      "2 sweet bell peppers (red and green)",
      "2 stalks fresh celery with tender leaves",
      "1 small daikon radish (matchstick julienne)",
      "1 bunch green string beans (chopped)",
      "1 tsp ground cumin & 1 star anise",
      "100 ml vegetable oil",
      "Fresh cilantro, dill, and scallions for garnish"
    ],
    ingredients_it: [
      "500g farina di grano tenero tipo 0 (per pasta)",
      "1 uovo fresco + 1 tazza acqua tiepida + 1 cucchiaino di sale",
      "500g manzo scelto (tagliato a striscioline sottili)",
      "2 cipolle medie e 4 spicchi d'aglio fresco",
      "2 pomodori maturi + 1 cucchiaio concentrato di pomodoro",
      "2 peperoni dolci (uno rosso e uno verde)",
      "2 coste di sedano fresco con foglie",
      "1 piccolo ravanello daikon a julienne",
      "1 mazzetto fagiolini verdi freschi",
      "1 cucchiaino cumino e 1 anice stellato",
      "100 ml olio vegetale",
      "Coriandolo fresco, aneto e cipollotto"
    ],
    steps_uz: [
      "1. Qattiq xamir qorish: Un, tuz, tuxum va iliq suvdan qattiq xamir qoring, 10 daqiqa mushtlab, ustini yopib 30 daqiqa tindiring.",
      "2. Spiral tasmalarga bo'lish: Tingan xamirni barmog'dek qalinlikdagi tasmalar qilib cho'zing, yuzasiga mo'l o'simlik yog'i surtib likopchaga spiral qilib o'rang. 20 daqiqa tindiring.",
      "3. Xamirni qo'lda cho'zish: Tasmalarni ikki qo'l bilan ohista tortib, stolga yengil urib uzun, bir tekis iplar shaklida cho'zing.",
      "4. Qaynatish va chayish: Katta qozonda tuzli suvni qaynatib, cho'zilgan xamirni 2-3 daqiqa pishiring. Olgach darhol sovuq suvda chayib, ozgina yog' aralashtirib qo'ying.",
      "5. Go'shtni baland olovda qovurish: Cho'yan qozonda yog'ni qizdirib, yupqa somoncha go'shtni baland olovda qizarguncha tez qovuring.",
      "6. Sabzavotlarni ketma-ket qo'shish: Piyoz, sarimsoq, selderey, turp, bulg'or qalampiri va loviyani solib, sabzavotlar qirsillab turadigan darajada 5-7 daqiqa qovuring.",
      "7. Say qaylasini tayyorlash: Tomat pastasi, pomidor, zira, tuz, murch va 2 stakan bulyon quyib, past olovda 10-15 daqiqa miltillatib pishiring.",
      "8. Suzish va tortish: Chuqur kosalarga cho'zma lag'mon makaronini soling, ustidan issiq va xushbo'y sersuv sayni quying. Mayda to'g'ralgan ko'katlar va lozajon bilan taqdim eting!"
    ],
    steps_en: [
      "1. Kneading Dough: Combine flour, salt, egg, and warm water into a stiff dough. Knead vigorously for 10 min, cover and rest for 30 minutes.",
      "2. Shaping Oiled Coils: Roll dough into finger-thick ropes, coat generously with vegetable oil, and coil onto a plate. Let rest for 20 minutes.",
      "3. Hand-Stretching Noodles: Gently pull and slap each dough strip against the tabletop until long, smooth, and uniform.",
      "4. Boiling & Shocking: Cook noodles in a large pot of boiling salted water for 2-3 minutes. Immediately plunge into cold water, drain, and toss with a drop of oil.",
      "5. Searing the Beef: Heat oil in a wok or kazan over high heat. Sear the thinly sliced beef until caramelized and tender.",
      "6. Quick Vegetable Stir-Fry: Add onions, garlic, celery, daikon, peppers, and beans. Flash-fry for 5-7 minutes so vegetables remain crisp.",
      "7. Simmering the Say Broth: Stir in tomato paste, chopped tomatoes, cumin, star anise, salt, pepper, and 2 cups broth. Simmer gently for 10-15 minutes.",
      "8. Plating & Serving: Place portions of springy hand-pulled noodles into deep bowls, ladle boiling aromatic meat-vegetable say over the top. Garnish with fresh herbs and spicy lazadjan!"
    ],
    steps_it: [
      "1. Impasto sodo: Unire farina, sale, uovo e acqua tiepida lavorando energicamente fino a ottenere una pasta consistente. Far riposare coperta per 30 minuti.",
      "2. Formatura dei cilindri all'olio: Ricavare cilindri dello spessore di un dito, ungerli abbondantemente d'olio e avvolgerli a spirale su un piatto. Riposare per 20 minuti.",
      "3. Tiratura artigianale a mano: Allungare delicatamente i cilindri con le mani e sbatterli sul piano fino a creare tagliatelle lunghe e regolari.",
      "4. Cottura e raffreddamento: Cuocere la pasta in acqua bollente salata per 2-3 minuti. Scolare immediatamente e raffreddare in acqua fredda con un filo d'olio.",
      "5. Rosolatura del manzo: Scaldare l'olio nel wok a fiamma viva e rosolare le striscioline di manzo finché non saranno dorate.",
      "6. Salto delle verdure: Aggiungere cipolle, aglio, sedano, daikon, peperoni e fagiolini. Saltare per 5-7 minuti mantenendo le verdure croccanti.",
      "7. Preparazione del sugo: Unire concentrato, pomodori freschi, cumino, anice stellato, sale, pepe e 2 tazze di brodo. Cuocere a fuoco dolce per 10-15 minuti.",
      "8. Impiattamento: Disporre le tagliatelle fumanti in ciotole capienti e versarvi sopra l'abbondante sugo aromatico 'say'. Guarnire con erbe fresche e salsa piccante Lazadjan!"
    ]
  },
  {
    id: "toshkent-norin",
    name_uz: "Toshkent Norini (Qazi va Quritilgan Go'sht)",
    name_en: "Authentic Tashkent Naryn with Qazi",
    name_it: "Naryn Tradizionale di Tashkent con Qazi",
    region_uz: "Toshkent shahri",
    region_en: "Tashkent City",
    region_it: "Città di Tashkent",
    category: "main",
    cookTime: "48 soat quritish + 2 soat pishirish",
    prepTime: "1 soat",
    servings_uz: "6-8 kishilik",
    servings_en: "6-8 servings",
    servings_it: "6-8 porzioni",
    calories: "420 kcal",
    image: "/uploads/cuisine/norin.jpg",
    sourceUrl: "https://arbuz.com/recipes/norin-recipe/",
    history_uz: "Norin — poytaxt Toshkentning eng nufuzli to'ylari va marosimlarining shohona taomidir. Qadimiy an'anaga ko'ra, sarxil mol va qo'y go'shti mo'l tuz va zira bilan tuzlanib, qish kunlarida 2-3 kun ochiq havoda osib quritiladi (aging). Pishirilgan yupqa xamir barglari esa paxta moyi surtib sovutiladi va ipdek ingichka qilib to'g'raladi.",
    history_en: "Tashkent Naryn is the pinnacle of metropolitan banquet dining in Uzbekistan. Thin handmade ribbon-cut noodles are paired with cured, air-aged beef and lamb, crowned with spiced horsemeat sausage (Qazi). Served cold or room temperature, accompanied by a steaming cup of rich meat broth.",
    history_it: "Il Naryn di Tashkent è il piatto delle grandi celebrazioni nobili della capitale uzbeka. Sfoglie di pasta sottilissima cotte nel brodo, asciugate, oliate e tagliate a nastro finissimo come capelli d'angelo, unite a carne di manzo e agnello stagionata al sale e cumino per 48 ore, e completate con il tradizionale salume qazi.",
    story_uz: "Norin tayyorlash — haqiqiy sabr va mehr talab qiladigan o'zbek oilaviy san'atidir. Go'shtni havoda quritish uning ta'mini konsentratsiyalab, o'zgacha quruq-go'sht lazzatini beradi. Qattiq tuxumli xamir esa bulyonda pishirilgach, dasturxonga yoyilib, har bir bargiga paxta moyi surtiladi. Pichoqda mayda qirqilgan go'sht va xamir murch sepib aralashtiriladi va yoniga piyolada issiq tiniq bulyon tortiladi.",
    story_en: "Making authentic Naryn is a revered family tradition. Air-drying the salted meat for 48 hours concentrates its savory depth. The stiff egg dough is boiled in salted meat stock, dried flat, generously rubbed with cottonseed oil, and sliced into delicate matchstick ribbons. Tossed with seasoned shredded beef and served alongside a hot bowl of golden broth.",
    story_it: "La preparazione del Naryn è un rito familiare di sublime maestria. La stagionatura della carne per 48 ore all'aria aperta ne concentra l'umami. La pasta all'uovo soda viene lessata nel brodo saporito, stesa su teli, unta d'olio e affettata in sottilissimi nastri. Il piatto viene servito a temperatura ambiente con una tazza di brodo caldo fumante.",
    riceGuide_uz: "GO'SHTNI TUZLASH VA QURITISH (48 SOAT): Qo'y va mol go'shti qalin tilim qilib kesiladi. Mo'l tuz (8 oz go'shtga 4 osh qoshiq) va tuyilgan zira bilan ishqalanadi. Sovuq havoda (balkon yoki ayvonda) 48 soat osib quritiladi. Bu norinning o'sha takrorlanmas, o'tkir lazzatini yaratadi.",
    riceGuide_en: "MEAT CURING & AGING (48 HOURS): Cut beef chuck and lamb into thick slingshot cuts. Rub thoroughly with plenty of coarse salt and crushed cumin. Hang outdoors in cool winter weather for 48 hours to air-dry and cure properly.",
    riceGuide_it: "STAGIONATURA DELLA CARNE (48 ORE): Tagliare manzo e agnello a fette spesse. Cospargere abbondantemente di sale grosso e cumino zira. Appendere all'aria fresca per 48 ore per asciugare e stagionare la carne.",
    carrotsGuide_uz: "QATTIQ TUXUMLI XAMIR: 3 ta tuxum, tuz, suv va un aralashtirilib juda qattiq xamir qoriladi. Tingach 2 mm qalinlikda yoyiladi va 20x20 sm kvadratlarga bo'linadi. Qaynayotgan sho'rvada 3 daqiqa pishirib olinadi.",
    carrotsGuide_en: "STIFF EGG DOUGH: Whisk 3 eggs with salt, water, and flour into a firm, stiff dough. Roll paper-thin (2 mm) and cut into 8x8 inch squares. Boil in rolling broth for 3 minutes.",
    carrotsGuide_it: "PASTA SODA ALL'UOVO: Impastare 3 uova con sale, acqua e farina creando un impasto molto sodo. Stendere a 2 mm di spessore e tagliare a quadrati di 20 cm. Cuocere per 3 minuti nel brodo bollente.",
    cookerGuide_uz: "YOG'LASH VA TO'G'RASH: Pishgan xamir barglari toza matoga yoyilib bug'i quritiladi. Har bir bargiga paxta yoki kungaboqar yog'i surtilib taxlanadi. Sovigach, qatlamlar juda ingichka somoncha shaklida to'g'raladi.",
    cookerGuide_en: "OILING & SHREDDING: Lay cooked dough flat on a clean cloth to dry surface moisture. Rub each sheet generously with cottonseed or sunflower oil. Stack and shred into hair-thin noodles with a sharp knife.",
    cookerGuide_it: "ASCIUGATURA E TAGLIO A NASTRO: Asciugare le sfoglie cotte su un panno pulito, ungerle accuratamente d'olio e impilarle. Con un coltello affilatissimo, tagliarle a striscioline finissime come spaghettini.",
    aromaticsGuide_uz: "QAZI VA ISSIQ SHO'RVA: Norin dasturxonga tortilganda ustiga yupqa qazi tilimlari va qora murch sepilgan piyoz qo'yiladi. Eng muhimi — yonida alohida piyolada go'sht qaynatilgan qaynoq, xushbo'y sho'rva beriladi.",
    aromaticsGuide_en: "QAZI & HOT BROTH: Authentic Naryn is always garnished with thin slices of boiled horsemeat sausage (Qazi) and black-peppered onions, accompanied by a piping hot bowl of strained meat stock.",
    aromaticsGuide_it: "QAZI E BRODO FUMANTE: Il Naryn viene sempre rifinito con fettine di salume tradizionale qazi, anelli di cipolla al pepe nero e una ciotola di brodo di carne chiarificato servito bollente a parte.",
    secret_uz: "Oshpazning sirlari: 1) Go'shtni 48 soat osib quritish; 2) Xamirni juda qattiq qorish va 2 mm yupqa yoyish; 3) Barglarni yog'lab to'liq sovutgach ipdek mayda to'g'rash.",
    secret_en: "Master Chef Secrets: 1) Air-dry cured meat for 48 hours; 2) Knead dough extra stiff and roll to 2 mm thickness; 3) Oil boiled sheets thoroughly and slice into paper-thin noodles only after fully cooled.",
    secret_it: "I segreti dello chef: 1) Stagionare la carne per 48 ore; 2) Impasto molto sodo tirato a soli 2 mm; 3) Oliare bene le sfoglie cotte e tagliarle finissime solo una volta completamente fredde.",
    ingredients_uz: [
      "1 kg lahm mol va yog'li qo'y go'shti (to'sh qismi)",
      "4 osh qoshiq yirik osh tuzi (go'shtni tuzlash uchun)",
      "2 osh qoshiq tuyilgan va butun zira",
      "1 choy qoshiq qora murch",
      "1 dona pishirilgan qazi (ixtiyoriy, bezatish uchun)",
      "3 dona tuxum (xamir uchun)",
      "3 stakan oliy nav un",
      "1 stakan iliq suv + 1 osh qoshiq tuz",
      "200 ml paxta yoki kungaboqar yog'i (xamir barglarini yog'lash uchun)",
      "Sho'rva uchun: 2 litr toza suv + 1 litr go'sht bulyoni + 3 osh qoshiq tuz",
      "1 dona piyoz (yupqa yarim halqa, murchlangan)"
    ],
    ingredients_en: [
      "2 lbs (1 kg) lean beef chuck and fatty lamb breast",
      "4 tbsp coarse salt (for meat curing)",
      "2 tbsp crushed and whole cumin seeds",
      "1 tsp freshly ground black pepper",
      "1 boiled traditional Qazi sausage (optional)",
      "3 whole eggs (for noodle dough)",
      "3 cups all-purpose flour",
      "1 cup lukewarm water + 1 tbsp salt",
      "200 ml cottonseed or sunflower oil (for brushing sheets)",
      "Cooking stock: 2L water + 1L concentrated meat stock + 3 tbsp salt",
      "1 sweet onion (thinly sliced & peppered for garnish)"
    ],
    ingredients_it: [
      "1 kg carne di manzo e petto d'agnello saporito",
      "4 cucchiai sale grosso (per la salagione)",
      "2 cucchiai semi di cumino pestati",
      "1 cucchiaino pepe nero macinato fresco",
      "1 salume tradizionale qazi lessato (facoltativo)",
      "3 uova intere (per la sfoglia)",
      "3 tazze farina di grano tenero",
      "1 tazza acqua tiepida + 1 cucchiaio sale",
      "200 ml olio di cotone o girasole (per ungere le sfoglie)",
      "Liquido di cottura: 2L acqua + 1L brodo di carne ristretto + 3 cucchiai sale",
      "1 cipolla dolce (affettata sottile con pepe nero)"
    ],
    steps_uz: [
      "1. Go'shtni tuzlash: Qo'y va mol go'shtini qalin tilimlar qilib kesing. Mo'l tuz, tuyilgan zira va murch bilan yaxshilab ishqalang. Muzlatgichda 2 soat tindiring.",
      "2. Havoda quritish (48 soat): Go'shtni ayvon yoki balkonga ip tortib osing va 48 soat davomida sovuq havoda quritib oling.",
      "3. Go'shtni pishirish: Qurigan go'shtni sovuq suvli qozonga soling. Qaynab chiqqach ko'pigini oling, past olovda 1.5-2 soat miltillatib pishiring. Go'shtni olib sovuting, bulyonni saqlang.",
      "4. Qattiq tuxumli xamir: 3 ta tuxum, tuz, iliq suv va unni aralashtirib juda qattiq xamir qoring. Dumaloqlab 30 daqiqa tindiring.",
      "5. Yoyish va bo'lish: Xamirni 2 mm qalinlikda yupqa qilib yoying. 20x20 sm kvadrat qatlamlarga bo'ling.",
      "6. Bulyonda pishirish: Go'sht bulyoni va tuzli suvni qaynatib, xamir barglarini bittalab solib 3-4 daqiqa pishirib oling. Toza dasturxonga yoyib quriting va har bir bargiga yog' surting.",
      "7. Somoncha qilib qirqish: Sovugan xamir barglarini 6-8 qavat qilib taxlang, ensiz tasmalar kesib, ularni ipdek ingichka somoncha qilib to'g'rang. Pishgan go'shtni ham shunday mayda to'g'rang.",
      "8. Aralashtirish va tortish: Tog'orachada xamir va go'shtni qora murch bilan aralashtiring. Laganga suzib, ustiga tilimlangan qazi va murchli piyoz qo'ying. Yonida piyolada qaynoq sho'rva bilan torting!"
    ],
    steps_en: [
      "1. Curing the Meat: Cut beef and lamb into thick slices. Rub aggressively with coarse salt, cumin, and black pepper. Chill for 2 hours.",
      "2. Air-Drying (48 Hours): Hang the spiced meat on a line outdoors in cool weather for 48 hours to cure and intensify flavor.",
      "3. Simmering Meat: Place cured meat into a pot of cold water. Skim foam upon boiling, simmer gently for 1.5-2 hours until tender. Cool meat and reserve the golden broth.",
      "4. Kneading Stiff Dough: Whisk eggs, warm water, salt, and flour into a very stiff dough. Rest covered for 30 minutes.",
      "5. Rolling & Slicing: Roll dough into paper-thin 2 mm sheets. Cut into 8x8 inch squares.",
      "6. Boiling in Broth: Bring reserved meat broth and water to a rolling boil. Boil pasta sheets individually for 3-4 minutes. Dry on clean cloth and coat each with oil.",
      "7. Shredding Noodles & Meat: Stack cooled oiled sheets and shred into hair-thin ribbons with a sharp chef's knife. Shred cooked meat equally finely.",
      "8. Mixing & Serving: Toss shredded dough and meat together with black pepper. Pile onto platters, top with sliced Qazi and onions, and serve with hot broth on the side!"
    ],
    steps_it: [
      "1. Salagione della carne: Tagliare manzo e agnello a fette spesse. Cospargere con abbondante sale grosso, cumino e pepe. Riposare in frigo per 2 ore.",
      "2. Stagionatura all'aria (48 ore): Appendere la carne all'aria fresca su uno spago per 48 ore fino a completa asciugatura e stagionatura.",
      "3. Cottura lenta nel brodo: Immergere la carne in acqua fredda. Schiumare a bollore e cuocere a fuoco dolce per 1.5-2 ore. Scolare la carne e conservare il brodo.",
      "4. Impasto all'uovo sodo: Lavorare uova, acqua tiepida, sale e farina creando un impasto molto consistente. Lasciare riposare per 30 minuti.",
      "5. Stesura e taglio: Stendere la pasta a 2 mm di spessore. Ricavare grandi quadrati di 20 cm per lato.",
      "6. Lessatura nel brodo: Cuocere le sfoglie nel brodo bollente salato per 3-4 minuti. Stenderle su un telo e spennellare ogni strato d'olio vegetale.",
      "7. Taglio a nastro: Sovrapporre le sfoglie fredde e tagliarle a nastro sottilissimo come tagliolini. Sfilacciare anche la carne lessata alla stessa finezza.",
      "8. Mantecatura e servizio: Amalgamare pasta e carne con una spolverata di pepe nero. Servire sul piatto da portata decorato con qazi e cipolle, con una tazza di brodo bollente a parte!"
    ]
  },
  {
    id: "shorva",
    name_uz: "Qovurma Sho'rva (Kovurma Shorva)",
    name_en: "Authentic Uzbek Kovurma Shorva",
    name_it: "Kovurma Shorva (Zuppa Tradizionale con Costine)",
    region_uz: "Farg'ona & Samarqand",
    region_en: "Fergana & Samarkand",
    region_it: "Fergana e Samarcanda",
    category: "soup",
    cookTime: "1 soat 15 min",
    prepTime: "20 min",
    servings_uz: "6 kishilik",
    servings_en: "6 servings",
    servings_it: "6 porzioni",
    calories: "380 kcal",
    image: "/uploads/cuisine/shorva.jpg",
    sourceUrl: "https://arbuz.com/recipes/uzbek-shorva/",
    history_uz: "Qovurma Sho'rva — o'zbek oshxonasining eng to'yimli, tetiklashtiruvchi va xushbo'y sho'rvalaridan biri. Oddiy qaynatma sho'rvadan farqli o'laroq, bunda suyakli qo'y go'shti, piyoz va sabzavotlar dastlab qozonda qizartirib qovuriladi, so'ng suv quyilib past olovda uzoq miltillatiladi. Natijada tillarang, tiniq va shifobaxsh sho'rva hosil bo'ladi.",
    history_en: "Kovurma Shorva is the beloved hearty soup of Uzbekistan. Unlike boiled Shorva, here bone-in lamb ribs and shanks are deeply seared in the kazan with onions, sweet tomatoes, and spices before water is added, yielding a rich, amber, crystal-clear broth with melt-in-your-mouth root vegetables.",
    history_it: "La Kovurma Shorva è la regina delle zuppe tradizionali uzbeke. Rispetto alla versione bollita, le costolette d'agnello vengono prima rosolate ad alta temperatura con cipolle dolci, pomodori e coriandolo, prima di aggiungere acqua per una lenta sobbollitura che produce un brodo dorato, limpido e corroborante.",
    story_uz: "Sho'rvaning xushbo'yligi — yangi go'sht va tabiiy ziravorlarning qovurilishida mujassamlashgan. Piyoz to'liq erib ketguncha qovuriladi, sabzi va kartoshkalar esa yirik holda pishiriladi, shunda ular ezilmay o'z shaklini saqlaydi. Dasturxonga kosalarda issiq tortilib, ustiga mayda to'g'ralgan yangi kinza va shivit sepiladi.",
    story_en: "The hallmark of great Kovurma Shorva is its crystal-clear golden broth achieved by patient skimming and gentle simmering. Whole potatoes and sweet carrots absorb the rich essence of bone marrow and roasted cumin without breaking down.",
    story_it: "La perfezione della Kovurma Shorva sta nel brodo limpido e brillante, ottenuto schiumando accuratamente e cuocendo a fuoco bassissimo. Carote e patate a pezzi grossi assorbono gli aromi del midollo e del cumino tostato restando integre e morbide.",
    riceGuide_uz: "SUYAKLI GO'SHT VA QOVURISH: Qovurg'a yoki ilikli qo'y go'shti ishlatish sho'rvaga aqlbovar qilmas chuqur ta'm bag'ishlaydi. Go'sht qizigan yog'da baland olovda har tomoni qizarguncha qovurilishi shart.",
    riceGuide_en: "BONE-IN LAMB & HIGH SEAR: Using bone-in lamb ribs or shanks infuses collagen and marrow into the broth. Searing them hard on high flame develops the rich amber foundation.",
    riceGuide_it: "CARNE CON OSSO E ROSOLATURA: Costolette o stinco d'agnello con osso rilasciano midollo e sapore. Una rosolatura decisa a fuoco vivo dona al brodo il caratteristico colore ambrato.",
    carrotsGuide_uz: "SABZAVOTLARNI YIRIK TO'G'RASH: Sabzi va kartoshkalar maydalanmasdan, yirik parrak yoki 2 ga bo'lib solinadi. Bu sho'rvaning loyqalanmasdan tiniq qolishiga xizmat qiladi.",
    carrotsGuide_en: "LARGE CHUNKS FOR CLEAR BROTH: Cut carrots into thick rounds and leave potatoes whole or halved. Large vegetables preserve their structure and keep the soup broth crystalline.",
    carrotsGuide_it: "TAGLIO GROSSO PER UN BRODO LIMPIDO: Tagliare le carote a rondelle spesse e lasciare le patate a metà. Le verdure grandi mantengono il brodo pulito e privo di impurità.",
    cookerGuide_uz: "KO'PIKNI OLISH VA MILTILLATISH: Suv quyilgach qaynab chiqishi bilan hosil bo'lgan ko'pikni to'liq olib tashlang. Olovni eng pastga tushirib, 45 daqiqa qopqoqni yarim yopib miltillating.",
    cookerGuide_en: "SKIMMING & SLOW SIMMER: Skim away all froth immediately when it boils. Reduce heat to low and simmer gently with a cracked lid for 45 minutes for maximum clarity.",
    cookerGuide_it: "SCHIUMATURA E SOBBOLLITURA: Schiumare con cura appena l'acqua prende il bollore. Abbassare il fuoco al minimo e sobbollire dolcemente per 45 minuti con il coperchio semichiuso.",
    aromaticsGuide_uz: "KO'KATLAR VA ISSIQ NON: Kosaga suzilgach, sho'rva ustiga yangi maydalangan kashnich (kinza) va shivit sepiladi. Tandirdan chiqqan issiq o'zbek nonini botirib yeyish an'anadir.",
    aromaticsGuide_en: "FRESH HERBS & TANDIR BREAD: Finish each bowl with fresh cilantro and dill. Served traditionally with hot crusty Uzbek Tandir bread to dip into the broth.",
    aromaticsGuide_it: "ERBE FRESCHE E PANE TANDIR: Completare ogni ciotola con coriandolo e aneto freschi. Da gustare inzuppando il caldo pane tradizionale appena sfornato.",
    secret_uz: "Oshpazning sirlari: 1) Suyakli go'shtni yaxshilab qizartirib qovurish; 2) Qaynab chiqqach ko'pikni to'liq tozalash; 3) Olovni pasaytirib, aslo kuchli qaynatmasdan miltillatish.",
    secret_en: "Master Chef Secrets: 1) Brown bone-in lamb deeply; 2) Skim every trace of foam upon boiling; 3) Keep at a bare simmer never a rolling boil to ensure crystal-clear broth.",
    secret_it: "I segreti dello chef: 1) Rosolare a fondo l'agnello con le ossa; 2) Rimuovere ogni traccia di schiuma al primo bollore; 3) Sobbollire al minimo senza mai far bollire violentemente.",
    ingredients_uz: [
      "700g suyakli qo'y go'shti (qovurg'a va ilik suyaklari)",
      "2 dona o'rtacha piyoz (yarim halqa qilib to'g'ralgan)",
      "2 dona yetilgan shirin pomidor",
      "2 dona sabzi (yirik dumaloq to'g'ralgan)",
      "4 dona o'rtacha kartoshka (yirik 2 ga bo'lingan)",
      "1 dona shirin bulg'or qalampiri",
      "1 osh qoshiq kashnich urug'i va butun zira",
      "2 choy qoshiq osh tuzi, 1 choy qoshiq murch",
      "2.5 litr toza sovuq suv",
      "50 ml o'simlik yog'i (qovurish uchun)",
      "Yangi kashnich (kinza), shivit va ko'k piyoz"
    ],
    ingredients_en: [
      "1.5 lbs (700g) bone-in lamb ribs or shoulder chops",
      "2 medium yellow onions (thinly sliced)",
      "2 ripe tomatoes (roughly diced)",
      "2 medium carrots (sliced into thick rounds)",
      "4 medium potatoes (peeled and halved)",
      "1 sweet bell pepper (seeded and chunked)",
      "1 tbsp crushed coriander seeds & cumin",
      "2 tsp salt & 1 tsp black pepper",
      "2.5 liters cold spring water",
      "50 ml vegetable oil (for initial searing)",
      "Fresh cilantro, dill, and scallions"
    ],
    ingredients_it: [
      "700g costolette d'agnello con osso o stinco",
      "2 cipolle dorate medie (a mezzaluna sottile)",
      "2 pomodori maturi a cubetti",
      "2 carote medie a rondelle spesse",
      "4 patate medie (sbucciate e tagliate a metà)",
      "1 peperone dolce a tocchetti",
      "1 cucchiaio semi di coriandolo e cumino",
      "2 cucchiaini sale e 1 cucchiaino pepe nero",
      "2.5 litri acqua fredda",
      "50 ml olio vegetale per la rosolatura",
      "Coriandolo fresco, aneto e cipollotto"
    ],
    steps_uz: [
      "1. Go'shtni qovurish: Qozonda yog'ni qizdirib, suyakli qo'y go'shtini baland olovda har tomoni qizarguncha qovuring.",
      "2. Piyozni qo'shish: To'g'ralgan piyozni solib, yumshab oltin rangga kirguncha go'sht bilan birga qovuring.",
      "3. Pomidor va sabzi: Pomidor va sabzini solib, pomidor sharbati ajralib yog'ga singguncha 5-7 daqiqa qovuring.",
      "4. Ziravorlash: Bulg'or qalampiri, tuz, murch, tuyilgan zira va kashnich urug'ini solib yengil aralashtiring.",
      "5. Suv quyish va ko'pikni olish: 2.5 litr sovuq suv quying. Qaynab chiqqach, yuzasidagi ko'pikni kapgir bilan to'liq tozalang.",
      "6. Sekin miltillatish: Olovni eng pastga tushirib, qozon qopqog'ini qiyshiq yopib 40 daqiqa sekin qaynatib go'shtni pishiring.",
      "7. Kartoshkani pishirish: Yirik kartoshkalarni soling va ular yumshaguncha yana 20-25 daqiqa past olovda qaynating.",
      "8. Kosalarga suzish: Chuqur kosalarga go'sht, kartoshka va sabzini solib, ustidan tiniq issiq sho'rvani quying. Mayda to'g'ralgan kinza va murch sepib, issiq non bilan torting!"
    ],
    steps_en: [
      "1. Browning the Meat: Heat oil in a heavy pot over medium-high heat. Brown bone-in lamb on all sides.",
      "2. Caramelizing Onions: Add sliced onions and cook until translucent and golden.",
      "3. Tomatoes & Carrots: Add diced tomatoes and carrots; sauté for 5-7 minutes until tomatoes break down into a fragrant paste.",
      "4. Seasoning: Add bell pepper, salt, black pepper, coriander seeds, and cumin. Stir gently.",
      "5. Adding Water & Skimming: Pour in 2.5 liters of cold water. Bring to a boil and diligently skim off all rising foam.",
      "6. Slow Simmering: Reduce heat to low, partially cover with lid, and simmer gently for 40 minutes until meat is tender.",
      "7. Adding Potatoes: Add halved potatoes and continue simmering on low for 20-25 minutes until fork-tender.",
      "8. Serving: Ladle meat, potatoes, and carrots into deep soup bowls, pour hot golden broth over them, and garnish with fresh cilantro and dill!"
    ],
    steps_it: [
      "1. Rosolatura dell'agnello: Scaldare l'olio nel calderone e rosolare le costolette d'agnello su tutti i lati.",
      "2. Soffritto di cipolle: Aggiungere le cipolle affettate e cuocere finché non saranno morbide e dorate.",
      "3. Pomodori e carote: Unire pomodori e carote a rondelle, cuocendo per 5-7 minuti finché i pomodori non rilasciano il loro sugo.",
      "4. Condimento con spezie: Aggiungere peperoni, sale, pepe, coriandolo e cumino mescolando con cura.",
      "5. Aggiunta dell'acqua e schiumatura: Versare 2.5 litri d'acqua fredda. Portare a ebollizione e rimuovere ogni residuo di schiuma.",
      "6. Sobbollitura lenta: Abbassare la fiamma al minimo, coprire a metà e sobbollire per 40 minuti fino a tenerezza della carne.",
      "7. Aggiunta delle patate: Unire le patate a metà e cuocere a fuoco dolce per altri 20-25 minuti fino a renderle morbidissime.",
      "8. Impiattamento: Servire carne, patate e carote in ciotole capienti, coprire con il brodo dorato bollente e spolverare con coriandolo fresco e aneto!"
    ]
  },
  {
    id: "manti",
    name_uz: "Bug'da Pishgan Manti va Xonim",
    name_en: "Authentic Steamed Uzbek Manti & Khanum",
    name_it: "Manti e Khanum Tradizionali al Vapore",
    region_uz: "Farg'ona, Toshkent & Xorazm",
    region_en: "Fergana, Tashkent & Khorezm",
    region_it: "Fergana, Tashkent e Khiva",
    category: "steamed",
    cookTime: "45 min bug'lash",
    prepTime: "40 min",
    servings_uz: "6 kishilik (25-30 dona)",
    servings_en: "6 servings (25-30 pieces)",
    servings_it: "6 porzioni (25-30 pezzi)",
    calories: "360 kcal",
    image: "/uploads/cuisine/manti.jpg",
    sourceUrl: "https://arbuz.com/recipes/manti-meat-dumpling-recipe/",
    history_uz: "Manti va Xonim — O'zbekistonning eng nozik va xushbo'y bug' taomidir. Ko'p qavatli maxsus idish — Mantiqasqonda bug'da pishiriladi. Xamiri yupqa va elastik bo'lib, ichida esa mayda to'g'ralgan yangi go'sht va ko'p miqdordagi piyoz sharbati qamalib qoladi. Birinchi luqmadanoq og'izda sersuv bulon kabi erib ketadi.",
    history_en: "Uzbek Manti are majestic steamed dumplings cooked in a tiered cascading steamer (Manti-qasqon). Hand-diced beef or lamb, generous spiced onions, and delicate paper-thin dough seal in an explosion of rich, savory juices inside every delicate parcel.",
    history_it: "I Manti sono i celebri ravioli giganti al vapore dell'Asia Centrale, cotti nella tipica vaporiera a più piani (Manti-qasqon). L'impasto sottilissimo racchiude un ripieno succoso di carne d'agnello o manzo tagliata al coltello e cipolle aromatizzate al cumino, che rilasciano un brodo delizioso ad ogni morso.",
    story_uz: "Manti tayyorlashning bosh siri — go'shtni go'shtqiymalagichdan chiqarmaslikdir! O'tkir pichoqda mayda to'g'ralgan go'sht va tuz sepib qo'lda ezilgan piyoz o'zaro aralashganda xamir ichida aqlbovar qilmas sharbat hosil bo'ladi. Xamir kvadrat shaklda kesilib, to'rt burchagi konvert kabi chiroyli tugiladi va moylangan qasqonga teriladi.",
    story_en: "The master secret of Manti is never grinding the meat. Dicing it finely by hand combined with hand-massaged onions creates internal broth that bursts as you take a bite. Wrapped into delicate pleated envelopes and steamed to perfection for 45 minutes.",
    story_it: "Il segreto fondamentale dei Manti è non tritare mai la carne a macchina: tagliare manzo e agnello a cubetti microscopici al coltello e massaggiare le cipolle con sale e cumino crea un brodo interno saporito che bagna la pasta durante la cottura a vapore.",
    riceGuide_uz: "QIYMA VA PIYOZ SHARBATINING SIRI: Go'shtni pichoqda mayda kubik qiling. Piyozni mayda to'g'rab, tuz va zira sepib qo'lda ezib sharbatini chiqaring. Piyoz qanchalik ko'p bo'lsa, manti shunchalik sersuv bo'ladi. Kartoshkani mayda kubik qilib qo'shish esa sharbatni xamir ichida ushlab turadi.",
    riceGuide_en: "HAND-DICED MEAT & ONION BROTH: Dice meat into 1/4 inch cubes with a sharp blade. Hand-crush onions with salt and cumin to extract natural onion juices before mixing. Adding finely diced potatoes helps bind the savory juices inside the dumpling.",
    riceGuide_it: "RIPIENO AL COLTELLO E SUCCO DI CIPOLLA: Tagliare la carne a cubetti minuscoli con una lama affilata. Massaggiare a mano le cipolle con sale e cumino per estrarre i succhi prima di unire la carne. Pochi cubetti di patata aiutano a trattenere il brodo all'interno.",
    carrotsGuide_uz: "YUPQA XAMIR VA TUGISH: Un, tuxum, suv va tuzdan o'rta qattiqlikdagi xamir qoring. 30 daqiqa tindirib, 1.5-2 mm qalinlikda yoying. 10x10 sm kvadratlarga bo'lib, o'rtasiga 1 osh qoshiq qiymadan solib konvert uslubida tuging.",
    carrotsGuide_en: "ROLLING & ENVELOPE FOLDING: Knead flour, egg, warm water, and salt into a smooth dough. Rest for 30 minutes, roll paper-thin (1.5-2 mm). Cut into 4x4 inch squares, spoon 1 tbsp filling, and pinch opposite corners into traditional envelope packets.",
    carrotsGuide_it: "STESURA SOTTILE E CHIUSURA A BUSTA: Lavorare farina, uovo, acqua e sale fino a ottenere una pasta elastica. Riposare 30 min, stendere a 1.5-2 mm. Tagliare in quadrati di 10 cm, farcire con 1 cucchiaio di ripieno e sigillare gli angoli a busta.",
    cookerGuide_uz: "MANTIQASQONDA BUG'LASH (45 DAQIQA): Mantiqasqon qatlamlariga saxiy qilib o'simlik yog'i surting (aks holda manti tubi yopishib yirtiladi). Qaynayotgan qozonga qo'yib, qopqog'ini mahkam yopib 40-45 daqiqa bug'da pishiring.",
    cookerGuide_en: "STEAMING IN MANTI-QASQON (45 MIN): Generously brush steamer tiers with vegetable oil so dumplings don't tear. Stack over vigorously boiling water, cover tightly, and steam undisturbed for 40-45 minutes.",
    cookerGuide_it: "COTTURA AL VAPORE NELLA MANTI-QASQON (45 MIN): Ungere generosamente i ripiani della vaporiera con olio vegetale per evitare che la pasta si attacchi. Cuocere sopra acqua bollente a vapore vivo per 40-45 minuti senza aprire.",
    aromaticsGuide_uz: "DORATURA VA QATIQ/SUZMA: Pishgan mantilarni ehtiyotkorlik bilan laganga oling, ustiga eritilgan sariyog' surting va murch seping. Qatiq, sarimsoqli suzma yoki achchiq pomidor sousi bilan torting.",
    aromaticsGuide_en: "BUTTER & YOGURT SUZMA: Transfer steamed dumplings to a serving platter, brush with melted butter, and sprinkle with black pepper. Serve with fresh cold yogurt (Qatiq/Suzma) or tomato garlic sauce.",
    aromaticsGuide_it: "BURRO FUSO E SALSA SUZMA: Adagiare i manti cotti sul piatto da portata, spennellarli con burro fuso e spolverare di pepe nero. Servire con yogurt uzbeko suzma all'aglio o salsa di pomodori freschi.",
    secret_uz: "Oshpazning sirlari: 1) Go'shtni pichoqda to'g'rash va piyozni qo'lda ezib sharbatini chiqarish; 2) Qasqon qatlamlarini mo'l moylash; 3) 40-45 daqiqa kuchli bug'da pishirish.",
    secret_en: "Master Chef Secrets: 1) Hand-dice meat and crush onions to extract savory juices; 2) Oil steamer tiers thoroughly; 3) Steam for a full 40-45 minutes on consistent high steam.",
    secret_it: "I segreti dello chef: 1) Tagliare la carne al coltello e massaggiare le cipolle con le mani; 2) Oliare molto bene i ripiani della vaporiera; 3) Cuocere per 40-45 minuti a vapore costante.",
    ingredients_uz: [
      "1 kg lahm mol va yog'li qo'y go'shti / dumba (mayda kubik to'g'ralgan)",
      "4 dona yirik piyoz (mayda to'g'ralgan va qo'lda ezilgan)",
      "2 dona o'rtacha kartoshka (juda mayda kubik to'g'ralgan, ixtiyoriy)",
      "2 choy qoshiq osh tuzi",
      "1.5 choy qoshiq zira (butun va maydalangan)",
      "1 choy qoshiq maydalangan qora murch",
      "Xamir uchun: 3 stakan oliy nav un, 1 dona tuxum, 1 stakan iliq suv, 1 choy qoshiq tuz",
      "Qasqonni moylash uchun 100 ml o'simlik yog'i",
      "Ustiga surtish uchun 50g sariyog'",
      "Dasturxonga tortish uchun qatiq yoki sarimsoqli suzma"
    ],
    ingredients_en: [
      "2 lbs (1 kg) fresh beef chuck and fatty lamb (hand-diced into small cubes)",
      "4 large onions (finely chopped and hand-massaged)",
      "2 medium potatoes (finely diced into tiny cubes, optional)",
      "2 tsp salt",
      "1.5 tsp ground & whole cumin seeds",
      "1 tsp freshly ground black pepper",
      "Dough: 3 cups all-purpose flour, 1 egg, 1 cup warm water, 1 tsp salt",
      "100 ml vegetable oil (for greasing steamer tiers)",
      "50g melted butter (for brushing over hot manti)",
      "Fresh plain yogurt or sour cream (for serving)"
    ],
    ingredients_it: [
      "1 kg manzo scelto e agnello saporito (a cubetti al coltello)",
      "4 grandi cipolle dolci (tritate e massaggiate a mano)",
      "2 patate medie (a dadini minuscoli, facoltativo)",
      "2 cucchiaini sale",
      "1.5 cucchiaini cumino pestato",
      "1 cucchiaino pepe nero macinato fresco",
      "Impasto: 3 tazze farina, 1 uovo, 1 tazza acqua tiepida, 1 cucchiaino sale",
      "100 ml olio vegetale per ungere la vaporiera",
      "50g burro fuso per spennellare i manti cotti",
      "Yogurt suzma o panna acida per accompagnare"
    ],
    steps_uz: [
      "1. Xamir tayyorlash: Un, tuxum, iliq suv va tuzni aralashtirib silliq, o'rtacha qattiqlikdagi xamir qoring. Selofanga o'rab 30 daqiqa tindiring.",
      "2. Go'shtni to'g'rash: Yangi go'sht va dumbani o'tkir pichoqda mayda kubik (0.5 sm) qilib to'g'rang (go'shtqiymalagich ishlatmang).",
      "3. Piyoz va qiymani tayyorlash: Piyozni mayda to'g'rab, tuz va zira sepib qo'lda ezib sharbatini chiqaring. So'ng mayda to'g'ralgan go'sht va kartoshka bilan yaxshilab qorishtiring.",
      "4. Xamirni yoyish: Tingan xamirni o'qlov bilan 1.5-2 mm qalinlikda tekis qilib yoying.",
      "5. Kvadratlarga bo'lish: Yoyilgan xamirni pichoq bilan 10x10 sm (4 dyuym) kvadrat bo'laklarga kesing.",
      "6. Qiymani solish va tugish: Har bir kvadrat o'rtasiga 1 to'liq osh qoshiq qiymadan qo'ying. Qarama-qarshi ikki burchagini konvert kabi birlashtirib, yon burchaklarini bir-biriga mahkam chimchilang.",
      "7. Qasqonga terish: Mantiqasqon qatlamlarini saxiy qilib yog'lang. Mantilarni orasi 2 sm ochiq holda terib chiqing.",
      "8. Bug'da pishirish va tortish: Pastki qozonda suv qaynab turganda qasqon qatlamlarini qo'ying va mahkam yopib 40-45 daqiqa bug'da pishiring. Dasturxonga sariyog' surtib, qatiq yoki suzma bilan torting!"
    ],
    steps_en: [
      "1. Kneading Dough: Combine flour, egg, warm water, and salt into a smooth, elastic dough. Wrap and rest for 30 minutes.",
      "2. Dicing Meat: Hand-dice beef and lamb with a sharp knife into uniform tiny 1/4 inch cubes.",
      "3. Seasoning & Onion Massage: Finely chop onions, season with salt and cumin, and squeeze firmly with hands to extract juices. Combine with diced meat and potatoes.",
      "4. Rolling Dough: Roll out dough on a lightly floured surface to 1.5-2 mm thickness.",
      "5. Cutting Squares: Cut dough into 4x4 inch (10x10 cm) squares using a knife or pastry wheel.",
      "6. Filling & Envelope Shaping: Spoon 1 generous tbsp filling in the center. Bring opposite corners together over filling, then pinch adjacent corners together to seal.",
      "7. Greasing Steamer: Oil steamer tiers generously with vegetable oil. Arrange dumplings with space between them.",
      "8. Steaming & Plating: Stack tiers over vigorously boiling water, cover tightly with lid, and steam for 40-45 minutes. Brush hot manti with melted butter and serve with cold yogurt!"
    ],
    steps_it: [
      "1. Preparazione dell'impasto: Mescolare farina, uovo, acqua tiepida e sale fino a ottenere un impasto liscio e compatto. Avvolgere e riposare per 30 minuti.",
      "2. Taglio della carne: Con un coltello affilato, tagliare manzo e agnello a cubetti minuscoli di circa 5 mm.",
      "3. Condimento e massaggio delle cipolle: Tritare le cipolle, unire sale e cumino e massaggiarle energicamente con le mani per liberare i succhi prima di amalgamarle alla carne.",
      "4. Stesura della sfoglia: Stendere la pasta a uno spessore uniforme di 1.5-2 mm.",
      "5. Taglio in quadrati: Tagliare la pasta stesa in quadrati regolari di 10x10 cm.",
      "6. Farcitura e chiusura: Disporre 1 cucchiaio abbondante di ripieno al centro. Unire gli angoli opposti a busta e pizzicare i lati per sigillare.",
      "7. Ungere la vaporiera: Spennellare abbondantemente d'olio i ripiani della vaporiera e disporre i manti distanziati.",
      "8. Cottura al vapore e servizio: Posizionare i cestelli sopra l'acqua bollente, chiudere bene e cuocere al vapore per 40-45 minuti. Lucidare con burro fuso e servire con yogurt suzma fresco!"
    ]
  }
];

// Authentic Uzbek Musical Instruments Database (6 balanced items for 3-col grid with YouTube audio/video)
const nationalInstruments = [
  {
    id: "dutor",
    name_uz: "Dutor",
    name_en: "Dutar (Silk-stringed Lute)",
    name_it: "Dutar (Liuto a Due Corde)",
    youtubeId: "Fq2o8fcr8pI",
    category_uz: "Torli chertma cholg'u",
    category_en: "Plucked string instrument",
    category_it: "Strumento a corde pizzicate",
    timber_uz: "Mayin, ipakdek lirik va qalbga yaqin",
    timber_it: "Vellutato, intimo e meditativo",
    timber_en: "Velvety, intimate and lyrical",
    image: "/uploads/instruments/dutor.jpg",
    description_uz: "Dutor — o'zbek mumtoz musiqasining ruhi. Noksimon kosasi quritilgan tut daraxtidan teriladi va ipak torlari faqat qo'l barmoqlari bilan chertiladi.",
    description_en: "The Dutar is the spiritual heart of Uzbek classical music. Its body is assembled from aged mulberry wood slats, strung with two pure silk strings.",
    description_it: "Il Dutar è l'anima della musica classica uzbeka. La cassa armonica è in legno di gelso intagliato e le corde di seta vengono suonate a dita nude.",
    genres_uz: "Shashmaqom, Lirik kuylar, Xalq dostonlari",
    genres_it: "Shashmaqom classico, Canti popolari e melodie intime",
    genres_en: "Classical Shashmaqom, lyrical folk melodies, epics",
    materials_it: "Legno di gelso stagionato, corde in pura seta",
    materials_uz: "Quritilgan tut yog'ochi, tabiiy ipak torlar",
    materials_en: "Aged mulberry wood, pure natural silk strings"
  },
  {
    id: "doira",
    name_uz: "Doira (Doyra)",
    name_en: "Doyra (Frame Drum)",
    name_it: "Doira (Tamburello a Cornice)",
    youtubeId: "LXz-oqpzLKg",
    category_uz: "Zarbli (urma) cholg'u",
    category_en: "Percussion frame drum",
    category_it: "Strumento a percussione",
    timber_uz: "Jo'shqin, jarangdor va ritmik zarb",
    timber_it: "Ritmo travolgente, brillante e festoso",
    timber_en: "Resounding, vibrant and rhythmic",
    image: "/uploads/instruments/doira.png",
    description_uz: "Doira — bayramlar va to'ylarning yuragi. Tok novdasidan egilgan chambarga teri tortiladi va ichiga 60 dan ortiq jez halqachalar o'rnatiladi.",
    description_en: "The Doyra provides the festive pulse of Uzbek gatherings. A circular wooden frame fitted with internal bronze jingles that shimmer with every strike.",
    description_it: "La Doira è il battito delle feste dell'Uzbekistan. Una cornice in legno con pelle di vitello e anelli metallici risonatori interni.",
    genres_uz: "Bayram usullari, Xorazm Lazgisi, Yallalar",
    genres_it: "Ritmi di danza nuziale, Danza Lazgi di Khiva",
    genres_en: "Festive rhythms, Khorezm Lazgi dance, wedding celebrations",
    materials_it: "Legno di vite, membrana in pelle, anelli in bronzo",
    materials_uz: "Tok chambari, buzoq terisi, jez halqachalar",
    materials_en: "Bent vine wood frame, calf skin membrane, bronze metal rings"
  },
  {
    id: "rubob",
    name_uz: "Qashqar Rubobi",
    name_en: "Kashgar Rubab",
    name_it: "Rubab di Kashgar",
    youtubeId: "xJg57pvx2pw",
    category_uz: "Torli chertma cholg'u",
    category_en: "Plucked string instrument with horns",
    category_it: "Liuto con corni risonatori",
    timber_uz: "O'tkir, jarangdor va dinamik",
    timber_it: "Argentino, penetrante e gioioso",
    timber_en: "Crisp, bright and energetic",
    image: "/uploads/instruments/rubob.jpg",
    description_uz: "Qashqar rubobi o'zining korpusidagi yarim oy shaklidagi shoxlari va jarangdor tovushi bilan ajralib turadi. Suyak mediator bilan chalinadi.",
    description_en: "The Kashgar Rubab is recognized by curved horn projections on its body, producing articulate and cheerful melodies across folk ensembles.",
    description_it: "Riconoscibile per le appendici a forma di mezzaluna sulla cassa, suonato con plettro in osso per un suono vivace e brillante.",
    genres_uz: "Xalq qo'shiqlari, Ansambl kuylari",
    genres_it: "Musica tradizionale d'insieme e canti popolari",
    genres_en: "Traditional folk songs, ensemble melodies",
    materials_it: "Legno di noce, tavola in pelle, plettro in osso",
    materials_uz: "Yong'oq yog'ochi, teri qoplamasi, suyak mizrob",
    materials_en: "Walnut wood, fish or calf skin soundboard, bone plectrum"
  },
  {
    id: "tanbur",
    name_uz: "Tanbur",
    name_en: "Tanbur (Classical Long Lute)",
    name_it: "Tanbur (Liuto Mistico)",
    youtubeId: "Otr6AOnpbto",
    category_uz: "Torli mumtoz cholg'u",
    category_en: "Classical modal lute",
    category_it: "Liuto classico del Maqom",
    timber_uz: "Ilohiy, g'amgin va falsafiy",
    timber_it: "Mistico, profondo e contemplativo",
    timber_en: "Solemn, meditative and spiritual",
    image: "/uploads/instruments/tanbur.jpg",
    description_uz: "Tanbur — Shashmaqomning poydevori hisoblangan muqaddas cholg'u. O'ng qo'l ko'rsatkich barmog'iga taqiladigan noxun bilan chalinadi.",
    description_en: "The Tanbur is the foundational instrument of Uzbek Shashmaqom. Played with a metal plectrum worn on the index finger, it produces transcendent acoustics.",
    description_it: "Strumento cardine del Shashmaqom classico. Suonato con un plettro d'acciaio al dito indice, evoca atmosfere di alta spiritualità.",
    genres_uz: "Shashmaqom, Falsafiy mumtoz musiqa",
    genres_it: "Shashmaqom classico, Canti sacri dei maestri",
    genres_en: "Classical Shashmaqom, sacred master songs",
    materials_it: "Legno di gelso scuro, tasti in budello, plettro metallico",
    materials_uz: "Tut yog'ochi, ipak pardalar, metall noxun",
    materials_en: "Dark mulberry wood, tied gut frets, metal wire plectrum"
  },
  {
    id: "nay",
    name_uz: "Nay",
    name_en: "Ney (Cane Reed Flute)",
    name_it: "Nay (Flauto Tradizionale)",
    youtubeId: "Ykfl4k18Ldo",
    category_uz: "Puflama cholg'u",
    category_en: "Wind reed flute",
    category_it: "Strumento a fiato in canna",
    timber_uz: "Inson nafasidek iliq va mungli",
    timber_it: "Soffuso, caldo ed evocativo",
    timber_en: "Haunting, breathy and emotive",
    image: "/uploads/instruments/nay.jpg",
    description_uz: "Yovvoyi qamishdan yasalgan bo'lib, uning sadosi sahrolar shamoli va Ipak yo'lining qadimiy karvon ohanglarini eslatadi.",
    description_en: "Crafted from wild river cane, the Ney breathes poetic melodies that echo desert winds and historic Silk Road caravan journeys.",
    description_it: "Flauto intagliato in canna di fiume, capace di generare sonorità soffuse che ricordano le oasi e il vento della Via della Seta.",
    genres_uz: "Lirik kuylar, Mumtoz ansambl",
    genres_it: "Melodie liriche, Musica d'insieme contemplativa",
    genres_en: "Lyrical tunes, contemplative ensemble music",
    materials_it: "Canna palustre naturale o ottone inciso",
    materials_uz: "Daryo qamishi, jez halqalar",
    materials_en: "Selected marsh reed cane, engraved brass rings"
  },
  {
    id: "chang",
    name_uz: "Chang (Santur)",
    name_en: "Chang (Hammered Dulcimer)",
    name_it: "Chang (Salterio a Percussione)",
    youtubeId: "Sq5LS1zHPOQ",
    category_uz: "Torli urma cholg'u",
    category_en: "Hammered dulcimer",
    category_it: "Salterio a percussione",
    timber_uz: "Buloq suvidek shaffof, jarangdor va jilvali",
    timber_it: "Cristallino, scintillante e melodioso",
    timber_en: "Crystalline, shimmering and bright",
    image: "/uploads/instruments/chang.webp",
    description_uz: "Trapetsiya shaklidagi yog'och quti ustiga ko'plab metall torlar tortiladi va ikki dona yupqa qamish tayoqchalar bilan chalinadi.",
    description_en: "A trapezoidal zither strung with numerous metal strings, struck lightly with delicate bamboo mallets for glistening harmonies.",
    description_it: "Strumento trapezoidale a molteplici corde metalliche percosse con due sottili bacchette flessibili per creare armonie cristalline.",
    genres_uz: "Xalq kuylari, Mumtoz ansambl, Estrada",
    genres_it: "Repertorio classico d'insieme, Danze tradizionali",
    genres_en: "Classical ensemble repertoire, traditional dance melodies",
    materials_it: "Cassa in noce, corde d'acciaio, bacchette in bambù",
    materials_uz: "Yong'oq korpusi, po'lat torlar, qamish cho'plar",
    materials_en: "Walnut resonator body, steel strings, flexible cane hammers"
  }
];

export default function HeritageCulture({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const [activeTab, setActiveTab] = useState('cuisine'); // 'cuisine' or 'instruments'
  const [selectedItemModal, setSelectedItemModal] = useState(null);
  const [dishModalTab, setDishModalTab] = useState('recipe'); // 'recipe', 'ingredients', 'rice', 'story'
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  return (
    <div className="bg-[#fcfdfa] min-h-screen pb-24 font-sans text-slate-800">
      
      {/* 1. SEAMLESS HERO BANNER (Matches Tours & Home Navbar Integration) */}
      <div className="relative h-[380px] md:h-[420px] w-full bg-slate-950 flex items-center justify-center overflow-hidden pt-16">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=85" 
          alt="Patrimonio Culturale dell'Uzbekistan" 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-65 opacity-80 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-black/30 z-10"></div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'it' 
                ? 'Patrimonio Culturale dell\'Uzbekistan' 
                : lang === 'en' 
                  ? 'Cultural & Culinary Heritage' 
                  : 'Madaniy Meros va Gastronomiya'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-white font-black tracking-tight drop-shadow-md">
            {lang === 'it' 
              ? 'Sapori e Armonie della Via della Seta' 
              : lang === 'en' 
                ? 'Flavors & Harmonies of the Silk Road' 
                : 'Ipak Yo\'li Taomlari va Milliy Kuylari'}
          </h1>
          
          <p className="text-slate-200 text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed">
            {lang === 'it' 
              ? "Un viaggio esclusivo tra le leggendarie ricette culinarie uzbekhe e gli incantevoli strumenti musicali tradizionali del Shashmaqom."
              : lang === 'en'
                ? "An immersive exploration of Uzbekistan's celebrated culinary traditions and the transcendent melodies of classical instruments."
                : "O'zbekistonning boy gastronomik an'analari va asrlar osha yangrab kelayotgan sehrli milliy musiqa merosi."}
          </p>
        </div>
      </div>

      {/* 2. MINIMALIST TABS (Centered Pill Navigation) */}
      <div className="container mx-auto px-4 max-w-5xl -mt-6 relative z-30">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 p-1.5 flex items-center justify-center gap-1.5 max-w-md mx-auto">
          
          <button
            onClick={() => setActiveTab('cuisine')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'cuisine' 
                ? 'bg-[#0c594d] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>{lang === 'it' ? 'Gastronomia Tradizionale' : lang === 'en' ? 'Traditional Cuisine' : 'Milliy Taomlar'}</span>
          </button>

          <button
            onClick={() => setActiveTab('instruments')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'instruments' 
                ? 'bg-[#0c594d] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>{lang === 'it' ? 'Strumenti Musicali' : lang === 'en' ? 'Musical Instruments' : 'Cholg\'u Asboblari'}</span>
          </button>

        </div>
      </div>

      {/* 3. CONTENT AREA - UNIFORM 3-COLUMN CARDS */}
      <div className="container mx-auto px-4 max-w-7xl pt-12">
        
        {/* TAB 1: GASTRONOMIA */}
        {activeTab === 'cuisine' && (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                {lang === 'it' ? 'I Capolavori del Gusto' : lang === 'en' ? 'Masterpieces of Taste' : 'O\'zbek Taomlari'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                {lang === 'it' ? 'I Piatti Celebri dell\'Uzbekistan' : lang === 'en' ? 'Celebrated Dishes of Uzbekistan' : 'O\'zbekistonning Mashhur Taomlari'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-light">
                {lang === 'it' 
                  ? "Ogni piatto racchiude secoli di tradizione, spezie aromatiche e l'ospitalità autentica della terra uzbeka."
                  : lang === 'en'
                    ? "Each dish preserves centuries of Silk Road heritage, fragrant spices, and genuine hospitality."
                    : "Asrlar davomida shakllangan milliy taomlar, xushbo'y ziravorlar va mehmondo'stlik sirlari."}
              </p>
            </div>

            {/* UNIFORM 3-COLUMN CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nationalDishes.map((dish) => (
                <div 
                  key={dish.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Uniform Image Ratio */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                      <img 
                        src={dish.image} 
                        alt={dish[`name_${lang}`] || dish.name_uz}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                        {dish[`region_${lang}`] || dish.region_uz}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-700" />
                        <span>{dish.cookTime}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                        <span className="uppercase text-emerald-800 tracking-wider text-[10px] font-bold">
                          {dish.category === 'main' ? 'Piatto Principale' : dish.category === 'pastry' ? 'Panetteria & Forno' : 'Specialità'}
                        </span>
                        <span>{dish.calories}</span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#0c594d] transition-colors line-clamp-1">
                        {dish[`name_${lang}`] || dish.name_uz}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">
                        {dish[`history_${lang}`] || dish.history_uz}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => {
                        setDishModalTab('recipe');
                        setSelectedItemModal({ ...dish, type: 'dish' });
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#0c594d] text-slate-700 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 hover:border-[#0c594d] cursor-pointer"
                    >
                      <span>
                        {dish.steps_uz 
                          ? (lang === 'it' ? 'Ricetta Completa & Segreti' : lang === 'en' ? 'Full Recipe & Master Secrets' : 'To\'liq Retsept va Sirlar') 
                          : (lang === 'it' ? 'Vedi Ingredienti & Segreto' : lang === 'en' ? 'View Ingredients & Secret' : 'Tarkibi va Sirlari')}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: STRUMENTI MUSICALI */}
        {activeTab === 'instruments' && (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                {lang === 'it' ? 'Musica & Shashmaqom' : lang === 'en' ? 'Classical & Folk Music' : 'Milliy Cholg\'ular'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                {lang === 'it' ? 'Gli Strumenti Musicali Tradizionali' : lang === 'en' ? 'Traditional Musical Instruments' : 'Milliy Cholg\'u Asboblari'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-light">
                {lang === 'it' 
                  ? "Il legno di gelso, la seta pura e il ritmo della doira danno vita al sacro patrimonio del Shashmaqom."
                  : lang === 'en'
                    ? "Mulberry wood, pure silk strings, and resonant frame drums compose Uzbekistan's musical soul."
                    : "Qadimiy tut yog'ochi, ipak torlar va doira zarblari uyg'unligidagi betakror musiqa madaniyati."}
              </p>
            </div>

            {/* UNIFORM 3-COLUMN CARDS GRID (Exact same structure & size as dishes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nationalInstruments.map((inst) => (
                <div 
                  key={inst.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Uniform Image Ratio */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <img 
                        src={inst.image} 
                        alt={inst[`name_${lang}`] || inst.name_uz}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                        {inst[`category_${lang}`] || inst.category_uz}
                      </div>

                      {/* Clean Light Play Badge on Image */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideoModal(inst);
                        }}
                        className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-900 hover:text-[#0c594d] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer z-10 border border-slate-200/60"
                        title={lang === 'it' ? 'Ascolta Kuy' : lang === 'en' ? 'Listen Music' : 'Kuyini tinglash'}
                      >
                        <Play className="w-3 h-3 fill-[#0c594d] text-[#0c594d]" />
                        <span>{lang === 'it' ? 'Ascolta' : lang === 'en' ? 'Listen' : 'Tinglash'}</span>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                        <span className="uppercase text-emerald-800 tracking-wider text-[10px] font-bold">
                          {inst[`genres_${lang}`]?.split(',')[0] || 'Musica Tradizionale'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#0c594d] transition-colors line-clamp-1">
                        {inst[`name_${lang}`] || inst.name_uz}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">
                        {inst[`description_${lang}`] || inst.description_uz}
                      </p>

                      <div className="text-[11px] text-emerald-800 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100/60 line-clamp-1">
                        <strong>{lang === 'it' ? 'Timbro:' : lang === 'en' ? 'Timbre:' : 'Timbri:'}</strong> {inst[`timber_${lang}`] || inst.timber_uz}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action: Minimalist Light Buttons */}
                  <div className="p-5 pt-0 flex gap-2">
                    <button
                      onClick={() => setActiveVideoModal(inst)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50/80 hover:bg-[#0c594d] text-emerald-950 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-emerald-200/70 hover:border-[#0c594d] shadow-2xs group/btn cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover/btn:scale-110" />
                      <span>{lang === 'it' ? 'Ascolta Kuy' : lang === 'en' ? 'Listen Music' : 'Kuyini Tinglash'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedItemModal({ ...inst, type: 'instrument' })}
                      className="py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
                      title={lang === 'it' ? 'Dettagli e Materiali' : lang === 'en' ? 'Details & Materials' : 'Batafsil ma\'lumot'}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* DETAILED MODAL POPUP */}
      {selectedItemModal && (
        <div 
          onClick={() => setSelectedItemModal(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
        >
          {selectedItemModal.type === 'dish' ? (
            /* ENRICHED DISH MODAL (Split-Screen Culinary Showcase) */
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl lg:max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-200/90 animate-scale-up max-h-[92vh] flex flex-col"
            >
              {/* Slim Minimalist Top Bar */}
              <div className="px-5 sm:px-6 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                    {lang === 'it' ? 'Patrimonio Culinario' : lang === 'en' ? 'Culinary Heritage' : 'Milliy Gastronomiya'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    • {selectedItemModal[`region_${lang}`] || selectedItemModal.region_uz}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItemModal(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-700 shadow-2xs flex items-center justify-center transition-all cursor-pointer border border-slate-200 hover:scale-105"
                  title="Close"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Main 2-Column Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto lg:overflow-hidden">
                
                {/* LEFT COLUMN (lg:col-span-5): Image & Quick Recipe Specs */}
                <div className="lg:col-span-5 bg-slate-50/60 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col gap-4 lg:overflow-y-auto">
                  
                  {/* Contained Dish Image - Natural Proportions without Distortion */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 bg-white group shrink-0">
                    <img 
                      src={selectedItemModal.image} 
                      alt={selectedItemModal[`name_${lang}`] || selectedItemModal.name_uz}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      {selectedItemModal[`region_${lang}`] || selectedItemModal.region_uz}
                    </div>
                  </div>

                  {/* 4 Quick Metadata Cards */}
                  <div className="grid grid-cols-2 gap-2.5 shrink-0">
                    <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {lang === 'it' ? 'Tempo' : lang === 'en' ? 'Cooking Time' : 'Tayyorlash'}
                      </span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">
                        {selectedItemModal.cookTime}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {lang === 'it' ? 'Porzioni' : lang === 'en' ? 'Servings' : 'Porsiya'}
                      </span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">
                        {selectedItemModal[`servings_${lang}`] || selectedItemModal.servings_uz || '4-6 porzioni'}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {lang === 'it' ? 'Calorie' : lang === 'en' ? 'Calories' : 'Kaloriya'}
                      </span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">
                        {selectedItemModal.calories || '450 kcal'}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {lang === 'it' ? 'Tradizione' : lang === 'en' ? 'Heritage' : 'An\'ana'}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 block mt-0.5">
                        {selectedItemModal.category === 'pastry' ? 'Tandir & Forno' : 'Qozon & Damlash'}
                      </span>
                    </div>
                  </div>

                  {/* Master Chef Secret Quote Card */}
                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 text-[#0c594d] font-bold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'it' ? 'Segreto del Maestro Oshpaz' : lang === 'en' ? 'Master Chef Secret' : 'Oshpazning Bosh Siri'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed italic text-emerald-900 font-normal">
                      "{selectedItemModal[`secret_${lang}`] || selectedItemModal.secret_uz}"
                    </p>
                  </div>

                </div>

                {/* RIGHT COLUMN (lg:col-span-7): Title, Navigation & Full Recipe Steps */}
                <div className="lg:col-span-7 flex flex-col h-full bg-white overflow-hidden">
                  
                  {/* Title Header */}
                  <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0">
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                      {selectedItemModal[`name_${lang}`] || selectedItemModal.name_uz}
                    </h3>
                    <p className="text-xs text-slate-500 font-light mt-1">
                      {selectedItemModal[`region_${lang}`] || selectedItemModal.region_uz} • {selectedItemModal.cookTime}
                    </p>
                  </div>

                  {/* Minimalist Tab Selector */}
                  {selectedItemModal.steps_uz && (
                    <div className="flex border-b border-slate-200 bg-white px-5 sm:px-6 gap-3 sm:gap-5 overflow-x-auto shrink-0 scrollbar-none">
                      <button
                        onClick={() => setDishModalTab('recipe')}
                        className={`py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                          dishModalTab === 'recipe'
                            ? 'border-[#0c594d] text-[#0c594d] font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {lang === 'it' ? 'Ricetta (8 Passaggi)' : lang === 'en' ? 'Recipe (8 Steps)' : '8 Bosqichli Retsept'}
                      </button>
                      <button
                        onClick={() => setDishModalTab('ingredients')}
                        className={`py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                          dishModalTab === 'ingredients'
                            ? 'border-[#0c594d] text-[#0c594d] font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {lang === 'it' ? 'Ingredienti' : lang === 'en' ? 'Ingredients' : 'Masalliqlar'}
                      </button>
                      <button
                        onClick={() => setDishModalTab('rice')}
                        className={`py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                          dishModalTab === 'rice'
                            ? 'border-[#0c594d] text-[#0c594d] font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {lang === 'it' ? 'Segreti dello Chef' : lang === 'en' ? 'Chef Secrets' : 'Pazandachilik Sirlari'}
                      </button>
                      <button
                        onClick={() => setDishModalTab('story')}
                        className={`py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                          dishModalTab === 'story'
                            ? 'border-[#0c594d] text-[#0c594d] font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {lang === 'it' ? 'Storia & Tradizione' : lang === 'en' ? 'Heritage & Story' : 'Tarixi'}
                      </button>
                    </div>
                  )}

                  {/* Scrollable Tab Content */}
                  <div className="p-5 sm:p-6 space-y-5 text-sm overflow-y-auto flex-1">
                    {selectedItemModal.steps_uz ? (
                      <>
                        {/* TAB 1: 8 BOSQICHLI RETSEPT */}
                        {dishModalTab === 'recipe' && (
                          <div className="space-y-4 animate-fade-in">
                            <div className="pb-2 border-b border-slate-100">
                              <h4 className="font-serif font-black text-slate-900 text-sm sm:text-base">
                                {lang === 'it' ? 'Metodo di Preparazione Passo dopo Passo' : lang === 'en' ? 'Step-by-Step Cooking Directions' : 'Bosqichma-bosqich Tayyorlash Usuli'}
                              </h4>
                              <p className="text-xs text-slate-500 font-light">
                                {selectedItemModal.category === 'pastry'
                                  ? (lang === 'it' ? '8 passaggi per una sfoglia perfetta e ripieno incredibilmente succoso.' : lang === 'en' ? '8 clear steps for crispy flaky pastry and succulent meat filling.' : 'Qarsildoq qatlama va sersuv qiyma hosil qilishning 8 ta aniq bosqichi.')
                                  : (lang === 'it' ? '8 fasi dettagliate dal soffritto dorato alla perfetta cottura finale.' : lang === 'en' ? '8 clear stages from searing ingredients to final gentle perfection.' : 'Dastlabki tayyorgarlikdan tortishgacha bo\'lgan 8 ta aniq bosqich.')}
                              </p>
                            </div>

                            <div className="space-y-2.5">
                              {(selectedItemModal[`steps_${lang}`] || selectedItemModal.steps_uz || []).map((step, idx) => (
                                <div 
                                  key={idx} 
                                  className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 hover:border-emerald-300 transition-colors flex gap-3 items-start"
                                >
                                  <div className="w-6 h-6 rounded-full bg-[#0c594d] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs mt-0.5">
                                    {idx + 1}
                                  </div>
                                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Master Tip Box */}
                            <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs text-amber-900">
                              <p className="leading-relaxed">
                                <strong className="text-amber-950 font-bold">{lang === 'it' ? 'Regola d\'oro:' : lang === 'en' ? 'Golden Rule:' : 'Oltin Qoida:'}</strong>{' '}
                                {selectedItemModal.category === 'pastry'
                                  ? (lang === 'it' ? 'Non tritare mai la carne a macchina: tagliarla a cubetti al coltello mantiene il succo naturale intrappolato all\'interno!' : lang === 'en' ? 'Never grind the meat in a machine: hand-dicing keeps the succulent juices bursting inside each bite!' : 'Go\'shtni aslo qiymalagichdan chiqarmang: pichoqda mayda to\'g\'rash barcha shira va sersuvlikni somsa ichida saqlab qoladi!')
                                  : (lang === 'it' ? 'Durante la fase di damlash (vaporizzazione finale), non sollevare mai il coperchio per 10-15 minuti!' : lang === 'en' ? 'During the damlash (final steaming), never open the lid for 10-15 minutes!' : 'Damlash jarayonida qozon qopqog\'ini 10-15 daqiqa davomida aslo ochmang!')}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* TAB 2: MASALLIQLAR */}
                        {dishModalTab === 'ingredients' && (
                          <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <div>
                                <h4 className="font-serif font-black text-slate-900 text-sm sm:text-base">
                                  {lang === 'it' ? 'Ingredienti Ufficiali' : lang === 'en' ? 'Official Ingredients' : 'To\'liq Masalliqlar Ro\'yxati'}
                                </h4>
                                <p className="text-xs text-slate-500 font-light">
                                  {lang === 'it' 
                                    ? 'Misurazioni precise testate per garantire equilibrio aromatico e fragranza.' 
                                    : lang === 'en' 
                                      ? 'Exact tested measurements for authentic flavor and crisp texture.' 
                                      : 'Mukammal ta\'m va me\'yor uchun aniq o\'lchangan masalliqlar.'}
                                </p>
                              </div>
                              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                                {selectedItemModal[`servings_${lang}`] || selectedItemModal.servings_uz}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(selectedItemModal[`ingredients_${lang}`] || selectedItemModal.ingredients_uz || []).map((ing, i) => (
                                <div 
                                  key={i} 
                                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center gap-2.5 text-xs text-slate-800"
                                >
                                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#0c594d] flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </div>
                                  <span className="font-medium">{ing}</span>
                                </div>
                              ))}
                            </div>

                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1 font-light">
                              <p className="font-semibold text-slate-800">
                                {lang === 'it' ? 'Note pratiche per la preparazione:' : lang === 'en' ? 'Practical cooking notes:' : 'Pazandachilik bo\'yicha amaliy maslahatlar:'}
                              </p>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                                {selectedItemModal.category === 'pastry' ? (
                                  <>
                                    <li>{lang === 'it' ? 'Pasta sfoglia: confezione da 10 quadrati già pronta (puff pastry) di ottima qualità.' : lang === 'en' ? 'Puff pastry: pack of 10 ready-rolled squares of good quality.' : 'Qatlama xamir: 10 ta tayyor kvadratli sifatli puff pastry.'}</li>
                                    <li>{lang === 'it' ? 'Carne: fresco agnello o manzo magro tagliato finemente al coltello.' : lang === 'en' ? 'Meat: fresh lamb or lean beef, hand-diced very finely.' : 'Go\'sht: yangi qo\'y yoki lahm mol go\'shti, o\'tkir pichoqda maydalangan.'}</li>
                                    <li>{lang === 'it' ? 'Cipolle: 2 grandi cipolle dolci per donare abbondante succosità.' : lang === 'en' ? 'Onions: 2 large sweet onions to create rich natural broth inside.' : 'Piyoz: sersuvlik uchun 2 dona yirik shirin piyoz.'}</li>
                                  </>
                                ) : (
                                  <>
                                    <li>{lang === 'it' ? 'Carne: preferibile fresco agnello con osso o tenero manzo.' : lang === 'en' ? 'Meat: fresh bone-in lamb or tender marbled beef.' : 'Go\'sht: yangi qo\'y yoki yumshoq mol go\'shti.'}</li>
                                    <li>{lang === 'it' ? 'Cumino: usare solo cumino zira di montagna per aroma autentico.' : lang === 'en' ? 'Spices: whole mountain cumin (zira) yields unforgettable fragrance.' : 'Ziravorlar: sara tog\' zirasi va maydalangan kashnich urug\'i.'}</li>
                                    <li>{lang === 'it' ? 'Verdure fresche: tagliare in modo uniforme per garantire cottura perfetta.' : lang === 'en' ? 'Vegetables: slice uniformly to ensure even cooking.' : 'Sabzavotlar: bir xil shaklda to\'g\'rash bir tekis pishish garovidir.'}</li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* TAB 3: PAZANDACHILIK SIRLARI */}
                        {dishModalTab === 'rice' && (
                          <div className="space-y-3.5 animate-fade-in">
                            <div className="pb-2 border-b border-slate-100">
                              <h4 className="font-serif font-black text-slate-900 text-sm sm:text-base">
                                {lang === 'it' ? 'Segreti dello Chef & Tecnica Tradizionale' : lang === 'en' ? 'Chef Secrets & Traditional Technique' : 'Pazandachilik Sirlari va Maxsus Texnika'}
                              </h4>
                              <p className="text-xs text-slate-500 font-light">
                                {lang === 'it' ? 'Consigli pratici e regole essenziali per ottenere un risultato perfetto.' : lang === 'en' ? 'Practical tips and essential guidelines for authentic results.' : 'Taomni mukammal darajada pishirish uchun amaliy va sinalgan sirlar.'}
                              </p>
                            </div>

                            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
                              <h5 className="text-xs font-bold text-slate-900">
                                {selectedItemModal.category === 'pastry'
                                  ? (lang === 'it' ? 'Segreti della Pasta Sfoglia (Puff Pastry & Porzionatura)' : lang === 'en' ? 'Puff Pastry Secrets & Proper Sizing' : 'Qatlama Xamir (Puff Pastry) va Bo\'laklash Siri')
                                  : (lang === 'it' ? 'Scelta delle Materie Prime & Varietà' : lang === 'en' ? 'Ingredient Selection & Varieties' : 'Asosiy Masalliqlar va Tanlash Qo\'llanmasi')}
                              </h5>
                              <p className="text-xs text-slate-600 leading-relaxed font-light">
                                {selectedItemModal[`riceGuide_${lang}`] || selectedItemModal.riceGuide_uz}
                              </p>
                            </div>

                            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
                              <h5 className="text-xs font-bold text-slate-900">
                                {selectedItemModal.category === 'pastry'
                                  ? (lang === 'it' ? 'Temperatura del Forno a Due Stadi (215°C poi 175°C)' : lang === 'en' ? 'Two-Stage Oven Baking (420°F then 350°F)' : 'Duxovka Harorati: Ikki Bosqichli Pishirish')
                                  : (lang === 'it' ? 'Calore, Fuoco e Metodo di Cottura' : lang === 'en' ? 'Heat Control & Cooking Methods' : 'Olov Harorati va Idish Tanlash')}
                              </h5>
                              <p className="text-xs text-slate-600 leading-relaxed font-light">
                                {selectedItemModal[`cookerGuide_${lang}`] || selectedItemModal.cookerGuide_uz}
                              </p>
                            </div>

                            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
                              <h5 className="text-xs font-bold text-slate-900">
                                {selectedItemModal.category === 'pastry'
                                  ? (lang === 'it' ? 'Ripieno Succoso al Coltello e Cipolla Dolce' : lang === 'en' ? 'Succulent Hand-Diced Meat & Onion Juices' : 'Sersuv Qiyma: Go\'shtni Pichoqda To\'g\'rash Siri')
                                  : (lang === 'it' ? 'Tecnica di Taglio e Preparazione' : lang === 'en' ? 'Cutting Technique & Preparation' : 'To\'g\'rash Texnikasi va Masalliqlar')}
                              </h5>
                              <p className="text-xs text-slate-600 leading-relaxed font-light">
                                {selectedItemModal[`carrotsGuide_${lang}`] || selectedItemModal.carrotsGuide_uz}
                              </p>
                            </div>

                            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
                              <h5 className="text-xs font-bold text-slate-900">
                                {selectedItemModal.category === 'pastry'
                                  ? (lang === 'it' ? 'Doratura all\'Uovo & Semi Tradizionali' : lang === 'en' ? 'Golden Egg Wash & Traditional Seeds' : 'Yarqiroq Tuxum va Qora Sedana Sirlari')
                                  : (lang === 'it' ? 'Aromi, Ziravorlar e Finitura' : lang === 'en' ? 'Aromatics, Spices & Finishing Touches' : 'Ziravorlar va Xushbo\'y Qo\'shimchalar')}
                              </h5>
                              <p className="text-xs text-slate-600 leading-relaxed font-light">
                                {selectedItemModal[`aromaticsGuide_${lang}`] || selectedItemModal.aromaticsGuide_uz}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* TAB 4: TARIXI VA TAVSIF */}
                        {dishModalTab === 'story' && (
                          <div className="space-y-3.5 animate-fade-in">
                            <div className="pb-2 border-b border-slate-100">
                              <h4 className="font-serif font-black text-slate-900 text-sm sm:text-base">
                                {lang === 'it' ? 'Storia, Tradizione & Patrimonio' : lang === 'en' ? 'Heritage, Culture & Legacy' : 'Tarixi, Madaniyati va An\'analari'}
                              </h4>
                              <p className="text-xs text-slate-500 font-light">
                                {lang === 'it' 
                                  ? 'Il sapore autentico dell\'ospitalità e della cucina tradizionale uzbeka.' 
                                  : lang === 'en' 
                                    ? 'The timeless taste of Uzbek hospitality and culinary heritage.' 
                                    : 'O\'zbek dasturxonining asriy an\'anasi va madaniy merosi.'}
                              </p>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                                {selectedItemModal[`story_${lang}`] || selectedItemModal.story_uz}
                              </p>
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                                {selectedItemModal[`history_${lang}`] || selectedItemModal.history_uz}
                              </p>
                            </div>

                            {selectedItemModal.sourceUrl && (
                              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                                <span className="font-medium text-[11px]">
                                  {lang === 'it' ? 'Retsept va ma\'lumotlar arbuz.com tajribasi asosida' : lang === 'en' ? 'Recipe & experience based on arbuz.com culinary guide' : 'Retsept va ma\'lumotlar arbuz.com tajribasi asosida'}
                                </span>
                                <a 
                                  href={selectedItemModal.sourceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-bold text-[#0c594d] hover:underline flex items-center gap-1"
                                >
                                  <span>{selectedItemModal.sourceUrl.replace('https://', '')}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Standard fallback dish modal */
                      <div className="space-y-4">
                        <p className="text-slate-600 leading-relaxed font-light text-xs sm:text-sm">
                          {selectedItemModal[`history_${lang}`] || selectedItemModal.history_uz}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
                    <button
                      onClick={() => setSelectedItemModal(null)}
                      className="py-2 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {lang === 'it' ? 'Chiudi' : lang === 'en' ? 'Close' : 'Yopish'}
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ) : (
            /* INSTRUMENT MODAL (Clean, Spacious & Unobstructed Minimalist Header) */
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-xl sm:max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up max-h-[92vh] flex flex-col"
            >
              {/* Full Unobstructed Instrument Image Header */}
              <div className="relative w-full h-64 sm:h-72 bg-slate-900 shrink-0 overflow-hidden flex items-center justify-center">
                <img 
                  src={selectedItemModal.image} 
                  alt={selectedItemModal[`name_${lang}`] || selectedItemModal.name_uz}
                  className="w-full h-full object-contain p-3"
                />
                <button
                  onClick={() => setSelectedItemModal(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all cursor-pointer z-20 hover:scale-105"
                  title="Close"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Clean Minimalist Title & Metadata Section (Below Image) */}
              <div className="px-6 sm:px-8 pt-5 pb-4 border-b border-slate-100 bg-white shrink-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {lang === 'it' ? 'Strumento Tradizionale' : lang === 'en' ? 'Traditional Instrument' : 'Milliy Cholg\'u'}
                  </span>
                  <span className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-medium">
                    {selectedItemModal[`category_${lang}`] || selectedItemModal.category_uz}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                  {selectedItemModal[`name_${lang}`] || selectedItemModal.name_uz}
                </h3>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1">
                <p className="text-slate-600 leading-relaxed font-light text-xs sm:text-sm">
                  {selectedItemModal[`description_${lang}`] || selectedItemModal.description_uz}
                </p>

                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1.5">
                  <span className="text-xs font-bold text-[#0c594d] block">
                    {lang === 'it' ? 'Caratteristiche e Materiali:' : lang === 'en' ? 'Craftsmanship & Materials:' : 'Material va Cholg\'u Xususiyatlari:'}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedItemModal[`materials_${lang}`] || selectedItemModal.materials_it || selectedItemModal.materials_uz}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    {lang === 'it' ? 'Timbro Sonoro:' : lang === 'en' ? 'Acoustic Timbre:' : 'Tovush Timbri:'}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {selectedItemModal[`timber_${lang}`] || selectedItemModal.timber_uz}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    {lang === 'it' ? 'Generi Tradizionali:' : lang === 'en' ? 'Traditional Genres:' : 'Musiqiy Janrlar:'}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {selectedItemModal[`genres_${lang}`] || selectedItemModal.genres_uz}
                  </p>
                </div>

                {selectedItemModal.youtubeId && (
                  <button
                    onClick={() => {
                      const inst = selectedItemModal;
                      setSelectedItemModal(null);
                      setActiveVideoModal(inst);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-50/90 hover:bg-[#0c594d] text-emerald-950 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200/80 hover:border-[#0c594d] transition-all cursor-pointer mt-2 shadow-2xs group/btn"
                  >
                    <Play className="w-4 h-4 fill-current transition-transform group-hover/btn:scale-110" />
                    <span>{lang === 'it' ? 'Ascolta il Brano Tradizionale' : lang === 'en' ? 'Listen to Traditional Melody' : 'Kuyini Tinglash'}</span>
                  </button>
                )}
              </div>

              {/* Bottom Footer Actions */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedItemModal(null)}
                  className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {lang === 'it' ? 'Chiudi' : lang === 'en' ? 'Close' : 'Yopish'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* YOUTUBE VIDEO / AUDIO PLAYER MODAL (Light & Minimalist) */}
      {activeVideoModal && (
        <div 
          onClick={() => setActiveVideoModal(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-slate-800 rounded-3xl max-w-xl sm:max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0c594d] border border-emerald-200/60 flex items-center justify-center">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0c594d] block">
                    {activeVideoModal[`category_${lang}`] || activeVideoModal.category_uz}
                  </span>
                  <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 leading-tight">
                    {activeVideoModal[`name_${lang}`] || activeVideoModal.name_uz}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive YouTube Player */}
            <div className="relative aspect-video w-full bg-slate-950">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId}?autoplay=1&rel=0`}
                title={activeVideoModal.name_uz}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>

            {/* Video Info (Light & Minimalist - No external YouTube button) */}
            <div className="p-5 sm:p-6 space-y-3 bg-white">
              <div className="text-xs text-slate-700 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                <span className="text-[#0c594d] font-bold">{lang === 'it' ? 'Timbro:' : lang === 'en' ? 'Timbre:' : 'Timbri:'}</span>
                <span className="text-slate-700">{activeVideoModal[`timber_${lang}`] || activeVideoModal.timber_uz}</span>
              </div>

              <p className="text-xs text-slate-600 font-light leading-relaxed">
                {activeVideoModal[`description_${lang}`] || activeVideoModal.description_uz}
              </p>

              <div className="pt-1">
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {lang === 'it' ? 'Chiudi' : lang === 'en' ? 'Close' : 'Yopish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
