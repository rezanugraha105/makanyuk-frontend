import { getActiveRoute } from "../routes/url-parser";
import CONFIG from "../config";

export function getAccessToken() {
    try {
        const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);

        if (accessToken === 'null' || accessToken === 'undefined') {
            return null;
        }
        return accessToken;
    } catch (error) {
        console.error('getAccessToken: error: ', error);
        return null;
    }
}

export function getRefreshToken() {
    try {
        const refreshToken = localStorage.getItem(CONFIG.REFRESH_TOKEN_KEY);

        if (refreshToken === 'null' || refreshToken === 'undefined') {
            return null;
        }
        return refreshToken;
    } catch (error) {
        console('getRefreshToken: error:', error);
        return null;
    }
}

export function putAccessToken(token) {
    try {
        localStorage.setItem(CONFIG.ACCESS_TOKEN_KEY, token);
        return true;
    } catch (error) {
        console.error('putAccessToken: error: ', error);
        return false;
    }
}

export function putRefreshToken(token) {
    try {
        localStorage.setItem(CONFIG.REFRESH_TOKEN_KEY, token);
        return true;
    } catch (error) {
        console.error('putRefreshToken: error: ', error);
        return false;
    }
}

export function removeTokens() {
    try {
        localStorage.removeItem(CONFIG.ACCESS_TOKEN_KEY);
        localStorage.removeItem(CONFIG.REFRESH_TOKEN_KEY);
        return true;
    } catch (error) {
        console.error('getLogout: error: ', error);
        return false;
    }
}

const unauthenticatedRoutesOnly = ['/login', '/register'];

export function checkUnauthenticatedRouteOnly(page) {
    const url = getActiveRoute();
    const isLogin = !!getAccessToken();

    if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
        location.hash = '/';
        return null;
    }
    return page;
}

export function checkAuthenticatedRoute(page) {
    const isLogin = !!getAccessToken();

    if (!isLogin) {
        location.hash = '/login';
        return null;
    }

    return page;
}

export function getLogout() {
    removeTokens();
}