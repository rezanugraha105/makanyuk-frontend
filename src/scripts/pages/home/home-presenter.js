import { reviewMapper } from "../../data/api-mapper";

export default class HomePresenter {
    #view;
    #model;
    #allReviews = [];

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async initialReviews() {
        this.#view.showLoading();
        try {
            const response = await this.#model.getAllReviews();

            if (!response.ok) {
                console.error("initialResponse: response: ", response);
                this.#view.populateReviewsListError(response.message);
                return;
            }

            const reviews = await Promise.all(
                response.data.reviews.map((review) => reviewMapper(review))
            );

            this.#allReviews = reviews;
            this.#view.populateReviewsList(response.message, reviews);

            this.#view.bindFilterHandler(this.handleFilter.bind(this));
        } catch (error) {
            console.error("initialReviews error: ", error);
            this.#view.populateReviewsListError("Gagal memuat data");
        } finally {
            this.#view.hideLoading();
        }
    }

    handleFilter(selectedFilter) {
    let sorted = [];

    switch (selectedFilter) {
      case "rating-high":
        sorted = this.#selectionSort(this.#allReviews, "rating", "desc");
        break;
      case "rating-low":
        sorted = this.#selectionSort(this.#allReviews, "rating", "asc");
        break;
      case "date-new":
        sorted = this.#selectionSort(this.#allReviews, "createdAt", "desc");
        break;
      case "date-old":
        sorted = this.#selectionSort(this.#allReviews, "createdAt", "asc");
        break;
      default:
        sorted = [...this.#allReviews];
    }

        this.#view.populateReviewsList("filtered", sorted);
    }

     #selectionSort(data, key, order = "asc") {
        const arr = [...data];

        for (let i = 0; i < arr.length - 1; i++) {
        let idx = i;

        for (let j = i + 1; j < arr.length; j++) {
            const a = arr[j][key];
            const b = arr[idx][key];

            const valA = key === 'createdAt' ? new Date(a).getTime() : a;
            const valB = key === 'createdAt' ? new Date(b).getTime() : b;

            const condition = order === 'asc' ? valA < valB : valA > valB;
            if (condition) idx = j;
        }

        if (idx !== i) {
            [arr[i], arr[idx]] = [arr[idx], arr[i]];
        }
        }

        return arr;
    }
}