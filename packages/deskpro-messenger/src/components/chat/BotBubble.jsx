import React from 'react';
import PropTypes from 'prop-types';
import asset from '../../utils/asset';
import Isvg from 'react-inlinesvg';
import classNames from 'classnames';

class BotBubble extends React.Component {

  render() {
    const { message } = this.props;
    const headerImage = 'img/dp-logo-white.svg';
    return (
      <div className="dpmsg-MessageBubbleRow dpmsg-BotMessage is-incoming">
        <div className="dpmsg-AvatarCol is-rounded">
          {
            headerImage.substr(-3) === 'svg'
              ? <Isvg src={asset(headerImage)} alt="" />
              : <img src={asset(headerImage)} alt="" />
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

export default BotBubble;
