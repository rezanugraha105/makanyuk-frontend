import myReviewsPresenter from "./my-reviews-presenter";
import {
    generateLoaderAbsoluteTemplate,
    generateReviewsListEmptyTemplate,
    generateReviewsListErrorTemplate,
    generateMyReviewsItemTemplate,
} from '../../template';
import * as FoodAPI from '../../data/api'
import Swal from "sweetalert2";

export default class myReviewsPage {
    #presenter = null;
    
    async render() {
        return `
            <section class="container px-4 py-10 max-w-7xl mx-auto min-h-[60vh] flex flex-col justify-center items-center">
                <h1 class="section-title text-3xl font-bold text-center text-gray-800 mb-10">My Reviews</h1>

                <div class="reviews-list__container relative w-full">
                    <div id="reviews-list"></div>
                    <div id="reviews-list-loading-container" class="relative inset-0 flex items-center justify-center"></div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new myReviewsPresenter({
            view: this,
            model: FoodAPI,
        });
        await this.#presenter.initialMyReviews();

        document.getElementById('reviews-list').addEventListener('click', async (event) => {
            const deleteButton = event.target.closest('.delete-review-button');
            
            if (!deleteButton) return;

            const deleteModal = await Swal.fire({
                icon: "question",
                title: "Apakah Anda yakin ingin menghapus review ini?",
                showCancelButton: true,
                confirmButtonText: "Ya, hapus",
                cancelButtonText: "Batal",
                customClass: {
                    confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
                    cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600',
                },
            });
            if (deleteModal.isConfirmed) {
                const reviewId = deleteButton.dataset.reviewId;
                this.#presenter.deleteReview(reviewId);
            }
        });
    }

    populateMyReviews(message, reviews) {
        if (reviews.length <= 0) {
            this.populateMyReviewsListEmpty();
            return;
        }

        const html = reviews.reduce((accumulator, review) => {
            return accumulator.concat(
                generateMyReviewsItemTemplate({
                    ...review,
                    placeName: review.location.placeName,
                    username: review.username,
                }),
            );
        }, '');

        document.getElementById('reviews-list').innerHTML = `
            <div class="reviews-list grid gap-6 grid-cols-1 md:grid-cols-3">${html}</div>
        `;
    }

    async populateMyReviewsSuccess(message) {
        await Swal.fire({
            icon: "success",
            title: message || "Berhasil dihapus",
            showConfirmButton: false,
            timer: 2000,
        });
    }

    populateMyReviewsListEmpty() {
        document.getElementById('reviews-list').innerHTML = generateReviewsListEmptyTemplate();
    }

    populateMyReviewsError(message) {
        document.getElementById('reviews-list').innerHTML = generateReviewsListErrorTemplate(message);
    }

    showMyReviewsListLoading() {
        document.getElementById('reviews-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideMyReviewsListLoading() {
        document.getElementById('reviews-list-loading-container').innerHTML = '';
    }
}