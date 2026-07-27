import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span className="text-2xl font-bold">ViviUzbekistan</span>
            </div>
            <p className="text-gray-300 text-sm">
              O'zbekistonning eng go'zal go'shalari, qadimiy obidalari va ajoyib taomlarini biz bilan kashf eting.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-secondary">Tezkor havolalar</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/regions" className="hover:text-white transition-colors">Viloyatlar</Link></li>
              <li><Link to="/cuisine" className="hover:text-white transition-colors">Milliy Taomlar</Link></li>
              <li><Link to="/culture" className="hover:text-white transition-colors">Madaniyat</Link></li>
              <li><Link to="/tours" className="hover:text-white transition-colors">Sayohatlar</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-secondary">Biz bilan aloqa</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>📞 +998 90 123 45 67</li>
              <li>📧 info@viviuzbekistan.uz</li>
              <li>📍 Toshkent sh, Mustaqillik shoh ko'chasi</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 flex justify-between items-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} ViviUzbekistan. Barcha huquqlar himoyalangan.</p>
          
          {/* Admin panel uchun mitti/yashirin tugma */}
          <Link 
            to="/admin-secret-login" 
            className="w-4 h-4 rounded-full bg-white/5 hover:bg-secondary/50 transition-colors cursor-pointer"
            title="Tizimga kirish"
          ></Link>
        </div>
      </div>
    </footer>
  );
}
