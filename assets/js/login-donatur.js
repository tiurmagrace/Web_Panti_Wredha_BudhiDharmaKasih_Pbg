const { createApp } = Vue;

createApp({
    data() {
        return {
            email: '',
            password: '',
            showPassword: false,
            isLoading: false,
            errorMessage: ''
        }
    },
    methods: {
        handleLogin() {
            this.isLoading = true;
            this.errorMessage = '';

            setTimeout(() => {
                // Ambil data user dari LocalStorage (Simulasi Database)
                const storedUser = localStorage.getItem('user_sementara');
                const userDB = storedUser ? JSON.parse(storedUser) : null;

                // Validasi Sederhana
                if (userDB && this.email === userDB.email && this.password === userDB.password) {
                    
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Berhasil!',
                        text: 'Selamat datang kembali, ' + userDB.username,
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        // Cek apakah ada redirect tertunda (misal dari klik tombol Donasi)
                        const tujuanRedirect = localStorage.getItem('redirect_after_login');

                        if (tujuanRedirect) {
                            window.location.href = tujuanRedirect;
                            localStorage.removeItem('redirect_after_login');
                        } else {
                            // Default ke Homepage
                            window.location.href = "../index.html";
                        }
                    });
                    
                } else {
                    this.errorMessage = "Email atau Password salah!";
                    this.isLoading = false;
                }

            }, 1000);
        }
    }
}).mount('#loginApp');