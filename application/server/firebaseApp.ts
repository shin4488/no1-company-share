import { getApps, initializeApp } from 'firebase-admin/app';
import { firebaseConfig } from '@c/firebaseConfig';

// クラウド環境の自動検出に頼らず、Web・SSR・APIで同じプロジェクトを使う。
export const getFirebaseApp = () =>
  getApps()[0] || initializeApp({ projectId: firebaseConfig.projectId });
