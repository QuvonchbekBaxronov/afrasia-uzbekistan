@extends('student.layout')

@section('title', 'Sozlamalar')
@section('page-title', 'Sozlamalar')

@php
    use Illuminate\Support\Facades\Storage;
@endphp

@section('content')

@if(session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="fas fa-check-circle"></i> {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

@if(session('error'))
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="fas fa-exclamation-circle"></i> {{ session('error') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

@if($errors->any())
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="fas fa-exclamation-circle"></i>
        <ul style="margin: 0; padding-left: 20px;">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

<div class="row">
    <!-- Profil ma'lumotlari -->
    <div class="col-lg-8">
        <div class="card">
            <div class="card-header">
                <h4>Profil Ma'lumotlari</h4>
            </div>
            <div class="card-body">
                <form action="{{ route('student.settings.profile') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 30px;">
                        @php
                            if ($user->avatar) {
                                $avatarUrl = Storage::disk('s3')->url($user->avatar);
                            } else {
                                $avatarUrl = 'https://ui-avatars.com/api/?name=' . urlencode($user->name ?? '') . '&background=3b82f6&color=fff&size=128';
                            }
                        @endphp
                        <img src="{{ $avatarUrl }}" alt="Avatar" id="avatarPreview" style="width: 120px; height: 120px; border-radius: 50%; border: 5px solid var(--primary); object-fit:cover">
                        <div style="flex:1">
                            <label class="btn btn-outline-secondary" style="padding: 10px 20px; cursor:pointer">
                                <i class="fas fa-camera"></i> Rasmni O'zgartirish
                                <input type="file" name="avatar" accept="image/*" style="display:none">
                            </label>
                            <p style="margin: 10px 0 0; color: #64748b;">JPG yoki PNG. Maksimal 2MB</p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700;">Ism va Familiya</label>
                            <input type="text" name="name" class="form-control" value="{{ old('name', $user->name) }}" style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700;">Telefon</label>
                            <input type="text" name="phone" class="form-control" value="{{ old('phone', $user->phone) }}" style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700;">E-mail</label>
                            <input type="email" name="email" class="form-control" value="{{ old('email', $user->email) }}" style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px;">
                        </div>
                        {{-- <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700;">Yosh (ixtiyoriy)</label>
                            <input type="number" name="age" class="form-control" value="{{ old('age', $user->age) }}" style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px;">
                        </div> --}}
                    </div>

                    <div style="margin-top: 30px;">
                        <button class="btn-primary" style="padding: 14px 32px;">
                            <i class="fas fa-save"></i> Saqlash
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Parolni almashtirish -->
        <div class="card" style="margin-top: 30px;">
            <div class="card-header">
                <h4>Parolni Almashtirish</h4>
            </div>
            <div class="card-body">
                <form action="{{ route('student.settings.password') }}" method="POST" style="max-width:500px;">
                    @csrf
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 700;">Joriy Parol</label>
                        <input type="password" name="current_password" class="form-control" placeholder="••••••••" required>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 700;">Yangi Parol</label>
                        <input type="password" name="password" class="form-control" placeholder="Yangi parol" required>
                    </div>
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 700;">Tasdiqlash</label>
                        <input type="password" name="password_confirmation" class="form-control" placeholder="Yana kiriting" required>
                    </div>
                    <button class="btn-primary" style="background: linear-gradient(135deg, #dc2626, #ef4444);">
                        <i class="fas fa-key"></i> Parolni Yangilash
                    </button>
                </form>
            </div>
        </div>

        <!-- Bildirishnomalar -->
        {{-- <div class="card" style="margin-top: 30px;">
            <div class="card-header">
                <h4>Bildirishnomalar</h4>
            </div>
            <div class="card-body">
                <form action="{{ route('student.settings.notifications') }}" method="POST">
                    @csrf
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                        <div>
                            <h6 style="margin:0; font-weight:700;">Email xabarnomalar</h6>
                            <p style="margin:4px 0 0; color:#64748b;">Yangi xabar va eslatmalarni email orqali oling</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" name="email_notifications" {{ old('email_notifications', $user->email_notifications) ? 'checked' : '' }}>
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                        <div>
                            <h6 style="margin:0; font-weight:700;">Push xabarnomalar</h6>
                            <p style="margin:4px 0 0; color:#64748b;">Real-time bildirishnomalarni olish</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" name="push_notifications" {{ old('push_notifications', $user->push_notifications) ? 'checked' : '' }}>
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <button class="btn-primary" style="padding: 12px 28px;">
                        <i class="fas fa-bell"></i> Saqlash
                    </button>
                </form>
            </div>
        </div> --}}
    </div>
</div>

<style>
/* Toggle switch (oldingi sahifalardan nusxa) */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #cbd5e1;
    transition: .4s;
    border-radius: 34px;
}
.slider:before {
    position: absolute;
    content: "";
    height: 26px; width: 26px;
    left: 4px; bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}
input:checked + .slider { background-color: var(--primary); }
input:checked + .slider:before { transform: translateX(26px); }
</style>

<script>
// Avatar rasmni preview qilish
document.addEventListener('DOMContentLoaded', function() {
    const avatarInput = document.querySelector('input[name="avatar"]');
    const avatarImg = document.getElementById('avatarPreview');
    
    if (avatarInput && avatarImg) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Fayl hajmini tekshirish (2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('Rasm hajmi 2MB dan kichik bo\'lishi kerak!');
                    e.target.value = '';
                    return;
                }
                
                // Rasm formatini tekshirish
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Faqat JPG, PNG yoki GIF formatdagi rasmlar qabul qilinadi!');
                    e.target.value = '';
                    return;
                }
                
                // Preview ko'rsatish
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
</script>

@endsection
