const { createApp, computed } = Vue;

createApp({
    data() {
        return {
            // --- STATE LOGIN ---
            isLoggedIn: false,
            currentUser: null,
            logoutModalInstance: null,

            // --- STATE PENCARIAN (BARU) ---
            searchQuery: '',

            // --- STATE GALERI ---
            currentPage: 1,
            itemsPerPage: 6,
            galleryImages: [
                { src: 'assets/images/7.png', alt: 'Dokumentasi 1' },
                { src: 'assets/images/8.png', alt: 'Dokumentasi 2' },
                { src: 'assets/images/9.png', alt: 'Dokumentasi 3' },
                { src: 'assets/images/7.png', alt: 'Dokumentasi 4' },
                { src: 'assets/images/8.png', alt: 'Dokumentasi 5' },
                { src: 'assets/images/9.png', alt: 'Dokumentasi 6' },
                { src: 'assets/images/7.png', alt: 'Dokumentasi 7' },
                { src: 'assets/images/8.png', alt: 'Dokumentasi 8' },
            ]
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.galleryImages.length / this.itemsPerPage);
        },
        paginatedImages() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.galleryImages.slice(start, end);
        }
    },
    mounted() {
        // Cek Login
        const status = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('user_sementara');

        if (status === 'true' && userData) {
            this.isLoggedIn = true;
            this.currentUser = JSON.parse(userData);
        }
    },
    methods: {
        // --- METHOD LOGIN/LOGOUT ---
        showLogoutModal() {
            const modalEl = document.getElementById('logoutModal');
            this.logoutModalInstance = new bootstrap.Modal(modalEl);
            this.logoutModalInstance.show();
        },
        confirmLogout() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('redirect_after_login');
            if(this.logoutModalInstance) this.logoutModalInstance.hide();
            window.location.reload(); 
        },

        // --- METHOD GALERI ---
        setPage(page) {
            this.currentPage = page;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            } else {
                this.currentPage = 1;
            }
        },

        // --- METHOD PENCARIAN (BARU) ---
        performSearch() {
            if (!this.searchQuery) return;

            // Reset highlight lama
            document.querySelectorAll('.highlight-text').forEach(el => {
                el.outerHTML = el.innerText;
            });

            const term = this.searchQuery.trim();
            if (term.length < 3) {
                // Gunakan alert biasa atau Swal jika library sudah di-load di index.html
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Info', 'Kata kunci minimal 3 huruf', 'info');
                } else {
                    alert('Kata kunci minimal 3 huruf');
                }
                return;
            }

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
                    for (let i = 0; i < node.childNodes.length; i++) {
                        highlightText(node.childNodes[i]);
                    }
                }
            }

            highlightText(content);

            if (found) {
                const firstHighlight = document.querySelector('.highlight-text');
                if (firstHighlight) {
                    firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Tidak Ditemukan', `Kata "${term}" tidak ada di halaman ini.`, 'warning');
                } else {
                    alert(`Kata "${term}" tidak ada di halaman ini.`);
                }
            }
        }
    }
}).mount('#homepageApp');