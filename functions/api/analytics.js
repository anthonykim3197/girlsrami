import {collect} from '../../analytics/server.mjs';
export const onRequest=({request,env})=>collect(request,env);
