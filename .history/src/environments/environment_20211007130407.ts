// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: "https://apps.valuenow.net/valuenowappserver/api/",
  //api_url: "http://15.184.143.244/valuenowappserver/api/",
  web_url: "https://apps.valuenow.net/valuenowappserver/",
  //web_url: "http://15.184.143.244/valuenowappserver/",
  google_client_id: "836929904795-mfqto6sis0787q7jqlp6ktmum4i8g5eh.apps.googleusercontent.com",
  facebook_client_id: "197802258821224",
  recaptch_site_key: "6LdvQNUUAAAAACCcwl-vc2BClrqsZQh0ZYvn3qjZ",
  SOCKET_ENDPOINT: 'https://apps.valuenow.net:3000',
  firebase: {
    apiKey: "AIzaSyB8M811NSeAYosmadEMW1x9NcMZ_a_51xg",
    authDomain: "valuenowlive.firebaseapp.com",
    databaseURL: "https://valuenowlive.firebaseio.com",
    projectId: "valuenowlive",
    storageBucket: "valuenowlive.appspot.com",
    messagingSenderId: "589054181975",
    appId: "1:589054181975:web:f5390fb70e433f9dcad912",
    measurementId: "G-NWWFEHJZ9F"
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
