import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { generateAuthenticatedNavigationListTemplate, generateUnauthenticatedNavigationListTemplate  } from '../template';
import { getAccessToken, getLogout } from '../utils/auth';
import { transitionHelper } from '../utils';
import Swal from 'sweetalert2';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

_setupDrawer() {
  this.#drawerButton.addEventListener('click', () => {
    this.#navigationDrawer.classList.toggle('hidden');
  });

  document.body.addEventListener('click', (event) => {
    const isClickInsideDrawer = this.#navigationDrawer.contains(event.target);
    const isClickOnButton = this.#drawerButton.contains(event.target);

    if (!isClickInsideDrawer && !isClickOnButton) {
      this.#navigationDrawer.classList.add('hidden');
    }

    this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
      if (link.contains(event.target)) {
        this.#navigationDrawer.classList.add('hidden');
      }
    });
  });
}

#setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navList = this.#navigationDrawer.querySelector('#nav-list');
    const navDesktop = document.getElementById('nav-desktop-list');
    const logoLink = document.getElementById('logo-link');

    if (!isLogin) {
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      navDesktop.innerHTML = generateUnauthenticatedNavigationListTemplate();
      logoLink.setAttribute('href', '#/');
      return;
    }

    navList.innerHTML = generateAuthenticatedNavigationListTemplate();
    navDesktop.innerHTML = generateAuthenticatedNavigationListTemplate();
    logoLink.setAttribute('href', '#/home');

    const logoutButtons = document.querySelectorAll('.logout-button');
    logoutButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();

        const logoutModal = await Swal.fire({
          icon: "question",
          title: "Apakah Anda yakin ingin keluar?",
          showCancelButton: true,
          confirmButtonText: "Ya, Keluar",
          cancelButtonText: "Batal",
          customClass: {
            confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
            cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600',
          },
        });

        if (logoutModal.isConfirmed) {
          getLogout();
          await Swal.fire({
            icon: "success",
            title: "Berhasil keluar",
            showConfirmButton: false,
            timer: 2000,
          });
          location.hash = '/login';
        }
      });
    });

    const reviewMenuButtons = document.querySelectorAll('#review-menu-button');
    reviewMenuButtons.forEach((reviewMenuButton) => {
      const submenu = reviewMenuButton.nextElementSibling;
      if (submenu) {
        reviewMenuButton.addEventListener('click', (e) => {
          if (window.innerWidth < 768) {
            e.preventDefault();
            submenu.classList.toggle('hidden');
          }
        });
      }
    });

    const reviewMenuItems = document.querySelectorAll('li.relative');
    reviewMenuItems.forEach(item => {
      const submenu = item.querySelector('.submenu');
      let hideTimeout;

      item.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        if (window.innerWidth >= 768) {
          submenu?.classList.remove('hidden');
        }
      });

      item.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 768) {
          hideTimeout = setTimeout(() => {
            submenu?.classList.add('hidden');
          }, 300);
        }
      });
    });
}

    async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];
    const page = route();

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        page.afterRender();
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();
    });
  }
}

export default App;
