let blockedSites = [];

browser.storage.local.get('sites').then((result) => {
  blockedSites = result.sites || [];
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.sites) {
    blockedSites = changes.sites.newValue || [];
  }
})

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    const isBlocked = blockedSites.some((site) => url.hostname.includes(site));

    if (isBlocked) {
      return { redirectUrl: browser.runtime.getURL('blocked.html') }
      }
  },
  { urls: ['https://*/*'], types: ['main_frame'] },
  ['blocking']
);
