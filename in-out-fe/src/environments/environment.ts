// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiUrl:
    'https://us-central1-in-out-7-298618.cloudfunctions.net/webApi/api/v1/',
  firebaseConfig: {
    apiKey: 'AIzaSyAo_ftC8lT1RWECnOMLDEzFzaw2o9kanCE',
    authDomain: 'in-out-7-298618.firebaseapp.com',
    projectId: 'in-out-7-298618',
    storageBucket: 'in-out-7-298618.appspot.com',
    messagingSenderId: '597095722436',
    appId: '1:597095722436:web:b80386c4e152caed3f8891',
  },
  hospitalRedirectUrl: 'http://localhost:4200/hospital/login',
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
