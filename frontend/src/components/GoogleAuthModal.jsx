import { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Check, Heart, Trophy, Compass, Mail, Lock, User, AlertCircle, ArrowRight, KeyRound, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
];

export default function GoogleAuthModal({ currentLang }) {
  const lang = currentLang?.code || 'it';
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    oneClickGoogleLogin, 
    sendRegistrationCode, 
    verifyRegistrationCode, 
    resendRegistrationCode, 
    loginWithEmail, 
    loading 
  } = useAuth();

  // Mode: 'signin' | 'register'
  const [authMode, setAuthMode] = useState('signin');

  // Register Steps: 'form' | 'verify'
  const [regStep, setRegStep] = useState('form');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);

  // OTP Verification Fields
  const [otpCode, setOtpCode] = useState('');
  const [codeHelper, setCodeHelper] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // Error & Feedback
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Timer countdown effect for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!authModalOpen) return null;

  const resetState = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setRegStep('form');
    setOtpCode('');
    setCodeHelper(null);
  };

  const handleClose = () => {
    resetState();
    setAuthModalOpen(false);
  };

  // Step 1: Send 6-digit Code to Gmail
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg(lang === 'it' ? "Tutti i campi sono obbligatori." : "Ism, email va parolni to'liq kiriting.");
      return;
    }

    const res = await sendRegistrationCode({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      avatar: selectedAvatar
    });

    if (res.success) {
      setRegStep('verify');
      setCountdown(60);
      setSuccessMsg(res.message);
      if (res.codePreview) {
        setCodeHelper(res.codePreview);
      }
    } else {
      setErrorMsg(res.error);
    }
  };

  // Step 2: Verify 6-digit Code
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMsg(lang === 'it' ? "Inserisci il codice a 6 cifre." : "6 xonali tasdiqlash kodini to'liq kiriting.");
      return;
    }

    const res = await verifyRegistrationCode(email.trim(), otpCode.trim());
    if (res.success) {
      handleClose();
    } else {
      setErrorMsg(res.error);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setErrorMsg(null);
    const res = await resendRegistrationCode(email.trim());
    if (res.success) {
      setCountdown(60);
      setSuccessMsg(res.message);
      if (res.codePreview) {
        setCodeHelper(res.codePreview);
      }
    } else {
      setErrorMsg(res.error);
    }
  };

  // Sign In submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg(lang === 'it' ? "Inserisci email e password." : "Email va parolni kiriting.");
      return;
    }

    const res = await loginWithEmail(email.trim(), password.trim());
    if (res.success) {
      handleClose();
    } else {
      setErrorMsg(res.error);
    }
  };

  // Instant Google Quick Login
  const handleGoogleQuick = async () => {
    setErrorMsg(null);
    const targetEmail = email.trim() || (name ? `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com` : "baxronovquvonchbek11@gmail.com");
    const targetName = name.trim() || targetEmail.split('@')[0];
    const res = await oneClickGoogleLogin(targetEmail, targetName, selectedAvatar);
    if (res.success) {
      handleClose();
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-scaleUp border border-slate-100 max-h-[92vh] overflow-y-auto font-sans">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-100 shadow-xs">
            <span className="text-2xl">🇺🇿</span>
          </div>

          <h2 className="text-2xl font-serif font-black text-slate-900">
            {lang === 'it' 
              ? (authMode === 'signin' ? 'Accedi ad Afrasia' : (regStep === 'verify' ? 'Verifica la tua Email' : 'Crea il tuo Account')) 
              : (authMode === 'signin' ? 'Afrasiaga Kirish' : (regStep === 'verify' ? 'Gmail Pochtani Tasdiqlash' : 'Ro\'yxatdan O\'tish'))}
          </h2>

          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {regStep === 'verify'
              ? (lang === 'it' ? `Abbiamo inviato un codice a 6 cifre a ${email}` : `${email} pochtasiga 6 xonali tasdiqlash kodi yuborildi.`)
              : (lang === 'it' 
                ? 'Accedi per salvare luoghi, gestire i viaggi e registrare il tuo attestato di lingua.' 
                : 'Sevimli obidalarni saqlash, sayohatlarni bron qilish va rasmiy sertifikat olish uchun kiring.')}
          </p>
        </div>

        {/* Tabs: Kirish vs Ro'yxatdan O'tish (only in form step) */}
        {regStep === 'form' && (
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center mb-5 text-xs font-bold">
            <button
              onClick={() => { setAuthMode('signin'); resetState(); }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'signin' 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {lang === 'it' ? 'Accedi (Login)' : 'Kirish'}
            </button>
            <button
              onClick={() => { setAuthMode('register'); resetState(); }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'register' 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {lang === 'it' ? 'Registrati (Nuovo)' : 'Ro\'yxatdan O\'tish'}
            </button>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Helper preview banner for instant verification code copy/paste */}
        {codeHelper && regStep === 'verify' && (
          <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tasdiqlash kodingiz: <strong className="font-mono text-sm tracking-widest">{codeHelper}</strong></span>
            </div>
            <button 
              type="button" 
              onClick={() => setOtpCode(codeHelper)}
              className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950"
            >
              Avtomatik kiritish
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW A: SIGN IN MODE */}
        {/* ========================================================================= */}
        {authMode === 'signin' && (
          <div className="space-y-4">
            {/* Google One-Click Button */}
            <button
              type="button"
              onClick={handleGoogleQuick}
              disabled={loading}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-2xl border border-slate-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span className="text-xs font-bold text-slate-700">
                {loading 
                  ? (lang === 'it' ? 'Connessione in corso...' : 'Ulanmoqda...') 
                  : (lang === 'it' ? 'Continua con Google' : 'Google orqali bir bosishda kirish')}
              </span>
            </button>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span>{lang === 'it' ? 'oppure con Email e Password' : 'yoki Email va parol orqali'}</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Email (Gmail)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nomingiz@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {lang === 'it' ? 'Password' : 'Parol'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0c594d] hover:bg-[#09473d] disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>{lang === 'it' ? 'Accedi al Profilo' : 'Tizimga Kirish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW B: REGISTER MODE — STEP 1: FORM */}
        {/* ========================================================================= */}
        {authMode === 'register' && regStep === 'form' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {lang === 'it' ? 'Nome e Cognome' : 'Ism va Familiyangiz'} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan, Quvonchbek Baxronov"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Gmail Manzili *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="baxronovquvonchbek11@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-xs text-slate-900 outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                📩 Ushbu pochtaga 6 xonali tasdiqlash kodi yuboriladi.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {lang === 'it' ? 'Password' : 'Parol Yarating'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="pt-1">
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                {lang === 'it' ? 'Scegli il tuo Avatar Profilo:' : 'Profil Rasmini Tanlang:'}
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform shrink-0 ${
                      selectedAvatar === av ? 'border-emerald-600 scale-110 shadow-sm ring-2 ring-emerald-200' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0c594d] hover:bg-[#09473d] disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Kodni yubormoqda...</span>
              ) : (
                <>
                  <span>{lang === 'it' ? 'Invia Codice di Verifica' : 'Kodni Gmailga Yuborish'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* VIEW C: REGISTER MODE — STEP 2: OTP VERIFICATION */}
        {/* ========================================================================= */}
        {authMode === 'register' && regStep === 'verify' && (
          <form onSubmit={handleOtpVerify} className="space-y-4 animate-fadeIn">
            
            <div className="text-center space-y-2 py-2">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <KeyRound className="w-7 h-7 text-emerald-700" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Pochtaga yuborilgan <strong>6 xonali tasdiqlash kodi</strong>ni kiriting:
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-1">
              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full py-3 text-center font-mono text-2xl font-black tracking-widest text-slate-900 border-2 border-emerald-500 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              />
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="w-full py-3 bg-[#0c594d] hover:bg-[#09473d] disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Tekshirilmoqda...</span>
              ) : (
                <>
                  <span>{lang === 'it' ? 'Conferma e Crea Account' : 'Tasdiqlash va Akkaunt Ochish'}</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Resend & Back controls */}
            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setRegStep('form')}
                className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Boshqa email kiritish</span>
              </button>

              <button
                type="button"
                disabled={countdown > 0}
                onClick={handleResendOtp}
                className={`font-bold flex items-center gap-1 ${
                  countdown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-emerald-700 hover:text-emerald-900 underline'
                }`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{countdown > 0 ? `Qayta yuborish (${countdown}s)` : 'Kodni qayta yuborish'}</span>
              </button>
            </div>

          </form>
        )}

        <p className="text-[10px] text-center text-slate-400 mt-5">
          {lang === 'it' 
            ? 'Accedendo accetti i Termini di Servizio di Afrasia Uzbekistan.' 
            : 'Ro\'yxatdan o\'tish orqali Afrasia foydalanish shartlariga rozilik bildirasiz.'}
        </p>

      </div>
    </div>
  );
}
