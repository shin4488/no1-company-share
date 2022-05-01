import Vue from 'vue';
import { Plugin } from '@nuxt/types';
import { ObjectCloner } from '@f/common/clone/objectCloner';

const plugin: Plugin = () => {
  Vue.prototype.$cloner = new ObjectCloner();
};

export default plugin;
