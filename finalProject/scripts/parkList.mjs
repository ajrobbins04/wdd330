import { apiFetch, 
        convertStateAbbr,
        renderListWithTemplate } from './utils.mjs';

export default async function parkList(selector) {
    const parks = await apiFetch();
    const element = document.querySelector(selector);

    renderListWithTemplate(parkResultTemplate, element, Array.from(parks.data));

    console.log(parks);
  
    // organizes results based on the current sort option
    const option = document.getElementById('sortOptions');
    option.addEventListener('change', sortResults);

    const locationCheckboxes = document.querySelectorAll('.locationBox');
    locationCheckboxes.forEach((box) => {
        box.addEventListener('click', includeInSearch);
    })
}

function sortResults () {
    console.log(data);
 
}


function includeInSearch() {
    
}
function sortByLocation(data) {

}

function parkResultTemplate(data) {
 
    const fullStates = convertStateAbbr(data.states);
   
    console.log(fullStates);
    
    // make sure an image is included before trying to place
    // it in the html
    if (data.images.length > 0) {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="location parkResult-location">Located in ${fullStates}</p>
        <div class="hover overlay">
           <picture>
                <img class="parkResult-img" src="${data.images[0].url}" alt="${data.images[0].altText}">
            </picture>
            <div class="overlay-description">
                <p class="description parkResult-description">${data.description}</p>
            </div>
        </div>
        <a class="parkResult-learnMore" href="parkDetails.html">Learn More</a>
        </li>`;
    }

    // for parks without an image
    else {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="location parkResult-location">Located in ${fullStates}</p>
        <p class="parkResult-noImg">[No Image Provided]</p>
        <p class="description parkResult-description">${data.description}</p>
        <a class="parkResult-learnMore" href="parkDetails.html">Learn More</a>
        </li>`;
    }
}