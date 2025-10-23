

self.addEventListener('install', (event) => {
	console.log('Service worker install');

	self.skipWaiting();
})

self.addEventListener('activate', (event) => {
	console.log('Service worker active');

	event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
	console.log('Service worker push');

	const data = event.data ? event.data.json() : {};

	const title = data.title || 'kolok'

	const options = {
		body: data.body || `nouvelle notification`,
		icon: `./icon-192x192.png`,
		badge: `./icon-192x192.png`,
		data : {
			url: data.url || `/`,
		},
	}

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
	console.log('clique');

	event.notification.close();

	const urlToOpen = event.notification.data.url || `/`;

	event.waitUntil(
		self.clients.matchAll({type: `window`, includeUncontrolled: true})
			.then((clientList) => {
				for (let client of clientList)
					if (client.url.includes(urlToOpen) && `focus` in client)
						return client.focus()

				if (self.clients.openWindow)
					return self.clients.openWindow(urlToOpen)
			})
	)
})