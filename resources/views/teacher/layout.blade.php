<!DOCTYPE html>
<html lang="uz">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="reverb-key" content="{{ env('REVERB_APP_KEY') }}">
    <meta name="reverb-host" content="{{ env('REVERB_HOST') }}">
    <meta name="reverb-port" content="{{ env('REVERB_PORT') }}">
    <meta name="reverb-scheme" content="{{ env('REVERB_SCHEME') }}">
    <meta name="user-id" content="{{ auth()->id() }}">
    <title>O'qituvchi Panel - @yield('title')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #10b981;
            --secondary: #059669;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #06b6d4;
            --dark: #0f172a;
            --light: #f1f5f9;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            min-height: 100vh;
        }

        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            width: 280px;
            background: linear-gradient(180deg, #064e3b 0%, #065f46 100%);
            padding: 20px;
            overflow-y: auto;
            box-shadow: 5px 0 30px rgba(0, 0, 0, 0.4);
            z-index: 1000;
        }

        .sidebar::-webkit-scrollbar {
            width: 6px;
        }

        .sidebar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 20px 10px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 30px;
        }

        .brand i {
            font-size: 38px;
            background: linear-gradient(135deg, #10b981, #34d399);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .brand h3 {
            color: white;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }

        .menu {
            list-style: none;
        }

        .menu-item {
            margin-bottom: 8px;
        }

        .menu-link {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 16px 20px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            border-radius: 14px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 600;
            position: relative;
            overflow: hidden;
        }

        .menu-link::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 3px;
            background: var(--primary);
            transform: scaleY(0);
            transition: transform 0.3s;
        }

        .menu-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            transform: translateX(10px);
        }

        .menu-link:hover::before {
            transform: scaleY(1);
        }

        .menu-link.active {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5);
        }

        .menu-link i {
            font-size: 20px;
            width: 25px;
        }



        .badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            margin-left: auto;
        }

        .main-content {
            margin-left: 280px;
            padding: 35px;
            min-height: 100vh;
        }

        .top-bar {
            background: white;
            padding: 28px 40px;
            border-radius: 24px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
            margin-bottom: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .page-title {
            font-size: 34px;
            font-weight: 900;
            background: linear-gradient(135deg, #059669, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .search-box {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .search-input {
            padding: 12px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            width: 300px;
            font-size: 15px;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .avatar {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            border: 4px solid var(--primary);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-bottom: 35px;
        }

        .stat-card {
            background: white;
            padding: 35px;
            border-radius: 24px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 25px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, transparent, rgba(16, 185, 129, 0.05));
            transform: translateX(-100%);
            transition: transform 0.4s;
        }

        .stat-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.18);
        }

        .stat-card:hover::before {
            transform: translateX(0);
        }

        .stat-icon {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            position: relative;
            z-index: 1;
        }

        .stat-icon.green {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        }

        .stat-icon.blue {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
        }

        .stat-icon.orange {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
        }

        .stat-icon.purple {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }

        .stat-info {
            flex: 1;
            position: relative;
            z-index: 1;
        }

        .stat-info h3 {
            font-size: 42px;
            font-weight: 900;
            margin: 0;
            color: var(--dark);
        }



        .stat-info p {
            color: #64748b;
            margin: 5px 0 0 0;
            font-weight: 600;
            font-size: 15px;
        }

        .card {
            background: white;
            border-radius: 24px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-bottom: 35px;
        }

        .card-header {
            padding: 30px 35px;
            border-bottom: 2px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-header h4 {
            font-size: 24px;
            font-weight: 800;
            color: var(--dark);
            margin: 0;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border: none;
            padding: 14px 32px;
            border-radius: 14px;
            font-weight: 700;
            color: white;
            transition: all 0.3s;
            cursor: pointer;
        }

        .btn-primary:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5);
        }

        .card-body {
            padding: 35px;
        }

        /* Eski @media (max-width: 768px) blokini mana bunga almashtiring */
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                left: 0 !important;
                z-index: 1001;
                /* Overlaydan balandda turishi uchun */
            }

            .sidebar.active {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0 !important;
                padding: 15px;
            }

            .top-bar {
                flex-direction: row !important;
                /* Ustma-ust bo'lib qolmasligi uchun */
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
            }

            .page-title {
                font-size: 20px;
                /* Mobilda sarlavhani kichraytiramiz */
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .user-info div {
                display: none;
                /* Mobilda faqat rasm qolsa joy ko'proq bo'ladi (ixtiyoriy) */
            }
        }

        /* Buni @media blokidan tashqariga qo'shing */
        .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 1000;
        }

        .sidebar-overlay.show {
            display: block;
        }
    </style>
</head>

<body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pusher-js@8.3.0/dist/web/pusher.min.js"></script>
    <script src="https://unpkg.com/laravel-echo/dist/echo.iife.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.querySelector('.sidebar');
            const toggleBtn = document.getElementById('sidebarCollapse');

            // Overlay (orqa fon xiralashishi) elementini yaratish
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);

            // Hamburger tugmasi bosilganda
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    sidebar.classList.add('active');
                    overlay.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Orqa fon aylanmasligi uchun
                });
            }

                // Overlay yoki menyu tashqarisi bosilganda yopish
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('show');
                document.body.style.overflow = 'auto'; // Scrollni qaytarish
            });


        });
    </script>
    @include('teacher.partials.sidebar')

    <div class="main-content">
        @include('teacher.partials.topbar')
        @yield('content')
    </div>
</body>

</html>
