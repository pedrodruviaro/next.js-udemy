// UNSPLASH
import { createApi } from "unsplash-js";

const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

async function getPhotos() {
    const photos = await unsplash.search.getPhotos({
        query: "coffee-shop",
        perPage: 30,
    });

    const photosResults = photos.response.results;

    return photosResults.map((result) => result.urls["small"]);
}

function getUrlForCoffeeStores(latLong, query, limit) {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
}

export async function getCoffeeStores() {
    const photos = await getPhotos();

    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: process.env.FOURSQUARE_API_KEY,
        },
    };

    const response = await fetch(
        getUrlForCoffeeStores(
            "43.653833032607096%2C-79.37896808855945",
            "coffee",
            6
        ),
        options
    );
    const { results } = await response.json();
    const coffeeStores = results;

    return coffeeStores.map((result) => {
        return {
            ...result,
            imgUrl: photos[0],
        };
    });
}
