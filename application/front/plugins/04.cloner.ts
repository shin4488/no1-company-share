import { ObjectCloner } from '@f/common/clone/objectCloner';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => ({
  provide: { cloner: new ObjectCloner() },
}));
