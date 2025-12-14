const { createApp } = Vue;

createApp({
    data() {
        return {
            username: '',
            password: '',
            showPassword: false,
            isLoading: false
        }
    },
    methods: {
        handleLogin() {
            this.isLoading = true;

            // Simulasi loading network
            setTimeout(() => {
                let adminData = JSON.parse(localStorage.getItem('adminAccount'));
        
                // Default Admin jika belum ada
                if (!adminData) {
                    adminData = { username: 'admin', password: '123' }; 
                    localStorage.setItem('adminAccount', JSON.stringify(adminData));
                }

                if (this.username === adminData.username && this.password === adminData.password) {
                    Swal.fire({
                        icon: 'success', 
                        title: 'Login Berhasil', 
                        text: 'Selamat Datang Admin!',
                        timer: 1500, 
                        showConfirmButton: false
                    }).then(() => {
                        localStorage.setItem('adminLoggedIn', 'true');
                        window.location.href = '../index.html'; 
                    });
                } else {
                    Swal.fire('Akses Ditolak', 'Username atau Password salah!', 'error');
                    this.isLoading = false;
                }
            }, 800);
        }
    }
}).mount('#loginApp');