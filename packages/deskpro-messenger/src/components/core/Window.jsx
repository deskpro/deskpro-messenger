import React, { PureComponent } from 'react';
import { MemoryRouter, Switch, Route, Link } from 'react-router-dom';

import Frame from './Frame';

import IndexScreen from '../screens/IndexScreen';
import ChatScreen from '../screens/ChatScreen';
import TicketsScreen from '../screens/TicketsScreen';

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
        <MemoryRouter>
          <div className="widget-window--container">
            <h1>Get In Touch!</h1>

            <Route>
              {({ location, history }) =>
                location.pathname.length > 1 && (
                  <Link
                    to={`#`}
                    onClick={e => {
                      e.preventDefault();
                      history.goBack();
                    }}
                  >
                    &lt; back
                  </Link>
                )
              }
            </Route>

            <hr style={{ width: '250px', marginLeft: '-8px' }} />

            <Switch>
              <Route path="/conversations/:category" component={ChatScreen} />
              <Route path="/tickets" component={TicketsScreen} />
              <Route component={IndexScreen} />
            </Switch>

            <hr style={{ width: '250px', marginLeft: '-8px' }} />
            <button onClick={this.toggleImageFrame}>Show Random Image</button>
            <br />
            <button onClick={this.toggleLoremIpsum}>Show Lorem Ipsum</button>
            {this.state.imageVisible && <RandomImageFrame />}
            {this.state.articleVisible && <LoremIpsumFrame />}
          </div>
        </MemoryRouter>
      </Frame>
    );
  }
}

export default WidgetWindow;
