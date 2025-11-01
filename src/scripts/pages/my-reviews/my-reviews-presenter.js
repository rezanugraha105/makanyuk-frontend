import { reviewMapper } from "../../data/api-mapper";

export default class myReviewsPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async initialMyReviews() {
        this.#view.showMyReviewsListLoading();

        try {
            const response = await this.#model.getMyReviews();

            if (!response.ok) {
                console.error('initialMyReviews: error: ', response);
                this.#view.populateMyReviewsError(response.message);
                return;
            }

            const myReviews = await Promise.all(
                response.data.reviews.map((review) => reviewMapper(review))
            );

            this.#view.populateMyReviews(response.message, myReviews);
        } catch (error) {
            console.error('initialMyReviews: error: ', error);
            this.#view.populateMyReviewsError(error.message);
        } finally {
            this.#view.hideMyReviewsListLoading()
        }
    }

    async deleteReview(id) {
        this.#view.showMyReviewsListLoading();

        try {
            const response = await this.#model.deleteReviewById(id);

            if (!response.ok) {
                console.error('deleteMyReviews: error: ', response);
                this.#view.populateMyReviewsError(response.message);
                return;
            }
            
            this.#view.populateMyReviewsSuccess("Review Berhasil Dihapus!");
            await this.initialMyReviews();
        } catch (error) {
            console.error('deleteMyReview: error: ', error);
            this.#view.populateMyReviewsError(error.message);
        } finally {
            this.#view.hideMyReviewsListLoading();
        }
    }
}