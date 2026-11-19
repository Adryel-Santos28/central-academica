const C='central-v2';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request, u=new URL(req.url);
  if(req.method!=='GET'||u.origin!==location.origin) return;
  // HTML e dados: rede primeiro, cache só se estiver offline
  const vivo = req.mode==='navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('index.html') || u.pathname.endsWith('data.json');
  if(vivo){
    e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(req,c));return r}).catch(()=>caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const c=res.clone();caches.open(C).then(x=>x.put(req,c));return res})));
});
