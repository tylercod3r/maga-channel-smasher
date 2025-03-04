// #region VARIABLE
// TODO - below also appear in 'background.js'; how to fix? (efficeintly)
const GET_BLOCKED_CHANNELS = "getBlockedChannels";

const QUERY_VIDEO =
  "ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer";
const QUERY_CHANNEL = "#byline-container yt-formatted-string";
// #endregion

// #region METHOD
function init() {
  filterYouTubeVideos();
}

function filterYouTubeVideos() {
  chrome.runtime.sendMessage(
    { type: GET_BLOCKED_CHANNELS },
    (blockedChannels) => {
      const videoElements = document.querySelectorAll(QUERY_VIDEO);
      videoElements.forEach((videoElement) => {
        const channelElement = videoElement.querySelector(QUERY_CHANNEL);
        if (channelElement) {
          const channelName = channelElement.textContent.trim().toLowerCase();
          if (
            blockedChannels.some((blockedChannel) =>
              channelName.toLowerCase().includes(blockedChannel.toLowerCase())
            )
          ) {
            // hide
            videoElement.style.display = "none";
          }
        }
      });
    }
  );
}
// #endregion

// #region INIT
// run when page loads
window.addEventListener("load", init);

// handle infinite scroll
const observer = new MutationObserver(filterYouTubeVideos);
observer.observe(document.body, { childList: true, subtree: true });
// #endregion
