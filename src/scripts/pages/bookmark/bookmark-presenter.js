import { reviewMapper } from "../../data/api-mapper";

export default class BookmarkPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async initialGallery() {
        this.#view.showReviewsListLoading();

        try {
            const listOfReviews = await this.#model.getAllReviews();
            const reviews = await Promise.all(listOfReviews.map(reviewMapper));

            const message = 'Berhasil mendapatkan daftar laporan tersimpan.';
            this.#view.populateBookmarkedReviews(message, reviews);
        } catch (error) {
            console.error('initialGallery : error: ', error);
            this.#view.populateBookmarkedReviewsError(error.message);
        } finally {
            this.#view.hideReviewsListLoading();
        }
    }
}