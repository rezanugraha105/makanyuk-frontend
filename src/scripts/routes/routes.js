import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import DetailPage from '../pages/detail/detail-page';
import AddPage from '../pages/add/add-page';

import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import LandingPage from '../pages/landing/landing-page';
import myReviewsPage from '../pages/my-reviews/my-reviews-page';
import myReviewUpdatePage from '../pages/my-reviews/my-reviews-update-page';

const routes = {
  //NoAuth
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/': () => checkUnauthenticatedRouteOnly(new LandingPage()),

  //Auth
  '/home': () => checkAuthenticatedRoute(new HomePage()),
  '/reviews/:id': () => checkAuthenticatedRoute(new DetailPage()),
  '/add': () => checkAuthenticatedRoute(new AddPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
  '/my-reviews': () => checkAuthenticatedRoute(new myReviewsPage()),
  '/my-reviews-update/:id': () => checkAuthenticatedRoute(new myReviewUpdatePage()),
};

export default routes;
