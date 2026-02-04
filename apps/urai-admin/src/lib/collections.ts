import { collection, CollectionReference } from 'firebase/firestore';
import { firestore } from './firebase/client';
import { AdminUser, AuditLog, ProjectRegistry, Job, JobRun, DeadLetter, FeatureFlag, Role } from './types';

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const adminUsersCollection = createCollection<AdminUser>('adminUsers');
export const rolesCollection = createCollection<Role>('roles');
export const auditLogsCollection = createCollection<AuditLog>('auditLogs');
export const projectRegistryCollection = createCollection<ProjectRegistry>('projectRegistry');
export const jobsCollection = createCollection<Job>('jobs');
export const jobRunsCollection = createCollection<JobRun>('jobRuns');
export const deadLettersCollection = createCollection<DeadLetter>('deadLetters');
export const featureFlagsCollection = createCollection<FeatureFlag>('featureFlags');
