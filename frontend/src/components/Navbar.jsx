import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [langOpen, setLangOpen] = useState(false);

  return (
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          {/* Orqa fonsiz, toza vektor (SVG) logotip */}
          <svg className="w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          ViviUzbekistan
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-secondary transition-colors">Bosh sahifa</Link>
          <Link to="/regions" className="hover:text-secondary transition-colors">Viloyatlar</Link>
          <Link to="/cuisine" className="hover:text-secondary transition-colors">Oshxona</Link>
          <Link to="/culture" className="hover:text-secondary transition-colors">Madaniyat</Link>
          <Link to="/tours" className="hover:text-secondary transition-colors">Sayohatlar</Link>
        </div>

        <div className="relative">
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
          >
            <img src="https://flagcdn.com/w40/uz.png" alt="Uz" className="w-6 h-6 rounded-full object-cover" />
            <span className="font-semibold text-sm">Uz</span>
          </button>
          
          {langOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-primary rounded-xl shadow-2xl overflow-hidden text-white border border-white/10">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                <img src="https://flagcdn.com/w40/uz.png" alt="Uz" className="w-6 h-6 rounded-full object-cover" /> 
                <span className="font-medium">Uz</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                <img src="https://flagcdn.com/w40/gb.png" alt="En" className="w-6 h-6 rounded-full object-cover" /> 
                <span className="font-medium">En</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                <img src="https://flagcdn.com/w40/it.png" alt="It" className="w-6 h-6 rounded-full object-cover" /> 
                <span className="font-medium">It</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                <img src="https://flagcdn.com/w40/ru.png" alt="Ru" className="w-6 h-6 rounded-full object-cover" /> 
                <span className="font-medium">Ru</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
