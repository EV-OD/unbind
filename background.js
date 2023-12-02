let feature = {
  shorts: false,
  subscription: false,
};

chrome.webNavigation.onHistoryStateUpdated.addListener(
  function (details) {
    if (details.url && details.url.includes("/shorts/")) {
      chrome.tabs.update(details.tabId, { url: "https://www.youtube.com/" });
    }
  },
  { url: [{ urlMatches: "https://www.youtube.com/shorts/*" }] }
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Handle the message from the content script
  console.log("Message received in background:", request);

  // You can send a response back if needed
  sendResponse({ backgroundResponse: "Response from background" });
});
