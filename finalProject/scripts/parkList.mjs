import { renderListWithTemplate,
         selectRandomImage,
         states,
         regions,
         setPagePosition,
         restorePagePosition } from './utils.mjs';
import { statesObj,
         displayStatePage,
         clickNewStatePage,
         convertStateAbbr } from './states.mjs';
import { apiFetch,
         findByStateCode } from './externalServices.mjs';

let allParks = null;
let allParksByState = null;
let allParksByRegion = null;

const resultsPerPage = 16;

export default async function parkList(selector) {

    //window.addEventListener('DOMContentLoaded', restorePagePosition);  
  
    // the element that all park results will be placed in
    const parentElement = document.querySelector(selector);  

    // for switching pages
    const prevBtn = document.getElementById('prevArrow');    
    const nextBtn = document.getElementById('nextArrow');

    // for viewing parks based on sort options, followed by result filters
    const options = document.getElementById('sortOptions');
    const stateFilterOptions = document.getElementById('stateFilter');
    const regionFilterOptions = document.getElementById('regionFilter');
   
    // retrive data for all parks
    if (!allParks) {
        let parks = await apiFetch();
        allParks = parks.data;
    }
   
    let currentPage = 1; 
    let finalPage = null;

    // set finalPage to total number of pages possible
    if (!finalPage) {
        finalPage = getNumPages(allParks);
    }
    

    // display first 10 park results on single page
    displayPage(allParks, parentElement, currentPage);
 
    // check if new page is clicked
    clickNewPage(allParks, parentElement, prevBtn, nextBtn, currentPage, finalPage);

    // organizes results based on the current sort option
    options.addEventListener('change', function() {
        const value = options.value;
        switchResultDisplay(parentElement, value, stateFilterOptions, 
            regionFilterOptions, prevBtn, nextBtn, finalPage);
    });
}


// find max number of pages possible based on number of parks
function getNumPages(parks) {

    const totalParkNum = Object.keys(parks).length;

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


// displays parks results sorted by their names 
function displayPage(allParks, parentElement, currentPage) {
  
    // will use indices to slice parks data
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    // make array with 16 parks that fall w/in the index range
    const parksPage = Array.from(allParks.slice(startIndex, endIndex));

    // render page display 
    renderListWithTemplate(parkResultTemplate, parentElement, parksPage);
}


// checks if user has clicked on a new page
function clickNewPage(parks, parentElement, prevBtn, nextBtn, 
                      currentPage, finalPage) {

    // update the buttons to display based on current page
    function updateButtons() {
        if (currentPage === 1) {
            prevBtn.classList.add('hide');
            nextBtn.classList.remove('hide');
        } else if (currentPage < finalPage) {
            prevBtn.classList.remove('hide');
            nextBtn.classList.remove('hide');
        } else {
            prevBtn.classList.remove('hide');
            nextBtn.classList.add('hide');
        }
    }

    updateButtons();

    nextBtn.addEventListener('click', function() {
        currentPage += 1;   // go forward 1 page

        try {  // ensure page number is valid before displaying it
            if (currentPage <= 0 || currentPage > finalPage) {
                throw new Error('Invalid current page.');
            }
            updateButtons();
            displayPage(parks, parentElement, currentPage);
        } 
        catch (error) {
            console.log('ERROR: ' + error.message);
        }
    });

    prevBtn.addEventListener('click', function () {
        currentPage -= 1;  // go back 1 page

        try {  // ensure page number is valid before displaying it
            if (currentPage <= 0 || currentPage > finalPage) {
                throw new Error('Invalid current page.');
            }
            updateButtons();
            displayPage(parks, parentElement, currentPage);
        } 
        catch (error) {
            console.log('ERROR: ' + error.message);
        }
    });
}

// called if user wants park results to be sorted differently
async function switchResultDisplay(parentElement, value,
     stateFilterOptions, regionFilterOptions, prevBtn, nextBtn, finalPage) {

    // must start on the first page regardless of
    // which new option is chosen
    let currentPage = 1;

    // sort by state
    if (value === 'state') {

        // remove selection table of region names if present
        if (!regionFilterOptions.classList.contains('hide')) {
            regionFilterOptions.classList.add('hide');
        }

        // add selection table of states
        stateFilterOptions.classList.remove('hide');

        if (!allParksByState) {
            allParksByState = await getParksByState(states);
        }

        displayStatePage(allParksByState, parentElement, currentPage);
        clickNewStatePage(allParksByState, parentElement, prevBtn, nextBtn, currentPage);
        
        let selectedStates = [];
        const stateOptions = document.querySelectorAll('.stateBox');
        
        // let user choose states to view
        stateOptions.forEach((state) => {
            state.addEventListener('click', (event) => {
                includeState(event, selectedStates, parentElement);
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

        if (!allParksByRegion) {
            allParksByRegion = await getParksByRegion(regions);
        }
  
        for (const [regionName, subRegions] of Object.entries(allParksByRegion)) {
            for (const subRegion of subRegions) {
              
                const stateNames = Object.keys(subRegion);
                const stateParks = Object.values(subRegion);
           
                // display park results by region
                renderListWithTemplate(parkResultTemplate, parentElement, Array.from(stateParks[0]));
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
        
        displayPage(allParks, parentElement, currentPage);
        clickNewPage(allParks, parentElement, prevBtn, nextBtn, currentPage, finalPage);
    }
    
}

async function includeState(event, selectedStates, parentElement) {

    const state = event.target.value;

    selectedStates.push(state);
    const statesSorted = selectedStates.sort();

    let parksByState = await getParksByState(statesSorted);

    // must iterate backwards for parks to be rendered
    // in A-Z order instead of Z-A
    parksByState.reverse().forEach(stateParks => {

        // display park results by state
        renderListWithTemplate(parkResultTemplate, parentElement, Array.from(stateParks));
    })


}

async function getParksByState(states) {
    
    // generates an array of parks w/in each state in states array
    const promises = states.map(state => findByStateCode('parks?', state));

    // is an array of promise objects, where each object
    // contains the array of parks w/in a single state
    const parksResponses = await Promise.all(promises);

    // each object property will be a state name &
    // its value will be an array of the state's parks
    let parksInState = {}; 

    parksResponses.forEach((response, index) => {
        const state = states[index]; 
        const parksArray = Array.from(response.data);
        parksInState[state] = parksArray;
    });

    let parksByState = [];

    for (const [state, stateParks] of Object.entries(parksInState)) {
        // adds just the parks into an array,
        // but is now sorted by state
        parksByState.push(stateParks);
    }

    return parksByState;
}


async function getParksByRegion(regions) {
 
    let parksByRegion = {};

    const promises = regions.reverse().map(async (region) => {

        // access the one and only key-value pair in each
        // region object to get its name and subRegion names
        const regionName = Object.keys(region)[0];
        const subRegions = Object.values(region)[0];
        const parks = await Promise.all(
            subRegions.reverse().map((subRegion) => getParksBySubRegion(subRegion))
        );

        parksByRegion[regionName] = parks;
    });
    await Promise.all(promises);

    return parksByRegion;
}


async function getParksBySubRegion(subRegion) {

    const subRegionName = Object.keys(subRegion)[0];
    const states = Object.values(subRegion)[0];
 
    const promises = states.map(state => findByStateCode('parks?', state));
    const parksResponses = await Promise.all(promises);

    let subRegionParks = {};

    states.forEach((state, index) => {
        const parksArray = Array.from(parksResponses[index].data);
        subRegionParks[state] = parksArray;
    })
    
    return subRegionParks;
}


function parkResultTemplate(data) {

    const fullStateName = convertStateAbbr(data.states);
    const imageIndex = selectRandomImage(data);
 
    // make sure an image is included before trying to place
    // it in the html
    if (data.images.length > 0) {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="state parkResult-state">Located in ${fullStateName}</p>
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
        <p class="state parkResult-state">Located in ${fullStateName}</p>
        <p class="parkResult-noImg">[No Image Provided]</p>
        <p class="description parkResult-description">${data.description}</p>
        <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
        </li>`;
    }
}