/* 泛进店选人 · 静态资源缓存 Service Worker
 * 策略：页面导航网络优先（保证拿到最新版），静态资源缓存优先 + 后台更新（stale-while-revalidate）
 * 效果：首次加载后，刷新/再次访问基本秒开；数据文件更新后下一次刷新自动生效。
 * 发布新版本时只需递增 CACHE 版本号即可让旧缓存失效。
 */
const CACHE = 'fjd-picker-v13';
const ASSETS = [
  './', 'index.html', 'styles.css', 'xlsx.full.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // CDN / 抖音图片等跨域资源不拦截

  // 页面导航：网络优先，失败回退缓存
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('index.html', copy));
        return res;
      }).catch(() => caches.match('index.html'))
    );
    return;
  }

  // 静态资源：缓存优先（秒开），后台静默更新
  e.respondWith(
    caches.match(req).then((hit) => {
      const fetching = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || fetching;
    })
  );
});
