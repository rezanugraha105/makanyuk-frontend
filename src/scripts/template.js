import { showFormattedDate } from "./utils";

export function generateLoaderTemplate() {
  return `
    <div class="flex justify-center items-center py-8">
      <div class="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li><a href="#/login" class="block px-4 py-2 rounded bg-white text-orange-800 border border-orange-300 hover:bg-orange-50 transition duration-200">
      <i class="fas fa-sign-in-alt mr-2"></i>Login
      </a>
    </li>
    <li><a href="#/register" class="block px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 transition duration-200">
      <i class="fas fa-user-plus mr-2"></i>Register
      </a>
    </li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
        <li class="relative group">
          <button
            id="review-menu-button"
            class="block px-4 py-2 rounded bg-white text-orange-900 border border-orange-300 hover:bg-orange-50 transition duration-200 w-full text-left md:cursor-pointer"
          >
            <i class="fas fa-utensils mr-2"></i> Review ▾
          </button>
          <ul
            class="submenu hidden md:absolute left-0 mt-1 bg-white border border-orange-200 rounded shadow-md min-w-[200px] z-50 group-hover:block space-y-1 p-2"
          >
            <li><a href="#/add" class="block px-4 py-2 rounded text-orange-900 hover:bg-orange-50">
              <i class="fas fa-plus-circle mr-2"></i> Tambah Review
            </a></li>
            <li><a href="#/my-reviews" class="block px-4 py-2 rounded text-orange-900 hover:bg-orange-50">
              <i class="fas fa-user-edit mr-2"></i> Review Kamu
            </a></li>
            <li><a href="#/bookmark" class="block px-4 py-2 rounded text-orange-900 hover:bg-orange-50">
              <i class="fas fa-bookmark mr-2"></i> Bookmark
            </a></li>
          </ul>
        </li>
        <li>
          <a href="#/logout" class="logout-button block px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition duration-200">
            <i class="fas fa-sign-out-alt mr-2"></i> Logout
          </a>
        </li>
  `;
}

export function generateReviewsListEmptyTemplate() {
    return `
        <div id="reviews-list-empty" class="flex flex-col justify-center items-center text-center">
            <h2>Tidak ada review yang tersedia</h2>
            <p>Saat ini, tidak ada review yang dibagikan</p>
        </div>
    `;
}

export function generateReviewsListErrorTemplate(message) {
    return `
        <div id="reviews-list-error" class="reviews-list__error">
            <h2>Terjadi kesalahan pengambilan daftar review</h2>
            <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
        </div>
    `;
}

export function generateReviewsItemTemplate({
  id,
  username,
  title,
  description,
  photoUrl,
  rating,
  createdAt,
  location,
}) {
  return `
    <div tabIndex="0" class="border border-orange-200 bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition duration-300" data-reviewsId="${id}"> 
      <img src="${photoUrl}" alt="${title}" class="w-full h-48 object-cover object-center">

      <div class="p-5 flex flex-col gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 line-clamp-1">${title}</h2>
          <div class="flex items-center text-sm text-gray-500 gap-2 mt-1">
            <i class="fas fa-star text-yellow-400"></i>
            <span>${rating}</span>
            <span class="mx-1">•</span>
            <i class="fas fa-calendar-alt"></i>
            <span>${showFormattedDate(createdAt, 'id-ID')}</span>
          </div>
        </div>

        <p class="text-sm text-gray-600 line-clamp-3">${description}</p>

        <div class="text-sm text-gray-500">
          <p><i class="fas fa-map mr-1"></i> ${location.placeName ?? "Tidak ada data"}</p>
          <p><i class="fas fa-user mr-1"></i> Dibuat oleh: <span class="font-medium">${username}</span></p>
        </div>

        <a href="#/reviews/${id}" class="inline-block w-fit bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded transition">
          Baca selengkapnya <i class="fas fa-arrow-right ml-1"></i>
        </a>
      </div>
    </div>
  `;
}

export function generateReviewsDetailImageTemplate(imageUrl = null, alt = "") {
    if (!imageUrl) {
        return `
            <img class="reviews-detail__image w-full h-full object-cover object-center" src="images/placeholder-image.jpg" alt="Placeholder Image">
        `;
    }

    return `
        <img class="reviews-detail__image w-full h-full object-cover object-center" src="${imageUrl}" alt="${alt}">
    `;
}

export function generateReviewsDetailTemplate({
    id,
    username,
    title,
    description,
    rating,
    photoUrl,
    createdAt,
    location,
}) {
    const createdFormatted = showFormattedDate(createdAt, 'id-ID');
    const imageHtml = generateReviewsDetailImageTemplate(photoUrl);

    return `
   <section class="w-full bg-white min-h-screen text-gray-800">

      <!-- Hero Image -->
      <div class="px-4 mt-6">
        <div class="max-w-7xl mx-auto rounded-xl overflow-hidden shadow-md h-[300px] md:h-[450px] relative">
          <div class="w-full h-full object-cover object-center bg-gray-200">
            ${imageHtml}
          </div>
          <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
            <h1 class="text-3xl md:text-5xl font-bold text-white drop-shadow text-center px-4">${title}</h1>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="max-w-7xl mx-auto px-4 py-10 space-y-12">

        <!-- Info dan Peta -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Informasi Utama -->
          <div class="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 class="text-2xl font-semibold">Informasi Review</h2>

            <div class="space-y-3 text-sm text-gray-700">
              <div class="flex items-center gap-2">
                <i class="fas fa-calendar text-gray-500"></i>
                <span>${createdFormatted}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-map text-gray-500"></i>
                <span>${location.placeName ?? '-'}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-star text-yellow-400"></i>
                <span>${rating}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">Latitude:</span> ${location.latitude ?? '-'}
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">Longitude:</span> ${location.longitude ?? '-'}
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">Dibuat oleh:</span> ${username}
              </div>
            </div>
          </div>

          <!-- Peta -->
          <div class="bg-white rounded-xl shadow p-6">
            <h2 class="text-2xl font-semibold mb-4">Peta Lokasi</h2>
            <div class="relative h-[300px] rounded-lg overflow-hidden bg-gray-200">
              <div id="map" class="w-full h-full"></div>
              <div id="map-loading-container" class="absolute inset-0 flex items-center justify-center z-10"></div>
            </div>
          </div>
        </div>

        <!-- Deskripsi -->
        <div class="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
          <h2 class="text-2xl font-semibold mb-4">Deskripsi</h2>
          <p class="text-gray-700 leading-relaxed text-base">
            ${description}
          </p>
        </div>

        <!-- Aksi -->
        <div class="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
          <h2 class="text-2xl font-semibold mb-4">Aksi</h2>
          <div id="save-actions-container"></div>
        </div>

      </div>
    </section>
    `;
}

export function generateMyReviewsItemTemplate({
  id,
  username,
  title,
  description,
  photoUrl,
  rating,
  createdAt,
  location,
}) {
  return `
      <div tabIndex="0" class="border border-orange-200 bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition duration-300" data-reviewsId="${id}">
      <img src="${photoUrl}" alt="${title}" class="w-full h-48 object-cover object-center">

      <div class="p-5 flex flex-col gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 line-clamp-1">${title}</h2>
          <div class="flex items-center text-sm text-gray-500 gap-2 mt-1">
            <i class="fas fa-star text-yellow-400"></i>
            <span>${rating}</span>
            <span class="mx-1">•</span>
            <i class="fas fa-calendar-alt"></i>
            <span>${showFormattedDate(createdAt, 'id-ID')}</span>
          </div>
        </div>

        <p class="text-sm text-gray-600 line-clamp-3">${description}</p>

        <div class="text-sm text-gray-500">
          <p><i class="fas fa-map mr-1"></i> ${location.placeName ?? "Tidak ada data"}</p>
          <p><i class="fas fa-user mr-1"></i> Dibuat oleh: <span class="font-medium">${username}</span></p>
        </div>

        <!-- Tombol -->
        <div class="flex flex-wrap gap-2 mt-2">
          <a href="#/reviews/${id}" class="inline-block w-fit bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded transition">
            Baca selengkapnya <i class="fas fa-arrow-right ml-1"></i>
          </a>
          <a href="#/my-reviews-update/${id}" class="inline-block w-fit bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded transition">
            Ubah <i class="fas fa-edit mr-1"></i>
          </a>
          <button class="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition delete-review-button" data-review-id="${id}">
            Hapus <i class="fas fa-trash-alt mr-1"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function generateSaveReviewButtonTemplate() {
  return `
    <button id="review-detail-save" class="inline-flex items-center gap-2 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition">
      <i class="far fa-bookmark"></i> Simpan Review
    </button>
  `
}

export function generateRemoveReviewButtonTemplate() {
  return `
    <button id="review-detail-remove" class="inline-flex items-center gap-2 px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition">
      <i class="fas fa-bookmark"></i> Hapus Review
    </button>
  `
}

export function generateReviewsDetailErrorTemplate(message) {
    return `
        <div class="max-w-xl mx-auto text-center py-10 text-red-600">
          <h2 class="text-xl font-semibold">Gagal memuat detail review</h2>
          <p>${message || "Silakan coba lagi nanti atau gunakan jaringan berbeda."}</p>
        </div>
    `;
}