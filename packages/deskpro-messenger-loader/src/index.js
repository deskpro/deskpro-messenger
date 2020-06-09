import transformConfig from './transformConfig';
import deepmerge from 'deepmerge';

function loadConfig(helpdeskURL) {
  const configUrl = `${helpdeskURL}/api/messenger/service/setup`;

  return fetch(configUrl)
    .then((res) => res.json())
    .then((adminConfig) => {
      const { bundleUrl } = adminConfig;
      const config = deepmerge({
        bundleUrl,
        helpdeskURL,
        ...transformConfig(adminConfig),
      }, window.DESKPRO_MESSENGER_OPTIONS);


      if(bundleUrl.isDev) {
        config.isDev = true;
      }
      if(typeof window.DESKPRO_MESSENGER_OPTIONS !== 'undefined' && window.DESKPRO_MESSENGER_OPTIONS.language) {
        config.language = { ...adminConfig.language, ...window.DESKPRO_MESSENGER_OPTIONS.language };
      }
      window.DESKPRO_MESSENGER_OPTIONS = config;
      return config;
    });
}

function setupFrames(config, manifest) {
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

  const assets = manifest.entrypoints.main.js.map((fileName) => {
      let host = '';
      if (!config.bundleUrl.isDev) {
        host = `${config.bundleUrl.isAbsolute ? '' : config.helpdeskURL}${config.bundleUrl.path}`;
      }

      const final = `${host.replace(/\/$/, "")}${host ? '/' : ''}${fileName.replace(/^\//, "")}`;
      return `<script async src="${final}"></script>`;
    }
  ).join("\n");

  const initialContent = `<!DOCTYPE html><html>
  <head>
    {config.bundleUrl.isDev ? '<script>
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    </script>' : '' }
  </head>
  <body>
    ${assets}
  </body></html>`;
  iframeDoc.open('text/html', 'replace');
  iframeDoc.write(initialContent);
  iframeDoc.close();
}

function init() {
  const scriptTag = document.getElementById('dp-messenger-loader');
  const hdUrl = window.DESKPRO_MESSENGER_OPTIONS.helpdeskURL;
  return loadConfig(hdUrl).then((config) => {
    fetch(`${config.bundleUrl.isDev || config.bundleUrl.isAbsolute ? '' : config.helpdeskURL}${config.bundleUrl.manifest}`)
      .then((res) => res.json())
      .then((manifest) => {
        setupFrames(config, manifest);
      });

  });
}

(function() {
  if (window.attachEvent) {
    window.attachEvent('onload', init);
  } else {
    window.addEventListener('load', init, false);
  }
})();
