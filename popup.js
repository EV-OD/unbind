let feature = {
  shorts: false,
};

function updateFeatureData() {
  // Call the setFeatureDataAndNotify function
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(tabs[0].id, {
        action: `updateFeatureData`,
        data: feature,
      });
    }
  );
}

// Attach an event listener to the button
document.getElementById("updateButton").addEventListener("click", () => {
  feature.shorts = true;
  updateFeatureData();
});
