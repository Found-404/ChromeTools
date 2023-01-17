import {
  executeScript,
  sendMessage,
} from './utils';

chrome.runtime.onInstalled.addListener(() => {
  const name = "download-walmart-fee";

  async function run(tabId) {
    await executeScript(tabId, 'injectBridge');
    await executeScript(tabId, name);
    const data = await sendMessage(tabId, name, {});

    console.log('run done', data);
  }
  
  chrome.tabs.query({
    url: 'https://seller.walmart.ca/*',
  }, ([{ id }]) => {
    run(id).catch(e => {
      console.log('run error', e);
    });
  })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("chrome.runtime.onMessage", message, new Date().getTime());
  if (message.name === 'vevor-web-request-oncompleted') {
    
    function onCompletedhandler(details) {
      console.log("webRequest completed", details, new Date().getTime());
      chrome.webRequest.onCompleted.removeListener(onCompletedhandler);
      sendResponse(details);
    }

    console.log("vevor-web-request-oncompleted addListener", message.url, new Date().getTime());
    chrome.webRequest.onCompleted.addListener(
      onCompletedhandler,
      {
        urls: [message.url]
      }
    )
  } else if (message.name === 'vevor-tabs-onupdated') {
    function onUpdatedhandler(id, changeInfo, tab) {
      console.log("vevor-tabs-onupdated onUpdatedhandler", sender.tab.id, id, changeInfo, new Date().getTime());
      if (sender.tab.id === id && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(onUpdatedhandler);
        sendResponse(id, changeInfo, tab);
      }
    }

    console.log("vevor-tabs-onupdated addListener", sender.tab.id, new Date().getTime());
    chrome.tabs.onUpdated.addListener(onUpdatedhandler);
  }

  return true;
});

