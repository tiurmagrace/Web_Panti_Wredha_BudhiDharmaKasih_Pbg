const { createApp } = Vue;

createApp({
    data() {
        return {
            form: {
                email: '',
                username: '',
                password: '',
                confirmPassword: ''
            },
            showPass: false,
            isLoading: false,
            errorMsg: ''
        }
    },
    methods: {
        handleSignup() {
            this.isLoading = true;
            this.errorMsg = '';

            if (this.form.password !== this.form.confirmPassword) {
                this.errorMsg = "Password dan Konfirmasi tidak sama!";
                this.isLoading = false;
                return;
            }

            setTimeout(() => {
                const userData = {
                    email: this.form.email,
                    password: this.form.password,
                    username: this.form.username
                };
                
                // Simpan ke LocalStorage
                localStorage.setItem('user_sementara', JSON.stringify(userData));

                Swal.fire({
                    icon: 'success',
                    title: 'Akun Dibuat!',
                    text: 'Silahkan login dengan akun baru Anda.',
                    confirmButtonColor: '#1D4E89'
                }).then(() => {
                    window.location.href = "login.html"; 
                });
                
            }, 1500);
        }
    }
}).mount('#signupApp');