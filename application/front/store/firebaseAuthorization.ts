import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { defineStore } from 'pinia';
import { UserPostRequest } from './definition/firebaseAuthorization/userPostRequest';
import { firebaseUserInfo } from './definition/firebaseAuthorization/data';
import { StringUtil } from '@c/util/stringUtil';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';

export interface AuthUser {
  uid: string;
  idToken?: string | null;
  getIdToken?: () => Promise<string>;
  allClaims?: { picture: string; name: string };
  photoURL?: string | null;
  displayName?: string | null;
}

export const useFirebaseAuthorizationStore = defineStore(
  'firebaseAuthorization',
  {
    state: (): firebaseUserInfo => ({
      userId: null,
      idToken: null,
      iconImageUrl: null,
      displayedName: null,
    }),
    getters: {
      userIdComputed: (state): string | null => state.userId,
      idTokenComputed: (state): string | null => state.idToken,
      userInfoComputed: (state): firebaseUserInfo => ({
        userId: state.userId,
        idToken: state.idToken,
        iconImageUrl: state.iconImageUrl,
        displayedName: state.displayedName,
      }),
    },
    actions: {
      setUserInfo({
        userId,
        idToken,
        iconImageUrl,
        displayedName,
      }: firebaseUserInfo) {
        this.userId = userId;
        this.idToken = idToken;
        this.iconImageUrl = iconImageUrl;
        this.displayedName = displayedName;
      },
      async onAuthStateChangedAction({
        authUser,
      }: {
        authUser: AuthUser | null;
      }) {
        if (authUser === null) {
          this.setUserInfo({
            userId: null,
            idToken: null,
            iconImageUrl: null,
            displayedName: null,
          });
          return;
        }

        const idToken = authUser.idToken;
        const token = StringUtil.isNotEmpty(idToken)
          ? idToken
          : await authUser.getIdToken?.();
        const claims = authUser.allClaims;
        const hasClaims = claims !== undefined;
        const iconImageUrl = hasClaims ? claims.picture : authUser.photoURL;
        const displayedName = hasClaims ? claims.name : authUser.displayName;
        this.setUserInfo({
          userId: authUser.uid,
          idToken: token ?? null,
          iconImageUrl: iconImageUrl ?? null,
          displayedName: displayedName ?? null,
        });
        if (this.$axios === undefined) {
          return;
        }

        // ブラウザからのfirebaseユーザ削除や、別アプリ側でのユーザ名・アイコン画像変更に対応するため、ログイン中のユーザを受け取るたびにユーザ情報を登録し直す
        const requestBody: UserPostRequest = {
          iconImageUrl: iconImageUrl ?? '',
          displayedName: displayedName ?? '',
        };
        AjaxHelper.post(this.$axios, '/users/', requestBody);
      },
      async loginByGoogle() {
        if (!this.$fire) {
          throw new Error('Firebase client is unavailable');
        }
        const provider = new GoogleAuthProvider();
        // ストアへの反映は認証リスナーに集約し、古いログイン結果による上書きを防ぐ。
        await signInWithPopup(this.$fire.auth, provider)
          // ポップアップを閉じたときのエラー回避のためcatchを記載
          .catch((error) => error);
      },
      async logout() {
        if (!this.$fire) {
          throw new Error('Firebase client is unavailable');
        }
        await signOut(this.$fire.auth);
      },
    },
  },
);
