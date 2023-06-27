import parkDetails from './parkDetails.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const parkCode = getParam('parkCode');
parkDetails(parkCode);