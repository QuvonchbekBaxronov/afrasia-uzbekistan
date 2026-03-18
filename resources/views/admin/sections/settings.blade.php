@extends('admin.layout')

@section('title', 'Sozlamalar')
@section('page-title', 'Sozlamalar')

@section('content')
<div class="row" style="margin: 0 -15px;">
    <!-- Chap taraf: Profil va tizim ma'lumotlari -->
    <div class="col-lg-4" style="padding: 0 15px;">
        <form action="{{ route('admin.settings.profile') }}" method="POST" enctype="multipart/form-data" id="profileForm">
            @csrf
            <div class="card">
                <div class="card-body">
                    <div style="text-align: center; padding: 30px 0;">
                        <img src="{{ $user->avatar_url }}"
                             alt="Admin Avatar"
                             id="avatar-preview"
                             style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover;
                                    border: 6px solid var(--primary); box-shadow: 0 8px 25px rgba(0,0,0,0.15);">

                        <h4 style="margin: 20px 0 8px 0; font-weight: 800; font-size: 22px;">{{ $user->name }}</h4>
                        <p style="color: #64748b; margin: 0; font-size: 15px;">{{ $user->email }}</p>

                        <!-- Rasm o'zgartirish tugmasi -->
                        <label class="btn-primary mt-4"
                               style="display: inline-block; padding: 12px 32px; border-radius: 14px; cursor: pointer;
                                      font-weight: 600; position: relative; overflow: hidden;">
                            <i class="fas fa-camera me-2"></i> Rasmni O'zgartirish
                            <input type="file"
                                   name="avatar"
                                   id="admin-avatar-input"
                                   accept="image/jpeg,image/png,image/gif,image/webp"
                                   style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        </label>

                        <!-- Yuklanish holati -->
                        <div id="avatar-upload-status" class="mt-3 text-info fw-medium" style="display: none;">
                            <i class="fas fa-spinner fa-spin me-2"></i> Yuklanmoqda...
                        </div>

                        <!-- Xabarlar -->
                        @if(session('success'))
                            <div class="alert alert-success mt-3 mb-0">{{ session('success') }}</div>
                        @endif
                        @if(session('error'))
                            <div class="alert alert-danger mt-3 mb-0">{{ session('error') }}</div>
                        @endif
                        @error('avatar')
                            <div class="alert alert-danger mt-3 mb-0">{{ $message }}</div>
                        @enderror
                    </div>

                    <hr style="margin: 20px 0; border-color: #e2e8f0;">

                    <div class="mb-3">
                        <label class="form-label fw-bold">Ism</label>
                        <input type="text" name="name" class="form-control" value="{{ old('name', $user->name) }}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">E-mail</label>
                        <input type="email" name="email" class="form-control" value="{{ old('email', $user->email) }}" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label fw-bold">Telefon</label>
                        <input type="text" name="phone" class="form-control" value="{{ old('phone', $user->phone) }}" placeholder="+998">
                    </div>

                    <div class="text-end">
                        <button type="submit" class="btn btn-primary px-5" style="padding: 12px 30px; border-radius: 12px;">
                            <i class="fas fa-save me-2"></i> Saqlash
                        </button>
                    </div>
                </div>
            </div>
        </form>

        <!-- Tizim ma'lumotlari -->
        <div class="card mt-4">
            <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-info-circle me-2"></i> Tizim Ma'lumotlari</h5>
            </div>
            <div class="card-body py-3">
                <div class="d-flex justify-content-between py-3 border-bottom">
                    <span style="color: #64748b;">Versiya:</span>
                    <strong>v2.5.0</strong>
                </div>
                <div class="d-flex justify-content-between py-3 border-bottom">
                    <span style="color: #64748b;">Database:</span>
                    <strong>PostgreSQL</strong>
                </div>
                <div class="d-flex justify-content-between py-3 border-bottom">
                    <span style="color: #64748b;">Server holati:</span>
                    <strong class="text-success">Online</strong>
                </div>
                <div class="d-flex justify-content-between py-3">
                    <span style="color: #64748b;">Oxirgi backup:</span>
                    <strong>21.12.2025</strong>
                </div>
            </div>
        </div>
    </div>

    <!-- O'ng taraf: Parol o'zgartirish -->
    <div class="col-lg-8" style="padding: 0 15px;">
        <form action="{{ route('admin.settings.password') }}" method="POST">
            @csrf
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="mb-0"><i class="fas fa-shield-alt me-2"></i> Xavfsizlik</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-4">
                            <label class="form-label fw-bold">Joriy Parol</label>
                            <input name="current_password" type="password" class="form-control" required autocomplete="current-password">
                            @error('current_password')
                                <small class="text-danger">{{ $message }}</small>
                            @enderror
                        </div>
                        <div class="col-md-6 mb-4">
                            <label class="form-label fw-bold">Yangi Parol</label>
                            <input name="password" type="password" class="form-control" required autocomplete="new-password">
                            @error('password')
                                <small class="text-danger">{{ $message }}</small>
                            @enderror
                        </div>
                        <div class="col-md-12 mb-4">
                            <label class="form-label fw-bold">Parolni Tasdiqlash</label>
                            <input name="password_confirmation" type="password" class="form-control" required autocomplete="new-password">
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary px-5" style="padding: 14px 32px; border-radius: 12px;">
                        <i class="fas fa-key me-2"></i> Parolni O'zgartirish
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('admin-avatar-input');
    const preview = document.getElementById('avatar-preview');
    const status = document.getElementById('avatar-upload-status');
    const form = document.getElementById('profileForm');

    if (!input || !preview || !form) return;

    input.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // Fayl turi tekshiruvi
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Faqat JPG, PNG, GIF yoki WEBP formatdagi rasmlar qabul qilinadi.');
            input.value = '';
            return;
        }

        // Hajm tekshiruvi (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Rasm hajmi 5MB dan oshmasligi kerak.');
            input.value = '';
            return;
        }

        // Preview yangilash
        const reader = new FileReader();
        reader.onload = function (ev) {
            preview.src = ev.target.result;
        };
        reader.readAsDataURL(file);

        // Yuklanish holatini ko'rsatish
        if (status) {
            status.style.display = 'block';
        }

        // Formani avtomatik yuborish
        form.submit();
    });
});
</script>
@endsection