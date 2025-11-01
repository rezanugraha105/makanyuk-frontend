import DetailPresenter from "./detail-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import * as FoodAPI from "../../data/api";
import Database from "../../data/database";
import{
    generateLoaderAbsoluteTemplate,
    generateReviewsDetailTemplate,
    generateReviewsDetailErrorTemplate,
    generateSaveReviewButtonTemplate,
    generateRemoveReviewButtonTemplate,
} from "../../template";
import Map from "../../utils/map";
import Swal from "sweetalert2";

export default class DetailPage {
    #presenter = null;
    #map = null;

    async render() {
        return `
            <section class="min-h-screen bg-white pt-12">
            <div id="reviews-detail" class="relative"></div>
            <div id="reviews-detail-loading-container" class="flex justify-center items-center mt-10"></div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new DetailPresenter(parseActivePathname().id, {
            view: this,
            apiModel: FoodAPI,
            dbModel: Database,
        });

        this.#presenter.showReviewDetail();
    }

    async populateReviewDetailAndInitialMap(message, review) {
        document.getElementById('reviews-detail').innerHTML = generateReviewsDetailTemplate({
            username: review.username,
            title: review.title,
            rating: review.rating,
            description: review.description,
            photoUrl: review.photoUrl,
            createdAt: review.createdAt,
            location: review.location,
        });

        if (review.location.latitude !== null && review.location.longitude !== null) {
            try {
                await this.#presenter.showReviewDetailMap();

                if (this.#map) {
                    const coordinate = [review.location.latitude, review.location.longitude];
                    const markerOptions = { alt: review.description };
                    const popupOptions = { content: review.description };

                    this.#map.changeCamera(coordinate);
                    this.#map.addMarker(coordinate, markerOptions, popupOptions);
                }
            } catch (error) {
                console.error("Ada kesalahan saat memuat peta: ", error);
            }
        } else {
            console.log("Ada kesalahan saat mengambil lokasi: ", message);
        }
        this.#presenter.showSaveButton();
    }

    populateReviewDetailError(message) {
        document.getElementById('reviews-detail').innerHTML = generateReviewsDetailErrorTemplate(message);
    }

    async initialMap() {
        console.log("Memulai Peta...");
        this.#map = await Map.build('#map', {
            zoom: 15,
        });
        console.log("Peta berhasil dibuat: ", this.#map);
    }

    async renderSaveButton() {
        document.getElementById('save-actions-container').innerHTML = generateSaveReviewButtonTemplate();

        document.getElementById('review-detail-save').addEventListener('click', async () => {
            await this.#presenter.saveReview();
            await this.#presenter.showSaveButton();
        });
    }

    async renderRemoveButton() {
        document.getElementById('save-actions-container').innerHTML = generateRemoveReviewButtonTemplate();

        document.getElementById('review-detail-remove').addEventListener('click', async () => {
            await this.#presenter.removeReview();
            await this.#presenter.showSaveButton();
        });
    }

    saveToBookmarkSuccessfully(message) {
        Swal.mixin({
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: 'success',
            title: 'Bookmark Review',
            text: `${message}`,
        });
    }

    saveToBookmarkFailed(message) {
        Swal.mixin({
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: 'error',
            title: 'Bookmark Review',
            text: `${message}`,
        });
    }

    removeFromBookmarkSuccessfully(message) {
        Swal.mixin({
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: 'warning',
            title: 'Bookmark Review',
            text: `${message}`,
        });
    }

    removeFromBookmarkFailed(message) {
        Swal.mixin({
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: 'error',
            title: 'Bookmark Review',
            text: `${message}`,
        });
    }

    showReviewDetailLoading() {
        document.getElementById('reviews-detail-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideReviewDetailLoading() {
        document.getElementById('reviews-detail-loading-container').innerHTML = '';
    }

    showMapLoading() {
        document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideMapLoading() {
        document.getElementById('map-loading-container').innerHTML = '';
    }

}