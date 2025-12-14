/* ========================================
   LAPORAN DONASI - JAVASCRIPT LOGIC
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
            searchQuery: '', 
            alertStatus: null,
            unreadCount: 0,
            currentUrl: window.location.href,
            
            // Filter Variables
            filterJenis: '', 
            filterBulan: '', 
            filterTahun: '',
            
            // Dummy Data
            donasiList: [
                { id: 1, tanggal: '12/04/2025', donatur: 'Ganjar', jenis: 'Barang', detail: 'Pakaian', jumlah: '1 Karung', status: 'Langsung', petugas: 'Pak Veri' },
                { id: 2, tanggal: '15/04/2025', donatur: 'Hamba Allah', jenis: 'Tunai', detail: 'Uang Tunai', jumlah: '1.000.000', status: 'Tidak Langsung', petugas: 'Pak Veri' },
                { id: 3, tanggal: '20/05/2025', donatur: 'Rumah Sakit Margono', jenis: 'Barang', detail: 'Kursi Roda', jumlah: '5 buah', status: 'Tidak Langsung', petugas: 'Pak Veri' },
                { id: 4, tanggal: '10/05/2025', donatur: 'Tulus', jenis: 'Barang', detail: 'Mimbar Ibadah', jumlah: '1 buah', status: 'Langsung', petugas: 'Pak Veri' },
                { id: 5, tanggal: '12/04/2025', donatur: 'Gibran', jenis: 'Tunai', detail: 'Uang Tunai', jumlah: '15.000.000', status: 'Tidak Langsung', petugas: 'Pak Veri' },
            ]
        }
    },
    
    computed: {
        // Filtered list dengan search + filter bulan/tahun/jenis
        filteredList() {
            return this.donasiList.filter(item => {
                // 1. Global Search (Header)
                const search = this.searchQuery.toLowerCase();
                const matchSearch = (
                    (item.donatur && item.donatur.toLowerCase().includes(search)) ||
                    (item.jenis && item.jenis.toLowerCase().includes(search)) ||
                    (item.detail && item.detail.toLowerCase().includes(search))
                );
                
                // 2. Filter Jenis
                const matchJenis = this.filterJenis ? item.jenis === this.filterJenis : true;
                
                // 3. Filter Tanggal (Bulan & Tahun)
                let matchTanggal = true;
                if (this.filterBulan || this.filterTahun) {
                    if (item.tanggal && item.tanggal.includes('/')) {
                        const parts = item.tanggal.split('/'); // Format DD/MM/YYYY
                        const monthData = parts[1];
                        const yearData = parts[2];
                        
                        if (this.filterBulan && monthData !== this.filterBulan) matchTanggal = false;
                        if (this.filterTahun && yearData !== this.filterTahun) matchTanggal = false;
                    } else {
                        matchTanggal = false;
                    }
                }

                return matchSearch && matchJenis && matchTanggal;
            });
        }
    },
    
    mounted() {
        // Check URL params untuk alert
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('status') === 'sent') {
            this.alertStatus = 'sent';
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // Load data dari localStorage
        const dataBaru = JSON.parse(localStorage.getItem('donasiList'));
        if (dataBaru && Array.isArray(dataBaru)) {
            dataBaru.forEach(item => {
                // Hindari duplikat
                if(!this.donasiList.some(d => d.donatur === item.donatur && d.jumlah === item.jumlah)) {
                    this.donasiList.unshift(item);
                }
            });
        }
    },

    methods: {
        // Reset semua filter
        resetFilter() {
            this.filterJenis = ''; 
            this.filterBulan = ''; 
            this.filterTahun = '';
            this.searchQuery = '';
        },
        
        // Navigate ke halaman generate laporan
        goToGeneratePage(item) {
            localStorage.setItem('selectedDonasiForReport', JSON.stringify(item));
            window.location.href = 'generate-laporan.html';
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
}).mount('#laporanApp');