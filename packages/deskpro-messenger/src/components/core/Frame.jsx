import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import FrameComponent from 'react-frame-component';

let head;

// in production env this the styles could be extracted only once when the app
// is starting and then this styles could be loaded inside each frame.
if (process.env.NODE_ENV === 'production') {
  const loaderIframe = window.parent.document.getElementById(
    'deskpro-widget-loader'
  );
  if (loaderIframe) {
    const styleLink = loaderIframe.contentDocument.head.querySelector(
      'link[rel="stylesheet"]'
    ).href;
    head = <link rel="stylesheet" href={styleLink} />;
  }
}

const defaultIframeStyle = {
  position: 'fixed',
  right: '14px',
  bottom: '14px',
  width: '50px',
  height: '50px'
};

const iFrameContainer = window.parent.document.getElementById(
  'deskpro-container'
);

class Frame extends PureComponent {
  constructor(...args) {
    super(...args);

    // in development mode styles are injected on the fly with HMR, so we need to
    // extract them on component rendering.
    if (process.env.NODE_ENV === 'development') {
      // pull css from all style tags because we might not know which one is
      // generated and inserted by webpack HMR.
      const style = Array.from(document.head.querySelectorAll('style'))
        .map(el => el.innerText)
        .join('\\n');
      head = <style type="text/css">{style}</style>;
    }

    this.el = window.parent.document.createElement('span');
  }

  componentDidMount() {
    iFrameContainer.appendChild(this.el);
  }

  componentWillUnmount() {
    iFrameContainer.removeChild(this.el);
  }

  render() {
    const { children, style = {}, ...props } = this.props;

    return ReactDOM.createPortal(
      <FrameComponent
        head={head}
        frameBorder="0"
        scrolling="no"
        style={{ ...defaultIframeStyle, ...style }}
        {...props}
      >
        {children}
      </FrameComponent>,
      this.el
    );
  }
}

export default Frame;
