const { createApp } = Vue;

createApp({
    data() {
        return {
            pass1: '',
            pass2: '',
            showPass1: false,
            showPass2: false,
            isLoading: false
        }
    },
    methods: {
        resetPass() {
            if (this.pass1 !== this.pass2) {
                Swal.fire('Error', 'Password konfirmasi tidak sama!', 'error');
                return;
            }

            this.isLoading = true;
            
            setTimeout(() => {
                // Update password di localStorage (Simulasi)
                let adminData = JSON.parse(localStorage.getItem('adminAccount'));
                if(adminData) {
                    adminData.password = this.pass1;
                    localStorage.setItem('adminAccount', JSON.stringify(adminData));
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Password berhasil diubah. Silakan login.',
                    confirmButtonColor: '#1a5c7a'
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }, 1000);
        }
    }
}).mount('#resetApp');