/* ========================================
   EDIT DONASI - JAVASCRIPT LOGIC
   ======================================== */

// Security Check - Redirect ke login jika belum login
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'auth/login.html';
}

// Logout Function (Global)
function logoutAdmin() {
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

// Inisialisasi Vue App
const { createApp } = window.Vue;

createApp({
    data() {
        return {
            searchQuery: '',
            form: {},
            editIndex: -1,
            previewImage: null,
            unreadCount: 0,
            currentUrl: window.location.href
        }
    },
    
    watch: { 
        // Kosongkan detail ketika jenis diganti
        'form.jenis'(newValue) {
            this.form.detail = '';
        }
    },
    
    mounted() {
        // Ambil data yang mau diedit dari localStorage
        const editData = JSON.parse(localStorage.getItem('editDonasiData'));
        
        if (editData) {
            this.form = editData.data;
            this.editIndex = editData.index;
            
            // Kalau ada foto di data, tampilkan
            if (this.form.foto) {
                this.previewImage = this.form.foto;
            } else {
                // Kalau ga ada foto, set null (akan tampil placeholder)
                this.previewImage = null;
            }
        } else {
            // Kalau tidak ada data edit, redirect ke halaman kelola
            window.location.href = 'kelola-donasi.html';
        }
    },
    
    methods: {
        // Handle upload foto baru
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
        
        // Validasi dan simpan perubahan
        validateAndSave() {
            Swal.fire({
                title: 'Simpan Perubahan?', 
                icon: 'question', 
                showCancelButton: true,
                confirmButtonText: 'Ya', 
                cancelButtonText: 'Batal',
                confirmButtonColor: '#1a5c7a', 
                cancelButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    try {
                        // 1. Update data utama
                        let mainData = JSON.parse(localStorage.getItem('donasiList'));
                        
                        // Format tanggal display (DD/MM/YYYY)
                        if(this.form.tanggal_raw) {
                            let d = new Date(this.form.tanggal_raw);
                            let day = String(d.getDate()).padStart(2, '0');
                            let month = String(d.getMonth() + 1).padStart(2, '0');
                            let year = d.getFullYear();
                            this.form.tanggal = `${day}/${month}/${year}`;
                        }

                        // Update data di localStorage
                        if(mainData && this.editIndex !== -1) {
                            mainData[this.editIndex] = this.form;
                            localStorage.setItem('donasiList', JSON.stringify(mainData));
                        }

                        // 2. Catat log aktivitas
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
                            text: `Admin mengubah data donasi dari: ${this.form.donatur}`, 
                            time: jam 
                        });

                        localStorage.setItem('activityLog', JSON.stringify(logs));

                        // 3. Hapus temp data dan redirect
                        localStorage.removeItem('editDonasiData');
                        window.location.href = 'kelola-donasi.html?status=edited';
                        
                    } catch (e) {
                        Swal.fire('Error', 'Gagal menyimpan (mungkin file foto terlalu besar)', 'error');
                    }
                }
            });
        },
        
        // Logout
        logoutAdmin() {
            logoutAdmin();
        }
    }
}).mount('#editDonasiApp');