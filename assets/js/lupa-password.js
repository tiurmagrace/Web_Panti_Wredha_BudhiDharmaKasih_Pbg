const { createApp } = Vue;

createApp({
    data() {
        return {
            email: '',
            isLoading: false
        }
    },
    methods: {
        kirimLink() {
            this.isLoading = true;
            
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Link Terkirim!',
                    text: `Link reset telah dikirim ke ${this.email}`,
                    confirmButtonColor: '#1a5c7a'
                }).then(() => {
                    window.location.href = 'reset-password.html'; 
                });
            }, 1000);
        }
    }
}).mount('#lupaApp');