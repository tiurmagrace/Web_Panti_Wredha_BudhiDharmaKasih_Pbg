/* ========================================
   GENERATE LAPORAN - JAVASCRIPT LOGIC
   ======================================== */

// Security Check - Redirect ke login jika belum login
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'auth/login.html';
}

// Inisialisasi Vue App
const { createApp } = window.Vue;
const { jsPDF } = window.jspdf;

createApp({
    data() {
        return {
            searchQuery: '',
            isiLaporan: '', 
            previewImage: null, 
            fileName: '', 
            item: null,
            emailDonatur: '',
            unreadCount: 0,
            currentUrl: window.location.href
        }
    },
    
    computed: {
        // Placeholder untuk filtered list (tidak digunakan di halaman ini)
        filteredList() {
            return [];
        }
    },
    
    mounted() {
        // Ambil data donasi yang dipilih dari halaman laporan
        const selectedItem = JSON.parse(localStorage.getItem('selectedDonasiForReport'));
        
        if (selectedItem) {
            this.item = selectedItem;
            
            // Auto-fill email jika ada
            if (this.item.email) {
                this.emailDonatur = this.item.email;
            } else {
                this.emailDonatur = '';
            }

            // Generate template laporan otomatis
            this.isiLaporan = 
`Terimakasih kepada ${this.item.donatur}
Bantuanmu telah kami terima dan akan segera kami distribusikan kepada lansia yang membutuhkan.

Detail Donasi:
· Tanggal Donasi: ${this.item.tanggal}
· Jenis Bantuan: ${this.item.jenis}
· Jumlah: ${this.item.jumlah}

Doa dan bantuanmu sangat berarti bagi mereka.
Semoga kebaikanmu dibalas dengan berlipat ganda.`;
        } else {
            // Redirect jika tidak ada data terpilih
            window.location.href = './laporan-donasi.html';
        }
    },
    
    methods: {
        // Handle upload foto bukti
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previewImage = e.target.result;
                    this.fileName = file.name;
                };
                reader.readAsDataURL(file);
            }
        },

        // Generate PDF dan kirim
        async generateAndSendPDF() {
            // Validasi input
            if (!this.emailDonatur || !this.isiLaporan || !this.previewImage) {
                Swal.fire('Data Belum Lengkap', 'Harap pastikan Email terisi dan Bukti Foto diupload!', 'error');
                return;
            }

            // Loading popup
            Swal.fire({
                title: 'Mengirim Laporan...',
                html: 'Sedang membuat PDF dan mengirim ke <b>' + this.emailDonatur + '</b>',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            // Simulate processing delay
            setTimeout(() => {
                const doc = new jsPDF();
                
                // Header PDF
                doc.setFontSize(16); 
                doc.setTextColor(26, 92, 122); 
                doc.text("LAPORAN DISTRIBUSI DONASI", 105, 20, null, null, "center");
                doc.text("PANTI WREDHA BDK", 105, 30, null, null, "center");
                doc.setDrawColor(0); 
                doc.line(20, 35, 190, 35);

                // Isi Laporan
                doc.setFontSize(12); 
                doc.setTextColor(0, 0, 0);
                const splitText = doc.splitTextToSize(this.isiLaporan, 170);
                doc.text(splitText, 20, 50);

                // Foto Bukti
                if (this.previewImage) {
                    try {
                        doc.addImage(this.previewImage, 'JPEG', 55, 130, 100, 80);
                        doc.setFontSize(10);
                        doc.text("Bukti Penerimaan Donasi", 105, 220, null, null, "center");
                    } catch (err) { 
                        console.log("Error menambahkan gambar ke PDF"); 
                    }
                }

                // Download PDF
                doc.save(`Laporan_Donasi_${this.item.donatur}.pdf`); 

                // Simpan log aktivitas
                let logs = JSON.parse(localStorage.getItem('activityLog')) || [];
                
                // Format waktu
                let jam = new Date().toLocaleString('id-ID', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });

                logs.push({ 
                    text: `Admin mengirim laporan donasi kepada: ${this.emailDonatur}`, 
                    time: jam
                });

                localStorage.setItem('activityLog', JSON.stringify(logs));

                // Success popup dan redirect
                Swal.fire({
                    title: 'Terkirim!',
                    text: `Laporan PDF telah dikirim ke ${this.emailDonatur}`,
                    icon: 'success',
                    confirmButtonColor: '#1a5c7a'
                }).then(() => {
                    localStorage.removeItem('selectedDonasiForReport');
                    window.location.href = './laporan-donasi.html?status=sent';
                });

            }, 2000);
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
}).mount('#generateApp');