import type { createVuetify } from 'vuetify';
import type { AxiosInstance } from 'axios';
import type { Auth } from 'firebase/auth';
import type { ObjectCloner } from '@f/common/clone/objectCloner';
import type { Accessor } from '@f/store';

interface FirebaseServices {
  auth: Auth;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $accessor: Accessor;
    $axios: AxiosInstance;
    $fire: FirebaseServices;
    $cloner: ObjectCloner;
    $vuetify: ReturnType<typeof createVuetify>;
  }
}

declare module '#app' {
  interface NuxtApp {
    $accessor: Accessor;
    $axios: AxiosInstance;
    $fire: FirebaseServices;
    $cloner: ObjectCloner;
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // 認証ストアの処理が使う。プラグインで設定するまでは未定義
    $axios?: AxiosInstance;
    $fire?: FirebaseServices;
  }
}

export {};
