async function findWebsite() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url = tabs[0].url;
      resolve(new URL(url));
    });
  });
}

function extractWebsiteName(url) {
  var withoutProtocol = url.replace(/^https?:\/\//, "");
  var withoutWWW = withoutProtocol.replace(/^www\./, "");

  var parts = withoutWWW.split(".");

  if (parts.length === 2 && parts[1] === "com") {
    return parts[0];
  }

  var websiteName = parts.length >= 2 ? parts[1] : parts[0];

  return websiteName;
}
