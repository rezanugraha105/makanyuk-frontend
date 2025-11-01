import Map from "../utils/map";

export async function reviewMapper(review) {
    const lat = review.lat ?? null;
    const lon = review.lon ?? null;

    let placeName = "Lokasi tidak ada";
    if (lat !== null && lon !== null) {
        placeName = await Map.getPlaceNameByCoordinate(lat, lon);
    }

    return {
        ...review,
        location: {
            latitude: lat,
            longitude: lon,
            placeName: placeName,
        }
    }
}