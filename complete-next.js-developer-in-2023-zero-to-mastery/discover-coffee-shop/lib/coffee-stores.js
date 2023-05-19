// UNSPLASH
import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
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

export async function getCoffeeStores(
  latLong = "43.653833032607096%2C-79.37896808855945"
) {
  const photos = await getPhotos();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee", 6),
    options
  );
  const { results } = await response.json();
  const coffeeStores = results;

  return coffeeStores.map((result, idx) => {
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.address || "",
      cross_street: result.location.cross_street || "",
      imgUrl: photos.length > 0 ? photos[idx] : null,
    };
  });
}
