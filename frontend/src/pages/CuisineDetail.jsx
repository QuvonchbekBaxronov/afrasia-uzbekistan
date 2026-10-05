import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Check, Clock, Sparkles, ExternalLink, ChevronRight, Utensils, Award
} from 'lucide-react';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';
import { nationalDishes } from './HeritageCulture';

export default function CuisineDetail({ currentLang }) {
  const { id } = useParams();
  const lang = currentLang?.code || 'it';
  const [dish, setDish] = useState(null);
  const [activeTab, setActiveTab] = useState('recipe'); // 'recipe', 'ingredients', 'rice', 'story'

  useEffect(() => {
    // 1. Check local rich database first
    const localMatch = nationalDishes.find(d => 
      d.id === id || 
      (id === 'osh' && d.id === 'toshkent-plov') ||
      (id === 'toshkent-plov' && d.id === 'toshkent-plov')
    );

    if (localMatch) {
      setDish(localMatch);
      return;
    }

    // 2. Fetch from API with graceful fallback
    axios.get(`${API_BASE}/cuisine/${id}`)
      .then(res => {
        if (res.data) setDish(res.data);
        else setDish(nationalDishes[0]);
      })
      .catch(err => {
        console.error("Cuisine API unreachable, using fallback:", err);
        setDish(nationalDishes[0]);
      });
  }, [id]);

  if (!dish) {
    return (
      <div className="text-center py-40 text-xs font-semibold text-gray-400">
        {lang === 'it' ? 'Caricamento in corso...' : lang === 'en' ? 'Loading...' : 'Yuklanmoqda...'}
      </div>
    );
  }

  const dishName = dish[`name_${lang}`] || dish.name_uz || dish.name;
  const dishRegion = dish[`region_${lang}`] || dish.region_uz || dish.origin;
  const dishCalories = dish[`calories_${lang}`] || dish.calories;
  const dishServings = dish[`servings_${lang}`] || dish.servings_uz || '6 porzioni';
  const dishCookTime = dish.cookTime || '1 ora';
  const dishHistory = dish[`history_${lang}`] || dish[`story_${lang}`] || dish[`desc_${lang}`] || dish.desc || dish.history_uz;
  const dishIngredients = dish[`ingredients_${lang}`] || dish.ingredients_uz || dish.ingredients || [];
  const dishSteps = dish[`steps_${lang}`] || dish.steps_uz || (dish.recipe ? dish.recipe.split('\n').filter(Boolean) : []);
  const hasRichData = Boolean(dish.steps_uz);

  return (
    <div className="bg-[#fcfdfa] min-h-screen pb-24 font-sans text-slate-800">
      
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-slate-200/80 pt-20 pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Link 
            to="/culture" 
            className="text-slate-500 hover:text-[#0c594d] transition-colors text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            &larr; {lang === 'it' ? 'Torna a Gastronomia & Cultura' : lang === 'en' ? 'Back to Culture & Cuisine' : 'Madaniyat va Taomlarga qaytish'}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-6 space-y-6">
        
        {/* Main Card Wrapper */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          
          {/* Full Unobstructed Hero Food Image */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-100 overflow-hidden">
            <img 
              src={dish.image} 
              alt={dishName}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/uploads/cuisine/uzbek_plov.jpg'; }}
            />
          </div>

          {/* Clean Minimalist Title & Metadata Section (Below Image) */}
          <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-slate-100 bg-white">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                {lang === 'it' ? 'Patrimonio Culinario' : lang === 'en' ? 'Culinary Heritage' : 'Milliy Gastronomiya'}
              </span>
              {dishRegion && (
                <span className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-medium">
                  {dishRegion}
                </span>
              )}
              <span className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-medium">
                {dishCookTime}
              </span>
              <span className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-medium">
                {dishServings}
              </span>
              {dishCalories && (
                <span className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-medium">
                  {dishCalories}
                </span>
              )}
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 leading-tight">
              {dishName}
            </h1>
          </div>

          {/* Tab Navigation (Clean Typography, Zero Emojis) */}
          {hasRichData ? (
            <div className="border-b border-slate-200 bg-white px-6 sm:px-8 gap-4 sm:gap-6 flex overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('recipe')}
                className={`py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'recipe'
                    ? 'border-[#0c594d] text-[#0c594d] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {lang === 'it' ? 'Ricetta (8 Passaggi)' : lang === 'en' ? 'Recipe (8 Steps)' : '8 Bosqichli Retsept'}
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'ingredients'
                    ? 'border-[#0c594d] text-[#0c594d] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {lang === 'it' ? 'Ingredienti' : lang === 'en' ? 'Ingredients' : 'Masalliqlar'}
              </button>
              <button
                onClick={() => setActiveTab('rice')}
                className={`py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'rice'
                    ? 'border-[#0c594d] text-[#0c594d] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {lang === 'it' ? 'Segreti dello Chef' : lang === 'en' ? 'Chef Secrets & Technique' : 'Pazandachilik Sirlari'}
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'story'
                    ? 'border-[#0c594d] text-[#0c594d] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {lang === 'it' ? 'Storia & Tradizione' : lang === 'en' ? 'Heritage & Story' : 'Tarixi va Tavsif'}
              </button>
            </div>
          ) : null}

          {/* Tab / Main Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {hasRichData ? (
              <>
                {/* 1. RECIPE TAB */}
                {activeTab === 'recipe' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <h3 className="font-serif font-black text-slate-900 text-lg sm:text-xl">
                        {lang === 'it' ? 'Metodo di Preparazione Passo dopo Passo' : lang === 'en' ? 'Step-by-Step Cooking Directions' : 'Bosqichma-bosqich Tayyorlash Usuli'}
                      </h3>
                      <p className="text-xs text-slate-500 font-light mt-1">
                        {dish.category === 'pastry'
                          ? (lang === 'it' ? '8 passaggi per una sfoglia perfetta e ripieno incredibilmente succoso.' : lang === 'en' ? '8 clear steps for crispy flaky pastry and succulent meat filling.' : 'Qarsildoq qatlama va sersuv qiyma hosil qilishning 8 ta aniq bosqichi.')
                          : (lang === 'it' ? '8 fasi dettagliate dalla preparazione alla perfetta cottura finale.' : lang === 'en' ? '8 clear stages from preparation to final perfection.' : 'Dastlabki tayyorgarlikdan tortishgacha bo\'lgan 8 ta aniq bosqich.')}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {dishSteps.map((step, idx) => (
                        <div 
                          key={idx} 
                          className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/70 hover:border-emerald-300 transition-colors flex gap-4 items-start"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#0c594d] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Master Tip Box (Minimalist, Zero Emojis) */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                      <p className="leading-relaxed">
                        <strong className="text-amber-950 font-bold">{lang === 'it' ? 'Regola d\'oro del Maestro Oshpaz:' : lang === 'en' ? 'Master Chef Golden Rule:' : 'Oshpazning Oltin Qoidasi:'}</strong>{' '}
                        {dish.category === 'pastry'
                          ? (lang === 'it' ? 'Non tritare mai la carne a macchina: tagliarla a cubetti al coltello mantiene il succo naturale intrappolato all\'interno!' : lang === 'en' ? 'Never grind the meat in a machine: hand-dicing keeps the succulent juices bursting inside each bite!' : 'Go\'shtni aslo qiymalagichdan chiqarmang: pichoqda mayda to\'g\'rash barcha shira va sersuvlikni somsa ichida saqlab qoladi!')
                          : (lang === 'it' ? 'Durante la fase di damlash (vaporizzazione finale), non sollevare mai il coperchio per 10-15 minuti!' : lang === 'en' ? 'During the damlash (final steaming), never open the lid for 10-15 minutes!' : 'Damlash jarayonida qozon qopqog\'ini 10-15 daqiqa davomida aslo ochmang!')}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. INGREDIENTS TAB */}
                {activeTab === 'ingredients' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h3 className="font-serif font-black text-slate-900 text-lg sm:text-xl">
                          {dish.category === 'pastry'
                            ? (lang === 'it' ? 'Ingredienti Ufficiali per 30 Somsa' : lang === 'en' ? 'Official Ingredients for 30 Somsas' : '30 Dona Somsa Uchun Masalliqlar')
                            : (lang === 'it' ? 'Ingredienti Ufficiali' : lang === 'en' ? 'Official Ingredients' : 'To\'liq Masalliqlar Ro\'yxati')}
                        </h3>
                        <p className="text-xs text-slate-500 font-light mt-1">
                          {lang === 'it' 
                            ? 'Misurazioni precise testate per garantire equilibrio aromatico e fragranza.' 
                            : lang === 'en' 
                              ? 'Exact tested measurements for authentic flavor and crisp texture.' 
                              : 'Mukammal ta\'m va me\'yor uchun aniq o\'lchangan masalliqlar.'}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                        {dishServings}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dishIngredients.map((ing, i) => (
                        <div 
                          key={i} 
                          className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center gap-3 text-xs sm:text-sm text-slate-800"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0c594d] flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="font-medium">{ing}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5 font-light">
                      <p className="font-semibold text-slate-800">
                        {lang === 'it' ? 'Consigli per gli ingredienti:' : lang === 'en' ? 'Ingredient recommendations:' : 'Masalliqlar bo\'yicha muhim tavsiyalar:'}
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {dish.category === 'pastry' ? (
                          <>
                            <li>{lang === 'it' ? 'Pasta sfoglia: confezione da 10 quadrati già pronta (puff pastry) di ottima qualità.' : lang === 'en' ? 'Puff pastry: pack of 10 ready-rolled squares of good quality.' : 'Qatlama xamir: 10 ta tayyor kvadratli sifatli puff pastry.'}</li>
                            <li>{lang === 'it' ? 'Carne: fresco agnello o manzo magro tagliato finemente al coltello.' : lang === 'en' ? 'Meat: fresh lamb or lean beef, hand-diced very finely.' : 'Go\'sht: yangi qo\'y yoki lahm mol go\'shti, o\'tkir pichoqda maydalangan.'}</li>
                            <li>{lang === 'it' ? 'Cipolle: 2 grandi cipolle dolci per donare abbondante succosità.' : lang === 'en' ? 'Onions: 2 large sweet onions to create rich natural broth inside.' : 'Piyoz: sersuvlik uchun 2 dona yirik shirin piyoz.'}</li>
                          </>
                        ) : (
                          <>
                            <li>{lang === 'it' ? 'Carne: fresco agnello o morbido manzo scelto.' : lang === 'en' ? 'Meat: fresh bone-in lamb or tender marbled beef.' : 'Go\'sht: yangi qo\'y yoki yumshoq mol go\'shti.'}</li>
                            <li>{lang === 'it' ? 'Zafferano e cumino: usare solo cumino zira di montagna.' : lang === 'en' ? 'Spices: whole mountain cumin (zira) yields rich flavor.' : 'Ziravorlar: sara tog\' zirasi va maydalangan kashnich.'}</li>
                            <li>{lang === 'it' ? 'Verdure fresche: tagliare in modo uniforme.' : lang === 'en' ? 'Vegetables: slice uniformly for consistent cooking.' : 'Sabzavotlar: bir xil shaklda to\'g\'rash bir tekis pishish garovidir.'}</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 3. CHEF SECRETS & TECHNIQUE TAB (Zero Emojis) */}
                {activeTab === 'rice' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <h3 className="font-serif font-black text-slate-900 text-lg sm:text-xl">
                        {lang === 'it' ? 'Segreti dello Chef & Tecnica Tradizionale' : lang === 'en' ? 'Chef Secrets & Traditional Technique' : 'Pazandachilik Sirlari va Maxsus Texnika'}
                      </h3>
                      <p className="text-xs text-slate-500 font-light mt-1">
                        {lang === 'it' ? 'Consigli pratici e regole essenziali per ottenere un risultato perfetto.' : lang === 'en' ? 'Practical tips and essential guidelines for authentic results.' : 'Taomni mukammal darajada pishirish uchun amaliy va sinalgan sirlar.'}
                      </p>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {dish.category === 'pastry'
                          ? (lang === 'it' ? 'Segreti della Pasta Sfoglia (Puff Pastry & Porzionatura)' : lang === 'en' ? 'Puff Pastry Secrets & Proper Sizing' : 'Qatlama Xamir (Puff Pastry) va Bo\'laklash Siri')
                          : (lang === 'it' ? 'Scelta delle Materie Prime & Varietà' : lang === 'en' ? 'Ingredient Selection & Varieties' : 'Asosiy Masalliqlar va Tanlash Qo\'llanmasi')}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                        {dish[`riceGuide_${lang}`] || dish.riceGuide_uz}
                      </p>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {dish.category === 'pastry'
                          ? (lang === 'it' ? 'Temperatura del Forno a Due Stadi (215°C poi 175°C)' : lang === 'en' ? 'Two-Stage Oven Baking (420°F then 350°F)' : 'Duxovka Harorati: Ikki Bosqichli Pishirish')
                          : (lang === 'it' ? 'Calore, Fuoco e Metodo di Cottura' : lang === 'en' ? 'Heat Control & Cooking Methods' : 'Olov Harorati va Idish Tanlash')}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                        {dish[`cookerGuide_${lang}`] || dish.cookerGuide_uz}
                      </p>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {dish.category === 'pastry'
                          ? (lang === 'it' ? 'Ripieno Succoso al Coltello e Cipolla Dolce' : lang === 'en' ? 'Succulent Hand-Diced Meat & Onion Juices' : 'Sersuv Qiyma: Go\'shtni Pichoqda To\'g\'rash Siri')
                          : (lang === 'it' ? 'Tecnica di Taglio e Preparazione' : lang === 'en' ? 'Cutting Technique & Preparation' : 'To\'g\'rash Texnikasi va Masalliqlar')}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                        {dish[`carrotsGuide_${lang}`] || dish.carrotsGuide_uz}
                      </p>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {dish.category === 'pastry'
                          ? (lang === 'it' ? 'Doratura all\'Uovo & Semi Tradizionali' : lang === 'en' ? 'Golden Egg Wash & Traditional Seeds' : 'Yarqiroq Tuxum va Qora Sedana Sirlari')
                          : (lang === 'it' ? 'Aromi, Ziravorlar e Finitura' : lang === 'en' ? 'Aromatics, Spices & Finishing Touches' : 'Ziravorlar va Xushbo\'y Qo\'shimchalar')}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                        {dish[`aromaticsGuide_${lang}`] || dish.aromaticsGuide_uz}
                      </p>
                    </div>

                    <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                      <h4 className="text-xs font-bold text-[#0c594d]">
                        {lang === 'it' ? 'I Segreti Fondamentali dello Chef' : lang === 'en' ? 'Core Master Secrets' : 'Oshpazning Bosh Sirlari'}
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-normal">
                        {dish[`secret_${lang}`] || dish.secret_uz}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. HERITAGE STORY TAB */}
                {activeTab === 'story' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <h3 className="font-serif font-black text-slate-900 text-lg sm:text-xl">
                        {lang === 'it' ? 'Storia, Tradizione & Patrimonio' : lang === 'en' ? 'Heritage, Culture & Legacy' : 'Tarixi, Madaniyati va An\'analari'}
                      </h3>
                      <p className="text-xs text-slate-500 font-light mt-1">
                        {lang === 'it' 
                          ? 'Il sapore autentico dell\'ospitalità e della cucina tradizionale uzbeka.' 
                          : lang === 'en' 
                            ? 'The timeless taste of Uzbek hospitality and culinary heritage.' 
                            : 'O\'zbek dasturxonining asriy an\'anasi va madaniy merosi.'}
                      </p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                        {dish[`story_${lang}`] || dish.story_uz}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                        {dish[`history_${lang}`] || dish.history_uz}
                      </p>
                    </div>

                    {dish.sourceUrl && (
                      <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                        <span className="font-medium">
                          {lang === 'it' ? 'Retsept va ma\'lumotlar arbuz.com tajribasi asosida' : lang === 'en' ? 'Recipe & experience based on arbuz.com culinary guide' : 'Retsept va ma\'lumotlar arbuz.com tajribasi asosida'}
                        </span>
                        <a 
                          href={dish.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-bold text-[#0c594d] hover:underline flex items-center gap-1"
                        >
                          <span>{dish.sourceUrl.replace('https://', '')}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Fallback layout for standard dishes without tabbed steps */
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-slate-900 mb-2">
                    {lang === 'it' ? 'Descrizione & Storia' : lang === 'en' ? 'Description & History' : 'Tavsif va Tarixi'}
                  </h3>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                    {dishHistory}
                  </p>
                </div>

                {dishIngredients.length > 0 && (
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-900 mb-3">
                      {lang === 'it' ? 'Ingredienti necessari' : lang === 'en' ? 'Required ingredients' : 'Kerakli masalliqlar'}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 text-xs sm:text-sm">
                      {dishIngredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0"></span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {dishSteps.length > 0 && (
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-900 mb-4">
                      {lang === 'it' ? 'Metodo di preparazione' : lang === 'en' ? 'Preparation method' : 'Tayyorlash usuli'}
                    </h3>
                    <div className="space-y-3">
                      {dishSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-[#0c594d] flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </div>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pt-0.5">
                            {step.replace(/^\d+\.\s*/, '')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}