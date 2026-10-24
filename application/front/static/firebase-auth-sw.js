const ignorePaths = ['/_nuxt/'];

importScripts(
  'https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth-compat.js',
);
firebase.initializeApp({
  apiKey: 'AIzaSyCPvuvm4wNrjLlpixP2xyUgsaYnIj2cub0',
  authDomain: 'no1-company-share.firebaseapp.com',
  projectId: 'no1-company-share',
  storageBucket: 'no1-company-share.appspot.com',
  messagingSenderId: '650436262386',
  appId: '1:650436262386:web:9a17e3aacca532fb82d36b',
  measurementId: 'G-ZJVQSKLGQ0',
});

const authService = firebase.auth();

/**
 * Returns a promise that resolves with an ID token if available.
 * @return {!Promise<?string>} The promise that resolves with an ID token if
 *     available. Otherwise, the promise resolves with null.
 */
const getIdToken = () => {
  return new Promise((resolve) => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        // force token refresh as it might be used to sign in server side
        user.getIdToken(true).then(
          (idToken) => {
            resolve(idToken);
          },
          () => {
            resolve(null);
          },
        );
      } else {
        resolve(null);
      }
    });
  });
};

const fetchWithAuthorization = async (original, idToken) => {
  // Clone headers as request headers are immutable.
  const headers = new Headers();
  for (const entry of original.headers.entries()) {
    headers.append(entry[0], entry[1]);
  }

  headers.set('Authorization', 'Bearer ' + idToken);

  const { url, ...props } = original.clone();
  const authorized = new Request(url, {
    ...props,
    mode: 'same-origin',
    redirect: 'manual',
    headers,
  });

  return await fetch(authorized);
};

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  const expectsHTML = (event.request.headers.get('accept') || '').includes(
    'text/html',
  );

  const isSameOrigin = self.location.origin === url.origin;
  const isHttps =
    self.location.protocol === 'https:' ||
    self.location.hostname === 'localhost' ||
    self.location.hostname === '127.0.0.1';

  const isIgnored = ignorePaths.some((path) => url.pathname.startsWith(path));

  // https://github.com/nuxt-community/firebase-module/issues/465
  if (!expectsHTML || !isSameOrigin || !isHttps || isIgnored) {
    return;
  }

  // Fetch the resource after checking for the ID token.
  event.respondWith(
    getIdToken().then((idToken) =>
      idToken
        ? // if the token was retrieved we attempt an authorized fetch
          // if anything goes wrong we fall back to the original request
          fetchWithAuthorization(event.request, idToken).catch(() =>
            fetch(event.request),
          )
        : // otherwise we return a fetch of the original request directly
          fetch(event.request),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
