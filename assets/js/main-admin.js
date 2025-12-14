// admin/assets/js/main.js

// Fungsi Logout Global
function globalLogout() {
    Swal.fire({
        title: 'Keluar?', text: "Sesi admin akan diakhiri.", icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Logout'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('adminLoggedIn');
            // Pastikan path ini benar sesuai struktur folder kamu
            // Kalau main.js dipanggil dari index.html, pathnya 'auth/login.html'
            window.location.href = 'auth/login.html'; 
        }
    });
}