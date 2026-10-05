// 3 Complete Production Units for Duolingo Uzbek for Italian Speakers
// Modalities: READING, LISTENING, WRITING (AI Evaluated), SPEAKING, MATCHING

export const duolingoUnitsData = [
  {
    id: "unit-1",
    unitNumber: 1,
    title_it: "Unità 1: Saluti e Presentazioni",
    title_en: "Unit 1: Greetings & Introductions",
    title_uz: "1-Bo'lim: Salomlashish va Tanishuv",
    description_it: "Impara a salutare con rispetto lungo la Via della Seta e presentarti in uzbeko.",
    icon: "👋",
    badgeColor: "from-emerald-500 to-teal-600",
    bgPattern: "bg-emerald-50 border-emerald-200",
    grammarRule_it: "In uzbeko, il saluto formale e universale è 'Assalomu alaykum' (La pace sia con te), a cui si risponde obbligatoriamente 'Va alaykum assalom'. Per esprimere rispetto verso persone anziane o sconosciute si usa il pronome 'Siz' (corrispondente al 'Lei' di cortesia italiano).",
    grammarTip_uz: "Assalomu alaykum — salomlashish odobi bo'lib, unga 'Va alaykum assalom' deb javob qaytariladi. Hurmat ma'nosida doim 'Siz' deb murojaat qilinadi.",
    lessons: [
      {
        id: "lesson-1-1",
        orderNumber: 1,
        title_it: "Lezione 1.1: I Primi Saluti",
        title_uz: "1.1-Dars: Ilk Salomlar",
        xp: 15,
        exercises: [
          {
            id: "ex-1-1-1",
            type: "MATCHING",
            prompt_it: "Collega le coppie di parole corrispondenti:",
            prompt_uz: "Mos so'zlarni birlashtiring:",
            pairs: [
              { uz: "Assalomu alaykum", it: "Buongiorno / Salve" },
              { uz: "Va alaykum assalom", it: "E a te la pace (risposta)" },
              { uz: "Rahmat", it: "Grazie" },
              { uz: "Xayr", it: "Arrivederci" }
            ]
          },
          {
            id: "ex-1-1-2",
            type: "READING",
            prompt_it: "Come si risponde tradizionalmente al saluto 'Assalomu alaykum'?",
            prompt_uz: "'Assalomu alaykum'ga qanday javob beriladi?",
            options: [
              "Va alaykum assalom",
              "Katta rahmat",
              "Xayr, salomat bo'ling",
              "Ismingiz nima?"
            ],
            correctAnswer: "Va alaykum assalom",
            explanation_it: "La risposta canonica inverte la formula: 'Va alaykum assalom'."
          },
          {
            id: "ex-1-1-3",
            type: "LISTENING",
            prompt_it: "Ascolta l'audio e componi la frase nell'ordine corretto:",
            prompt_uz: "Audioni tinglang va so'zlarni tartib bilan tering:",
            targetText: "Assalomu alaykum, xayrli tong",
            audioText: "Assalomu alaykum, xayrli tong",
            phonetic: "Ahs-sah-LAH-moo ah-LAY-koom, khye-er-LEE tohng",
            translation_it: "Buongiorno, buona mattinata",
            wordChips: ["xayrli", "Assalomu", "tong", "alaykum", "rahmat"]
          },
          {
            id: "ex-1-1-4",
            type: "WRITING",
            prompt_it: "Traduci in uzbeko: 'Grazie mille'",
            prompt_uz: "'Grazie mille' jumlasi o'zbekchaga qanday tarjima qilinadi?",
            expectedAnswer: "Katta rahmat",
            hint: "Usa la parola 'Katta' (grande) + 'Rahmat' (grazie)",
            grammarTip: "'Katta' so'zi sifat bo'lib, minnatdorchilikni kuchaytiradi."
          }
        ]
      },
      {
        id: "lesson-1-2",
        orderNumber: 2,
        title_it: "Lezione 1.2: Chiedere il Nome",
        title_uz: "1.2-Dars: Tanishuv va Ism",
        xp: 15,
        exercises: [
          {
            id: "ex-1-2-1",
            type: "READING",
            prompt_it: "Cosa significa la frase: 'Ismingiz nima?'",
            prompt_uz: "'Ismingiz nima?' jumlasi ma'nosi:",
            options: [
              "Come ti chiami?",
              "Da dove vieni?",
              "Come stai oggi?",
              "Parli italiano?"
            ],
            correctAnswer: "Come ti chiami?",
            explanation_it: "'Ism' significa nome, '-ingiz' è il suffisso di cortesia."
          },
          {
            id: "ex-1-2-2",
            type: "LISTENING",
            prompt_it: "Ascolta la registrazione e seleziona la frase pronunciata:",
            prompt_uz: "Tinglang va to'g'ri jumlani belgilang:",
            targetText: "Mening ismim Marco",
            audioText: "Mening ismim Marco",
            phonetic: "Meh-NEENG ees-MEEM Marco",
            translation_it: "Il mio nome è Marco",
            options: [
              "Mening ismim Marco",
              "Sizning ismingiz Marco",
              "Assalomu alaykum Marco",
              "Ismim nima Marco"
            ],
            correctAnswer: "Mening ismim Marco"
          },
          {
            id: "ex-1-2-3",
            type: "WRITING",
            prompt_it: "Scrivi in uzbeko la risposta: 'Il mio nome è Luca'",
            prompt_uz: "'Il mio nome è Luca' jumlasini o'zbekcha yozing:",
            expectedAnswer: "Mening ismim Luca",
            hint: "Mening ismim...",
            grammarTip: "'Mening' = mio, 'ismim' = il mio nome (suffisso -im)."
          },
          {
            id: "ex-1-2-4",
            type: "SPEAKING",
            prompt_it: "Pronuncia ad alta voce nel microfono:",
            prompt_uz: "Ovoz chiqarib ayting:",
            targetText: "Tanishganimdan xursandman",
            phonetic: "Tah-neesh-gah-neem-dahn khoor-SAHND-mahn",
            translation_it: "Piacere di conoscerti / Sono felice di conoscerti"
          }
        ]
      },
      {
        id: "lesson-1-3",
        orderNumber: 3,
        title_it: "Lezione 1.3: Cortesia e Buone Maniere",
        title_uz: "1.3-Dars: Xushmuomalalik Qoidalari",
        xp: 20,
        exercises: [
          {
            id: "ex-1-3-1",
            type: "MATCHING",
            prompt_it: "Collega le espressioni di cortesia:",
            prompt_uz: "Odob iboralarini tutashtiring:",
            pairs: [
              { uz: "Kechirasiz", it: "Mi scusi / Scusa" },
              { uz: "Marhamat", it: "Prego / Benvenuto" },
              { uz: "Salomat bo'ling", it: "Stia bene / Buona salute" },
              { uz: "Xush kelibsiz", it: "Benvenuti in Uzbekistan" }
            ]
          },
          {
            id: "ex-1-3-2",
            type: "WRITING",
            prompt_it: "Traduci in uzbeko: 'Mi scusi, per favore'",
            prompt_uz: "'Mi scusi, per favore' jumlasini yozing:",
            expectedAnswer: "Kechirasiz, iltimos",
            hint: "Kechirasiz + iltimos",
            grammarTip: "'Kechirasiz' uzr so'rashda eng xushmuomala so'zdir."
          },
          {
            id: "ex-1-3-3",
            type: "LISTENING",
            prompt_it: "Ascolta l'augurio di commiato:",
            prompt_uz: "Xayrlashuv tilagini tinglang va so'zlarni tering:",
            targetText: "Xayr, salomat bo'ling",
            audioText: "Xayr, salomat bo'ling",
            phonetic: "Khye-er, sah-loh-maht boh-leeng",
            translation_it: "Arrivederci, stia bene in salute",
            wordChips: ["salomat", "Xayr,", "bo'ling", "rahmat", "tong"]
          }
        ]
      }
    ]
  },
  {
    id: "unit-2",
    unitNumber: 2,
    title_it: "Unità 2: Al Mercato e Contrattare",
    title_en: "Unit 2: Bargaining at Chorsu Market",
    title_uz: "2-Bo'lim: Bozor va Savdolashish",
    description_it: "Scopri come chiedere i prezzi, negoziare sconti e fare acquisti al Bazar Chorsu.",
    icon: "🛍️",
    badgeColor: "from-amber-500 to-orange-600",
    bgPattern: "bg-amber-50 border-amber-200",
    grammarRule_it: "La formula d'oro per negoziare al bazar è 'Arzonroq qilib bering' (Mi faccia un prezzo più basso, per favore). Ricorda: in uzbeko, dopo i numeri, i nomi restano SEMPRE al singolare (es. 'besh non' = 5 pani, non 5 pani al plurale).",
    grammarTip_uz: "Bozorda narx so'rashda 'Bu qancha?' yoki 'Narxi qancha?' deyiladi. Sonlardan so'ng otlar ko'plik qo'shimchasisiz ishlatiladi.",
    lessons: [
      {
        id: "lesson-2-1",
        orderNumber: 1,
        title_it: "Lezione 2.1: Chiedere i Prezzi",
        title_uz: "2.1-Dars: Narx So'rash",
        xp: 15,
        exercises: [
          {
            id: "ex-2-1-1",
            type: "READING",
            prompt_it: "Come chiedi a un mercante: 'Quanto costa questo?'",
            prompt_uz: "'Bu qancha?' savolini toping:",
            options: [
              "Bu qancha?",
              "Bu nima?",
              "Ismingiz nima?",
              "Qayerga borasiz?"
            ],
            correctAnswer: "Bu qancha?",
            explanation_it: "'Bu' significa questo, 'qancha' significa quanto."
          },
          {
            id: "ex-2-1-2",
            type: "LISTENING",
            prompt_it: "Ascolta e componi la frase di richiesta prezzo:",
            prompt_uz: "Audioni eshiting va so'zlarni tering:",
            targetText: "Nonning narxi qancha?",
            audioText: "Nonning narxi qancha?",
            phonetic: "Nohn-neeng nahr-KHEE kahn-CHAH?",
            translation_it: "Quanto costa il pane?",
            wordChips: ["narxi", "Nonning", "qancha?", "qayerda", "choy"]
          },
          {
            id: "ex-2-1-3",
            type: "WRITING",
            prompt_it: "Traduci in uzbeko: 'Quanto costa?'",
            prompt_uz: "'Quanto costa?' jumlasini o'zbekcha yozing:",
            expectedAnswer: "Narxi qancha?",
            hint: "Narxi qancha? yoki Bu qancha?",
            grammarTip: "'Narx' = narx/qiymat, '-i' = uning narxi."
          }
        ]
      },
      {
        id: "lesson-2-2",
        orderNumber: 2,
        title_it: "Lezione 2.2: L'Arte di Negoziare",
        title_uz: "2.2-Dars: Savdolashish San'ati",
        xp: 15,
        exercises: [
          {
            id: "ex-2-2-1",
            type: "MATCHING",
            prompt_it: "Collega i termini del commercio tradizionale:",
            prompt_uz: "Savdo atamalarini juftlang:",
            pairs: [
              { uz: "Arzonroq qilib bering", it: "Mi faccia uno sconto" },
              { uz: "Chegirma bormi?", it: "C'è uno sconto?" },
              { uz: "Qimmat", it: "Caro / Costoso" },
              { uz: "Arzon", it: "Economico" }
            ]
          },
          {
            id: "ex-2-2-2",
            type: "WRITING",
            prompt_it: "Traduci in uzbeko: 'È troppo caro'",
            prompt_uz: "'È troppo caro' jumlasini yozing:",
            expectedAnswer: "Juda qimmat",
            hint: "Usa 'Juda' (molto) + 'Qimmat' (caro)",
            grammarTip: "'Juda' so'zi sifat darajasini kuchaytiradi."
          },
          {
            id: "ex-2-2-3",
            type: "SPEAKING",
            prompt_it: "Pronuncia la classica frase per chiedere lo sconto:",
            prompt_uz: "Mikrofonga aniq ayting:",
            targetText: "Arzonroq qilib bering",
            phonetic: "Ahr-zohn-ROHK kee-LEEP beh-REENG",
            translation_it: "Mi faccia un prezzo più basso, per favore"
          }
        ]
      },
      {
        id: "lesson-2-3",
        orderNumber: 3,
        title_it: "Lezione 2.3: Numeri e Pagamento",
        title_uz: "2.3-Dars: Sanoq va To'lov",
        xp: 20,
        exercises: [
          {
            id: "ex-2-3-1",
            type: "READING",
            prompt_it: "Come chiedi se è possibile pagare con carta di credito?",
            prompt_uz: "Karta orqali to'lov imkoniyatini qanday so'raysiz?",
            options: [
              "Karta bilan to'lasa bo'ladimi?",
              "Naqd pul bera olasizmi?",
              "Bu qimmatmi?",
              "Menyu bering"
            ],
            correctAnswer: "Karta bilan to'lasa bo'ladimi?",
            explanation_it: "'-bilan' significa con, 'to'lasa bo'ladimi' è la forma di possibilità (posso pagare?)."
          },
          {
            id: "ex-2-3-2",
            type: "MATCHING",
            prompt_it: "Abbina i numeri uzbeki:",
            prompt_uz: "Raqamlarni birlashtiring:",
            pairs: [
              { uz: "Bir", it: "Uno (1)" },
              { uz: "Ikki", it: "Due (2)" },
              { uz: "Uch", it: "Tre (3)" },
              { uz: "O'n ming", it: "Diecimila (10.000)" }
            ]
          },
          {
            id: "ex-2-3-3",
            type: "WRITING",
            prompt_it: "Traduci in uzbeko: 'Pagamento in contanti'",
            prompt_uz: "'Pagamento in contanti' iborasini yozing:",
            expectedAnswer: "Naqd pul",
            hint: "Naqd + pul",
            grammarTip: "'Naqd' = contanti, 'pul' = denaro."
          }
        ]
      }
    ]
  },
  {
    id: "unit-3",
    unitNumber: 3,
    title_it: "Unità 3: Al Ristorante e Chayxona",
    title_en: "Unit 3: Dining at a Traditional Chaykhana",
    title_uz: "3-Bo'lim: Choyxona va Taomlar",
    description_it: "Ordina i migliori piatti tradizionali: Plov, Somsa, Lagman e del buon tè verde.",
    icon: "🍽️",
    badgeColor: "from-rose-500 to-pink-600",
    bgPattern: "bg-rose-50 border-rose-200",
    grammarRule_it: "Nei ristoranti e nelle choyxona uzbekhe si usa la forma cortese '...bering' (dia/porti per favore): 'Osh bering' (Mi porti del Plov) o 'Bir choynak ko'k choy bering'. Per congratularsi con il cuoco, l'esclamazione più gradita è 'Juda mazali!' (È delizioso!).",
    grammarTip_uz: "Buyurtma berishda taom nomidan keyin 'bering, iltimos' qo'shiladi: 'Osh bering, iltimos'. Choyxonada doim choynak bilan buyurtma beriladi.",
    lessons: [
      {
        id: "lesson-3-1",
        orderNumber: 1,
        title_it: "Lezione 3.1: Ordinare al Tavolo",
        title_uz: "3.1-Dars: Buyurtma Berish",
        xp: 15,
        exercises: [
          {
            id: "ex-3-1-1",
            type: "READING",
            prompt_it: "Come si chiede educatamente il menu al cameriere?",
            prompt_uz: "Ofitsiantdan menyuni qanday so'raysiz?",
            options: [
              "Menyu bering, iltimos",
              "Hisobni keltiring",
              "Suv bering",
              "Qayerda o'tiramiz?"
            ],
            correctAnswer: "Menyu bering, iltimos",
            explanation_it: "'Menyu bering, iltimos' è la formula formale corretta."
          },
          {
            id: "ex-3-1-2",
            type: "LISTENING",
            prompt_it: "Ascolta l'ordinazione e componi la frase:",
            prompt_uz: "Audioni tinglang va so'zlarni tering:",
            targetText: "Bir choynak ko'k choy bering",
            audioText: "Bir choynak ko'k choy bering",
            phonetic: "BEER choy-NAHK kohk choy beh-REENG",
            translation_it: "Per favore porti una teiera di tè verde",
            wordChips: ["ko'k", "Bir", "bering", "choynak", "choy", "osh"]
          },
          {
            id: "ex-3-1-3",
            type: "WRITING",
            prompt_it: "Traduci in uzbeko: 'Un tè verde per favore'",
            prompt_uz: "'Ko'k choy bering' jumlasini yozing:",
            expectedAnswer: "Ko'k choy bering, iltimos",
            hint: "Ko'k choy bering, iltimos",
            grammarTip: "'Ko'k choy' = tè verde tradizionale uzbeko."
          }
        ]
      },
      {
        id: "lesson-3-2",
        orderNumber: 2,
        title_it: "Lezione 3.2: I Grandi Piatti Tradizionali",
        title_uz: "3.2-Dars: Milliy Taomlar",
        xp: 15,
        exercises: [
          {
            id: "ex-3-2-1",
            type: "MATCHING",
            prompt_it: "Collega i piatti celebri uzbeki con la descrizione:",
            prompt_uz: "Milliy taomlarni tasnifi bilan juftlang:",
            pairs: [
              { uz: "Osh (Palov)", it: "Riso pilaf con carne, carote e spezie" },
              { uz: "Somsa", it: "Fagottino di pasta sfoglia con carne al tandoor" },
              { uz: "Shashlik", it: "Spiedini di carne alla brace" },
              { uz: "Lag'mon", it: "Tagliatelle tirate a mano con verdure" }
            ]
          },
          {
            id: "ex-3-2-2",
            type: "READING",
            prompt_it: "Come si dice per complimentarsi: 'È buonissimo / delizioso!'?",
            prompt_uz: "'È delizioso!' ma'nosini bildiruvchi o'zbekcha ibora:",
            options: [
              "Juda mazali!",
              "Juda qimmat!",
              "Kechirasiz!",
              "Hisob bering!"
            ],
            correctAnswer: "Juda mazali!",
            explanation_it: "'Mazali' significa saporito/delizioso, 'juda' significa molto!"
          },
          {
            id: "ex-3-2-3",
            type: "SPEAKING",
            prompt_it: "Complimentati con il cuoco esclamando al microfono:",
            prompt_uz: "Oshpazga minnatdorchilik bildiring:",
            targetText: "Osh juda mazali bo'libdi",
            phonetic: "Ohsh JOO-dah mah-zah-LEE boh-LEEP-tee",
            translation_it: "Il Plov è riuscito incredibilmente squisito"
          }
        ]
      },
      {
        id: "lesson-3-3",
        orderNumber: 3,
        title_it: "Lezione 3.3: Chiedere il Conto",
        title_uz: "3.3-Dars: Hisob-Kitob",
        xp: 20,
        exercises: [
          {
            id: "ex-3-3-1",
            type: "WRITING",
            prompt_it: "Traduci in uzbeko: 'Il conto, per favore'",
            prompt_uz: "'Il conto, per favore' jumlasini yozing:",
            expectedAnswer: "Hisobni keltiring, iltimos",
            hint: "Hisobni keltiring yoki Hisob bering",
            grammarTip: "'Hisob' = conto, '-ni' = accusativo (il conto)."
          },
          {
            id: "ex-3-3-2",
            type: "LISTENING",
            prompt_it: "Ascolta la domanda e seleziona il significato corretto:",
            prompt_uz: "Savolni eshiting va to'g'ri variantni tanlang:",
            targetText: "Xojatxona qayerda?",
            audioText: "Xojatxona qayerda?",
            phonetic: "Khoh-jaht-KHOH-nah kah-EHR-dah?",
            translation_it: "Dov'è il bagno?",
            options: [
              "Dov'è il bagno / la toilette?",
              "Dov'è l'uscita?",
              "Dov'è la stazione?",
              "Possiamo sederci qui?"
            ],
            correctAnswer: "Dov'è il bagno / la toilette?"
          },
          {
            id: "ex-3-3-3",
            type: "MATCHING",
            prompt_it: "Collega le richieste conclusive al ristorante:",
            prompt_uz: "Restorandagi yakuniy so'rovlarni juftlang:",
            pairs: [
              { uz: "Hisobni keltiring", it: "Porti il conto, per favore" },
              { uz: "Non bering", it: "Porti del pane naan" },
              { uz: "Muzli suv", it: "Acqua fredda" },
              { uz: "Katta rahmat", it: "Grazie mille di tutto" }
            ]
          }
        ]
      }
    ]
  }
];
