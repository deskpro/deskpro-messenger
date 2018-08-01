import React from 'react';

import Frame from '../core/Frame';

const iframeStyle = {
  bottom: 'auto',
  top: '20px',
  left: '20px',
  width: '400px',
  height: '250px'
};

const ImageFrame = () => (
  <Frame style={iframeStyle}>
    <img src="https://picsum.photos/400/250?random" alt="random gallery" />
  </Frame>
);

export default ImageFrame;
