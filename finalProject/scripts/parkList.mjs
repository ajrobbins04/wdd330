import { convertStateAbbr,
         renderListWithTemplate,
         selectRandomImage,
         states,
         states_short,
         regions,
         regions_short, 
         setPagePosition,
         restorePagePosition } from './utils.mjs';

import { apiFetch,
         findByStateCode } from './externalServices.mjs';



export default async function parkList(selector) {

    //window.addEventListener('DOMContentLoaded', restorePagePosition);  
  
    // the element that all park results will be placed in
    const parentElement = document.querySelector(selector);  

    // for switching pages
    const prevBtn = document.querySelector('.prevArrow');    
    const nextBtn = document.querySelector('.nextArrow');

    // for viewing parks based on sort options, followed by result filters
    const options = document.getElementById('sortOptions');
    const stateFilterOptions = document.getElementById('stateFilter');
    const regionFilterOptions = document.getElementById('regionFilter');
   
    // retrive data for all parks
    const parks = await apiFetch();

    let currentPage = 1; 
    const resultsPerPage = 16; 

    // set finalPage to total number of pages possible
    const finalPage = getNumPages(parks, resultsPerPage);

    // display first 10 park results on single page
    displayPage(parks, parentElement, currentPage, resultsPerPage);
 
    // check if new page is clicked
    clickNewPage(parks, parentElement, prevBtn, nextBtn, currentPage, resultsPerPage);

    // organizes results based on the current sort option
    options.addEventListener('change', function() {
        const value = options.value;
        switchResultDisplay(parks, parentElement, value, stateFilterOptions, regionFilterOptions);
    });


   /* const parkDetailLinks = document.getparentElementsByClassName('parkResult-learnMore');
    Array.from(parkDetailLinks).forEach(link => {
        link.addEventListener('click', setPagePosition);
    })*/
}

// displays 10 park results per page
function displayPage(parks, parentElement, currentPage, resultsPerPage) {

    // will use indices to slice parks data
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    // make array with 10 parks inside index range
    const parksPage = Array.from(parks.data.slice(startIndex, endIndex));

    // render page display 
    renderListWithTemplate(parkResultTemplate, parentElement, parksPage);
}


// checks if user has clicked on a new page
function clickNewPage(parks, parentElement, prevBtn, nextBtn, 
                      currentPage, resultsPerPage, finalPage) {

    // update the buttons to display based on current page
    function updateButtons() {
        if (currentPage === 1) {
            prevBtn.classList.add('hide');
            nextBtn.classList.remove('hide');
        } else if (currentPage === finalPage) {
            prevBtn.classList.remove('hide');
            nextBtn.classList.add('hide');
        } else {
            prevBtn.classList.remove('hide');
            nextBtn.classList.remove('hide');
        }
    }

    updateButtons();

    nextBtn.addEventListener('click', function() {
        currentPage += 1;   // go forward 1 page

        try {  // ensure page number is valid before displaying it
            if (currentPage <= 0 || currentPage > lastPage) {
                throw new Error('Invalid current page.');
            }
            updateButtons();
            displayPage(parks, parentElement, currentPage, resultsPerPage);
        } 
        catch (error) {
            console.log('ERROR: ' + error.message);
        }
    });

    prevBtn.addEventListener('click', function () {
        currentPage -= 1;  // go back 1 page

        try {  // ensure page number is valid before displaying it
            if (currentPage <= 0 || currentPage > lastPage) {
                throw new Error('Invalid current page.');
            }
            updateButtons();
            displayPage(parks, parentElement, currentPage, resultsPerPage);
        } 
        catch (error) {
            console.log('ERROR: ' + error.message);
        }
    });
}


// find max number of pages possible based on number of parks
function getNumPages(parks, resultsPerPage) {

    const totalParkNum = Object.keys(parks.data).length;

    let totalPages = 0;

    try {
        totalPages = Math.ceil(totalParkNum / resultsPerPage);

        if (totalPages <= 0) {
            throw new Error('Total page must be greater than 0.');
        }
    }
    catch(error) {
        console.log('ERROR: ' + error.message);
    }

    return totalPages;
}

// called if user wants park results to be sorted differently
async function switchResultDisplay(parks, parentElement, value,
     stateFilterOptions, regionFilterOptions) {

    // sort by state
    if (value === 'state') {

        // remove selection table of region names if present
        if (!regionFilterOptions.classList.contains('hide')) {
            regionFilterOptions.classList.add('hide');
        }

        // add selection table of states
        stateFilterOptions.classList.remove('hide');

        // gets an object containing each state as a key
        // w/an array of its parks as its value
        let parkSort = await getParksByState(states_short);

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
            renderListWithTemplate(parkResultTemplate, parentElement, Array.from(stateParks));
        })

        const stateOptions = document.querySelectorAll('.stateBox');
        stateOptions.forEach((state) => {
            state.addEventListener('click', (event) => {
                includeState(event);
            });
        })

 
    // sort by region
    } else if (value === 'region') {

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
                renderListWithTemplate(parkResultTemplate, parentElement, Array.from(subRegionParks[0]));
            }
        }

    // sort parks by name from A - Z (the default option)
    } else {

        // remove unnecessary filter table used by the
        // previous filter option (state or region) selected
        if (!stateFilterOptions.classList.contains('hide')) {
            stateFilterOptions.classList.add('hide');
        }

        else if (!regionFilterOptions.classList.contains('hide')) {
            regionFilterOptions.classList.add('hide');
        }
        
        renderListWithTemplate(parkResultTemplate, parentElement, Array.from(parks.data));
    }
    
}

function includeState(event) {
    console.log('event fired!');
    console.log(event);
}
async function getParksByState(states) {
    
    let parksByState = {}; 

    // places an array of parks for each state in the
    // parksByState object w/state name as its key
    for (const state of states) {
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
        <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
        </li>`;
    }
}