import { convertStateAbbr,
         selectRandomImage} from './utils.mjs';
import { findByParkCode, 
         findByStateCode } from './externalServices.mjs';

let park = {};
let parkActivities = {};

export default async function parkDetails(parkCode) {

    const getParks = 'parks?';
    park = await findByParkCode(parkCode, getParks);
    console.log(park);
    
    const getActivities = 'thingstodo?'
    parkActivities = await findByParkCode(parkCode, getActivities);
    console.log(parkActivities);
    renderParkDetails(park, parkActivities);

}

function renderCarousel(park) {

    const numImages = park.data[0].images.length;
    const carousel = document.getElementById('slides-container');
    const slide = document.getElementsByClassName('slide');
    const prevButton = document.getElementById('slide-arrow-prev');
    const nextButton = document.getElementById('slide-arrow-next');

    // only add carousel if there are at least 3 images
    if (numImages > 2) {

        // Skip the first image. It is already displayed
        // higher up on the page
        for (let i = 1; i < numImages; i++) {
            const html = 
            `<div class="slide">
                <img class="park-img slide-img" src="${park.data[0].images[i].url}" 
                alt="${park.data[0].images[i].altText}">
            </div>`;
            carousel.insertAdjacentHTML('afterend', html);
        }

        nextButton.addEventListener('click', (event) => {
            const slideWidth = slide.clientWidth;
            carousel.scrollLeft += slideWidth;
        })
    }
}

function renderParkDetails(park, parkActivities) {
 
    // park name and description
    document.getElementById('parkDetails-name').textContent = park.data[0].fullName;
    document.getElementById('parkDetails-description').textContent = park.data[0].description;
    
    // park location
    const locationAbbr = park.data[0].states;
    const locationFull = convertStateAbbr(locationAbbr);
    document.getElementById('parkDetails-location').textContent = ` Located in ${locationFull}`;

    // park image
    document.getElementById('parkDetails-img').src = park.data[0].images[0].url;
    document.getElementById('parkDetails-img').alt = park.data[0].images[0].altText;
 
    // standard operating hours
    document.getElementById('operatingInfo-description').textContent = ` ${park.data[0].operatingHours[0].description}`;
    document.getElementById('standardMondayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.monday}`;
    document.getElementById('standardTuesdayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.tuesday}`;
    document.getElementById('standardWednesdayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.wednesday}`;
    document.getElementById('standardThursdayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.thursday}`;
    document.getElementById('standardFridayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.friday}`;
    document.getElementById('standardSaturdayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.saturday}`;
    document.getElementById('standardSundayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.sunday}`;

    // image carousel
  
}