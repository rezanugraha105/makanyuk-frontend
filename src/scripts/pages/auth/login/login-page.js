import LoginPresenter from "./login-presenter";
import * as FoodAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";
import Swal from "sweetalert2";

export default class LoginPage {
    #presenter = null;

    async render() {
        return `
        <!-- Login Section -->
        <section class="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h1 class="text-2xl md:text-3xl font-bold text-center text-orange-700 mb-6">
            Masuk ke MakanYuk
            </h1>

            <form id="login-form" class="space-y-5">
            <!-- Username -->
            <div>
                <label for="username-input" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                id="username-input"
                name="username"
                type="text"
                placeholder="Username Anda"
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
                Masuk
                </button>
            </div>

            <!-- Link Register -->
            <p class="text-center text-sm text-gray-600 mt-4">
                Belum punya akun?
                <a href="#/register" class="text-orange-600 hover:underline">Daftar sekarang</a>
            </p>
            </form>
        </div>
        </section>
        `;
    }

    async afterRender() {
        this.#presenter = new LoginPresenter({
            view: this,
            model: FoodAPI,
            authModel: AuthModel,
        });

        this.#setupForm();
    }

    #setupForm() {
        document.getElementById('login-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const data = {
                username: document.getElementById('username-input').value,
                password: document.getElementById('password-input').value,
            };
            await this.#presenter.getLogin(data);
        });
    }

    async loginSuccessfully(message) {
        await Swal.fire({
            position: "center",
            icon: "success",
            title: "Success!",
            text: `${message}`,
            showConfirmButton: false,
            timer: 2000,
        });
        location.hash = '/home';
    }

    loginFailed(message) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Login gagal",
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
            Masuk...
            </button>
        `;
    }

    hideSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
            <button class="btn w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200" type="submit">
                Masuk
            </button>
        `;
    }
}