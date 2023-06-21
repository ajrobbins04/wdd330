export async function apiFetch() {
    const apiKey = 'dofSYJEmYCOaEjAr8dNzn9MdUkwJFbSHenA3X9Bv';
    const url = `https://developer.nps.gov/api/v1/parks?`;

    try {
        const response = await fetch(url, {
        method: 'GET',
        headers: {'X-Api-Key': apiKey}
    });
 
    if (response.ok) {
        const parkData = await response.json();
        console.log(parkData);
        //displayResults(parkData);
    } else {
        throw Error(await response.text());
    }

    } catch (error) {
        console.log(error);
    }
}

  export function setLocalStorage(key, data) {}
  export function getLocalStorage(key) {}
  export function getParam(param) {}

  export async function renderListWithTemplate(templateFn,
    parentElement,
    list,
    position = "afterbegin",
    clear = true) {}

  export async function renderWithTemplate(templateFn,
    parentElement,
    data, 
    callback,
    position = "afterbegin",
    clear = true) {
      if (clear) {
        parentElement.innerHTML = "";   
      }
    
      const htmlString = await templateFn(data);
      parentElement.insertAdjacentHTML(position, htmlString);
    
      // callback function isn't always included
      if (callback) {
        callback(data);
      }
    
    }


  function loadTemplate(path) {
    return async function() {

       // make fetch request to provided filepath
      const response = await fetch(path);
      if (response.ok) {

        // must process as text - not JSON
        const html = await response.text();
        return html;
      }
    }
  }
  
  // year will be placed in footer, next to copyright
  function getCurrentYear() {
    const date = new Date();
    const year = date.getFullYear();
    return year;
  }

  export function loadHeaderFooter() {
  
    const headerTemplateFn = loadTemplate('./partials/header.html');
    const footerTemplateFn = loadTemplate('./partials/footer.html');

    const header = document.querySelector('#template-header');
    const footer = document.querySelector('#template-footer');
  
   // const year = getCurrentYear();
   // document.querySelector('#copyright-year').textContent = ` ${year}`; 

    renderWithTemplate(headerTemplateFn, header);
    renderWithTemplate(footerTemplateFn, footer);


   
  }