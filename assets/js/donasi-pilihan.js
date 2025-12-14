const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoggedIn: false,
            currentUser: null,
            logoutModalInstance: null,
            searchQuery: '' // TAMBAHAN
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
        pilihDonasi(jenis) {
            let tujuanFile = (jenis === 'barang') ? 'donasi-barang.html' : 'donasi-tunai.html';
            if (this.isLoggedIn) {
                window.location.href = tujuanFile;
            } else {
                localStorage.setItem('redirect_after_login', `../donatur/${tujuanFile}`); 
                Swal.fire({
                    icon: 'info', title: 'Login Diperlukan', text: 'Untuk mengisi formulir donasi, silakan Login atau Daftar akun terlebih dahulu.',
                    confirmButtonColor: '#1a5c7a'
                }).then(() => {
                    window.location.href = "../auth/login.html"; 
                });
            }
        },

        // --- FITUR PENCARIAN ---
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
}).mount('#donasiPilihanApp');