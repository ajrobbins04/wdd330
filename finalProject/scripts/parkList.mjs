import { convertStateAbbr,
         renderListWithTemplate,
         selectRandomImage,
         states,
         states_short,
         regions,
         regions_short } from './utils.mjs';

import { apiFetch,
         findByStateCode } from './externalServices.mjs';

let currentPage = 1; 
let resultsPerPage = 10;

export default async function parkList(selector) {

    // retrive data on all parks and get the
    // intended parent element
    const parks = await apiFetch();
    const element = document.querySelector(selector);

    // display page 1 by setting page
    // interval to 0
    displayPage(parks, element, 0);

    // check if new page is clicked
    clickNewPage(parks, element);

    // organizes results based on the current sort option
    const option = document.getElementById('sortOptions');
    option.addEventListener('change', function() {
        switchResultDisplay(parks, element)
    });

}


function displayPage(parks, element, pageInterval) {

    currentPage += pageInterval;

    // only show 10 results per page
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    // make array with 10 parks inside index range
    const parksPage = Array.from(parks.data.slice(startIndex, endIndex));

    // display page
    renderListWithTemplate(parkResultTemplate, element, parksPage);
}


// find max number of pages possible based on number of parks
function getNumPages(parks) {

    const totalParkNum = Object.keys(parks.data).length;

    let totalPages = 0;

    try {
        totalPages = Math.ceil(totalParkNum / resultsPerPage);

        if (totalPages <= 0) {
            throw new Error('Total page must be greater than 0.');
        }
    }
    catch(error) {
        alert('ERROR: ' + error.message);
    }

    return totalPages;
}


// checks if user has clicked on a new page
function clickNewPage(parks, element) {

    const lastPage = getNumPages(parks);
    const prevBtn = document.getElementsByClassName(prevArrow);
    const nextBtn = document.getElementsByClassName(nextArrow);

    // first page doesn't need previous button
    if (currentPage === 1) {
        prevBtn.classList.add('hide');
        nextBtn.addEventListener('click', displayPage.bind(parks, element, 1))
    }

    // middle pages need both buttons
    if (currentPage > 1 && currentPage < lastPage) {

        // make sure both buttons are displayed
        if (prevBtn.classList.contains('hide')) {
            prevBtn.classList.remove('hide');
        }
        else if (nextBtn.classlist.contains('hide')) {
            nextBtn.classList.remove('hide');
        }

        nextBtn.addEventListener('click', displayPage.bind(parks, element, 1));
        prevBtn.addEventListener('click', displayPage.bind(parks, element, -1));
    }

    // last page doesn't need next button
    if (currentPage === lastPage) {
        nextBtn.classList.add('hide');
        prevBtn.addEventListener('click', displayPage.bind(parks, element, 1))
    }
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