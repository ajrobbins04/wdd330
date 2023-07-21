import { renderListWithTemplate,
         convertStateAbbr,
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