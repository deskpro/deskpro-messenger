import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import asset from '../../utils/asset';
import { colorLuminance, isLightColor } from '../../utils/color';
import { UNSUPPORTED_TEXT_REGEX } from '../../utils/common';

export class TextAvatar extends React.Component {

  static propTypes = {
    width:       PropTypes.number,
    height:      PropTypes.number,
    text:        PropTypes.string,
    color:       PropTypes.string,
    borderColor: PropTypes.string,
    className:   PropTypes.string,
    title:       PropTypes.string,
    name:        PropTypes.string,
    user:        PropTypes.object
  };

  static defaultProps = {
    width:       32,
    height:      32,
    className:   '',
    color:       '#CDD2D4',
    borderColor: colorLuminance('#CDD2D4'),
    name:        ''
  };

  getStyle() {
    const { width, height } = this.props;
    return {
      width:          `${width}px`,
      height:         `${height}px`,
      backgroundSize: '100% 100%'
    };
  }

  geText() {
    const { name, user } = this.props;

    if (name === user.visitorId) {
      // use default avatar to avoid ugly text avatars
      return null;
    }

    if(UNSUPPORTED_TEXT_REGEX.test(name)) {
      return null;
    }

    let initials = "";

    const splits = name.split(" ");

    if (splits.length === 2) {
      initials += splits[0].charAt(0).toUpperCase();
      initials += splits[1].charAt(0).toUpperCase();
    } else if (splits.length === 3) {
      initials += splits[0].charAt(0).toUpperCase();
      initials += splits[2].charAt(0).toUpperCase();
    } else if (splits.length !== 0) {
      initials += splits[0].charAt(0).toUpperCase();
    }

    return initials || null;
  }

  getTextStyle() {
    const { width, height, color, borderColor } = this.props;

    const style = {
      width:      `${width}px`,
      height:     `${height}px`,
      lineHeight: `${height}px`,
      display:    'inline-block',
      textAlign:  'center',
      color:      !isLightColor(color) ? colorLuminance('#fff', -0.1) : '#4c4f50'
    };

    if (color) {
      style.backgroundColor = color;
    }
    if (borderColor) {
      style.borderColor = borderColor;
    }

    return style;
  }

  render() {
    const { className, name } = this.props;
    const text = this.geText();

    const spanProps = {
      style:     this.getStyle(),
      className: classNames(className, 'dpmsg-AvatarText')
    };

    if(!text) {
      return <img src={asset('img/docs/avatar-default.jpg')} alt={name} />
    }

    return (
      <span {...spanProps} >
        {text && <span className={classNames('dpmsg-AvatarText', className)} style={this.getTextStyle()}>{text}</span>}
      </span>
    );
  }
}

export default TextAvatar;
