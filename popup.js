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
  toogleSwitch(shorts, "shorts");
});

function toogleSwitch(elt, value) {
  let checkbox = elt.children[0];
  if (checkbox.checked) {
    feature[value] = true;
  } else {
    feature[value] = false;
    refresh();
  }

  updateFeatureData();
}

function refresh() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(tabs[0].id, {
        action: `refresh`,
      });
    }
  );
}
