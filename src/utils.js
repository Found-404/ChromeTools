export async function executeScript(tabId, name, path = '') {
  const executed = await new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, {
      name: `vevor-ping-${name}`
    }, message => {
      if (chrome.runtime.lastError) {
        console.log("executeScript error", tabId, name, chrome.runtime.lastError);
        resolve(false);
      } else {
        resolve(message.name === `vevor-pong-${name}`);
      }
    })
  })

  if (!executed) {
    await new Promise(resolve => {
      // console.log('executeScript', tabId, `${path}${name}.js`);
      chrome.tabs.executeScript(tabId, {
        file: `${path}${name}.js`
      }, () => {
        // console.log('executeScript lastError', chrome.runtime.lastError);
        resolve();
      })
    })
  }
}

export async function sendMessage(tabId, name, data) {
  const result = await new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, {
      name: `vevor-${name}`,
      data,
    }, message => {
      if (chrome.runtime.lastError) {
        console.log("sendMessage error", tabId, name, chrome.runtime.lastError);
        reject(new Error(`sendMessage ${name} on tab ${tabId} error: ${chrome.runtime.lastError.message}`));
      } else if (message.name === `echo_vevor-${name}`) {
        resolve(message.data);
      }
    })
  })
  
  return result;
}
