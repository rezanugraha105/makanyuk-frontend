import HomePresenter from "./home-presenter";
import * as FoodAPI from "../../data/api";
import {
  generateLoaderAbsoluteTemplate,
  generateReviewsItemTemplate,
  generateReviewsListEmptyTemplate,
  generateReviewsListErrorTemplate
} from "../../template";

export default class HomePage {
  #presenter;
  #allReviews = [];

  async render() {
    return `
      <section class="container px-4 py-10 max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-center text-orange-700 mb-4">List Reviews</h1>

        <!-- Filter -->
        <div class="flex justify-end mb-6">
          <select id="filter-select" class="border border-orange-300 text-sm px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option value="date-new" selected>Paling Baru</option>
            <option value="date-old">Paling Lama</option>
            <option value="rating-high">Rating Tertinggi</option>
            <option value="rating-low">Rating Terendah</option>
          </select>
        </div>

        <div class="reviews-list__container relative">
          <div id="reviews-list"></div>
          <div id="reviews-list-loading-container" class="relative inset-0 flex items-center justify-center"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: FoodAPI,
    });

    await this.#presenter.initialReviews();

    this.#presenter.handleFilter('date-new', this.#allReviews);

    this.bindFilterHandler((selectedValue) => {
      this.#presenter.handleFilter(selectedValue, this.#allReviews);
    });
  }

    populateReviewsList(message, listReviews) {
      this.#allReviews = listReviews;

      if (listReviews.length <= 0) {
        this.populateReviewsListEmpty();
        return;
      }

      const html = listReviews.reduce((acc, review) => {
        return acc.concat(
          generateReviewsItemTemplate({
            id: review.id,
            username: review.username,
            title: review.title,
            rating: review.rating,
            description: review.description,
            photoUrl: review.photoUrl,
            createdAt: review.createdAt,
            location: review.location,
          })
        );
      }, '');

      document.getElementById('reviews-list').innerHTML = `
        <div class="reviews-list grid gap-6 grid-cols-1 md:grid-cols-3">${html}</div>
      `;
  }

  bindFilterHandler(callback) {
    const filterSelect = document.getElementById('filter-select');
    if (!filterSelect) return;

    filterSelect.addEventListener('change', (event) => {
      callback(event.target.value);
    });
  }

  populateReviewsListEmpty() {
    document.getElementById('reviews-list').innerHTML = generateReviewsListEmptyTemplate();
  }

    populateReviewsListError(message) {
      document.getElementById('reviews-list').innerHTML = generateReviewsListErrorTemplate(message);
    }

  showLoading() {
    document.getElementById('reviews-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('reviews-list-loading-container').innerHTML = '';
  }
}
