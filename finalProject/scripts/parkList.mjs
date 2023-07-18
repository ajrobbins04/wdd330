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

}

async function switchResultDisplay(parks, element) {

    const options = document.getElementById('sortOptions');
    const stateFilterOptions = document.getElementById('stateFilter');
    const regionFilterOptions = document.getElementById('regionFilter');

    // sort by state
    if (options.value === 'state') {

        // remove selection table of region names if present
        if (!regionFilterOptions.classList.contains('hide')) {
            regionFilterOptions.classList.add('hide');
        }

        // add selection table of states
        stateFilterOptions.classList.remove('hide');

        // gets an object containing each state as a key
        // w/an array of its parks as its value
        let parkSort = await getParksByState();

        let allParksByState = [];

        for (let [state, stateParks] of Object.entries(parkSort)) {

            // adds just the parks into an array,
            // but is now sorted by state
            allParksByState.push(stateParks);
        }
    
        // must iterate backwards for parks to be rendered
        // in A-Z order instead of Z-A
        allParksByState.reverse().forEach(stateParks => {

            // display park results by state
            renderListWithTemplate(parkResultTemplate, element, Array.from(stateParks));
        })

        const stateCheckboxes = document.querySelectorAll('.stateBox');
        stateCheckboxes.forEach((box) => {
            box.addEventListener('click', includeInSearch);
        })
 
    // sort by region
    } else if (options.value === 'region') {

        // remove selection table of state names if present
        if (!stateFilterOptions.classList.contains('hide')) {
            stateFilterOptions.classList.add('hide');
        }

        // add selection table of regions
        regionFilterOptions.classList.remove('hide');
  
        let allParksByRegion = await getParksByRegion();
      
        for (let [regionName, subRegions] of Object.entries(allParksByRegion)) {
 
            for (let subRegion of subRegions) {
              
                let subRegionName = Object.keys(subRegion);
                let subRegionParks = Object.values(subRegion);
           
                // display park results by region
                renderListWithTemplate(parkResultTemplate, element, Array.from(subRegionParks[0]));
            }
        }

    // sort park names from A - Z
    } else {

        // remove unnecessary filter table used by the
        // previous filter option (state or region) selected
        if (!stateFilterOptions.classList.contains('hide')) {
            stateFilterOptions.classList.add('hide');
        }

        else if (!regionFilterOptions.classList.contains('hide')) {
            regionFilterOptions.classList.add('hide');
        }
        
        // display park results by name from A - Z
        renderListWithTemplate(parkResultTemplate, element, Array.from(parks.data));
    }
    
}

async function getParksByState() {
    
    let parksByState = {}; 

    // places an array of parks for each state in the
    // parksByState object w/state name as its key
    for (const state of states_short) {
        let parks = await findByStateCode('parks?', state);
        let parksArray = Array.from(parks.data);
        parksByState[`${state}`] = parksArray; 
    }
 
    return parksByState;
}

async function getParksByRegion() {
 
    let allParksByRegion = {};
   
    // get sub-region information for each major region
    for (let i in regions_short) {

        for (let [region, subRegions] of Object.entries(regions_short[i])) {

            let subRegionParks = [];
            for (let subRegion of subRegions) {
                let parks = await getParksBySubRegion(subRegion);
                subRegionParks.push(parks);
            } 
            allParksByRegion[`${region}`] = subRegionParks; 
        }  
    };

    return allParksByRegion;
}

async function getParksBySubRegion(subRegion) {
   
    let subRegionParks = {};

    const subRegionName = Object.keys(subRegion);
    const states = Object.values(subRegion);
 
    // get the parks for each state in the subregion
    for (let state of states) {
        let parks = await findByStateCode('parks?', state);
        let parksArray = Array.from(parks.data);

        // add the array of parks as a subRegionParks 
        // object value w/the subRegion name as its key
        subRegionParks[`${subRegionName}`] = parksArray; 
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
        <p class="state parkResult-state">Located in ${fullStates}</p>
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
        <p class="state parkResult-state">Located in ${fullStates}</p>
        <p class="parkResult-noImg">[No Image Provided]</p>
        <p class="description parkResult-description">${data.description}</p>
        <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${park.parkCode}">Learn More</a>
        </li>`;
    }
}