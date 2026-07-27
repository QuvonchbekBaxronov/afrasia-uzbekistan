import { culture } from '../data/db';
import { t } from '../utils/translations';

export default function Culture({ currentLang }) {
  const lang = currentLang?.code || 'it';

  const getCategoryName = (name) => {
    if (lang === 'it') {
      if (name === "Musiqa va Cholg'ular") return "Musica e Strumenti";
      if (name === "Milliy Kiyimlar") return "Abiti Tradizionali";
      if (name === "Hunarmandchilik") return "Artigianato";
    } else if (lang === 'en') {
      if (name === "Musiqa va Cholg'ular") return "Music & Instruments";
      if (name === "Milliy Kiyimlar") return "Traditional Clothing";
      if (name === "Hunarmandchilik") return "Crafts";
    }
    return name;
  };

  const getItemTranslation = (item) => {
    if (lang === 'it') {
      const itItems = {
        "Doira": "Doira (Tamburello)",
        "Rubob": "Rubab (Liuto)",
        "Dutor": "Dutar (Due corde)",
        "Nay": "Nay (Flauto di canna)",
        "Chang": "Chang (Salterio)",
        "Atlas": "Seta Atlas",
        "Adras": "Seta Adras",
        "Do'ppi": "Doppi (Copricapo)",
        "Chopon": "Chapan (Cappotto)",
        "Zardo'z to'n": "Zardoz (Toga dorata)",
        "Kashtachilik": "Kashtachilik (Ricamo)",
        "Kulolchilik": "Kulolchilik (Ceramica)",
        "Yog'och o'ymakorligi": "Scultura su legno",
        "Miskarlik": "Lavorazione del rame"
      };
      return itItems[item] || item;
    } else if (lang === 'en') {
      const enItems = {
        "Doira": "Doyra (Frame drum)",
        "Rubob": "Rubab (Lute)",
        "Dutor": "Dutar (Two-stringed)",
        "Nay": "Nay (Flute)",
        "Chang": "Chang (Dulcimer)",
        "Atlas": "Atlas Silk",
        "Adras": "Adras Silk",
        "Do'ppi": "Doppi (Skullcap)",
        "Chopon": "Chapan (Robe)",
        "Zardo'z to'n": "Gold-embroidered robe",
        "Kashtachilik": "Embroidery (Suzani)",
        "Kulolchilik": "Pottery & Ceramics",
        "Yog'och o'ymakorligi": "Wood carving",
        "Miskarlik": "Coppersmithing"
      };
      return enItems[item] || item;
    }
    return item;
  };

  const getSubtext = (name) => {
    const catName = getCategoryName(name).toLowerCase();
    if (lang === 'it') {
      return `Esempi unici ed eccezionali di ${catName} uzbeka, tramandati di generazione in generazione.`;
    } else if (lang === 'en') {
      return `Unique and exceptional examples of Uzbek ${catName}, passed down through generations.`;
    }
    return `O'zbek xalqining asrlar davomida shakllangan noyob va betakror ${catName} namunalari.`;
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <h1 className="text-4xl font-bold text-[#0c594d] mb-12 text-center font-serif">
        {lang === 'it' ? 'Cultura e Artigianato 🎭' : lang === 'en' ? 'Culture and Crafts 🎭' : 'Madaniyat va Hunarmandchilik 🎭'}
      </h1>
      
      <div className="space-y-16">
        {culture.map((cat, idx) => (
          <div key={cat.id} className={`flex flex-col md:flex-row gap-8 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-full md:w-1/2 h-80 bg-gray-200 rounded-2xl relative flex items-center justify-center overflow-hidden shadow-lg">
               <span className="text-gray-500 z-0 absolute">{cat.image.replace('/images/', '')}</span>
               <img src={cat.image} alt={getCategoryName(cat.name)} className="w-full h-full object-cover relative z-10 opacity-0 transition-opacity duration-500" onLoad={(e) => e.target.classList.remove('opacity-0')} />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 font-serif">{getCategoryName(cat.name)}</h2>
              <div className="w-20 h-1 bg-[#80C23A] rounded"></div>
              <p className="text-gray-600 text-sm leading-relaxed">{getSubtext(cat.name)}</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {cat.items.map(item => (
                  <div key={item} className="bg-white border border-gray-100 shadow-sm p-4 rounded-lg font-semibold text-[#0c594d] flex items-center gap-2 hover:border-[#80C23A] transition-colors text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#80C23A]"></span>
                    {getItemTranslation(item)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
