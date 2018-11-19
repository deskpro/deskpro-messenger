function loadConfig(helpdeskUrl) {
  // const configUrl = `${helpdeskUrl}/api/messenger/config.json`;
  const configUrl = `${helpdeskUrl}config.json`;

  return fetch(configUrl)
    .then((res) => res.json())
    .then((adminConfig) => {
      const config = {
        helpdeskUrl,
        ...adminConfig,
        ...window.DESKPRO_MESSENGER_OPTIONS
      };
      window.DESKPRO_MESSENGER_OPTIONS = config;
      return config;
    });
}

function setupFrames(config) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('id', 'deskpro-messenger-iframe');
  iframe.style.display = 'none';
  iframe.style.border = 'none';
  iframe.style.background = 'transparent';
  document.body.appendChild(iframe);

  const container = document.createElement('div');
  container.setAttribute('id', 'deskpro-container');
  container.style.position = 'fixed';
  container.style.bottom = 0;
  container.style.right = 0;
  container.style.width = 0;
  container.style.height = 0;
  container.style.zIndex = 9999999;
  document.body.appendChild(container);

  const iframeDoc = iframe.contentDocument;

  const initialContent = `<!DOCTYPE html><html>
  <head></head>
  <body>
    <script src="${config.bundleUrl}"></script>
  </body></html>`;
  iframeDoc.open('text/html', 'replace');
  iframeDoc.write(initialContent);
  iframeDoc.close();
}

function init() {
  const scriptTag = document.getElementById('dp-messenger-loader');
  const hdUrl = scriptTag.dataset.helpdeskUrl;

  return loadConfig(hdUrl).then(setupFrames);
}

(function() {
  if (window.attachEvent) {
    window.attachEvent('onload', init);
  } else {
    window.addEventListener('load', init, false);
  }
})();
