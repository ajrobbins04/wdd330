import { renderListWithTemplate,
         selectRandomImage } from "./utils.mjs";
import { apiFetch,
         findByStateCode } from './externalServices.mjs';

// each page displays parks within a single state
export function displayStatePage(allParksByState, parentElement, currentPage) {
   
    const stateParksPage = Array.from(allParksByState[currentPage - 1]);
    renderListWithTemplate(parkResultTemplate, parentElement, stateParksPage);

}

export async function getParksByState(states) {
    
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


// user may alternately choose which states to include in
// the display pages
export async function includeState(event, selectedStates, parentElement) {

    const stateAbbr = event.target.value;
    const fullNameState = statesObj[stateAbbr];    
   
    // create array that holds the full names 
    // of selected states
    selectedStates.push(fullNameState);

    // this would alphabetize the states incorrectly
    // if they were abbreviated.
    const statesSorted = selectedStates.sort();

    // updated selectedStates w/abbreviated state names
    selectedStates = statesSorted.map((fullNameState) => {
        return findStateAbbr(fullNameState);
    })

    let parksByState = await getParksByState(statesSorted);

    // must iterate backwards for parks to be rendered
    // in A-Z order instead of Z-A
    parksByState.reverse().forEach(stateParks => {

        // display park results by state
        renderListWithTemplate(parkResultTemplate, parentElement, Array.from(stateParks));
    })
}


// checks if user has clicked on a new page
export function clickNewStatePage(allParksByState, parentElement, prevBtn, nextBtn, currentPage) {

    const finalPage = Object.keys(allParksByState).length;

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

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
            displayStatePage(allParksByState, parentElement, currentPage);
            scrollToTop();
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
            displayStatePage(allParksByState, parentElement, currentPage);
            scrollToTop();
        } 
        catch (error) {
            console.log('ERROR: ' + error.message);
        }
    });
}


export function convertStateAbbr(stateAbbr) {

    let fullNameState = '';

    // would be true if stateAbbr string = 'NV' 
    if (stateAbbr.length == 2) {
        fullNameState = statesObj[stateAbbr];
        return fullNameState;
    }

    // woud be true if stateAbbr string = 'CA,NV,UT'
    else {
        // would now be ['CA', 'NV', 'UT']
        const stateAbbrArray = stateAbbr.split(',');

        // would now be ['California', 'Nevada', 'Utah']
        const fullNameStatesArray = stateAbbrArray.map(abbr => statesObj[abbr]);
    
        // only 2 states in array
        if (fullNameStatesArray.length === 2) {
            fullNameState = fullNameStatesArray.join(' and ');
        }
        // 3 or more states in array
        else if (fullNameStatesArray.length > 2) {

            // remove last state from array
            const lastState = fullNameStatesArray.pop();

            // Add the last state into the string as a final 
            // add-on so .join doesn't place a comma after it
            fullNameState = fullNameStatesArray.join(', ') + `, and ${lastState}`;
        }

        return fullNameState;
    }

}


export function findStateAbbr(fullNameState) {

    for (const abbr in statesObj) {
        if (statesObj.hasOwnProperty(abbr)) {
            if (statesObj[abbr] === fullNameState) {
                return abbr;
            }
        }
    }
    return null;
}


function parkResultTemplate(data) {

    const fullNameState = convertStateAbbr(data.states);

    const imageIndex = selectRandomImage(data);
 
    // make sure an image is included before trying to place
    // it in the html
    if (data.images.length > 0) {
        return `<li class="parkResult">
        <h2 class="name parkResult-name">${data.fullName}</h2>
        <p class="state parkResult-state">Located in ${fullNameState}</p>
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
        <p class="state parkResult-state">Located in ${fullNameState}</p>
        <p class="parkResult-noImg">[No Image Provided]</p>
        <p class="description parkResult-description">${data.description}</p>
        <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
        </li>`;
    }
}


export const statesObj = {
    AL: 'Alabama',
    AK: 'Alaska',
    AS: 'American Samoa',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'District of Columbia',
    FL: 'Florida',
    GA: 'Georgia',
    GU: 'Guam',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    MP: 'Northern Mariana Islands',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    PR: 'Puerto Rico',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VI: 'Virgin Islands',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming'
}
 