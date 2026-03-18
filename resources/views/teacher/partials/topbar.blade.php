<div class="top-bar">
    <h1 class="page-title">@yield('page-title', 'Bosh Sahifa')</h1>
    <div class="user-info">
        <img src="{{ Auth::user()->avatar_url }}"
            alt="Teacher" class="avatar"
            style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary);">
        <div>
            <h5 style="margin: 0; font-weight: 800; font-size: 16px;">{{ Auth::user()->name }}</h5>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
                {{ Auth::user()->speciality ?? (Auth::user()->role == 'teacher' ? "O'qituvchi" : '') }}
            </p>
        </div>
    </div>
</div>