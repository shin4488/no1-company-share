import { accessorType } from '@f/store';
import { ObjectCloner } from '@f/common/clone/objectCloner';

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType;
    $cloner: ObjectCloner;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType;
    $cloner: ObjectCloner;
  }
  interface Context {
    $accessor: typeof accessorType;
    $cloner: ObjectCloner;
  }
}
