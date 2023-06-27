import { findParkById } from "./utils.mjs";

let park = {};

export default async function parkDetails(parkId) {

    park = await findParkById(parkId);
    console.log(park);

}

function renderParkDetails() {
 
    document.getElementById('parkDetails-name').textContent = park.name;
    const description = document.getElementById('parkDetails-description');
    const location = document.getElementById('parkDetails-location');
}