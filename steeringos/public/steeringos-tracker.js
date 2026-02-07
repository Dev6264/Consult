(function () {
  var apiKey = "demo-key-acme";
  var endpoint = "http://localhost:3000/api/collect";

  function sendEvent(type, path) {
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        type: type,
        sessionId: "magento-session-" + Math.random().toString(36).slice(2),
        path: path,
        device: /Mobi/i.test(navigator.userAgent) ? "mobile" : "desktop",
        referrer: document.referrer
      })
    }).catch(function () {
      // TODO: add retry queue for offline support.
    });
  }

  sendEvent("visit", window.location.pathname);

  window.SteeringOS = {
    track: sendEvent
  };
})();
