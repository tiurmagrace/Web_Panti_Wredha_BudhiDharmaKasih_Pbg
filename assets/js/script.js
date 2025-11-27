document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // KODE PAGINATION GALERI
    // (Hanya ini yang dibutuhkan karena Slider pakai Bootstrap & Form pakai Vue)
    // ===================================
    
    const pageLinks = document.querySelectorAll('.pagination .page-num');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const nextButton = document.getElementById('next-page');
    
    let currentPage = 1;

    function showPage(page) {
        // Jika tidak ada item galeri, berhenti (biar gak error di halaman lain)
        if (galleryItems.length === 0) return;

        // Sembunyikan semua item dulu
        galleryItems.forEach(item => {
            item.classList.remove('active-page');
            item.style.display = 'none'; // Pastikan benar-benar hilang
        });

        // Tampilkan item yang sesuai halaman
        const itemsToShow = document.querySelectorAll(`.gallery-item[data-page="${page}"]`);
        itemsToShow.forEach(item => {
            item.classList.add('active-page');
            item.style.display = 'block'; // Munculkan kembali
        });

        // Update status aktif di tombol angka (1, 2, 3)
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') == page) {
                link.classList.add('active');
            }
        });

        currentPage = parseInt(page);
    }
    
    // Inisialisasi: Cek dulu apakah ada elemen pagination di halaman ini
    if (pageLinks.length > 0) {
        showPage(1); // Tampilkan halaman 1 saat loading pertama

        // Event listener untuk klik angka (1, 2, 3)
        pageLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                showPage(page);
            });
        });
    }

    // Event listener untuk tombol NEXT
    if (nextButton) {
        nextButton.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Hitung halaman selanjutnya
            let nextPage = currentPage + 1;
            
            // Cek apakah halaman selanjutnya ada?
            const nextLink = document.querySelector(`.pagination .page-num[data-page="${nextPage}"]`);
            
            if (!nextLink) {
                nextPage = 1; // Kalau sudah mentok, balik ke halaman 1
            }
            
            showPage(nextPage);
        });
    }

});