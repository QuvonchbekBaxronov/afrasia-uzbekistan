import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Save, LogOut, Lock } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  
  const [data, setData] = useState({ 
    regions: [], 
    cuisine: [], 
    tours: [], 
    instruments: [], 
    phrases: [], 
    pageBanners: { tours: '', regions: '', cuisine: '', about: '', art: '', language: '' } 
  });
  
  const [homeFacts, setHomeFacts] = useState({
    headline: "O'zbekiston Sizni kutmoqda!",
    subtitle: "Boy tarix, betakror tabiat va samimiy mehmondo'stlik diyoriga xush kelibsiz!",
    aboutTitle: "O'zbekiston haqida",
    facts: [
      { id: "1", title: "36+ million", subtitle: "Aholisi", icon: "users" },
      { id: "2", title: "448 978 km²", subtitle: "Maydoni", icon: "mapPin" },
      { id: "3", title: "12 viloyat", subtitle: "1 respublika", icon: "building" },
      { id: "4", title: "Toshkent", subtitle: "Poytaxti", icon: "landmark" },
      { id: "5", title: "O'zbek so'mi", subtitle: "(UZS) valyutasi", icon: "dollar" },
      { id: "6", title: "O'zbek tili", subtitle: "Rasmiy tili", icon: "message" },
      { id: "7", title: "UTC +5", subtitle: "Vaqt mintaqasi", icon: "clock" },
      { id: "8", title: "1-sentyabr", subtitle: "Mustaqillik kuni", icon: "calendar" },
      { id: "9", title: "7 ta UNESCO", subtitle: "obyekti", icon: "award" }
    ]
  });

  const [editing, setEditing] = useState(null); // { id, type }
  const [formData, setFormData] = useState(null);

  // Image Cropper Modal State
  const [cropperModal, setCropperModal] = useState({
    isOpen: false,
    imageSrc: null,
    onCropSave: null
  });
  const [cropperRatio, setCropperRatio] = useState('4:3'); // '16:9', '4:3', '1:1', 'original'
  const [cropScale, setCropScale] = useState(1);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [cropRotation, setCropRotation] = useState(0);

  const canvasRef = useRef(null);
  
  // Audio Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password.trim() === 'jannatimerim') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Parol xato!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options = {};
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        } else if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        }
      }
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const mime = mediaRecorderRef.current.mimeType || 'audio/mp3';
        const audioBlob = new Blob(audioChunksRef.current, { type: mime });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          updateField('audioUrl', reader.result);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Mikrofonga kirishga ruxsat berilmadi yoki mikrofon topilmadi.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('audioUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Redraw canvas live when crop controls change
  useEffect(() => {
    if (!cropperModal.isOpen || !cropperModal.imageSrc) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = cropperModal.imageSrc;
    img.onload = () => {
      let targetW = 1200;
      let targetH = 900; // 4:3 default

      if (cropperRatio === '16:9') {
        targetW = 1200;
        targetH = 675;
      } else if (cropperRatio === '4:3') {
        targetW = 1200;
        targetH = 900;
      } else if (cropperRatio === '1:1') {
        targetW = 900;
        targetH = 900;
      } else if (cropperRatio === 'original') {
        targetW = img.width;
        targetH = img.height;
      }

      canvas.width = targetW;
      canvas.height = targetH;

      // Dark Canvas background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, targetW, targetH);

      ctx.save();
      
      // Transform canvas
      ctx.translate(targetW / 2 + cropPan.x, targetH / 2 + cropPan.y);
      ctx.rotate((cropRotation * Math.PI) / 180);
      ctx.scale(cropScale, cropScale);

      // Fit image cover calculation
      const scaleFit = Math.max(targetW / img.width, targetH / img.height);
      const renderW = img.width * scaleFit;
      const renderH = img.height * scaleFit;

      ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);

      ctx.restore();

      // Draw subtle crop viewfinder frame grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, targetW - 20, targetH - 20);

      // Rule of thirds dashed lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(targetW / 3, 0);
      ctx.lineTo(targetW / 3, targetH);
      ctx.moveTo((2 * targetW) / 3, 0);
      ctx.lineTo((2 * targetW) / 3, targetH);
      ctx.moveTo(0, targetH / 3);
      ctx.lineTo(targetW, targetH / 3);
      ctx.moveTo(0, (2 * targetH) / 3);
      ctx.lineTo(targetW, (2 * targetH) / 3);
      ctx.stroke();
    };
  }, [cropperModal.isOpen, cropperModal.imageSrc, cropperRatio, cropScale, cropPan, cropRotation]);

  const fetchData = async () => {
    try {
      const resR = await axios.get(`${API_BASE}/regions`);
      const resC = await axios.get(`${API_BASE}/cuisine`);
      const resT = await axios.get(`${API_BASE}/tours`);
      const resB = await axios.get(`${API_BASE}/pageBanners`);
      const resI = await axios.get(`${API_BASE}/instruments`);
      const resP = await axios.get(`${API_BASE}/phrases`);
      const resH = await axios.get(`${API_BASE}/homeFacts`);
      setData({ regions: resR.data, cuisine: resC.data, tours: resT.data, pageBanners: resB.data, instruments: resI.data, phrases: resP.data });
      if (resH.data) setHomeFacts(resH.data);
    } catch (err) {
      console.error("Data fetch failed:", err);
    }
  };

  const handleSaveHomeFacts = async () => {
    try {
      const updatedFacts = { ...homeFacts };
      // Sync default fields with Italian (the primary language)
      if (updatedFacts.headline_it) updatedFacts.headline = updatedFacts.headline_it;
      if (updatedFacts.subtitle_it) updatedFacts.subtitle = updatedFacts.subtitle_it;
      if (updatedFacts.aboutTitle_it) updatedFacts.aboutTitle = updatedFacts.aboutTitle_it;
      if (updatedFacts.aboutSubtitle_it) updatedFacts.aboutSubtitle = updatedFacts.aboutSubtitle_it;
      if (updatedFacts.col1Title_it) updatedFacts.col1Title = updatedFacts.col1Title_it;
      if (updatedFacts.col1Desc_it) updatedFacts.col1Desc = updatedFacts.col1Desc_it;
      if (updatedFacts.col2Title_it) updatedFacts.col2Title = updatedFacts.col2Title_it;
      if (updatedFacts.col2Desc_it) updatedFacts.col2Desc = updatedFacts.col2Desc_it;
      if (updatedFacts.aboutHeroTitle_it) updatedFacts.aboutHeroTitle = updatedFacts.aboutHeroTitle_it;
      if (updatedFacts.aboutHeroSubtitle_it) updatedFacts.aboutHeroSubtitle = updatedFacts.aboutHeroSubtitle_it;

      if (updatedFacts.facts) {
        updatedFacts.facts = updatedFacts.facts.map(f => {
          if (f.title_it) f.title = f.title_it;
          if (f.subtitle_it) f.subtitle = f.subtitle_it;
          return f;
        });
      }

      await axios.put(`${API_BASE}/homeFacts`, updatedFacts);
      alert("Asosiy sahifa va 'O'zbekiston haqida' ma'lumotlari saqlandi!");
      fetchData();
    } catch (err) {
      console.error("Failed to save homeFacts:", err);
      alert("Saqlashda xatolik yuz berdi!");
    }
  };

  const handleEdit = (item, type) => {
    setEditing({ id: item.id, type });
    setFormData(JSON.parse(JSON.stringify(item))); // Deep copy
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, type) => {
    if (window.confirm("Rostdan ham ushbu ma'lumotni o'chirmoqchimisiz?")) {
      try {
        await axios.delete(`${API_BASE}/${type}/${id}`);
        alert("Muvaffaqiyatli o'chirildi!");
        fetchData();
        if (editing && editing.id === id) setEditing(null);
      } catch (err) {
        alert("O'chirishda xatolik yuz berdi!");
      }
    }
  };

  const handleSave = async () => {
    try {
      const newItem = { ...formData };
      
      // Keep defaults in sync with Italian for safety (since Italian is default language)
      if (newItem.name_it) newItem.name = newItem.name_it;
      if (newItem.title_it) newItem.title = newItem.title_it;
      if (newItem.slogan_it) newItem.slogan = newItem.slogan_it;
      if (newItem.center_it) newItem.center = newItem.center_it;
      if (newItem.about_it) newItem.about = newItem.about_it;
      if (newItem.geography_it) newItem.geography = newItem.geography_it;
      if (newItem.climate_it) newItem.climate = newItem.climate_it;
      if (newItem.bestTimeToVisit_it) newItem.bestTimeToVisit = newItem.bestTimeToVisit_it;
      
      if (newItem.desc_it) newItem.desc = newItem.desc_it;
      if (newItem.calories_it) newItem.calories = newItem.calories_it;
      if (newItem.origin_it) newItem.origin = newItem.origin_it;
      if (newItem.recipe_it) newItem.recipe = newItem.recipe_it;
      
      if (newItem.travelStyle_it) newItem.travelStyle = newItem.travelStyle_it;
      if (newItem.price_it) newItem.price = newItem.price_it;
      if (newItem.duration_it) newItem.duration = newItem.duration_it;
      if (newItem.description_it) newItem.description = newItem.description_it;
      
      if (newItem.famousPlaces) {
        newItem.famousPlaces = newItem.famousPlaces.map(p => {
          if (p.name_it) p.name = p.name_it;
          if (p.location_it) p.location = p.location_it;
          if (p.history_it) p.history = p.history_it;
          return p;
        });
      }
      // 1. Try updating cloud backend
      try {
        if (editing.id === 'new') {
          if (!newItem.id) {
            newItem.id = (newItem.name || newItem.title || newItem.uz || 'item').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
          }
          await axios.post(`${API_BASE}/${editing.type}`, newItem);
        } else {
          await axios.put(`${API_BASE}/${editing.type}/${editing.id}`, newItem);
        }
      } catch (err) {
        console.warn("Backend sync notice:", err);
      }

      // 2. Always update local state instantly
      setData(prev => {
        const list = prev[editing.type] || [];
        let updatedList;
        if (editing.id === 'new') {
          updatedList = [...list, newItem];
        } else {
          updatedList = list.map(item => item.id === editing.id ? newItem : item);
        }
        return { ...prev, [editing.type]: updatedList };
      });

      alert("Muvaffaqiyatli saqlandi!");
      setEditing(null);
    } catch (err) {
      console.error("Save error:", err);
      alert("Saqlashda xatolik yuz berdi!");
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openCropper = (file, defaultRatio, onSaveCallback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropperRatio(defaultRatio);
      setCropScale(1);
      setCropPan({ x: 0, y: 0 });
      setCropRotation(0);
      setCropperModal({
        isOpen: true,
        imageSrc: reader.result,
        onCropSave: onSaveCallback
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCropDone = () => {
    if (!canvasRef.current || !cropperModal.onCropSave) return;
    const croppedBase64 = canvasRef.current.toDataURL('image/jpeg', 0.82);;
    if (cropperModal.onCropSave) {
      cropperModal.onCropSave(croppedBase64);
    }
    setCropperModal({ isOpen: false, imageSrc: null, onCropSave: null });
  };

  const handleFileUpload = (e, fieldName, isArray = false, idx = null) => {
    const file = e.target.files[0];
    if (file) {
      const defaultRatio = isArray ? '4:3' : '16:9';
      openCropper(file, defaultRatio, (croppedBase64) => {
        if (isArray) {
          updateArrayItem('famousPlaces', idx, fieldName, croppedBase64);
        } else {
          updateField(fieldName, croppedBase64);
        }
      });
    }
    e.target.value = '';
  };

  const updateArrayItem = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index][field] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleGalleryUpload = (e, placeIdx) => {
    const file = e.target.files[0];
    if (file) {
      openCropper(file, '4:3', (croppedBase64) => {
        setFormData(prev => {
          const newPlaces = [...prev.famousPlaces];
          const currentGallery = newPlaces[placeIdx].gallery || [];
          newPlaces[placeIdx].gallery = [...currentGallery, croppedBase64];
          return { ...prev, famousPlaces: newPlaces };
        });
      });
    }
    e.target.value = '';
  };

  const removeGalleryPhotoFromPlace = (placeIdx, photoIdx) => {
    setFormData(prev => {
      const newPlaces = [...prev.famousPlaces];
      const newGallery = [...(newPlaces[placeIdx].gallery || [])];
      newGallery.splice(photoIdx, 1);
      newPlaces[placeIdx].gallery = newGallery;
      return { ...prev, famousPlaces: newPlaces };
    });
  };

  const addPlace = () => {
    setFormData(prev => ({
      ...prev,
      famousPlaces: [...(prev.famousPlaces || []), { name: '', history: '', location: '', mapUrl: '', image: '', category: 'Tarixiy obida', workHours: '', ticketPrice: '' }]
    }));
  };

  const removePlace = (index) => {
    setFormData(prev => {
      const newArray = [...prev.famousPlaces];
      newArray.splice(index, 1);
      return { ...prev, famousPlaces: newArray };
    });
  };

  const handleBannerUpload = (e, pageKey) => {
    const file = e.target.files[0];
    if (file) {
      openCropper(file, '16:9', async (croppedBase64) => {
        try {
          const updatedBanners = {
            ...data.pageBanners,
            [pageKey]: croppedBase64
          };
          await axios.put(`${API_BASE}/pageBanners`, updatedBanners);
          alert("Banner yangilandi!");
          fetchData();
        } catch (err) {
          console.error("Failed to update banner:", err);
          alert("Banner saqlashda xatolik!");
        }
      });
    }
    e.target.value = '';
  };

  const handleTopicImageUpload = (e, topicImageKey) => {
    const file = e.target.files[0];
    if (file) {
      openCropper(file, '16:9', (croppedBase64) => {
        setHomeFacts(prev => ({ ...prev, [topicImageKey]: croppedBase64 }));
      });
    }
    e.target.value = '';
  };

  const handleTimelineImageUpload = (e, tIdx) => {
    const file = e.target.files[0];
    if (file) {
      openCropper(file, '16:9', (croppedBase64) => {
        setHomeFacts(prev => {
          const newTL = [...(prev.historyTimeline || [])];
          newTL[tIdx] = { ...newTL[tIdx], image: croppedBase64 };
          return { ...prev, historyTimeline: newTL };
        });
      });
    }
    e.target.value = '';
  };

  if (!isAuthenticated) {
    return (
      <div className="py-12 sm:py-16 flex justify-center items-center bg-slate-50/50 px-4 min-h-[70vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 shadow-xl rounded-2xl border border-slate-200/80 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Paneli</h2>
            <p className="text-xs text-slate-500 mt-1">Boshqaruv tizimiga kirish uchun parolni kiriting</p>
          </div>
          
          <input 
            type="password" 
            placeholder="Parol..." 
            className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl mb-4 text-sm focus:outline-none focus:border-slate-900 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-sm">
            Kirish
          </button>
        </form>
      </div>
    );
  }

  const handleExportBackup = () => {
    const backupObj = {
      regions: data.regions,
      cuisine: data.cuisine,
      tours: data.tours,
      instruments: data.instruments,
      phrases: data.phrases,
      pageBanners: data.pageBanners,
      homeFacts: homeFacts,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afrasia_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (window.confirm("Zaxira faylidan barcha ma'lumotlarni tiklashni tasdiqlaysizmi?")) {
          if (imported.regions) await axios.put(`${API_BASE}/db`, imported).catch(() => {});
          alert("Zaxiradan barcha ma'lumotlar muvaffaqiyatli tiklandi!");
          fetchData();
        }
      } catch (err) {
        alert("Zaxira faylini o'qishda xatolik yuz berdi!");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-slate-50/50 py-8 min-h-[80vh]">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Minimalist Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Admin Boshqaruv Paneli</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Loyihadagi barcha ma'lumotlarni tahrirlash va yangilash bo'limi</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleExportBackup} 
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-3 py-2 rounded-xl text-xs transition-colors border border-emerald-200 shadow-sm flex items-center gap-1.5"
              title="Barcha kiritilgan ma'lumotlarni kompyuterga saqlab olish"
            >
              <span>📥 Zaxira Yuklab Olish</span>
            </button>

            <label className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold px-3 py-2 rounded-xl text-xs transition-colors border border-blue-200 shadow-sm flex items-center gap-1.5 cursor-pointer">
              <span>📤 Zaxirani Qaytarish</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button 
              onClick={handleLogout} 
              className="bg-white hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition-colors border border-slate-200 shadow-sm flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar (Items Navigation) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Viloyatlar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-center mb-3 bg-slate-900 text-white p-3 rounded-xl">
                <h2 className="font-bold text-sm">Viloyatlar ({data.regions?.length || 0})</h2>
                <button 
                  onClick={() => {
                    setEditing({ id: 'new', type: 'regions' });
                    setFormData({ name: '', slogan: '', center: '', population: '', about: '', geography: '', climate: '', bestTimeToVisit: '', image: '', famousPlaces: [] });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  + Qo'shish
                </button>
              </div>
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {data.regions?.map(r => (
                  <li key={r.id} className="flex justify-between items-center bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <span className="font-medium text-slate-800 text-sm truncate mr-2">{r.name}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => handleEdit(r, 'regions')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        Tahrirlash
                      </button>
                      <button onClick={() => handleDelete(r.id, 'regions')} className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        O'chirish
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Taomlar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-center mb-3 bg-slate-900 text-white p-3 rounded-xl">
                <h2 className="font-bold text-sm">Taomlar ({data.cuisine?.length || 0})</h2>
                <button 
                  onClick={() => {
                    setEditing({ id: 'new', type: 'cuisine' });
                    setFormData({ name: '', image: '', desc: '', ingredients: [], origin: '', calories: '', recipe: '' });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  + Qo'shish
                </button>
              </div>
              <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {data.cuisine?.map(c => (
                  <li key={c.id} className="flex justify-between items-center bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <span className="font-medium text-slate-800 text-sm truncate mr-2">{c.name}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => handleEdit(c, 'cuisine')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        Tahrirlash
                      </button>
                      <button onClick={() => handleDelete(c.id, 'cuisine')} className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        O'chirish
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Sayohatlar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-center mb-3 bg-slate-900 text-white p-3 rounded-xl">
                <h2 className="font-bold text-sm">Sayohatlar ({data.tours?.length || 0})</h2>
                <button 
                  onClick={() => {
                    setEditing({ id: 'new', type: 'tours' });
                    setFormData({ title: '', image: '', mapUrl: '', description: '', travelStyle: '', countries: '', route: '', priceTable: '', agency: '', duration: '', price: '', paymentInfo: '', included: '', notIncluded: '', itinerary: '' });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  + Qo'shish
                </button>
              </div>
              <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {data.tours?.map(t => (
                  <li key={t.id} className="flex justify-between items-center bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <span className="font-medium text-slate-800 text-sm truncate mr-2">{t.title}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => handleEdit(t, 'tours')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        Tahrirlash
                      </button>
                      <button onClick={() => handleDelete(t.id, 'tours')} className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        O'chirish
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Sahifa Bannerlari */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="bg-slate-900 text-white p-3 rounded-xl mb-3">
                <h2 className="font-bold text-sm">Sahifa Bannerlari</h2>
              </div>
              <div className="space-y-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100 max-h-96 overflow-y-auto pr-1">
                {/* 1. Asosiy Sahifa */}
                <div>
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-1">1. Asosiy Sahifa Banneri (16:9):</span>
                  <div className="flex items-center gap-3">
                    <img src={data.pageBanners?.home || '/uz_banner.png'} alt="Home Banner" className="h-10 w-16 object-cover rounded border border-slate-200" />
                    <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleBannerUpload(e, 'home')} />
                  </div>
                </div>

                {/* 2. Go Uzbekistan */}
                <div className="border-t border-slate-200 pt-2">
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-1">2. Go Uzbekistan Banneri (16:9):</span>
                  <div className="flex items-center gap-3">
                    <img src={data.pageBanners?.goUzbekistan || data.pageBanners?.regions || '/uz_banner.png'} alt="Go Uzbekistan Banner" className="h-10 w-16 object-cover rounded border border-slate-200" />
                    <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleBannerUpload(e, 'goUzbekistan')} />
                  </div>
                </div>

                {/* 3. Viloyatlar */}
                <div className="border-t border-slate-200 pt-2">
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-1">3. Viloyatlar (Shaharlar) Banneri (16:9):</span>
                  <div className="flex items-center gap-3">
                    <img src={data.pageBanners?.regions || ''} alt="Regions Banner" className="h-10 w-16 object-cover rounded border border-slate-200" />
                    <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleBannerUpload(e, 'regions')} />
                  </div>
                </div>

                {/* 4. Sayohatlar */}
                <div className="border-t border-slate-200 pt-2">
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-1">4. Sayohatlar (Turlar) Banneri (16:9):</span>
                  <div className="flex items-center gap-3">
                    <img src={data.pageBanners?.tours || '/uz_banner.png'} alt="Tours Banner" className="h-10 w-16 object-cover rounded border border-slate-200" />
                    <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleBannerUpload(e, 'tours')} />
                  </div>
                </div>

                {/* 5. Taomlar */}
                <div className="border-t border-slate-200 pt-2">
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-1">5. Taomlar Banneri (16:9):</span>
                  <div className="flex items-center gap-3">
                    <img src={data.pageBanners?.cuisine || ''} alt="Cuisine Banner" className="h-10 w-16 object-cover rounded border border-slate-200" />
                    <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleBannerUpload(e, 'cuisine')} />
                  </div>
                </div>

                {/* 6. San'at va Hunarmandchilik */}
                <div className="border-t border-slate-200 pt-2">
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-1">6. San'at va Hunarmandchilik Banneri (16:9):</span>
                  <div className="flex items-center gap-3">
                    <img src={data.pageBanners?.art || data.pageBanners?.tours || '/uz_banner.png'} alt="Art Banner" className="h-10 w-16 object-cover rounded border border-slate-200" />
                    <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleBannerUpload(e, 'art')} />
                  </div>
                </div>

                {/* 7. Til va Iboralar */}
                <div className="border-t border-slate-200 pt-2">
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-1">7. Til va Iboralar Banneri (16:9):</span>
                  <div className="flex items-center gap-3">
                    <img src={data.pageBanners?.language || data.pageBanners?.regions || '/uz_banner.png'} alt="Language Banner" className="h-10 w-16 object-cover rounded border border-slate-200" />
                    <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleBannerUpload(e, 'language')} />
                  </div>
                </div>

                {/* 8. Biz Haqimizda */}
                <div className="border-t border-slate-200 pt-2">
                  <span className="block text-xs font-bold text-slate-700 uppercase mb-1">8. Biz Haqimizda Banneri (16:9):</span>
                  <div className="flex items-center gap-3">
                    <img src={data.pageBanners?.about || data.pageBanners?.home || '/uz_banner.png'} alt="About Banner" className="h-10 w-16 object-cover rounded border border-slate-200" />
                    <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleBannerUpload(e, 'about')} />
                  </div>
                </div>
              </div>
            </div>



            {/* 5. Cholg'u Asboblari */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-center mb-3 bg-slate-900 text-white p-3 rounded-xl">
                <h2 className="font-bold text-sm">Cholg'u Asboblari ({data.instruments?.length || 0})</h2>
                <button 
                  onClick={() => {
                    setEditing({ id: 'new', type: 'instruments' });
                    setFormData({ name: '', description: '', image: '', youtubeUrl: '', category: 'Torli' });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  + Qo'shish
                </button>
              </div>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {data.instruments?.map(inst => (
                  <li key={inst.id} className="flex justify-between items-center bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <span className="font-medium text-slate-800 text-sm truncate mr-2">{inst.name}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => handleEdit(inst, 'instruments')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        Tahrirlash
                      </button>
                      <button onClick={() => handleDelete(inst.id, 'instruments')} className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        O'chirish
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. O'zbek Iboralari */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-center mb-3 bg-slate-900 text-white p-3 rounded-xl">
                <h2 className="font-bold text-sm">O'zbek Iboralari ({data.phrases?.length || 0})</h2>
                <button 
                  onClick={() => {
                    setEditing({ id: 'new', type: 'phrases' });
                    setFormData({ uz: '', en: '', it: '', pronunciation: '', category: 'Kundalik' });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  + Qo'shish
                </button>
              </div>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {data.phrases?.map(p => (
                  <li key={p.id} className="flex justify-between items-center bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <span className="font-medium text-slate-800 text-sm truncate mr-2">{p.uz} — {p.en}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => handleEdit(p, 'phrases')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        Tahrirlash
                      </button>
                      <button onClick={() => handleDelete(p.id, 'phrases')} className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm">
                        O'chirish
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Main Form Section */}
          <div className="lg:col-span-8">
            {editing && formData ? (
              <div className="bg-white p-6 sm:p-8 shadow-xl rounded-2xl border border-slate-200/80 sticky top-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <h3 className="font-bold text-2xl text-slate-900">
                    {editing.id === 'new' ? 'Yangi kiritish' : `O'zgartirish: ${formData.name || formData.title || formData.uz || ''}`}
                  </h3>
                  <button 
                    onClick={() => setEditing(null)}
                    className="text-slate-400 hover:text-slate-700 font-bold text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-5 mb-8">
                  {editing.type !== 'phrases' && (
                    <>
                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Sarlavha / Nomi (Multi-Language)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input 
                            className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" 
                            value={formData.name !== undefined ? (formData.name_it || '') : (formData.title_it || '')} 
                            onChange={e => updateField(formData.name !== undefined ? 'name_it' : 'title_it', e.target.value)} 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input 
                            className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" 
                            value={formData.name !== undefined ? (formData.name_en || '') : (formData.title_en || '')} 
                            onChange={e => updateField(formData.name !== undefined ? 'name_en' : 'title_en', e.target.value)} 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input 
                            className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" 
                            value={formData.name !== undefined ? (formData.name_uz || '') : (formData.title_uz || '')} 
                            onChange={e => updateField(formData.name !== undefined ? 'name_uz' : 'title_uz', e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Asosiy Rasm (Fayldan yuklash & Qirqish)</label>
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Tavsiya: 1200 × 675 px (16:9)
                          </span>
                        </div>
                        <input type="file" accept="image/*" className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 text-sm" onChange={e => handleFileUpload(e, 'image')} />
                        {formData.image && <img src={formData.image} alt="Preview" className="h-24 mt-3 rounded-xl object-cover border border-slate-200 shadow-sm" />}
                      </div>
                    </>
                  )}
                  
                  {/* Region Specific Fields (Full Edit Support) */}
                  {editing.type === 'regions' && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Markazi & Aholisi</label>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700">Aholisi (Aholi soni):</label>
                            <input className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={formData.population || ''} onChange={e => updateField('population', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700">Markazi 🇮🇹 IT:</label>
                            <input className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={formData.center_it || ''} onChange={e => updateField('center_it', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700">Markazi 🇬🇧 EN:</label>
                            <input className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={formData.center_en || ''} onChange={e => updateField('center_en', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700">Markazi 🇺🇿 UZ:</label>
                            <input className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={formData.center_uz || ''} onChange={e => updateField('center_uz', e.target.value)} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Shiori / Slogan (Multi-Language)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.slogan_it || ''} onChange={e => updateField('slogan_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.slogan_en || ''} onChange={e => updateField('slogan_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.slogan_uz || ''} onChange={e => updateField('slogan_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Viloyat Haqida Matn (Batafsil tavsif)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-28" value={formData.about_it || ''} onChange={e => updateField('about_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-28" value={formData.about_en || ''} onChange={e => updateField('about_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-28" value={formData.about_uz || ''} onChange={e => updateField('about_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Geografiyasi va Tabiati</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-20" value={formData.geography_it || ''} onChange={e => updateField('geography_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-20" value={formData.geography_en || ''} onChange={e => updateField('geography_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-20" value={formData.geography_uz || ''} onChange={e => updateField('geography_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Iqlimi va Ob-havo</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.climate_it || ''} onChange={e => updateField('climate_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.climate_en || ''} onChange={e => updateField('climate_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.climate_uz || ''} onChange={e => updateField('climate_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Sayohat uchun eng yaxshi vaqt</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.bestTimeToVisit_it || ''} onChange={e => updateField('bestTimeToVisit_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.bestTimeToVisit_en || ''} onChange={e => updateField('bestTimeToVisit_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.bestTimeToVisit_uz || ''} onChange={e => updateField('bestTimeToVisit_uz', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Cuisine Specific Fields */}
                  {editing.type === 'cuisine' && (
                    <div className="space-y-4">
                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ta'rifi (Description)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-20" value={formData.desc_it || ''} onChange={e => updateField('desc_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-20" value={formData.desc_en || ''} onChange={e => updateField('desc_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-20" value={formData.desc_uz || ''} onChange={e => updateField('desc_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Energetik Qiymati</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.calories_it || ''} placeholder="e.g. 350 kcal / 100g" onChange={e => updateField('calories_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.calories_en || ''} placeholder="e.g. 350 kcal / 100g" onChange={e => updateField('calories_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.calories_uz || ''} placeholder="e.g. 350 kkal / 100g" onChange={e => updateField('calories_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kelib chiqishi (Tarixi)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.origin_it || ''} onChange={e => updateField('origin_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.origin_en || ''} onChange={e => updateField('origin_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.origin_uz || ''} onChange={e => updateField('origin_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Masalliqlar (Vergul bilan ajratilgan ro'yxat)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={Array.isArray(formData.ingredients_it) ? formData.ingredients_it.join(', ') : formData.ingredients_it || ''} placeholder="Carne, Riso, Carote..." onChange={e => updateField('ingredients_it', e.target.value.split(',').map(s => s.trim()))} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={Array.isArray(formData.ingredients_en) ? formData.ingredients_en.join(', ') : formData.ingredients_en || ''} placeholder="Meat, Rice, Carrots..." onChange={e => updateField('ingredients_en', e.target.value.split(',').map(s => s.trim()))} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={Array.isArray(formData.ingredients_uz || formData.ingredients) ? (formData.ingredients_uz || formData.ingredients).join(', ') : formData.ingredients_uz || formData.ingredients || ''} placeholder="Go'sht, Guruch, Sabzi..." onChange={e => {
                            const val = e.target.value.split(',').map(s => s.trim());
                            updateField('ingredients_uz', val);
                            updateField('ingredients', val);
                          }} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Retsepti (Tayyorlanishi)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-28" value={formData.recipe_it || ''} onChange={e => updateField('recipe_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-28" value={formData.recipe_en || ''} onChange={e => updateField('recipe_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-28" value={formData.recipe_uz || ''} onChange={e => updateField('recipe_uz', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tour Specific Fields */}
                  {editing.type === 'tours' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tur firma nomi</label>
                          <input className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white p-3 rounded-xl text-sm" value={formData.agency || ''} onChange={e => updateField('agency', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Google Maps Embed Linki</label>
                          <input className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white p-3 rounded-xl text-sm" value={formData.mapUrl || ''} onChange={e => updateField('mapUrl', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Davomiyligi (Duration)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.duration_it || ''} onChange={e => updateField('duration_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.duration_en || ''} onChange={e => updateField('duration_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.duration_uz || ''} onChange={e => updateField('duration_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Narxi (Price)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.price_it || ''} onChange={e => updateField('price_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.price_en || ''} onChange={e => updateField('price_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.price_uz || ''} onChange={e => updateField('price_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Sayohat Uslubi (Travel Style)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.travelStyle_it || ''} onChange={e => updateField('travelStyle_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.travelStyle_en || ''} onChange={e => updateField('travelStyle_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.travelStyle_uz || ''} onChange={e => updateField('travelStyle_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Marshrut yo'nalishi (Route)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.route_it || ''} placeholder="Samarcanda - Bukhara..." onChange={e => updateField('route_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.route_en || ''} placeholder="Samarkand - Bukhara..." onChange={e => updateField('route_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <input className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm" value={formData.route_uz || ''} placeholder="Samarqand - Buxoro..." onChange={e => updateField('route_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Narx Jadvali (Price Table)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-20" value={formData.priceTable_it || ''} placeholder="e.g. Min 2 persone: 1200€..." onChange={e => updateField('priceTable_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-20" value={formData.priceTable_en || ''} placeholder="e.g. Min 2 people: 1200$..." onChange={e => updateField('priceTable_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-20" value={formData.priceTable_uz || ''} placeholder="e.g. Kamida 2 kishi: 15,000,000 so'm..." onChange={e => updateField('priceTable_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">To'lov ma'lumoti (Payment Info)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={formData.paymentInfo_it || ''} onChange={e => updateField('paymentInfo_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={formData.paymentInfo_en || ''} onChange={e => updateField('paymentInfo_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={formData.paymentInfo_uz || ''} onChange={e => updateField('paymentInfo_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kiritilgan xizmatlar (Included - Vergul bilan ajrating)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={formData.included_it || ''} onChange={e => updateField('included_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={formData.included_en || ''} onChange={e => updateField('included_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={formData.included_uz || ''} onChange={e => updateField('included_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kiritilmagan xizmatlar (Not Included - Vergul bilan ajrating)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={formData.notIncluded_it || ''} onChange={e => updateField('notIncluded_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={formData.notIncluded_en || ''} onChange={e => updateField('notIncluded_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-16" value={formData.notIncluded_uz || ''} onChange={e => updateField('notIncluded_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kundan-kunga Dastur (Itinerary - 'Kun 1: ... | Kun 2: ...' formatida)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-28" value={formData.itinerary_it || ''} placeholder="Giorno 1: ... | Giorno 2: ..." onChange={e => updateField('itinerary_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-28" value={formData.itinerary_en || ''} placeholder="Day 1: ... | Day 2: ..." onChange={e => updateField('itinerary_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-28" value={formData.itinerary_uz || ''} placeholder="Kun 1: ... | Kun 2: ..." onChange={e => updateField('itinerary_uz', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Qisqa tavsif (Description)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-24" value={formData.description_it || ''} onChange={e => updateField('description_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-24" value={formData.description_en || ''} onChange={e => updateField('description_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-24" value={formData.description_uz || ''} onChange={e => updateField('description_uz', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instruments Specific */}
                  {editing.type === 'instruments' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kategoriya</label>
                          <select className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm" value={formData.category || 'Torli'} onChange={e => updateField('category', e.target.value)}>
                            <option value="Torli">Torli</option>
                            <option value="Torli-kamonli">Torli-kamonli</option>
                            <option value="Zarbli">Zarbli</option>
                            <option value="Puflamali">Puflamali</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">YouTube Embed URL</label>
                          <input className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm" value={formData.youtubeUrl || ''} onChange={e => updateField('youtubeUrl', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ta'rifi (Description)</span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇮🇹 Italyancha (IT)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-24" value={formData.description_it || ''} onChange={e => updateField('description_it', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇬🇧 Inglizcha (EN)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-24" value={formData.description_en || ''} onChange={e => updateField('description_en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">🇺🇿 O'zbekcha (UZ)</label>
                          <textarea className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm h-24" value={formData.description_uz || ''} onChange={e => updateField('description_uz', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phrases Specific */}
                  {editing.type === 'phrases' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">O'zbekcha Ibora</label>
                        <input className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm font-bold" placeholder="Masalan: Narxi qancha?" value={formData.uz || ''} onChange={e => updateField('uz', e.target.value)} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kategoriya</label>
                          <select 
                            className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm font-bold" 
                            value={formData.category || 'Bozor va Narx'} 
                            onChange={e => updateField('category', e.target.value)}
                          >
                            <option value="Bozor va Narx">Bozor va Narx-navo</option>
                            <option value="Taksi va Sayohat">Taksi va Sayohat</option>
                            <option value="Restoran va Ovqat">Restoran va Ovqatlanish</option>
                            <option value="Salomlashish">Salomlashish</option>
                            <option value="Yordam va Zudlik">Favqulodda Yordam</option>
                            <option value="Raqamlar">Raqamlar va Pul</option>
                            <option value="Kundalik">Kundalik so'zlar</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">O'qilishi (Transkripsiya)</label>
                          <input className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm font-mono" placeholder="[Nahr-KHI kahn-CHAH?]" value={formData.pronunciation || ''} onChange={e => updateField('pronunciation', e.target.value)} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Inglizcha tarjima (EN)</label>
                          <input className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm" value={formData.en || ''} onChange={e => updateField('en', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Italyancha tarjima (IT)</label>
                          <input className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm" value={formData.it || ''} onChange={e => updateField('it', e.target.value)} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Qo'llanish joyi (Context)</label>
                        <input className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm" placeholder="Masalan: Bozorda / Taksida / Restoranda" value={formData.context || ''} onChange={e => updateField('context', e.target.value)} />
                      </div>

                      {/* Custom Audio Sound Recorder & MP3 File Upload */}
                      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider">
                            🔊 O'zbekcha Maxsus Ovoz Yozuvi (Audio MP3)
                          </label>
                          <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 font-medium">
                            Google o'qiy olmagan so'zlar uchun o'z ovozingizni yozib qo'yishingiz mumkin
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {/* Live Microphone Recording Button */}
                          {!isRecording ? (
                            <button
                              type="button"
                              onClick={startRecording}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                            >
                              <span>🎙️ Ovozni Yozib Olish</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm animate-pulse"
                            >
                              <span>🛑 Yozishni To'xtatish & Saqlash</span>
                            </button>
                          )}

                          <span className="text-xs text-slate-400 font-bold">yoki</span>

                          {/* MP3 Audio File Upload Button */}
                          <label className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-all flex items-center gap-2 shadow-sm">
                            <span>📁 MP3 Fayl Yuklash</span>
                            <input 
                              type="file" 
                              accept="audio/*" 
                              className="hidden" 
                              onChange={handleAudioFileUpload} 
                            />
                          </label>
                        </div>

                        {/* Live Audio Preview Player */}
                        {formData.audioUrl && (
                          <div className="pt-2 flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-200">
                            <span className="text-xs font-bold text-emerald-800">Yozib olingan audio:</span>
                            <audio controls src={formData.audioUrl} className="h-8 flex-1"></audio>
                            <button 
                              type="button" 
                              onClick={() => updateField('audioUrl', '')} 
                              className="text-xs font-bold text-rose-600 hover:underline px-2"
                            >
                              O'chirish
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Diqqatga Sazovor Joylar (Obidalar) for Regions */}
                {editing.type === 'regions' && (
                  <div className="mb-8 border-t border-slate-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-lg text-slate-900">Diqqatga Sazovor Joylar (Obidalar)</h4>
                      <button onClick={addPlace} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
                        + Joy qo'shish
                      </button>
                    </div>
                    
                    {formData.famousPlaces?.map((place, idx) => (
                      <div key={idx} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 mb-4 relative">
                        <button onClick={() => removePlace(idx)} className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 font-bold text-lg">
                          ✕
                        </button>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          
                          <div className="sm:col-span-3 bg-slate-100/50 p-3 rounded-xl border border-slate-200 space-y-2">
                            <span className="block text-xs font-bold text-slate-700 uppercase">Joy Nomi (Multi-Language)</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input placeholder="🇮🇹 Italyancha (IT)" className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={place.name_it || ''} onChange={e => updateArrayItem('famousPlaces', idx, 'name_it', e.target.value)} />
                              <input placeholder="🇬🇧 Inglizcha (EN)" className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={place.name_en || ''} onChange={e => updateArrayItem('famousPlaces', idx, 'name_en', e.target.value)} />
                              <input placeholder="🇺🇿 O'zbekcha (UZ)" className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={place.name_uz || ''} onChange={e => updateArrayItem('famousPlaces', idx, 'name_uz', e.target.value)} />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kategoriya</label>
                            <select className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-sm" value={place.category || 'Tarixiy obida'} onChange={e => updateArrayItem('famousPlaces', idx, 'category', e.target.value)}>
                              <option value="Tarixiy obida">Tarixiy obida</option>
                              <option value="Zamonaviy maskan">Zamonaviy maskan</option>
                              <option value="Muzey">Muzey</option>
                              <option value="Ziyoratgoh">Ziyoratgoh</option>
                              <option value="Tabiat">Tabiat va Istirohat bog'i</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Ish Vaqti</label>
                            <input className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-sm" value={place.workHours || ''} placeholder="09:00 - 18:00" onChange={e => updateArrayItem('famousPlaces', idx, 'workHours', e.target.value)} />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kirish Bilet Narxi</label>
                            <input className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-sm" value={place.ticketPrice || ''} placeholder="Bepul" onChange={e => updateArrayItem('famousPlaces', idx, 'ticketPrice', e.target.value)} />
                          </div>
                          
                          <div className="sm:col-span-3 bg-slate-100/50 p-3 rounded-xl border border-slate-200 space-y-2">
                            <span className="block text-xs font-bold text-slate-700 uppercase">Lokatsiya / Manzil (Multi-Language)</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input placeholder="🇮🇹 Italyancha (IT)" className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={place.location_it || ''} onChange={e => updateArrayItem('famousPlaces', idx, 'location_it', e.target.value)} />
                              <input placeholder="🇬🇧 Inglizcha (EN)" className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={place.location_en || ''} onChange={e => updateArrayItem('famousPlaces', idx, 'location_en', e.target.value)} />
                              <input placeholder="🇺🇿 O'zbekcha (UZ)" className="w-full border border-slate-200 bg-white p-2 rounded text-xs" value={place.location_uz || ''} onChange={e => updateArrayItem('famousPlaces', idx, 'location_uz', e.target.value)} />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Google Maps Linki</label>
                            <input className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-sm" value={place.mapUrl || ''} placeholder="https://maps.google.com/..." onChange={e => updateArrayItem('famousPlaces', idx, 'mapUrl', e.target.value)} />
                          </div>

                          <div className="sm:col-span-3">
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-xs font-bold text-slate-600 uppercase">Asosiy Joy Rasmi (Fayldan yuklash & Qirqish)</label>
                              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Tavsiya: 1000 × 750 px (4:3)
                              </span>
                            </div>
                            <input type="file" accept="image/*" className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-sm" onChange={e => handleFileUpload(e, 'image', true, idx)} />
                            {place.image && <img src={place.image} alt="Preview" className="h-20 mt-2 rounded-xl object-cover border border-slate-200 shadow-sm" />}
                          </div>

                          {/* Multi-Photo Gallery Upload Section */}
                          <div className="sm:col-span-3 border-t border-slate-200 pt-3">
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-xs font-bold text-slate-700 uppercase">Ko'proq Rasmlar Galereyasi ({place.gallery?.length || 0} ta rasm)</label>
                              <span className="text-[11px] text-slate-500">Sayyohlarga ko'rsatish uchun rasm qo'shing</span>
                            </div>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-sm mb-3" 
                              onChange={e => handleGalleryUpload(e, idx)} 
                            />
                            {place.gallery && place.gallery.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {place.gallery.map((gImg, gIdx) => (
                                  <div key={gIdx} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm h-24">
                                    <img src={gImg} alt={`Gallery ${gIdx}`} className="w-full h-full object-cover" />
                                    <button 
                                      type="button" 
                                      onClick={() => removeGalleryPhotoFromPlace(idx, gIdx)} 
                                      className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow"
                                      title="Rasmni o'chirish"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="sm:col-span-3 space-y-3 pt-2 border-t border-slate-200">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">🇮🇹 Storia e Dettagli (Italiano)</label>
                              <textarea className="w-full border border-slate-200 bg-white p-3 rounded-xl text-sm h-24" placeholder="Italiano storia e dettagli..." value={place.history_it || ''} onChange={e => updateArrayItem('famousPlaces', idx, 'history_it', e.target.value)} />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">🇬🇧 History & Details (English)</label>
                              <textarea className="w-full border border-slate-200 bg-white p-3 rounded-xl text-sm h-24" placeholder="English history and details..." value={place.history_en || ''} onChange={e => updateArrayItem('famousPlaces', idx, 'history_en', e.target.value)} />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">🇺🇿 Batafsil Ma'lumot (O'zbekcha)</label>
                              <textarea className="w-full border border-slate-200 bg-white p-3 rounded-xl text-sm h-24" placeholder="O'zbekcha batafsil ma'lumot..." value={place.history_uz || place.history || ''} onChange={e => {
                                updateArrayItem('famousPlaces', idx, 'history_uz', e.target.value);
                                updateArrayItem('famousPlaces', idx, 'history', e.target.value);
                              }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-200 flex gap-4">
                  <button onClick={handleSave} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg">
                    Saqlash
                  </button>
                  <button onClick={() => setEditing(null)} className="bg-slate-100 text-slate-700 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-200 border border-slate-200 transition-colors">
                    Bekor qilish
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center shadow-sm">
                <h3 className="text-lg font-bold text-slate-700 mb-1">Tahrirlash rejimiga o'tish</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Chap tomondagi ro'yxatdan biror ma'lumotning <b>"Tahrirlash"</b> tugmasini bosing yoki yangi kiritish uchun <b>"+ Qo'shish"</b> tugmasini tanlang.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* ASOSIY SAHIFA VA O'ZBEKISTON HAQIDA FULL-WIDTH EDITOR CARD */}
        <div className="w-full mt-10 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-5 rounded-2xl shadow-md">
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl tracking-tight">Asosiy Sahifa va "O'zbekiston Haqida" Boshqaruvi</h2>
              <p className="text-xs text-slate-300 mt-1">Uchala tildagi matnlar, faktlar, tarixiy davrlar hamda rasmlarni to'liq tahrirlash</p>
            </div>
            <button 
              onClick={handleSaveHomeFacts}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 self-stretch sm:self-auto justify-center"
            >
              <Save className="w-4 h-4" />
              <span>Barchasini Saqlash</span>
            </button>
          </div>

          {/* 1. Vitrina Rasmi & Hero Banner */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <span className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              🖼️ "O'zbekiston Haqida" Vitrina Rasmi (Hero Banner Photo):
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img 
                src={homeFacts.aboutImage || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1200&q=80'} 
                alt="About Showcase" 
                className="h-28 w-full sm:w-48 object-cover rounded-xl border border-slate-200 shadow-sm shrink-0" 
              />
              <div className="space-y-2 flex-1 w-full">
                <label className="block text-xs font-bold text-slate-700">Fayldan Yangi Rasm Yuklash va Qirqish:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="text-xs w-full bg-white p-2 border border-slate-200 rounded-xl cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      openCropper(file, '16:9', (croppedBase64) => {
                        setHomeFacts(prev => ({ ...prev, aboutImage: croppedBase64 }));
                      });
                    }
                    e.target.value = '';
                  }} 
                />
                <input 
                  type="text" 
                  placeholder="yoki rasm URL manzilini kiriting..." 
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white"
                  value={homeFacts.aboutImage || ''} 
                  onChange={e => setHomeFacts({ ...homeFacts, aboutImage: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 2. Language Specific Fields (3 Columns: IT | EN | UZ) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* IT Column */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <span className="block text-xs font-extrabold text-emerald-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                🇮🇹 Italyancha Ma'lumotlar (IT)
              </span>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Bosh Sarlavha (Headline IT):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.headline_it || ''} onChange={e => setHomeFacts({ ...homeFacts, headline_it: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Ostsarlavha (Subtitle IT):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.subtitle_it || ''} onChange={e => setHomeFacts({ ...homeFacts, subtitle_it: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Biz Haqimizda Hero Title (IT):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.aboutHeroTitle_it || ''} onChange={e => setHomeFacts({ ...homeFacts, aboutHeroTitle_it: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Biz Haqimizda Hero Subtitle (IT):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.aboutHeroSubtitle_it || ''} onChange={e => setHomeFacts({ ...homeFacts, aboutHeroSubtitle_it: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">1-Ustun Sarlavhasi (IT):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs mb-1" value={homeFacts.col1Title_it || ''} onChange={e => setHomeFacts({ ...homeFacts, col1Title_it: e.target.value })} />
                  <textarea rows={3} className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs h-20" value={homeFacts.col1Desc_it || ''} onChange={e => setHomeFacts({ ...homeFacts, col1Desc_it: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">2-Ustun Sarlavhasi (IT):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs mb-1" value={homeFacts.col2Title_it || ''} onChange={e => setHomeFacts({ ...homeFacts, col2Title_it: e.target.value })} />
                  <textarea rows={3} className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs h-20" value={homeFacts.col2Desc_it || ''} onChange={e => setHomeFacts({ ...homeFacts, col2Desc_it: e.target.value })} />
                </div>
              </div>
            </div>

            {/* EN Column */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <span className="block text-xs font-extrabold text-blue-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                🇬🇧 Inglizcha Ma'lumotlar (EN)
              </span>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Bosh Sarlavha (Headline EN):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.headline_en || ''} onChange={e => setHomeFacts({ ...homeFacts, headline_en: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Ostsarlavha (Subtitle EN):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.subtitle_en || ''} onChange={e => setHomeFacts({ ...homeFacts, subtitle_en: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Biz Haqimizda Hero Title (EN):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.aboutHeroTitle_en || ''} onChange={e => setHomeFacts({ ...homeFacts, aboutHeroTitle_en: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Biz Haqimizda Hero Subtitle (EN):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.aboutHeroSubtitle_en || ''} onChange={e => setHomeFacts({ ...homeFacts, aboutHeroSubtitle_en: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">1-Ustun Sarlavhasi (EN):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs mb-1" value={homeFacts.col1Title_en || ''} onChange={e => setHomeFacts({ ...homeFacts, col1Title_en: e.target.value })} />
                  <textarea rows={3} className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs h-20" value={homeFacts.col1Desc_en || ''} onChange={e => setHomeFacts({ ...homeFacts, col1Desc_en: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">2-Ustun Sarlavhasi (EN):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs mb-1" value={homeFacts.col2Title_en || ''} onChange={e => setHomeFacts({ ...homeFacts, col2Title_en: e.target.value })} />
                  <textarea rows={3} className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs h-20" value={homeFacts.col2Desc_en || ''} onChange={e => setHomeFacts({ ...homeFacts, col2Desc_en: e.target.value })} />
                </div>
              </div>
            </div>

            {/* UZ Column */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <span className="block text-xs font-extrabold text-amber-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                🇺🇿 O'zbekcha Ma'lumotlar (UZ)
              </span>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Bosh Sarlavha (Headline UZ):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.headline_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, headline_uz: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Ostsarlavha (Subtitle UZ):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.subtitle_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, subtitle_uz: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Biz Haqimizda Hero Title (UZ):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.aboutHeroTitle_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, aboutHeroTitle_uz: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Biz Haqimizda Hero Subtitle (UZ):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs" value={homeFacts.aboutHeroSubtitle_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, aboutHeroSubtitle_uz: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">1-Ustun Sarlavhasi (UZ):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs mb-1" value={homeFacts.col1Title_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, col1Title_uz: e.target.value })} />
                  <textarea rows={3} className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs h-20" value={homeFacts.col1Desc_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, col1Desc_uz: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">2-Ustun Sarlavhasi (UZ):</label>
                  <input type="text" className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs mb-1" value={homeFacts.col2Title_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, col2Title_uz: e.target.value })} />
                  <textarea rows={3} className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs h-20" value={homeFacts.col2Desc_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, col2Desc_uz: e.target.value })} />
                </div>
              </div>
            </div>

          </div>

          {/* 3. O'ZBEKISTON TARIXI, DINI VA TURMUSH TARZI (3 TA MAVZU KARTALARI FULL-WIDTH) */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <span className="block text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
              🏛️ O'zbekiston Tarixi, Dini va Turmush Tarzi Mavzulari (3 Ta Keng Kartochka):
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Topic 1: Origins */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm flex flex-col">
                <span className="font-extrabold text-[#0c594d] block text-sm border-b border-slate-100 pb-1">
                  1. Tarix va Kelib Chiqishi
                </span>
                
                {/* Photo & File Upload */}
                <div className="space-y-2">
                  <img src={homeFacts.historyOriginsImage || 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?auto=format&fit=crop&w=600&q=80'} alt="Origins" className="w-full h-36 object-cover rounded-xl border border-slate-200" />
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase">Fayldan Rasm Yuklash va Qirqish:</label>
                  <input type="file" accept="image/*" className="text-xs w-full bg-slate-50 p-2 border border-slate-200 rounded-xl cursor-pointer" onChange={e => handleTopicImageUpload(e, 'historyOriginsImage')} />
                  <input type="text" placeholder="yoki Rasm URL manzili..." className="w-full p-2 border border-slate-200 rounded-xl text-xs" value={homeFacts.historyOriginsImage || ''} onChange={e => setHomeFacts({ ...homeFacts, historyOriginsImage: e.target.value })} />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <input type="text" placeholder="Sarlavha 🇮🇹 IT" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={homeFacts.historyOriginsTitle_it || ''} onChange={e => setHomeFacts({ ...homeFacts, historyOriginsTitle_it: e.target.value })} />
                  <textarea rows={2} placeholder="Matn 🇮🇹 IT" className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={homeFacts.historyOrigins_it || ''} onChange={e => setHomeFacts({ ...homeFacts, historyOrigins_it: e.target.value })} />
                  <input type="text" placeholder="Sarlavha 🇬🇧 EN" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={homeFacts.historyOriginsTitle_en || ''} onChange={e => setHomeFacts({ ...homeFacts, historyOriginsTitle_en: e.target.value })} />
                  <textarea rows={2} placeholder="Matn 🇬🇧 EN" className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={homeFacts.historyOrigins_en || ''} onChange={e => setHomeFacts({ ...homeFacts, historyOrigins_en: e.target.value })} />
                  <input type="text" placeholder="Sarlavha 🇺🇿 UZ" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={homeFacts.historyOriginsTitle_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, historyOriginsTitle_uz: e.target.value })} />
                  <textarea rows={2} placeholder="Matn 🇺🇿 UZ" className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={homeFacts.historyOrigins_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, historyOrigins_uz: e.target.value })} />
                </div>
              </div>

              {/* Topic 2: Religion */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm flex flex-col">
                <span className="font-extrabold text-[#0c594d] block text-sm border-b border-slate-100 pb-1">
                  2. Din va E'tiqodlar
                </span>
                
                {/* Photo & File Upload */}
                <div className="space-y-2">
                  <img src={homeFacts.religionFaithImage || 'https://uzbekistan.travel/storage/app/uploads/public/67b/6aa/42a/thumb_4635_740_0_0_0_auto.jpg'} alt="Religion" className="w-full h-36 object-cover rounded-xl border border-slate-200" />
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase">Fayldan Rasm Yuklash va Qirqish:</label>
                  <input type="file" accept="image/*" className="text-xs w-full bg-slate-50 p-2 border border-slate-200 rounded-xl cursor-pointer" onChange={e => handleTopicImageUpload(e, 'religionFaithImage')} />
                  <input type="text" placeholder="yoki Rasm URL manzili..." className="w-full p-2 border border-slate-200 rounded-xl text-xs" value={homeFacts.religionFaithImage || ''} onChange={e => setHomeFacts({ ...homeFacts, religionFaithImage: e.target.value })} />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <input type="text" placeholder="Sarlavha 🇮🇹 IT" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={homeFacts.religionFaithTitle_it || ''} onChange={e => setHomeFacts({ ...homeFacts, religionFaithTitle_it: e.target.value })} />
                  <textarea rows={2} placeholder="Matn 🇮🇹 IT" className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={homeFacts.religionFaith_it || ''} onChange={e => setHomeFacts({ ...homeFacts, religionFaith_it: e.target.value })} />
                  <input type="text" placeholder="Sarlavha 🇬🇧 EN" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={homeFacts.religionFaithTitle_en || ''} onChange={e => setHomeFacts({ ...homeFacts, religionFaithTitle_en: e.target.value })} />
                  <textarea rows={2} placeholder="Matn 🇬🇧 EN" className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={homeFacts.religionFaith_en || ''} onChange={e => setHomeFacts({ ...homeFacts, religionFaith_en: e.target.value })} />
                  <input type="text" placeholder="Sarlavha 🇺🇿 UZ" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={homeFacts.religionFaithTitle_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, religionFaithTitle_uz: e.target.value })} />
                  <textarea rows={2} placeholder="Matn 🇺🇿 UZ" className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={homeFacts.religionFaith_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, religionFaith_uz: e.target.value })} />
                </div>
              </div>

              {/* Topic 3: Lifestyle */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm flex flex-col">
                <span className="font-extrabold text-[#0c594d] block text-sm border-b border-slate-100 pb-1">
                  3. Odamlar va Turmush Tarzi
                </span>
                
                {/* Photo & File Upload */}
                <div className="space-y-2">
                  <img src={homeFacts.lifestyleCultureImage || 'https://uzbekistan.travel/storage/app/uploads/public/67b/6a9/0a4/thumb_4631_740_0_0_0_auto.png'} alt="Lifestyle" className="w-full h-36 object-cover rounded-xl border border-slate-200" />
                  <label className="block text-[10px] font-extrabold text-slate-600 uppercase">Fayldan Rasm Yuklash va Qirqish:</label>
                  <input type="file" accept="image/*" className="text-xs w-full bg-slate-50 p-2 border border-slate-200 rounded-xl cursor-pointer" onChange={e => handleTopicImageUpload(e, 'lifestyleCultureImage')} />
                  <input type="text" placeholder="yoki Rasm URL manzili..." className="w-full p-2 border border-slate-200 rounded-xl text-xs" value={homeFacts.lifestyleCultureImage || ''} onChange={e => setHomeFacts({ ...homeFacts, lifestyleCultureImage: e.target.value })} />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <input type="text" placeholder="Sarlavha 🇮🇹 IT" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={homeFacts.lifestyleCultureTitle_it || ''} onChange={e => setHomeFacts({ ...homeFacts, lifestyleCultureTitle_it: e.target.value })} />
                  <textarea rows={2} placeholder="Matn 🇮🇹 IT" className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={homeFacts.lifestyleCulture_it || ''} onChange={e => setHomeFacts({ ...homeFacts, lifestyleCulture_it: e.target.value })} />
                  <input type="text" placeholder="Sarlavha 🇬🇧 EN" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={homeFacts.lifestyleCultureTitle_en || ''} onChange={e => setHomeFacts({ ...homeFacts, lifestyleCultureTitle_en: e.target.value })} />
                  <textarea rows={2} placeholder="Matn 🇬🇧 EN" className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={homeFacts.lifestyleCulture_en || ''} onChange={e => setHomeFacts({ ...homeFacts, lifestyleCulture_en: e.target.value })} />
                  <input type="text" placeholder="Sarlavha 🇺🇿 UZ" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={homeFacts.lifestyleCultureTitle_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, lifestyleCultureTitle_uz: e.target.value })} />
                  <textarea rows={2} placeholder="Matn 🇺🇿 UZ" className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={homeFacts.lifestyleCulture_uz || ''} onChange={e => setHomeFacts({ ...homeFacts, lifestyleCulture_uz: e.target.value })} />
                </div>
              </div>

            </div>
          </div>

          {/* 4. TARIXIY XRONOLOGIYA (TIMELINE ITEMS FULL-WIDTH) */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <span className="block text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  ⏳ Tarixiy Davrlar Xronologiyasi (Timeline Manager):
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Har bir davr rasmi (fayldan yuklash), nishoni va batafsil matnlarini boshqarish</p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setHomeFacts(prev => ({
                    ...prev,
                    historyTimeline: [
                      ...(prev.historyTimeline || []),
                      {
                        id: Date.now(),
                        period_it: 'Nuovo Periodo', period_en: 'New Period', period_uz: 'Yangi davr',
                        title_it: 'Titolo', title_en: 'Title', title_uz: 'Sarlavha',
                        text_it: 'Descrizione...', text_en: 'Description...', text_uz: 'Tavsif...',
                        image: ''
                      }
                    ]
                  }));
                }}
                className="bg-[#0c594d] hover:bg-[#09473d] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>+ Yangi Davr Qo'shish</span>
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {(homeFacts.historyTimeline || []).map((tItem, tIdx) => (
                <div key={tItem.id || tIdx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-sm text-[#0c594d]">Tarixiy Davr #{tIdx + 1}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        const newTL = [...(homeFacts.historyTimeline || [])];
                        newTL.splice(tIdx, 1);
                        setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                      }}
                      className="text-rose-600 font-extrabold hover:text-rose-800 text-xs bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 transition-colors"
                    >
                      Davrni O'chirish ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Photo + Upload column */}
                    <div className="md:col-span-3 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-150">
                      {tItem.image && (
                        <img src={tItem.image} alt="Timeline period" className="w-full h-28 object-cover rounded-lg border border-slate-200" />
                      )}
                      <label className="block text-[10px] font-extrabold text-slate-600 uppercase">Fayldan Rasm Yuklash:</label>
                      <input type="file" accept="image/*" className="text-xs w-full bg-white p-1.5 border border-slate-200 rounded-lg cursor-pointer" onChange={e => handleTimelineImageUpload(e, tIdx)} />
                      <input type="text" placeholder="Rasm URL..." className="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white" value={tItem.image || ''} onChange={e => {
                        const newTL = [...(homeFacts.historyTimeline || [])];
                        newTL[tIdx] = { ...newTL[tIdx], image: e.target.value };
                        setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                      }} />
                    </div>

                    {/* Periods & Titles column */}
                    <div className="md:col-span-9 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Davr / Yil (IT):</label>
                          <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={tItem.period_it || ''} onChange={e => {
                            const newTL = [...(homeFacts.historyTimeline || [])];
                            newTL[tIdx] = { ...newTL[tIdx], period_it: e.target.value };
                            setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                          }} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Davr / Yil (EN):</label>
                          <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={tItem.period_en || ''} onChange={e => {
                            const newTL = [...(homeFacts.historyTimeline || [])];
                            newTL[tIdx] = { ...newTL[tIdx], period_en: e.target.value };
                            setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                          }} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Davr / Yil (UZ):</label>
                          <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" value={tItem.period_uz || ''} onChange={e => {
                            const newTL = [...(homeFacts.historyTimeline || [])];
                            newTL[tIdx] = { ...newTL[tIdx], period_uz: e.target.value };
                            setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                          }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Sarlavha (IT):</label>
                          <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={tItem.title_it || ''} onChange={e => {
                            const newTL = [...(homeFacts.historyTimeline || [])];
                            newTL[tIdx] = { ...newTL[tIdx], title_it: e.target.value };
                            setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                          }} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Sarlavha (EN):</label>
                          <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={tItem.title_en || ''} onChange={e => {
                            const newTL = [...(homeFacts.historyTimeline || [])];
                            newTL[tIdx] = { ...newTL[tIdx], title_en: e.target.value };
                            setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                          }} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Sarlavha (UZ):</label>
                          <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" value={tItem.title_uz || ''} onChange={e => {
                            const newTL = [...(homeFacts.historyTimeline || [])];
                            newTL[tIdx] = { ...newTL[tIdx], title_uz: e.target.value };
                            setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                          }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">🇮🇹 IT Matn:</label>
                          <textarea rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={tItem.text_it || ''} onChange={e => {
                            const newTL = [...(homeFacts.historyTimeline || [])];
                            newTL[tIdx] = { ...newTL[tIdx], text_it: e.target.value };
                            setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                          }} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">🇬🇧 EN Matn:</label>
                          <textarea rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={tItem.text_en || ''} onChange={e => {
                            const newTL = [...(homeFacts.historyTimeline || [])];
                            newTL[tIdx] = { ...newTL[tIdx], text_en: e.target.value };
                            setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                          }} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">🇺🇿 UZ Matn:</label>
                          <textarea rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs h-16" value={tItem.text_uz || ''} onChange={e => {
                            const newTL = [...(homeFacts.historyTimeline || [])];
                            newTL[tIdx] = { ...newTL[tIdx], text_uz: e.target.value };
                            setHomeFacts({ ...homeFacts, historyTimeline: newTL });
                          }} />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

      {/* INTERACTIVE IMAGE CROPPER MODAL */}
      {cropperModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-xl text-slate-900">
                  Rasmni Qirqish va O'lchamini Moslash
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Tavsiya qilingan kadrga moslab qirqing (100% HD)</p>
              </div>
              <button 
                onClick={() => setCropperModal({ isOpen: false, imageSrc: null, onCropSave: null })} 
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Proportsiya Presetlari */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <span className="text-xs font-bold text-slate-500 uppercase mr-1">Proportsiya:</span>
              <button 
                type="button" 
                onClick={() => setCropperRatio('16:9')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${cropperRatio === '16:9' ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Banner (16:9)
              </button>
              <button 
                type="button" 
                onClick={() => setCropperRatio('4:3')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${cropperRatio === '4:3' ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Kartochka (4:3)
              </button>
              <button 
                type="button" 
                onClick={() => setCropperRatio('1:1')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${cropperRatio === '1:1' ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Kvadrat (1:1)
              </button>
              <button 
                type="button" 
                onClick={() => setCropperRatio('original')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${cropperRatio === 'original' ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Asl o'lcham
              </button>
            </div>

            {/* Live Canvas Viewport */}
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-[16/9] flex items-center justify-center border border-slate-800 shadow-inner mb-4">
              <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Interactive Control Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Kattalashtirish (Zoom)</span>
                  <span className="text-slate-500">{Math.round(cropScale * 100)}%</span>
                </label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="3" 
                  step="0.05" 
                  value={cropScale} 
                  onChange={e => setCropScale(parseFloat(e.target.value))} 
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Burish (Rotation)</span>
                  <span className="text-slate-500">{cropRotation}°</span>
                </label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setCropRotation(r => (r + 90) % 360)} 
                    className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold py-1.5 rounded-lg text-slate-800 shadow-sm"
                  >
                    +90° Burish
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setCropScale(1); setCropPan({x:0, y:0}); setCropRotation(0); }} 
                    className="px-3 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold py-1.5 rounded-lg text-slate-600 shadow-sm"
                  >
                    Qaytarish
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Chap / O'ngga surish</span>
                </label>
                <input 
                  type="range" 
                  min="-300" 
                  max="300" 
                  step="5" 
                  value={cropPan.x} 
                  onChange={e => setCropPan(prev => ({ ...prev, x: parseInt(e.target.value) }))} 
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Yuqori / Pastga surish</span>
                </label>
                <input 
                  type="range" 
                  min="-300" 
                  max="300" 
                  step="5" 
                  value={cropPan.y} 
                  onChange={e => setCropPan(prev => ({ ...prev, y: parseInt(e.target.value) }))} 
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setCropperModal({ isOpen: false, imageSrc: null, onCropSave: null })} 
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                type="button" 
                onClick={saveCroppedImage} 
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
              >
                Qirqish va Saqlash (95% HD)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
    </div>
  );
}
