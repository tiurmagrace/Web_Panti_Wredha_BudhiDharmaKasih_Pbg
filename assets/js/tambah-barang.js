// --- SECURITY CHECK (SATPAM) ---
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'auth/login.html';
}

const { createApp } = window.Vue;

createApp({
    data() {
        return {
            searchQuery: '',
            showError: false, previewImage: null,
            hasExpired: false,
            form: {
                kode: '', 
                nama: '', kategori: '', satuan: '', 
                stok: '', tgl_masuk_raw: '', kondisi: 'Baik',
                expired_raw: '',
                tgl_keluar: '-', brg_masuk: '', brg_keluar: '-', sisa_stok: ''
            }
        }
    },
    watch: {
        // Auto Generate saat Kategori Berubah
        'form.kategori': function(newVal) {
            this.generateKode();
        }
    },
    methods: {
        generateKode() {
            const kat = this.form.kategori;
            if (!kat) return;

            // Prefix sesuai kategori
            let prefix = 'BRG';
            if (kat === 'Sembako') prefix = 'SMB';
            else if (kat === 'Obat-obatan') prefix = 'OBT';
            else if (kat === 'Perlengkapan') prefix = 'PRL';
            else if (kat === 'Alat Kesehatan') prefix = 'ALT';

            // Random Number 3 Digit
            const randomNum = Math.floor(100 + Math.random() * 900); 
            this.form.kode = `${prefix}-${randomNum}`;
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) { this.previewImage = URL.createObjectURL(file); this.showError = false; }
        },

        validateAndSubmit() {
            // Validasi dasar
            if (!this.form.nama || !this.form.kategori || !this.form.stok || !this.form.tgl_masuk_raw) {
                this.showError = true; return;
            }
            
            // Validasi Tambahan: Kalau dicentang tapi tanggal kosong, marahin adminnya
            if (this.hasExpired && !this.form.expired_raw) {
                Swal.fire('Ups!', 'Kamu mencentang opsi Expired, tolong isi tanggal kadaluwarsanya!', 'warning');
                return;
            }

            this.showError = false;

            // Format Tanggal Masuk
            let d = new Date(this.form.tgl_masuk_raw);
            let tglFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

            // --- LOGIKA EXPIRED DATE ---
            let expiredFix = '-'; // Default strip buat Pakaian dkk
            if (this.hasExpired && this.form.expired_raw) {
                let e = new Date(this.form.expired_raw);
                expiredFix = `${String(e.getDate()).padStart(2, '0')}/${String(e.getMonth() + 1).padStart(2, '0')}/${e.getFullYear()}`;
            }
            // ---------------------------

            const newData = {
                kode: this.form.kode,
                nama: this.form.nama,
                kategori: this.form.kategori,
                satuan: this.form.satuan,
                kondisi: this.form.kondisi,
                expired: expiredFix, // <--- MASUKKAN KE DATA YANG DISIMPAN
                tgl_masuk: tglFormatted,
                tgl_keluar: '-', 
                brg_masuk: this.form.stok + ' ' + this.form.satuan, 
                brg_keluar: '-',
                sisa_stok: this.form.stok + ' ' + this.form.satuan,
                stok: this.form.stok
            };

            Swal.fire({
                title: 'Simpan Data Barang?', icon: 'question', showCancelButton: true,
                confirmButtonText: 'Ya, Simpan', cancelButtonText: 'Batal',
                confirmButtonColor: '#1a5c7a', cancelButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    // 1. SIMPAN DATA BARANG
                    let dataLama = JSON.parse(localStorage.getItem('barangList')) || [];
                    dataLama.push(newData);
                    localStorage.setItem('barangList', JSON.stringify(dataLama));

                    // 2. --- CATAT AKTIVITAS ---
                    let logs = JSON.parse(localStorage.getItem('activityLog')) || [];
                    
                    // FORMAT WAKTU AGAR RAPI DI DASHBOARD
                    let jam = new Date(); 

                    logs.push({ 
                        text: `Admin menambahkan stok barang baru: ${this.form.nama} (${this.form.stok} ${this.form.satuan})`, 
                        time: jam 
                    });

                    localStorage.setItem('activityLog', JSON.stringify(logs));
                    // ------------------------------------------------

                    // 3. PINDAH HALAMAN
                    window.location.href = 'data-barang.html?status=success';
                }
            });
        },

        logoutAdmin() {
            Swal.fire({
                title: 'Keluar?', text: "Sesi admin akan diakhiri.", icon: 'warning',
                showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Logout'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('adminLoggedIn');
                    window.location.href = 'auth/login.html'; 
                }
            });
        }
    }
}).mount('#tambahBarangApp');