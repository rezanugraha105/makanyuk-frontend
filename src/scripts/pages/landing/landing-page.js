export default class LandingPage {
    async render() {
        return `
        <!-- Hero Section -->
<section class="bg-orange-50 py-24 px-6" data-aos="fade-up">
  <div class="container mx-auto text-center">
    <h1 class="text-4xl md:text-5xl font-bold text-orange-700 mb-4">
      MakanYuk – Jelajahi Rasa, Bagikan Cerita!
    </h1>
    <p class="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
      Temukan tempat makan favoritmu dan bagikan pengalaman kulinermu lewat review dan foto. Semua bisa kamu lakukan di satu aplikasi.
    </p>

    <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
      <div class="text-center">
        <a href="#/login" class="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition flex items-center gap-2">
          <i class="fas fa-pen"></i> Tulis Review
        </a>
      </div>
      <a href="#/login" class="border border-orange-500 text-orange-600 px-6 py-3 rounded-full hover:bg-orange-100 transition flex items-center gap-2">
        <i class="fas fa-search"></i> Jelajahi Review Lain
      </a>
    </div>
  </div>
</section>

<!-- Fitur -->
<section class="py-20 bg-white px-6" data-aos="fade-up">
  <div class="container mx-auto text-center">
    <h2 class="text-3xl font-semibold text-orange-700 mb-12">Fitur Utama</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
      <div class="p-6 hover:bg-orange-50 rounded-xl shadow-sm transition text-center">
        <i class="fas fa-map-marked-alt text-orange-400 text-3xl mb-4"></i>
        <h3 class="text-xl font-bold text-orange-600 mb-2">Jelajahi Tempat Makan</h3>
        <p class="text-gray-600">Cari rekomendasi tempat makan berdasarkan rating dan lokasi.</p>
      </div>
      <div class="p-6 hover:bg-orange-50 rounded-xl shadow-sm transition text-center">
        <i class="fas fa-edit text-orange-400 text-3xl mb-4"></i>
        <h3 class="text-xl font-bold text-orange-600 mb-2">Buat Review</h3>
        <p class="text-gray-600">Tulis pengalaman kuliner kamu dengan rating, catatan, dan cerita pribadi.</p>
      </div>
      <div class="p-6 hover:bg-orange-50 rounded-xl shadow-sm transition text-center">
        <i class="fas fa-camera text-orange-400 text-3xl mb-4"></i>
        <h3 class="text-xl font-bold text-orange-600 mb-2">Upload Foto</h3>
        <p class="text-gray-600">Abadikan momen makanmu langsung dari kamera dan tampilkan di review.</p>
      </div>
      <div class="p-6 hover:bg-orange-50 rounded-xl shadow-sm transition text-center">
        <i class="fas fa-bookmark text-orange-400 text-3xl mb-4"></i>
        <h3 class="text-xl font-bold text-orange-600 mb-2">Simpan Favorit</h3>
        <p class="text-gray-600">Bookmark tempat favorit agar mudah ditemukan kembali nanti.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA Join -->
<section class="py-20 bg-orange-100 px-6" data-aos="fade-up">
  <div class="container mx-auto text-center">
    <h2 class="text-3xl font-bold text-orange-800 mb-4">Gabung dan Bagikan Cerita Kuliner Versimu</h2>
    <p class="text-lg text-gray-700 max-w-xl mx-auto mb-8">
      Tak perlu jadi food blogger untuk berbagi! Dengan MakanYuk, semua orang bisa bercerita soal rasa dan tempat makan favorit.
    </p>
    <a href="#/register" class="bg-orange-600 text-white px-8 py-4 rounded-full hover:bg-orange-700 transition flex items-center justify-center gap-2 w-fit mx-auto">
      <i class="fas fa-user-plus"></i> Mulai Sekarang
    </a>
    <p class="text-orange-800 font-semibold mt-4">#JelajahiRasaBagikanCerita</p>
  </div>
</section>

<!-- Thanks To Section -->
<section class="py-16 bg-white px-6" data-aos="fade-up">
  <div class="container mx-auto text-center">
    <h2 class="text-2xl font-semibold text-orange-700 mb-6">Terima Kasih</h2>
    <p class="text-gray-700 max-w-2xl mx-auto">
      Aplikasi ini merupakan hasil kerja keras dalam rangka tugas akhir, dan dikembangkan berkat dukungan dari:
    </p>

    <div class="mt-8 flex flex-col md:flex-row justify-center items-center gap-8">
      <div class="text-center">
        <img src="/../images/logo-unindra.png" alt="Logo Universitas" class="w-24 h-24 object-contain mx-auto mb-2" />
        <p class="text-gray-700 font-medium">Universitas Indraprasta PGRI</p>
      </div>
      <div class="text-center">
        <img src="/../images/logo-dicoding2.jpeg" alt="Logo Perusahaan" class="w-24 h-24 object-contain mx-auto mb-2" />
        <p class="text-gray-700 font-medium">Dicoding Indonesia</p>
      </div>
    </div>
  </div>
</section>
        `;
    }

    async afterRender() {
        //Do something here
    }

}