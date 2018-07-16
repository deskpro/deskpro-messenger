(function() {
  function loadIframe() {
    var options = window.DESKPRO_WIDGET_OPTIONS || {};
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', options.widgetUrl + '/index.html');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.style.display = 'block';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '14px';
    iframe.style.right = '14px';
    iframe.style.zIndex = '99999';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';

    document.body.appendChild(iframe);
  }

  if (window.attachEvent) {
    window.attachEvent('onload', loadIframe);
  } else {
    window.addEventListener('load', loadIframe, false);
  }
})();
