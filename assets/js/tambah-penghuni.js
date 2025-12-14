/* ========================================
   TAMBAH PENGHUNI - JAVASCRIPT LOGIC
   ======================================== */

// Security Check - Redirect ke login jika belum login
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'auth/login.html';
}

// Inisialisasi Vue App
const { createApp } = window.Vue;

createApp({
    data() {
        return {
            step: 1,
            previewImage: null,
            unreadCount: 0,
            form: {
                nama: '', 
                nik: '', 
                ttl: '', 
                usia: '', 
                gender: '', 
                agama: '', 
                status: '', 
                alamat: '', 
                kota: '', 
                pj: '', 
                hubungan: '', 
                telp: '', 
                alamat_pj: '',
                penyakit: '', 
                kebutuhan: '', 
                alergi: '', 
                obat: '', 
                status_sehat: '',
                tgl_masuk: '', 
                rujukan: '', 
                catatan: '', 
                paviliun: '', 
                tahun: '', 
                foto: null
            }
        }
    },
    
    methods: {
        // Next Step
        nextStep() { 
            this.step++; 
        },
        
        // Filter hanya angka untuk NIK dan Telepon
        filterAngka(field) {
            this.form[field] = this.form[field].replace(/[^0-9]/g, '');
        },

        // Handle upload foto
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previewImage = e.target.result;
                    this.form.foto = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        // Validasi dan Submit
        validateAndSubmit() {
            let errorMsg = '';

            // Validasi field wajib
            if (!this.form.nama || !this.form.kota || !this.form.tgl_masuk || !this.form.paviliun) {
                errorMsg = "Data Wajib (Nama, Kota, Tgl Masuk, Paviliun) Belum Lengkap!";
            } 
            // Validasi NIK
            else if (!this.form.nik || this.form.nik.length !== 16) {
                errorMsg = "Format NIK Salah! Harus 16 digit angka.";
            }
            // Validasi Telepon
            else if (!this.form.telp || this.form.telp.length < 10) {
                errorMsg = "Nomor Telepon tidak valid (minimal 10 angka).";
            }

            // Tampilkan error jika ada
            if (errorMsg) {
                Swal.fire({
                    icon: 'error',
                    title: 'Format Tidak Sesuai!',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                });
                return;
            }

            // Extract tahun dari tanggal masuk
            if(this.form.tgl_masuk) {
                this.form.tahun = this.form.tgl_masuk.split('-')[0];
            }

            // Konfirmasi sebelum submit
            Swal.fire({
                title: 'Apakah Yakin <span style="color:#2ecc71">Menambah</span> Data',
                icon: false, 
                showCancelButton: true, 
                confirmButtonText: 'Ya', 
                cancelButtonText: 'Tidak',
                confirmButtonColor: '#1a5c7a', 
                cancelButtonColor: '#1a5c7a', 
                background: '#1a5c7a', 
                color: 'white',
                customClass: { 
                    popup: 'border-radius-10', 
                    title: 'text-white fw-bold fs-5', 
                    confirmButton: 'px-4', 
                    cancelButton: 'px-4' 
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Simpan data ke localStorage
                    let dataLama = JSON.parse(localStorage.getItem('penghuniBaru')) || [];
                    dataLama.push(this.form);
                    localStorage.setItem('penghuniBaru', JSON.stringify(dataLama));

                    // Simpan log aktivitas
                    let logs = JSON.parse(localStorage.getItem('activityLog')) || [];
                    
                    // Format waktu untuk log
                    let jam = new Date().toLocaleString('id-ID', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });

                    logs.push({ 
                        text: `Admin menambahkan data penghuni baru: ${this.form.nama}`, 
                        time: jam 
                    });
                    
                    localStorage.setItem('activityLog', JSON.stringify(logs));
                    
                    // Redirect ke halaman kelola penghuni
                    window.location.href = 'kelola-penghuni.html?status=success';
                }
            });
        },

        // Logout Admin
        logoutAdmin() {
            Swal.fire({
                title: 'Keluar?', 
                text: "Sesi admin akan diakhiri.", 
                icon: 'warning',
                showCancelButton: true, 
                confirmButtonColor: '#d33', 
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Logout',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('adminLoggedIn');
                    window.location.href = 'auth/login.html';
                }
            });
        }
    }
}).mount('#tambahApp');