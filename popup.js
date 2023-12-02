let feature = {
  shorts: false,
  subscription: false,
};

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   alert("hello");
//   if (request.action == "localStorageReady") {
//     feature = request.data;
//     makeSwitch(shorts, feature.shorts);
//   }
// });
chrome.storage.sync.get("feature", (result) => {
  if(result.feature){
    feature = result.feature;
  }
  makeSwitch(shorts, result.feature.shorts);
  makeSwitch(subscription, result.feature.subscription);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == "BOOKMARKS") {
    alert("hello");
    sendResponse({ data: feature });
  }
});

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

let subscription = document.querySelector("#subscription");

subscription.addEventListener("click", () => {
  toogleSwitch(subscription, "subscription");
});

function toogleSwitch(elt, value) {
  let checkbox = elt.children[0];
  if (checkbox.checked) {
    feature[value] = true;
  } else {
    feature[value] = false;
    // refresh();
  }

  updateFeatureData();
}

function makeSwitch(elt, value) {
  let inputId = "flexSwitchCheckDefault";
  if (value) {
    inputId = "flexSwitchCheckChecked";
  }
  elt.children[0].id = inputId;
  elt.children[0].checked = value;
  elt.children[1].for = inputId;
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
