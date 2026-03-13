import { collection } from 'firebase/firestore';
import { firestore } from './firebase/client';
var createCollection = function (collectionName) {
    return collection(firestore, collectionName);
};
export var adminUsersCollection = createCollection('adminUsers');
export var rolesCollection = createCollection('roles');
export var auditLogsCollection = createCollection('auditLogs');
export var projectRegistryCollection = createCollection('projectRegistry');
export var jobsCollection = createCollection('jobs');
export var jobRunsCollection = createCollection('jobRuns');
export var deadLettersCollection = createCollection('deadLetters');
export var featureFlagsCollection = createCollection('featureFlags');
