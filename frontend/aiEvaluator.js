// AI Evaluation Engine for EdTech Writing & Pronunciation

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[‘'ʻ’`"]/g, "'") // Normalize various apostrophes to standard single quote
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const d = [];

  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      if (s1[i - 1] === s2[j - 1]) {
        d[i][j] = d[i - 1][j - 1];
      } else {
        d[i][j] = Math.min(
          d[i - 1][j] + 1,     // deletion
          d[i][j - 1] + 1,     // insertion
          d[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return d[m][n];
}

export async function evaluateWriting({ prompt, expected, user_input, language = 'it' }) {
  const normUser = normalizeText(user_input);
  const normExpected = normalizeText(expected);

  if (!normUser) {
    return {
      is_correct: false,
      score: 0,
      feedback: language === 'it' 
        ? "Nessun testo inserito. Prova a digitare la traduzione." 
        : "Matn kiritilmadi. Iltimos, javobingizni yozing.",
      suggestions: [expected],
      grammar_tip: null
    };
  }

  // 1. Check exact match
  if (normUser === normExpected) {
    return {
      is_correct: true,
      score: 100,
      feedback: language === 'it' 
        ? "Eccellente! Traduzione impeccabile e naturale al 100%." 
        : "A'lo darajada! Hech qanday xatosiz to'liq to'g'ri.",
      suggestions: [],
      grammar_tip: "Perfetto uso dei suffissi e dell'ordine delle parole."
    };
  }

  // 2. Similarity calculation
  const distance = levenshteinDistance(normUser, normExpected);
  const maxLen = Math.max(normUser.length, normExpected.length);
  const similarity = Math.max(0, 1 - distance / maxLen);

  // Common acceptable synonyms & variations in Uzbek
  const synonyms = [
    { from: "bu qancha", to: "narxi qancha" },
    { from: "katta rahmat", to: "rahmat" },
    { from: "xayr", to: "xayr salomat boling" },
    { from: "mening ismim", to: "ismim" },
    { from: "iltimos", to: "iltimos bering" }
  ];

  let isSynonymMatch = false;
  for (const syn of synonyms) {
    if (
      (normExpected.includes(syn.from) && normUser.includes(syn.to)) ||
      (normExpected.includes(syn.to) && normUser.includes(syn.from))
    ) {
      isSynonymMatch = true;
      break;
    }
  }

  if (similarity >= 0.82 || isSynonymMatch) {
    const score = Math.round(Math.max(85, similarity * 100));
    return {
      is_correct: true,
      score,
      feedback: language === 'it'
        ? `Molto bene! (${score}/100) Risposta considerata corretta con lievi differenze o variazioni di battitura.`
        : `Juda yaxshi! (${score}/100) Javob to'g'ri deb qabul qilindi.`,
      suggestions: [expected],
      grammar_tip: "Nota: in uzbeko la lettera o' e g' hanno l'apostrofo tipografico."
    };
  } else if (similarity >= 0.55) {
    const score = Math.round(similarity * 100);
    return {
      is_correct: false,
      score,
      feedback: language === 'it'
        ? `Ci sei quasi (${score}/100), ma ci sono imprecisioni ortografiche o grammaticali.`
        : `Deyarli to'g'ri (${score}/100), ammo ayrim so'zlarda xatolik bor.`,
      suggestions: [expected],
      grammar_tip: `Forma corretta attesa: "${expected}". Controlla i suffissi o l'ordine delle parole.`
    };
  } else {
    return {
      is_correct: false,
      score: Math.round(similarity * 100),
      feedback: language === 'it'
        ? `Risposta errata. La traduzione corretta è: "${expected}".`
        : `Noto'g'ri javob. To'g'ri variant: "${expected}".`,
      suggestions: [expected],
      grammar_tip: "Rivedi la lista di vocaboli dell'unità prima di riprovare."
    };
  }
}

export async function evaluateSpeech({ target_text, recognized_text, language = 'it' }) {
  const normTarget = normalizeText(target_text);
  const normRec = normalizeText(recognized_text);

  if (!normRec) {
    return {
      accuracy: 0,
      is_acceptable: false,
      feedback: language === 'it' 
        ? "Nessuna voce rilevata dal microfono. Riprova parlando chiaramente." 
        : "Ovoz aniqlanmadi. Iltimos, mikrofonga yaqinroq gapiring."
    };
  }

  const distance = levenshteinDistance(normTarget, normRec);
  const maxLen = Math.max(normTarget.length, normRec.length);
  const accuracy = Math.round(Math.max(0, 1 - distance / maxLen) * 100);

  const isAcceptable = accuracy >= 70;

  return {
    accuracy,
    is_acceptable: isAcceptable,
    recognized_text,
    target_text,
    feedback: isAcceptable
      ? (language === 'it' 
          ? `Ottima pronuncia! (${accuracy}% di precisione). Il tuo accento è chiaro e comprensibile.` 
          : `A'lo darajadagi talaffuz! (${accuracy}% aniqlik).`)
      : (language === 'it' 
          ? `Pronuncia migliorabile (${accuracy}%). Prova ad ascoltare l'audio pilota e scandire bene le sillabe.` 
          : `Talaffuzni biroz mashq qilish tavsiya etiladi (${accuracy}%).`)
  };
}
