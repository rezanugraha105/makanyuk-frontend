import RegisterPresenter from "./register-presenter";
import * as FoodAPI from "../../../data/api";
import Swal from "sweetalert2";

export default class RegisterPage {
    #presenter = null;

  async render() {
    return `
        <section class="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h1 class="text-2xl md:text-3xl font-bold text-center text-orange-700 mb-6">
            Daftar Akun
            </h1>

            <form id="register-form" class="space-y-5">
            <!-- Nama Lengkap -->
            <div>
                <label for="name-input" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                id="name-input"
                name="name"
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                required
                class="w-full border border-orange-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
            </div>

            <!-- Username -->
            <div>
                <label for="username-input" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                id="username-input"
                name="username"
                type="text"
                placeholder="Masukkan username Anda"
                required
                class="w-full border border-orange-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
            </div>

            <!-- Password -->
            <div>
                <label for="password-input" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                id="password-input"
                name="password"
                type="password"
                placeholder="Masukkan password Anda"
                required
                class="w-full border border-orange-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
            </div>

            <!-- Tombol Submit -->
            <div id="submit-button-container">
                <button
                type="submit"
                class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                Daftar Akun
                </button>
            </div>

            <!-- Link ke Login -->
            <p class="text-center text-sm text-gray-600 mt-4">
                Sudah punya akun?
                <a href="#/login" class="text-orange-600 hover:underline">Masuk</a>
            </p>
            </form>
        </div>
        </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
        view: this,
        model: FoodAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('register-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const data = {
            name: document.getElementById('name-input').value,
            username: document.getElementById('username-input').value,
            password: document.getElementById('password-input').value,
        };
        await this.#presenter.getRegister(data);
    });
  }

  async registerSuccessfully(message) {
    await Swal.fire({
        position: "center",
        icon: "success",
        title: "Akun berhasil dibuat!",
        text: `${message}`,
        showConfirmButton: false,
        timer: 2000,
    });
    location.hash = '/login';
  }

  registerFailed(message) {
    Swal.fire({
        position: "center",
        icon: "error",
        title: "Terjadi kesalahan",
        text: `${message}`,
        showConfirmButton: false,
        timer: 2500,
    });
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
            <button class="btn flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold py-2 px-4 rounded-md w-full cursor-not-allowed" disabled>
            <svg class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Mendaftar...
            </button>
        `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
            <button class="btn w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200" type="submit">
            Daftar Akun
            </button>
        `;
  }
}
