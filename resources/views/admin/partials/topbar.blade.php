@if (Auth::user()->role === 'admin')
<div class="top-bar">
    <h1 class="page-title">Admin Dashboard</h1>
    <div class="user-info">
        <img src="{{ Auth::user()->avatar_url }}"
            alt="{{ Auth::user()->name }}"
            class="avatar rounded-circle"
            style="width: 56px; height: 56px; object-fit: cover; box-shadow: 0 4px 12px rgba(99,102,241,0.3);">

        <div>
            <h5 style="margin: 0; font-weight: 800; font-size: 16px;">{{ Auth::user()->name }}</h5>
            <p style="margin: 0; color: #64748b; font-size: 14px;">{{ Auth::user()->email }}</p>
        </div>
    </div>
</div>
<style>
    /* Ensure toastr notifications have readable colors despite global .toast overrides */
    .toast {
        color: inherit !important;
    }

    .toast-success {
        background-color: #28a745 !important;
        color: #fff !important;
        border-color: rgba(0, 0, 0, 0.05) !important;
    }

    .toast-error {
        background-color: #dc3545 !important;
        color: #fff !important;
    }

    .toast-info {
        background-color: #17a2b8 !important;
        color: #fff !important;
    }

    .toast-warning {
        background-color: #f0ad4e !important;
        color: #000 !important;
    }

    .toast .toast-message,
    .toast .toast-body {
        color: inherit !important;
    }
</style>
<!-- Back to Top -->
<!-- <a href="#" class="btn btn-lg btn-primary rounded-0 btn-lg-square back-to-top">
    <i class="fa fa-angle-double-up"></i>
</a> -->
<script>
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    @if(session('success'))
    toastr.success("{{ session('success') }}")
    @endif

    @if(session('error'))
    toastr.error("{{ session('error') }}")
    @endif

    @if(session('warning'))
    toastr.warning("{{ session('warning') }}")
    @endif

    @if(session('info'))
    toastr.info("{{ session('info') }}")
    @endif
</script>

@endif