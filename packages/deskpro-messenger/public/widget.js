(function() {
  function loadIframe() {
    var options = window.DESKPRO_WIDGET_OPTIONS || {};

    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('id', 'deskpro-widget-loader');
    iframe.style.display = 'none';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    document.body.appendChild(iframe);

    var container = document.createElement('div');
    container.setAttribute('id', 'deskpro-container');
    container.style.position = 'fixed';
    container.style.bottom = 0;
    container.style.right = 0;
    container.style.width = 0;
    container.style.height = 0;
    container.style.zIndex = 9999999;
    document.body.appendChild(container);

    var iframeDoc = iframe.contentDocument;

    var initialContent =
      '<!DOCTYPE html><html><head><!-- INJECT ASSETS --></head><body></body></html>';
    initialContent = initialContent.replace(/{HOST}/g, options.widgetUrl);
    iframeDoc.open('text/html', 'replace');
    iframeDoc.write(initialContent);
    iframeDoc.close();
  }

  if (window.attachEvent) {
    window.attachEvent('onload', loadIframe);
  } else {
    window.addEventListener('load', loadIframe, false);
  }
})();
