<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log Aktivitas Admin - Panti Wredha BDK</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    
    <link rel="stylesheet" href="../assets/css/style-admin.css">
    <link rel="stylesheet" href="../assets/css/semua-aktivitas.css">
    
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body class="bg-admin">
    <div id="activityApp" class="admin-wrapper">
        
        <header class="top-header">
            <div class="header-left">
                <a href="index.html" style="text-decoration: none;">
                    <img src="../assets/images/1.png" alt="Logo BDK" class="header-logo">
                </a>
            </div>

            <div class="header-center">
                <div class="search-box">
                    <input type="text" v-model="searchQuery" placeholder="Cari aktivitas..." name="search">
                    <i class="fas fa-search"></i>
                </div>
            </div>

            <div class="header-right">
                <a href="notifikasi.html" class="text-white text-decoration-none me-3 position-relative" :class="{ active: currentUrl && currentUrl.includes('notifikasi.html') }">
                    <i class="far fa-bell icon-bell"></i>
                    <span v-if="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style="font-size: 0.6rem;"></span>
                </a>
                <span class="user-text me-3">Hai, ADMIN!</span>
                <i class="fas fa-user-circle icon-profile"></i>
            </div>
        </header>

        <aside class="sidebar">
            <ul class="list-unstyled">
                <li><a href="index.html"><i class="fas fa-folder"></i> Dashboard</a></li>
                
                <li>
                    <a href="#penghuniSub" data-bs-toggle="collapse" class="dropdown-toggle"><i class="fas fa-file-invoice"></i> Manajemen Data Penghuni</a>
                    <ul class="collapse list-unstyled sidebar-submenu" id="penghuniSub">
                        <li><a href="kelola-penghuni.html"><i class="fas fa-list"></i> Data Penghuni</a></li>
                        <li><a href="tambah-penghuni.html"><i class="fas fa-plus"></i> Tambah Data</a></li>
                    </ul>
                </li>

                <li>
                    <a href="#donasiSub" data-bs-toggle="collapse" class="dropdown-toggle"><i class="fas fa-box-open"></i> Manajemen Distribusi Donasi</a>
                    <ul class="collapse list-unstyled sidebar-submenu" id="donasiSub">
                        <li><a href="kelola-donasi.html"><i class="fas fa-history"></i> Riwayat</a></li>
                        <li><a href="tambah-donasi.html"><i class="fas fa-plus"></i> Tambah Donasi</a></li>
                        <li><a href="laporan-donasi.html"><i class="fas fa-file-alt"></i> Laporan</a></li>
                    </ul>
                </li>

                <li>
                    <a href="#barangSub" data-bs-toggle="collapse" class="dropdown-toggle"><i class="fas fa-boxes"></i> Manajemen Stok Barang</a>
                    <ul class="collapse list-unstyled sidebar-submenu" id="barangSub">
                        <li><a href="data-barang.html"><i class="fas fa-clipboard-list"></i> Data Stok Barang</a></li>
                        <li><a href="tambah-barang.html"><i class="fas fa-plus"></i> Tambah Stok Barang</a></li>
                        <li><a href="ambil-stok.html"><i class="fas fa-minus-square"></i> Ambil Stok Barang</a></li>
                    </ul>
                </li>
            </ul>
            
            <div class="logout-wrapper">
                <a href="javascript:void(0)" @click="logoutAdmin" class="text-white text-decoration-none d-flex align-items-center gap-2">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div> 
        </aside>

        <main class="main-content" style="padding: 25px;">
            <div class="content-body">
                <div class="page-title-banner" style="margin-bottom: 25px;">Riwayat Aktivitas Admin</div>
                
                <div class="glass-panel">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="d-flex gap-2 align-items-center">
                            <i class="fas fa-filter text-muted"></i>
                            <select v-model="filterKategori" class="filter-select">
                                <option value="">Semua Aktivitas</option>
                                <option value="Penghuni">Data Penghuni</option>
                                <option value="Donasi">Distribusi Donasi</option>
                                <option value="Barang">Stok Barang</option>
                            </select>
                        </div>
                        <div class="text-muted small">
                            Total: <b>{{ filteredList.length }}</b> aktivitas
                        </div>
                    </div>

                    <div v-if="filteredList.length === 0" class="text-center py-5 text-muted">
                        <i class="fas fa-search fa-2x mb-3" style="opacity: 0.3;"></i><br>
                        Tidak ada aktivitas yang cocok.
                    </div>
                    
                    <div v-else>
                        <div v-for="(act, index) in filteredList" :key="index" class="log-item">
                            <div class="log-icon">
                                <i v-if="act.text.toLowerCase().includes('donasi')" class="fas fa-box-open"></i>
                                <i v-else-if="act.text.toLowerCase().includes('penghuni')" class="fas fa-user-injured"></i>
                                <i v-else-if="act.text.toLowerCase().includes('barang')" class="fas fa-boxes"></i>
                                <i v-else class="fas fa-history"></i>
                            </div>
                            <div class="log-content">
                                <div class="log-text">{{ act.text }}</div>
                            </div>
                            <div class="log-time">
                                <i class="far fa-clock me-1"></i> {{ formatTanggal(act.time) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <script src="../assets/js/semua-aktivitas.js"></script>
</body>
</html>