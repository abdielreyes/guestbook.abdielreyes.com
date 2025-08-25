import PocketBase from 'pocketbase';
// import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { env } from '$env/dynamic/public';

const pb = new PocketBase(env.PUBLIC_POCKETBASE_URL);
export default pb;
