import { findByParkCode } from "./utils.mjs";

let park = {};

export default async function parkDetails(parkCode) {

    park = await findByParkCode(parkCode);
    console.log(park);
    console.log(park.data[0].fullName);
    renderParkDetails(park);

}

function renderParkDetails(park) {
 
    document.getElementById('parkDetails-name').textContent = park.data[0].fullName;
    const description = document.getElementById('parkDetails-description');
    const location = document.getElementById('parkDetails-location');
}