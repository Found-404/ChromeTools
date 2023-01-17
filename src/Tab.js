class Tab {
  constructor(id) {
    this.id = id;
    this.url = null;
    this.listeners = [];

    chrome.tabs.onUpdated.addListener(this.handleUpdated);
    chrome.tabs.onRemoved.addListener(this.handleRemoved);
  }

  create = (createProperties) => {
    chrome.tabs.create(createProperties, (tab) => {
      this.id = tab.id
    })
  }

  update = (id, updateProperties) => {
    this.id = id;
    chrome.tabs.update(id, updateProperties);
  }

  reload = (id) => {
    this.id = id;
    chrome.tabs.reload(id);
  }

  handleUpdated = (id, changeInfo) => {
    // console.log("tab updated", id, this.id, changeInfo)
    if (this.id === id) {
      if (changeInfo.status === 'loading') {
        this.url = changeInfo.url;
      } else if (changeInfo.status === 'complete') {
        this.triggerEvent('updated', {
          id,
          url: this.url,
        })
      }
    }
  }

  handleRemoved = (id) => {
    if (id === this.id) {
      this.triggerEvent('removed');
      chrome.tabs.onUpdated.removeListener(this.handleUpdated);
      chrome.tabs.onRemoved.removeListener(this.handleRemoved);
      this.id = null;
      this.listeners = [];
    }
  }

  addListener = (name, listener) => {
    this.listeners.push({
      name,
      listener,
    });
  }

  removeListener = (name, listener) => {
    this.listeners = this.listeners.filter(v => !(v.name === name && v.listener === listener));
  }

  triggerEvent = (name, e) => {
    this.listeners.filter(v => v.name === name).forEach(v => v.listener(e));
  }

  destroy = () => {
    this.id = null;
    this.url = null;
    this.listeners = [];
    chrome.tabs.onUpdated.removeListener(this.handleUpdated);
    chrome.tabs.onRemoved.removeListener(this.handleRemoved);
  }
}

export default Tab
