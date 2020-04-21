// eslint-disable-next-line func-names
const AJAXSubmit = (function () {
  function submitData(oData, config) {
    /* the AJAX request... */
    const oAjaxReq = new XMLHttpRequest();
    oAjaxReq.submittedData = oData;

    if (config.updateProgress) {
      oAjaxReq.addEventListener('progress', config.updateProgress);
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
    oAjaxReq.responseType = 'json';
    oAjaxReq.open('post', oData.receiver, true);
    /* enctype is multipart/form-data */
    const sBoundary = `---------------------------${Date.now().toString(16)}`;
    oAjaxReq.setRequestHeader('Content-Type', `multipart/form-data; boundary=${sBoundary}`);
    if (config.requestHeaders) {
      for (const [name, value] of Object.entries(config.requestHeaders)) {
        oAjaxReq.setRequestHeader(name, value);
      }
    }
    oAjaxReq.send(`--${sBoundary}\r\n${
      oData.segments.join(`--${sBoundary}\r\n`)}--${sBoundary}--\r\n`);
  }

  function processStatus(oData, config = {}) {
    if (oData.status > 0) { return; }
    /* the form is now totally serialized! do something before sending it to the server... */
    // /* doSomething(oData); */
    // /* console.log("AJAXSubmit - The form is now serialized. Submitting..."); */
    submitData(oData, config);
  }

  function pushSegment(oFREvt) {
    this.owner.segments[this.segmentIdx] += `${oFREvt.target.result}\r\n`;
    this.owner.status = this.owner.status - 1;
    processStatus(this.owner, this.config);
  }

  function SubmitRequest(config) {
    this.receiver = config.url;
    this.status = 0;
    this.segments = [];
    for (let nFile = 0; nFile < config.files.length; nFile++) {
      const oFile = config.files[nFile];
      const oSegmReq = new FileReader();
      /* (custom properties:) */
      oSegmReq.segmentIdx = this.segments.length;
      oSegmReq.owner = this;
      oSegmReq.config = config;
      /* (end of custom properties) */
      oSegmReq.onload = pushSegment;
      this.segments.push(`Content-Disposition: form-data; name="file"; filename="${oFile.name}"\r\nContent-Type: ${oFile.type}\r\n\r\n`);
      this.status = this.status + 1;
      oSegmReq.readAsBinaryString(oFile);
    }
    this.segments.push(`Content-Disposition: form-data;`);
    processStatus(this, config);
  }

  // eslint-disable-next-line func-names
  return function (config) {
    if (!config.url) { return; }
    new SubmitRequest(config);
  };
}());

export default AJAXSubmit;
