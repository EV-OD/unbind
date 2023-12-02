const styleTag = document.createElement("style");
const styleContents = document.createTextNode(`
ytd-mini-guide-entry-renderer[aria-label="Shorts"],
ytd-rich-section-renderer,
ytd-reel-shelf-renderer ,
[title="Shorts"]  {
     display: none; 
    }
`);
styleTag.appendChild(styleContents);
document.body.prepend(styleTag);

let feature = {
  shorts: false,
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Handle the message from the content script
  console.log("Message received in background:", request);
  feature = request.data;
  updateUnBind();

  // You can send a response back if needed
  sendResponse({ backgroundResponse: "Response from background" });
});

function updateUnBind() {
  removeUIElements();
}

function removeUIElements() {
  if (feature.shorts) {
    // Remove the Shorts button from the sidebar
    const shortsButton = document.querySelector(
      'ytd-mini-guide-entry-renderer[aria-label="Shorts"]'
    );
    if (shortsButton) {
      shortsButton.remove();
    }

    // Remove the Shorts carousel drawer
    const carousels = document.querySelectorAll(
      "ytd-rich-section-renderer, ytd-reel-shelf-renderer"
    );
    carousels.forEach((carousel) => {
      // Add specific condition to target Shorts carousel if needed
      carousel.remove();
    });

    const otherShortsButtons = document.querySelectorAll('[title="Shorts"]');
    otherShortsButtons.forEach((node) => node.remove());

    let shortArea = findShortsAnchors();
    shortArea.forEach((elt) => {
      elt.parentElement.parentElement.parentElement.remove();
    });
  }
}

// Remove the UI elements on initial page load

// Use a MutationObserver to handle dynamic content/AJAX
const observer = new MutationObserver((mutations) => {
  let shouldRemoveElements = false;
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      shouldRemoveElements = true;
      break;
    }
  }

  if (shouldRemoveElements) {
    removeUIElements();
  }
});

// Start observing the target node for configured mutations
observer.observe(document.body, { childList: true, subtree: true });

function findShortsAnchors() {
  // Get all anchor tags on the page
  var allAnchors = document.querySelectorAll("a");

  // Filter anchors with href starting with "/shorts/"
  var shortsAnchors = Array.from(allAnchors).filter(function (anchor) {
    return (
      anchor.getAttribute("href") &&
      anchor.getAttribute("href").startsWith("/shorts/")
    );
  });

  return shortsAnchors;
}
