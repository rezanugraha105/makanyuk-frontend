import { reviewMapper } from "../../data/api-mapper";

export default class DetailPresenter {
    #reviewId;
    #view;
    #apiModel;
    #dbModel;

    constructor(reviewId, {view, apiModel, dbModel }) {
        this.#reviewId = reviewId;
        this.#view = view;
        this.#apiModel = apiModel;
        this.#dbModel = dbModel;
    }

    async showReviewDetailMap() {
        this.#view.showMapLoading();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showDetailMap error: ', error);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async showReviewDetail() {
        this.#view.showReviewDetailLoading();
        try {
            const response = await this.#apiModel.getDetailReviewsById(this.#reviewId);
            console.log('Review ID from URL:', this.#reviewId);

            if (!response.ok) {
                console.error('showReviewDetail: response: ', response);
                this.#view.populateReviewDetailError(response.message);
                return;
            }

            const review = await reviewMapper(response.data.review);
            
            this.#view.populateReviewDetailAndInitialMap(response.message, review);
        } catch (error) {
            console.error('showReviewDetailAndMapError: ', error);
            this.#view.populateReviewDetailError(error.message);
        } finally {
            this.#view.hideReviewDetailLoading();
        }
    }

    async saveReview() {
        try {
            const review = await this.#apiModel.getDetailReviewsById(this.#reviewId);
            await this.#dbModel.putReview(review.data.review);

            this.#view.saveToBookmarkSuccessfully('Berhasil menyimpan ke Bookmark');
        } catch (error) {
            console.error('saveReview: error: ', error);
            this.#view.saveToBookmarkFailed(error.message);
        }
    }

    async removeReview() {
        try {
            await this.#dbModel.removeReview(this.#reviewId);

            this.#view.removeFromBookmarkSuccessfully('Berhasil menghapus dari bookmark');
        } catch (error) {
            console.error('removeReview: error: ', error);
            this.#view.removeFromBookmarkFailed(error.message);
        }
    }

    async showSaveButton() {
        if (await this.#isReviewSaved()) {
            this.#view.renderRemoveButton();
            return;
        }

        this.#view.renderSaveButton();
    }

    async #isReviewSaved() {
        return !!(await this.#dbModel.getReviewById(this.#reviewId));
    }
}