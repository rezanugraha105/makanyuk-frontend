export default class myReviewUpdatePresenter {
    #reviewId;
    #view;
    #apiModel;
    
    constructor(reviewId, { view, apiModel }) {
        this.#reviewId = reviewId;
        this.#view = view;
        this.#apiModel = apiModel;
    }

    async showReviewUpdateMap() {
        this.#view.showMapLoading();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showDetailMap error: ', error);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async showReviewUpdate() {
        try {
            const response = await this.#apiModel.getUpdateReviewsById(this.#reviewId);
            if (!response.ok) {
                    console.error('showReviewUpdate: response: ', response);
                    return;
            }
    
            const review = await response.data.review;
                
            this.#view.populateReviewUpdateAndInitialMap(response.message, review);
        } catch (error) {
            console.error('showReviewUpdateAndMapError: ', error);
        } finally {
        }
    }

    async updateReviewById({ title, rating, description, lat, lon }, id) {
        this.#view.showUpdateLoadingButton();

        const idReview = this.#reviewId;
        try {
            const data = {
                title: title,
                rating: rating,
                description: description,
                latitude: lat,
                longitude: lon,
                idReview: id,
            };

            const response = await this.#apiModel.updateReviewById(idReview, data);

            if (!response.ok) {
                console.error('updateReview error: ', response);
                this.#view.storeFailed(response.message);
                return;
            }

            this.#view.storeSuccessfully(response.message, response);
        } catch (error) {
            console.error('updateReview error : ', error);
            this.#view.storeFailed(error.message);
        } finally {
            this.#view.hideUpdateLoadingButton();
        }
    }
}