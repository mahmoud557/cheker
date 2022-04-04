window.serviceWorker_done_event=new Event('serviceWorker_done');
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async()=> {
  	var registration=await navigator.serviceWorker.register('sw.js')
  	console.log('ServiceWorker registration successful with scope: ', registration.scope);
 	window.dispatchEvent(window.serviceWorker_done_event)
  });

}

