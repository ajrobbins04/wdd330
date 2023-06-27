import { apiFetch, 
        convertStateAbbr,
        renderListWithTemplate,
        selectRandomImage } from './utils.mjs';

export default async function parkList(selector) {
    const parks = await apiFetch();
    const element = document.querySelector(selector);

    renderListWithTemplate(parkResultTemplate, element, Array.from(parks.data));

    console.log(parks);

   // sortByLocation(parks.data);
  
    // organizes results based on the current sort option
    //const option = document.getElementById('sortOptions');
    //option.addEventListener('change', sortResults);

    //const locationCheckboxes = document.querySelectorAll('.locationBox');
    //locationCheckboxes.forEach((box) => {
        //box.addEventListener('click', includeInSearch);
    //})

    const learnMoreLinks = document.querySelectorAll('[data-id]');
   
    learnMoreLinks.forEach((link) => {
      
        link.addEventListener('click', switchPages);
})
}

function switchPages() {
    const id = this.dataset.id;
    console.log(id);
   
    location.assign('/parkDetails.html?id=${id}');
}

function sortByLocation (parks) {

}

function includeInLocationSort() {
    
}


function parkResultTemplate(data) {
 
    const fullStates = convertStateAbbr(data.states);
    const imageIndex = selectRandomImage(data);
   
    // make sure an image is included before trying to place
    // it in the html
    if (data.images.length > 0) {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="location parkResult-location">Located in ${fullStates}</p>
        <div class="hover overlay">
           <picture>
                <img class="parkResult-img" src="${data.images[imageIndex].url}" alt="${data.images[0].altText}">
            </picture>
            <div class="overlay-description">
                <p class="description parkResult-description">${data.description}</p>
            </div>
        </div>
        <a data-id="${data.id}" class="parkResult-learnMore" href="parkDetails.html">Learn More</a>
        </li>`;
    }

    // for parks without an image
    else {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="location parkResult-location">Located in ${fullStates}</p>
        <p class="parkResult-noImg">[No Image Provided]</p>
        <p class="description parkResult-description">${data.description}</p>
        <a data-id="${data.id}" class="parkResult-learnMore" href="parkDetails.html">Learn More</a>
        </li>`;
    }
}