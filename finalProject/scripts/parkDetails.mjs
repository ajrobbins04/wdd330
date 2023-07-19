import { convertStateAbbr,
    setLocalStorage,
    getLocalStorage } from './utils.mjs';
import { findByParkCode } from './externalServices.mjs';


export default async function parkDetails(parkCode) {

    const parksPath = 'parks?';
    let park = await findByParkCode(parksPath, parkCode);

    const activitiesPath = 'thingstodo?';
    let parkActivities = await findByParkCode(activitiesPath, parkCode);


    renderParkDetails(park);
    checkInVisitList(park);

    // listener for add to (or remove from) visit list button
    document.getElementById('btnVisitList')
    .addEventListener('click', function(event) {
        btnClickOptions(event, park);
    });
}

function btnClickOptions(event, park) {

    const button = event.target;

    // if button isn't already in the list
    if (!button.classList.contains('inList')) {
        addToVisitList(park);
    }
    else {
        removeFromVisitList(park);
    }
}


function checkInVisitList(park) {

    let visitList = getLocalStorage('visit-list');
    
    // check to see if it is currently empty
    if (visitList) {
        const property = 'parkCode';
        const value = park.data[0].parkCode;

        const inList = visitList.some(p => p[property] === value);

        if (inList) {
            // new additions to list get assigned to the inList class
            document.getElementById('btnVisitList').classList.add('inList');
            document.getElementById('btnVisitList').textContent = "Remove from Visit List";
        }
    }
}

function renderParkDetails(park) {

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
    visitList.push(park.data[0]);
    setLocalStorage('visit-list', visitList);

    document.getElementById('btnVisitList').textContent = "Added!"
    document.getElementById('btnVisitList').classList.add('added');
}

function removeFromVisitList(park) {

    const visitList = getLocalStorage('visit-list');
    const remove = park.data[0].parkCode;
    const newVisitList = visitList.filter(p => p.parkCode !== remove);
    
    setLocalStorage('visit-list', newVisitList);
    document.getElementById('btnVisitList').classList.remove('inList'); 
    document.getElementById('btnVisitList').textContent = "Removed!"  
}

function renderCarousel() {

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