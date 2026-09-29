import { fromNodeMiddleware } from 'h3';
import app from '../index';

// Keep the existing Express API and its authentication and rate limits behind
// the same public path while Nuxt handles page rendering.
export default fromNodeMiddleware(app);
