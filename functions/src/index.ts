import * as functions from 'firebase-functions';
import * as express from 'express';

import Admin from './admin';
const appAdmin = express();
for (const k in Admin) {
  appAdmin.get(`/${k}`, Admin[k]);
}
export const admin = functions.https.onRequest(appAdmin);

import uwc from './update-web-content';
export const updateWebContent = functions.https.onRequest(uwc);

import ServeContent from './serve-content';
const appContent = express();
appContent.get('/toutes-nos-actualites', ServeContent.newsIndex);
appContent.get('/actualites/:id/:slug', ServeContent.newsPage);
appContent.get('/offres-emploi', ServeContent.jobsIndex);
appContent.get('/offres-emploi/:id/:slug', ServeContent.jobPage);
appContent.get('/:language/news', ServeContent.newsIndex);
appContent.get('/:language/news/:id/:slug', ServeContent.newsPage);
appContent.get('/:language/job-vacancies', ServeContent.jobsIndex);
appContent.get('/:language/job-vacancies/:id/:slug', ServeContent.jobPage);
export const content = functions.https.onRequest(appContent);
