import React, { PureComponent } from 'react';

import Frame from './Frame';
import { ConfigConsumer } from './ConfigContext';

/*const windowStyle = {
  height: '300px',
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};*/

const iframeStyle = {
  bottom: '54px',
  width: '250px',
  height: '350px',
  border: '1px solid',
  borderRadius: '5px',
  backgroundColor: '#fff'
};

const blocks = {
  conversations: () => <h2>You Conversations</h2>,
  tickets: () => <h2>Your Tickets</h2>,
  search: () => <h2>Quick Search</h2>,
  contact_us: () => <h2>Contact Us</h2>
};

class WidgetWindow extends PureComponent {
  render() {
    return (
      <Frame style={iframeStyle}>
        <div className="widget-window--container">
          <h1>Get In Touch!</h1>
          <ConfigConsumer>
            {({ features = [] }) =>
              features.map(({ type, options = {} }) => {
                const Component = blocks[type];
                return Component ? <Component key={type} {...options} /> : null;
              })
            }
          </ConfigConsumer>
        </div>
      </Frame>
    );
  }
}

export default WidgetWindow;
