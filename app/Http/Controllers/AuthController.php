<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Request as FacadesRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\VerifyCodeRequest;

class AuthController extends Controller
{
    public function login_blade()
    {
        return view("auth.login");
    }

    public function register_blade()
    {
        return view("auth.register");
    }

    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $code = rand(100000, 999999);

        $user = User::create([
            'name'              => $validated['name'],
            'email'             => $validated['email'],
            'password'          => Hash::make($validated['password']),
            'role'              => 'user',
            'status'            => true,
            'phone'             => $validated['phone'],
            'is_verified'       => false,
            'verification_code' => $code,
        ]);

        // Chiroyli HTML email yuborish
        $html = '
    <!DOCTYPE html>
    <html lang="uz">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tasdiqlash kodingiz</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; text-align: center; color: #333; }
            .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; background: #f0f2ff; padding: 20px; border-radius: 12px; display: inline-block; margin: 20px 0; color: #667eea; }
            .footer { background: #f8f9fc; padding: 20px; text-align: center; color: #888; font-size: 14px; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email tasdiqlash</h1>
            </div>
            <div class="content">
                <p>Salom, <strong>' . htmlspecialchars($user->name) . '</strong>!</p>
                <p>Akkountingizni faollashtirish uchun quyidagi tasdiqlash kodini kiriting:</p>
                <div class="code">' . $code . '</div>
                <p>Kod faqat 10 daqiqa amal qiladi.</p>
                <p>Agar siz ro\'yxatdan o\'tmagan bo\'lsangiz, bu xatni e\'tiborsiz qoldiring.</p>
            </div>
            <div class="footer">
                &copy; ' . date('Y') . ' Edukate. Barcha huquqlar himoyalangan.<br>
                Savollaringiz bo\'lsa: support@edukate.uz
            </div>
        </div>
    </body>
    </html>';

        Mail::html($html, function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Tasdiqlash kodingiz');
        });

        return redirect()->route('verify.show', ['email' => $user->email])
            ->with('success', 'Emailga tasdiqlash kodi yuborildi. Iltimos, pochta qutingizni tekshiring (spam papkasini ham)!');
    }


    public function login(LoginRequest $request)
    {
        // 1. Validation (FormRequest handles this now)
        $validated = $request->validated();

        $email = $request->email;
        $password = $request->password;
        $remember = $request->has('remember'); // "Meni eslab qol" checkbox

        // 2. Auth::attempt — Laravelning o'zi parolni tekshiradi (hash bilan)
        if (Auth::attempt(['email' => $email, 'password' => $password], $remember)) {
            // Login muvaffaqiyatli
            $request->session()->regenerate(); // Session fixation oldini olish

            $user = Auth::user();

            if ($user) {
                $user->update([
                    'status' => true
                ]);
            }

            // Role ga qarab yo'naltirish
            if ($user->role === 'teacher') {
                return redirect('/teacher/dashboard')->with('success', 'Xush kelibsiz, o\'qituvchi!');
            }

            if ($user->role === 'admin') {
                return redirect('/admin/dashboard')->with('success', 'Xush kelibsiz, admin!');
            }

            // Oddiy user (student)
            return redirect('/')->with('success', 'Muvaffaqiyatli kirish!');
        }

        // 3. Agar login muvaffaqiyatsiz bo'lsa
        return back()->withErrors([
            'email' => 'Email yoki parol noto\'g\'ri.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        Auth::logout();

        $request->session()->invalidate(); // sessiyani tozalaydi
        $request->session()->regenerateToken(); // CSRF tokenni yangilaydi

        if ($user) {
            $user->update([
                'status' => false
            ]);
        }

        return redirect('/')->with('success', 'Muvaffaqiyatli chiqdingiz!');
    }

    public function showVerifyForm(Request $request)
    {
        return view('auth.verify');
    }
    public function verify(VerifyCodeRequest $request)
    {
        $validated = $request->validated();

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->with('error', 'Foydalanuvchi topilmadi.');
        }

        if ($user->verification_code != $request->code) {
            return back()->with('error', 'Kod noto‘g‘ri.');
        }

        // Tasdiqlash
        $user->update([
            'is_verified' => true,
            'verification_code' => null
        ]);

        return redirect('/login')->with('success', 'Email tasdiqlandi! Endi tizimga kirishingiz mumkin.');
    }
}
