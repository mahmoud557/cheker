const staticCacheName = 'site-static';
const assets = [
  '/app',
  '/styles/main_layout.css',
  '/styles/info_line.css',
  '/styles/globel.css',
  '/styles/allert_holder.css',
  "/icons/iknow_allert-72x72.png"
];


self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    }),
  );
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
    self.save_last_notification(data)
});

self.onnotificationclick = function(event) {
  /*console.log('On notification click: ', event);
  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/allert_node' && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow('/allert_node');
  }));*/
};


