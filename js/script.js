document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // KODE SLIDER KAMU (TETAP AMAN)
    // ===================================
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    let autoSlide;

    if (slides.length > 0 && prevBtn && nextBtn) {
        function showSlide(index) {
            document.querySelector('.slides').style.transform = `translateX(-${index * 100}%)`;
        }
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        }
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
        function startAutoSlide() {
            autoSlide = setInterval(nextSlide, 4000); 
        }
        function resetAutoSlide() {
            clearInterval(autoSlide);
            startAutoSlide();
        }
        showSlide(currentIndex);
        startAutoSlide();
    }
    // === AKHIR DARI KODE SLIDER KAMU ===


    // ===================================
    // KODE PAGINATION GALERI (TETAP AMAN)
    // ===================================
    const pageLinks = document.querySelectorAll('.pagination .page-num');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const nextButton = document.getElementById('next-page');
    let currentPage = 1;

    function showPage(page) {
        if (galleryItems.length === 0) return;
        galleryItems.forEach(item => {
            item.classList.remove('active-page');
        });
        const itemsToShow = document.querySelectorAll(`.gallery-item[data-page="${page}"]`);
        itemsToShow.forEach(item => {
            item.classList.add('active-page');
        });
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') == page) {
                link.classList.add('active');
            }
        });
        currentPage = parseInt(page);
    }
    
    // Cek dulu pageLinks ada atau tidak
    if (pageLinks.length > 0) {
        showPage(1); // Tampilkan halaman 1

        pageLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                showPage(page);
            });
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function (e) {
            e.preventDefault();
            let nextPage = currentPage + 1;
            const nextLink = document.querySelector(`.pagination .page-num[data-page="${nextPage}"]`);
            if (!nextLink) {
                nextPage = 1; // Kembali ke halaman 1
            }
            showPage(nextPage);
        });
    }
    // === AKHIR KODE PAGINATION ===


    // ===================================
    // [BARU] KODE VALIDASI FORM DONASI BARANG
    // ===================================
    
    // Ambil elemen form
    const form = document.getElementById('formDonasiBarang');
      
    // Cek dulu apakah form-nya ada di halaman ini
    if (form) { 
        const hpInput = document.getElementById('hp');
        const gmailInput = document.getElementById('email');

        // Ambil modal Bootstrap (kita butuh 'instance'-nya)
        // Pastikan modal #modalSuccess ada di file HTML-nya
        const successModal = new bootstrap.Modal(document.getElementById('modalSuccess'));
        
        // Pattern (RegExp) untuk validasi
        const hpPattern = /^\+62[0-9\-]{9,15}$/;
        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        // Saat form di-submit...
        form.addEventListener('submit', function(event) {
          
          // 1. Matikan aksi default browser (biar gak refresh)
          event.preventDefault();
          
          let isHpValid = false;
          let isGmailValid = false;

          // --- 2. Validasi Nomor HP ---
          if (hpPattern.test(hpInput.value)) {
            hpInput.classList.remove('is-invalid'); // Hapus class error
            isHpValid = true;
          } else {
            hpInput.classList.add('is-invalid'); // Tambah class error
          }

          // --- 3. Validasi Gmail (Opsional) ---
          // Cek only jika tidak kosong (karena opsional)
          if (gmailInput.value === "" || gmailPattern.test(gmailInput.value)) {
            gmailInput.classList.remove('is-invalid');
            isGmailValid = true;
          } else {
            gmailInput.classList.add('is-invalid');
          }

          // --- 4. Cek Final (Field Wajib Lainnya) ---
          const barangInput = document.getElementById('barang');
          const jumlahInput = document.getElementById('jumlah');
          let isBarangValid = true;
          let isJumlahValid = true;

          if (barangInput.value === "") {
              barangInput.classList.add('is-invalid');
              isBarangValid = false;
          } else {
              barangInput.classList.remove('is-invalid');
          }

          if (jumlahInput.value === "") {
              jumlahInput.classList.add('is-invalid');
              isJumlahValid = false;
          } else {
              jumlahInput.classList.remove('is-invalid');
          }

          if (isHpValid && isGmailValid && isBarangValid && isJumlahValid) {
            
            successModal.show();
            //new bootstrap.Modal(document.getElementById('modalFailed')).show();
            
            form.reset();
            hpInput.classList.remove('is-invalid');
            gmailInput.classList.remove('is-invalid');
            barangInput.classList.remove('is-invalid');
            jumlahInput.classList.remove('is-invalid');

          } else {
          }

        });
    }
    // ===================================
    // [BARU] KODE VALIDASI FORM DONASI TUNAI
    // ===================================
    
    // Ambil elemen form tunai
    const formTunai = document.getElementById('formDonasiTunai');
      
    // Cek dulu apakah form-nya ada di halaman ini
    if (formTunai) { 
        const hpInput = document.getElementById('hp');
        const gmailInput = document.getElementById('email');
        const buktiInput = document.getElementById('buktiTransfer'); // Ini input file

        const successModal = new bootstrap.Modal(document.getElementById('modalSuccess'));
        
        const hpPattern = /^\+62[0-9\-]{9,15}$/;
        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        formTunai.addEventListener('submit', function(event) {
          
          event.preventDefault();
          
          let isHpValid = false;
          let isGmailValid = false;
          let isBuktiValid = false;

          // 1. Validasi HP
          if (hpPattern.test(hpInput.value)) {
            hpInput.classList.remove('is-invalid');
            isHpValid = true;
          } else {
            hpInput.classList.add('is-invalid');
          }

          // 2. Validasi Gmail
          if (gmailInput.value === "" || gmailPattern.test(gmailInput.value)) {
            gmailInput.classList.remove('is-invalid');
            isGmailValid = true;
          } else {
            gmailInput.classList.add('is-invalid');
          }

          // 3. Validasi Bukti Transfer (Wajib Upload)
          if (buktiInput.files.length === 0) {
              // Kalau kosong, error
              buktiInput.classList.add('is-invalid');
              isBuktiValid = false;
          } else {
              buktiInput.classList.remove('is-invalid');
              isBuktiValid = true;
          }

          // Jika semua valid
          if (isHpValid && isGmailValid && isBuktiValid) {
            successModal.show();
            formTunai.reset();
            hpInput.classList.remove('is-invalid');
            gmailInput.classList.remove('is-invalid');
            buktiInput.classList.remove('is-invalid');
          }

        });
    }

}); 