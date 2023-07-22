import { getLocalStorage, 
         renderListWithTemplate,
         selectRandomImage } from "./utils.mjs";
import { convertStateAbbr  } from "./states.mjs";

export default function visitList() {

const parksToVisit = getLocalStorage('visit-list');
const outputElement = document.querySelector('.visitList');

let parksVisit = Object.values(parksToVisit);

renderListWithTemplate(parkToVisitTemplate, outputElement, parksToVisit);

}

function parkToVisitTemplate(data) {

console.log(data.fullName);
const fullStates = convertStateAbbr(data.states);
const imageIndex = selectRandomImage(data);

// make sure an image is included before trying to place
// it in the html
if (data.images.length > 0) {
   return `<li class="parkToVisit">
   <h2 class="name parkToVisit-name">${data.fullName}</h2>
   <p class="state parkToVisit-state">Located in ${fullStates}</p>
   <div class="hover overlay">
      <picture>
           <img class="park-img parkToVisit-img" src="${data.images[imageIndex].url}" alt="${data.images[0].altText}">
       </picture>
       <div class="overlay-description">
           <p class="description parkToVisit-description">${data.description}</p>
       </div>
   </div>
   <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
   </li>`;
}

// for parks without an image
else {
   return `<li class="parkToVisit">
   <h2 class="name parkToVisit-name">${data.fullName}</h2>
   <p class="state parkToVisit-state">Located in ${fullStates}</p>
   <p class="parkToVisit-noImg">[No Image Provided]</p>
   <p class="description parkToVisit-description">${data.description}</p>
   <a class="parkResult-learnMore" href="./parkDetails.html?parkCode=${data.parkCode}">Learn More</a>
   </li>`;
}
}