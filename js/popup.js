// #region VARIABLE
// TODO - below also appear in 'background.js'; how to fix? (efficeintly)
const BLOCKED_CHANNELS = "blockedChannels";
const GET_BLOCKED_CHANNELS = "getBlockedChannels";
const UPDATE_BLOCKED_CHANNELS = "updateBlockedChannels";

const DEFAULT_BUTTON_LABEL = "Default";
const REMOVE_BUTTON_LABEL = "Remove";

const QUERY_VIDEO =
  "ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer";
const QUERY_CHANNEL = "#byline-container yt-formatted-string";

const channelInput = document.getElementById("channelInput");
const addChannelBtn = document.getElementById("addChannelBtn");
const blockedChannelsList = document.getElementById("blockedChannelsList");

let defaultChannelBlackList;
// #endregion

// #region GET DATA
chrome.storage.sync.get(["defaultChannelBlacklist"], function (result) {
  defaultChannelBlackList = result.defaultChannelBlacklist;
});
// #endregion

// #region METHOD
function updateBlockedChannelsList() {
  // fetch current blocked channels (f/ 'background.js')
  chrome.runtime.sendMessage(
    { type: GET_BLOCKED_CHANNELS },
    (blockedChannels) => {
      // clear list before updating
      blockedChannelsList.innerHTML = "";
      // add 'user' channels
      for (let i = 0; i < blockedChannels.length; i++) {
        let channel = blockedChannels[i];
        const li = document.createElement("li");
        li.innerHTML = `
          <span style="padding-right: 10px;">${channel}</span>
          <button class="remove-btn">${REMOVE_BUTTON_LABEL}</button>
        `;

        // add "remove" click handler
        li.querySelector(".remove-btn").addEventListener("click", () =>
          removeChannel(channel)
        );

        blockedChannelsList.appendChild(li);
      }
    }
  );
}

function addChannel(customChannel = "") {
  const channel =
    customChannel.length > 0 ? customChannel : channelInput.value.trim();

  // only add channel if - 1. not empty + 2. not already blocked
  if (channel) {
    chrome.runtime.sendMessage(
      { type: GET_BLOCKED_CHANNELS },
      (blockedChannels) => {
        if (!blockedChannels.includes(channel)) {
          blockedChannels.push(channel);
          chrome.runtime.sendMessage({
            type: UPDATE_BLOCKED_CHANNELS,
            channels: blockedChannels,
          });
          updateBlockedChannelsList();
        }
      }
    );
    channelInput.value = "";
  }
}

function removeChannel(channel) {
  chrome.runtime.sendMessage(
    { type: GET_BLOCKED_CHANNELS },
    (blockedChannels) => {
      const newBlockedChannels = blockedChannels.filter((c) => c !== channel);
      chrome.runtime.sendMessage({
        type: UPDATE_BLOCKED_CHANNELS,
        channels: newBlockedChannels,
      });
      updateBlockedChannelsList();
    }
  );
}
// #endregion

// #region INIT
addChannelBtn.addEventListener("click", addChannel);
updateBlockedChannelsList();
// #endregion
