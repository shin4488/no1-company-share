import type { Store } from 'vuex';
import type { createVuetify } from 'vuetify';
import type { AxiosInstance } from 'axios';
import type { Auth } from 'firebase/auth';
import type { ObjectCloner } from '@f/common/clone/objectCloner';
import type { accessorType } from '@f/store';

interface FirebaseServices {
  auth: Auth;
}

interface AppStoreState {
  snackBarError: { message: string };
  snackBarInfo: { message: string };
  spinnerOverlay: { isShown: boolean };
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $accessor: typeof accessorType;
    $axios: AxiosInstance;
    $fire: FirebaseServices;
    $cloner: ObjectCloner;
    $store: Store<AppStoreState>;
    $vuetify: ReturnType<typeof createVuetify>;
  }
}

declare module '#app' {
  interface NuxtApp {
    $accessor: typeof accessorType;
    $axios: AxiosInstance;
    $fire: FirebaseServices;
    $cloner: ObjectCloner;
    $store: Store<unknown> & {
      $axios?: AxiosInstance;
      $fire?: FirebaseServices;
    };
  }
}

declare module 'vuex' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $axios?: AxiosInstance;
    $fire?: FirebaseServices;
  }
}

export {};
