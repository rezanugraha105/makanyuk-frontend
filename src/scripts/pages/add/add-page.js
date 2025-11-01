import AddPresenter from "./add-presenter";
import * as FoodAPI from "../../data/api";
import Map from "../../utils/map";
import Camera from "../../utils/camera";
import { convertBase64ToBlob } from "../../utils";
import { generateLoaderAbsoluteTemplate } from "../../template";
import Swal from "sweetalert2";

export default class addPage {
    #presenter;
    #form;
    #camera;
    #isCameraOpen = false;
    #takenImage = null;
    #map = null;

    async render() {
        return `
        <!-- Header -->
        <section class="bg-orange-300/30 bg-cover bg-top text-center py-24">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">Buat Cerita Makanmu Sendiri!</h1>
            <p class="text-lg text-gray-700">Bagikan pengalaman kulinermu dan bantu orang lain menemukan tempat makan terbaik.</p>
        </div>
        </section>

        <!-- Form -->
        <section class="bg-orange-50 py-20">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
            <form id="new-form" class="bg-white shadow-xl rounded-2xl border border-gray-200 p-10 space-y-10">

                <!-- Judul -->
                <div>
                <label for="title-input" class="block text-sm font-semibold mb-2 text-gray-700">Judul Review</label>
                <input id="title-input" name="title" placeholder="Masukkan judul review Anda"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    required />
                </div>

                <!-- Gambar -->
                <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Foto Dokumentasi</label>
                <div class="flex gap-3 flex-wrap">
                    <button id="image-input-button" type="button"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-orange-100 hover:bg-orange-200 transition">Ambil Gambar</button>
                    <input id="image-input" name="image" type="file" accept="image/*" class="hidden" />
                    <button id="open-image-camera-button" type="button"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-orange-100 hover:bg-orange-200 transition">Buka Kamera</button>
                </div>
                <div id="camera-container" class="hidden mt-4 space-y-2">
                    <video id="camera-video" class="w-full h-auto rounded-lg border border-gray-300"></video>
                    <canvas id="camera-canvas" class="hidden"></canvas>
                    <div class="flex items-center gap-2">
                    <select id="camera-select" class="border rounded px-2 py-1 text-sm w-full max-w-[200px]"></select>
                    <button id="camera-take-button" type="button"
                        class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm transition">Ambil Gambar</button>
                    </div>
                </div>
                <ul id="image-taken" class="mt-4 flex flex-wrap gap-3 px-1"></ul>
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
                    Buat Review!
                </button>
                <a href="#/home"
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
        this.#presenter = new AddPresenter({
            view: this,
            model: FoodAPI,
        });
        this.#takenImage = null;

        this.#presenter.showNewFormMap();
        this.#setupForm();
    }

    #setupForm() {
        this.#form = document.getElementById('new-form');
        this.#form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const title = this.#form.elements.namedItem('title').value.trim();
            const rating = this.#form.elements.namedItem('rating').value.trim();
            const description = this.#form.elements.namedItem('description').value.trim();

            if (!title || !rating || !description || !this.#takenImage || !this.#takenImage.blob) {
                Swal.fire({
                    icon: "warning",
                    title: "Form Belum Lengkap",
                    text: "Pastikan semua kolom termasuk gambar telah diisi!",
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
                photoUrl: this.#takenImage.blob,
                title,
                rating,
                description,
                lat: this.#form.elements.namedItem('lat').value,
                lon: this.#form.elements.namedItem('lon').value,
            };

            await this.#presenter.postNewReviews(data);
        });

        document
            .getElementById('image-input')
            .addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return;

                await this.#addTakenPicture(file);
                await this.#populateTakenPicture();
        });
        
        document
            .getElementById('image-input-button')
            .addEventListener('click', () => {
                this.#form.elements.namedItem('image').click();
        });

        document
            .getElementById('open-image-camera-button')
            .addEventListener('click', async (event) => {
                const cameraContainer = document.getElementById('camera-container');

                this.#isCameraOpen = !this.#isCameraOpen;

                if (this.#isCameraOpen) {
                    cameraContainer.classList.remove('hidden');
                    event.currentTarget.textContent = 'Tutup kamera';
                    this.#setupCamera();
                    await this.#camera.launch();
                } else {
                    cameraContainer.classList.add('hidden');
                    event.currentTarget.textContent = 'Buka kamera';
                    this.#camera.stop();
                }
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

    #setupCamera() {
        if (this.#camera) {
            return;
        }

        this.#camera = new Camera({
            video: document.getElementById('camera-video'),
            cameraSelect: document.getElementById('camera-select'),
            canvas: document.getElementById('camera-canvas'),
        });

        this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
            const image = await this.#camera.takePicture();
            await this.#addTakenPicture(image);
            await this.#populateTakenPicture();
            alert(URL.createObjectURL(image));
        });
    }

    async #addTakenPicture(image) {
        let blob = image;

        if (typeof image === "string") {
        blob = await convertBase64ToBlob(image, "image/png");
        }

        this.#takenImage = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        blob: blob,
        };
    }

    async #populateTakenPicture() {
        if (!this.#takenImage || !this.#takenImage.blob) {
            console.error("Error: Blob tidak tersedia!", this.#takenImage);
            return;
        }

        const imageUrl = URL.createObjectURL(this.#takenImage.blob);

        document.getElementById("image-taken").innerHTML = `
            <li class="relative group">
            <img src="${imageUrl}" alt="image"
                class="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-sm" />

            <button type="button" id="delete-picture-button"
                class="absolute top-2 right-2 bg-white/80 hover:bg-red-500 hover:text-white text-red-600 text-xs font-bold px-2 py-1 rounded-full shadow transition-all duration-150 opacity-0 group-hover:opacity-100">
                ×
            </button>
            </li>
        `;

        document.getElementById("delete-picture-button").addEventListener("click", () => {
            if (confirm("Hapus gambar ini?")) {
            this.#removePicture();
            document.getElementById("image-taken").innerHTML = "";
            }
        });
    }

    #removePicture() {
        this.#takenImage = [];
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
        location.href = '#/home';
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

    showLoadingMap() {
        document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideLoadingMap() {
        document.getElementById('map-loading-container').innerHTML = '';
    }

    showSubmitLoadingButton() {
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

    hideSubmitLoadingButton() {
        const button = this.#form.querySelector('button[type="submit"]');
        button.disabled = false;
        button.innerHTML = `Buat Review!`;
    }
}