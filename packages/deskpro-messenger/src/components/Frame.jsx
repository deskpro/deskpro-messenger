import React from 'react';
import FrameComponent from 'react-frame-component';

const loaderIframe = window.parent.document.getElementById(
  'deskpro-widget-loader'
);
const styleLink = loaderIframe
  ? loaderIframe.contentDocument.head.querySelector('link[rel="stylesheet"]')
      .href
  : null;

const defaultIframeStyle = {
  position: 'fixed',
  right: '14px',
  bottom: '14px',
  width: '50px',
  height: '50px'
};

const Frame = ({ children, style = {}, ...props }) => {
  return (
    <FrameComponent
      head={!!styleLink && <link rel="stylesheet" href={styleLink} />}
      frameBorder="0"
      scrolling="no"
      style={{ ...defaultIframeStyle, ...style }}
      {...props}
    >
      {children}
    </FrameComponent>
  );
};

export default Frame;
