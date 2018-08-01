import React, { Fragment, PureComponent } from 'react';

import Frame from './Frame';
import { ConfigConsumer } from './ConfigContext';

import RandomImageFrame from '../poc/ImageFrame';
import LoremIpsumFrame from '../poc/ArticleFrame';

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
  conversations: ({ category }) => (
    <Fragment>
      <h2>You Conversations</h2>
      <button onClick={() => console.log(`clicked ${category}`)}>
        Start {category} conversation
      </button>
    </Fragment>
  ),
  tickets: () => <h2>Your Tickets</h2>,
  search: () => <h2>Quick Search</h2>,
  contact_us: () => <h2>Contact Us</h2>
};

class WidgetWindow extends PureComponent {
  state = {
    imageVisible: false,
    articleVisible: false
  };

  toggleImageFrame = () =>
    this.setState({ imageVisible: !this.state.imageVisible });

  toggleLoremIpsum = () =>
    this.setState({ articleVisible: !this.state.articleVisible });

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

          <hr style={{ width: '250px', marginLeft: '-8px' }} />
          <button onClick={this.toggleImageFrame}>Show Random Image</button>
          <br />
          <button onClick={this.toggleLoremIpsum}>Show Lorem Ipsum</button>
          {this.state.imageVisible && <RandomImageFrame />}
          {this.state.articleVisible && <LoremIpsumFrame />}
        </div>
      </Frame>
    );
  }
}

export default WidgetWindow;
