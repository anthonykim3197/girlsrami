import { readSummary } from '../../analytics/server.mjs';
import { verifyAdmin } from '../../analytics/verify-admin.mjs';

export const onRequest = ({ request, env }) => readSummary(request, env, verifyAdmin);
