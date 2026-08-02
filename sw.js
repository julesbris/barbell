const CACHE='barbell-log-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.open(CACHE).then(cache=>
      cache.match(e.request).then(hit=>
        hit || fetch(e.request).then(resp=>{try{cache.put(e.request,resp.clone());}catch(_){}return resp;}).catch(()=>hit)
      )
    )
  );
});