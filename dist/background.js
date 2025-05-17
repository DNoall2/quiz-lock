let blockedSites = [];

browser.storage.local.get('sites').then((result) => {
  blockedSites = result.sites || [];
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.sites) {
    blockedSites = changes.sites.newValue || [];
  }
});

browser.webRequest.onBeforeRequest.addListener(
  async function (details) {
    const stored = await browser.storage.local.get(['temporarilyAllowed']);
    const temporarilyAllowed = stored.temporarilyAllowed || [];

    const url = new URL(details.url);
    const domain = url.hostname;

    const isBlocked = blockedSites.some((site) => domain.includes(site));
    const isTemporarilyAllowed = temporarilyAllowed.some((site) => details.url.startsWith(site));
    console.log(`[webRequest] Blocked: ${isBlocked}, Allowed: ${isTemporarilyAllowed}`);

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
