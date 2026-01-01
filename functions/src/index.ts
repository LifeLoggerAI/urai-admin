import * as functions from 'firebase-functions';
import { api } from './app';
import { setCustomClaims } from './auth/setCustomClaims';

exports.api = functions.https.onRequest(api);
exports.setCustomClaims = setCustomClaims;
