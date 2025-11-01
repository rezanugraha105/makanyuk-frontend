import { parseActivePathname } from "../../routes/url-parser";
import myReviewUpdatePresenter from "./my-reviews-update-presenter";
import * as FoodAPI from "../../data/api";
import{
    generateLoaderAbsoluteTemplate,
    generateReviewsDetailTemplate,
    generateReviewsDetailErrorTemplate,
    generateSaveReviewButtonTemplate,
    generateRemoveReviewButtonTemplate,
} from "../../template";
import Map from "../../utils/map";
import Swal from "sweetalert2";

export default class myReviewUpdatePage {
    #presenter;
    #form;
    #map;
    async render() {
        return `
        <!-- Header -->
        <section class="bg-orange-300/30 bg-cover bg-top text-center py-24">
        <div class="container mx-auto px-2">
            <h1 class="text-4xl font-bold text-gray-800">Update cerita!</h1>
        </div>
        </section>

        <!-- Form -->
        <section class="bg-orange-50 py-20">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
            <form id="update-form" class="bg-white shadow-xl rounded-2xl border border-gray-200 p-10 space-y-10">

                <!-- Judul -->
                <div>
                <label for="title-input" class="block text-sm font-semibold mb-2 text-gray-700">Judul Review</label>
                <input id="title-input" name="title" placeholder="Masukkan judul review Anda"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    required />
                </div>

                <!-- Rating -->
                <div>
                <label for="rating-input" class="block text-sm font-semibold mb-2 text-gray-700">Rating (1–5)</label>
                <input id="rating-input" name="rating" type="number" min="1" max="5" placeholder="1 - 5"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    required />
                <p class="text-sm text-gray-500 mt-1">Masukkan angka antara 1 hingga 5</p>
                </div>

                <!-- Deskripsi -->
                <div>
                <label for="description-input" class="block text-sm font-semibold mb-2 text-gray-700">Deskripsi</label>
                <textarea id="description-input" name="description" placeholder="Ceritakan pengalaman makanmu di sini..."
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    rows="5" required></textarea>
                </div>

                <!-- Lokasi -->
                <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
                <div class="rounded-xl overflow-hidden border border-gray-300 bg-gray-200 h-[400px] relative z-0">
                    <div id="map" class="w-full h-full"></div>
                    <div id="map-loading-container" class="relative inset-0 z-0"></div>
                </div>
                <div class="flex flex-col md:flex-row gap-3 mt-4">
                    <input type="number" name="lat" value="-6.175389" disabled
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100" />
                    <input type="number" name="lon" value="106.827139" disabled
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100" />
                </div>
                </div>

                <!-- Tombol Submit -->
                <div class="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
                <button
                    class="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                    type="submit">
                    Ubah Review!
                </button>
                <a href="#/my-reviews"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-200">
                    Batal
                </a>
                </div>

            </form>
            </div>
        </div>
        </section>
        `;
    }

    async afterRender() {
        this.#presenter = new myReviewUpdatePresenter(parseActivePathname().id, {
            view: this,
            apiModel: FoodAPI,
        });

        this.#presenter.showReviewUpdate();
        this.#updateForm();
    }

    populateReviewUpdateAndInitialMap(message, review) {
        this.#form = document.getElementById('update-form');
        this.#form.elements.namedItem('title').value = review.title;
        this.#form.elements.namedItem('rating').value = review.rating;
        this.#form.elements.namedItem('description').value = review.description;
        this.#form.elements.namedItem('lat').value = review.lat;
        this.#form.elements.namedItem('lon').value = review.lon;

        this.initialMapWithCoordinates(review.lat, review.lon);
    }

    async initialMapWithCoordinates(lat, lon) {
        this.#map = await Map.build('#map', {
            zoom: 15,
            center: [lat, lon],
        });

        const draggableMarker = this.#map.addMarker([lat, lon], { draggable: true });

        draggableMarker.addEventListener('move', (event) => {
            const coordinate = event.target.getLatLng();
            this.#updateLatLngInput(coordinate.lat, coordinate.lng);
        });

        this.#map.addMapEventListener('click', (event) => {
            draggableMarker.setLatLng(event.latlng);
            event.sourceTarget.flyTo(event.latlng);
        });
    }

    async initialMap() {
            this.#map = await Map.build('#map', {
                zoom: 15,
                locate: true,
            });
    
            const centerCoordinate = this.#map.getCenter();
    
            this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);
    
            const draggableMarker = this.#map.addMarker(
                [centerCoordinate.latitude, centerCoordinate.longitude],
                { draggable: true }
            );
    
            draggableMarker.addEventListener('move', (event) => {
                const coordinate = event.target.getLatLng();
                this.#updateLatLngInput(coordinate.lat, coordinate.lng);
            });
    
            this.#map.addMapEventListener('click', (event) => {
                draggableMarker.setLatLng(event.latlng);
    
                event.sourceTarget.flyTo(event.latlng);
            });
        }
    
    #updateLatLngInput(lat, lon) {
        this.#form.elements.namedItem('lat').value = lat;
        this.#form.elements.namedItem('lon').value = lon;
    }

    #updateForm() {
        this.#form = document.getElementById('update-form');
        this.#form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const title = this.#form.elements.namedItem('title').value.trim();
            const rating = this.#form.elements.namedItem('rating').value.trim();
            const description = this.#form.elements.namedItem('description').value.trim();
            const lat = this.#form.elements.namedItem('lat').value;
            const lon = this.#form.elements.namedItem('lon').value;

            if (!title || !rating || !description) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Form belum lengkap',
                    text: 'Pastikan semua kolom termasuk gambar telah diisi!',
                    showConfirmButton: true,
                    customClass: {
                        confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
                    }
                });
                return;
            }

            const ratingValue = Number(rating);
            if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
                Swal.fire({
                    icon: "warning",
                    title: "Rating tidak valid",
                    text: "Rating harus berupa angka antara 1 hingga 5",
                });
                return;
            }

            const data = {
                title,
                rating: ratingValue,
                description,
                lat,
                lon,
            };

            await this.#presenter.updateReviewById(data);
        });
    }

    async storeSuccessfully(message) {
        await Swal.fire({
            position: "center",
            icon: "success",
            title: "Berhasil!",
            text: `${message}`,
            showConfirmButton: false,
            timer: 2000,
        });
        this.clearForm();
        location.href = '#/my-reviews';
    }

    storeFailed(message) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Terjadi kesalahan",
            text: `${message}`,
            showConfirmButton: true,
            customClass: {
                confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
            }
        });
    }

    clearForm() {
        this.#form.reset();
    }

    showMapLoading() {
            document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }
    
    hideMapLoading() {
            document.getElementById('map-loading-container').innerHTML = '';
    }

    showUpdateLoadingButton() {
        const button = this.#form.querySelector('button[type="submit"]');
        button.disabled = true;
        button.innerHTML = `
        <span class="inline-flex items-center">
        <svg class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
            </path>
        </svg>
        Loading...
        </span>
        `;
    }

    hideUpdateLoadingButton() {
        const button = this.#form.querySelector('button[type="submit"]');
        button.disabled = false;
        button.innerHTML = `Ubah Review!`;
    }
    
}