// --- SECURITY CHECK (SATPAM) ---
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'auth/login.html';
}

const { createApp } = window.Vue;

createApp({
    data() {
        return {
            searchQuery: '',
            filterType: '', 
            notifications: [],
            currentUrl: window.location.href,
            unreadCount: 0 
        }
    },
    computed: {
        // --- INI LOGIC CARI SEMUA KATA ---
        filteredList() {
            return this.notifications.filter(item => {
                const query = this.searchQuery.toLowerCase();

                // 1. Logic Search (Cek SEMUA properti: Judul, Isi, Tipe, Tanggal)
                // Kita gabungin semua jadi satu string panjang biar gampang ngeceknya
                const allText = (
                    (item.title || '') + ' ' + 
                    (item.text || '') + ' ' + 
                    (item.type || '') + ' ' + 
                    (item.dateDisplay || '')
                ).toLowerCase();

                const matchSearch = allText.includes(query);

                // 2. Logic Filter Dropdown
                const matchFilter = this.filterType ? item.type === this.filterType : true;

                return matchSearch && matchFilter;
            });
        }
    },
    mounted() {
        localStorage.setItem('lastReadTimestamp', Date.now());
        this.loadAllNotifications();
    },
    methods: {
        formatDate(timestamp) {
            if (!timestamp) return '-';
            const date = new Date(timestamp);
            return date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
        },

        dateToTimestamp(dateStr) {
            if (!dateStr || dateStr === '-') return 0;
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
            }
            return 0;
        },

        loadAllNotifications() {
            let allNotifs = [];

            // --- 1. DATA DONASI ---
            const donasiList = JSON.parse(localStorage.getItem('donasiList')) || [];
            donasiList.forEach(d => {
                let time = d.id || this.dateToTimestamp(d.tanggal);
                allNotifs.push({
                    title: 'Donasi Masuk',
                    text: `Diterima dari ${d.donatur} berupa ${d.jenis} (${d.detail || d.jumlah}).`,
                    type: 'donasi',
                    timestamp: time,
                    dateDisplay: this.formatDate(time) 
                });
            });

            // --- 2. DATA STOK (Menipis) ---
            const barangList = JSON.parse(localStorage.getItem('barangList')) || [];
            barangList.forEach(b => {
                let stok = parseInt(b.sisa_stok);
                if (!isNaN(stok) && stok < 5) {
                    let time = this.dateToTimestamp(b.tgl_masuk);
                    allNotifs.push({
                        title: 'Stok Menipis',
                        text: `Stok barang "${b.nama}" tersisa ${b.sisa_stok}. Segera restock!`,
                        type: 'stok',
                        timestamp: time,
                        dateDisplay: b.tgl_masuk 
                    });
                }
            });

            this.notifications = allNotifs.sort((a, b) => b.timestamp - a.timestamp);
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
}).mount('#notifApp');