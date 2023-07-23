import { setLocalStorage,
         getLocalStorage  } from './utils.mjs';
import { findByParkCode   } from './externalServices.mjs';
import { convertStateAbbr } from './states.mjs';


export default async function parkDetails(parkCode) {

    // fetch all the data for just one state
    const parksPath = 'parks?';
    const park = await findByParkCode(parksPath, parkCode);

    const activitiesPath = 'thingstodo?';
    const parkActivities = await findByParkCode(activitiesPath, parkCode);
    const allParkActivities = await(getAllParkActivities(parkActivities));

    renderParkDetails(park, parkActivities);
    checkInVisitList(park);
    renderParkActivities(allParkActivities);
    
    const activitySection = document.getElementsByClassName('parkActivity');
    const addVisitBtn = document.getElementById('btnVisitList');

    // listener to view an activity description
    Array.from(activitySection).forEach((item) => {
        item.addEventListener('click', function(event) {
          displayActivityDescription(event);
        })
      });

    // listener for add to (or remove from) visit list button
    addVisitBtn.addEventListener('click', function(event) {
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


async function renderParkDetails(park, parkActivities) {

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
}


async function getAllParkActivities(parkActivities) {

    const activities = parkActivities.data;
    const activityNames = activities.map((activity) => activity.activities[0].name);
    const activityDescriptions = activities.map((activity) => activity.shortDescription);

    let allParkActivities = {};

    activityNames.forEach((name, index) => {
        const description = activityDescriptions[index];
        allParkActivities[name] = description;
    });
    return allParkActivities;
}


function renderParkActivities(allParkActivities) {

    const parentElement = document.querySelector('.activitiesList');
    let id = 1;

    for (const [name, description] of Object.entries(allParkActivities)) {
        
        // create a section to encompass each activity name,
        // description, and image
        const section = document.createElement('section');
        section.setAttribute('class', 'parkActivity');
        section.setAttribute('id', `parkActivity-${id}`);
        id += 1;

        // assign name to a list item element
        const listItem = document.createElement('li');
        listItem.setAttribute('class', 'parkActivityItem');
        listItem.textContent = name;
   
        // assign description to a parapgraph element
        const paragraph = document.createElement('p');
        paragraph.textContent = description;
        paragraph.setAttribute('class', 'parkActivityDescription hide');

        section.appendChild(listItem);
        section.appendChild(paragraph);
        parentElement.appendChild(section);
    }
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


// only shows description when the activity has been clicked,
// and removes the description once it is clicked again.
function displayActivityDescription(event) {
 
    const name = event.target;
    const description = name.nextElementSibling;
    
    console.log(description);
    if (description.classList.contains('hide')) {
        description.classList.remove('hide');
    }
    else {
        description.classList.add('hide');
    }
}

function renderCarousel() {

    const numImages = park.data[0].images.length;
    const carousel = document.getElementById('slides-container');
    const slidesContainer = document.querySelector('.slides');
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