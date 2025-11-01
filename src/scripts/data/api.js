import Swal from 'sweetalert2';
import CONFIG from '../config';
import { getAccessToken, getRefreshToken, removeTokens } from '../utils/auth';
import { refreshAccessToken } from '../utils/refresh-token';

const ENDPOINTS = {
  //Auth
  LOGIN: `${CONFIG.BASE_URL}/authentications`,
  REGISTER: `${CONFIG.BASE_URL}/users`,

  //Reviews
  ALL_REVIEWS: `${CONFIG.BASE_URL}/reviews`,
  DETAIL_REVIEWS: (id) => `${CONFIG.BASE_URL}/reviews/${id}`,
  ADD_REVIEWS: `${CONFIG.BASE_URL}/reviews`,
  MY_REVIEWS: `${CONFIG.BASE_URL}/reviews/my-reviews`,
  DELETE_REVIEW: (id) => `${CONFIG.BASE_URL}/reviews/${id}`,
  GET_UPDATE_REVIEWBYID: (id) => `${CONFIG.BASE_URL}/my-reviews-update/${id}`,
  UPDATE_REVIEWBYID: (id) => `${CONFIG.BASE_URL}/reviews/${id}`,
};

async function fetchWithAuthRetry(url, options = {}, retry = true) {
  const accessToken = getAccessToken();
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return fetchWithAuthRetry(url, options, false);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Sesi Anda telah habis",
        text: "Silahkan login kembali",
        confirmButtonText: "Logout",
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
        }
      }).then(() => {
        removeTokens();
        window.location.hash = '/login';
      });
    }
  }

  return response;
}

export async function getRegister({ name, username, password }) {
  const data = JSON.stringify({ name, username, password });

  const fetchResponse = await fetchWithAuthRetry(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ username, password }) {
  const data = JSON.stringify({ username, password });

  const fetchResponse = await fetchWithAuthRetry(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllReviews() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetchWithAuthRetry(ENDPOINTS.ALL_REVIEWS, {
    headers: { Authorization: `Bearer ${accessToken}`},
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getDetailReviewsById(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetchWithAuthRetry(ENDPOINTS.DETAIL_REVIEWS(id), {
    headers: { Authorization: `Bearer ${accessToken}`},
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function addReviews({
  title,
  rating,
  description,
  photoUrl,
  latitude,
  longitude
}) {
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.append('photoUrl', photoUrl);
  formData.set('title', title);
  formData.set('rating', rating);
  formData.set('description', description);
  formData.set('lat', latitude);
  formData.set('lon', longitude);

  const fetchResponse = await fetchWithAuthRetry(ENDPOINTS.ADD_REVIEWS, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`},
    body: formData,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}

export async function getMyReviews() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetchWithAuthRetry(ENDPOINTS.MY_REVIEWS, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}`},
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}

export async function getUpdateReviewsById(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetchWithAuthRetry(ENDPOINTS.GET_UPDATE_REVIEWBYID(id), {
    headers: { Authorization: `Bearer ${accessToken}`},
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function updateReviewById(id, {
  title,
  rating,
  description,
  latitude,
  longitude
}) {
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.set('title', title);
  formData.set('rating', rating);
  formData.set('description', description);
  formData.set('lat', latitude);
  formData.set('lon', longitude);

  const fetchResponse = await fetchWithAuthRetry(ENDPOINTS.UPDATE_REVIEWBYID(id), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`},
    body: formData,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}

export async function deleteReviewById(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetchWithAuthRetry(ENDPOINTS.DELETE_REVIEW(id), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}`},
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}