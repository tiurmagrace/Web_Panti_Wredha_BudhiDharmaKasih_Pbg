/* ========================================
   TAMBAH DONASI - JAVASCRIPT LOGIC
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
            showError: false, 
            previewImage: null,
            unreadCount: 0,
            currentUrl: window.location.href,
            form: { 
                donatur: '', 
                jenis: '', 
                detail: '', 
                jumlah: '', 
                tanggal_raw: '', 
                status: '', 
                petugas: '', 
                tanggal: '',
                foto: null
            }
        }
    },
    
    watch: {
        // Kosongkan detail ketika jenis diganti
        'form.jenis'(newValue) {
            this.form.detail = '';
        }
    },
    
    methods: {
        // Handle upload foto bukti penerimaan
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
        },

        // Validasi dan Submit Form
        validateAndSubmit() {
            // Validasi field wajib
            if (!this.form.donatur || !this.form.jenis || !this.form.jumlah || 
                !this.form.tanggal_raw || !this.form.status) {
                this.showError = true;
                return;
            }
            this.showError = false;

            // Format Tanggal dari YYYY-MM-DD ke DD/MM/YYYY
            let d = new Date(this.form.tanggal_raw);
            let day = String(d.getDate()).padStart(2, '0');
            let month = String(d.getMonth() + 1).padStart(2, '0');
            let year = d.getFullYear();
            this.form.tanggal = `${day}/${month}/${year}`;

            // Konfirmasi sebelum simpan
            Swal.fire({
                title: 'Simpan Data Donasi?', 
                icon: 'question', 
                showCancelButton: true,
                confirmButtonText: 'Ya, Simpan', 
                cancelButtonText: 'Batal',
                confirmButtonColor: '#1a5c7a', 
                cancelButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    try {
                        // 1. Simpan data donasi ke localStorage
                        let dataLama = JSON.parse(localStorage.getItem('donasiList')) || [];
                        dataLama.push(this.form);
                        localStorage.setItem('donasiList', JSON.stringify(dataLama));

                        // 2. Simpan log aktivitas
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
                            text: `Admin menambahkan donasi manual dari: ${this.form.donatur}`, 
                            time: jam 
                        });

                        localStorage.setItem('activityLog', JSON.stringify(logs));

                        // 3. Tampilkan popup sukses dan redirect
                        Swal.fire({
                            title: 'Berhasil!', 
                            text: 'Data donasi berhasil disimpan.', 
                            icon: 'success', 
                            timer: 1500, 
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = 'kelola-donasi.html?status=success';
                        });
                    } catch (e) {
                        Swal.fire('Error', 'Data/Foto terlalu besar.', 'error');
                    }
                }
            });
        }
    }
}).mount('#tambahDonasiApp');