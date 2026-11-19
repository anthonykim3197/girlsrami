import { handleSmartstoreSummary } from '../../smartstore/summary-server.mjs';
import { verifyAdmin } from '../../analytics/verify-admin.mjs';

export const onRequest = ({ request, env }) => handleSmartstoreSummary(request, env, verifyAdmin);
