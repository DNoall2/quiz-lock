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
    browser.storage.local.set({ blockedUrl: url.href });
    const isBlocked = blockedSites.some((site) => url.hostname.includes(site));

    if (isBlocked) {
      return { redirectUrl: browser.runtime.getURL('blocked.html') }
    }
  },
  { urls: ['https://*/*'], types: ['main_frame'] },
  ['blocking']
);

browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({ url: browser.runtime.getURL('index.html') });
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'redirect-to-url') {
    if (sender.tab && sender.tab.id) {
      browser.tabs.update(sender.tab.id, { url: message.url });
    }
  }
});
