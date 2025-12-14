const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoggedIn: false,
            currentUser: null,
            logoutModalInstance: null,
            searchQuery: '', // TAMBAHAN UNTUK SEARCH
            form: {
                nama: '',
                email: '',
                telepon: '',
                pesan: ''
            }
        }
    },
    mounted() {
        const status = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('user_sementara');

        if (status === 'true' && userData) {
            this.isLoggedIn = true;
            this.currentUser = JSON.parse(userData);
            this.form.nama = this.currentUser.username;
            this.form.email = this.currentUser.email;
        }
    },
    methods: {
        kirimPesan() {
            if (!this.form.nama || !this.form.pesan) {
                Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Harap isi Nama dan Pesan Anda!', confirmButtonColor: '#1a5c7a' });
                return;
            }

            let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
            let pesanBaru = {
                id: Date.now(),
                nama: this.form.nama,
                email: this.form.email,
                telepon: this.form.telepon,
                pesan: this.form.pesan,
                tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };

            feedbackList.push(pesanBaru);
            localStorage.setItem('feedbackList', JSON.stringify(feedbackList));

            Swal.fire({ title: 'Pesan Terkirim!', text: 'Terima kasih atas masukan dan dukungan Anda.', icon: 'success', confirmButtonColor: '#1a5c7a', confirmButtonText: 'Sama-sama' });
            this.form.pesan = ''; 
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

        // --- TAMBAHAN FUNGSI SEARCH ---
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
}).mount('#kontakApp');