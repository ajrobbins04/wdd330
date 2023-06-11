const date = new Date();
 
// Display date last modified in footer.
document.getElementById('last-updated').innerHTML = `Last Updated: ${document.lastModified}`;

let year = date.getFullYear();
document.querySelector('#copyright-year').textContent = ` ${year}`; 