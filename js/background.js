// #region VARIABLE
const DEFAULT_CHANNEL_BLACKLIST = [
  "Fox News",
  "Fox Business",
  "LiveNOW from FOX",
  "Ben Shapiro",
  "JRE Clips",
  "PowerfulJRE",
  "PBD Podcast",
  "Adin Live",
  "The Andrew Shulz",
  "FLAGRANT",
  "NELK",
  "Logan Paul",
  "Lex Fridman",
  "Shawn Ryan Show",
  "Theo Von",
  "Candace Owens",
];

const BLOCKED_CHANNELS = "blockedChannels";
const GET_BLOCKED_CHANNELS = "getBlockedChannels";
const UPDATE_BLOCKED_CHANNELS = "updateBlockedChannels";
// #endregion

// #region SHARE DATA
chrome.storage.sync.set({ defaultChannelBlacklist: DEFAULT_CHANNEL_BLACKLIST });
// #endregion

// #region LISTENER
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(BLOCKED_CHANNELS, (result) => {
    chrome.storage.local.set({ blockedChannels: DEFAULT_CHANNEL_BLACKLIST });
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
