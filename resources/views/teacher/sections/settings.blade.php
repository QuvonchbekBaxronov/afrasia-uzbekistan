@extends('teacher.layout')

@section('title', 'Sozlamalar')
@section('page-title', 'Sozlamalar')

@section('content')

<div class="row" style="margin: 0 -15px;">
    <!-- Profil ma'lumotlari -->
    <div class="col-lg-8" style="padding: 0 15px;">
        <div class="card">
            <div class="card-header">
                <h4>Profil Ma'lumotlari</h4>
            </div>
            <div class="card-body">
                <form action="{{ route('teacher.profile.update') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')

                    <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 30px;">
                        <img
                            src="{{ $user->avatar_url }}"
                            alt="Avatar"
                            id="avatar-preview"
                            style="width: 120px; height: 120px; border-radius: 50%; border: 5px solid var(--primary); object-fit: cover;">
                        <div>
                            <label class="btn-primary" style="padding: 10px 20px; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
                                <i class="fas fa-camera"></i> Rasmni O'zgartirish
                                <input type="file" name="avatar" accept="image/*" style="display: none;" onchange="previewImage(event)">
                            </label>
                            <p style="margin: 10px 0 0; color: #64748b;">JPG, PNG yoki GIF. Maksimal 2MB</p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: var(--dark);">Ism va Familiya</label>
                            <input type="text" name="name" class="form-control" value="{{ old('name', $user->name) }}"
                                style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 15px;" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: var(--dark);">Telefon Raqam</label>
                            <input type="text" name="phone" class="form-control" value="{{ old('phone', $user->phone ?? '') }}"
                                style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 15px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: var(--dark);">E-mail</label>
                            <input type="email" name="email" class="form-control" value="{{ old('email', $user->email) }}"
                                style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 15px;" required>
                        </div>
                    </div>
                    <div style="margin-top: 30px;">
                        <button type="submit" class="btn-primary" style="padding: 14px 32px;">
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
                <form action="{{ route('teacher.password.update') }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div style="max-width: 500px;">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: var(--dark);">Joriy Parol</label>
                            <input type="password" name="current_password" class="form-control" placeholder=""
                                style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 15px;" required>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: var(--dark);">Yangi Parol</label>
                            <input type="password" name="password" class="form-control" placeholder="Yangi parol kiriting"
                                style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 15px;" required minlength="8">
                            <small style="color: #64748b; display: block; margin-top: 6px;">Kamida 8 belgidan iborat bo'lsin</small>
                        </div>
                        <div style="margin-bottom: 30px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 700; color: var(--dark);">Yangi Parolni Tasdiqlash</label>
                            <input type="password" name="password_confirmation" class="form-control" placeholder="Yana bir marta kiriting"
                                style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 15px;" required>
                        </div>

                        <button type="submit" class="btn-primary" style="padding: 14px 32px; background: linear-gradient(135deg, #dc2626, #ef4444);">
                            <i class="fas fa-key"></i> Parolni Yangilash
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .form-control {
        transition: all 0.3s;
    }

    .form-control:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
</style>

<script>
    function previewImage(event) {
        const input = event.target;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('avatar-preview').src = e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
</script>

@endsection