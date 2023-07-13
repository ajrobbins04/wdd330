import { convertStateAbbr,
         renderListWithTemplate,
         selectRandomImage,
         states,
         states_short,
         regions,
         regions_short } from './utils.mjs';

import { apiFetch,
         findByStateCode } from './externalServices.mjs';


export default async function parkList(selector) {

    const parks = await apiFetch();
    const element = document.querySelector(selector);

    renderListWithTemplate(parkResultTemplate, element, Array.from(parks.data));
  
    // organizes results based on the current sort option
    const option = document.getElementById('sortOptions');
    option.addEventListener('change', function() {
        switchResultDisplay(parks, element)
    });

    //const locationCheckboxes = document.querySelectorAll('.locationBox');
    //locationCheckboxes.forEach((box) => {
        //box.addEventListener('click', includeInSearch);
    //})
    getParksByRegion();
}

async function switchResultDisplay(parks, element) {

    const options = document.getElementById('sortOptions');
    const locationFilterOptions = document.getElementById('locationFilter');
    const regionFilterOptions = document.getElementById('regionFilter');

    // sort by location
    if (options.value === 'location') {

        /*if (!regionFilterOptions.hasAttribute('hide')) {
            regionFilterOptions.setAttribute('hide');
        }*/
        locationFilterOptions.classList.remove('hide');

        let parkSort = await getParksByState();

        let allParksByState = [];
        for (let [state, stateParks] of Object.entries(parkSort)) {
            allParksByState.push(stateParks);
        }
    
        allParksByState.reverse().forEach(stateParks => {
            renderListWithTemplate(parkResultTemplate, element, Array.from(stateParks));
        })
 
    // sort by region
    } else if (options.value === 'region') {

        if (!locationFilterOptions.hasAttribute('hide')) {
            locationFilterOptions.setAttribute('hide');
        }
        regionFilterOptions.classList.remove('hide');
 
    // sort A - Z
    } else {
        renderListWithTemplate(parkResultTemplate, element, Array.from(parks.data));
    }
    
}

async function getParksByState() {
    
    let parksByState = {}; 
    for (const state of states_short) {
        let parks = await findByStateCode('parks?', state);
        let parksArray = Array.from(parks.data);
        parksByState[`${state}`] = parksArray; 
    }
 
    return parksByState;
}

async function getParksByRegion() {
 
    let allParksByRegion = {};

    // get sub-region information for each region
    for (let i in regions_short) {

        // will hold array of all parks w/in the
        // subregion
        let parksInRegion = {};

        console.log(typeof regions_short[i]);
        for (let [region, subRegions] of Object.entries(regions_short[i])) {
            
            for (let [subRegion, subRegionStates] of Object.entries(subRegions)) {
                let parksInSubRegion = await getParksBySubRegion(Array.from(subRegionStates));
            } 
        }
    };
}

async function getParksBySubRegion(subRegionStates) {
   
    let subRegionParks = {};

    for (let state of subRegionStates) {
        let parks = await findByStateCode('parks?', state);
        let parksArray = Array.from(parks.data);
        subRegionParks[`${state}`] = parksArray; 
    }
 
    return subRegionParks;
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