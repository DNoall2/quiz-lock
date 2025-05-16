let blockedSites = [];

browser.storage.local.get('sites').then((result) => {
  blockedSites = result.sites || [];
  console.log('[Extension] Loaded blocked sites:', blockedSites);
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.sites) {
    blockedSites = changes.sites.newValue || [];
    console.log('[Extension] Updated blocked sites:', blockedSites);
  }
})

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    const isBlocked = blockedSites.some((site) => url.hostname.includes(site));

    console.log(`[Extension] Checking ${url.hostname}: Blocked = ${isBlocked}`);

    if (isBlocked) {
      const redirect = browser.runtime.getURL('blocked.html');
      console.log(`[Extension] Redirecting to ${redirect}`);
      return { redirectUrl: redirect }
      }
  },
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['blocking']
);
