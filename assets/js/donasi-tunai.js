const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoggedIn: false,
            currentUser: null,
            logoutModalInstance: null,
            searchQuery: '', // TAMBAHAN
            form: {
                nama: '', hp: '', email: '', catatan: '', fileBukti: null
            },
            errors: {}
        }
    },
    mounted() {
        this.cekStatusLogin();
    },
    methods: {
        cekStatusLogin() {
            const status = localStorage.getItem('isLoggedIn');
            const userData = localStorage.getItem('user_sementara');

            if (status === 'true' && userData) {
                this.isLoggedIn = true;
                this.currentUser = JSON.parse(userData);
                this.form.nama = this.currentUser.username;
                this.form.email = this.currentUser.email;
            } else {
                localStorage.setItem('redirect_after_login', '../donatur/donasi-tunai.html');
                alert("Maaf, Anda harus login dulu...");
                window.location.href = "../auth/login.html"; 
            }
        },
        showLogoutModal() {
            const modalEl = document.getElementById('logoutModal');
            this.logoutModalInstance = new bootstrap.Modal(modalEl);
            this.logoutModalInstance.show();
        },
        confirmLogout() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('redirect_after_login');
            window.location.href = "../index.html"; 
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.form.fileBukti = e.target.result; 
                };
                reader.readAsDataURL(file);
            }
        },
        kirimDonasi() {
            this.errors = {};
            if (!this.form.hp) this.errors.hp = "Wajib diisi";

            if (Object.keys(this.errors).length === 0) {
                let dataAdmin = JSON.parse(localStorage.getItem('donasiList')) || [];
                
                let donasiBaru = {
                    id: Date.now(),
                    tanggal: new Date().toLocaleDateString('en-GB'),
                    donatur: this.form.nama,
                    jenis: 'Tunai', 
                    detail: 'Uang Tunai',
                    jumlah: 'Rp (Cek Bukti)', 
                    status: 'Tidak Langsung', 
                    petugas: '-',
                    catatan: this.form.catatan,
                    hp: this.form.hp,
                    email: this.form.email,
                    foto: this.form.fileBukti 
                };

                dataAdmin.push(donasiBaru);
                localStorage.setItem('donasiList', JSON.stringify(dataAdmin));

                const modal = new bootstrap.Modal(document.getElementById('modalSuccess'));
                modal.show();
            }
        },

        // --- FITUR PENCARIAN (SAMA SEPERTI DI ATAS) ---
        performSearch() {
            if (!this.searchQuery) return;
            document.querySelectorAll('.highlight-text').forEach(el => { el.outerHTML = el.innerText; });

            const term = this.searchQuery.trim();
            if (term.length < 3) { Swal.fire('Info', 'Kata kunci minimal 3 huruf', 'info'); return; }

            const content = document.querySelector('main'); 
            const regex = new RegExp(`(${term})`, 'gi');
            let found = false;

            function highlightText(node) {
                if (node.nodeType === 3) { 
                    const match = node.data.match(regex);
                    if (match) {
                        const span = document.createElement('span');
                        span.innerHTML = node.data.replace(regex, '<span class="highlight-text">$1</span>');
                        node.parentNode.replaceChild(span, node);
                        found = true;
                    }
                } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (let i = 0; i < node.childNodes.length; i++) { highlightText(node.childNodes[i]); }
                }
            }

            highlightText(content);

            if (found) {
                const firstHighlight = document.querySelector('.highlight-text');
                if (firstHighlight) firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                Swal.fire('Tidak Ditemukan', `Kata "${term}" tidak ada di halaman ini.`, 'warning');
            }
        }
    }
}).mount('#tunaiApp');