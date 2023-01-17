const scriptName = 'injectBridge';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const {
    name,
  } = message;

  if (name === `vevor-ping-${scriptName}`) {
    sendResponse({
      name: `vevor-pong-${scriptName}`,
    });
  }
});

const body = document.querySelector('body');
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('pageBridge.js'));
body.appendChild(script);
