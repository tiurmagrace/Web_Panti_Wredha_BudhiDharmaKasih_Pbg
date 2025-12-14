const { createApp } = Vue;
createApp({
    methods: {
        handleInput(e, index) {
            // Auto focus ke kotak selanjutnya jika sudah terisi
            if (e.target.value.length === 1 && index < 3) {
                this.$refs.otpInputs[index + 1].focus();
            }
        },
        submitCode() {
            // Simulasi kode benar
            window.location.href = 'reset-password-baru.html';
        }
    }
}).mount('#verifyApp');