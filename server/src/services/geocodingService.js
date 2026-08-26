const reverseGeocode = async (latitude, longitude) => {
    const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?lat=${latitude}` +
        `&lon=${longitude}` +
        `&format=json` +
        `&addressdetails=1`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Sankalp-CivicPlatform/1.0"
        }
    });

    if (!response.ok) {
        throw new Error(
            `Reverse geocoding failed: ${response.status}`
        );
    }

    const data = await response.json();

    const address = data.address || {};

    return {
        address: data.display_name || "",
        city:
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "",
        state: address.state || "",
        country: address.country || ""
    };
};

export default reverseGeocode;