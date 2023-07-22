import parkDetails from './parkDetails.mjs';
import { getParam, loadDetailsPageHeaderFooter } from './utils.mjs';

loadDetailsPageHeaderFooter();

const parkCode = getParam('parkCode');
parkDetails(parkCode);