let blockedSites = [];
let cleanupInterval = null;

browser.storage.local.get('sites').then((result) => {
  blockedSites = result.sites || [];
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.sites) {
    blockedSites = changes.sites.newValue || [];
  }
});

function cleanExpiredSites() {
  browser.storage.local.get('temporarilyAllowed').then((result) => {
    const now = Date.now();
    if (!Array.isArray(result.temporarilyAllowed)) return;

    const updated = result.temporarilyAllowed.filter((entry) => {
      return typeof entry === 'object' && entry.expiresAt > now;
    });

    if (updated.length !== result.temporarilyAllowed.length) {
      browser.storage.local.set({ temporarilyAllowed: updated });
    }
  });
}

if (!cleanupInterval) {
  cleanupInterval = setInterval(cleanExpiredSites, 60 * 1000);
}


browser.webRequest.onBeforeRequest.addListener(
  async function (details) {
    const [stored, sitesResult] = await Promise.all([
      browser.storage.local.get(['temporarilyAllowed']),
      browser.storage.local.get(['sites']),
    ]);

    const temporarilyAllowed = stored.temporarilyAllowed || [];
    const sites = sitesResult.sites || [];

    const url = new URL(details.url);
    const domain = url.hostname;

    const isBlocked = sites.some((site) => {
      const siteObj = typeof site === 'string' ? { name: site, enabled: true } : site;
      return siteObj.enabled !== false && domain.includes(siteObj.name);
    });
    
    const isTemporarilyAllowed = temporarilyAllowed.some((site) => {
      return typeof site === 'object' && details.url.startsWith(site.url) && site.expiresAt > Date.now();
    });

    if (isBlocked && !isTemporarilyAllowed) {
      await browser.storage.local.set({ blockedUrl: details.url });
      return { redirectUrl: browser.runtime.getURL('blocked.html') };
    }

    return {};
  },
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['blocking'],
);

browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({ url: browser.runtime.getURL('index.html') });
});
