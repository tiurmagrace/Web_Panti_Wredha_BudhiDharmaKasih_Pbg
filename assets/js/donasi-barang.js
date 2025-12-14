const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoggedIn: false,
            currentUser: null,
            logoutModalInstance: null,
            
            // Data Form Donasi
            form: {
                nama: '', 
                hp: '', 
                email: '', 
                kategori: 'Sembako', // Default
                barang: '', 
                catatan: '', 
                fileBukti: null
            },
            errors: {},

            // Data Pencarian Footer
            searchQuery: ''
        }
    },
    mounted() {
        this.cekStatusLogin();
    },
    methods: {
        // --- 1. CEK STATUS LOGIN ---
        cekStatusLogin() {
            const status = localStorage.getItem('isLoggedIn');
            const userData = localStorage.getItem('user_sementara');

            if (status === 'true' && userData) {
                this.isLoggedIn = true;
                this.currentUser = JSON.parse(userData);
                // Auto-fill nama & email dari data login
                this.form.nama = this.currentUser.username;
                this.form.email = this.currentUser.email;
            } else {
                // Jika belum login, simpan link tujuan lalu tendang ke login page
                localStorage.setItem('redirect_after_login', '../donatur/donasi-barang.html'); 
                alert("Maaf, Anda harus login dulu...");
                window.location.href = "../auth/login.html"; 
            }
        },

        // --- 2. LOGOUT LOGIC ---
        showLogoutModal() {
            const modalEl = document.getElementById('logoutModal');
            this.logoutModalInstance = new bootstrap.Modal(modalEl);
            this.logoutModalInstance.show();
        },
        confirmLogout() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('redirect_after_login');
            
            if(this.logoutModalInstance) this.logoutModalInstance.hide();
            window.location.href = "../index.html"; 
        },

        // --- 3. FORM LOGIC (UPLOAD & SUBMIT) ---
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.form.fileBukti = e.target.result; // Simpan sebagai Base64 string
                };
                reader.readAsDataURL(file);
            } else {
                this.form.fileBukti = null;
            }
        },

        kirimDonasi() {
            this.errors = {};
            
            // Validasi Input
            if (!this.form.hp) this.errors.hp = "Nomor HP Wajib diisi";
            if (!this.form.barang) this.errors.barang = "Nama Barang Wajib diisi";
            if (!this.form.fileBukti) this.errors.fileBukti = "Wajib upload foto barang/resi.";

            // Jika tidak ada error
            if (Object.keys(this.errors).length === 0) {
                
                // Ambil data lama dari LocalStorage
                let dataAdmin = JSON.parse(localStorage.getItem('donasiList')) || [];
                
                // Buat objek donasi baru
                let donasiBaru = {
                    id: Date.now(),
                    tanggal: new Date().toLocaleDateString('en-GB'), // Format DD/MM/YYYY
                    donatur: this.form.nama,
                    jenis: 'Barang',
                    kategori: this.form.kategori,
                    detail: this.form.barang, 
                    jumlah: '-', // Admin nanti yang input jumlah real saat verifikasi
                    status: 'Langsung', 
                    petugas: '-', 
                    catatan: this.form.catatan,
                    hp: this.form.hp,
                    email: this.form.email,
                    foto: this.form.fileBukti,
                    isSynced: false // Penanda agar nanti masuk notifikasi stok admin
                };

                // Simpan ke LocalStorage
                dataAdmin.push(donasiBaru);
                localStorage.setItem('donasiList', JSON.stringify(dataAdmin));

                // Tampilkan Modal Sukses
                const modal = new bootstrap.Modal(document.getElementById('modalSuccess'));
                modal.show();
                
                // Reset Form setelah kirim
                this.form.barang = '';
                this.form.catatan = '';
                this.form.fileBukti = null;
                // Reset input file visual di HTML
                document.querySelector('input[type="file"]').value = '';
            }
        },

        // --- 4. FITUR PENCARIAN FOOTER ---
        performSearch() {
            if (!this.searchQuery) return;

            // Bersihkan highlight lama (kembalikan ke teks biasa)
            document.querySelectorAll('.highlight-text').forEach(el => {
                el.outerHTML = el.innerText;
            });

            const term = this.searchQuery.trim();
            if (term.length < 3) {
                Swal.fire('Info', 'Kata kunci minimal 3 huruf', 'info');
                return;
            }

            // Cari di dalam elemen <main> saja
            const content = document.querySelector('main'); 
            const regex = new RegExp(`(${term})`, 'gi');
            
            let found = false;

            // Fungsi rekursif untuk mencari dan highlight teks
            function highlightText(node) {
                if (node.nodeType === 3) { // Node Teks
                    const match = node.data.match(regex);
                    if (match) {
                        const span = document.createElement('span');
                        span.innerHTML = node.data.replace(regex, '<span class="highlight-text">$1</span>');
                        node.parentNode.replaceChild(span, node);
                        found = true;
                    }
                } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (let i = 0; i < node.childNodes.length; i++) {
                        highlightText(node.childNodes[i]);
                    }
                }
            }

            highlightText(content);

            if (found) {
                // Scroll otomatis ke kata pertama yang ditemukan
                const firstHighlight = document.querySelector('.highlight-text');
                if (firstHighlight) {
                    firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                Swal.fire('Tidak Ditemukan', `Kata "${term}" tidak ada di halaman ini.`, 'warning');
            }
        }
    }
}).mount('#donasiApp');