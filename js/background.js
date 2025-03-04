// #region VARIABLE
const DEFAULT_CHANNEL_BLACKLIST = ["Fox News", "Fox Business"];

const BLOCKED_CHANNELS = "blockedChannels";
const GET_BLOCKED_CHANNELS = "getBlockedChannels";
const UPDATE_BLOCKED_CHANNELS = "updateBlockedChannels";
// #endregion

// #region SHARE DATA
chrome.storage.sync.set({ defaultChannelBlacklist: DEFAULT_CHANNEL_BLACKLIST });
chrome.storage.sync.set({ getBlockedChannels: GET_BLOCKED_CHANNELS });
chrome.storage.sync.set({ updateBlockedChannels: UPDATE_BLOCKED_CHANNELS });
// #endregion

// #region LISTENER
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(BLOCKED_CHANNELS, (result) => {
    if (!result.blockedChannels) {
      chrome.storage.local.set({ blockedChannels: [] });
    }
  });
});

// ...handle messages from 'popup.js'
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === GET_BLOCKED_CHANNELS) {
    getBlockedChannels((blockedChannels) => {
      sendResponse(blockedChannels);
    });

    // indicate sending response async
    return true;
  } else if (request.type === UPDATE_BLOCKED_CHANNELS) {
    updateBlockedChannels(request.channels);
    sendResponse({ success: true });
  }
});
// #endregion

// #region UTIL
function getBlockedChannels(callback) {
  chrome.storage.local.get(BLOCKED_CHANNELS, (result) => {
    callback(result.blockedChannels || []);
  });
}

function updateBlockedChannels(channels) {
  chrome.storage.local.set({ blockedChannels: channels });
}
// #endregion
