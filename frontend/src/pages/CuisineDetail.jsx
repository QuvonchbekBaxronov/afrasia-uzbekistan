import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { t } from '../utils/translations';
import { API_BASE } from '../config/api';

export default function CuisineDetail({ currentLang }) {
  const { id } = useParams();
  const lang = currentLang?.code || 'it';
  const [dish, setDish] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/cuisine/${id}`)
      .then(res => setDish(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!dish) return <div className="text-center py-40 text-xs font-semibold text-gray-400">{lang === 'it' ? 'Caricamento in corso...' : lang === 'en' ? 'Loading...' : 'Yuklanmoqda...'}</div>;

  const dishName = dish["name_" + lang] || dish.name;
  const dishCalories = dish["calories_" + lang] || dish.calories;
  const dishOrigin = dish["origin_" + lang] || dish.origin;
  const dishDesc = dish["desc_" + lang] || dish.desc;
  const dishIngredients = dish["ingredients_" + lang] || dish.ingredients || [];
  const dishRecipe = dish["recipe_" + lang] || dish.recipe || '';

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-6 max-w-3xl pt-24">
        
        {/* Compact Back Link */}
        <div className="mb-6">
          <Link to="/cuisine" className="text-gray-400 hover:text-gray-900 transition-colors text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            &larr; {lang === 'it' ? 'Torna indietro' : lang === 'en' ? 'Go back' : 'Ortga qaytish'}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1.5 block">
            {lang === 'it' ? 'Piatto Nazionale' : lang === 'en' ? 'National Dish' : 'Milliy Taom'}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">{dishName}</h1>
          
          {/* Minimalist Meta Row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-gray-100 py-3 text-xs text-gray-500 font-semibold">
            <div>
              <span className="text-gray-400 text-[10px] uppercase tracking-wider block mb-0.5">
                {lang === 'it' ? 'Valore Energetico' : lang === 'en' ? 'Energy Value' : 'Energetik qiymati'}
              </span>
              <span className="text-gray-800 font-bold">{dishCalories || (lang === 'it' ? 'Sconosciuto' : lang === 'en' ? 'Unknown' : "Noma'lum")}</span>
            </div>
            <div className="hidden sm:block w-[1px] bg-gray-200 self-stretch"></div>
            <div>
              <span className="text-gray-400 text-[10px] uppercase tracking-wider block mb-0.5">
                {lang === 'it' ? 'Origine' : lang === 'en' ? 'Origin' : 'Kelib chiqishi'}
              </span>
              <span className="text-gray-800 font-bold">{dishOrigin || (lang === 'it' ? 'Sconosciuto' : lang === 'en' ? 'Unknown' : "Noma'lum")}</span>
            </div>
          </div>
        </div>

        {/* Balanced Banner Image */}
        <div className="mb-8 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 max-h-[380px] flex items-center justify-center">
          <img 
            src={dish.image} 
            alt={dishName} 
            className="w-full h-[380px] object-cover" 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
        </div>

        {/* Content Body */}
        <div className="space-y-8">
          
          {/* Main Description */}
          <p className="text-gray-700 text-xs md:text-sm leading-relaxed font-normal">
            {dishDesc}
          </p>
          
          {/* History */}
          {dishOrigin && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs uppercase tracking-widest font-bold text-gray-900 mb-2">
                {lang === 'it' ? 'Storia e origine' : lang === 'en' ? 'History and origin' : 'Tarixi va kelib chiqishi'}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed font-normal">
                {dishOrigin}
              </p>
            </div>
          )}

          {/* Ingredients List */}
          {dishIngredients.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
                {lang === 'it' ? 'Ingredienti necessari' : lang === 'en' ? 'Required ingredients' : 'Kerakli masalliqlar'}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600 text-xs">
                {dishIngredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Recipe steps */}
          {dishRecipe && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs uppercase tracking-widest font-bold text-gray-900 mb-4">
                {lang === 'it' ? 'Metodo di preparazione' : lang === 'en' ? 'Preparation method' : 'Tayyorlash usuli'}
              </h3>
              <div className="space-y-4">
                {dishRecipe.split('\n').map((step, idx) => {
                  const cleanStep = step.replace(/^\d+\.\s*/, '');
                  return (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed pt-0.5 font-normal">
                        {cleanStep}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}