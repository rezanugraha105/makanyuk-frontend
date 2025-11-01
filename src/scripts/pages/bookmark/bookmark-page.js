import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';
import {
    generateLoaderAbsoluteTemplate,
    generateReviewsItemTemplate,
    generateReviewsListEmptyTemplate,
    generateReviewsListErrorTemplate,
} from '../../template';

export default class BookmarkPage {
    #presenter = null;

    async render() {
        return `
            <section class="container px-4 py-10 max-w-7xl mx-auto min-h-[60vh] flex flex-col justify-center items-center">
                <h1 class="section-title text-3xl font-bold text-center text-gray-800 mb-10">Bookmark Reviews</h1>

                <div class="reviews-list__container relative w-full">
                    <div id="reviews-list"></div>
                    <div id="reviews-list-loading-container" class="relative inset-0 flex items-center justify-center"></div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new BookmarkPresenter({
            view: this,
            model: Database,
        });

        await this.#presenter.initialGallery();
    }

    populateBookmarkedReviews(message, reviews) {
        if (reviews.length <= 0) {
            this.populateBookmarkedReviewsListEmpty();
            return;
        }

        const html = reviews.reduce((accumulator, review) => {
            return accumulator.concat(
                generateReviewsItemTemplate({
                    ...review,
                    placeName: review.location.placeName,
                    username: review.username,
                }),
            );
        }, '');

        document.getElementById('reviews-list').innerHTML = `
            <div class="reviews-list grid gap-6 grid-cols-1 md:grid-cols-3">${html}</div>
        `
    }

    populateBookmarkedReviewsListEmpty() {
        document.getElementById('reviews-list').innerHTML = generateReviewsListEmptyTemplate();
    }

    populateBookmarkedReviewsError(message) {
        document.getElementById('reviews-list').innerHTML = generateReviewsListErrorTemplate(message);
    }

    showReviewsListLoading() {
        document.getElementById('reviews-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideReviewsListLoading() {
        document.getElementById('reviews-list-loading-container').innerHTML = '';
    }
}