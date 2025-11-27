document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA DROPDOWN SIDEBAR ADMIN ---
    const sidebarMenuItems = document.querySelectorAll('.admin-sidebar .sidebar-menu li.has-submenu > a');

    sidebarMenuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah link pindah halaman

            const parentLi = this.parentElement; // Ambil elemen <li> induknya

            // Toggle class 'open' pada parent <li>
            parentLi.classList.toggle('open');

            // --- Opsional: Tutup submenu lain saat satu dibuka (Accordion effect) ---
            // Cari semua submenu lain yang terbuka (kecuali yang baru diklik)
            const otherOpenSubmenus = document.querySelectorAll('.admin-sidebar .sidebar-menu li.has-submenu.open');
            otherOpenSubmenus.forEach(otherLi => {
                if (otherLi !== parentLi) { // Jangan tutup diri sendiri
                    otherLi.classList.remove('open');
                }
            });
            // --- Akhir Accordion effect ---
        });
    });

    // --- (Tambahkan script admin lain di sini jika perlu) ---

});