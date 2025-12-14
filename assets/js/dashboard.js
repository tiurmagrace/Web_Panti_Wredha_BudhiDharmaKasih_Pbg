// --- SECURITY CHECK (SATPAM) ---
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'auth/login.html';
}

const { createApp } = window.Vue;

createApp({
    data() {
        return {
            searchQuery: '',
            notifications: [],
            displayedNotifications: [],
            unreadCount: 0,
            activities: [], 
            feedbacks: [], 
            totalPenghuni: 0, totalUang: 0, totalBarang: 0, 
            totalStok: 0, stokMenipis: 0, jumlahHampirExpired: 0,
            totalSembako: 0, totalPakaian: 0, totalObat: 0,
            currentUrl: window.location.href // Biar aktif menu sidebar
        }
    },
    computed: {
        filteredFeedbacks() {
            if (!this.searchQuery) return this.feedbacks;
            const query = this.searchQuery.toLowerCase();
            
            return this.feedbacks.filter(item => {
                return (item.nama && item.nama.toLowerCase().includes(query)) ||
                       (item.pesan && item.pesan.toLowerCase().includes(query)) ||
                       (item.tanggal && item.tanggal.toLowerCase().includes(query));
            });
        },

        filteredActivities() {
            if (!this.searchQuery) return this.activities;
            const query = this.searchQuery.toLowerCase();

            return this.activities.filter(act => {
                return (act.text && act.text.toLowerCase().includes(query)) ||
                       (act.time && act.time.toLowerCase().includes(query));
            });
        },

        filteredNotifications() {
            const source = this.searchQuery ? this.notifications : this.displayedNotifications;
            const query = this.searchQuery.toLowerCase();

            return source.filter(notif => {
                return notif.text && notif.text.toLowerCase().includes(query);
            });
        }
    },
    mounted() {
        this.loadNotifications();
        this.loadActivities();
        this.loadFeedbacks();
        this.calculateStats();
    },
    methods: {
        formatRupiah(angka) {
            return new Intl.NumberFormat('id-ID').format(angka);
        },

        parseNumber(str) {
            if (!str) return 0;
            return parseInt(str.toString().replace(/\D/g, '')) || 0;
        },

        dateToTimestamp(dateStr) {
            if (!dateStr || dateStr === '-') return 0;
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
            }
            return 0;
        },

        truncateText(text, length) {
            if (!text) return '-';
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        },

        showFullMessage(item) {
            Swal.fire({
                title: `Pesan dari ${item.nama}`,
                html: `
                    <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                        <p><strong>Tanggal:</strong> ${item.tanggal} • ${item.jam || '-'}</p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef; margin: 10px 0;">
                            <i class="fas fa-quote-left text-muted mb-2"></i><br>
                            ${item.pesan}
                        </div>
                        <p class="mb-1"><small><i class="fas fa-envelope me-2"></i> ${item.email || '-'}</small></p>
                        <p class="mb-0"><small><i class="fas fa-phone me-2"></i> ${item.telepon || '-'}</small></p>
                    </div>
                `,
                confirmButtonText: 'Tutup',
                confirmButtonColor: '#1a5c7a',
                width: '500px'
            });
        },

        loadFeedbacks() {
            const data = JSON.parse(localStorage.getItem('feedbackList')) || [];
            this.feedbacks = data.sort((a, b) => b.id - a.id).slice(0, 5);
        },

        loadActivities() {
            const logs = JSON.parse(localStorage.getItem('activityLog')) || [];
            // Slice().reverse() agar tidak mengubah array asli
            this.activities = logs.slice().reverse().slice(0, 5);
        },

        loadNotifications() {
            let allNotifs = [];
            const donasiList = JSON.parse(localStorage.getItem('donasiList')) || [];
            const barangList = JSON.parse(localStorage.getItem('barangList')) || [];

            // 1. Notifikasi Donasi
            donasiList.forEach(d => {
                let time = d.id || this.dateToTimestamp(d.tanggal);
                allNotifs.push({
                    text: `Donasi masuk dari ${d.donatur} (${d.jenis}: ${d.detail || d.jumlah})`,
                    type: 'donasi',
                    timestamp: time
                });
            });

            // 2. Notifikasi Stok
            barangList.forEach(b => {
                let itemTime = this.dateToTimestamp(b.tgl_masuk);
                let stok = parseInt(b.sisa_stok);
                
                // Stok Menipis
                if (!isNaN(stok) && stok < 5) {
                    allNotifs.push({
                        text: `Stok ${b.nama} Menipis! (Sisa: ${b.sisa_stok})`,
                        type: 'stok',
                        timestamp: itemTime
                    });
                }
                
                // Stok Expired
                if (b.expired && b.expired !== '-') {
                    const parts = b.expired.split('/'); 
                    const expDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    const today = new Date();
                    const diffTime = expDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 30 && diffDays >= 0) {
                        allNotifs.push({
                            text: `⚠️ ${b.nama} Segera Expired (${b.expired})`,
                            type: 'stok', 
                            timestamp: itemTime
                        });
                    }
                }
            });

            this.notifications = allNotifs.sort((a, b) => b.timestamp - a.timestamp); 
            this.displayedNotifications = this.notifications.slice(0, 5);

            const lastRead = parseInt(localStorage.getItem('lastReadTimestamp')) || 0;
            this.unreadCount = allNotifs.filter(n => n.timestamp > lastRead).length;
        },

        calculateStats() {
            // 1. Total Penghuni
            const penghuniList = JSON.parse(localStorage.getItem('penghuniBaru'));
            this.totalPenghuni = (penghuniList && Array.isArray(penghuniList)) ? penghuniList.length : 0;

            // 2. Statistik Donasi (Bulan Ini)
            const donasiList = JSON.parse(localStorage.getItem('donasiList')) || [];
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            let hitungUangBulanIni = 0;
            let hitungSembako = 0;
            let hitungPakaian = 0;
            let hitungObat = 0;
            let hitungBarangAllTime = 0; 

            donasiList.forEach(d => {
                if (d.jenis === 'Barang') {
                    let qty = parseInt(d.jumlah) || 1; 
                    hitungBarangAllTime += qty;
                }

                let isThisMonth = false;
                if (d.tanggal && d.tanggal.includes('/')) {
                    const parts = d.tanggal.split('/'); 
                    const dMonth = parseInt(parts[1]);
                    const dYear = parseInt(parts[2]);
                    if (dMonth === currentMonth && dYear === currentYear) {
                        isThisMonth = true;
                    }
                }

                if (isThisMonth) {
                    if (d.jenis === 'Tunai') {
                        hitungUangBulanIni += this.parseNumber(d.jumlah);
                    }
                    if (d.jenis === 'Barang') {
                        let detail = d.detail ? d.detail.toLowerCase() : '';
                        if (detail.includes('sembako') || detail.includes('makanan') || detail.includes('minuman')) {
                            hitungSembako++;
                        } else if (detail.includes('pakaian') || detail.includes('baju') || detail.includes('celana')) {
                            hitungPakaian++;
                        } else if (detail.includes('obat') || detail.includes('kesehatan') || detail.includes('medis')) {
                            hitungObat++;
                        }
                    }
                }
            });

            this.totalUang = hitungUangBulanIni;
            this.totalBarang = hitungBarangAllTime;
            this.totalSembako = hitungSembako;
            this.totalPakaian = hitungPakaian;
            this.totalObat = hitungObat;

            // 3. Statistik Stok
            const barangList = JSON.parse(localStorage.getItem('barangList')) || [];
            this.totalStok = barangList.length;
            this.stokMenipis = barangList.filter(b => {
                let sisa = parseInt(b.sisa_stok);
                return !isNaN(sisa) && sisa < 5;
            }).length;

            let countExp = 0;
            const today = new Date();
            barangList.forEach(item => {
                if (item.expired && item.expired !== '-') {
                    const parts = item.expired.split('/'); 
                    const expDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    const diffTime = expDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays <= 30 && diffDays >= 0) {
                        countExp++;
                    }
                }
            });
            this.jumlahHampirExpired = countExp;
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
}).mount('#adminApp');