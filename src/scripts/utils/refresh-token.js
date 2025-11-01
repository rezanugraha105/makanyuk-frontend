import CONFIG from "../config";
import { getRefreshToken, putAccessToken, removeTokens } from "./auth";

export async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${CONFIG.BASE_URL}/authentications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ refreshToken }),
    });

    const result = await response.json();
    if (!response.ok) {
        removeTokens();
        return false;
    }

    putAccessToken(result.data.accessToken);
    return true;
}