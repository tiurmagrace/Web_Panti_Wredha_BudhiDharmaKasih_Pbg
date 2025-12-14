/* ===================================
   SEMUA AKTIVITAS - VUE.JS SCRIPT
   Path: assets/js/semua-aktivitas.js
   =================================== */

// --- SECURITY CHECK (SATPAM) ---
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'auth/login.html';
}

const { createApp } = window.Vue;

createApp({
    data() {
        return {
            searchQuery: '',
            filterKategori: '', 
            activities: [],
            currentUrl: window.location.href, 
            unreadCount: 0 
        }
    },
    
    computed: {
        filteredList() {
            let result = this.activities.filter(item => {
                return item.text.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
            
            if (this.filterKategori) {
                result = result.filter(item => {
                    return item.text.toLowerCase().includes(this.filterKategori.toLowerCase());
                });
            }
            
            return result;
        }
    },
    
    mounted() {
        const logs = JSON.parse(localStorage.getItem('activityLog')) || [];
        // DATA URUT DARI TERBARU (REVERSE)
        this.activities = logs.reverse(); 
    },
    
    methods: {
        /**
         * FORMAT TANGGAL BIAR RAPI
         */
        formatTanggal(waktu) {
            // Cek kalau format lama (misal "14.21")
            if (!waktu || typeof waktu === 'string' && waktu.length < 10) {
                return waktu;
            }

            // Kalau format Date String (ISO)
            try {
                const date = new Date(waktu);
                if (isNaN(date.getTime())) {
                    return waktu; 
                }

                return date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                return waktu;
            }
        },

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
                    // UPDATE PATH LOGOUT: Masuk ke folder auth
                    window.location.href = 'auth/login.html'; 
                }
            });
        }
    }
}).mount('#activityApp');