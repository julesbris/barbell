const CACHE='barbell-log-v2';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// network-first: always try for the latest deploy, fall back to cache when offline
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(new URL(e.request.url).pathname.indexOf('/.netlify/')===0)return;
  e.respondWith(
    fetch(e.request).then(resp=>{
      if(resp&&resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}
      return resp;
    }).catch(()=>caches.match(e.request))
  );
});
