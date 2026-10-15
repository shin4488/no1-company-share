import type { Pinia } from 'pinia';
import { useFirebaseAuthorizationStore } from './firebaseAuthorization';
import { useSnackBarErrorStore } from './snackBarError';
import { useSnackBarInfoStore } from './snackBarInfo';
import { useSpinnerOverlayStore } from './spinnerOverlay';

export const createAccessor = (pinia: Pinia) => ({
  firebaseAuthorization: useFirebaseAuthorizationStore(pinia),
  snackBarError: useSnackBarErrorStore(pinia),
  snackBarInfo: useSnackBarInfoStore(pinia),
  spinnerOverlay: useSpinnerOverlayStore(pinia),
});

export type Accessor = ReturnType<typeof createAccessor>;
