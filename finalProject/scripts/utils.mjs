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

  export function loadHeaderFooter() {}

