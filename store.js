function sendMessageToBackground(message, callback) {
  chrome.runtime.sendMessage(message, callback);
}

function setFeatureDataAndNotify(featureData, callback) {
  chrome.storage.local.set({ feature: featureData }, function () {
    // Notify content scripts about the data change
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, {
          action: "featureDataChanged",
          data: featureData,
        });
      });
    });

    if (callback) {
      callback();
    }
  });
}

// Function to get feature data from the common store
function getFeatureData(callback) {
  chrome.storage.local.get("feature", function (result) {
    callback(result.feature || {});
  });
}
