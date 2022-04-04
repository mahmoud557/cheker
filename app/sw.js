const staticCacheName = 'site-static';
const assets = [
  '/app',
  '/index.html',
  '/styles/main_layout.css',
  '/styles/info_line.css',
  '/styles/globel.css',
  '/styles/allert_holder.css',
  "/manifest.json",
  "/componant/left.js",
  "/componant/right.js",
  "/componant/top.js",
  "/componant/bottom.js",
  "/componant/c-icon.js",
  "/componant/switsh_bt.js",
  "/componant/info_line.js",
  "/componant/allert_holder.js",
  "/js/manager_main_layout.js",
  "/js/manager_pwa.js",
  "/icons/iknow_allert-144x144.png"
];


self.addEventListener('install', evt => {
  /*evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    }),
  );*/
});

// activate event
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    console.log('service worker activated',self),
    ) 
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);

    })
  );
});

self.addEventListener("push", e => {
    const data = e.data.json();
    self.registration.showNotification(
        data.title, // title of the notification
        {
            body:data.body,
            image: "/img/icons/iknow_allert-72x72.png",
            icon: "/img/icons/iknow_allert-152x152.png", // icon
            vibrate:[400,300,400],
        }
    );
});
/*
self.onnotificationclick = function(event) {
  console.log('On notification click: ', event);
  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/app' && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow('/app');
  }));
};
*/

