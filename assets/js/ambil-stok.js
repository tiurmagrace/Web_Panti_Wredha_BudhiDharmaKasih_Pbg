// --- SECURITY CHECK (SATPAM) ---
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'auth/login.html';
}

const { createApp } = window.Vue;

createApp({
    data() {
        return {
            unreadCount: 0,
            selectedNamaBarang: '', 
            stokTersediaDisplay: '', 
            satuanBarang: '', 
            stokAngka: 0,
            barangList: [], 
            form: { jumlah: '', tanggal: '', keperluan: '', petugas: '' },
            currentUrl: window.location.href 
        }
    },
    
    computed: {
        // FILTER PINTAR: Cuma tampilkan barang yang stoknya ADA (Lebih dari 0)
        availableItems() {
            return this.barangList.filter(item => {
                let sisa = 0;
                if(item.sisa_stok) {
                    let match = item.sisa_stok.toString().match(/(\d+)/);
                    if(match) sisa = parseInt(match[0]);
                }
                // Return TRUE (tampilkan) kalau sisa > 0
                return sisa > 0;
            });
        }
    },
    
    mounted() {
        const data = JSON.parse(localStorage.getItem('barangList'));
        if (data && data.length > 0) {
            this.barangList = data;
        } else {
            // Dummy Data
            this.barangList = [
                { nama: 'Pampers uk. M', sisa_stok: '3 pack', tgl_masuk: '15/05/2025', expired: '-' },
                { nama: 'Contoh Barang Habis', sisa_stok: '0 pack', tgl_masuk: '15/05/2025', expired: '-' } 
            ];
            localStorage.setItem('barangList', JSON.stringify(this.barangList));
        }
    },

    methods: {
        cekStok() {
            const item = this.barangList.find(i => i.nama === this.selectedNamaBarang);
            if (item) {
                this.stokTersediaDisplay = item.sisa_stok;
                const match = item.sisa_stok.toString().match(/(\d+)\s*(.*)/);
                if(match) {
                    this.stokAngka = parseInt(match[1]);
                    this.satuanBarang = match[2];
                } else {
                    this.stokAngka = parseInt(item.sisa_stok) || 0;
                    this.satuanBarang = '';
                }
            } else {
                this.stokTersediaDisplay = '-';
                this.stokAngka = 0;
                this.satuanBarang = '';
            }
        },
        
        submitAmbil() {
            if (!this.selectedNamaBarang || !this.form.jumlah || !this.form.tanggal) {
                Swal.fire('Error', 'Lengkapi semua data!', 'error'); return;
            }
            if (parseInt(this.form.jumlah) > this.stokAngka) {
                Swal.fire('Stok Kurang!', `Hanya tersedia ${this.stokAngka} ${this.satuanBarang}`, 'error'); return;
            }

            Swal.fire({
                title: 'Keluarkan Barang?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya', confirmButtonColor: '#21698a'
            }).then((r) => {
                if(r.isConfirmed) {
                    const index = this.barangList.findIndex(i => i.nama === this.selectedNamaBarang);
                    if(index !== -1) {
                        let sisaBaru = this.stokAngka - parseInt(this.form.jumlah);
                        let formatSisa = `${sisaBaru} ${this.satuanBarang}`.trim();
                        
                        this.barangList[index].sisa_stok = formatSisa;
                        
                        let d = new Date(this.form.tanggal);
                        let tglKeluar = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
                        this.barangList[index].tgl_keluar = tglKeluar;
                        this.barangList[index].brg_keluar = `${this.form.jumlah} ${this.satuanBarang}`;

                        localStorage.setItem('barangList', JSON.stringify(this.barangList));

                        let logs = JSON.parse(localStorage.getItem('activityLog')) || [];
                        
                        logs.push({ 
                            text: `Admin mengeluarkan stok: ${this.selectedNamaBarang} (${this.form.jumlah} ${this.satuanBarang}) - ${this.form.keperluan}`, 
                            time: new Date() 
                        });
                        localStorage.setItem('activityLog', JSON.stringify(logs));

                        Swal.fire('Berhasil!', 'Barang berhasil dikeluarkan.', 'success').then(() => {
                            window.location.href = 'data-barang.html';
                        });
                    }
                }
            });
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
}).mount('#ambilStokApp');