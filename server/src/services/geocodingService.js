const reverseGeocode = async (latitude, longitude) => {
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEOAPIFY_API_KEY is not configured"
        );
    }

    const url =
        `https://api.geoapify.com/v1/geocode/reverse` +
        `?lat=${encodeURIComponent(latitude)}` +
        `&lon=${encodeURIComponent(longitude)}` +
        `&apiKey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);

    if (!response.ok) {
        const text = await response.text();

        throw new Error(
            `Geoapify reverse geocoding failed: ${response.status} ${text}`
        );
    }

    const data = await response.json();

    const properties =
        data.features?.[0]?.properties;

    if (!properties) {
        throw new Error(
            "No address found for these coordinates"
        );
    }

    return {
        address:
            properties.formatted || "",

        city:
            properties.city ||
            properties.town ||
            properties.village ||
            properties.municipality ||
            "",

        state:
            properties.state || "",

        country:
            properties.country || "",

        postcode:
            properties.postcode || ""
    };
};

export default reverseGeocode;