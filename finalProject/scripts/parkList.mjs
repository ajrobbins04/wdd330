import { convertStateAbbr,
         renderListWithTemplate,
         selectRandomImage,
         locations } from './utils.mjs';
import { apiFetch,
         findByStateCode } from './externalServices.mjs';

export default async function parkList(selector) {

    const parks = await apiFetch();
    const element = document.querySelector(selector);

    renderListWithTemplate(parkResultTemplate, element, Array.from(parks.data));

    console.log(parks);
  
    // organizes results based on the current sort option
    const option = document.getElementById('sortOptions');
    option.addEventListener('change', sortResults);

    //const locationCheckboxes = document.querySelectorAll('.locationBox');
    //locationCheckboxes.forEach((box) => {
        //box.addEventListener('click', includeInSearch);
    //})

}

function sortResults(element) {

    if (this.value === 'location') {
        const filterOptions = document.getElementById('locationFilter');
        filterOptions.classList.remove('hide');
        sortByLocation(element);
  
    }

}

function sortByLocation(element) {

    let parksByLocation = {};
    let parksInLocation = {};
    locations.forEach(async function (location) {
        let parks = await findByStateCode('parks?', location);
        let parksArray = Array.from(parks.data);
        parksInLocation = { stateCode: parksArray};
        console.log(parksInLocation);
        parksByLocation[`location-${location}`] = parksInLocation;
         
    });
 
  

    /*let parksByLocation = {};
    locations.forEach(async function (location) {
        let parks = await findByStateCode('parks?', location);
        let locationKey = location;
        let parksArray = Array.from(parks.data);
        parksByLocation[locationKey] = parksArray;  
        console.log(parksByLocation);
    });
    console.log(parksByLocation);
    console.log(Object.keys(parksByLocation));*/
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
                <img class="park-img parkResult-img" src="${data.images[imageIndex].url}" alt="${data.images[0].altText}">
            </picture>
            <div class="overlay-description">
                <p class="description parkResult-description">${data.description}</p>
            </div>
        </div>
        <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
        </li>`;
    }

    // for parks without an image
    else {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="location parkResult-location">Located in ${fullStates}</p>
        <p class="parkResult-noImg">[No Image Provided]</p>
        <p class="description parkResult-description">${data.description}</p>
        <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
        </li>`;
    }
}