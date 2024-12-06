 
const AJAXSubmit = (function () {
  function submitData(oData, config) {
    /* the AJAX request... */
    const oAjaxReq = new XMLHttpRequest();
    oAjaxReq.submittedData = oData;

    if (config.updateProgress) {
      oAjaxReq.upload.addEventListener('progress', config.updateProgress);
    }
    if (config.transferComplete) {
      oAjaxReq.addEventListener('load', config.transferComplete);
    }
    if (config.transferFailed) {
      oAjaxReq.addEventListener('error', config.transferFailed);
    }
    if (config.transferCanceled) {
      oAjaxReq.addEventListener('abort', config.transferCanceled);
    }

    oAjaxReq.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status >= 400) {
          let message = this.statusText;
          if (this.response && this.response.errors && this.response.errors.file) {
            message = this.response.errors.file;
          }
          config.transferFailed({
            code: this.status,
            message
          });
        }
      }
    }

    oAjaxReq.withCredentials = true;
    /* method is POST */
    oAjaxReq.onloadstart = function() {
        oAjaxReq.responseType = 'json';
    };
    oAjaxReq.open('post', oData.receiver, true);
    if (config.requestHeaders) {
      for (const [name, value] of Object.entries(config.requestHeaders)) {
        oAjaxReq.setRequestHeader(name, value);
      }
    }
    oAjaxReq.send(oData.formData);
  }

  function processStatus(oData, config = {}) {
    submitData(oData, config);
  }

  function SubmitRequest(config) {
    this.receiver = config.url;
    this.formData = null;
    for (let nFile = 0; nFile < config.files.length; nFile++) {
      const oFile = config.files[nFile];
      this.formData = new FormData();
      this.formData.append('file', oFile);
      processStatus(this, config);
    }

  }

   
  return function (config) {
    if (!config.url) { return; }
    new SubmitRequest(config);
  };
}());

export default AJAXSubmit;
