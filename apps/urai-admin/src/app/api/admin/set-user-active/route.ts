import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AdminAuthError, adminAuthErrorResponse, requireAdminMutationSession } from '@/lib/admin/require-admin-session';
import { auth, firestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const setUserActiveSchema = z.object({
  uid