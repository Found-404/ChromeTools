window.addEventListener("message", function(event) {
  if (event.source != window) return;

  if (event.data.type === 'vevor_get_prop_from_window') {
    window.postMessage({
      type: `echo_${event.data.type}`,
      data: window[event.data.data]
    }, '*');
  }
}, false);