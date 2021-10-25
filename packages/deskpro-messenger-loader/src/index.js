import transformConfig from './transformConfig';
import deepmerge from 'deepmerge';

function loadConfig(helpdeskURL, brandId) {

  let configUrl = `${helpdeskURL}/api/messenger/service/setup`;
  const options = {};
  if(brandId) {
    options.headers = {['X-DESKPRO-BRANDID']: brandId}
  }

  return fetch(configUrl, options)
    .then((res) => res.json())
    .then((adminConfig) => {
      const { bundleUrl } = adminConfig;

      const overrides = {};
      ['widget', 'chat', 'kbEnabled', 'tickets', 'language', 'proactive', 'maxFileSize'].forEach((name) => {
        if(typeof window.DESKPRO_MESSENGER_OPTIONS[name] !== 'undefined') {
          overrides[name] = window.DESKPRO_MESSENGER_OPTIONS[name];
        }
      });

      let host = '';
      if (!adminConfig.bundleUrl.isDev) {
        host = `${adminConfig.bundleUrl.isAbsolute ? '' : helpdeskURL}${adminConfig.bundleUrl.baseUrl}`;
        bundleUrl.baseUrl = host;
      }
      bundleUrl.manifestHost = host;

      const config = deepmerge({
        bundleUrl,
        helpdeskURL,
        ...transformConfig(deepmerge(adminConfig, overrides)),
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
      const host = window.DESKPRO_MESSENGER_OPTIONS.bundleUrl.manifestHost;
      const final = `${host.replace(/\/$/, "")}${host ? '/' : ''}${fileName.replace(/^\//, "")}`;
      const stag = iframeDoc.createElement('script');
      stag.src = final;
      stag.async = true;
      return stag;
    }
  );
  iframeDoc.open('text/html', 'replace');
  iframeDoc.close();
  iframeDoc.documentElement.innerHTML = `<!DOCTYPE html><html>
  <head>
    ${config.bundleUrl.isDev ? '<script>window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;</script>' : '' }
  </head>
  <body>
  </body></html>`;


  assets.forEach(tag => iframeDoc.head.appendChild(tag));
}

function init() {
  if(window.DESKPRO_MESSENGER_LOADED) {
    return;
  }
  window.DESKPRO_MESSENGER_LOADED = true;
  let hdUrl = window.DESKPRO_MESSENGER_OPTIONS.helpdeskURL;
  const { brandId } = window.DESKPRO_MESSENGER_OPTIONS;
  if(hdUrl.search(/(\/b\/.+\/?)/) && brandId) {
    hdUrl = hdUrl.replace(/(\/b\/.+\/?)/, '');
    window.DESKPRO_MESSENGER_OPTIONS.helpdeskURL = hdUrl;
  }
  return loadConfig(hdUrl, brandId).then((config) => {
    fetch(`${config.bundleUrl.isDev || config.bundleUrl.isAbsolute ? '' : config.helpdeskURL}${config.bundleUrl.manifest}`)
      .then((res) => res.json())
      .then((manifest) => {
        setupFrames(config, manifest);
      });

  });
}

window.DESKPRO_MESSENGER_INIT = init;

(function() {
  if(typeof window.DESKPRO_MESSENGER_LOADED === 'undefined') {
    if (window.attachEvent) {
      window.attachEvent('onload', init);
    } else {
      window.addEventListener('load', init, false);
    }
  }
})();
