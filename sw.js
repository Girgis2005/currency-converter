const CACHE_NAME = "gesr-shell-v3";
const SHARE_CACHE = "gesr-share";
const SHELL_FILES = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== SHARE_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Android's share sheet POSTs here (see share_target in manifest.json). We can't
// hand the payload to the page directly, so we park it in a cache the page reads
// on startup, then redirect to the app with ?shared=1.
async function handleShare(request) {
  try {
    const form = await request.formData();
    const text = [form.get("title"), form.get("text"), form.get("url")]
      .filter((v) => typeof v === "string" && v.trim())
      .join("\n")
      .trim();

    const cache = await caches.open(SHARE_CACHE);
    await cache.put("/__share_text", new Response(text));

    const file = (form.getAll("image") || []).find((f) => f && f.size);
    if (file) {
      await cache.put(
        "/__share_file",
        new Response(file, { headers: { "Content-Type": file.type || "image/png" } })
      );
    } else {
      await cache.delete("/__share_file");
    }
  } catch (e) {
    // A failed share must still land the user in the app rather than on an error page.
  }
  return Response.redirect(new URL("./?shared=1", self.location).href, 303);
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === "POST" && url.pathname.endsWith("/share")) {
    event.respondWith(handleShare(event.request));
    return;
  }

  const isShellFile = url.origin === self.location.origin;
  if (!isShellFile) return; // let cross-origin calls (translation, OCR, TTS) go straight to network
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
