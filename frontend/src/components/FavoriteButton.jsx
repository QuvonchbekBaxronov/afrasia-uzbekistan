import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FavoriteButton({ 
  itemId, 
  itemType = 'place', 
  itemData = null, 
  className = '',
  size = 'md' 
}) {
  const { isPlaceSaved, toggleFavorite, isAuthenticated, setAuthModalOpen } = useAuth();
  const [animating, setAnimating] = useState(false);

  const isSaved = isPlaceSaved(itemId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnimating(true);
    toggleFavorite(itemId, itemType, itemData);
    setTimeout(() => setAnimating(false), 400);
  };

  const sizeClasses = {
    sm: 'w-7 h-7 p-1.5',
    md: 'w-9 h-9 p-2',
    lg: 'w-11 h-11 p-2.5'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-full backdrop-blur-md transition-all flex items-center justify-center shadow-sm ${
        isSaved 
          ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100' 
          : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80 hover:text-rose-500'
      } ${animating ? 'scale-125' : 'scale-100'} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={isSaved ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
    >
      <Heart 
        className={`${iconSizes[size] || iconSizes.md} transition-colors ${
          isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
        }`} 
      />
    </button>
  );
}
