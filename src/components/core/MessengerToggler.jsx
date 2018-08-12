import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Frame from './Frame';

/*const buttonStyle = {
  width: '150px',
  alignSelf: 'flex-end',
  border: '1px solid',
  borderRadius: '2px',
  padding: '5px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#ddd'
};*/

const iframeStyle = {
  position: 'fixed',
  right: '14px',
  bottom: '14px',
  width: '60px',
  height: '60px'
};

class WidgetToggler extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const opened = this.props.location.pathname.startsWith('/screens');

    return (
      <Frame style={iframeStyle}>
        <Link
          className={classNames(`dpmsg-TriggerBtn is-blue`)}
          to={opened ? '/' : '/screens'}
        >
          {opened ? (
            <i className="dpmsg-Icon dpmsg-IconClose" />
          ) : (
            <i className="dpmsg-Icon dpmsg-IconChat" />
          )}
        </Link>
      </Frame>
    );
  }
}

export default WidgetToggler;
