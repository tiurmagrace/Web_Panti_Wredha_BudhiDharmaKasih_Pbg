/* ========================================
   KELOLA DONASI - JAVASCRIPT LOGIC
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
            alertStatus: null,
            currentPage: 1,
            itemsPerPage: 20,
            showFilter: false,
            unreadCount: 0,
            currentUrl: window.location.href,
            
            // Filter States
            filterJenis: '',
            filterStatus: '',
            filterPetugas: '',
            filterTanggalMulai: '',
            filterTanggalSelesai: '',
            
            // Dummy Data
            donasiList: [
                { id: 1, tanggal: '12/04/2025', tanggal_raw: '2025-04-12', donatur: 'Ganjar', jenis: 'Barang', detail: 'Pakaian', jumlah: '1 Karung', status: 'Langsung', petugas: 'Pak Veri' },
                { id: 2, tanggal: '12/04/2025', tanggal_raw: '2025-04-12', donatur: 'Prabowo', jenis: 'Barang', detail: 'Sembako', jumlah: '1 Paket', status: 'Langsung', petugas: 'Pak Veri' },
                { id: 3, tanggal: '15/04/2025', tanggal_raw: '2025-04-15', donatur: 'Anies', jenis: 'Uang', detail: 'Tunai', jumlah: 'Rp 5.000.000', status: 'Tertunda', petugas: 'Bu Siti' },
                { id: 4, tanggal: '18/04/2025', tanggal_raw: '2025-04-18', donatur: 'Ridwan Kamil', jenis: 'Barang', detail: 'Obat-obatan', jumlah: '2 Kotak', status: 'Langsung', petugas: 'Pak Budi' },
                { id: 5, tanggal: '20/04/2025', tanggal_raw: '2025-04-20', donatur: 'Ahok', jenis: 'Uang', detail: 'Transfer Bank', jumlah: 'Rp 3.000.000', status: 'Langsung', petugas: 'Bu Siti' },
            ]
        }
    },
    
    computed: {
        // Unique values untuk dropdown filter
        uniqueJenis() {
            return [...new Set(this.donasiList.map(item => item.jenis))];
        },
        
        uniqueStatus() {
            return [...new Set(this.donasiList.map(item => item.status))];
        },
        
        uniquePetugas() {
            return [...new Set(this.donasiList.map(item => item.petugas))];
        },
        
        // Hitung berapa filter yang aktif
        activeFiltersCount() {
            let count = 0;
            if (this.filterJenis) count++;
            if (this.filterStatus) count++;
            if (this.filterPetugas) count++;
            if (this.filterTanggalMulai || this.filterTanggalSelesai) count++;
            return count;
        },
        
        // Filtered List dengan semua filter
        filteredList() {
            return this.donasiList.filter(item => {
                // Search query (donatur, detail, jumlah, petugas)
                const search = this.searchQuery.toLowerCase();
                const matchSearch = 
                    (item.donatur && item.donatur.toLowerCase().includes(search)) ||
                    (item.detail && item.detail.toLowerCase().includes(search)) ||
                    (item.jumlah && item.jumlah.toLowerCase().includes(search)) ||
                    (item.petugas && item.petugas.toLowerCase().includes(search));
                
                // Filter Jenis
                const matchJenis = !this.filterJenis || item.jenis === this.filterJenis;
                
                // Filter Status
                const matchStatus = !this.filterStatus || item.status === this.filterStatus;
                
                // Filter Petugas
                const matchPetugas = !this.filterPetugas || item.petugas === this.filterPetugas;
                
                // Filter Tanggal Range
                let matchTanggal = true;
                if (this.filterTanggalMulai || this.filterTanggalSelesai) {
                    const itemDate = new Date(item.tanggal_raw);
                    
                    if (this.filterTanggalMulai) {
                        const startDate = new Date(this.filterTanggalMulai);
                        if (itemDate < startDate) matchTanggal = false;
                    }
                    
                    if (this.filterTanggalSelesai) {
                        const endDate = new Date(this.filterTanggalSelesai);
                        if (itemDate > endDate) matchTanggal = false;
                    }
                }
                
                return matchSearch && matchJenis && matchStatus && matchPetugas && matchTanggal;
            });
        },
        
        // Pagination
        totalPages() {
            return Math.ceil(this.filteredList.length / this.itemsPerPage);
        },
        
        paginatedList() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredList.slice(start, end);
        }
    },
    
    watch: {
        // Reset ke halaman 1 kalau filter berubah
        filteredList() {
            this.currentPage = 1;
        }
    },
    
    mounted() {
        // Cek URL params untuk alert
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('status') === 'success') this.alertStatus = 'success';
        if(urlParams.get('status') === 'edited') this.alertStatus = 'edited';
        if(this.alertStatus) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Load Data dari localStorage
        const dataBaru = JSON.parse(localStorage.getItem('donasiList'));
        if (dataBaru && Array.isArray(dataBaru)) {
            this.donasiList = dataBaru;
        } else {
            localStorage.setItem('donasiList', JSON.stringify(this.donasiList));
        }
    },
    
    methods: {
        // Format text helper
        formatTitleCase(str) {
            if (!str) return '-';
            return String(str).toLowerCase().replace(/(?:^|\s)\w/g, m => m.toUpperCase());
        },
        
        // Reset semua filter
        resetFilter() {
            this.filterJenis = '';
            this.filterStatus = '';
            this.filterPetugas = '';
            this.filterTanggalMulai = '';
            this.filterTanggalSelesai = '';
            this.searchQuery = '';
        },
        
        // Navigate ke halaman edit
        goToEditPage(item) {
            const realIndex = this.donasiList.findIndex(x => x === item);
            const editData = { index: realIndex, data: item };
            localStorage.setItem('editDonasiData', JSON.stringify(editData));
            window.location.href = 'edit-donasi.html';
        },
        
        // Pagination controls
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        
        // Logout
        logoutAdmin() {
            logoutAdmin();
        }
    }
}).mount('#donasiApp');