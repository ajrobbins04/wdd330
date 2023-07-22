import { renderListWithTemplate,
         selectRandomImage } from "./utils.mjs";

// each page displays parks within a single state
export function displayStatePage(allParksByState, parentElement, currentPage) {
   
    const stateParksPage = Array.from(allParksByState[currentPage - 1]);

    renderListWithTemplate(parkResultTemplate, parentElement, stateParksPage);
}

// checks if user has clicked on a new page
export function clickNewStatePage(allParksByState, parentElement, prevBtn, nextBtn, currentPage) {

    const finalPage = Object.keys(allParksByState).length;

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
        } 
        catch (error) {
            console.log('ERROR: ' + error.message);
        }
    });
}

export function convertStateAbbr(stateAbbr) {

    let fullStateName = '';

    // would be true if stateAbbr string = 'NV' 
    if (stateAbbr.length == 2) {
        fullStateName = statesObj[stateAbbr];
        return fullStateName;
    }

    // woud be true if stateAbbr string = 'CA,NV,UT'
    else {
        // would now be ['CA', 'NV', 'UT']
        const stateAbbrArray = stateAbbr.split(',');

        // would now be ['California', 'Nevada', 'Utah']
        const fullStateNamesArray = stateAbbrArray.map(abbr => statesObj[abbr]);
    
        // only 2 states in array
        if (fullStateNamesArray.length === 2) {
            fullStateName = fullStateNamesArray.join(' and ');
        }
        // 3 or more states in array
        else if (fullStateNamesArray.length > 2) {

            // remove last state from array
            const lastState = fullStateNamesArray.pop();

            // Add the last state into the string as a final 
            // add-on so .join doesn't place a comma after it
            fullStateName = fullStateNamesArray.join(', ') + `, and ${lastState}`;
        }

        return fullStateName;
    }

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
 