let loader = () => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  const fetchBookmarks = () => {};

  const newVideoLoaded = async () => {
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {});

  newVideoLoaded();
};

let bookmarks = [
  // {
  //   id: 1,
  //   folderName: "f1",
  //   bookmarks: [{ url: "lol", title: "test" }],
  // },
  // {
  //   id: 2,
  //   folderName: "f2",
  //   bookmarks: ["lol3", "lol4"],
  // },
];

function saveBookMarksToStorage() {
  console.log(1);
  chrome.storage.sync.set(
    {
      bookmarks: bookmarks,
    },
    () => {
      console.log("byw");
    }
  );
}

function getBookmarksFromStorage(func) {
  chrome.storage.sync.get(["bookmarks"], (result) => {
    if (result.bookmarks) {
      bookmarks = result.bookmarks;
    }
    notifyBookmarks();
    func(bookmarks);
  });
}

function notifyBookmarks() {
  chrome.runtime.sendMessage({
    type: "BOOKMARKS",
    data: bookmarks,
  });
}

function showModal() {
  getBookmarksFromStorage((bookmarksData) => {
    let options = "";
    bookmarksData.forEach((bookmark) => {
      options += `<option value="${bookmark.folderName}">${bookmark.folderName}</option>`;
    });
    let code = `
      <div class="modal">
      <div class="content">
      <h1>Add new bookmark</h1>
      <input class="bookmark__input" type="text" placeholder="Create new bookmark" />
      <span>OR Add to existing folder</span>
      <select class="folder__select" name="folders" id="folders">
      ${options}
      </select>
      <div class="action">
      <button class="save__btn">Save</button>
      <button class="cancel">Cancel</button>
      </div>
      </div>
      
      </div>
      <style>
      .modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        padding:5px;
      }
      .content {
        display: flex;
    background-color: white;
    flex-direction: column;
    padding: 10px;
    width: 350px;
    gap:10px;
      }
      .bookmark__input {
        border: 1px solid #a4a4a4;
    border-radius: 5px;
    padding-block: 10px;
      }
      .folder__select {
            border: 1px solid #a4a4a4;
    border-radius: 5px;
    padding-block: 10px;
      }
      .save__btn{
            padding: 10px;
    border-radius: 10px;
    border: none;
    padding-inline: 20px;
    background: #d8d8d8;
    cursor:pointer;
      }
      .cancel{
        padding: 10px;
    border-radius: 10px;
    border: none;
    padding-inline: 20px;
    color: white;
    background: #cb3a3a;
    cursor:pointer;
    margin-left:auto;
      }
      </style>
    `;
    let temp = document.createElement("div");
    temp.innerHTML = code;
    document.body.appendChild(temp);
    document.querySelector(".cancel").addEventListener("click", () => {
      closeModal();
    });
    document.querySelector(".save__btn").addEventListener("click", () => {
      let bookmarkName = document.querySelector(".bookmark__input").value;
      let folderName = document.querySelector(".folder__select").value;
      let count = bookmarks.length + 1;
      if (bookmarkName == "") {
        let f = bookmarks.filter((b) => b.folderName == folderName)[0];
        f.bookmarks.push({
          url: convertToShortUrl(location.href),
          title: getTitle(),
          id: f.bookmarks.length + 1,
        });
      } else {
        bookmarks.push({
          folderName: bookmarkName,
          bookmarks: [
            {
              url: convertToShortUrl(location.href),
              title: getTitle(),
              id: 1,
            },
          ],
          id: count,
        });
      }
      saveBookMarksToStorage();
      closeModal();
      console.log(bookmarks);
    });
  });
}

function getTitle() {
  return document.querySelector("h1.style-scope.ytd-watch-metadata").children[0]
    .innerText;
}

function closeModal() {
  let modal = document.getElementsByClassName("modal");
  modal[0].remove();
}

const addNewBookmarkEventHandler = () => {
  showModal();
};

loader();

function convertToShortUrl(longUrl) {
  let url = longUrl.substring(29, longUrl.length);
  const urlParams = new URLSearchParams(url);
  const videoId = urlParams.get("v");
  console.log(urlParams);

  return `https://youtu.be/${videoId}?t=${getCurrentTime()}`;
  //https://youtu.be/ZJI5NXlVhrU?t=5
}

function getCurrentTime() {
  let d = document.querySelector(".video-stream.html5-main-video");
  return parseInt(d.currentTime);
}
