import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';
export var auth = getAuth(adminApp);
