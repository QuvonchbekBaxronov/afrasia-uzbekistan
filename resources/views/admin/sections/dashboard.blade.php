@extends('admin.layout')

@section('title', 'Dashboard')
@section('page-title', 'Admin Dashboard')

@section('content')
<div class="stats-grid">
    <!-- Jami foydalanuvchilar -->
    <div class="stat-card">
        <div class="stat-icon blue">
            <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
            <h3>{{ number_format($user_count) }}</h3>
            <p>Jami Foydalanuvchilar</p>
            <div class="stat-trend up">
                <i class="fas fa-arrow-up"></i> Bu oy +12.5%
            </div>
        </div>
    </div>

    <!-- Faol foydalanuvchilar / o'qituvchilar -->
    <div class="stat-card">
        <div class="stat-icon purple">
            <i class="fas fa-chalkboard-teacher"></i>
        </div>
        <div class="stat-info">
            <h3>{{ $active_users }}</h3>
            <p>Faol Foydalanuvchilar</p>
            <div class="stat-trend up">
                <i class="fas fa-arrow-up"></i> +5 yangi
            </div>
        </div>
    </div>

    <!-- Faol guruhlar -->
    <div class="stat-card">
        <div class="stat-icon green">
            <i class="fas fa-layer-group"></i>
        </div>
        <div class="stat-info">
            <h3>{{ $active_group }}</h3>
            <p>Faol Guruhlar</p>
            <div class="stat-trend up">
                <i class="fas fa-arrow-up"></i> +8.3%
            </div>
        </div>
    </div>
</div>

<div class="row" style="margin: 0 -15px;">
    <!-- Oylik statistika -->
    <div class="col-lg-8" style="padding: 0 15px;">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h4>Oylik Statistika</h4>
                <select class="form-select" style="width: 150px;">
                    <option>{{ now()->year }}</option>
                    <option>{{ now()->year - 1 }}</option>
                </select>
            </div>
            <div class="card-body">
                <canvas id="monthlyChart"></canvas>
            </div>
        </div>
    </div>

    <!-- Yangi foydalanuvchilar -->
    <div class="col-lg-4" style="padding: 0 15px;">
        <div class="card">
            <div class="card-header">
                <h4>Yangi Ro'yxatlar</h4>
            </div>
            <div class="card-body">
                @foreach($new_users as $user)
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 12px;">
                    <img src="{{ $user->avatar_url }}" style="width: 50px; height: 50px; border-radius: 50%;">
                    <div>
                        <h6 style="margin: 0; font-weight: 700;">{{ $user->name }}</h6>
                        <small style="color: #64748b;">{{ $user->created_at->diffForHumans() }}</small>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>
</div>

<!-- Chart.js script -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    const monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
            datasets: [{
                label: 'Daromad ($)',
                data: [
                    @for($i=1; $i<=12; $i++)
                        {{ $monthlyPayments[$i] ?? 0 }},
                    @endfor
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
</script>
@endsection
