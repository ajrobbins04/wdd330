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
  // addEventListener('load', apiFetch);

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
    clear = true) {}


  function loadTemplate(path) {
    return async function() {
      const response = await fetch(path);
      if (response.ok) {
        const html = await response.text();
        return html;
      }
    }
  }
  
  export function loadHeaderFooter() {
  
    const headerTemplateFn = loadTemplate("/partials/header.html");
    const footerTemplateFn = loadTemplate("/partials/footer.html");
  
    const header = document.querySelector("#template-header");
    const footer = document.querySelector("#template-footer");
  
    renderWithTemplate(headerTemplateFn, header);
    renderWithTemplate(footerTemplateFn, footer);
  }