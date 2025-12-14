// --- SECURITY CHECK (SATPAM) ---
if (!localStorage.getItem('adminLoggedIn')) {
    // Karena JS dipanggil oleh HTML di folder admin, path ini valid
    window.location.href = 'auth/login.html';
}

const { createApp } = window.Vue;

createApp({
    data() {
        return {
            // FILTER & SEARCH VARIABLES
            searchQuery: '', 
            startDate: '',
            endDate: '',
            filterType: 'tgl_masuk',

            // PAGINATION & MODAL VARIABLES
            currentPage: 1, 
            itemsPerPage: 10, 
            isModalOpen: false, 
            modalMode: 'detail', 
            tempFormData: {}, 
            editingIndex: -1,
            
            // DATA UTAMA
            barangList: [
                { nama: 'Pampers uk. M', kategori: 'Kesehatan', tgl_masuk: '15/05/2025', tgl_keluar: '30/09/2025', brg_masuk: '5 pack', brg_keluar: '2 Pack', sisa_stok: '3 pack', expired: '-' },
                { nama: 'Kecap ABC', kategori: 'Sembako', tgl_masuk: '16/04/2025', tgl_keluar: '30/09/2025', brg_masuk: '10 botol', brg_keluar: '5 botol', sisa_stok: '5 botol', expired: '20/12/2025' }
            ]
        }
    },
    computed: {
        // LOGIC SEARCH & FILTER PINTAR (GABUNGAN)
        filteredList() {
            return this.barangList.filter(item => {
                // 1. LOGIC SEARCH (Nama, Kategori, Barang Masuk, Sisa Stok)
                const query = this.searchQuery.toLowerCase();
                const matchSearch = 
                    (item.nama && item.nama.toLowerCase().includes(query)) ||
                    (item.kategori && item.kategori.toLowerCase().includes(query)) ||
                    (item.brg_masuk && item.brg_masuk.toLowerCase().includes(query)) ||
                    (item.sisa_stok && item.sisa_stok.toLowerCase().includes(query));

                // 2. LOGIC FILTER TANGGAL
                let matchDate = true;
                if (this.startDate && this.endDate) {
                    const targetDateStr = this.filterType === 'tgl_masuk' ? item.tgl_masuk : item.expired;
                    
                    // Helper convert 'DD/MM/YYYY' ke Date Object
                    const parseDate = (str) => {
                        if (!str || str === '-') return null;
                        const [d, m, y] = str.split('/');
                        return new Date(`${y}-${m}-${d}`);
                    };

                    const targetDate = parseDate(targetDateStr);
                    const start = new Date(this.startDate);
                    const end = new Date(this.endDate);

                    if (!targetDate) {
                        matchDate = false; 
                    } else {
                        matchDate = targetDate >= start && targetDate <= end;
                    }
                }
                return matchSearch && matchDate;
            });
        },
        totalPages() { return Math.ceil(this.filteredList.length / this.itemsPerPage); },
        paginatedList() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredList.slice(start, end);
        },
        totalStok() { return this.barangList.length; },
        stokMenipis() { return this.barangList.filter(i => this.isStokMenipis(i.sisa_stok)).length; },
        jumlahHampirExpired() {
            let count = 0;
            const today = new Date();
            this.barangList.forEach(item => {
                if (item.expired && item.expired !== '-') {
                    const parts = item.expired.split('/'); 
                    const expDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    const diffTime = expDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays <= 30 && diffDays >= 0) count++;
                }
            });
            return count;
        }
    },
    mounted() {
        const savedBarang = JSON.parse(localStorage.getItem('barangList'));
        if (savedBarang && Array.isArray(savedBarang)) {
            this.barangList = savedBarang;
        } else {
            localStorage.setItem('barangList', JSON.stringify(this.barangList));
        }
        this.sinkronDonasi();
    },
    methods: {
        resetFilter() {
            this.startDate = '';
            this.endDate = '';
            this.searchQuery = '';
            this.filterType = 'tgl_masuk';
        },
        isStokMenipis(stokStr) {
            const num = parseInt(stokStr);
            return !isNaN(num) && num < 5;
        },
        sinkronDonasi() {
            let donasiList = JSON.parse(localStorage.getItem('donasiList'));
            if (!donasiList) return;
            let adaDataBaru = false;
            donasiList.forEach(donasi => {
                if (donasi.jenis !== 'Tunai' && !donasi.isSynced) {
                    let kategoriFix = donasi.kategori || 'Lainnya';
                    const itemBaru = {
                        nama: donasi.detail || 'Barang Donasi',
                        kategori: kategoriFix,
                        tgl_masuk: donasi.tanggal,
                        expired: '-', 
                        tgl_keluar: '-',
                        brg_masuk: '-', 
                        brg_keluar: '-',
                        sisa_stok: '-',
                        kondisi: 'Baik'
                    };
                    this.barangList.unshift(itemBaru);
                    donasi.isSynced = true; 
                    adaDataBaru = true;
                }
            });
            if (adaDataBaru) {
                localStorage.setItem('barangList', JSON.stringify(this.barangList));
                localStorage.setItem('donasiList', JSON.stringify(donasiList));
                const Toast = Swal.mixin({
                    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true
                });
                Toast.fire({ icon: 'success', title: 'Data Stok Masuk dari Donasi!' });
            }
        },
        openModal(item, mode) {
            this.tempFormData = { ...item }; 
            this.modalMode = mode;
            this.editingIndex = this.barangList.indexOf(item);
            if (mode === 'edit') {
                if (item.tgl_masuk && item.tgl_masuk.includes('/')) {
                    const parts = item.tgl_masuk.split('/');
                    if(parts.length === 3) this.tempFormData.tgl_masuk_raw = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                if (item.expired && item.expired !== '-' && item.expired.includes('/')) {
                    const parts = item.expired.split('/');
                    if(parts.length === 3) this.tempFormData.expired_raw = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }
            this.isModalOpen = true;
        },
        closeModal() { this.isModalOpen = false; },
        processEdit() {
        Swal.fire({
            title: 'Simpan Perubahan?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a5c7a',
            cancelButtonColor: '#d33'
            }).then((res) => {
                if (res.isConfirmed) {
                    // 1. Format ulang tanggal biar rapi
                    if (this.tempFormData.tgl_masuk_raw) {
                        let d = new Date(this.tempFormData.tgl_masuk_raw);
                        this.tempFormData.tgl_masuk = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
                    }
                    if (this.tempFormData.expired_raw) {
                        let d = new Date(this.tempFormData.expired_raw);
                        this.tempFormData.expired = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
                    } else if (this.tempFormData.expired_raw === '') {
                        this.tempFormData.expired = '-';
                    }

                    // 2. Simpan data barang yang diedit ke LocalStorage
                    if (this.editingIndex !== -1) {
                        this.barangList.splice(this.editingIndex, 1, this.tempFormData);
                        localStorage.setItem('barangList', JSON.stringify(this.barangList));

                        // 3. CATAT KE LOG AKTIVITAS
                        let logs = JSON.parse(localStorage.getItem('activityLog')) || [];
                        
                        let pesanAktivitas = (this.tempFormData.brg_masuk === '-' || this.tempFormData.sisa_stok === '-') 
                            ? "Admin menginput stok awal" 
                            : "Admin mengubah data barang";

                        logs.push({ 
                            text: `${pesanAktivitas}: ${this.tempFormData.nama}`, 
                            time: new Date() // <--- FORMAT BARU (Date Object)
                        });
                        
                        localStorage.setItem('activityLog', JSON.stringify(logs));
                    }
                    
                    this.closeModal();
                    Swal.fire('Berhasil', 'Data barang berhasil diupdate', 'success');
                }
            })
        },

        deleteItem(item) {
            Swal.fire({
                title: 'Yakin Hapus Barang?',
                text: item.nama,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus',
                confirmButtonColor: '#dc3545'
            }).then((res) => {
                if (res.isConfirmed) {
                    // 1. Hapus barang dari daftar
                    this.barangList = this.barangList.filter(i => i !== item);
                    localStorage.setItem('barangList', JSON.stringify(this.barangList));

                    // 2. CATAT KE LOG AKTIVITAS
                    let logs = JSON.parse(localStorage.getItem('activityLog')) || [];
                    
                    logs.push({ 
                        text: `Admin menghapus barang: ${item.nama}`, 
                        time: new Date() // <--- FORMAT BARU (Date Object)
                    });
                    
                    localStorage.setItem('activityLog', JSON.stringify(logs));
                    Swal.fire('Terhapus!', 'Data barang telah dihapus.', 'success');
                }
            })
        },
        isNearExpiry(dateStr) {
            if (!dateStr || dateStr === '-') return false;
            const parts = dateStr.split('/');
            const expDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            const today = new Date();
            const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
            return diffDays <= 30;
        },
        prevPage() { if (this.currentPage > 1) this.currentPage--; },
        nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },

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
}).mount('#barangApp');