import React, { PureComponent } from 'react';
import Frame from './Frame';

/*const windowStyle = {
  height: '300px',
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};*/

const iframeStyle = {
  bottom: '54px',
  width: '200px',
  height: '300px',
  border: '1px solid',
  borderRadius: '5px',
  backgroundColor: '#fff'
};

class WidgetWindow extends PureComponent {
  render() {
    return (
      <Frame style={iframeStyle}>
        <div className="widget-window--container">
          <h1>Hello World!</h1>
        </div>
      </Frame>
    );
  }
}

export default WidgetWindow;
