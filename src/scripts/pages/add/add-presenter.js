export default class AddPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async showNewFormMap() {
        this.#view.showLoadingMap();
        try {
            await this.#view.initialMap();  
        } catch (error) {
            console.error('showNewFormMap: error: ', error);
        } finally {
            this.#view.hideLoadingMap();
        }
    }

    async postNewReviews({ photoUrl, title, rating, description, lat, lon }) {
        this.#view.showSubmitLoadingButton();
        try {
            const data = {
                photoUrl: photoUrl,
                title: title,
                rating: rating,
                description: description,
                latitude: lat,
                longitude: lon,
            };

            const response = await this.#model.addReviews(data);

            if (!response.ok) {
                console.error('postReview error : ', response);
                this.#view.storeFailed(response.message);
                return;
            }

            this.#view.storeSuccessfully(response.message, response.data.newReview);
        } catch (error) {
            console.error('postReview error : ', error);
            this.#view.storeFailed(error.message);
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }

}