import parkDetails from './parkDetails.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const parkId = getParam('park');
parkDetails(parkId);