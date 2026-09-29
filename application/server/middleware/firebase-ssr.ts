import firebaseSsr from '../firebaseSsr';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/') || event.path.startsWith('/_nuxt/')) {
    return;
  }
  await firebaseSsr(event.node.req, event.node.res, () => {});
  event.context.authUser = (
    event.node.res as typeof event.node.res & {
      locals?: { user?: unknown };
    }
  ).locals?.user;
});
