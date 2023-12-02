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
let shorts = document.querySelector("#shorts");
shorts.addEventListener("click", () => {
  feature.shorts = true;
  let checkbox = shorts.children[0];
  if (checkbox.checked) {
    checkbox.checked = false;
    feature.shorts = true;
  } else {
    checkbox.checked = true;
    feature.shorts = false;
  }
  updateFeatureData();
});
