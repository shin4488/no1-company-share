import { Auth } from 'firebase/auth';
import { AxiosInstance } from 'axios';
interface FirebaseServices {
  auth: Auth;
}
declare module 'vue/types/vue' {
  interface Vue {
    $fire: FirebaseServices;
    $axios: AxiosInstance;
  }
}
declare module '@nuxt/types' {
  interface Context {
    $fire: FirebaseServices;
    $axios: AxiosInstance;
  }
  interface NuxtAppOptions {
    $fire: FirebaseServices;
    $axios: AxiosInstance;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    readonly state: S;
    $fire: FirebaseServices;
    $axios: AxiosInstance;
  }
}
