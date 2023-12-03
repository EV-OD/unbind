let feature = {
  shorts: false,
  subscription: false,
  hideComment: false,
};

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   alert("hello");
//   if (request.action == "localStorageReady") {
//     feature = request.data;
//     makeSwitch(shorts, feature.shorts);
//   }
// });
chrome.storage.sync.get("feature", (result) => {
  if (result.feature) {
    feature = result.feature;
  }
  makeSwitch(shorts, result.feature.shorts);
  makeSwitch(subscription, result.feature.subscription);
  makeSwitch(hideComment, result.feature.hideComment);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.type == "BOOKMARKS") {
    console.log(request);
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

let hideComment = document.querySelector("#comment");

hideComment.addEventListener("click", () => {
  toogleSwitch(hideComment, "hideComment");
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

window.onload = () => {
  chrome.storage.sync.get("bookmarks", (result) => {
    console.log(result);
    if (result.bookmarks) {
      addBookmark(result.bookmarks);
    }
  });
};

function addBookmark(folders) {
  folders.forEach((folder) => {
    addFolder(folder);
  });
}

function addFolder(folder) {
  let fold = "";
  let bookmarkT = "";
  folder.bookmarks.forEach((bom) => {
    bookmarkT += `
      <a href='${bom.url}'>${bom.title}</a>
      `;
  });
  let code = `
            <div class="f1 fold">
            <div class="head">
              <h6>${folder.folderName}</h6>
              <button class="expand-btn">⌄</button>
            </div>
            <div class="content hidden">
                  ${bookmarkT}
            </div>
          </div>
  `;
  console.log(code);
  let f = document.querySelector(".folders");
  f.innerHTML += code;
  let btns = document.querySelectorAll(".expand-btn");
  let anchorTag = document.querySelectorAll(".content a");
  anchorTag.forEach((a) => {
    if (!a.onclick) {
      a.onclick = (e) => {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.update(tabs[0].id, { url: a.href });
          }
        );
      };
    }
  });
  btns.forEach((btn) => {
    console.log(btn);
    if (!btn.onclick) {
      btn.onclick = (e) => {
        console.log(btn.parentElement);
        let content = btn.parentElement.parentElement.querySelector(".content");
        if (content.classList.contains("hidden")) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }
      };
    }
  });
}
