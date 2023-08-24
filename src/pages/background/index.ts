import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

chrome.contextMenus.create({
  id: "debugger",
  title: "debugger",
});

chrome.contextMenus.create({
  id: "contentEditable",
  title: "contentEditable",
});

chrome.contextMenus.onClicked.addListener((e) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: e.menuItemId });
    }
  });
});
