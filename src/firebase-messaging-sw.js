
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
        .then(function (registration) {
            console.log('Registration successful, scope is:', registration.scope);
        }).catch(function (err) {
            console.log('Service worker registration failed, error:', err);
        });
}



importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js');
/*Update this config*/
var config = {
    apiKey: "AIzaSyB8M811NSeAYosmadEMW1x9NcMZ_a_51xg",
    authDomain: "valuenowlive.firebaseapp.com",
    databaseURL: "https://valuenowlive.firebaseio.com",
    projectId: "valuenowlive",
    storageBucket: "valuenowlive.appspot.com",
    messagingSenderId: "589054181975",
    appId: "1:589054181975:web:f5390fb70e433f9dcad912",
    measurementId: "G-NWWFEHJZ9F"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: 'assets/icons/apple-touch-icon.png',
        image: 'assets/icons/apple-touch-icon.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});