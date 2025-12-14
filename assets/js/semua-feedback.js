// --- SECURITY CHECK (SATPAM) ---
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'auth/login.html';
}

const { createApp } = window.Vue;

createApp({
    data() {
        return {
            searchQuery: '', 
            feedbacks: [],
            
            // Variable Filter Baru
            filterBulan: '',
            filterTahun: '',
            currentUrl: window.location.href, 
            unreadCount: 0
        }
    },
    computed: {
        filteredList() {
            return this.feedbacks.filter(item => {
                // 1. Filter Search (Header)
                const search = this.searchQuery.toLowerCase();
                const matchSearch = (item.nama && item.nama.toLowerCase().includes(search)) ||
                                    (item.pesan && item.pesan.toLowerCase().includes(search));

                // 2. Filter Dropdown (Bulan & Tahun)
                let matchDate = true;
                
                if (this.filterBulan || this.filterTahun) {
                    if (item.tanggal && item.tanggal.includes('/')) {
                        const parts = item.tanggal.split('/'); // Asumsi format DD/MM/YYYY
                        const monthData = parts[1]; // Ambil MM
                        const yearData = parts[2];  // Ambil YYYY
                        
                        if (this.filterBulan && monthData !== this.filterBulan) matchDate = false;
                        if (this.filterTahun && yearData !== this.filterTahun) matchDate = false;
                    } else {
                        matchDate = false;
                    }
                }

                return matchSearch && matchDate;
            });
        }
    },
    mounted() {
        // LOAD DATA
        const data = JSON.parse(localStorage.getItem('feedbackList')) || [];
        // Sort Descending (Terbaru diatas)
        this.feedbacks = data.sort((a, b) => b.id - a.id);
    },
    methods: {
        resetFilter() {
            this.filterBulan = '';
            this.filterTahun = '';
            this.searchQuery = '';
        },
        logoutAdmin() {
            Swal.fire({
                title: 'Keluar?', text: "Sesi admin akan diakhiri.", icon: 'warning',
                showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Logout'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('adminLoggedIn'); 
                    // UPDATE PATH LOGOUT: Masuk ke folder auth
                    window.location.href = 'auth/login.html'; 
                }
            });
        }
    }
}).mount('#feedbackApp');