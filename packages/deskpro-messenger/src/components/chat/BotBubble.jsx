import React from 'react';
import PropTypes from 'prop-types';
import asset from '../../utils/asset';
import Isvg from 'react-inlinesvg';
import { ConfigConsumer } from '../core/ConfigContext';

class BotBubble extends React.Component {

  static propTypes = {
    icon: PropTypes.string,
  };

  static defaultProps = {
    icon: ''
  }

  render() {
    const { message, icon } = this.props;
    const headerImage       = icon || 'img/dp-logo-white.svg';
    return (
      <div className="dpmsg-MessageBubbleRow dpmsg-BotMessage is-incoming">
        <div className="dpmsg-AvatarCol is-rounded">
          {
            headerImage.substr(-3) === 'svg'
              ? <Isvg src={asset(headerImage)} alt=""/>
              : <img src={asset(headerImage)} alt=""/>
          }
        </div>
        <div className="dpmsg-BubbleCol">
          <div className="dpmsg-BubbleItem">
            {message}
          </div>

        </div>
      </div>
    );
  }
}

BotBubble.propTypes = {
  message: PropTypes.string,
};

const BotBubbleWithConfig = (props) => (
  <ConfigConsumer>
    {({ widget }) =>
      <BotBubble
        icon={widget.icon.download_url}
        {...props}
      />}
  </ConfigConsumer>
);

export default BotBubbleWithConfig;
