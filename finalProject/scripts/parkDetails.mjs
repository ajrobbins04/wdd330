import { convertStateAbbr,
    setLocalStorage,
    getLocalStorage } from './utils.mjs';
import { findByParkCode } from './externalServices.mjs';

export default async function parkDetails(parkCode) {

    const parksPath = 'parks?';
    let park = await findByParkCode(parksPath, parkCode);

    const activitiesPath = 'thingstodo?'
    let parkActivities = await findByParkCode(activitiesPath, parkCode);

    renderParkDetails(park, parkActivities);

    checkInLocalStorage(park);

    // listener for add to (or remove from) visit list button
    document.getElementById('addToVisitList')
    .addEventListener('click', function(event) {
    buttonClickOptions(event, park);
    });
}

function buttonClickOptions(event, park) {

    const button = event.target;
    if (!button.classList.contains('inList')) {
        addToVisitList(park);
    }
    else {
        removeFromVisitList(park);
    }
}

function checkInLocalStorage(park) {
    let visitList = getLocalStorage('visit-list');
    console.log(visitList);
    // check to see if it is currently empty
    if (visitList) {
        const property = 'parkCode';
        const value = park.data[0].parkCode;

        const inList = visitList.some(p => p[property] === value);
    
        if (inList) {
            document.getElementById('addToVisitList').classList.add('inList');
            document.getElementById('addToVisitList').textContent = "Remove from Visit List"
        }
    }
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

    // park state
    const stateAbbr = park.data[0].states;
    const stateFull = convertStateAbbr(stateAbbr);
    document.getElementById('parkDetails-state').textContent = ` Located in ${stateFull}`;

    // park image
    document.getElementById('parkDetails-img').src = park.data[0].images[0].url;
    document.getElementById('parkDetails-img').alt = park.data[0].images[0].altText;

    // standard operating hours
    // document.getElementById('operatingInfo-description').textContent = ` ${park.data[0].operatingHours[0].description}`;
    document.getElementById('standardMondayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.monday}`;
    document.getElementById('standardTuesdayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.tuesday}`;
    document.getElementById('standardWednesdayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.wednesday}`;
    document.getElementById('standardThursdayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.thursday}`;
    document.getElementById('standardFridayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.friday}`;
    document.getElementById('standardSaturdayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.saturday}`;
    document.getElementById('standardSundayHours').textContent = ` ${park.data[0].operatingHours[0].standardHours.sunday}`;

    // image carousel

}

function addToVisitList(park) {

    let visitList = getLocalStorage('visit-list');

    // check to see if it is currently empty
    if (!visitList) {
        visitList = [];
    }

    // add the current park to the array
    visitList.push(park.data);
    setLocalStorage('visit-list', visitList);

    document.getElementById('addToVisitList').textContent = "Added!"
    document.getElementById('addToVisitList').classList.add('added');
}

function removeFromVisitList(park) {

    const visitList = getLocalStorage('visit-list');
    const remove = park.data[0].parkCode;
    const newVisitList = visitList.filter(p => p.parkCode !== remove);

    setLocalStorage('visit-list', newVisitList);
    document.getElementById('addToVisitList').classList.remove('inList'); 
    document.getElementById('addToVisitList').textContent = "Removed!"  
}