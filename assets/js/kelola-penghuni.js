/* ========================================
   KELOLA PENGHUNI - JAVASCRIPT LOGIC
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
            // DATA UTAMA
            alertStatus: null, 
            isModalOpen: false, 
            modalMode: 'detail', 
            currentPage: 1, 
            itemsPerPage: 20, 
            tempFormData: {}, 
            editingIndex: -1, 
            
            // DATA PENCARIAN & FILTER
            searchQuery: '', 
            filterPaviliun: '',
            filterTahun: '',
            
            // DUMMY DATA
            penghuniList: [
                { 
                    nik: '1234567890123456', 
                    nama: 'tino prasetyo', 
                    ttl: 'majenang, 25/05/1957', 
                    usia: 67, 
                    kota: 'purwokerto', 
                    tahun: '2024', 
                    paviliun: 'bougenville 1', 
                    agama: 'katolik', 
                    alamat: 'jl. kenanga no. 3', 
                    gender: 'pria', 
                    status: 'duda', 
                    pj: 'budi (anak)', 
                    hubungan: 'anak', 
                    telp: '08123456789', 
                    alamat_pj: 'jakarta', 
                    penyakit: 'stroke ringan', 
                    alergi: 'ayam', 
                    kebutuhan: 'walker', 
                    obat: 'simvastatin', 
                    status_sehat: 'stabil', 
                    tgl_masuk: '2024-01-01', 
                    rujukan: 'keluarga', 
                    catatan: '-', 
                    foto: null 
                },
                { 
                    nik: '3302055505570001', 
                    nama: 'arifin', 
                    ttl: 'majenang, 25/05/1957', 
                    usia: 67, 
                    kota: 'purwokerto', 
                    tahun: '2024', 
                    paviliun: 'bougenville 1', 
                    agama: 'islam', 
                    alamat: 'jl. merdeka no. 1', 
                    gender: 'pria', 
                    status: 'menikah', 
                    pj: 'siti (istri)', 
                    hubungan: 'istri', 
                    telp: '0812999999', 
                    alamat_pj: 'purwokerto', 
                    penyakit: 'diabetes', 
                    alergi: '-', 
                    kebutuhan: '-', 
                    obat: 'metformin', 
                    status_sehat: 'perlu kontrol', 
                    tgl_masuk: '2024-02-15', 
                    rujukan: 'dinas sosial', 
                    catatan: '-', 
                    foto: null 
                },
            ],
            currentUrl: window.location.href,
            unreadCount: 0
        }
    },
    
    computed: {
        // Ambil tahun unik untuk dropdown
        uniqueYears() {
            if (!this.penghuniList) return [];
            const years = this.penghuniList.map(item => item.tahun);
            return [...new Set(years)].sort((a, b) => b - a);
        },

        // Filter gabungan (search + paviliun + tahun + sorting)
        filteredList() {
            const hasilFilter = this.penghuniList.filter(item => {
                const search = this.searchQuery.toLowerCase();
                
                // Logika Search Bar
                const matchSearch = (item.nik && item.nik.toString().toLowerCase().includes(search)) ||
                                    (item.nama && item.nama.toLowerCase().includes(search)) ||
                                    (item.kota && item.kota.toLowerCase().includes(search));

                // Logika Filter Paviliun
                const matchPaviliun = this.filterPaviliun === '' || 
                                    (item.paviliun && item.paviliun.toUpperCase() === this.filterPaviliun.toUpperCase());

                // Logika Filter Tahun
                const matchTahun = this.filterTahun === '' || 
                                    (item.tahun && item.tahun.toString() === this.filterTahun.toString());

                return matchSearch && matchPaviliun && matchTahun;
            });

            // Sorting by tanggal masuk (terbaru dulu)
            return hasilFilter.sort((a, b) => {
                const dateA = new Date(a.tgl_masuk);
                const dateB = new Date(b.tgl_masuk);
                return dateB - dateA;
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

    mounted() {
        // Check URL params untuk alert sukses
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('status') === 'success') {
            this.alertStatus = 'success';
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // Load data dari localStorage
        const dataBaru = JSON.parse(localStorage.getItem('penghuniBaru'));
        if (dataBaru && Array.isArray(dataBaru) && dataBaru.length > 0) {
            this.penghuniList = dataBaru;
        } else {
            localStorage.setItem('penghuniBaru', JSON.stringify(this.penghuniList));
        }
    },

    methods: {
        // Format text helper functions
        formatUpperCase(str) { 
            return str ? String(str).toUpperCase() : '-'; 
        },
        
        formatTitleCase(str) { 
            return str ? String(str).toLowerCase().replace(/(?:^|\s)\w/g, m => m.toUpperCase()) : '-'; 
        },
        
        // Reset semua filter
        resetFilter() {
            this.filterPaviliun = '';
            this.filterTahun = '';
            this.searchQuery = '';
            this.currentPage = 1; 
        },

        // Trigger file input untuk upload foto
        triggerFileInput() {
            if (this.modalMode === 'edit') { 
                this.$refs.fileInput.click(); 
            }
        },

        // Handle upload foto
        handlePhotoUpload(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    this.tempFormData.foto = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        // Open modal (detail atau edit)
        openModal(item, mode) {
            this.modalMode = mode;
            this.tempFormData = { ...item };
            this.editingIndex = this.penghuniList.findIndex(p => p.nik === item.nik);
            this.isModalOpen = true;
        },

        // Close modal
        closeModal() {
            this.isModalOpen = false;
            this.tempFormData = {};
            this.editingIndex = -1;
        },

        // Process edit dan save
        processEdit() {
            if (this.editingIndex !== -1) {
                this.penghuniList[this.editingIndex] = { ...this.tempFormData };
                
                // Extract tahun dari tgl_masuk
                if (this.tempFormData.tgl_masuk) {
                    const year = new Date(this.tempFormData.tgl_masuk).getFullYear();
                    this.penghuniList[this.editingIndex].tahun = year.toString();
                }
                
                localStorage.setItem('penghuniBaru', JSON.stringify(this.penghuniList));
                
                Swal.fire({
                    icon: 'success',
                    title: 'Data Berhasil Diubah!',
                    text: 'Perubahan data penghuni telah disimpan.',
                    confirmButtonColor: '#21698a'
                });
                
                this.closeModal();
            }
        },

        // Pagination controls
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },

        // Logout function
        logoutAdmin() {
            Swal.fire({
                title: 'Konfirmasi Logout',
                text: 'Apakah Anda yakin ingin keluar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#21698a',
                cancelButtonColor: '#d33',
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
}).mount('#penghuniApp');