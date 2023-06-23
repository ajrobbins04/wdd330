import { apiFetch, 
        convertStateAbbr,
        renderListWithTemplate } from './utils.mjs';

export default async function parkList(selector) {
    const parks = await apiFetch();
 

    const element = document.querySelector(selector);

    renderListWithTemplate(parkResultTemplate, element, Array.from(parks.data));
    console.log(parks);
}

// returns array of park names from A - Z
/*function getNameList(parks) {

    let names = [];
    for (let i = 0; i < parks.limit; i++) {
        names.push(parks.data[i].fullName);
    }
    return names;
}

// returns array of park images
function getImagesList(parks) {
    let images = [];
    for (let i = 0; i < parks.limit; i++) {
        images.push(parks.data[i].images[0]);
    }
    return images;
}

function getLocation(parks) {

}*/

/*function parkResultTemplate(parks) {
    return `<li class="park-result">
    <div class="park-result-img">
        <img src="${parks.data.images[0].url}" alt="${parks.data.images[0].altText}">
    </div>
    <p class="park-result-name">${parks.data.fullName}</p>
    <p class="park-result-state">${parks.data.states}</p>`;
}*/


function parkResultTemplate(data) {
 
    const fullStates = convertStateAbbr(data.states);
   
    console.log(fullStates);
  
    // make sure an image is included before trying to place
    // it in the html
    if (data.images.length > 0) {
        return `<li class="park-result">
        <div class="park-result-img">
            <img src="${data.images[0].url}" alt="${data.images[0].altText}">
        </div>
        <p class="park-result-name">${data.fullName}</p>
        <p class="park-result-state">${fullStates}</p>`;
    }
    else {
        return `<li class="park-result">
        <p class="park-result-noImg">[No Image Provided]</p>
        <p class="park-result-name">${data.fullName}</p>
        <p class="park-result-state">${fullStates}</p>`;
    }
}