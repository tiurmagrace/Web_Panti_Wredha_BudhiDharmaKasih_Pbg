const { createApp } = Vue;
createApp({
    data() {
        return { email: '', isLoading: false }
    },
    methods: {
        kirimKode() {
            this.isLoading = true;
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Kode Terkirim',
                    text: `Kode verifikasi telah dikirim ke ${this.email}`,
                    confirmButtonColor: '#1D4E89'
                }).then(() => {
                    window.location.href = 'verifikasi-kode.html';
                });
            }, 1500);
        }
    }
}).mount('#forgotApp');